import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";
import { MediaType } from "@prisma/client";

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) {
    logApiResponse(req, 403, startTime);
    return authResult.error;
  }

  try {
    const { searchParams } = new URL(req.url);

    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type"); // IMAGE or DOCUMENT
    const skip = (page - 1) * limit;

    const whereClause: Record<string, unknown> = {};

    if (type && ["IMAGE", "DOCUMENT", "VIDEO"].includes(type.toUpperCase())) {
      whereClause.type = type.toUpperCase() as MediaType;
    }

    if (search) {
      whereClause.OR = [
        { fileName: { contains: search, mode: "insensitive" } },
        { storageKey: { contains: search, mode: "insensitive" } },
      ];
    }

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.media.count({ where: whereClause }),
    ]);

    logApiResponse(req, 200, startTime);
    return NextResponse.json({
      media,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/media/GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch media list" }, { status: 500 });
  }
}
