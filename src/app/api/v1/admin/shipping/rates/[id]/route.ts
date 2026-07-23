import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

const RateUpdateSchema = z.object({
  minWeightKg: z.number().min(0).optional(),
  maxWeightKg: z.number().min(0).nullable().optional(),
  price: z.number().min(0).optional(),
  estimatedDaysMin: z.number().min(1).optional(),
  estimatedDaysMax: z.number().min(1).optional(),
});

// PUT /api/v1/admin/shipping/rates/[id]
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
    const parsed = RateUpdateSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.shippingRate.findUnique({ where: { id } });
    if (!existing) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json(
        { message: "Shipping rate not found" },
        { status: 404 }
      );
    }

    const rate = await prisma.shippingRate.update({
      where: { id },
      data: parsed.data,
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json(
      { message: "Shipping rate updated successfully", rate },
      { status: 200 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/shipping/rates/[id] PUT", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json(
      { message: "Failed to update shipping rate" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/admin/shipping/rates/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;

    const existing = await prisma.shippingRate.findUnique({ where: { id } });
    if (!existing) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json(
        { message: "Shipping rate not found" },
        { status: 404 }
      );
    }

    await prisma.shippingRate.delete({ where: { id } });

    logApiResponse(req, 200, startTime);
    return NextResponse.json(
      { message: "Shipping rate deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/shipping/rates/[id] DELETE", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json(
      { message: "Failed to delete shipping rate" },
      { status: 500 }
    );
  }
}
