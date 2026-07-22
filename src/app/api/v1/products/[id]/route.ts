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
  features: z.array(z.string().max(300)).optional(),
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
    if (!/^\d+$/.test(id)) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
    }

    const db = getDb();
    const product = db
      .prepare("SELECT * FROM products WHERE id = ?")
      .get(id) as Record<string, unknown> | undefined;

    if (!product) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ product: parseProduct(product) });
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
    if (!/^\d+$/.test(id)) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
    }

    const body = await req.json();
    const sanitized = sanitizeObject(body);
    const parsed = UpdateProductSchema.safeParse(sanitized);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json({ message: parsed.error.issues[0].message }, { status: 400 });
    }

    const data = parsed.data;
    const db = getDb();

    const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as Record<string, unknown> | undefined;
    if (!existing) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const updates: string[] = [];
    const values: unknown[] = [];

    if (data.name !== undefined) { updates.push("name = ?"); values.push(data.name); }
    if (data.slug !== undefined) { updates.push("slug = ?"); values.push(data.slug); }
    if (data.description !== undefined) { updates.push("description = ?"); values.push(data.description); }
    if (data.category !== undefined) { updates.push("category = ?"); values.push(data.category); }
    if (data.price !== undefined) { updates.push("price = ?"); values.push(data.price); }
    if (data.compare_at_price !== undefined) { updates.push("compare_at_price = ?"); values.push(data.compare_at_price); }
    if (data.discount !== undefined) { updates.push("discount = ?"); values.push(data.discount); }
    if (data.rating !== undefined) { updates.push("rating = ?"); values.push(data.rating); }
    if (data.dimensions !== undefined) { updates.push("dimensions = ?"); values.push(data.dimensions); }
    if (data.material !== undefined) { updates.push("material = ?"); values.push(data.material); }
    if (data.finish !== undefined) { updates.push("finish = ?"); values.push(data.finish); }
    if (data.bulbs !== undefined) { updates.push("bulbs = ?"); values.push(data.bulbs); }
    if (data.stock !== undefined) { updates.push("stock = ?"); values.push(data.stock); }
    if (data.images !== undefined) { updates.push("images = ?"); values.push(JSON.stringify(data.images)); }
    if (data.features !== undefined) { updates.push("features = ?"); values.push(JSON.stringify(data.features)); }
    if (data.specifications !== undefined) { updates.push("specifications = ?"); values.push(JSON.stringify(data.specifications)); }
    if (data.related_products !== undefined) { updates.push("related_products = ?"); values.push(JSON.stringify(data.related_products)); }
    if (data.is_active !== undefined) { updates.push("is_active = ?"); values.push(data.is_active); }

    if (updates.length === 0) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json({ message: "No fields to update" }, { status: 400 });
    }

    updates.push("updated_at = datetime('now')");
    values.push(id);

    db.prepare(`UPDATE products SET ${updates.join(", ")} WHERE id = ?`).run(...values);
    const updated = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as Record<string, unknown>;

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ message: "Product updated", product: parseProduct(updated) });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("products/[id]/PUT", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// DELETE product — admin only (soft delete)
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
    if (!/^\d+$/.test(id)) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare("SELECT id FROM products WHERE id = ?").get(id);
    if (!existing) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Soft delete
    db.prepare("UPDATE products SET is_active = 0, updated_at = datetime('now') WHERE id = ?").run(id);

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("products/[id]/DELETE", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
