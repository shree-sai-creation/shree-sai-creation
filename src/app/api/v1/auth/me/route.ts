import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
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
    const db = getDb();

    const user = db
      .prepare("SELECT id, name, email, role, created_at FROM users WHERE id = ?")
      .get(authUser.id) as { id: number; name: string; email: string; role: string; created_at: string } | undefined;

    if (!user) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ user });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("auth/me", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
