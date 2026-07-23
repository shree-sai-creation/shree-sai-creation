import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { logApiResponse } from "@/lib/middleware";

// Default fallback company info
const DEFAULT_COMPANY_INFO = {
  aboutUs: "Shree Sai Creation is a premier luxury lighting design studio specializing in bespoke crystal chandeliers, brass pendants, and architectural light fixtures.",
  contactEmail: "support@shreesaicreation.com",
  contactPhone: "+91 98765 43210",
  storeAddress: "123 Luxury Avenue, Design District, New Delhi, India 110001",
  businessHours: "Monday - Saturday: 10:00 AM - 8:00 PM IST",
  socialLinks: {
    instagram: "https://instagram.com/shreesaicreation",
    facebook: "https://facebook.com/shreesaicreation",
    pinterest: "https://pinterest.com/shreesaicreation",
  },
};

// GET /api/v1/cms/company — Public Company Information
export async function GET(req: NextRequest) {
  const startTime = Date.now();

  try {
    const cmsRecord = await prisma.cmsContent.findUnique({
      where: { key: "COMPANY" },
    });

    const company = cmsRecord ? cmsRecord.data : DEFAULT_COMPANY_INFO;

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ company });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("cms/company GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch company info" }, { status: 500 });
  }
}
