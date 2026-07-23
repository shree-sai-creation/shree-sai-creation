import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

const LinkItemSchema = z.object({
  title: z.string().min(1),
  url: z.string().min(1),
});

const FooterSchema = z.object({
  copyright: z.string().min(5, "Copyright text required"),
  footerLinks: z.array(LinkItemSchema),
  policies: z.array(LinkItemSchema),
});

// GET /api/v1/admin/cms/footer
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const record = await prisma.cmsContent.findUnique({ where: { key: "FOOTER" } });
    logApiResponse(req, 200, startTime);
    return NextResponse.json({ footer: record?.data || null });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/cms/footer GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch footer config" }, { status: 500 });
  }
}

// PUT /api/v1/admin/cms/footer
export async function PUT(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const parsed = FooterSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const updated = await prisma.cmsContent.upsert({
      where: { key: "FOOTER" },
      create: { key: "FOOTER", data: parsed.data as object },
      update: { data: parsed.data as object },
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ message: "Footer configuration updated", footer: updated.data });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/cms/footer PUT", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to update footer config" }, { status: 500 });
  }
}
