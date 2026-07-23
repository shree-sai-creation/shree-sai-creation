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

const CategoryUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().uuid().optional().nullable(),
});

// GET /api/v1/admin/categories/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ category });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/categories/[id] GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch category" }, { status: 500 });
  }
}

// PUT /api/v1/admin/categories/[id]
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
    const parsed = CategoryUpdateSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    const data = parsed.data;
    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = slugify(data.slug);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.parentId !== undefined) {
      if (data.parentId === id) {
        return NextResponse.json({ message: "Category cannot be its own parent" }, { status: 400 });
      }
      updateData.parentId = data.parentId;
    }

    const updated = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ message: "Category updated", category: updated });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/categories/[id] PUT", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to update category" }, { status: 500 });
  }
}

// DELETE /api/v1/admin/categories/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;

    const existing = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true, children: true } } },
    });

    if (!existing) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    // Business Rule Check: Prevent deleting category with active products or subcategories
    if (existing._count.products > 0) {
      logApiResponse(req, 409, startTime);
      return NextResponse.json(
        { message: `Cannot delete category containing ${existing._count.products} active products. Reassign products first.` },
        { status: 409 }
      );
    }

    if (existing._count.children > 0) {
      logApiResponse(req, 409, startTime);
      return NextResponse.json(
        { message: `Cannot delete category containing ${existing._count.children} child subcategories.` },
        { status: 409 }
      );
    }

    await prisma.category.delete({ where: { id } });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/categories/[id] DELETE", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to delete category" }, { status: 500 });
  }
}
