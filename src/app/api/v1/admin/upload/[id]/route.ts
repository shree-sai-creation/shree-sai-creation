import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";
import { deleteFileFromStorage } from "@/lib/storage";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) {
    logApiResponse(req, 403, startTime);
    return authResult.error;
  }

  try {
    const { id } = await params;

    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "Media record not found" }, { status: 404 });
    }

    // Extract bucket and path from storageKey (e.g. "products/12345_image.png")
    const parts = media.storageKey.split("/");
    const bucket = parts[0] || "products";
    const path = parts.slice(1).join("/");

    if (path) {
      await deleteFileFromStorage(bucket, path);
    }

    // Delete record from Prisma database
    await prisma.media.delete({
      where: { id },
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ message: "Media deleted successfully" });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/upload/[id]/DELETE", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to delete media" }, { status: 500 });
  }
}
