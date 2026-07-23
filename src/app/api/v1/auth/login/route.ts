import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/db";
import { signAccessToken, signRefreshToken, hashToken, generateRandomToken } from "@/lib/auth";
import { withSecurity, logApiResponse, getClientIp } from "@/lib/middleware";
import { AUTH_RATE_LIMIT } from "@/lib/rateLimit";
import { handleFailedLogin, handleSuccessfulLogin, isAccountLocked, setAuthCookies } from "@/lib/security";

const LoginSchema = z.object({
  email: z.string().email("Invalid email").max(200),
  password: z.string().min(1, "Password is required").max(128),
});

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const ip = getClientIp(req);

  const securityError = withSecurity(req, AUTH_RATE_LIMIT);
  if (securityError) return securityError;

  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      await bcrypt.compare(password, "$2b$12$invalidhashtopreventtimingattack");
      logApiResponse(req, 401, startTime);
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check account lockout
    if (await isAccountLocked(user)) {
      logApiResponse(req, 423, startTime);
      return NextResponse.json(
        { message: "Account locked due to repeated failed login attempts. Please try again in 15 minutes." },
        { status: 423 }
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      await handleFailedLogin(user.id, ip);
      logApiResponse(req, 401, startTime);
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    await handleSuccessfulLogin(user.id, ip);

    const roleString = user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? "admin" : "customer";
    const payload = {
      id: user.id,
      email: user.email,
      role: roleString as "customer" | "admin",
      name: user.name,
    };

    const family = generateRandomToken();
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload, family);

    // Save refresh token to database
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        family,
        ipAddress: ip,
        userAgent: req.headers.get("user-agent") || null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const res = NextResponse.json({
      message: "Login successful",
      token: accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: roleString },
    });

    setAuthCookies(res, accessToken, refreshToken);

    logApiResponse(req, 200, startTime);
    return res;

  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("auth/login", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
