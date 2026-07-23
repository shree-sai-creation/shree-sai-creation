import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) {
    logApiResponse(req, 403, startTime);
    return authResult.error;
  }

  try {
    const body = await req.json();
    const { products } = body;

    if (!Array.isArray(products) || products.length === 0) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: "Valid array of products is required" },
        { status: 400 }
      );
    }

    let insertedCount = 0;

    for (const p of products) {
      const name = String(p.name || "Untitled Product").trim();
      const slug = p.slug ? slugify(String(p.slug)) : slugify(name);

      const categoryName = String(p.category || "Chandelier");
      let category = await prisma.category.findFirst({
        where: { name: { equals: categoryName, mode: "insensitive" } },
      });

      if (!category) {
        category = await prisma.category.create({
          data: { name: categoryName, slug: slugify(categoryName) },
        });
      }

      const price = Math.max(0, Number(p.price) || 0);
      const stock = Math.max(0, Number(p.stock) || 10);

      await prisma.product.create({
        data: {
          name,
          slug,
          description: String(p.description || ""),
          basePrice: Math.round(price * 100),
          compareAtPrice: Math.round((Number(p.compare_at_price || p.compareAtPrice) || 0) * 100),
          discount: Math.max(0, Math.min(100, Number(p.discount) || 0)),
          rating: Math.max(0, Math.min(5, Number(p.rating) || 5.0)),
          categoryId: category.id,
          variants: {
            create: {
              sku: `SKU-${slug.toUpperCase()}`,
              price: Math.round(price * 100),
              isDefault: true,
              inventory: {
                create: {
                  quantity: stock,
                },
              },
            },
          },
        },
      });

      insertedCount++;
    }

    logApiResponse(req, 201, startTime);
    return NextResponse.json({
      message: `Successfully imported ${insertedCount} products into database!`,
      count: insertedCount,
    });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/products/bulk/POST", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to bulk import products" }, { status: 500 });
  }
}
