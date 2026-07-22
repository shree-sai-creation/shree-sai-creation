/**
 * In-memory rate limiter — no Redis needed for 10k daily visits.
 * Uses sliding window algorithm per IP address.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Store: Map<ip_key, entry>
const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  /** Max requests per window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
  /** Unique identifier prefix (e.g. 'auth', 'checkout') */
  prefix?: string;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

/**
 * Check rate limit for a given IP + prefix.
 * Returns success=false if limit exceeded.
 */
export function checkRateLimit(
  ip: string,
  options: RateLimitOptions
): RateLimitResult {
  const { limit, windowMs, prefix = "global" } = options;
  const key = `${prefix}:${ip}`;
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // New window
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return {
      success: true,
      remaining: limit - 1,
      resetAt,
      retryAfterSeconds: 0,
    };
  }

  if (entry.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return {
    success: true,
    remaining: limit - entry.count,
    resetAt: entry.resetAt,
    retryAfterSeconds: 0,
  };
}

/** Preset: Auth routes — 5 attempts per minute */
export const AUTH_RATE_LIMIT: RateLimitOptions = {
  limit: 5,
  windowMs: 60 * 1000,
  prefix: "auth",
};

/** Preset: Checkout — 3 orders per minute */
export const CHECKOUT_RATE_LIMIT: RateLimitOptions = {
  limit: 3,
  windowMs: 60 * 1000,
  prefix: "checkout",
};

/** Preset: General API — 100 requests per minute */
export const GENERAL_RATE_LIMIT: RateLimitOptions = {
  limit: 100,
  windowMs: 60 * 1000,
  prefix: "general",
};

/** Preset: Contact form — 3 submissions per 10 minutes */
export const CONTACT_RATE_LIMIT: RateLimitOptions = {
  limit: 3,
  windowMs: 10 * 60 * 1000,
  prefix: "contact",
};
