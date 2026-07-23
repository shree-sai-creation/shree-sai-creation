import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hashToken } from "@/lib/auth";
import { getAuthUser, logApiResponse, getClientIp } from "@/lib/middleware";
import { clearAuthCookies, logSecurityAudit } from "@/lib/security";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const ip = getClientIp(req);
  const authUser = getAuthUser(req);

  try {
    const refreshTokenCookie = req.cookies.get("shreesai_refresh_token")?.value;

    if (refreshTokenCookie) {
      const tokenHash = hashToken(refreshTokenCookie);
      await prisma.refreshToken.updateMany({
        where: { tokenHash },
        data: { isRevoked: true },
      }).catch(() => null);
    }

    if (authUser) {
      await logSecurityAudit({
        userId: authUser.id,
        action: "LOGOUT",
        entityType: "User",
        entityId: authUser.id,
        ipAddress: ip,
      });
    }

    const res = NextResponse.json({ message: "Logout successful" });
    clearAuthCookies(res);

    logApiResponse(req, 200, startTime);
    return res;
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("auth/logout", err);
    const res = NextResponse.json({ message: "Logout successful" });
    clearAuthCookies(res);
    return res;
  }
}
