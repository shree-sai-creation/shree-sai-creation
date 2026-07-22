import fs from "fs";
import path from "path";

const LOG_DIR = path.join(process.cwd(), "logs");

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function getLogPath(type: "access" | "error") {
  const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  return path.join(LOG_DIR, `${type}-${date}.log`);
}

function writeLog(type: "access" | "error", message: string) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}\n`;

  // Write to file (non-blocking)
  fs.appendFile(getLogPath(type), line, (err) => {
    if (err) console.error("Logger write error:", err);
  });

  // Also print to console in development
  if (process.env.NODE_ENV !== "production") {
    if (type === "error") {
      console.error(line.trim());
    } else {
      console.log(line.trim());
    }
  }
}

export interface RequestLogData {
  method: string;
  path: string;
  ip: string;
  status: number;
  durationMs: number;
  userAgent?: string;
}

/** Log an API request */
export function logRequest(data: RequestLogData) {
  const { method, path: reqPath, ip, status, durationMs, userAgent } = data;
  const ua = userAgent ? ` | UA: ${userAgent.slice(0, 80)}` : "";
  writeLog(
    "access",
    `${method} ${reqPath} ${status} ${durationMs}ms | IP: ${ip}${ua}`
  );
}

/** Log an error */
export function logError(context: string, error: unknown) {
  const message =
    error instanceof Error
      ? `${error.message}\n  Stack: ${error.stack}`
      : String(error);
  writeLog("error", `[${context}] ${message}`);
}

/** Get client IP from request headers (works behind Nginx proxy) */
export function getClientIp(req: Request): string {
  // Try common proxy headers first
  const forwardedFor = (req.headers as Headers).get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = (req.headers as Headers).get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
