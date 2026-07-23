import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { generateRandomToken, hashToken } from "@/lib/auth";
import { withSecurity, logApiResponse, getClientIp } from "@/lib/middleware";
import { AUTH_RATE_LIMIT } from "@/lib/rateLimit";
import { logSecurityAudit } from "@/lib/security";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email").max(200),
});

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const ip = getClientIp(req);

  const securityError = withSecurity(req, {
    ...AUTH_RATE_LIMIT,
    limit: 3,
    prefix: "forgot-password",
  });
  if (securityError) return securityError;

  try {
    const body = await req.json();
    const parsed = ForgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user) {
      const resetToken = generateRandomToken();
      const tokenHash = hashToken(resetToken);

      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      });

      await logSecurityAudit({
        userId: user.id,
        action: "PASSWORD_RESET_REQUESTED",
        entityType: "User",
        entityId: user.id,
        ipAddress: ip,
      });

      // Dispatch Password Reset Email via Resend
      import("@/lib/email").then(({ sendPasswordResetEmail }) => {
        sendPasswordResetEmail(user.email, user.name, resetToken).catch((e) => console.error("Password reset email error:", e));
      }).catch((e) => console.error("Email module load error:", e));
    }

    // Always return 200 to prevent email enumeration
    logApiResponse(req, 200, startTime);
    return NextResponse.json({
      message: "If an account exists with that email, a password reset link has been sent.",
    });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("auth/forgot-password", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
