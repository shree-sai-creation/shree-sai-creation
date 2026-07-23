import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";
import { generateCombinationSignature } from "@/lib/variantValidation";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const CreateProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().uuid("Invalid category ID"),
  brandId: z.string().uuid("Invalid brand ID").optional().nullable(),
  basePrice: z.number().min(0, "Base price must be non-negative"),
  compareAtPrice: z.number().min(0).optional().nullable(),
  discount: z.number().min(0).max(100).optional().default(0),
  rating: z.number().min(0).max(5).optional().default(5.0),
  isFeatured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  
  // Media IDs linked from Phase 5
  mediaIds: z.array(z.string().uuid()).optional().default([]),
  primaryMediaId: z.string().uuid().optional().nullable(),

  // Key-Value Specifications
  specifications: z.record(z.string(), z.string()).optional().default({}),

  // Initial Default Variant
  sku: z.string().min(1, "SKU is required"),
  stock: z.number().min(0).optional().default(10),
  lowStockThreshold: z.number().min(0).optional().default(5),
});

// GET /api/v1/admin/products — List all catalog products with relations
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
        specifications: true,
        images: { include: { media: true }, orderBy: { sortOrder: "asc" } },
        variants: { include: { inventory: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ products, total: products.length });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/products GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/v1/admin/products — Multi-entity Atomic Product Creation
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const parsed = CreateProductSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const slug = data.slug ? slugify(data.slug) : slugify(data.name);

    // Business Rule Check: Unique Slug & SKU
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      logApiResponse(req, 409, startTime);
      return NextResponse.json({ message: "Product with this slug already exists" }, { status: 409 });
    }

    const existingSku = await prisma.productVariant.findUnique({ where: { sku: data.sku } });
    if (existingSku) {
      logApiResponse(req, 409, startTime);
      return NextResponse.json({ message: "Product variant with this SKU already exists" }, { status: 409 });
    }

    // Atomic Multi-entity Transaction
    const newProduct = await prisma.$transaction(async (tx) => {
      // 1. Create Base Product
      const product = await tx.product.create({
        data: {
          name: data.name,
          slug,
          description: data.description,
          categoryId: data.categoryId,
          brandId: data.brandId || null,
          basePrice: Math.round(data.basePrice * 100),
          compareAtPrice: data.compareAtPrice ? Math.round(data.compareAtPrice * 100) : null,
          discount: data.discount,
          rating: data.rating,
          isFeatured: data.isFeatured,
          isActive: data.isActive,
        },
      });

      // 2. Link Media Images
      if (data.mediaIds.length > 0) {
        let order = 0;
        for (const mediaId of data.mediaIds) {
          const isPrimary = data.primaryMediaId ? mediaId === data.primaryMediaId : order === 0;
          await tx.productImage.create({
            data: {
              productId: product.id,
              mediaId,
              sortOrder: order++,
              isPrimary,
            },
          });
        }
      }

      // 3. Insert Product Specifications
      for (const [key, value] of Object.entries(data.specifications)) {
        await tx.productSpecification.create({
          data: {
            productId: product.id,
            key: key.trim(),
            value: value.trim(),
          },
        });
      }

      // 4. Create Default Variant with Combination Signature
      const variant = await tx.productVariant.create({
        data: {
          productId: product.id,
          sku: data.sku,
          combinationSignature: generateCombinationSignature([]),
          price: Math.round(data.basePrice * 100),
          compareAtPrice: data.compareAtPrice ? Math.round(data.compareAtPrice * 100) : null,
          isDefault: true,
          isActive: true,
        },
      });

      // 5. Create Inventory Record
      await tx.inventory.create({
        data: {
          variantId: variant.id,
          quantity: data.stock,
          lowStockThreshold: data.lowStockThreshold,
          reserved: 0,
        },
      });

      return tx.product.findUnique({
        where: { id: product.id },
        include: {
          category: true,
          brand: true,
          specifications: true,
          images: { include: { media: true } },
          variants: { include: { inventory: true } },
        },
      });
    });

    logApiResponse(req, 201, startTime);
    return NextResponse.json(
      { message: "Product catalog entry created successfully", product: newProduct },
      { status: 201 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/products POST", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 });
  }
}
