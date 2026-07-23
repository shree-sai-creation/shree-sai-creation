import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { hashToken } from "@/lib/auth";
import { withSecurity, logApiResponse, getClientIp } from "@/lib/middleware";
import { GENERAL_RATE_LIMIT } from "@/lib/rateLimit";
import { logSecurityAudit } from "@/lib/security";

const VerifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const ip = getClientIp(req);

  const securityError = withSecurity(req, GENERAL_RATE_LIMIT);
  if (securityError) return securityError;

  try {
    const body = await req.json();
    const parsed = VerifyEmailSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { token } = parsed.data;
    const tokenHash = hashToken(token);

    const verificationRecord = await prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
    });

    if (!verificationRecord || verificationRecord.isUsed || verificationRecord.expiresAt < new Date()) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: verificationRecord.userId },
        data: { isEmailVerified: true },
      }),
      prisma.emailVerificationToken.update({
        where: { id: verificationRecord.id },
        data: { isUsed: true },
      }),
    ]);

    await logSecurityAudit({
      userId: verificationRecord.userId,
      action: "EMAIL_VERIFIED",
      entityType: "User",
      entityId: verificationRecord.userId,
      ipAddress: ip,
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ message: "Email verified successfully!" });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("auth/verify-email", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
