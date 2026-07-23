import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAuth, withSecurity, logApiResponse } from "@/lib/middleware";
import { GENERAL_RATE_LIMIT } from "@/lib/rateLimit";

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

    const orders = await prisma.order.findMany({
      where: { userId: String(user.id) },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ orders });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("orders/GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
