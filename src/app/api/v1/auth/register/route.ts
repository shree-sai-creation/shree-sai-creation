import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import getDb from "@/lib/db";
import { signToken } from "@/lib/auth";
import { withSecurity, logApiResponse } from "@/lib/middleware";
import { AUTH_RATE_LIMIT } from "@/lib/rateLimit";
import { sanitizeObject } from "@/lib/sanitize";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email").max(200),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  // Rate limit: 5 registrations per minute per IP
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
    const db = getDb();

    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      logApiResponse(req, 409, startTime);
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = db
      .prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)")
      .run(name, email.toLowerCase(), passwordHash);

    const token = signToken({
      id: result.lastInsertRowid as number,
      email: email.toLowerCase(),
      role: "customer",
      name,
    });

    logApiResponse(req, 201, startTime);
    return NextResponse.json(
      {
        message: "Account created successfully",
        token,
        user: { id: result.lastInsertRowid, name, email: email.toLowerCase(), role: "customer" },
      },
      { status: 201 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("auth/register", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
