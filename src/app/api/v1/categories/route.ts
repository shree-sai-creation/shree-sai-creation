import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { withSecurity, logApiResponse } from "@/lib/middleware";
import { GENERAL_RATE_LIMIT } from "@/lib/rateLimit";

// GET /api/v1/categories — Public categories listing with hierarchy and product counts
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const securityError = withSecurity(req, GENERAL_RATE_LIMIT);
  if (securityError) return securityError;

  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        parentId: true,
        parent: { select: { id: true, name: true, slug: true } },
        children: { select: { id: true, name: true, slug: true, description: true } },
        _count: {
          select: {
            products: { where: { isActive: true } },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const formatted = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      parentId: c.parentId,
      parent: c.parent,
      children: c.children,
      productCount: c._count.products,
    }));

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ categories: formatted, total: formatted.length });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("categories/GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch categories" }, { status: 500 });
  }
}
