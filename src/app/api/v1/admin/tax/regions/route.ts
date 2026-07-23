import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

const TaxRegionSchema = z.object({
  country: z.string().min(1, "Country is required").max(10).default("IN"),
  state: z.string().nullable().optional(),
});

// GET /api/v1/admin/tax/regions — List all tax regions with rules
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const regions = await prisma.taxRegion.findMany({
      include: {
        taxRules: {
          orderBy: { name: "asc" },
        },
      },
      orderBy: [{ country: "asc" }, { state: "asc" }],
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ regions });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/tax/regions GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json(
      { message: "Failed to fetch tax regions" },
      { status: 500 }
    );
  }
}

// POST /api/v1/admin/tax/regions — Create a new tax region
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const parsed = TaxRegionSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { country, state } = parsed.data;
    const normCountry = country.toUpperCase();
    const normState = state ? state.trim() : null;

    // Check if region already exists
    const existing = await prisma.taxRegion.findFirst({
      where: {
        country: normCountry,
        state: normState,
      },
    });

    if (existing) {
      logApiResponse(req, 409, startTime);
      return NextResponse.json(
        { message: "Tax region for this country and state already exists" },
        { status: 409 }
      );
    }

    const region = await prisma.taxRegion.create({
      data: {
        country: normCountry,
        state: normState,
      },
      include: {
        taxRules: true,
      },
    });

    logApiResponse(req, 201, startTime);
    return NextResponse.json(
      { message: "Tax region created successfully", region },
      { status: 201 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/tax/regions POST", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json(
      { message: "Failed to create tax region" },
      { status: 500 }
    );
  }
}
