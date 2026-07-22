import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import getDb from "@/lib/db";
import { requireAdmin, withSecurity, logApiResponse } from "@/lib/middleware";
import { GENERAL_RATE_LIMIT } from "@/lib/rateLimit";
import { sanitizeObject } from "@/lib/sanitize";

function parseProduct(row: Record<string, unknown>) {
  return {
    ...row,
    images: JSON.parse((row.images as string) || "[]"),
    features: JSON.parse((row.features as string) || "[]"),
    specifications: JSON.parse((row.specifications as string) || "{}"),
    related_products: JSON.parse((row.related_products as string) || "[]"),
  };
}

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  description: z.string().optional().default(""),
  category: z.string().optional().default("Chandelier"),
  price: z.number().min(0, "Price must be positive").max(100000000),
  compare_at_price: z.number().optional().default(0),
  discount: z.number().min(0).max(100).optional().default(0),
  rating: z.number().min(0).max(5).optional().default(5.0),
  dimensions: z.string().optional().default(""),
  material: z.string().optional().default(""),
  finish: z.string().optional().default(""),
  bulbs: z.string().optional().default(""),
  stock: z.number().min(0).optional().default(0),
  images: z.array(z.string().url()).optional().default([]),
  features: z.array(z.string().max(300)).optional().default([]),
  specifications: z.record(z.string(), z.string()).optional().default({}),
  related_products: z.array(z.string()).optional().default([]),
});

// GET all products — public, general rate limit
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const securityError = withSecurity(req, GENERAL_RATE_LIMIT);
  if (securityError) return securityError;

  try {
    const db = getDb();
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 100);
    const offset = Math.max(parseInt(searchParams.get("offset") || "0"), 0);

    let query = "SELECT * FROM products WHERE is_active = 1";
    const params: (string | number)[] = [];

    if (category && category !== "All" && category.length < 100) {
      query += " AND category = ?";
      params.push(category);
    }

    if (search && search.length < 100) {
      // Safe search — use LIKE with prepared statement (no SQL injection)
      query += " AND (name LIKE ? OR description LIKE ?)";
      const safeSearch = `%${search.replace(/[%_]/g, "\\$&")}%`;
      params.push(safeSearch, safeSearch);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const products = db.prepare(query).all(...params) as Record<string, unknown>[];
    const parsed = products.map(parseProduct);

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ products: parsed, total: parsed.length });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("products/GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// POST create product — admin only
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) {
    logApiResponse(req, 403, startTime);
    return authResult.error;
  }

  try {
    const body = await req.json();
    const sanitized = sanitizeObject(body);
    const parsed = ProductSchema.safeParse(sanitized);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const db = getDb();

    const existing = db.prepare("SELECT id FROM products WHERE slug = ?").get(data.slug);
    if (existing) {
      logApiResponse(req, 409, startTime);
      return NextResponse.json(
        { message: "Product with this slug already exists" },
        { status: 409 }
      );
    }

    const result = db
      .prepare(
        `INSERT INTO products (name, slug, description, category, price, compare_at_price, discount, rating, dimensions, material, finish, bulbs, stock, images, features, specifications, related_products)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        data.name, data.slug, data.description, data.category,
        data.price, data.compare_at_price, data.discount, data.rating,
        data.dimensions, data.material, data.finish, data.bulbs, data.stock,
        JSON.stringify(data.images), JSON.stringify(data.features),
        JSON.stringify(data.specifications), JSON.stringify(data.related_products)
      );

    const newProduct = db.prepare("SELECT * FROM products WHERE id = ?").get(result.lastInsertRowid) as Record<string, unknown>;

    logApiResponse(req, 201, startTime);
    return NextResponse.json(
      { message: "Product created successfully", product: parseProduct(newProduct) },
      { status: 201 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("products/POST", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
