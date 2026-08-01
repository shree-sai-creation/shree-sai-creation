import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { logApiResponse } from "@/lib/middleware";

const DEFAULT_FOOTER = {
  copyright: "© 2026 Shree Sai Creation. All rights reserved.",
  footerLinks: [
    { title: "Shop All", url: "/shop" },
    { title: "About Us", url: "/about" },
    { title: "Contact", url: "/contact" },
  ],
  policies: [
    { title: "Privacy Policy", url: "/privacy-policy" },
    { title: "Terms & Conditions", url: "/terms" },
    { title: "Shipping Policy", url: "/terms#shipping" },
  ],
};

// GET /api/v1/cms/footer — Public Footer Management Configuration
export async function GET(req: NextRequest) {
  const startTime = Date.now();

  try {
    const cmsRecord = await prisma.cmsContent.findUnique({
      where: { key: "FOOTER" },
    });

    const footer = cmsRecord ? cmsRecord.data : DEFAULT_FOOTER;

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ footer });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("cms/footer GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch footer config" }, { status: 500 });
  }
}
