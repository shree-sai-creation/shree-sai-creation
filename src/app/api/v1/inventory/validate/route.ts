import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { logApiResponse } from "@/lib/middleware";

const InventoryValidateSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      variantId: z.string().optional().default(""),
      quantity: z.number().min(1, "Quantity must be at least 1"),
    })
  ).min(1, "At least one item required"),
});

// POST /api/v1/inventory/validate — Public read-only stock validation
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const parsed = InventoryValidateSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { items } = parsed.data;

    for (const item of items) {
      // Find variant by variantId or default variant of product
      let variant = null;
      if (item.variantId) {
        variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
          include: { inventory: true, product: { select: { name: true } } },
        });
      }

      if (!variant) {
        variant = await prisma.productVariant.findFirst({
          where: { productId: item.productId },
          include: { inventory: true, product: { select: { name: true } } },
        });
      }

      if (!variant || !variant.isActive) {
        logApiResponse(req, 409, startTime);
        return NextResponse.json(
          {
            success: false,
            error: "Product variant is unavailable or inactive.",
            variantId: item.variantId || item.productId,
            available: 0,
            requested: item.quantity,
          },
          { status: 409 }
        );
      }

      const inv = variant.inventory;
      const quantity = inv ? inv.quantity : 0;
      const reserved = inv ? inv.reserved : 0;
      const available = Math.max(0, quantity - reserved);

      if (available < item.quantity) {
        logApiResponse(req, 409, startTime);
        return NextResponse.json(
          {
            success: false,
            error: "Insufficient stock.",
            variantId: variant.id,
            productName: variant.product.name,
            available,
            requested: item.quantity,
          },
          { status: 409 }
        );
      }
    }

    logApiResponse(req, 200, startTime);
    return NextResponse.json({
      success: true,
      message: "Stock validated successfully",
    });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("inventory/validate POST", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json(
      { message: "Failed to validate inventory stock" },
      { status: 500 }
    );
  }
}
