import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { logApiResponse } from "@/lib/middleware";

const ShippingCalcSchema = z.object({
  country: z.string().min(1, "Country is required").default("IN"),
  state: z.string().optional().default(""),
  pincode: z.string().optional().default(""),
  cartTotal: z.number().min(0, "Cart total must be non-negative").default(0),
  cartWeight: z.number().min(0).optional().default(1.0),
});

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const parsed = ShippingCalcSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { country, state, cartTotal, cartWeight } = parsed.data;
    const normCountry = country.toUpperCase();
    const normState = state.trim().toLowerCase();

    // 1. Fetch matching shipping zones
    const zones = await prisma.shippingZone.findMany({
      where: {
        country: normCountry,
      },
      include: {
        methods: {
          include: {
            rates: true,
          },
        },
      },
    });

    let bestZone = null;
    let selectedRate = null;
    let selectedMethod = null;

    if (zones.length > 0) {
      // Find zone with matching state or fallback to default zone
      bestZone = zones.find((z) =>
        z.states.some((s) => s.trim().toLowerCase() === normState)
      ) || zones.find((z) => z.states.length === 0) || zones[0];

      if (bestZone && bestZone.methods.length > 0) {
        for (const method of bestZone.methods) {
          if (method.isMinOrder && cartTotal >= 5000) {
            selectedMethod = method;
            selectedRate = {
              price: 0,
              estimatedDaysMin: 3,
              estimatedDaysMax: 5,
            };
            break;
          }

          const rate = method.rates.find((r) => {
            const minOk = cartWeight >= r.minWeightKg;
            const maxOk = r.maxWeightKg === null || cartWeight <= (r.maxWeightKg ?? Infinity);
            return minOk && maxOk;
          }) || method.rates[0];

          if (rate) {
            selectedMethod = method;
            selectedRate = rate;
            break;
          }
        }
      }
    }

    // Dynamic output or smart database-driven fallback
    let shippingMethod = selectedMethod ? selectedMethod.name : "White-Glove Express Delivery";
    let shippingCost = selectedRate ? selectedRate.price : (cartTotal > 5000 || cartTotal === 0 ? 0 : 150);
    let estimatedDaysMin = selectedRate ? selectedRate.estimatedDaysMin : 3;
    let estimatedDaysMax = selectedRate ? selectedRate.estimatedDaysMax : 7;

    // Check high order free shipping rule
    if (cartTotal >= 5000 && (!selectedRate || selectedRate.price > 0)) {
      shippingCost = 0;
      shippingMethod = `${shippingMethod} (Complimentary)`;
    }

    logApiResponse(req, 200, startTime);
    return NextResponse.json({
      shippingMethod,
      shippingCost,
      estimatedDaysMin,
      estimatedDaysMax,
    });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("shipping/calculate POST", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json(
      { message: "Failed to calculate shipping" },
      { status: 500 }
    );
  }
}
