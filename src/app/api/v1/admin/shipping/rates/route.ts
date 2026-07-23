import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

const RateSchema = z.object({
  methodId: z.string().uuid("Invalid method ID"),
  minWeightKg: z.number().min(0, "Min weight must be non-negative").default(0),
  maxWeightKg: z.number().min(0).nullable().optional(),
  price: z.number().min(0, "Shipping price must be non-negative"),
  estimatedDaysMin: z.number().min(1, "Est min days must be at least 1").default(3),
  estimatedDaysMax: z.number().min(1, "Est max days must be at least 1").default(7),
});

// POST /api/v1/admin/shipping/rates — Create shipping rate for a method
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const parsed = RateSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const {
      methodId,
      minWeightKg,
      maxWeightKg,
      price,
      estimatedDaysMin,
      estimatedDaysMax,
    } = parsed.data;

    if (maxWeightKg !== undefined && maxWeightKg !== null && maxWeightKg < minWeightKg) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: "Max weight cannot be less than min weight" },
        { status: 400 }
      );
    }

    if (estimatedDaysMax < estimatedDaysMin) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: "Max estimated days cannot be less than min estimated days" },
        { status: 400 }
      );
    }

    const method = await prisma.shippingMethod.findUnique({ where: { id: methodId } });
    if (!method) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json(
        { message: "Shipping method not found" },
        { status: 404 }
      );
    }

    const rate = await prisma.shippingRate.create({
      data: {
        methodId,
        minWeightKg,
        maxWeightKg,
        price,
        estimatedDaysMin,
        estimatedDaysMax,
      },
    });

    logApiResponse(req, 201, startTime);
    return NextResponse.json(
      { message: "Shipping rate created successfully", rate },
      { status: 201 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/shipping/rates POST", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json(
      { message: "Failed to create shipping rate" },
      { status: 500 }
    );
  }
}
