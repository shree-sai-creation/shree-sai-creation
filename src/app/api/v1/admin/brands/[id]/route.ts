import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const BrandUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
});

// GET /api/v1/admin/brands/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!brand) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ brand });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/brands/[id] GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch brand" }, { status: 500 });
  }
}

// PUT /api/v1/admin/brands/[id]
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
    const parsed = BrandUpdateSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.brand.findUnique({ where: { id } });
    if (!existing) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }

    const data = parsed.data;
    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = slugify(data.slug);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.logoUrl !== undefined) updateData.logoUrl = data.logoUrl;

    const updated = await prisma.brand.update({
      where: { id },
      data: updateData,
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ message: "Brand updated", brand: updated });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/brands/[id] PUT", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to update brand" }, { status: 500 });
  }
}

// DELETE /api/v1/admin/brands/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;

    const existing = await prisma.brand.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!existing) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }

    // Business Rule Check: Prevent deleting brand with active products
    if (existing._count.products > 0) {
      logApiResponse(req, 409, startTime);
      return NextResponse.json(
        { message: `Cannot delete brand assigned to ${existing._count.products} active products. Reassign products first.` },
        { status: 409 }
      );
    }

    await prisma.brand.delete({ where: { id } });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ message: "Brand deleted successfully" });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/brands/[id] DELETE", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to delete brand" }, { status: 500 });
  }
}
