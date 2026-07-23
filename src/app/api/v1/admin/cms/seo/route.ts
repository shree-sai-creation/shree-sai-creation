import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

const SeoSchema = z.object({
  homeMetaTitle: z.string().min(5, "Meta title must be at least 5 characters").max(150),
  metaDescription: z.string().min(10, "Meta description must be at least 10 characters").max(300),
  openGraphImage: z.string().url("Invalid image URL").optional().or(z.literal("")),
  keywords: z.array(z.string()).or(z.string().transform((val) => val.split(",").map((k) => k.trim()))),
});

// GET /api/v1/admin/cms/seo
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const record = await prisma.cmsContent.findUnique({ where: { key: "SEO" } });
    logApiResponse(req, 200, startTime);
    return NextResponse.json({ seo: record?.data || null });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/cms/seo GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch SEO meta config" }, { status: 500 });
  }
}

// PUT /api/v1/admin/cms/seo
export async function PUT(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const parsed = SeoSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const updated = await prisma.cmsContent.upsert({
      where: { key: "SEO" },
      create: { key: "SEO", data: parsed.data as object },
      update: { data: parsed.data as object },
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ message: "SEO content updated", seo: updated.data });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/cms/seo PUT", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to update SEO config" }, { status: 500 });
  }
}
