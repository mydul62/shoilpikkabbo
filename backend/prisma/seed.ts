import { PrismaClient, Role, OrderStatus, PaymentStatus, PaymentMethod, VerificationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with SHOILPIKKABBO initial data...");

  // 1. Admin User
  const passwordHash = await bcrypt.hash("admin1234", 10);
  const admin = await prisma.user.upsert({
    where: { phone: "01731214379" },
    update: {},
    create: {
      name: "Operations Admin",
      phone: "01731214379",
      email: "shoilpikkabbo@gmail.com",
      passwordHash,
      role: Role.ADMIN,
    },
  });
  console.log(`Created admin user: ${admin.phone}`);

  // 2. Initial Categories
  const categoriesData = [
    { name: "Handicraft", slug: "handicraft", description: "Authentic pottery, Nakshi Kantha, and traditional crafts." },
    { name: "Jute Items", slug: "jute-items", description: "Eco-friendly golden fiber bags, rugs, and lifestyle home decor." },
    { name: "Polymer", slug: "polymer", description: "Industrial durable containers and engineering resin items." },
    { name: "Baby Items", slug: "baby-items", description: "Organic cotton apparel, blankets, and infant essentials." },
    { name: "Corporate Gift Items", slug: "corporate-gift-items", description: "Executive diaries, engraved pens, and promotional gift packs." },
    { name: "Rudiment Garments", slug: "rudiment-garments", description: "Export-standard cotton casual apparel and basics." },
    { name: "Industrial Solutions", slug: "industrial-solutions", description: "Workplace safety accessories and industrial packaging." },
    { name: "Health and Beauty", slug: "health-and-beauty", description: "Herbal extracts, pure black seed oil, and organic wellness." },
    { name: "Agriculture", slug: "agriculture", description: "High-yield seeds, compost, and urban farming starter kits." },
    { name: "Special E-Sheba", slug: "e-sheba", description: "Institutional procurement and custom bespoke sourcing desk." },
  ];

  for (let i = 0; i < categoriesData.length; i++) {
    const cat = categoriesData[i];
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        displayOrder: i + 1,
      },
    });
  }
  console.log(`Seeded ${categoriesData.length} categories.`);

  // 3. Initial Coupons
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      discountValue: 10,
      minOrderAmount: 1000,
      endDate: new Date("2026-12-31"),
    },
  });

  // 4. Initial Site Settings
  const settingsData = [
    { key: "store_name", value: "SHOILPIKKABBO", category: "general" },
    { key: "tagline", value: "Delivery • Quality • Reliability", category: "general" },
    { key: "contact_primary", value: "01731214379", category: "contact" },
    { key: "contact_secondary", value: "01811909068", category: "contact" },
    { key: "contact_payment", value: "01977765999", category: "payment" },
    { key: "bank_name", value: "BRAC Bank PLC", category: "payment" },
    { key: "delivery_dhaka", value: "70", category: "delivery" },
    { key: "delivery_outside", value: "130", category: "delivery" },
    { key: "free_delivery_threshold", value: "3000", category: "delivery" },
  ];

  for (const s of settingsData) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log(`Seeded site settings.`);

  console.log("Database seed script completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
