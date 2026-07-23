import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

const BannerSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  subtitle: z.string().optional().default(""),
  ctaText: z.string().optional().default(""),
  linkUrl: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
  position: z.enum(["HERO", "SIDEBAR", "MID_PAGE", "FOOTER"]).default("HERO"),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

// GET /api/v1/admin/cms/banners — List all hero banners
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const banners = await prisma.banner.findMany({
      orderBy: { sortOrder: "asc" },
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ banners });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/cms/banners GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch banners" }, { status: 500 });
  }
}

// POST /api/v1/admin/cms/banners — Create a banner
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const parsed = BannerSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const banner = await prisma.banner.create({
      data: parsed.data,
    });

    logApiResponse(req, 201, startTime);
    return NextResponse.json({ message: "Banner created successfully", banner }, { status: 201 });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/cms/banners POST", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to create banner" }, { status: 500 });
  }
}
