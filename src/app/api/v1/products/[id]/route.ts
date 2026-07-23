import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, withSecurity, logApiResponse } from "@/lib/middleware";
import { GENERAL_RATE_LIMIT } from "@/lib/rateLimit";
import { sanitizeObject } from "@/lib/sanitize";

const UpdateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  category: z.string().max(100).optional(),
  price: z.number().min(0).max(100000000).optional(),
  compare_at_price: z.number().min(0).optional(),
  discount: z.number().min(0).max(100).optional(),
  rating: z.number().min(0).max(5).optional(),
  dimensions: z.string().max(200).optional(),
  material: z.string().max(300).optional(),
  finish: z.string().max(300).optional(),
  bulbs: z.string().max(200).optional(),
  stock: z.number().min(0).optional(),
  images: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  specifications: z.record(z.string(), z.string()).optional(),
  related_products: z.array(z.string()).optional(),
  is_active: z.number().min(0).max(1).optional(),
});

// GET product by ID — public
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const securityError = withSecurity(req, GENERAL_RATE_LIMIT);
  if (securityError) return securityError;

  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        specifications: true,
        variants: { include: { inventory: true } },
        images: { include: { media: true } },
      },
    });

    if (!product) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const specsObj: Record<string, string> = {};
    product.specifications.forEach((s) => {
      specsObj[s.key] = s.value;
    });

    const defaultVariant = product.variants.find((v) => v.isDefault) || product.variants[0];

    const formatted = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      category: product.category?.name || "Chandelier",
      price: Math.round(product.basePrice / 100),
      compare_at_price: Math.round((product.compareAtPrice || 0) / 100),
      discount: product.discount,
      rating: product.rating,
      dimensions: specsObj["Dimensions"] || "",
      material: specsObj["Material"] || "",
      finish: specsObj["Finish"] || "",
      bulbs: specsObj["Bulbs"] || "",
      stock: defaultVariant?.inventory?.quantity || 10,
      images: product.images.map((img) => img.media?.url || "").filter(Boolean),
      features: [],
      specifications: specsObj,
      related_products: [],
    };

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ product: formatted });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("products/[id]/GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PUT update product — admin only
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) {
    logApiResponse(req, 403, startTime);
    return authResult.error;
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const sanitized = sanitizeObject(body);
    const parsed = UpdateProductSchema.safeParse(sanitized);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json({ message: parsed.error.issues[0].message }, { status: 400 });
    }

    const data = parsed.data;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.basePrice = Math.round(data.price * 100);
    if (data.compare_at_price !== undefined) updateData.compareAtPrice = Math.round(data.compare_at_price * 100);
    if (data.discount !== undefined) updateData.discount = data.discount;
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.is_active !== undefined) updateData.isActive = Boolean(data.is_active);

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ message: "Product updated", product: updated });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("products/[id]/PUT", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// DELETE product — admin only
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) {
    logApiResponse(req, 403, startTime);
    return authResult.error;
  }

  try {
    const { id } = await params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("products/[id]/DELETE", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
