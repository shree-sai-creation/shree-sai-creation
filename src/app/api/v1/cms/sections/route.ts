import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { logApiResponse } from "@/lib/middleware";

// GET /api/v1/cms/sections — Public Homepage Sections
export async function GET(req: NextRequest) {
  const startTime = Date.now();

  try {
    const sections = await prisma.homeSection.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ sections });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("cms/sections GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch homepage sections" }, { status: 500 });
  }
}
