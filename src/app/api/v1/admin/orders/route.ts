import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin, withSecurity, logApiResponse } from "@/lib/middleware";
import { GENERAL_RATE_LIMIT } from "@/lib/rateLimit";
import { OrderStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const securityError = withSecurity(req, GENERAL_RATE_LIMIT);
  if (securityError) return securityError;

  const authResult = requireAdmin(req);
  if ("error" in authResult) {
    logApiResponse(req, 403, startTime);
    return authResult.error;
  }

  try {
    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 200);
    const offset = Math.max(parseInt(searchParams.get("offset") || "0"), 0);

    const whereClause: Record<string, unknown> = {};

    if (status && status !== "All") {
      const upperStatus = status.toUpperCase();
      if (Object.values(OrderStatus).includes(upperStatus as OrderStatus)) {
        whereClause.status = upperStatus as OrderStatus;
      }
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    const total = await prisma.order.count({ where: whereClause });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({
      orders,
      total,
      limit,
      offset,
    });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/orders/GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/v1/admin/orders — Clear all orders for fresh start
export async function DELETE(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");

    if (orderId) {
      await prisma.order.delete({ where: { id: orderId } });
      logApiResponse(req, 200, startTime);
      return NextResponse.json({ message: "Order deleted successfully" });
    }

    // Clear all orders atomically
    await prisma.order.deleteMany({});
    logApiResponse(req, 200, startTime);
    return NextResponse.json({ message: "All orders cleared successfully for fresh start" });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/orders/DELETE", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
