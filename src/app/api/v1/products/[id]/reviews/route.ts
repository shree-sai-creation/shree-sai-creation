import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getAuthUser, withSecurity, logApiResponse } from "@/lib/middleware";
import { GENERAL_RATE_LIMIT } from "@/lib/rateLimit";

const CreateReviewSchema = z.object({
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating max 5"),
  comment: z.string().min(3, "Review comment must be at least 3 characters").max(2000, "Review comment too long"),
  authorName: z.string().optional().default("Verified Buyer"),
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
    const body = await req.json();
    const parsed = CreateReviewSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { rating, comment, authorName } = parsed.data;

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Resolve user if token provided
    const authUser = getAuthUser(req);
    let userId = authUser?.id ? String(authUser.id) : null;

    if (!userId) {
      // Find first user in DB as fallback or guest reviewer link
      const fallbackUser = await prisma.user.findFirst();
      if (fallbackUser) {
        userId = fallbackUser.id;
      }
    }

    if (!userId) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: "User account required to submit a review." },
        { status: 400 }
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
      author: authorName || review.user?.name || "Verified Buyer",
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
