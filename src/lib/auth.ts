import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET ||
  process.env.JWT_SECRET ||
  "shreesai_access_token_super_secret_jwt_2026_change_in_production";

const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ||
  "shreesai_refresh_token_super_secret_jwt_2026_change_in_production";

const ACCESS_TOKEN_EXPIRES = (process.env.ACCESS_TOKEN_EXPIRES || "15m") as jwt.SignOptions["expiresIn"];
const REFRESH_TOKEN_EXPIRES = (process.env.REFRESH_TOKEN_EXPIRES || "7d") as jwt.SignOptions["expiresIn"];

export interface JwtPayload {
  id: string;
  email: string;
  role: "customer" | "admin" | "super_admin";
  name: string;
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
}

export function signRefreshToken(payload: JwtPayload, family: string): string {
  return jwt.sign({ ...payload, family }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES,
  });
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(
  token: string
): (JwtPayload & { family?: string }) | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload & { family?: string };
  } catch {
    return null;
  }
}

// Backward compatibility helpers
export function signToken(payload: JwtPayload | { id: string | number; email: string; role: "customer" | "admin"; name: string }): string {
  const normPayload: JwtPayload = {
    id: String(payload.id),
    email: payload.email,
    role: payload.role as "customer" | "admin",
    name: payload.name,
  };
  return signAccessToken(normPayload);
}

export function verifyToken(token: string): JwtPayload | null {
  return verifyAccessToken(token) || verifyRefreshToken(token);
}

export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateRandomToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function timingSafeEqual(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}
