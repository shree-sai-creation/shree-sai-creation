import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

const AttributeSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  name: z.string().min(1, "Attribute name required (e.g. Finish, Size, Voltage)").max(100),
  values: z.array(z.string().min(1)).min(1, "At least one attribute value is required"),
});

// GET /api/v1/admin/attributes — List all product attributes
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    const whereClause: Record<string, unknown> = {};
    if (productId) whereClause.productId = productId;

    const attributes = await prisma.productAttribute.findMany({
      where: whereClause,
      include: {
        values: true,
        product: { select: { id: true, name: true } },
      },
      orderBy: { name: "asc" },
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ attributes });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/attributes GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch attributes" }, { status: 500 });
  }
}

// POST /api/v1/admin/attributes — Create attribute & values
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const parsed = AttributeSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { productId, name, values } = parsed.data;

    const attribute = await prisma.$transaction(async (tx) => {
      const attr = await tx.productAttribute.create({
        data: {
          productId,
          name,
        },
      });

      for (const val of values) {
        await tx.attributeValue.create({
          data: {
            attributeId: attr.id,
            value: val.trim(),
          },
        });
      }

      return tx.productAttribute.findUnique({
        where: { id: attr.id },
        include: { values: true },
      });
    });

    logApiResponse(req, 201, startTime);
    return NextResponse.json(
      { message: "Attribute and values created successfully", attribute },
      { status: 201 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/attributes POST", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to create attribute" }, { status: 500 });
  }
}
