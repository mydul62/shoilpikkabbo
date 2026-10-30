import {
  PrismaClient,
  Role,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  VerificationStatus,
  InquiryStatus,
  EmploymentType,
  DiscountType,
  PageStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  getDefaultHomePageSections,
  getDefaultAboutPageSections,
  getDefaultServicesPageSections,
  getDefaultContactPageSections,
} from "../src/modules/page/page.service";

const prisma = new PrismaClient();

async function main() {
  console.log("=================================================");
  console.log(" Seeding SHOILPIKKABBO Production-Grade Demo Data");
  console.log("=================================================");

  // -----------------------------------------------------------------
  // 1. Users (Admin, Staff, Customers)
  // -----------------------------------------------------------------
  const adminPass = await bcrypt.hash("admin1234", 10);
  const staffPass = await bcrypt.hash("staff1234", 10);

  const admin = await prisma.user.upsert({
    where: { phone: "01731214379" },
    update: { passwordHash: adminPass },
    create: {
      name: "Operations Admin",
      phone: "01731214379",
      email: "shoilpikkabbo@gmail.com",
      passwordHash: adminPass,
      role: Role.ADMIN,
    },
  });

  const staff = await prisma.user.upsert({
    where: { phone: "01811909068" },
    update: { passwordHash: staffPass },
    create: {
      name: "Habibur Rahman (Operations Manager)",
      phone: "01811909068",
      email: "operations@shoilpikkabbo.com",
      passwordHash: staffPass,
      role: Role.STAFF,
    },
  });

  console.log("✓ Provisioned Admin and Staff accounts.");

  // -----------------------------------------------------------------
  // 2. Categories (All 10 Categories from Master Spec)
  // -----------------------------------------------------------------
  const categoriesData = [
    {
      name: "Handicraft",
      slug: "handicraft",
      description: "Authentic pottery, Nakshi Kantha, and traditional heritage artisan crafts.",
      imageUrl: "/images/client-mockup/cat-handicrafts.png",
      displayOrder: 1,
    },
    {
      name: "Jute Items",
      slug: "jute-items",
      description: "Eco-friendly golden fiber bags, braided rugs, lifestyle decor, and woven accessories.",
      imageUrl: "/images/client-mockup/cat-jute.png",
      displayOrder: 2,
    },
    {
      name: "Polymer",
      slug: "polymer",
      description: "Industrial durable containers, heavy crates, and precision engineering polymer solutions.",
      imageUrl: "/images/client-mockup/cat-polymer.png",
      displayOrder: 3,
    },
    {
      name: "Baby Items",
      slug: "baby-items",
      description: "Pure organic muslin cotton apparel, swaddle blankets, and infant essentials.",
      imageUrl: "/images/client-mockup/cat-baby.png",
      displayOrder: 4,
    },
    {
      name: "Corporate Gift Items",
      slug: "corporate-gift-items",
      description: "Executive diaries, engraved pens, thermo-flasks, and custom institutional gift packs.",
      imageUrl: "/images/client-mockup/cat-corporate.png",
      displayOrder: 5,
    },
    {
      name: "Rudiment Garments",
      slug: "rudiment-garments",
      description: "Export-standard premium combed cotton basics, polos, tees, and handloom kurtas.",
      imageUrl: "/images/client-mockup/cat-garments.png",
      displayOrder: 6,
    },
    {
      name: "Industrial Solutions",
      slug: "industrial-solutions",
      description: "Workplace safety accessories, protective gear, packaging, and commercial hardware.",
      imageUrl: "/images/client-mockup/cat-industrial.png",
      displayOrder: 7,
    },
    {
      name: "Health and Beauty",
      slug: "health-and-beauty",
      description: "Pure virgin cold-pressed Kalijira oil, organic herbal extracts, and natural wellness.",
      imageUrl: "/images/client-mockup/cat-beauty.png",
      displayOrder: 8,
    },
    {
      name: "Agriculture",
      slug: "agriculture",
      description: "High-yield seeds, premium organic vermicompost, and rooftop urban farming kits.",
      imageUrl: "/images/client-mockup/cat-agriculture.png",
      displayOrder: 9,
    },
    {
      name: "Special E-Sheba",
      slug: "e-sheba",
      description: "Institutional procurement desk, customized gift branding, and bulk bespoke sourcing.",
      imageUrl: "/images/client-mockup/cat-services.png",
      displayOrder: 10,
    },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        imageUrl: cat.imageUrl,
        displayOrder: cat.displayOrder,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        imageUrl: cat.imageUrl,
        displayOrder: cat.displayOrder,
      },
    });
    categoryMap.set(cat.slug, createdCat.id);
  }
  console.log(`✓ Seeded all 10 core categories.`);

  // -----------------------------------------------------------------
  // 3. Products (25 Realistic Products across all categories)
  // -----------------------------------------------------------------
  const productsData = [
    // --- 1. Handicraft ---
    {
      name: "Handcrafted Terracotta Ceramic Tea Set (6 Cups & Pot)",
      slug: "handcrafted-terracotta-ceramic-tea-set",
      categorySlug: "handicraft",
      price: 1850,
      salePrice: 1550,
      stock: 24,
      sku: "SK-HC-001",
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
      description: "Exquisite clay terracotta tea set shaped and fired by master potters of Dhamrai. Natural heat retention with authentic rustic glaze finish.",
      specifications: { Material: "Natural Clay", Pieces: "6 Cups + 1 Teapot", Origin: "Dhamrai, Dhaka" },
    },
    {
      name: "Traditional Hand-Embroidered Nakshi Kantha (King Size)",
      slug: "traditional-nakshi-kantha-king-size",
      categorySlug: "handicraft",
      price: 4500,
      salePrice: 3890,
      stock: 12,
      sku: "SK-HC-002",
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=800&q=80",
      description: "Heritage heirloom-quality Nakshi Kantha meticulously hand-stitched by rural women artisans of Jessore with vibrant folkloric motifs.",
      specifications: { Dimensions: "90x100 inches", Fabric: "100% Cotton", Origin: "Jessore" },
    },
    {
      name: "Solid Brass Peacock Incense & Candle Burner",
      slug: "solid-brass-peacock-incense-burner",
      categorySlug: "handicraft",
      price: 1450,
      stock: 30,
      sku: "SK-HC-003",
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80",
      description: "Lost-wax hand-cast brass decorative incense burner featuring an intricate peacock emblem with antique polished finish.",
      specifications: { Material: "Pure Brass", Weight: "450g", Finish: "Antique Brass" },
    },

    // --- 2. Jute Items ---
    {
      name: "Natural Braided Golden Jute Floor Rug (5x3 ft)",
      slug: "natural-braided-golden-jute-floor-rug",
      categorySlug: "jute-items",
      price: 2400,
      salePrice: 2150,
      stock: 18,
      sku: "SK-JT-001",
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80",
      description: "100% natural biodegradable golden jute rug tightly handwoven by skilled artisans. Durable, reversible, and eco-friendly.",
      specifications: { Dimensions: "5ft x 3ft", Material: "Golden Jute Fiber", Weave: "Braided Loop" },
    },
    {
      name: "Executive Eco-Jute Laptop Tote Bag with Vegan Leather Trim",
      slug: "executive-eco-jute-laptop-tote-bag",
      categorySlug: "jute-items",
      price: 1650,
      salePrice: 1390,
      stock: 35,
      sku: "SK-JT-002",
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      description: "Sleek, professional everyday work bag made of heavy laminated golden jute with reinforced vegan leather handles and padded 15-inch laptop sleeve.",
      specifications: { Fits: "Up to 15.6 inch laptops", Material: "Laminated Jute & PU", Pockets: "3 Internal" },
    },
    {
      name: "Handcrafted Jute Macrame Hanging Planter Trio",
      slug: "handcrafted-jute-macrame-hanging-planter-trio",
      categorySlug: "jute-items",
      price: 850,
      stock: 40,
      sku: "SK-JT-003",
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
      description: "Set of three bohemian plant hangers hand-knotted with heavy-duty organic jute cord. Ideal for balconies and indoor green spaces.",
      specifications: { Set: "3 Planters", Length: "36 inches", LoadCapacity: "5kg per hanger" },
    },

    // --- 3. Polymer ---
    {
      name: "Industrial Grade Heavy-Duty Polyethylene Storage Crate (60L)",
      slug: "industrial-grade-storage-crate-60l",
      categorySlug: "polymer",
      price: 980,
      stock: 75,
      sku: "SK-PM-001",
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      description: "High-density polymer stacking container engineered for warehouse material handling, agricultural harvest sorting, and logistics.",
      specifications: { Capacity: "60 Liters", Material: "Virgin HDPE Polymer", Dimensions: "600x400x310 mm" },
    },
    {
      name: "Stackable Polymer Organizer Bin with Transparent Front",
      slug: "stackable-polymer-organizer-bin",
      categorySlug: "polymer",
      price: 450,
      salePrice: 390,
      stock: 120,
      sku: "SK-PM-002",
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80",
      description: "Durable modular storage bin with easy-access frontal aperture. Excellent for hardware components, tools, and office supplies.",
      specifications: { Material: "Polypropylene (PP)", Color: "Industrial Blue", Capacity: "15 Liters" },
    },

    // --- 4. Baby Items ---
    {
      name: "Organic Baby Muslin Cotton Swaddle Blankets (Set of 3)",
      slug: "organic-baby-muslin-cotton-swaddle-blankets",
      categorySlug: "baby-items",
      price: 1350,
      stock: 45,
      sku: "SK-BB-001",
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
      description: "Ultra-breathable 4-layer pure combed cotton swaddle blankets. Gets softer with every wash and prevents infant overheating.",
      specifications: { Fabric: "100% Organic Muslin", Size: "110cm x 110cm", Certification: "GOTS Certified Cotton" },
    },
    {
      name: "Pastel Newborn Cotton Sleepsuit & Beanie Gift Set",
      slug: "pastel-newborn-cotton-sleepsuit-gift-set",
      categorySlug: "baby-items",
      price: 950,
      salePrice: 820,
      stock: 30,
      sku: "SK-BB-002",
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
      description: "Hypoallergenic, tagless organic cotton onesie with two-way zipper and matching soft knot beanie cap for infants 0-6 months.",
      specifications: { AgeRange: "0 - 6 Months", Fabric: "Combed Rib Cotton", Safety: "Nickel-free zipper" },
    },

    // --- 5. Corporate Gift Items ---
    {
      name: "Executive Leatherette Corporate Gift Box Set",
      slug: "executive-leatherette-corporate-gift-box-set",
      categorySlug: "corporate-gift-items",
      price: 3200,
      salePrice: 2890,
      stock: 40,
      sku: "SK-CG-001",
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
      description: "Luxury corporate executive bundle comprising a premium dated leatherette planner, heavyweight brass ballpoint pen, 500ml vacuum thermal flask, and matching keychain.",
      specifications: { Contents: "Planner + Pen + Flask + Keychain", Packaging: "Magnetic Hard Box with Foam Insert" },
    },
    {
      name: "Double-Walled Bamboo Insulated Vacuum Flask (500ml)",
      slug: "double-walled-bamboo-vacuum-flask-500ml",
      categorySlug: "corporate-gift-items",
      price: 1100,
      stock: 60,
      sku: "SK-CG-002",
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
      description: "Eco-chic stainless steel interior flask wrapped in natural sustainable bamboo. Keeps hot beverages warm for 12 hours.",
      specifications: { Capacity: "500ml", Interior: "SUS304 Food Grade Stainless Steel", Shell: "Natural Bamboo" },
    },
    {
      name: "Solid Brass Executive Desk Nameplate & Pen Stand",
      slug: "solid-brass-executive-desk-stand",
      categorySlug: "corporate-gift-items",
      price: 1850,
      stock: 25,
      sku: "SK-CG-003",
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80",
      description: "Hand-finished heavyweight brass desktop caddy for fountain pens and business cards. Customizable with client company engraving.",
      specifications: { Weight: "680g", Material: "Mirror Polished Brass", Dimensions: "20x8x5 cm" },
    },

    // --- 6. Rudiment Garments ---
    {
      name: "Heavyweight 220 GSM Combed Cotton Casual T-Shirt",
      slug: "heavyweight-220-gsm-cotton-casual-t-shirt",
      categorySlug: "rudiment-garments",
      price: 650,
      salePrice: 550,
      stock: 150,
      sku: "SK-RG-001",
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      description: "Export-grade structured tee tailored from 100% ring-spun combed cotton. Pre-shrunk and reactive dyed for color longevity.",
      specifications: { GSM: "220 GSM", Fit: "Relaxed Modern Fit", Fabric: "100% Combed Cotton" },
    },
    {
      name: "Handloom Cotton Textured Casual Kurta for Men",
      slug: "handloom-cotton-textured-casual-kurta",
      categorySlug: "rudiment-garments",
      price: 1950,
      salePrice: 1750,
      stock: 35,
      sku: "SK-RG-002",
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
      description: "Breathable textured handloom cotton kurta featuring coconut shell buttons and mandarin collar. Perfect for everyday elegance.",
      specifications: { Weave: "Tangail Handloom", Buttons: "Natural Coconut Shell", Care: "Hand wash cold" },
    },

    // --- 7. Industrial Solutions ---
    {
      name: "Vented Heavy-Duty Industrial Safety Helmet with Chin Strap",
      slug: "vented-industrial-safety-helmet",
      categorySlug: "industrial-solutions",
      price: 680,
      stock: 90,
      sku: "SK-IS-001",
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
      description: "Impact-absorbing ABS hard hat equipped with 6-point ratchet suspension and ventilation ports for high-temperature work sites.",
      specifications: { Standard: "ANSI Z89.1 / EN 397", Suspension: "6-Point Ratchet", Shell: "High Impact ABS" },
    },
    {
      name: "Nitrile-Coated High-Grip Safety Work Gloves (Pack of 12)",
      slug: "nitrile-coated-safety-work-gloves-12-pack",
      categorySlug: "industrial-solutions",
      price: 840,
      stock: 80,
      sku: "SK-IS-002",
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80",
      description: "Flexible 13-gauge nylon liners micro-foamed with oil-resistant nitrile for superior precision grip during mechanical operations.",
      specifications: { PackSize: "12 Pairs", Coating: "Microfoam Nitrile", Gauge: "13-Gauge Seamless Knit" },
    },

    // --- 8. Health and Beauty ---
    {
      name: "Pure Cold-Pressed Kalijira (Black Seed) Oil (250ml)",
      slug: "pure-cold-pressed-kalijira-oil-250ml",
      categorySlug: "health-and-beauty",
      price: 750,
      salePrice: 650,
      stock: 55,
      sku: "SK-HB-001",
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1608248597359-58b18ec06f37?auto=format&fit=crop&w=800&q=80",
      description: "100% virgin cold-pressed Nigella Sativa oil from premium Jessore black seeds. Unfiltered, zero additives, and naturally rich in Thymoquinone.",
      specifications: { Volume: "250ml", Extraction: "Single Cold-Pressed", Origin: "Jessore, Bangladesh" },
    },
    {
      name: "Raw Sundarban Wild Honey with Natural Comb Wax (500g)",
      slug: "raw-sundarban-wild-honey-500g",
      categorySlug: "health-and-beauty",
      price: 850,
      stock: 45,
      sku: "SK-HB-002",
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
      description: "Harvested by traditional Mawali honey gatherers deep within the mangrove forests of the Sundarbans. 100% pure, raw, and unpasteurized.",
      specifications: { NetWeight: "500g", ForestType: "Mangrove Sundarbans", Purity: "100% Unpasteurized Raw Honey" },
    },
    {
      name: "Organic Neem & Turmeric Purifying Herbal Soap (Set of 3)",
      slug: "organic-neem-turmeric-herbal-soap-3pack",
      categorySlug: "health-and-beauty",
      price: 420,
      stock: 70,
      sku: "SK-HB-003",
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1607006314646-601248035179?auto=format&fit=crop&w=800&q=80",
      description: "Handmade cold-process botanical soap bars enriched with virgin coconut oil, fresh crushed neem leaves, and wild turmeric.",
      specifications: { Quantity: "3 x 100g Bars", Base: "Cold-Pressed Coconut & Olive Oil", FreeFrom: "Parabens & SLS" },
    },

    // --- 9. Agriculture ---
    {
      name: "High-Yield Hybrid Vegetable Seeds Kit (10 Varieties)",
      slug: "high-yield-hybrid-vegetable-seeds-kit",
      categorySlug: "agriculture",
      price: 450,
      salePrice: 380,
      stock: 65,
      sku: "SK-AG-001",
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6ef23963?auto=format&fit=crop&w=800&q=80",
      description: "Selected high-germination seed pack tailored for Bangladeshi home gardens & rooftop plots: Tomato, Eggplant, Spinach, Chili, Bitter Gourd, and more.",
      specifications: { Varieties: "10 Types", GerminationRate: "90%+", Packaging: "Foil sealed moisture-proof" },
    },
    {
      name: "Enriched Organic Vermicompost Soil Conditioner (5kg)",
      slug: "enriched-organic-vermicompost-5kg",
      categorySlug: "agriculture",
      price: 350,
      stock: 80,
      sku: "SK-AG-002",
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1585336261026-41865c5590b8?auto=format&fit=crop&w=800&q=80",
      description: "Natural earthworm castings packed with beneficial microbes, nitrogen, and essential minerals for organic vegetable and flower beds.",
      specifications: { Weight: "5 Kilograms", Type: "100% Earthworm Castings", Moisture: "20-25%" },
    },

    // --- 10. Special E-Sheba (Service Inquiry Showcase Catalog) ---
    {
      name: "Corporate Bespoke Jute Packaging Sourcing (B2B Bulk)",
      slug: "corporate-bespoke-jute-packaging-sourcing",
      categorySlug: "e-sheba",
      price: 0,
      stock: 999,
      sku: "SK-ES-001",
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
      description: "Service inquiry package: Tailor-made eco-friendly jute bags with embossed corporate branding, customized handles, and export shipping support for institutional orders.",
      specifications: { ServiceCategory: "Institutional Sourcing", MOQ: "100 Units", Consultation: "Complimentary Quotation" },
    },
    {
      name: "Artisanal Interior Terracotta & Pottery Fitment Service",
      slug: "artisanal-interior-terracotta-fitment-service",
      categorySlug: "e-sheba",
      price: 0,
      stock: 999,
      sku: "SK-ES-002",
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      description: "Bespoke consultancy and handcrafted pottery installation for modern corporate lounges, restaurants, boutique resorts, and eco-homes.",
      specifications: { Consultation: "On-site / Architectural Review", LeadTime: "14-21 Days", Customization: "Fully Tailored" },
    },
  ];

  const productMap = new Map<string, any>();
  for (const prod of productsData) {
    const categoryId = categoryMap.get(prod.categorySlug);
    if (!categoryId) {
      console.warn(`Category not found for slug: ${prod.categorySlug}`);
      continue;
    }

    const createdProd = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        price: prod.price,
        salePrice: prod.salePrice || null,
        stock: prod.stock,
        sku: prod.sku,
        isFeatured: prod.isFeatured,
        description: prod.description,
        specifications: prod.specifications,
      },
      create: {
        categoryId,
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        salePrice: prod.salePrice || null,
        stock: prod.stock,
        sku: prod.sku,
        isFeatured: prod.isFeatured,
        specifications: prod.specifications,
        images: {
          create: [
            {
              url: prod.imageUrl,
              isPrimary: true,
              displayOrder: 0,
            },
          ],
        },
      },
    });
    productMap.set(prod.slug, createdProd);
  }
  console.log(`✓ Seeded ${productsData.length} authentic products across all 10 categories.`);

  // -----------------------------------------------------------------
  // 4. Banners (Hero Showcase Banners for Storefront)
  // -----------------------------------------------------------------
  const bannersData = [
    {
      title: "বাংলার ঐতিহ্য, আপনার প্রয়োজন",
      subtitle: "দেশীয় পণ্য ও আধুনিক সেবার সমন্বয়ে শিল্পকলা এখন আপনার হাতের কাছে!",
      imageUrl: "/images/client-mockup/hero-bg-exact.png",
      linkUrl: "/shop",
      placement: "Homepage Hero",
      displayOrder: 1,
      isActive: true,
    },
    {
      title: "প্রকৃতির সান্নিধ্যে, বিশুদ্ধ সমাহার",
      subtitle: "পরিবেশবান্ধব ও খাঁটি সামগ্রীর অনন্য কালেকশন আপনার প্রতিদিনের জীবনের সেরা সঙ্গী!",
      imageUrl: "/images/client-mockup/hero-bg-green.png",
      linkUrl: "/shop",
      placement: "Homepage Hero",
      displayOrder: 2,
      isActive: true,
    },
    {
      title: "মাটির সুরভী, ঐতিহ্যের কারুকাজ",
      subtitle: "হাতে বোনা পাটজাত পণ্য ও লোকশিল্পের ভাণ্ডার বাঙালির ঘর সাজুক দেশীয় শিল্পে!",
      imageUrl: "/images/client-mockup/hero-bg-peach.png",
      linkUrl: "/shop",
      placement: "Homepage Hero",
      displayOrder: 3,
      isActive: true,
    },
    {
      title: "কর্পোরেট সলিউশন, বিশেষ ই-সেবা",
      subtitle: "প্রতিষ্ঠানিক উপহার ও কাস্টমাইজড শিল্পজাত সামগ্রী সারাদেশে নিরাপদ ও নির্ভরযোগ্য ডেলিভারি!",
      imageUrl: "/images/client-mockup/hero-bg-exact.png",
      linkUrl: "/e-sheba",
      placement: "Homepage Hero",
      displayOrder: 4,
      isActive: true,
    },
  ];

  for (const b of bannersData) {
    const existing = await prisma.banner.findFirst({
      where: { title: b.title, placement: b.placement },
    });
    if (!existing) {
      await prisma.banner.create({ data: b });
    }
  }
  console.log(`✓ Provisioned ${bannersData.length} client-approved hero homepage banners.`);

  // -----------------------------------------------------------------
  // 5. Promotional Coupons
  // -----------------------------------------------------------------
  const coupons = [
    {
      code: "WELCOME10",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      minOrderAmount: 1000,
      maxDiscountAmount: 500,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      usageLimit: 500,
      usageCount: 42,
    },
    {
      code: "SHOILPIK15",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 15,
      minOrderAmount: 2500,
      maxDiscountAmount: 750,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      usageLimit: 200,
      usageCount: 18,
    },
    {
      code: "FESTIVE20",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 20,
      minOrderAmount: 4000,
      maxDiscountAmount: 1200,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-11-30"),
      usageLimit: 100,
      usageCount: 5,
    },
    {
      code: "FLAT200",
      discountType: DiscountType.FIXED,
      discountValue: 200,
      minOrderAmount: 1500,
      maxDiscountAmount: 200,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      usageLimit: 300,
      usageCount: 29,
    },
  ];

  for (const cp of coupons) {
    await prisma.coupon.upsert({
      where: { code: cp.code },
      update: cp,
      create: cp,
    });
  }
  console.log("✓ Seeded active coupons (WELCOME10, SHOILPIK15, FESTIVE20, FLAT200).");

  // -----------------------------------------------------------------
  // 6. Ensure clean operational state (NO demo orders, inquiries or dummy data)
  // -----------------------------------------------------------------
  await prisma.deliveryTrackingEvent.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.serviceInquiry.deleteMany({});
  await prisma.careerApplication.deleteMany({});
  console.log("✓ Verified zero demo orders, inquiries, or mock transactions in database.");

  // -----------------------------------------------------------------
  // 7. Career Listings (Available positions without dummy applicants)
  // -----------------------------------------------------------------
  await prisma.careerListing.deleteMany({});
  await prisma.careerListing.create({
    data: {
      title: "Quality Assurance Specialist (Handicraft & Textiles)",
      department: "Product Integrity & Sourcing",
      location: "Dhaka & Artisan Clusters, Bangladesh",
      employmentType: EmploymentType.FULL_TIME,
      experience: "2-4 years",
      deadline: new Date("2026-11-30"),
      description: "Lead on-site quality inspection for artisanal pottery, handloom fabrics, and jute products across partner artisan clusters in Dhamrai, Jessore, and Tangail.",
      requirements: [
        "Bachelor's degree in Textile Engineering, Fine Arts, or relevant discipline.",
        "Demonstrated experience in export-quality textile and handicraft evaluation.",
        "Willingness to travel to artisan clusters across Bangladesh.",
        "Strong attention to detail and craftsmanship aesthetics.",
      ],
    },
  });

  await prisma.careerListing.create({
    data: {
      title: "Corporate B2B Account Manager (Special E-Sheba)",
      department: "Institutional Sales & Client Relations",
      location: "Dhaka (Head Office)",
      employmentType: EmploymentType.FULL_TIME,
      experience: "3-5 years",
      deadline: new Date("2026-12-15"),
      description: "Manage relationships with corporate procurement departments, multinational firms, and institutions seeking customized gifting and eco-friendly jute supplies.",
      requirements: [
        "Proven track record in B2B corporate sales or institutional procurement in Bangladesh.",
        "Excellent communication, presentation, and negotiation skills.",
        "Experience preparing formal RFPs and commercial proposals.",
      ],
    },
  });
  console.log("✓ Seeded active Career Vacancies.");

  // -----------------------------------------------------------------
  // 9. Site Settings (Verified Official Details)
  // -----------------------------------------------------------------
  const settingsData = [
    { key: "store_name", value: "SHOILPIKKABBO", category: "general", description: "Official business name" },
    { key: "tagline", value: "Delivery • Quality • Reliability", category: "general", description: "Official brand promise" },
    { key: "contact_primary", value: "01731214379", category: "contact", description: "Primary operations and customer support phone" },
    { key: "contact_secondary", value: "01811909068", category: "contact", description: "Secondary contact phone" },
    { key: "contact_email", value: "shoilpikkabbo@gmail.com", category: "contact", description: "Official client correspondence email" },
    { key: "contact_payment", value: "01977765999", category: "payment", description: "Payment support phone number" },
    { key: "payment_bkash_number", value: "01977765999", category: "payment", description: "Official bKash recipient number" },
    { key: "payment_nagad_number", value: "01977765999", category: "payment", description: "Official Nagad recipient number" },
    { key: "bank_name", value: "BRAC Bank PLC", category: "payment", description: "Official settlement bank" },
    { key: "bank_account_name", value: "SHOILPIKKABBO", category: "payment", description: "Bank account title" },
    { key: "delivery_dhaka", value: "70", category: "delivery", description: "Standard inside-Dhaka delivery fee (BDT)" },
    { key: "delivery_outside", value: "130", category: "delivery", description: "Standard outside-Dhaka courier fee (BDT)" },
    { key: "free_delivery_threshold", value: "3000", category: "delivery", description: "Order minimum for complimentary free delivery (BDT)" },
    { key: "social_whatsapp", value: "https://wa.me/8801731214379", category: "social", description: "Direct WhatsApp support link" },
    { key: "social_facebook", value: "https://facebook.com/shoilpikkabbo", category: "social", description: "Official Facebook page URL" },
    { key: "social_messenger", value: "https://m.me/shoilpikkabbo", category: "social", description: "Official Messenger link" },
    { key: "social_youtube", value: "https://youtube.com/@shoilpikkabbo", category: "social", description: "Official YouTube channel URL" },
    { key: "office_address", value: "House 12, Road 4, Sector 3, Uttara, Dhaka - 1230, Bangladesh", category: "contact", description: "Headquarters & operations address" },
    { key: "office_hours", value: "Saturday - Thursday: 9:00 AM - 8:00 PM", category: "contact", description: "Customer care working hours" },
    { key: "header_announcement", value: "Free delivery nationwide on orders above ৳3,000 | Authentic Bengali Craftsmanship", category: "general", description: "Storefront top announcement bar text" },
  ];

  for (const s of settingsData) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { description: s.description }, // Preserve existing admin edits without overwriting
      create: s,
    });
  }
  console.log("✓ Seeded verified store settings (phones, bank, delivery fees, brand promise).");
 
  // -----------------------------------------------------------------
  // 10. Default Visual CMS Pages (Home, About, Services, Contact)
  // -----------------------------------------------------------------
  const defaultCmsPages = [
    { slug: "home", title: "Home Page", sections: getDefaultHomePageSections() },
    { slug: "about", title: "About Us Page", sections: getDefaultAboutPageSections() },
    { slug: "services", title: "Special E-Sheba & Services Page", sections: getDefaultServicesPageSections() },
    { slug: "contact", title: "Contact Us Page", sections: getDefaultContactPageSections() },
  ];

  for (const p of defaultCmsPages) {
    const existingPub = await prisma.pageVersion.findFirst({
      where: { slug: p.slug, status: PageStatus.PUBLISHED },
    });
    if (!existingPub) {
      await prisma.pageVersion.create({
        data: {
          slug: p.slug,
          title: p.title,
          status: PageStatus.PUBLISHED,
          version: 1,
          sections: p.sections as any,
          publishedAt: new Date(),
          metadata: {
            title: `SHOILPIKKABBO | ${p.title}`,
            description: "Authentic Bangladeshi craftsmanship and solutions.",
          },
        },
      });
    }

    const existingDraft = await prisma.pageVersion.findFirst({
      where: { slug: p.slug, status: PageStatus.DRAFT },
    });
    if (!existingDraft) {
      await prisma.pageVersion.create({
        data: {
          slug: p.slug,
          title: p.title,
          status: PageStatus.DRAFT,
          version: (existingPub?.version || 1) + 1,
          sections: p.sections as any,
          metadata: {
            title: `SHOILPIKKABBO | ${p.title}`,
            description: "Authentic Bangladeshi craftsmanship and solutions.",
          },
        },
      });
    }
  }
  console.log("✓ Seeded verified CMS Page Versions (Home, About, Services, Contact).");

  console.log("=================================================");
  console.log("🎉 Complete SHOILPIKKABBO database seed finished!");
  console.log("=================================================");
}

main()
  .catch((e) => {
    console.error("Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
