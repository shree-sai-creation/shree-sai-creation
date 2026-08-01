import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { withSecurity, logApiResponse } from "@/lib/middleware";
import { GENERAL_RATE_LIMIT } from "@/lib/rateLimit";

// GET product by slug — public product details with related products & SEO metadata
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const startTime = Date.now();
  const securityError = withSecurity(req, GENERAL_RATE_LIMIT);
  if (securityError) return securityError;

  try {
    const { slug } = await params;

    if (!/^[a-z0-9-]{1,200}$/.test(slug)) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json({ message: "Invalid product slug" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true, logoUrl: true, description: true } },
        specifications: { select: { key: true, value: true } },
        images: {
          include: { media: { select: { url: true } } },
          orderBy: { sortOrder: "asc" },
        },
        variants: {
          include: {
            inventory: { select: { quantity: true, reserved: true, lowStockThreshold: true } },
            attributeValues: {
              include: { attributeValue: { include: { attribute: { select: { name: true } } } } },
            },
          },
        },
      },
    });

    if (!product || !product.isActive) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Key-Value specifications mapping
    const specsObj: Record<string, string> = {};
    product.specifications.forEach((s) => {
      specsObj[s.key] = s.value;
    });

    const defaultVariant = product.variants.find((v) => v.isDefault) || product.variants[0];
    const totalStock = product.variants.reduce(
      (acc, v) => acc + (v.inventory ? Math.max(0, v.inventory.quantity - v.inventory.reserved) : 0),
      0
    );
    let imagesList = product.images.map((img) => img.media?.url || "").filter(Boolean);
    if (imagesList.length === 0) {
      imagesList = [
        "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=1200",
        "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?q=80&w=1200",
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200",
      ];
    }

    // Fetch up to 8 Related Products (same category or brand, excluding current product)
    const relatedProducts = await prisma.product.findMany({
      where: {
        id: { not: product.id },
        isActive: true,
        OR: [
          { categoryId: product.categoryId },
          ...(product.brandId ? [{ brandId: product.brandId }] : []),
        ],
      },
      include: {
        category: { select: { name: true } },
        images: { include: { media: { select: { url: true } } }, take: 1 },
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    });

    const formattedRelated = relatedProducts.map((rp) => ({
      id: rp.id,
      name: rp.name,
      slug: rp.slug,
      price: Math.round(rp.basePrice / 100),
      compare_at_price: Math.round((rp.compareAtPrice || 0) / 100),
      discount: rp.discount,
      category: rp.category?.name || "",
      image: rp.images[0]?.media?.url || "",
    }));

    // Formatted Variants
    const formattedVariants = product.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      price: Math.round(v.price / 100),
      compare_at_price: Math.round((v.compareAtPrice || 0) / 100),
      isDefault: v.isDefault,
      stock: v.inventory ? Math.max(0, v.inventory.quantity - v.inventory.reserved) : 0,
      attributes: v.attributeValues.map((av) => ({
        name: av.attributeValue.attribute.name,
        value: av.attributeValue.value,
      })),
    }));

    // SEO Metadata Object
    const seo = {
      title: `${product.name} | Shree Sai Creation Luxury Lighting`,
      description: product.description.slice(0, 160),
      canonicalUrl: `https://shreesaicreation.com/shop/${product.slug}`,
      openGraphImage: imagesList[0] || "",
    };

    const formattedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      category: product.category?.name || "Chandelier",
      categoryDetails: product.category,
      brand: product.brand?.name || null,
      brandDetails: product.brand,
      price: Math.round(product.basePrice / 100),
      compare_at_price: Math.round((product.compareAtPrice || 0) / 100),
      discount: product.discount,
      rating: product.rating,
      dimensions: specsObj["Dimensions"] || "",
      material: specsObj["Material"] || "",
      finish: specsObj["Finish"] || "",
      bulbs: specsObj["Bulbs"] || "",
      stock: totalStock || (defaultVariant?.inventory?.quantity || 10),
      inStock: totalStock > 0,
      images: imagesList,
      primaryImage: imagesList[0] || "",
      features: [],
      specifications: specsObj,
      variants: formattedVariants,
      related_products: formattedRelated,
      seo,
    };

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ product: formattedProduct });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("products/slug/GET", err);

    // Fallback for local development when local database is offline
    try {
      const { slug } = await params;
      const { PRODUCTS } = await import("@/data/products");
      const found = PRODUCTS.find((p) => p.slug === slug || p.id === slug);
      if (found) {
        logApiResponse(req, 200, startTime);
        return NextResponse.json({ product: { ...found, related_products: [] } });
      }
    } catch (e) {
      console.error("Fallback error:", e);
    }

    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
