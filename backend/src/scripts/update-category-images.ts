import { prisma } from "../config/prisma";

const CATEGORY_IMAGES: Record<string, string> = {
  handicraft: "/images/client-mockup/cat-handicrafts.png",
  "jute-items": "/images/client-mockup/cat-jute.png",
  polymer: "/images/client-mockup/cat-polymer.png",
  "baby-items": "/images/client-mockup/cat-baby.png",
  "corporate-gift-items": "/images/client-mockup/cat-corporate.png",
  "rudiment-garments": "/images/client-mockup/cat-garments.png",
  "industrial-solutions": "/images/client-mockup/cat-industrial.png",
  "health-and-beauty": "/images/client-mockup/cat-beauty.png",
  agriculture: "/images/client-mockup/cat-agriculture.png",
  "e-sheba": "/images/client-mockup/cat-services.png",
};

async function main() {
  console.log("Updating category images in database to meaningful curated assets...");

  for (const [slug, imageUrl] of Object.entries(CATEGORY_IMAGES)) {
    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      await prisma.category.update({
        where: { slug },
        data: { imageUrl },
      });
      console.log(`✓ Updated category [${slug}] -> ${imageUrl}`);
    } else {
      console.log(`- Category [${slug}] not found in DB.`);
    }
  }

  console.log("All category images updated successfully!");
}

main()
  .catch((e) => {
    console.error("Error updating categories:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
