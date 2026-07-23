import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";
import { generateCombinationSignature, validateVariantCombination } from "@/lib/variantValidation";

const VariantUpdateSchema = z.object({
  sku: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  compareAtPrice: z.number().min(0).optional().nullable(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  attributeValueIds: z.array(z.string().uuid()).optional(),
});

// GET /api/v1/admin/variants/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const variant = await prisma.productVariant.findUnique({
      where: { id },
      include: {
        inventory: true,
        attributeValues: { include: { attributeValue: { include: { attribute: true } } } },
        product: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!variant) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ success: false, message: "Product variant not found" }, { status: 404 });
    }

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ success: true, variant });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/variants/[id] GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ success: false, message: "Failed to fetch variant" }, { status: 500 });
  }
}

// PUT /api/v1/admin/variants/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = VariantUpdateSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message, message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.productVariant.findUnique({ where: { id } });
    if (!existing) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ success: false, message: "Product variant not found" }, { status: 404 });
    }

    const data = parsed.data;

    // Check SKU collision if SKU is changing
    if (data.sku && data.sku !== existing.sku) {
      const skuCheck = await prisma.productVariant.findUnique({ where: { sku: data.sku } });
      if (skuCheck) {
        logApiResponse(req, 409, startTime);
        return NextResponse.json(
          { success: false, error: "Variant with this SKU already exists", message: "Variant with this SKU already exists" },
          { status: 409 }
        );
      }
    }

    let newSignature: string | undefined = undefined;

    // Validate Variant Attribute Combination Uniqueness
    if (data.attributeValueIds) {
      newSignature = generateCombinationSignature(data.attributeValueIds);
      const combinationCheck = await validateVariantCombination({
        productId: existing.productId,
        attributeValueIds: data.attributeValueIds,
        currentVariantId: id,
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

    const updated = await prisma.$transaction(async (tx) => {
      await tx.productVariant.update({
        where: { id },
        data: {
          sku: data.sku !== undefined ? data.sku : undefined,
          combinationSignature: newSignature !== undefined ? newSignature : undefined,
          price: data.price !== undefined ? Math.round(data.price * 100) : undefined,
          compareAtPrice: data.compareAtPrice !== undefined ? (data.compareAtPrice ? Math.round(data.compareAtPrice * 100) : null) : undefined,
          isActive: data.isActive !== undefined ? data.isActive : undefined,
          isDefault: data.isDefault !== undefined ? data.isDefault : undefined,
        },
      });

      if (data.attributeValueIds) {
        await tx.variantAttributeValue.deleteMany({ where: { variantId: id } });
        for (const attrValId of data.attributeValueIds) {
          await tx.variantAttributeValue.create({
            data: {
              variantId: id,
              attributeValueId: attrValId,
            },
          });
        }
      }

      return tx.productVariant.findUnique({
        where: { id },
        include: {
          inventory: true,
          attributeValues: { include: { attributeValue: true } },
        },
      });
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ success: true, message: "Variant updated successfully", variant: updated });
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
    logError("admin/variants/[id] PUT", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ success: false, message: "Failed to update variant" }, { status: 500 });
  }
}

// DELETE /api/v1/admin/variants/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;

    const existing = await prisma.productVariant.findUnique({ where: { id } });
    if (!existing) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ success: false, message: "Variant not found" }, { status: 404 });
    }

    await prisma.productVariant.update({
      where: { id },
      data: { isActive: false },
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ success: true, message: "Variant deactivated successfully" });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/variants/[id] DELETE", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ success: false, message: "Failed to delete variant" }, { status: 500 });
  }
}
