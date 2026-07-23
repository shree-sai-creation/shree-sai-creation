import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

const TaxRegionUpdateSchema = z.object({
  country: z.string().min(1).max(10).optional(),
  state: z.string().nullable().optional(),
});

// PUT /api/v1/admin/tax/regions/[id]
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
    const parsed = TaxRegionUpdateSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.taxRegion.findUnique({ where: { id } });
    if (!existing) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json(
        { message: "Tax region not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (parsed.data.country !== undefined)
      updateData.country = parsed.data.country.toUpperCase();
    if (parsed.data.state !== undefined)
      updateData.state = parsed.data.state ? parsed.data.state.trim() : null;

    const region = await prisma.taxRegion.update({
      where: { id },
      data: updateData,
      include: { taxRules: true },
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json(
      { message: "Tax region updated successfully", region },
      { status: 200 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/tax/regions/[id] PUT", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json(
      { message: "Failed to update tax region" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/admin/tax/regions/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;

    const existing = await prisma.taxRegion.findUnique({ where: { id } });
    if (!existing) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json(
        { message: "Tax region not found" },
        { status: 404 }
      );
    }

    await prisma.taxRegion.delete({ where: { id } });

    logApiResponse(req, 200, startTime);
    return NextResponse.json(
      { message: "Tax region deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/tax/regions/[id] DELETE", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json(
      { message: "Failed to delete tax region" },
      { status: 500 }
    );
  }
}
