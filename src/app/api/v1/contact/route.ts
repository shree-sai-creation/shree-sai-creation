import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import getDb from "@/lib/db";
import { withSecurity, logApiResponse } from "@/lib/middleware";
import { CONTACT_RATE_LIMIT, GENERAL_RATE_LIMIT } from "@/lib/rateLimit";
import { sanitizeObject } from "@/lib/sanitize";
import { verifyToken } from "@/lib/auth";

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Valid email is required").max(200),
  phone: z.string().optional().default(""),
  subject: z.string().optional().default(""),
  message: z.string().min(5, "Message must be at least 5 characters").max(2000),
});

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  // Strict rate limit: 3 messages per 10 minutes per IP
  const securityError = withSecurity(req, CONTACT_RATE_LIMIT);
  if (securityError) return securityError;

  try {
    const body = await req.json();
    const sanitized = sanitizeObject(body);
    const parsed = ContactSchema.safeParse(sanitized);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = parsed.data;
    const db = getDb();

    db.prepare(
      "INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)"
    ).run(name, email, phone, subject, message);

    logApiResponse(req, 201, startTime);
    return NextResponse.json(
      { message: "Message received! We will get back to you shortly." },
      { status: 201 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("contact/POST", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// GET contact messages (admin only)
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const securityError = withSecurity(req, GENERAL_RATE_LIMIT);
  if (securityError) return securityError;

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    logApiResponse(req, 401, startTime);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = authHeader.slice(7);
    const user = verifyToken(token);
    if (!user || user.role !== "admin") {
      logApiResponse(req, 403, startTime);
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    const db = getDb();
    const messages = db
      .prepare("SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 100")
      .all();

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ messages });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("contact/GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
