import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

const TaxRuleSchema = z.object({
  regionId: z.string().uuid("Invalid region ID"),
  name: z.string().min(1, "Tax rule name is required").max(100),
  rate: z.number().min(0, "Tax rate must be non-negative").max(100, "Tax rate cannot exceed 100%"),
  isInclusive: z.boolean().optional().default(true),
});

// POST /api/v1/admin/tax/rules — Create a tax rule under a tax region
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const parsed = TaxRuleSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { regionId, name, rate, isInclusive } = parsed.data;

    const region = await prisma.taxRegion.findUnique({ where: { id: regionId } });
    if (!region) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json(
        { message: "Tax region not found" },
        { status: 404 }
      );
    }

    const rule = await prisma.taxRule.create({
      data: {
        regionId,
        name,
        rate,
        isInclusive,
      },
    });

    logApiResponse(req, 201, startTime);
    return NextResponse.json(
      { message: "Tax rule created successfully", rule },
      { status: 201 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/tax/rules POST", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json(
      { message: "Failed to create tax rule" },
      { status: 500 }
    );
  }
}
