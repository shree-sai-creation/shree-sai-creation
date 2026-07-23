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

const BrandSchema = z.object({
  name: z.string().min(1, "Brand name is required").max(100),
  slug: z.string().optional(),
  description: z.string().optional().default(""),
  logoUrl: z.string().optional().default(""),
});

// GET /api/v1/admin/brands — List brands
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const brands = await prisma.brand.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ brands });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/brands GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch brands" }, { status: 500 });
  }
}

// POST /api/v1/admin/brands — Create brand
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const parsed = BrandSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, description, logoUrl } = parsed.data;
    const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(name);

    const existing = await prisma.brand.findUnique({ where: { slug } });
    if (existing) {
      logApiResponse(req, 409, startTime);
      return NextResponse.json(
        { message: "Brand with this slug or name already exists" },
        { status: 409 }
      );
    }

    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        description,
        logoUrl,
      },
    });

    logApiResponse(req, 201, startTime);
    return NextResponse.json(
      { message: "Brand created successfully", brand },
      { status: 201 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/brands POST", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to create brand" }, { status: 500 });
  }
}
