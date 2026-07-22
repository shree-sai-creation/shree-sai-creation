import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import getDb from "@/lib/db";
import { requireAdmin, withSecurity, logApiResponse } from "@/lib/middleware";
import { CHECKOUT_RATE_LIMIT } from "@/lib/rateLimit";
import { getAuthUser } from "@/lib/middleware";
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

  // Rate limit: 3 orders per minute per IP
  const securityError = withSecurity(req, CHECKOUT_RATE_LIMIT);
  if (securityError) return securityError;

  try {
    const body = await req.json();
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
    const db = getDb();

    const authUser = getAuthUser(req);

    let orderNumber = generateOrderNumber();
    while (db.prepare("SELECT id FROM orders WHERE order_number = ?").get(orderNumber)) {
      orderNumber = generateOrderNumber();
    }

    const { shippingAddress } = data;

    const orderResult = db
      .prepare(
        `INSERT INTO orders (
          order_number, user_id, guest_email, status,
          full_name, email, phone,
          address_line1, address_city, address_state, address_pincode, address_country,
          subtotal, discount_amount, tax, shipping, grand_total,
          payment_method, notes
        ) VALUES (?, ?, ?, 'Pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        orderNumber,
        authUser?.id ?? null,
        authUser ? null : (data.email || shippingAddress.email),
        shippingAddress.fullName,
        shippingAddress.email,
        shippingAddress.phone,
        shippingAddress.line1,
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.pincode,
        shippingAddress.country,
        data.subtotal,
        data.discountAmount,
        data.tax,
        data.shipping,
        data.grandTotal,
        data.paymentMethod,
        data.notes
      );

    const orderId = orderResult.lastInsertRowid;

    const insertItem = db.prepare(
      `INSERT INTO order_items (order_id, product_id, product_name, product_image, unit_price, quantity, selected_finish)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    );

    for (const item of data.cartItems) {
      insertItem.run(
        orderId,
        item.productId,
        item.productName,
        item.productImage,
        item.unitPrice,
        item.quantity,
        item.selectedFinish
      );
    }

    logApiResponse(req, 201, startTime);
    return NextResponse.json(
      { message: "Order placed successfully", orderNumber, orderId },
      { status: 201 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("checkout/create-order", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
