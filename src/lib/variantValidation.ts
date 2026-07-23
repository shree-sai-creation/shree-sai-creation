import prisma from "./db";

/**
 * Generate a deterministic normalized combination signature for a set of attribute value IDs.
 * Alphabetically sorts IDs ascending. Returns "default" if no attributes provided.
 */
export function generateCombinationSignature(attributeValueIds: string[] = []): string {
  if (!attributeValueIds || attributeValueIds.length === 0) {
    return "default";
  }
  return [...attributeValueIds].sort().join("-");
}

/**
 * Validates if a proposed attribute value combination signature already exists for a product.
 * Returns { isDuplicate: true, error: string } if duplicate combination signature is found.
 */
export async function validateVariantCombination({
  productId,
  attributeValueIds,
  currentVariantId,
}: {
  productId: string;
  attributeValueIds: string[];
  currentVariantId?: string;
}): Promise<{ isDuplicate: boolean; signature: string; error?: string }> {
  const signature = generateCombinationSignature(attributeValueIds);

  const existingVariant = await prisma.productVariant.findFirst({
    where: {
      productId,
      combinationSignature: signature,
      ...(currentVariantId ? { NOT: { id: currentVariantId } } : {}),
      isActive: true,
    },
  });

  if (existingVariant) {
    return {
      isDuplicate: true,
      signature,
      error: "Variant combination already exists for this product.",
    };
  }

  return { isDuplicate: false, signature };
}
