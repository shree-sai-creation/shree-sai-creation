import { NextResponse } from "next/server";
import prisma from "./db";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes lock

export async function handleFailedLogin(userId: string, ipAddress: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const newAttempts = user.failedLoginAttempts + 1;
  const lockUntil = newAttempts >= MAX_FAILED_ATTEMPTS ? new Date(Date.now() + LOCK_TIME_MS) : null;

  await prisma.user.update({
    where: { id: userId },
    data: {
      failedLoginAttempts: newAttempts,
      lockedUntil: lockUntil,
    },
  });

  await logSecurityAudit({
    userId,
    action: "FAILED_LOGIN",
    entityType: "User",
    entityId: userId,
    ipAddress,
    details: JSON.stringify({ attempts: newAttempts, locked: Boolean(lockUntil) }),
  });
}

export async function handleSuccessfulLogin(userId: string, ipAddress: string) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
      lastLoginIp: ipAddress,
    },
  });

  await logSecurityAudit({
    userId,
    action: "LOGIN_SUCCESS",
    entityType: "User",
    entityId: userId,
    ipAddress,
  });
}

export async function isAccountLocked(user: { lockedUntil: Date | null }): Promise<boolean> {
  if (!user.lockedUntil) return false;
  if (user.lockedUntil.getTime() > Date.now()) return true;
  return false;
}

export async function logSecurityAudit({
  userId,
  action,
  entityType,
  entityId,
  ipAddress,
  beforeState,
  afterState,
  details,
}: {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress?: string | null;
  beforeState?: Record<string, unknown>;
  afterState?: Record<string, unknown>;
  details?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        entityType,
        entityId,
        ipAddress: ipAddress || null,
        beforeState: beforeState ? (beforeState as unknown as object) : undefined,
        afterState: afterState ? (afterState as unknown as object) : undefined,
      },
    });
  } catch (e) {
    console.error("Audit log error:", e);
  }
}

export function setAuthCookies(
  res: NextResponse,
  accessToken: string,
  refreshToken: string
) {
  const isProduction = process.env.NODE_ENV === "production";

  // Access Token Cookie (15 min)
  res.cookies.set("shreesai_access_token", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });

  // Refresh Token Cookie (7 days)
  res.cookies.set("shreesai_refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export function clearAuthCookies(res: NextResponse) {
  res.cookies.set("shreesai_access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  res.cookies.set("shreesai_refresh_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
