import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

const SectionSchema = z.object({
  sectionKey: z.string().min(1, "Section key is required").max(100),
  title: z.string().min(1, "Title is required").max(200),
  subtitle: z.string().optional().default(""),
  sortOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
  contentData: z.record(z.string(), z.unknown()).optional(),
});

// GET /api/v1/admin/cms/sections
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const sections = await prisma.homeSection.findMany({
      orderBy: { sortOrder: "asc" },
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ sections });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/cms/sections GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch homepage sections" }, { status: 500 });
  }
}

// POST /api/v1/admin/cms/sections
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const parsed = SectionSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { sectionKey, title, subtitle, sortOrder, isVisible, contentData } = parsed.data;

    const section = await prisma.homeSection.upsert({
      where: { sectionKey },
      create: {
        sectionKey,
        title,
        subtitle,
        sortOrder,
        isVisible,
        contentData: contentData ? (contentData as object) : undefined,
      },
      update: {
        title,
        subtitle,
        sortOrder,
        isVisible,
        contentData: contentData ? (contentData as object) : undefined,
      },
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ message: "Homepage section saved", section });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/cms/sections POST", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to save section" }, { status: 500 });
  }
}
