import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

// GET /api/v1/admin/analytics/overview — Dashboard Statistics & Revenue Metrics
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    const validOrderWhere = {
      status: { notIn: ["CANCELLED" as const, "REFUNDED" as const] },
    };

    // Parallel Database Query Aggregations
    const [
      orderStatusCounts,
      totalOrdersCount,
      todayRevAgg,
      weeklyRevAgg,
      monthlyRevAgg,
      yearlyRevAgg,
      totalRevAgg,
      totalProducts,
      activeProducts,
      inventories,
      totalCustomers,
      newCustomers,
    ] = await Promise.all([
      // 1. Order Status Counts
      prisma.order.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      // 2. Total Orders Count
      prisma.order.count(),
      // 3. Today Revenue
      prisma.order.aggregate({
        where: { ...validOrderWhere, createdAt: { gte: startOfToday } },
        _sum: { grandTotal: true },
      }),
      // 4. Weekly Revenue
      prisma.order.aggregate({
        where: { ...validOrderWhere, createdAt: { gte: sevenDaysAgo } },
        _sum: { grandTotal: true },
      }),
      // 5. Monthly Revenue
      prisma.order.aggregate({
        where: { ...validOrderWhere, createdAt: { gte: thirtyDaysAgo } },
        _sum: { grandTotal: true },
      }),
      // 6. Yearly Revenue
      prisma.order.aggregate({
        where: { ...validOrderWhere, createdAt: { gte: oneYearAgo } },
        _sum: { grandTotal: true },
      }),
      // 7. Total All-Time Revenue
      prisma.order.aggregate({
        where: validOrderWhere,
        _sum: { grandTotal: true },
      }),
      // 8. Total Products
      prisma.product.count(),
      // 9. Active Products
      prisma.product.count({ where: { isActive: true } }),
      // 10. Inventories for Low/Out of Stock Metrics
      prisma.inventory.findMany({
        select: { quantity: true, reserved: true, lowStockThreshold: true },
      }),
      // 11. Total Customers
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      // 12. New Customers (last 30 days)
      prisma.user.count({
        where: { role: "CUSTOMER", createdAt: { gte: thirtyDaysAgo } },
      }),
    ]);

    // Process Order Status Map
    const statusMap: Record<string, number> = {
      PENDING: 0,
      CRATING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };
    orderStatusCounts.forEach((group) => {
      statusMap[group.status] = group._count.id;
    });

    // Process Stock Metrics
    let lowStockProducts = 0;
    let outOfStockProducts = 0;
    inventories.forEach((inv) => {
      const available = inv.quantity - inv.reserved;
      if (available <= 0) {
        outOfStockProducts++;
      } else if (available <= inv.lowStockThreshold) {
        lowStockProducts++;
      }
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({
      orders: {
        total: totalOrdersCount,
        pending: statusMap["PENDING"] || 0,
        processing: statusMap["CRATING"] || 0,
        shipped: statusMap["SHIPPED"] || 0,
        delivered: statusMap["DELIVERED"] || 0,
        cancelled: statusMap["CANCELLED"] || 0,
      },
      revenue: {
        today: todayRevAgg._sum.grandTotal || 0,
        weekly: weeklyRevAgg._sum.grandTotal || 0,
        monthly: monthlyRevAgg._sum.grandTotal || 0,
        yearly: yearlyRevAgg._sum.grandTotal || 0,
        total: totalRevAgg._sum.grandTotal || 0,
      },
      products: {
        total: totalProducts,
        active: activeProducts,
        lowStock: lowStockProducts,
        outOfStock: outOfStockProducts,
      },
      customers: {
        total: totalCustomers,
        new: newCustomers,
        returning: Math.max(0, totalCustomers - newCustomers),
      },
    });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/analytics/overview GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch analytics overview" }, { status: 500 });
  }
}
