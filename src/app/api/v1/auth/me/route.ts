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
    const { user: authUser } = authResult;

    const user = await prisma.user.findUnique({
      where: { id: String(authUser.id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    logApiResponse(req, 200, startTime);
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase(),
        created_at: user.createdAt.toISOString(),
      },
    });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("auth/me", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
