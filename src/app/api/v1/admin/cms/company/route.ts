import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

const CompanySchema = z.object({
  aboutUs: z.string().min(10, "About Us must be at least 10 characters"),
  contactEmail: z.string().email("Invalid email"),
  contactPhone: z.string().min(5, "Contact phone required"),
  storeAddress: z.string().min(5, "Store address required"),
  businessHours: z.string().min(5, "Business hours required"),
  socialLinks: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    pinterest: z.string().optional(),
  }).optional(),
});

// GET /api/v1/admin/cms/company
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const record = await prisma.cmsContent.findUnique({ where: { key: "COMPANY" } });
    logApiResponse(req, 200, startTime);
    return NextResponse.json({ company: record?.data || null });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/cms/company GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch company info" }, { status: 500 });
  }
}

// PUT /api/v1/admin/cms/company
export async function PUT(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const parsed = CompanySchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const updated = await prisma.cmsContent.upsert({
      where: { key: "COMPANY" },
      create: { key: "COMPANY", data: parsed.data as object },
      update: { data: parsed.data as object },
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ message: "Company information updated", company: updated.data });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/cms/company PUT", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to update company info" }, { status: 500 });
  }
}
