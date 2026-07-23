import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyRefreshToken, signAccessToken, signRefreshToken, hashToken, generateRandomToken } from "@/lib/auth";
import { logApiResponse, getClientIp, withSecurity } from "@/lib/middleware";
import { setAuthCookies, clearAuthCookies } from "@/lib/security";
import { AUTH_RATE_LIMIT } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const ip = getClientIp(req);

  const securityError = withSecurity(req, AUTH_RATE_LIMIT);
  if (securityError) return securityError;

  try {
    let refreshTokenStr = req.cookies.get("shreesai_refresh_token")?.value;

    if (!refreshTokenStr) {
      const body = await req.json().catch(() => ({}));
      refreshTokenStr = body.refreshToken || body.refresh_token;
    }

    if (!refreshTokenStr) {
      logApiResponse(req, 401, startTime);
      const res = NextResponse.json({ message: "Refresh token required" }, { status: 401 });
      clearAuthCookies(res);
      return res;
    }

    const payload = verifyRefreshToken(refreshTokenStr);
    if (!payload) {
      logApiResponse(req, 401, startTime);
      const res = NextResponse.json({ message: "Invalid or expired refresh token" }, { status: 401 });
      clearAuthCookies(res);
      return res;
    }

    const tokenHash = hashToken(refreshTokenStr);
    const existingToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (!existingToken || existingToken.isRevoked) {
      // Reuse Detection — revoke entire token family for security!
      if (payload.family) {
        await prisma.refreshToken.updateMany({
          where: { family: payload.family },
          data: { isRevoked: true },
        });
      }
      logApiResponse(req, 401, startTime);
      const res = NextResponse.json({ message: "Token revoked. Please login again." }, { status: 401 });
      clearAuthCookies(res);
      return res;
    }

    // Revoke old refresh token
    await prisma.refreshToken.update({
      where: { id: existingToken.id },
      data: { isRevoked: true },
    });

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) {
      logApiResponse(req, 401, startTime);
      const res = NextResponse.json({ message: "User not found" }, { status: 401 });
      clearAuthCookies(res);
      return res;
    }

    const roleString = user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? "admin" : "customer";
    const newPayload = {
      id: user.id,
      email: user.email,
      role: roleString as "customer" | "admin",
      name: user.name,
    };

    const newFamily = existingToken.family || generateRandomToken();
    const newAccessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload, newFamily);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(newRefreshToken),
        family: newFamily,
        ipAddress: ip,
        userAgent: req.headers.get("user-agent") || null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const res = NextResponse.json({
      message: "Token refreshed successfully",
      token: newAccessToken,
      refreshToken: newRefreshToken,
    });

    setAuthCookies(res, newAccessToken, newRefreshToken);

    logApiResponse(req, 200, startTime);
    return res;

  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("auth/refresh", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
