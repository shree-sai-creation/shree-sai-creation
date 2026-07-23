import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

const MethodUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  isMinOrder: z.boolean().optional(),
});

// PUT /api/v1/admin/shipping/methods/[id]
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
    const parsed = MethodUpdateSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.shippingMethod.findUnique({ where: { id } });
    if (!existing) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json(
        { message: "Shipping method not found" },
        { status: 404 }
      );
    }

    const method = await prisma.shippingMethod.update({
      where: { id },
      data: parsed.data,
      include: { rates: true },
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json(
      { message: "Shipping method updated successfully", method },
      { status: 200 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/shipping/methods/[id] PUT", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json(
      { message: "Failed to update shipping method" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/admin/shipping/methods/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;

    const existing = await prisma.shippingMethod.findUnique({ where: { id } });
    if (!existing) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json(
        { message: "Shipping method not found" },
        { status: 404 }
      );
    }

    await prisma.shippingMethod.delete({ where: { id } });

    logApiResponse(req, 200, startTime);
    return NextResponse.json(
      { message: "Shipping method deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/shipping/methods/[id] DELETE", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json(
      { message: "Failed to delete shipping method" },
      { status: 500 }
    );
  }
}
