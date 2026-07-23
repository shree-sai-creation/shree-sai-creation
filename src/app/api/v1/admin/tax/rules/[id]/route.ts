import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

const TaxRuleUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  rate: z.number().min(0).max(100).optional(),
  isInclusive: z.boolean().optional(),
});

// PUT /api/v1/admin/tax/rules/[id]
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
    const parsed = TaxRuleUpdateSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.taxRule.findUnique({ where: { id } });
    if (!existing) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json(
        { message: "Tax rule not found" },
        { status: 404 }
      );
    }

    const rule = await prisma.taxRule.update({
      where: { id },
      data: parsed.data,
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json(
      { message: "Tax rule updated successfully", rule },
      { status: 200 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/tax/rules/[id] PUT", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json(
      { message: "Failed to update tax rule" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/admin/tax/rules/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;

    const existing = await prisma.taxRule.findUnique({ where: { id } });
    if (!existing) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json(
        { message: "Tax rule not found" },
        { status: 404 }
      );
    }

    await prisma.taxRule.delete({ where: { id } });

    logApiResponse(req, 200, startTime);
    return NextResponse.json(
      { message: "Tax rule deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/tax/rules/[id] DELETE", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json(
      { message: "Failed to delete tax rule" },
      { status: 500 }
    );
  }
}
