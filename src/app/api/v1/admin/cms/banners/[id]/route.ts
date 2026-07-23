import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

const BannerUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().optional(),
  ctaText: z.string().optional(),
  linkUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  position: z.enum(["HERO", "SIDEBAR", "MID_PAGE", "FOOTER"]).optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

// PUT /api/v1/admin/cms/banners/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = BannerUpdateSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const updated = await prisma.banner.update({
      where: { id },
      data: parsed.data,
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ message: "Banner updated", banner: updated });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/cms/banners/[id] PUT", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to update banner" }, { status: 500 });
  }
}

// DELETE /api/v1/admin/cms/banners/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    await prisma.banner.delete({ where: { id } });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ message: "Banner deleted successfully" });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/cms/banners/[id] DELETE", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to delete banner" }, { status: 500 });
  }
}
