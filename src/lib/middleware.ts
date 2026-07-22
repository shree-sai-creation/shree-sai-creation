import { NextRequest, NextResponse } from "next/server";
import { verifyToken, extractTokenFromHeader, JwtPayload } from "./auth";
import { checkRateLimit, RateLimitOptions } from "./rateLimit";
import { getClientIp, logRequest, logError } from "./logger";

export { getClientIp, logError };

export function getAuthUser(req: NextRequest): JwtPayload | null {
  const token = extractTokenFromHeader(req.headers.get("authorization"));
  if (!token) return null;
  return verifyToken(token);
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
  if (user.role !== "admin") {
    return {
      error: NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      ),
    };
  }
  return { user };
}

/**
 * Apply rate limiting to a request.
 * Returns a 429 NextResponse if limit exceeded, otherwise null.
 */
export function applyRateLimit(
  req: NextRequest,
  options: RateLimitOptions
): NextResponse | null {
  const ip = getClientIp(req);
  const result = checkRateLimit(ip, options);

  if (!result.success) {
    // Log rate limit hit
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

/**
 * Wrap an API handler with rate limiting + request logging.
 */
export function withSecurity(
  req: NextRequest,
  rateLimitOptions?: RateLimitOptions
): NextResponse | null {
  // Apply rate limit if options provided
  if (rateLimitOptions) {
    const rateLimitError = applyRateLimit(req, rateLimitOptions);
    if (rateLimitError) return rateLimitError;
  }

  return null;
}

/**
 * Log a completed API response.
 */
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
