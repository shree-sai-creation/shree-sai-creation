import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { withSecurity, logApiResponse } from "@/lib/middleware";
import { GENERAL_RATE_LIMIT } from "@/lib/rateLimit";

// GET /api/v1/brands/[slug]/products — Brand-specific product listing with search, filtering, and pagination
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const startTime = Date.now();
  const securityError = withSecurity(req, GENERAL_RATE_LIMIT);
  if (securityError) return securityError;

  try {
    const { slug } = await params;

    const brand = await prisma.brand.findUnique({
      where: { slug },
    });

    if (!brand) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);

    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20"), 1), 100);
    const skip = (page - 1) * limit;

    const search = searchParams.get("q") || searchParams.get("search") || "";
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : null;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : null;
    const sort = searchParams.get("sort") || "newest";

    const whereClause: Record<string, unknown> = {
      isActive: true,
      brandId: brand.id,
    };

    if (minPrice !== null || maxPrice !== null) {
      const priceFilter: Record<string, number> = {};
      if (minPrice !== null) priceFilter.gte = Math.round(minPrice * 100);
      if (maxPrice !== null) priceFilter.lte = Math.round(maxPrice * 100);
      whereClause.basePrice = priceFilter;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };
    switch (sort) {
      case "price-low":
      case "price-asc":
        orderBy = { basePrice: "asc" };
        break;
      case "price-high":
      case "price-desc":
        orderBy = { basePrice: "desc" };
        break;
      case "rating":
        orderBy = { rating: "desc" };
        break;
      case "name-asc":
        orderBy = { name: "asc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          category: { select: { name: true, slug: true } },
          brand: { select: { name: true, slug: true, logoUrl: true } },
          images: { include: { media: { select: { url: true } } }, take: 2 },
          variants: { include: { inventory: { select: { quantity: true } } } },
        },
        orderBy,
        take: limit,
        skip,
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    const formatted = products.map((p) => {
      const defaultVariant = p.variants.find((v) => v.isDefault) || p.variants[0];
      const stock = defaultVariant?.inventory?.quantity || 0;
      const imagesList = p.images.map((img) => img.media?.url || "").filter(Boolean);

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        brand: brand.name,
        brandSlug: brand.slug,
        category: p.category?.name || "",
        price: Math.round(p.basePrice / 100),
        compare_at_price: Math.round((p.compareAtPrice || 0) / 100),
        discount: p.discount,
        rating: p.rating,
        stock,
        inStock: stock > 0,
        images: imagesList,
        primaryImage: imagesList[0] || "",
      };
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({
      brand: {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        logoUrl: brand.logoUrl,
      },
      products: formatted,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("brands/[slug]/products GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch brand products" }, { status: 500 });
  }
}
