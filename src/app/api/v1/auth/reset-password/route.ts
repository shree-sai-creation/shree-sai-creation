import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/db";
import { hashToken } from "@/lib/auth";
import { withSecurity, logApiResponse, getClientIp } from "@/lib/middleware";
import { AUTH_RATE_LIMIT } from "@/lib/rateLimit";
import { logSecurityAudit } from "@/lib/security";

const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters").max(128),
});

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const ip = getClientIp(req);

  const securityError = withSecurity(req, {
    ...AUTH_RATE_LIMIT,
    limit: 5,
    prefix: "reset-password",
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();
    const parsed = ResetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { token, newPassword } = parsed.data;
    const tokenHash = hashToken(token);

    const resetTokenRecord = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetTokenRecord || resetTokenRecord.isUsed || resetTokenRecord.expiresAt < new Date()) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: "Invalid or expired password reset token" },
        { status: 400 }
      );
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetTokenRecord.userId },
        data: {
          passwordHash: newPasswordHash,
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetTokenRecord.id },
        data: { isUsed: true },
      }),
      // Revoke all existing refresh tokens for security
      prisma.refreshToken.updateMany({
        where: { userId: resetTokenRecord.userId },
        data: { isRevoked: true },
      }),
    ]);

    await logSecurityAudit({
      userId: resetTokenRecord.userId,
      action: "PASSWORD_RESET_SUCCESS",
      entityType: "User",
      entityId: resetTokenRecord.userId,
      ipAddress: ip,
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ message: "Password reset successfully. You can now login." });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("auth/reset-password", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
