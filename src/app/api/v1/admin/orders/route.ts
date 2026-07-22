import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { requireAdmin, withSecurity, logApiResponse } from "@/lib/middleware";
import { GENERAL_RATE_LIMIT } from "@/lib/rateLimit";

// GET all orders — admin only
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
    const db = getDb();
    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 200);
    const offset = Math.max(parseInt(searchParams.get("offset") || "0"), 0);

    let query = "SELECT * FROM orders";
    const params: (string | number)[] = [];

    const validStatuses = ["Pending", "Crating", "Shipped", "Delivered", "Cancelled"];
    if (status && validStatuses.includes(status)) {
      query += " WHERE status = ?";
      params.push(status);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const orders = db.prepare(query).all(...params) as Array<Record<string, unknown>>;

    // Fetch items for each order
    const getItems = db.prepare("SELECT * FROM order_items WHERE order_id = ?");
    const ordersWithItems = orders.map((order) => ({
      ...order,
      items: getItems.all(order.id),
    }));

    const countQuery =
      status && validStatuses.includes(status)
        ? "SELECT COUNT(*) as count FROM orders WHERE status = ?"
        : "SELECT COUNT(*) as count FROM orders";
    const countParams = status && validStatuses.includes(status) ? [status] : [];
    const totalCount = db.prepare(countQuery).get(...countParams) as { count: number };

    logApiResponse(req, 200, startTime);
    return NextResponse.json({
      orders: ordersWithItems,
      total: totalCount.count,
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
