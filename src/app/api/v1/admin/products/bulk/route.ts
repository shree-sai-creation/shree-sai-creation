import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// POST /api/v1/admin/products/bulk — Bulk insert products into SQLite DB
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

    const db = getDb();

    const insertStmt = db.prepare(`
      INSERT INTO products (
        name, slug, description, category, price, compare_at_price, discount,
        rating, dimensions, material, finish, bulbs, stock, images, features,
        specifications, related_products
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let insertedCount = 0;
    const existingSlugs = new Set(
      (db.prepare("SELECT slug FROM products").all() as { slug: string }[]).map(
        (r) => r.slug
      )
    );

    // Database transaction for speed and integrity
    const insertTransaction = db.transaction((items: Record<string, unknown>[]) => {
      for (const p of items) {
        const name = String(p.name || "Untitled Product").trim();
        let slug = p.slug ? slugify(String(p.slug)) : slugify(name);
        
        // Ensure unique slug
        let counter = 1;
        const originalSlug = slug;
        while (existingSlugs.has(slug)) {
          slug = `${originalSlug}-${counter++}`;
        }
        existingSlugs.add(slug);

        const description = String(p.description || "");
        const category = String(p.category || "Chandelier");
        const price = Math.max(0, Number(p.price) || 0);
        const compareAtPrice = Math.max(0, Number(p.compare_at_price || p.compareAtPrice) || 0);
        const discount = Math.max(0, Math.min(100, Number(p.discount) || 0));
        const rating = Math.max(0, Math.min(5, Number(p.rating) || 5.0));
        const dimensions = String(p.dimensions || "");
        const material = String(p.material || "");
        const finish = String(p.finish || "");
        const bulbs = String(p.bulbs || "");
        const stock = Math.max(0, Number(p.stock) || 10);

        // Images handling
        let imagesArr: string[] = [];
        if (Array.isArray(p.images)) {
          imagesArr = p.images.map(String);
        } else if (typeof p.images === "string") {
          imagesArr = p.images.split(",").map((s) => s.trim()).filter(Boolean);
        }

        // Features handling
        let featuresArr: string[] = [];
        if (Array.isArray(p.features)) {
          featuresArr = p.features.map(String);
        } else if (typeof p.features === "string") {
          featuresArr = p.features.split(",").map((s) => s.trim()).filter(Boolean);
        }

        // Specifications handling
        let specsObj: Record<string, string> = {};
        if (p.specifications && typeof p.specifications === "object" && !Array.isArray(p.specifications)) {
          specsObj = p.specifications as Record<string, string>;
        }

        insertStmt.run(
          name,
          slug,
          description,
          category,
          price,
          compareAtPrice,
          discount,
          rating,
          dimensions,
          material,
          finish,
          bulbs,
          stock,
          JSON.stringify(imagesArr),
          JSON.stringify(featuresArr),
          JSON.stringify(specsObj),
          JSON.stringify([])
        );

        insertedCount++;
      }
    });

    insertTransaction(products);

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
