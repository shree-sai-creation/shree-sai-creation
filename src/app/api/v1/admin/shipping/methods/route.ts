import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

const MethodSchema = z.object({
  zoneId: z.string().uuid("Invalid zone ID"),
  name: z.string().min(1, "Method name is required").max(100),
  isMinOrder: z.boolean().optional().default(false),
});

// POST /api/v1/admin/shipping/methods — Create a shipping method under a zone
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const parsed = MethodSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { zoneId, name, isMinOrder } = parsed.data;

    const zone = await prisma.shippingZone.findUnique({ where: { id: zoneId } });
    if (!zone) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json(
        { message: "Shipping zone not found" },
        { status: 404 }
      );
    }

    const method = await prisma.shippingMethod.create({
      data: {
        zoneId,
        name,
        isMinOrder,
      },
      include: {
        rates: true,
      },
    });

    logApiResponse(req, 201, startTime);
    return NextResponse.json(
      { message: "Shipping method created successfully", method },
      { status: 201 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/shipping/methods POST", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json(
      { message: "Failed to create shipping method" },
      { status: 500 }
    );
  }
}
