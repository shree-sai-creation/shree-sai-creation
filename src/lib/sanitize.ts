/**
 * Input sanitization utilities.
 * Strips dangerous HTML/script tags to prevent XSS.
 * Used on all user-provided string inputs before saving to DB.
 */

/**
 * Strip HTML tags and dangerous characters from a string.
 */
export function sanitizeString(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/javascript:/gi, "") // Remove JS protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .replace(/\0/g, "") // Remove null bytes
    .trim();
}

/**
 * Sanitize an object's string values recursively.
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key in result) {
    const val = result[key];
    if (typeof val === "string") {
      (result as Record<string, unknown>)[key] = sanitizeString(val);
    } else if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      (result as Record<string, unknown>)[key] = sanitizeObject(
        val as Record<string, unknown>
      );
    } else if (Array.isArray(val)) {
      (result as Record<string, unknown>)[key] = val.map((item) =>
        typeof item === "string" ? sanitizeString(item) : item
      );
    }
  }
  return result;
}

/**
 * Validate email format.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate Indian mobile number.
 */
export function isValidPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ""));
}
