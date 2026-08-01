import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createRequire } from "module";
const customRequire = createRequire(import.meta.url);
const { PRODUCTS } = customRequire("../src/data/products");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting production database seed...");

  // 1. Seed Default Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "admin@shreesaicreation.com";
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || "Admin123";
  const passwordHash = bcrypt.hashSync(adminPassword, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
      passwordHash: passwordHash,
    },
    create: {
      name: "Shree Sai Admin",
      email: adminEmail,
      passwordHash: passwordHash,
      role: Role.ADMIN,
      isEmailVerified: true,
    },
  });
  console.log(`✅ Admin user seeded: ${adminUser.email}`);

  // 2. Seed Primary Categories
  const categoryNames = [
    "Chandelier",
    "Pendant",
    "Wall Light",
    "Ceiling Light",
    "Table Lamp",
    "Floor Lamp",
    "Outdoor",
  ];

  const categoryMap = new Map<string, string>();

  for (const catName of categoryNames) {
    const slug = catName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const category = await prisma.category.upsert({
      where: { slug },
      update: { name: catName },
      create: {
        name: catName,
        slug,
        description: `Luxury ${catName} Collection`,
      },
    });
    categoryMap.set(catName, category.id);
  }
  console.log(`✅ Seeded ${categoryMap.size} categories.`);

  // 3. Seed Products, Specifications, Variants, and Images
  for (const p of PRODUCTS) {
    const categoryName = p.category || "Chandelier";
    const categoryId = categoryMap.get(categoryName) || categoryMap.get("Chandelier")!;

    // Create or find product
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description || "",
        basePrice: Math.round((p.price || 0) * 100), // In cents/paise
        discount: p.discount || 0,
        rating: p.rating || 5.0,
        categoryId: categoryId,
      },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description || "",
        basePrice: Math.round((p.price || 0) * 100),
        discount: p.discount || 0,
        rating: p.rating || 5.0,
        categoryId: categoryId,
      },
    });

    // Seed default variant
    const variantSku = `SKU-${product.id.slice(0, 8)}-DEFAULT`;
    let variant = await prisma.productVariant.findFirst({
      where: { productId: product.id },
    });

    if (!variant) {
      variant = await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: variantSku,
          price: Math.round((p.price || 0) * 100),
          isDefault: true,
        },
      }).catch(() => null as any);
    }

    // Seed inventory
    if (variant) {
      await prisma.inventory.upsert({
        where: { variantId: variant.id },
        update: { quantity: p.stock || 10 },
        create: {
          variantId: variant.id,
          quantity: p.stock || 10,
          reserved: 0,
        },
      }).catch(() => {});
    }

    // Seed Specifications
    if (p.dimensions) {
      await prisma.productSpecification.upsert({
        where: { productId_key: { productId: product.id, key: "Dimensions" } },
        update: { value: p.dimensions },
        create: { productId: product.id, key: "Dimensions", value: p.dimensions },
      });
    }
    if (p.material) {
      await prisma.productSpecification.upsert({
        where: { productId_key: { productId: product.id, key: "Material" } },
        update: { value: p.material },
        create: { productId: product.id, key: "Material", value: p.material },
      });
    }
    if (p.finish) {
      await prisma.productSpecification.upsert({
        where: { productId_key: { productId: product.id, key: "Finish" } },
        update: { value: p.finish },
        create: { productId: product.id, key: "Finish", value: p.finish },
      });
    }
    if (p.bulbs) {
      await prisma.productSpecification.upsert({
        where: { productId_key: { productId: product.id, key: "Bulbs" } },
        update: { value: p.bulbs },
        create: { productId: product.id, key: "Bulbs", value: p.bulbs },
      });
    }

    // Seed Media and Product Images
    if (p.images && p.images.length > 0) {
      // Clear existing images to allow clean re-seed
      await prisma.productImage.deleteMany({ where: { productId: product.id } });

      for (let idx = 0; idx < p.images.length; idx++) {
        const imgUrl = p.images[idx];
        let media = await prisma.media.findFirst({ where: { url: imgUrl } });

        if (!media) {
          media = await prisma.media.create({
            data: {
              url: imgUrl,
              storageKey: `prod-${p.id}-${idx}`,
              fileName: `product-${p.id}-${idx}.jpg`,
              mimeType: "image/jpeg",
              fileSize: 102400,
            },
          });
        }

        await prisma.productImage.create({
          data: {
            productId: product.id,
            mediaId: media.id,
            sortOrder: idx,
            isPrimary: idx === 0,
          },
        });
      }
    }
  }

  // 4. Seed Default Settings
  await prisma.setting.upsert({
    where: { key: "site_name" },
    update: { value: "Shree Sai Creation" },
    create: { key: "site_name", value: "Shree Sai Creation" },
  });
  await prisma.setting.upsert({
    where: { key: "currency" },
    update: { value: "AUD" },
    create: { key: "currency", value: "AUD" },
  });

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
