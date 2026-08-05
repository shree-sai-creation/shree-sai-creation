import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, withSecurity, logApiResponse } from "@/lib/middleware";
import { GENERAL_RATE_LIMIT } from "@/lib/rateLimit";

const UpdateReviewSchema = z.object({
  isAllowed: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const securityError = withSecurity(req, GENERAL_RATE_LIMIT);
  if (securityError) return securityError;

  const authResult = requireAdmin(req);
  if ("error" in authResult) {
    logApiResponse(req, 403, startTime);
    return authResult.error;
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = UpdateReviewSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        ...(typeof parsed.data.isAllowed === "boolean"
          ? { isAllowed: parsed.data.isAllowed }
          : {}),
      },
    });

    // Recalculate Product Rating
    const allReviews = await prisma.review.findMany({
      where: { productId: review.productId, isAllowed: true },
      select: { rating: true },
    });

    const avgRating =
      allReviews.length > 0
        ? Math.round(
            (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length) * 10
          ) / 10
        : 5;

    await prisma.product.update({
      where: { id: review.productId },
      data: { rating: avgRating },
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({
      message: "Review updated successfully",
      review: updated,
    });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/reviews/PATCH", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const securityError = withSecurity(req, GENERAL_RATE_LIMIT);
  if (securityError) return securityError;

  const authResult = requireAdmin(req);
  if ("error" in authResult) {
    logApiResponse(req, 403, startTime);
    return authResult.error;
  }

  try {
    const { id } = await params;
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }

    await prisma.review.delete({ where: { id } });

    // Recalculate Product Rating after deletion
    const allReviews = await prisma.review.findMany({
      where: { productId: review.productId, isAllowed: true },
      select: { rating: true },
    });

    const avgRating =
      allReviews.length > 0
        ? Math.round(
            (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length) * 10
          ) / 10
        : 5;

    await prisma.product.update({
      where: { id: review.productId },
      data: { rating: avgRating },
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/reviews/DELETE", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
