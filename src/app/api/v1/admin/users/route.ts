import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

// GET /api/v1/admin/users — list all registered users
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role.toLowerCase(),
      created_at: u.createdAt.toISOString(),
    }));

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ users: formatted });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/users GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/v1/admin/users?id=... — delete a user
export async function DELETE(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Valid user ID required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
      return NextResponse.json({ message: "Cannot delete admin user" }, { status: 403 });
    }

    await prisma.user.delete({ where: { id } });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/users DELETE", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/v1/admin/users — update user role
export async function PATCH(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const { id, role } = body;

    if (!id || !role || !["customer", "admin"].includes(role)) {
      return NextResponse.json({ message: "Valid id and role required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const targetRole = role === "admin" ? Role.ADMIN : Role.CUSTOMER;

    await prisma.user.update({
      where: { id },
      data: { role: targetRole },
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ message: "User role updated successfully" });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/users PATCH", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/admin/users — create a new user (customer or admin)
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existing) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 });
    }

    const bcrypt = await import("bcryptjs");
    const passwordHash = bcrypt.default.hashSync(password, 12);
    const targetRole = role === "admin" ? Role.ADMIN : Role.CUSTOMER;

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash: passwordHash,
        role: targetRole,
        isEmailVerified: true,
      },
    });

    const formatted = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role.toLowerCase(),
      created_at: newUser.createdAt.toISOString(),
    };

    logApiResponse(req, 201, startTime);
    return NextResponse.json({ message: "User created successfully", user: formatted }, { status: 201 });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/users POST", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
