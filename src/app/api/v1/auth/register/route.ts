import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/db";
import { signAccessToken, signRefreshToken, hashToken, generateRandomToken } from "@/lib/auth";
import { withSecurity, logApiResponse, getClientIp } from "@/lib/middleware";
import { AUTH_RATE_LIMIT } from "@/lib/rateLimit";
import { sanitizeObject } from "@/lib/sanitize";
import { setAuthCookies, logSecurityAudit } from "@/lib/security";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email").max(200),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const ip = getClientIp(req);

  const securityError = withSecurity(req, AUTH_RATE_LIMIT);
  if (securityError) return securityError;

  try {
    const body = await req.json();
    const sanitized = sanitizeObject(body);
    const parsed = RegisterSchema.safeParse(sanitized);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      logApiResponse(req, 409, startTime);
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: "CUSTOMER",
      },
    });

    // Generate email verification token
    const verifyToken = generateRandomToken();
    await prisma.emailVerificationToken.create({
      data: {
        userId: newUser.id,
        tokenHash: hashToken(verifyToken),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    // Non-blocking Email Notifications
    import("@/lib/email").then(({ sendWelcomeEmail, sendVerificationEmail }) => {
      sendWelcomeEmail(newUser.email, newUser.name).catch((e) => console.error("Welcome email error:", e));
      sendVerificationEmail(newUser.email, newUser.name, verifyToken).catch((e) => console.error("Verification email error:", e));
    }).catch((e) => console.error("Email module load error:", e));

    await logSecurityAudit({
      userId: newUser.id,
      action: "REGISTER",
      entityType: "User",
      entityId: newUser.id,
      ipAddress: ip,
    });

    const payload = {
      id: newUser.id,
      email: newUser.email,
      role: "customer" as const,
      name: newUser.name,
    };

    const family = generateRandomToken();
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload, family);

    await prisma.refreshToken.create({
      data: {
        userId: newUser.id,
        tokenHash: hashToken(refreshToken),
        family,
        ipAddress: ip,
        userAgent: req.headers.get("user-agent") || null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const res = NextResponse.json(
      {
        message: "Account created successfully",
        token: accessToken,
        refreshToken,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: "customer" },
      },
      { status: 201 }
    );

    setAuthCookies(res, accessToken, refreshToken);

    logApiResponse(req, 201, startTime);
    return res;
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("auth/register", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
