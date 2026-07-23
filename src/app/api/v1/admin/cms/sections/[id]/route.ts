import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

// DELETE /api/v1/admin/cms/sections/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    await prisma.homeSection.delete({ where: { id } });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ message: "Homepage section deleted successfully" });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/cms/sections/[id] DELETE", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to delete section" }, { status: 500 });
  }
}
