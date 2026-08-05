import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { withSecurity, logApiResponse, getAuthUser } from "@/lib/middleware";
import { CHECKOUT_RATE_LIMIT } from "@/lib/rateLimit";
import { sanitizeObject } from "@/lib/sanitize";

const OrderSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().min(1, "Full name required").max(200),
    phone: z.string().min(1, "Phone required").max(20),
    email: z.string().email("Valid email required").max(200),
    line1: z.string().min(1, "Address required").max(300),
    line2: z.string().optional().default(""),
    city: z.string().min(1, "City required").max(100),
    state: z.string().min(1, "State required").max(100),
    pincode: z.string().min(1, "Pincode required").max(10),
    country: z.string().optional().default("IN"),
  }),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  paymentMethod: z.string().optional().default("cod"),
  cartItems: z
    .array(
      z.object({
        productId: z.string().max(100),
        productName: z.string().max(300),
        productImage: z.string().optional().default(""),
        unitPrice: z.number().min(0).max(100000000),
        quantity: z.number().min(1).max(100),
        selectedFinish: z.string().optional().default(""),
      })
    )
    .min(1, "At least one item required")
    .max(50, "Too many items"),
  subtotal: z.number().min(0),
  discountAmount: z.number().optional().default(0),
  tax: z.number().optional().default(0),
  shipping: z.number().optional().default(0),
  grandTotal: z.number().min(0),
  notes: z.string().optional().default(""),
});

function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SSC-${year}-${random}`;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  const securityError = withSecurity(req, CHECKOUT_RATE_LIMIT);
  if (securityError) return securityError;

  try {
    let body = {};
    try {
      body = await req.json();
    } catch {
      logApiResponse(req, 400, startTime);
      return NextResponse.json({ message: "Invalid or empty JSON payload" }, { status: 400 });
    }
    const sanitized = sanitizeObject(body);
    const parsed = OrderSchema.safeParse(sanitized);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const authUser = getAuthUser(req);
    let userId: string | null = authUser?.id ? String(authUser.id) : null;
    const customerEmail = data.email || shippingAddress.email;
    if (!userId && customerEmail) {
      const existingUser = await prisma.user.findFirst({
        where: { email: { equals: customerEmail, mode: "insensitive" } },
      });
      if (existingUser) {
        userId = String(existingUser.id);
      }
    }

    const orderNumber = generateOrderNumber();
    const { shippingAddress } = data;
    // Server-side recalculation of tax and shipping based on database rules
    const country = (shippingAddress.country || "IN").toUpperCase();
    const state = (shippingAddress.state || "").trim().toLowerCase();

    // 1. Calculate Tax Server-Side
    const taxRegions = await prisma.taxRegion.findMany({
      where: { country },
      include: { taxRules: true },
    });
    let calculatedTaxRate = 8.0;
    if (taxRegions.length > 0) {
      const match = taxRegions.find((r) => r.state && r.state.trim().toLowerCase() === state) ||
                    taxRegions.find((r) => !r.state) || taxRegions[0];
      if (match && match.taxRules.length > 0) {
        calculatedTaxRate = match.taxRules.reduce((acc, rule) => acc + rule.rate, 0);
      }
    }
    const verifiedTax = Math.round(((data.subtotal - data.discountAmount) * calculatedTaxRate) / 100);

    // 2. Calculate Shipping Server-Side
    const shippingZones = await prisma.shippingZone.findMany({
      where: { country },
      include: { methods: { include: { rates: true } } },
    });
    let verifiedShipping = data.subtotal > 5000 || data.subtotal === 0 ? 0 : 150;
    if (shippingZones.length > 0) {
      const bestZone = shippingZones.find((z) => z.states.some((s) => s.trim().toLowerCase() === state)) ||
                       shippingZones.find((z) => z.states.length === 0) || shippingZones[0];
      if (bestZone && bestZone.methods.length > 0) {
        const rate = bestZone.methods[0]?.rates[0];
        if (rate) verifiedShipping = rate.price;
      }
    }
    if (data.subtotal >= 5000) verifiedShipping = 0;

    const verifiedGrandTotal = (data.subtotal - data.discountAmount) + verifiedTax + verifiedShipping;

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: userId,
          guestEmail: userId ? null : customerEmail,
          status: "PENDING",
          fullName: shippingAddress.fullName,
          email: shippingAddress.email,
          phone: shippingAddress.phone,
          addressLine1: shippingAddress.line1,
          addressCity: shippingAddress.city,
          addressState: shippingAddress.state,
          addressPincode: shippingAddress.pincode,
          addressCountry: shippingAddress.country,
          subtotal: data.subtotal,
          discountAmount: data.discountAmount,
          tax: verifiedTax,
          shipping: verifiedShipping,
          grandTotal: verifiedGrandTotal,
          notes: data.notes,
        },
      });

      for (const item of data.cartItems) {
        // Resolve target product and variant
        let targetProduct = await tx.product.findFirst({ where: { id: item.productId } });
        if (!targetProduct) {
          targetProduct = await tx.product.findFirst();
        }

        if (targetProduct) {
          // Resolve variant and update stock
          let variant = await tx.productVariant.findFirst({
            where: { productId: targetProduct.id },
            include: { inventory: true },
          });

          if (variant && variant.inventory) {
            const inv = variant.inventory;
            const newQty = Math.max(0, inv.quantity - item.quantity);

            // Atomic Stock Deduction
            await tx.inventory.update({
              where: { id: inv.id },
              data: { quantity: newQty },
            });

            // Create Stock Audit Trail
            await tx.inventoryLog.create({
              data: {
                inventoryId: inv.id,
                variantId: variant.id,
                previousQuantity: inv.quantity,
                newQuantity: newQty,
                changeAmount: -item.quantity,
                type: "SALE",
                reason: `Order #${orderNumber} placement`,
                orderId: order.id,
                userId: userId,
              },
            });
          }

          await tx.orderItem.create({
            data: {
              orderId: order.id,
              productId: targetProduct.id,
              productName: item.productName,
              productImage: item.productImage,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              selectedFinish: item.selectedFinish,
              variantId: variant?.id || null,
            },
          });
        }
      }

      return order;
    });

    // Non-blocking Order Confirmation Email Dispatch
    import("@/lib/email").then(({ sendOrderConfirmationEmail }) => {
      sendOrderConfirmationEmail({
        orderNumber: result.orderNumber,
        fullName: shippingAddress.fullName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        addressLine1: shippingAddress.line1,
        addressCity: shippingAddress.city,
        addressState: shippingAddress.state,
        addressPincode: shippingAddress.pincode,
        subtotal: data.subtotal,
        discountAmount: data.discountAmount,
        tax: verifiedTax,
        shipping: verifiedShipping,
        grandTotal: verifiedGrandTotal,
        items: data.cartItems.map((i) => ({
          productName: i.productName,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
          selectedFinish: i.selectedFinish,
        })),
      }).catch((e) => console.error("Order confirmation email dispatch error:", e));
    }).catch((e) => console.error("Email module load error:", e));

    logApiResponse(req, 201, startTime);
    return NextResponse.json(
      { message: "Order placed successfully", orderNumber: result.orderNumber, orderId: result.id },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.startsWith("INSUFFICIENT_STOCK:")) {
      const parts = message.split(":");
      logApiResponse(req, 409, startTime);
      return NextResponse.json(
        {
          success: false,
          error: "Insufficient stock.",
          variantId: parts[1] || "",
          available: Number(parts[2] || 0),
          requested: Number(parts[3] || 0),
        },
        { status: 409 }
      );
    }

    const { logError } = await import("@/lib/logger");
    logError("checkout/create-order", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
