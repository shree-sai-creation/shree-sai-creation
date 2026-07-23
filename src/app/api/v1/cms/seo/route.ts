import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { logApiResponse } from "@/lib/middleware";

const DEFAULT_SEO = {
  homeMetaTitle: "Shree Sai Creation | Luxury Lighting & Chandeliers",
  metaDescription: "Discover handcrafted K9 crystal chandeliers, brass pendants, and custom architectural lighting fixtures at Shree Sai Creation.",
  openGraphImage: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=1200",
  keywords: ["luxury lighting", "crystal chandelier", "architectural lights", "brass pendants", "home decor India"],
};

// GET /api/v1/cms/seo — Public SEO Content Meta Configuration
export async function GET(req: NextRequest) {
  const startTime = Date.now();

  try {
    const cmsRecord = await prisma.cmsContent.findUnique({
      where: { key: "SEO" },
    });

    const seo = cmsRecord ? cmsRecord.data : DEFAULT_SEO;

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ seo });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("cms/seo GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch SEO meta config" }, { status: 500 });
  }
}
