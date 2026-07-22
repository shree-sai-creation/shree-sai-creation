import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import getDb from "@/lib/db";
import { signToken } from "@/lib/auth";
import { withSecurity, logApiResponse } from "@/lib/middleware";
import { AUTH_RATE_LIMIT } from "@/lib/rateLimit";

const LoginSchema = z.object({
  email: z.string().email("Invalid email").max(200),
  password: z.string().min(1, "Password is required").max(128),
});

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  // Rate limit: 5 login attempts per minute per IP (brute-force protection)
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
    const db = getDb();

    // First check regular users table
    const user = db
      .prepare("SELECT id, name, email, password_hash, role FROM users WHERE email = ?")
      .get(email.toLowerCase()) as {
        id: number;
        name: string;
        email: string;
        password_hash: string;
        role: string;
      } | undefined;

    if (user) {
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        logApiResponse(req, 401, startTime);
        return NextResponse.json(
          { message: "Invalid email or password" },
          { status: 401 }
        );
      }

      const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role as "customer" | "admin",
        name: user.name,
      });

      logApiResponse(req, 200, startTime);
      return NextResponse.json({
        message: "Login successful",
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    }

    // If not found in users table, check admins table
    const admin = db
      .prepare("SELECT id, name, email, password_hash FROM admins WHERE email = ?")
      .get(email.toLowerCase()) as {
        id: number;
        name: string;
        email: string;
        password_hash: string;
      } | undefined;

    if (!admin) {
      // Constant-time response — prevent enumeration
      await bcrypt.compare(password, "$2b$12$invalidhashtopreventtimingattack");
      logApiResponse(req, 401, startTime);
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isAdminValid = await bcrypt.compare(password, admin.password_hash);
    if (!isAdminValid) {
      logApiResponse(req, 401, startTime);
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = signToken({
      id: admin.id,
      email: admin.email,
      role: "admin",
      name: admin.name,
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({
      message: "Login successful",
      token,
      user: { id: admin.id, name: admin.name, email: admin.email, role: "admin" },
    });

  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("auth/login", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
