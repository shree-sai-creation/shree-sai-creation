import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, withSecurity, logApiResponse } from "@/lib/middleware";
import { GENERAL_RATE_LIMIT } from "@/lib/rateLimit";
import { OrderStatus } from "@prisma/client";

const VALID_STATUSES = ["Pending", "Crating", "Shipped", "Delivered", "Cancelled"] as const;

const StatusSchema = z.object({
  status: z.enum(VALID_STATUSES),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const securityError = withSecurity(req, GENERAL_RATE_LIMIT);
  if (securityError) return securityError;

  const authResult = requireAdmin(req);
  if ("error" in authResult) {
    logApiResponse(req, 403, startTime);
    return authResult.error;
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = StatusSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const existing = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!existing) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const targetStatus = parsed.data.status.toUpperCase() as OrderStatus;
    const isNowCancelled = targetStatus === "CANCELLED" || targetStatus === "REFUNDED";
    const wasCancelled = existing.status === "CANCELLED" || existing.status === "REFUNDED";

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id },
        data: { status: targetStatus },
      });

      // Restore stock if transitioning to CANCELLED/REFUNDED for the first time
      if (isNowCancelled && !wasCancelled) {
        for (const item of existing.items) {
          let variant = null;
          if (item.variantId) {
            variant = await tx.productVariant.findUnique({
              where: { id: item.variantId },
              include: { inventory: true },
            });
          }
          if (!variant) {
            variant = await tx.productVariant.findFirst({
              where: { productId: item.productId },
              include: { inventory: true },
            });
          }

          if (variant && variant.inventory) {
            const inv = variant.inventory;
            const newQty = inv.quantity + item.quantity;

            await tx.inventory.update({
              where: { id: inv.id },
              data: { quantity: newQty },
            });

            await tx.inventoryLog.create({
              data: {
                inventoryId: inv.id,
                variantId: variant.id,
                previousQuantity: inv.quantity,
                newQuantity: newQty,
                changeAmount: item.quantity,
                type: "RESTORE",
                reason: `Order #${existing.orderNumber} status changed to ${targetStatus}`,
                orderId: existing.id,
                userId: authResult.user.id,
              },
            });
          }
        }
      }
    });

    // Non-blocking Status Change Email Notification
    if (targetStatus === "SHIPPED" || targetStatus === "DELIVERED" || targetStatus === "CANCELLED") {
      import("@/lib/email").then(({ sendOrderStatusEmail }) => {
        sendOrderStatusEmail(
          { orderNumber: existing.orderNumber, fullName: existing.fullName, email: existing.email },
          targetStatus
        ).catch((e) => console.error("Order status email error:", e));
      }).catch((e) => console.error("Email module load error:", e));
    }

    logApiResponse(req, 200, startTime);
    return NextResponse.json({
      message: "Order status updated and stock processed",
      status: parsed.data.status,
    });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/orders/[id]/status/PUT", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
