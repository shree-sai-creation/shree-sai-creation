import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { withSecurity, logApiResponse } from "@/lib/middleware";
import { GENERAL_RATE_LIMIT } from "@/lib/rateLimit";

// GET /api/v1/brands — Public brand listing with logo, description, and active product count
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const securityError = withSecurity(req, GENERAL_RATE_LIMIT);
  if (securityError) return securityError;

  try {
    const brands = await prisma.brand.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logoUrl: true,
        _count: {
          select: {
            products: { where: { isActive: true } },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const formatted = brands.map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      description: b.description,
      logoUrl: b.logoUrl,
      productCount: b._count.products,
    }));

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ brands: formatted, total: formatted.length });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("brands/GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch brands" }, { status: 500 });
  }
}
