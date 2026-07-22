import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import getDb from "@/lib/db";
import { requireAdmin, withSecurity, logApiResponse } from "@/lib/middleware";
import { GENERAL_RATE_LIMIT } from "@/lib/rateLimit";

const VALID_STATUSES = ["Pending", "Crating", "Shipped", "Delivered", "Cancelled"] as const;

const StatusSchema = z.object({
  status: z.enum(VALID_STATUSES),
});

// PUT update order status — admin only
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

    // Validate ID is numeric
    if (!/^\d+$/.test(id)) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json({ message: "Invalid order ID" }, { status: 400 });
    }

    const body = await req.json();
    const parsed = StatusSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const db = getDb();
    const existing = db.prepare("SELECT id FROM orders WHERE id = ?").get(id);
    if (!existing) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    db.prepare(
      "UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?"
    ).run(parsed.data.status, id);

    logApiResponse(req, 200, startTime);
    return NextResponse.json({
      message: "Order status updated",
      status: parsed.data.status,
    });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/orders/[id]/status/PUT", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
