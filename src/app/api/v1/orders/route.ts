import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { requireAuth, withSecurity, logApiResponse } from "@/lib/middleware";
import { GENERAL_RATE_LIMIT } from "@/lib/rateLimit";

// GET user's own orders — authenticated
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const securityError = withSecurity(req, GENERAL_RATE_LIMIT);
  if (securityError) return securityError;

  const authResult = requireAuth(req);
  if ("error" in authResult) {
    logApiResponse(req, 401, startTime);
    return authResult.error;
  }

  try {
    const { user } = authResult;
    const db = getDb();

    // Fetch orders
    const orders = db
      .prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 50")
      .all(user.id) as Array<Record<string, unknown>>;

    // Fetch items for each order
    const getItems = db.prepare("SELECT * FROM order_items WHERE order_id = ?");
    const ordersWithItems = orders.map((order) => ({
      ...order,
      items: getItems.all(order.id),
    }));

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ orders: ordersWithItems });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("orders/GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
