import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

// GET /api/v1/admin/inventory/logs — List inventory audit movement logs
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const logs = await prisma.inventoryLog.findMany({
      include: {
        variant: {
          select: {
            sku: true,
            product: { select: { name: true } },
          },
        },
        user: { select: { id: true, name: true, email: true } },
        order: { select: { id: true, orderNumber: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    logApiResponse(req, 200, startTime);
    return NextResponse.json({ logs });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/inventory/logs GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json(
      { message: "Failed to fetch inventory logs" },
      { status: 500 }
    );
  }
}
