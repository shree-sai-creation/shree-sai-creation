import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getAuthUser, withSecurity, logApiResponse } from "@/lib/middleware";
import { GENERAL_RATE_LIMIT } from "@/lib/rateLimit";

const CreateReviewSchema = z.object({
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating max 5"),
  comment: z.string().min(3, "Review comment must be at least 3 characters").max(2000, "Review comment too long"),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const securityError = withSecurity(req, GENERAL_RATE_LIMIT);
  if (securityError) return securityError;

  try {
    const { id: productId } = await params;

    // 1. Strict Authentication Check
    const authUser = getAuthUser(req);
    if (!authUser || !authUser.id) {
      logApiResponse(req, 401, startTime);
      return NextResponse.json(
        { message: "Please sign in to write a review." },
        { status: 401 }
      );
    }

    const userId = String(authUser.id);

    const body = await req.json();
    const parsed = CreateReviewSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { rating, comment } = parsed.data;

    // 2. Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // 3. Fetch user profile from DB to get verified name
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      logApiResponse(req, 401, startTime);
      return NextResponse.json(
        { message: "User account not found. Please sign in again." },
        { status: 401 }
      );
    }

    // Create Review in DB
    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        rating,
        comment,
        isAllowed: true,
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    // Recalculate average product rating
    const allReviews = await prisma.review.findMany({
      where: { productId, isAllowed: true },
      select: { rating: true },
    });

    if (allReviews.length > 0) {
      const avgRating =
        Math.round(
          (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length) * 10
        ) / 10;
      await prisma.product.update({
        where: { id: productId },
        data: { rating: avgRating },
      });
    }

    const formattedReview = {
      id: review.id,
      author: user.name || review.user?.name || "Verified Customer",
      rating: review.rating,
      text: review.comment || "",
      date: review.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    logApiResponse(req, 201, startTime);
    return NextResponse.json(
      { message: "Review submitted successfully", review: formattedReview },
      { status: 201 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("products/reviews/POST", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
