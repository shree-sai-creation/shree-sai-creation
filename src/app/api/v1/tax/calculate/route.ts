import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { logApiResponse } from "@/lib/middleware";

const TaxCalcSchema = z.object({
  country: z.string().min(1, "Country is required").default("IN"),
  state: z.string().optional().default(""),
  subtotal: z.number().min(0, "Subtotal must be non-negative").default(0),
});

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const parsed = TaxCalcSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { country, state, subtotal } = parsed.data;
    const normCountry = country.toUpperCase();
    const normState = state.trim().toLowerCase();

    // 1. Fetch matching tax regions
    const regions = await prisma.taxRegion.findMany({
      where: {
        country: normCountry,
      },
      include: {
        taxRules: true,
      },
    });

    let taxRate = 8.0; // Default baseline rate (8%) if DB unseeded
    let isInclusive = false;

    if (regions.length > 0) {
      // Find state match or country default match
      const matchingRegion =
        regions.find(
          (r) => r.state && r.state.trim().toLowerCase() === normState
        ) ||
        regions.find((r) => !r.state) ||
        regions[0];

      if (matchingRegion && matchingRegion.taxRules.length > 0) {
        // Aggregate active rules for matching region
        const totalRate = matchingRegion.taxRules.reduce((acc, rule) => acc + rule.rate, 0);
        taxRate = totalRate;
        isInclusive = matchingRegion.taxRules.some((r) => r.isInclusive);
      }
    }

    const taxAmount = Math.round((subtotal * taxRate) / 100);
    const total = subtotal + taxAmount;

    logApiResponse(req, 200, startTime);
    return NextResponse.json({
      taxRate,
      taxAmount,
      total,
      isInclusive,
    });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("tax/calculate POST", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json(
      { message: "Failed to calculate tax" },
      { status: 500 }
    );
  }
}
