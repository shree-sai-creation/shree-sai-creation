import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin, withSecurity, logApiResponse } from "@/lib/middleware";
import { GENERAL_RATE_LIMIT } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const securityError = withSecurity(req, GENERAL_RATE_LIMIT);
  if (securityError) return securityError;

  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: {
              take: 1,
              orderBy: { sortOrder: "asc" },
              include: { media: { select: { url: true } } },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const formatted = reviews.map((r) => ({
      id: r.id,
      productId: r.productId,
      productName: r.product.name,
      productSlug: r.product.slug,
      productImage: r.product.images[0]?.media?.url || "",
      userId: r.userId,
      userName: r.user.name,
      userEmail: r.user.email,
      rating: r.rating,
      comment: r.comment || "",
      isAllowed: r.isAllowed,
      createdAt: r.createdAt.toISOString(),
    }));

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ reviews: formatted });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/reviews/GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
