import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { logApiResponse } from "@/lib/middleware";

// GET /api/v1/cms/banners — Public Hero Banners
export async function GET(req: NextRequest) {
  const startTime = Date.now();

  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ banners });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("cms/banners GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch banners" }, { status: 500 });
  }
}
