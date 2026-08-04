import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, withSecurity, logApiResponse } from "@/lib/middleware";
import { GENERAL_RATE_LIMIT } from "@/lib/rateLimit";
import { sanitizeObject } from "@/lib/sanitize";

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  description: z.string().optional().default(""),
  category: z.string().optional().default("Chandelier"),
  price: z.number().min(0, "Price must be positive").max(100000000),
  compare_at_price: z.number().optional().default(0),
  discount: z.number().min(0).max(100).optional().default(0),
  rating: z.number().min(0).max(5).optional().default(5.0),
  dimensions: z.string().optional().default(""),
  material: z.string().optional().default(""),
  finish: z.string().optional().default(""),
  bulbs: z.string().optional().default(""),
  stock: z.number().min(0).optional().default(0),
  images: z.array(z.string()).optional().default([]),
  features: z.array(z.string()).optional().default([]),
  specifications: z.record(z.string(), z.string()).optional().default({}),
  related_products: z.array(z.string()).optional().default([]),
});

// GET /api/v1/products — Public High-Performance Product Listing with Search, Filters, Sorting, and Pagination
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const securityError = withSecurity(req, GENERAL_RATE_LIMIT);
  if (securityError) return securityError;

  try {
    const { searchParams } = new URL(req.url);

    // 1. Pagination parameters
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20"), 1), 10000);
    const skip = (page - 1) * limit;

    // 2. Query & Search parameters
    const search = searchParams.get("q") || searchParams.get("search") || "";
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : null;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : null;
    const inStock = searchParams.get("inStock");
    const isFeatured = searchParams.get("isFeatured") || searchParams.get("featured");
    const rating = searchParams.get("rating") ? parseFloat(searchParams.get("rating")!) : null;
    const sort = searchParams.get("sort") || "newest";

    // 3. Build Prisma Where Clause
    const whereClause: Record<string, unknown> = { isActive: true };

    if (category && category !== "All") {
      whereClause.category = {
        OR: [
          { slug: { equals: category.toLowerCase() } },
          { name: { equals: category, mode: "insensitive" } },
        ],
      };
    }

    if (brand && brand !== "All") {
      whereClause.brand = {
        OR: [
          { slug: { equals: brand.toLowerCase() } },
          { name: { equals: brand, mode: "insensitive" } },
        ],
      };
    }

    if (minPrice !== null || maxPrice !== null) {
      const priceFilter: Record<string, number> = {};
      if (minPrice !== null) priceFilter.gte = Math.round(minPrice * 100);
      if (maxPrice !== null) priceFilter.lte = Math.round(maxPrice * 100);
      whereClause.basePrice = priceFilter;
    }

    if (isFeatured === "true" || isFeatured === "1") {
      whereClause.isFeatured = true;
    }

    if (rating !== null) {
      whereClause.rating = { gte: rating };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { name: { contains: search, mode: "insensitive" } } },
        { brand: { name: { contains: search, mode: "insensitive" } } },
        { variants: { some: { sku: { contains: search, mode: "insensitive" } } } },
      ];
    }

    if (inStock === "true") {
      whereClause.variants = {
        some: {
          inventory: {
            quantity: { gt: 0 },
          },
        },
      };
    }

    // 4. Build Prisma Sort Clause
    let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };
    switch (sort) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "price-low":
      case "price-asc":
        orderBy = { basePrice: "asc" };
        break;
      case "price-high":
      case "price-desc":
        orderBy = { basePrice: "desc" };
        break;
      case "name-asc":
        orderBy = { name: "asc" };
        break;
      case "name-desc":
        orderBy = { name: "desc" };
        break;
      case "rating":
      case "highest-rated":
        orderBy = { rating: "desc" };
        break;
      case "popular":
      case "featured":
        orderBy = { isFeatured: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    // 5. Execute Optimized Query & Count
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true, logoUrl: true } },
          specifications: { select: { key: true, value: true } },
          images: {
            include: { media: { select: { url: true } } },
            orderBy: { sortOrder: "asc" },
          },
          variants: {
            include: {
              inventory: { select: { quantity: true, reserved: true } },
            },
          },
        },
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    const formattedProducts = products.map((p) => {
      const specsObj: Record<string, string> = {};
      p.specifications.forEach((s) => {
        specsObj[s.key] = s.value;
      });

      const defaultVariant = p.variants.find((v) => v.isDefault) || p.variants[0];
      let imagesList = p.images.map((img) => img.media?.url || "").filter(Boolean);

      if (imagesList.length === 0) {
        imagesList = [
          "/products/royal-crystal-chandelier.webp",
          "/products/aurora-gold-chandelier.png",
        ];
      }

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        category: p.category?.name || "Chandelier",
        price: Math.round(p.basePrice / 100),
        compare_at_price: Math.round((p.compareAtPrice || 0) / 100),
        discount: p.discount,
        rating: p.rating,
        dimensions: specsObj["Dimensions"] || "",
        material: specsObj["Material"] || "",
        finish: specsObj["Finish"] || "",
        bulbs: specsObj["Bulbs"] || "",
        stock: defaultVariant?.inventory?.quantity || 10,
        images: imagesList,
        features: [],
        specifications: specsObj,
        related_products: [],
      };
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json(
      {
        products: formattedProducts,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("products/GET", err);

    // Fallback to static mock products array for local development when local db is offline
    try {
      const { PRODUCTS } = await import("@/data/products");
      logApiResponse(req, 200, startTime);
      return NextResponse.json(
        {
          products: PRODUCTS,
          pagination: {
            total: PRODUCTS.length,
            page: 1,
            limit: PRODUCTS.length,
            totalPages: 1,
          },
        },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    } catch {
      logApiResponse(req, 500, startTime);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  }
}

// POST /api/v1/products — Admin product creation
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) {
    logApiResponse(req, 403, startTime);
    return authResult.error;
  }

  try {
    const body = await req.json();
    const sanitized = sanitizeObject(body);
    const parsed = ProductSchema.safeParse(sanitized);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const existing = await prisma.product.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      logApiResponse(req, 409, startTime);
      return NextResponse.json(
        { message: "Product with this slug already exists" },
        { status: 409 }
      );
    }

    const newProduct = await prisma.$transaction(async (tx) => {
      let category = await tx.category.findFirst({
        where: { name: { equals: data.category, mode: "insensitive" } },
      });

      if (!category) {
        const catSlug = data.category.toLowerCase().replace(/[^a-z0-9]/g, "-");
        category = await tx.category.create({
          data: { name: data.category, slug: catSlug },
        });
      }

      const prod = await tx.product.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          basePrice: Math.round(data.price * 100),
          compareAtPrice: Math.round(data.compare_at_price * 100),
          discount: data.discount,
          rating: data.rating,
          categoryId: category.id,
          variants: {
            create: {
              sku: `SKU-${data.slug.toUpperCase()}`,
              combinationSignature: "default",
              price: Math.round(data.price * 100),
              isDefault: true,
              inventory: {
                create: {
                  quantity: data.stock,
                },
              },
            },
          },
        },
      });

      // Save Images on Initial Product Creation
      if (data.images && Array.isArray(data.images)) {
        for (let idx = 0; idx < data.images.length; idx++) {
          const imgUrl = data.images[idx];
          if (!imgUrl) continue;

          let media = await tx.media.findFirst({ where: { url: imgUrl } });
          if (!media) {
            media = await tx.media.create({
              data: {
                url: imgUrl,
                storageKey: `prod-${prod.id.slice(0, 8)}-${idx}`,
                fileName: `product-${prod.id.slice(0, 8)}-${idx}.jpg`,
                mimeType: "image/jpeg",
                fileSize: 102400,
              },
            });
          }

          await tx.productImage.create({
            data: {
              productId: prod.id,
              mediaId: media.id,
              sortOrder: idx,
              isPrimary: idx === 0,
            },
          });
        }
      }

      // Save Specifications on Initial Product Creation
      const specsMap: Record<string, string> = { ...data.specifications };
      if (data.dimensions) specsMap["Dimensions"] = data.dimensions;
      if (data.material) specsMap["Material"] = data.material;
      if (data.finish) specsMap["Finish"] = data.finish;
      if (data.bulbs) specsMap["Bulbs"] = data.bulbs;

      for (const [key, value] of Object.entries(specsMap)) {
        if (!key || !value) continue;
        await tx.productSpecification.create({
          data: { productId: prod.id, key, value },
        });
      }

      return tx.product.findUnique({
        where: { id: prod.id },
        include: {
          category: true,
          specifications: true,
          variants: { include: { inventory: true } },
          images: { include: { media: true }, orderBy: { sortOrder: "asc" } },
        },
      });
    });

    if (!newProduct) {
      logApiResponse(req, 500, startTime);
      return NextResponse.json({ message: "Product creation failed" }, { status: 500 });
    }

    const specsObj: Record<string, string> = {};
    newProduct.specifications.forEach((s) => {
      specsObj[s.key] = s.value;
    });

    const defaultVariant = newProduct.variants.find((v) => v.isDefault) || newProduct.variants[0];
    const imageList = newProduct.images.map((img) => img.media?.url || "").filter(Boolean);

    const formattedProduct = {
      id: newProduct.id,
      name: newProduct.name,
      slug: newProduct.slug,
      description: newProduct.description,
      category: newProduct.category?.name || data.category || "Chandelier",
      price: Math.round(newProduct.basePrice / 100),
      compare_at_price: Math.round((newProduct.compareAtPrice || 0) / 100),
      discount: newProduct.discount,
      rating: newProduct.rating,
      dimensions: specsObj["Dimensions"] || data.dimensions || "",
      material: specsObj["Material"] || data.material || "",
      finish: specsObj["Finish"] || data.finish || "",
      bulbs: specsObj["Bulbs"] || data.bulbs || "",
      stock: defaultVariant?.inventory?.quantity ?? (data.stock || 10),
      images: imageList.length > 0 ? imageList : (data.images || []),
      features: data.features || [],
      specifications: specsObj,
      related_products: [],
    };

    logApiResponse(req, 201, startTime);
    return NextResponse.json(
      { message: "Product created successfully", product: formattedProduct },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("products/POST", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
