import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

const ZoneUpdateSchema = z.object({
  name: z.string().min(1, "Zone name is required").max(100).optional(),
  country: z.string().min(1).max(10).optional(),
  states: z.array(z.string()).optional(),
});

// PUT /api/v1/admin/shipping/zones/[id]
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
    const parsed = ZoneUpdateSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.shippingZone.findUnique({ where: { id } });
    if (!existing) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json(
        { message: "Shipping zone not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
    if (parsed.data.country !== undefined)
      updateData.country = parsed.data.country.toUpperCase();
    if (parsed.data.states !== undefined)
      updateData.states = parsed.data.states.map((s) => s.trim()).filter(Boolean);

    const zone = await prisma.shippingZone.update({
      where: { id },
      data: updateData,
      include: {
        methods: {
          include: { rates: true },
        },
      },
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json(
      { message: "Shipping zone updated successfully", zone },
      { status: 200 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/shipping/zones/[id] PUT", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json(
      { message: "Failed to update shipping zone" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/admin/shipping/zones/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;

    const existing = await prisma.shippingZone.findUnique({ where: { id } });
    if (!existing) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json(
        { message: "Shipping zone not found" },
        { status: 404 }
      );
    }

    await prisma.shippingZone.delete({ where: { id } });

    logApiResponse(req, 200, startTime);
    return NextResponse.json(
      { message: "Shipping zone deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/shipping/zones/[id] DELETE", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json(
      { message: "Failed to delete shipping zone" },
      { status: 500 }
    );
  }
}
