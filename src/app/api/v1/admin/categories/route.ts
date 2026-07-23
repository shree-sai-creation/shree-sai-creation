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

const CategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  slug: z.string().optional(),
  description: z.string().optional().default(""),
  parentId: z.string().uuid("Invalid parent category ID").optional().nullable(),
});

// GET /api/v1/admin/categories — List categories with hierarchy
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        children: { select: { id: true, name: true, slug: true } },
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ categories });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/categories GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST /api/v1/admin/categories — Create category
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const parsed = CategorySchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, description, parentId } = parsed.data;
    const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(name);

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      logApiResponse(req, 409, startTime);
      return NextResponse.json(
        { message: "Category with this slug already exists" },
        { status: 409 }
      );
    }

    if (parentId) {
      const parentCategory = await prisma.category.findUnique({ where: { id: parentId } });
      if (!parentCategory) {
        logApiResponse(req, 404, startTime);
        return NextResponse.json({ message: "Parent category not found" }, { status: 404 });
      }
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        parentId: parentId || null,
      },
    });

    logApiResponse(req, 201, startTime);
    return NextResponse.json(
      { message: "Category created successfully", category },
      { status: 201 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/categories POST", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to create category" }, { status: 500 });
  }
}
