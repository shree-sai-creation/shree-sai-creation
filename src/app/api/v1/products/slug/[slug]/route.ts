import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { withSecurity, logApiResponse } from "@/lib/middleware";
import { GENERAL_RATE_LIMIT } from "@/lib/rateLimit";

function parseProduct(row: Record<string, unknown>) {
  return {
    ...row,
    images: JSON.parse((row.images as string) || "[]"),
    features: JSON.parse((row.features as string) || "[]"),
    specifications: JSON.parse((row.specifications as string) || "{}"),
    related_products: JSON.parse((row.related_products as string) || "[]"),
  };
}

// GET product by slug — public
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const startTime = Date.now();
  const securityError = withSecurity(req, GENERAL_RATE_LIMIT);
  if (securityError) return securityError;

  try {
    const { slug } = await params;

    // Validate slug format (alphanumeric + hyphens only)
    if (!/^[a-z0-9-]{1,200}$/.test(slug)) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json({ message: "Invalid product slug" }, { status: 400 });
    }

    const db = getDb();
    const product = db
      .prepare("SELECT * FROM products WHERE slug = ? AND is_active = 1")
      .get(slug) as Record<string, unknown> | undefined;

    if (!product) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ product: parseProduct(product) });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("products/slug/GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
