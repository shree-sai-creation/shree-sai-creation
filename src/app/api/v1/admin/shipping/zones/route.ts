import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

const ZoneSchema = z.object({
  name: z.string().min(1, "Zone name is required").max(100),
  country: z.string().min(1, "Country is required").max(10).default("IN"),
  states: z.array(z.string()).default([]),
});

// GET /api/v1/admin/shipping/zones — List all shipping zones with methods & rates
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const zones = await prisma.shippingZone.findMany({
      include: {
        methods: {
          include: {
            rates: {
              orderBy: { price: "asc" },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ zones });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/shipping/zones GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json(
      { message: "Failed to fetch shipping zones" },
      { status: 500 }
    );
  }
}

// POST /api/v1/admin/shipping/zones — Create a new shipping zone
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const parsed = ZoneSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, country, states } = parsed.data;

    const zone = await prisma.shippingZone.create({
      data: {
        name,
        country: country.toUpperCase(),
        states: states.map((s) => s.trim()).filter(Boolean),
      },
      include: {
        methods: {
          include: { rates: true },
        },
      },
    });

    logApiResponse(req, 201, startTime);
    return NextResponse.json(
      { message: "Shipping zone created successfully", zone },
      { status: 201 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/shipping/zones POST", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json(
      { message: "Failed to create shipping zone" },
      { status: 500 }
    );
  }
}
