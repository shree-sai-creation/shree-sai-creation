import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, extractTokenFromHeader, JwtPayload } from "./auth";
import { checkRateLimit, RateLimitOptions } from "./rateLimit";
import { getClientIp, logRequest, logError } from "./logger";

export { getClientIp, logError };

export function getAuthUser(req: NextRequest): JwtPayload | null {
  // First check Authorization header
  let token = extractTokenFromHeader(req.headers.get("authorization"));

  // Second check HttpOnly cookie
  if (!token) {
    token = req.cookies.get("shreesai_access_token")?.value || null;
  }

  if (!token) return null;
  return verifyAccessToken(token);
}

export function requireAuth(
  req: NextRequest
): { user: JwtPayload } | { error: NextResponse } {
  const user = getAuthUser(req);
  if (!user) {
    return {
      error: NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      ),
    };
  }
  return { user };
}

export function requireAdmin(
  req: NextRequest
): { user: JwtPayload } | { error: NextResponse } {
  const user = getAuthUser(req);
  if (!user) {
    return {
      error: NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      ),
    };
  }
  if (user.role !== "admin" && user.role !== "super_admin") {
    return {
      error: NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      ),
    };
  }
  return { user };
}

export function requireSuperAdmin(
  req: NextRequest
): { user: JwtPayload } | { error: NextResponse } {
  const user = getAuthUser(req);
  if (!user) {
    return {
      error: NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      ),
    };
  }
  if (user.role !== "super_admin") {
    return {
      error: NextResponse.json(
        { message: "Super Admin access required" },
        { status: 403 }
      ),
    };
  }
  return { user };
}

export function applyRateLimit(
  req: NextRequest,
  options: RateLimitOptions
): NextResponse | null {
  const ip = getClientIp(req);
  const result = checkRateLimit(ip, options);

  if (!result.success) {
    logRequest({
      method: req.method,
      path: req.nextUrl.pathname,
      ip,
      status: 429,
      durationMs: 0,
      userAgent: req.headers.get("user-agent") || undefined,
    });

    return NextResponse.json(
      {
        message: `Too many requests. Please try again in ${result.retryAfterSeconds} seconds.`,
        retryAfter: result.retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(result.retryAfterSeconds),
          "X-RateLimit-Limit": String(options.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
        },
      }
    );
  }

  return null;
}

export function withSecurity(
  req: NextRequest,
  rateLimitOptions?: RateLimitOptions
): NextResponse | null {
  if (rateLimitOptions) {
    const rateLimitError = applyRateLimit(req, rateLimitOptions);
    if (rateLimitError) return rateLimitError;
  }

  return null;
}

export function logApiResponse(
  req: NextRequest,
  status: number,
  startTime: number
) {
  const ip = getClientIp(req);
  logRequest({
    method: req.method,
    path: req.nextUrl.pathname,
    ip,
    status,
    durationMs: Date.now() - startTime,
    userAgent: req.headers.get("user-agent") || undefined,
  });
}
