import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

// GET /api/v1/admin/analytics/sales — Daily/Monthly Sales Reports & Revenue Trends
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);

    const validOrderWhere = {
      status: { notIn: ["CANCELLED" as const, "REFUNDED" as const] },
    };

    const [recentOrders, last30RevAgg, prev30RevAgg] = await Promise.all([
      // 1. Fetch valid orders from last 365 days for client-side grouping
      prisma.order.findMany({
        where: {
          ...validOrderWhere,
          createdAt: { gte: twelveMonthsAgo },
        },
        select: {
          grandTotal: true,
          createdAt: true,
        },
      }),
      // 2. Revenue in last 30 days
      prisma.order.aggregate({
        where: { ...validOrderWhere, createdAt: { gte: thirtyDaysAgo } },
        _sum: { grandTotal: true },
      }),
      // 3. Revenue in 30 days before that (30 to 60 days ago)
      prisma.order.aggregate({
        where: {
          ...validOrderWhere,
          createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
        },
        _sum: { grandTotal: true },
      }),
    ]);

    // Aggregate Daily Sales (Last 30 Days)
    const dailySalesMap: Record<string, { date: string; revenue: number; orders: number }> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = d.toISOString().split("T")[0];
      dailySalesMap[dateKey] = { date: dateKey, revenue: 0, orders: 0 };
    }

    // Aggregate Monthly Sales (Last 12 Months)
    const monthlySalesMap: Record<string, { month: string; revenue: number; orders: number }> = {};
    for (let i = 11; i >= 0; i--) {
      const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, "0")}`;
      monthlySalesMap[monthKey] = { month: monthKey, revenue: 0, orders: 0 };
    }

    recentOrders.forEach((o) => {
      const dateKey = o.createdAt.toISOString().split("T")[0];
      const monthKey = `${o.createdAt.getFullYear()}-${String(o.createdAt.getMonth() + 1).padStart(2, "0")}`;

      if (dailySalesMap[dateKey]) {
        dailySalesMap[dateKey].revenue += o.grandTotal;
        dailySalesMap[dateKey].orders += 1;
      }
      if (monthlySalesMap[monthKey]) {
        monthlySalesMap[monthKey].revenue += o.grandTotal;
        monthlySalesMap[monthKey].orders += 1;
      }
    });

    const current30Rev = last30RevAgg._sum.grandTotal || 0;
    const previous30Rev = prev30RevAgg._sum.grandTotal || 0;
    let growthTrendPercent = 0;
    if (previous30Rev > 0) {
      growthTrendPercent = Math.round(((current30Rev - previous30Rev) / previous30Rev) * 100);
    } else if (current30Rev > 0) {
      growthTrendPercent = 100;
    }

    logApiResponse(req, 200, startTime);
    return NextResponse.json({
      dailySales: Object.values(dailySalesMap),
      monthlySales: Object.values(monthlySalesMap),
      revenueTrend: {
        currentPeriodRevenue: current30Rev,
        previousPeriodRevenue: previous30Rev,
        growthTrendPercent,
      },
    });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/analytics/sales GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch sales analytics" }, { status: 500 });
  }
}
