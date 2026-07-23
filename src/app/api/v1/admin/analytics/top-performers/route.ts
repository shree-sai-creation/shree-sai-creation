import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

// GET /api/v1/admin/analytics/top-performers — Top Products, Categories, Brands & Inventory Summary
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const [
      topSellingItems,
      topCategories,
      topBrands,
      recentOrders,
      inventorySummary,
    ] = await Promise.all([
      // 1. Top Selling Products (grouped by productId)
      prisma.orderItem.groupBy({
        by: ["productId", "productName"],
        _sum: { quantity: true, unitPrice: true },
        _count: { id: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      // 2. Top Categories
      prisma.category.findMany({
        take: 5,
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { products: true } },
        },
      }),
      // 3. Top Brands
      prisma.brand.findMany({
        take: 5,
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { products: true } },
        },
      }),
      // 4. Recent Orders (Last 10)
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          fullName: true,
          email: true,
          status: true,
          grandTotal: true,
          createdAt: true,
        },
      }),
      // 5. Inventory Summary Aggregate
      prisma.inventory.aggregate({
        _sum: { quantity: true, reserved: true },
        _count: { id: true },
      }),
    ]);

    const formattedTopProducts = topSellingItems.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      unitsSold: item._sum.quantity || 0,
      orderCount: item._count.id,
      totalRevenue: (item._sum.unitPrice || 0) * (item._sum.quantity || 1),
    }));

    const totalQuantity = inventorySummary._sum.quantity || 0;
    const totalReserved = inventorySummary._sum.reserved || 0;

    logApiResponse(req, 200, startTime);
    return NextResponse.json({
      topProducts: formattedTopProducts,
      topCategories: topCategories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, productCount: c._count.products })),
      topBrands: topBrands.map((b) => ({ id: b.id, name: b.name, slug: b.slug, productCount: b._count.products })),
      recentOrders,
      inventorySummary: {
        totalVariantsManaged: inventorySummary._count.id,
        totalPhysicalStockUnits: totalQuantity,
        totalReservedStockUnits: totalReserved,
        totalAvailableStockUnits: Math.max(0, totalQuantity - totalReserved),
      },
    });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/analytics/top-performers GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch top performers analytics" }, { status: 500 });
  }
}
