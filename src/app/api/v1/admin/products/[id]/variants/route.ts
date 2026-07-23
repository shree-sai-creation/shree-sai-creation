import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";
import { generateCombinationSignature, validateVariantCombination } from "@/lib/variantValidation";

const CreateVariantSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  price: z.number().min(0, "Price must be non-negative"),
  compareAtPrice: z.number().min(0).optional().nullable(),
  isDefault: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  stock: z.number().min(0).optional().default(0),
  lowStockThreshold: z.number().min(0).optional().default(5),
  attributeValueIds: z.array(z.string().uuid()).optional().default([]),
});

// GET /api/v1/admin/products/[id]/variants — List variants for a product
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const variants = await prisma.productVariant.findMany({
      where: { productId: id },
      include: {
        inventory: true,
        attributeValues: { include: { attributeValue: { include: { attribute: true } } } },
      },
      orderBy: { createdAt: "asc" },
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ success: true, variants });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/products/[id]/variants GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ success: false, message: "Failed to fetch variants" }, { status: 500 });
  }
}

// POST /api/v1/admin/products/[id]/variants — Add a new variant with DB-enforced combination signature uniqueness
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id: productId } = await params;
    const body = await req.json();
    const parsed = CreateVariantSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message, message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 1. Check Product existence
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // 2. Check SKU uniqueness
    const existingSku = await prisma.productVariant.findUnique({ where: { sku: data.sku } });
    if (existingSku) {
      logApiResponse(req, 409, startTime);
      return NextResponse.json(
        { success: false, error: "Variant with this SKU already exists", message: "Variant with this SKU already exists" },
        { status: 409 }
      );
    }

    // 3. Pre-flight check & signature calculation
    const signature = generateCombinationSignature(data.attributeValueIds);
    if (data.attributeValueIds && data.attributeValueIds.length > 0) {
      const combinationCheck = await validateVariantCombination({
        productId,
        attributeValueIds: data.attributeValueIds,
      });

      if (combinationCheck.isDuplicate) {
        logApiResponse(req, 409, startTime);
        return NextResponse.json(
          {
            success: false,
            error: combinationCheck.error || "Variant combination already exists for this product.",
            message: combinationCheck.error || "Variant combination already exists for this product.",
          },
          { status: 409 }
        );
      }
    }

    // 4. Atomic Variant & Inventory Creation Transaction (DB unique constraint is final authority)
    const newVariant = await prisma.$transaction(async (tx) => {
      const variant = await tx.productVariant.create({
        data: {
          productId,
          sku: data.sku,
          combinationSignature: signature,
          price: Math.round(data.price * 100),
          compareAtPrice: data.compareAtPrice ? Math.round(data.compareAtPrice * 100) : null,
          isDefault: data.isDefault,
          isActive: data.isActive,
        },
      });

      for (const attrValId of data.attributeValueIds) {
        await tx.variantAttributeValue.create({
          data: {
            variantId: variant.id,
            attributeValueId: attrValId,
          },
        });
      }

      await tx.inventory.create({
        data: {
          variantId: variant.id,
          quantity: data.stock,
          lowStockThreshold: data.lowStockThreshold,
          reserved: 0,
        },
      });

      return tx.productVariant.findUnique({
        where: { id: variant.id },
        include: {
          inventory: true,
          attributeValues: { include: { attributeValue: true } },
        },
      });
    });

    logApiResponse(req, 201, startTime);
    return NextResponse.json(
      { success: true, message: "Product variant created successfully", variant: newVariant },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      logApiResponse(req, 409, startTime);
      return NextResponse.json(
        {
          success: false,
          error: "Variant combination already exists for this product.",
          message: "Variant combination already exists for this product.",
        },
        { status: 409 }
      );
    }

    const { logError } = await import("@/lib/logger");
    logError("admin/products/[id]/variants POST", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ success: false, message: "Failed to create variant" }, { status: 500 });
  }
}
