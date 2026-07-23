import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";

const InventoryUpdateSchema = z.object({
  quantity: z.number().min(0, "Quantity must be non-negative").optional(),
  lowStockThreshold: z.number().min(0).optional(),
});

// GET /api/v1/admin/inventory/[variantId]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ variantId: string }> }
) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { variantId } = await params;

    const inventory = await prisma.inventory.findUnique({
      where: { variantId },
      include: {
        variant: {
          select: {
            id: true,
            sku: true,
            price: true,
            product: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });

    if (!inventory) {
      logApiResponse(req, 404, startTime);
      return NextResponse.json({ message: "Inventory record not found" }, { status: 404 });
    }

    const available = Math.max(0, inventory.quantity - inventory.reserved);
    const isLowStock = available <= inventory.lowStockThreshold;

    logApiResponse(req, 200, startTime);
    return NextResponse.json({
      inventory: {
        ...inventory,
        available,
        isLowStock,
      },
    });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/inventory/[variantId] GET", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to fetch inventory" }, { status: 500 });
  }
}

// PUT /api/v1/admin/inventory/[variantId]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ variantId: string }> }
) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { variantId } = await params;
    const body = await req.json();
    const parsed = InventoryUpdateSchema.safeParse(body);

    if (!parsed.success) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { quantity, lowStockThreshold } = parsed.data;

    const existing = await prisma.inventory.findUnique({ where: { variantId } });
    if (!existing) {
      const newInventory = await prisma.inventory.create({
        data: {
          variantId,
          quantity: quantity ?? 0,
          lowStockThreshold: lowStockThreshold ?? 5,
        },
      });
      await prisma.inventoryLog.create({
        data: {
          inventoryId: newInventory.id,
          variantId,
          previousQuantity: 0,
          newQuantity: newInventory.quantity,
          changeAmount: newInventory.quantity,
          type: "MANUAL_ADJUSTMENT",
          reason: "Initial inventory setup",
          userId: authResult.user.id,
        },
      });
      const available = Math.max(0, newInventory.quantity - newInventory.reserved);
      logApiResponse(req, 200, startTime);
      return NextResponse.json({
        message: "Inventory created",
        inventory: {
          ...newInventory,
          available,
          remaining: available,
          isLowStock: available <= newInventory.lowStockThreshold,
        },
      });
    }

    const prevQty = existing.quantity;
    const newQty = quantity !== undefined ? quantity : existing.quantity;

    const updated = await prisma.inventory.update({
      where: { variantId },
      data: {
        quantity: quantity !== undefined ? quantity : undefined,
        lowStockThreshold: lowStockThreshold !== undefined ? lowStockThreshold : undefined,
      },
    });

    if (quantity !== undefined && prevQty !== newQty) {
      await prisma.inventoryLog.create({
        data: {
          inventoryId: updated.id,
          variantId,
          previousQuantity: prevQty,
          newQuantity: newQty,
          changeAmount: newQty - prevQty,
          type: "MANUAL_ADJUSTMENT",
          reason: "Admin manual stock update",
          userId: authResult.user.id,
        },
      });
    }

    const available = Math.max(0, updated.quantity - updated.reserved);

    logApiResponse(req, 200, startTime);
    return NextResponse.json({
      message: "Inventory updated successfully",
      inventory: {
        ...updated,
        available,
        remaining: available,
        isLowStock: available <= updated.lowStockThreshold,
      },
    });
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/inventory/[variantId] PUT", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to update inventory" }, { status: 500 });
  }
}
