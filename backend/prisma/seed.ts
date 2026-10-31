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
  // 3. Products (30 Verified English Products with 1:1 Square Images)
  // -----------------------------------------------------------------
  const products = [
    // =========================================================================
    // 1. HANDICRAFT (3 Products)
    // =========================================================================
    {
      name: "Handcrafted Terracotta Ceramic Tea Set",
      slug: "handcrafted-terracotta-ceramic-tea-set",
      categorySlug: "handicraft",
      price: 1850,
      salePrice: 1550,
      stock: 35,
      sku: "SK-HC-001",
      isFeatured: true,
      images: ["/images/products/handicraft-terracotta-tea-set.jpg"],
      description: "Exquisite handmade clay terracotta tea set shaped and fired by traditional master potters. Features one covered teapot and four matching clay cups with a natural semi-matte rustic finish.",
      specifications: {
        Material: "100% Pure Natural Fired Terracotta Clay",
        Origin: "Dhamrai, Dhaka, Bangladesh",
        Pieces: "1 Teapot (750ml) + 4 Tea Cups (150ml)",
        Finish: "Hand-Smoothed Semi-Matte Terracotta",
      },
    },
    {
      name: "Traditional Hand-Embroidered Nakshi Kantha Quilt",
      slug: "traditional-hand-embroidered-nakshi-kantha-quilt",
      categorySlug: "handicraft",
      price: 4500,
      salePrice: 3890,
      stock: 18,
      sku: "SK-HC-002",
      isFeatured: true,
      images: ["/images/products/handicraft-nakshi-kantha-quilt.jpg"],
      description: "Authentic heritage heirloom Nakshi Kantha meticulously hand-stitched by skilled rural women artisans. Features vibrant traditional floral, vine, and folklore motifs on pure hand-spun cotton.",
      specifications: {
        Dimensions: "90 x 100 inches (King Size)",
        Fabric: "100% Pure Hand-Spun Cotton",
        Origin: "Jessore, Bangladesh",
        Craft: "Authentic Running Stitch Hand Embroidery",
      },
    },
    {
      name: "Solid Brass Handcrafted Peacock Incense Burner",
      slug: "solid-brass-handcrafted-peacock-incense-burner",
      categorySlug: "handicraft",
      price: 1450,
      salePrice: 1250,
      stock: 40,
      sku: "SK-HC-003",
      isFeatured: false,
      images: ["/images/products/handicraft-brass-peacock-burner.jpg"],
      description: "Lost-wax hand-cast bell brass incense burner featuring an ornate peacock finial emblem and filigree smoke perforations. Hand-polished to an antique golden shine.",
      specifications: {
        Material: "Solid Bell Brass Metal",
        Weight: "480g",
        Origin: "Dhamrai Brass Craft Heritage",
        Finish: "Antique Brushed Brass",
      },
    },

    // =========================================================================
    // 2. JUTE ITEMS (3 Products)
    // =========================================================================
    {
      name: "Eco-Friendly Golden Jute Shopping Tote Bag",
      slug: "eco-friendly-golden-jute-shopping-tote-bag",
      categorySlug: "jute-items",
      price: 650,
      salePrice: 520,
      stock: 65,
      sku: "SK-JT-001",
      isFeatured: true,
      images: ["/images/products/jute-shopping-tote-bag.jpg"],
      description: "Durable eco-friendly shopping tote crafted from 100% natural export-grade golden jute fiber. Equipped with padded cotton webbing shoulder handles and interior water-resistant barrier.",
      specifications: {
        Material: "100% Export-Grade Golden Jute",
        Capacity: "15 kg Weight Capacity",
        Handles: "Soft Padded Cotton Webbing",
        Dimensions: "16 x 14 x 6 inches",
      },
    },
    {
      name: "Handwoven Golden Jute Round Storage Basket",
      slug: "handwoven-golden-jute-round-storage-basket",
      categorySlug: "jute-items",
      price: 950,
      salePrice: 820,
      stock: 45,
      sku: "SK-JT-002",
      isFeatured: false,
      images: ["/images/products/jute-storage-basket-round.jpg"],
      description: "Versatile cylindrical storage organizer handwoven from twisted golden jute coils with sturdy integrated carry handles. Ideal for living room throws, laundry, and nursery organization.",
      specifications: {
        Diameter: "14 inches",
        Height: "12 inches",
        Material: "Braided Natural Jute & Cotton Cord",
        Structure: "Free-standing Structured Coil",
      },
    },
    {
      name: "Hand-Braided Spiral Jute Table Coasters (Set of 6)",
      slug: "hand-braided-spiral-jute-table-coasters-set-6",
      categorySlug: "jute-items",
      price: 490,
      salePrice: 390,
      stock: 70,
      sku: "SK-JT-003",
      isFeatured: false,
      images: ["/images/products/jute-braided-coasters-set.jpg"],
      description: "Set of 6 natural golden jute circular table coasters. Heat resistant, eco-friendly, and hand-braided with reinforced edge stitching to protect dining surfaces.",
      specifications: {
        Pieces: "6 Circular Coasters",
        Diameter: "5 inches each",
        Material: "100% Natural Biodegradable Jute",
        HeatResistance: "Up to 120°C",
      },
    },

    // =========================================================================
    // 3. POLYMER (3 Products)
    // =========================================================================
    {
      name: "Airtight Clear Polymer Kitchen Canister Set of 4",
      slug: "airtight-clear-polymer-kitchen-canister-set-4",
      categorySlug: "polymer",
      price: 1150,
      salePrice: 950,
      stock: 50,
      sku: "SK-PL-001",
      isFeatured: true,
      images: ["/images/products/polymer-airtight-food-canisters.jpg"],
      description: "Set of 4 stackable crystal-clear food-grade polymer pantry storage canisters. Airtight silicone clamp lids lock in freshness for spices, rice, pulses, and dry foods.",
      specifications: {
        Pieces: "4 Canisters (500ml, 1L, 1.5L, 2L)",
        Material: "BPA-Free Food-Grade Polymer (PETG)",
        Seal: "Hermetic Silicone Ring Clamp Lock",
        Care: "Dishwasher Safe Top Rack",
      },
    },
    {
      name: "Heavy-Duty Stackable Polymer Utility Storage Crate",
      slug: "heavy-duty-stackable-polymer-utility-storage-crate",
      categorySlug: "polymer",
      price: 850,
      salePrice: 720,
      stock: 60,
      sku: "SK-PL-002",
      isFeatured: false,
      images: ["/images/products/polymer-industrial-storage-crate.jpg"],
      description: "Industrial strength virgin polymer utility crate designed for heavy household storage, grocery transport, and workshop organization. Perforated walls for ventilation.",
      specifications: {
        Volume: "45 Liters",
        LoadCapacity: "35 kg Max Load",
        Material: "High-Density Virgin Polypropylene",
        Dimensions: "520 x 360 x 280 mm",
      },
    },
    {
      name: "BPA-Free Reusable Polymer Sports Water Bottle (750ml)",
      slug: "bpa-free-reusable-polymer-sports-water-bottle-750ml",
      categorySlug: "polymer",
      price: 490,
      salePrice: 390,
      stock: 80,
      sku: "SK-PL-003",
      isFeatured: false,
      images: ["/images/products/polymer-sports-water-bottle.jpg"],
      description: "Sleek translucent matte polymer water bottle with one-click flip lid, secure locking latch, and silicone straw. Lightweight, shatterproof, and 100% leakproof.",
      specifications: {
        Capacity: "750 ml",
        Material: "100% Eastman Tritan BPA-Free Polymer",
        Temperature: "-10°C to 90°C Safe",
        Features: "Time & Volume Capacity Markers",
      },
    },

    // =========================================================================
    // 4. BABY ITEMS (3 Products)
    // =========================================================================
    {
      name: "Organic Muslin Cotton Baby Swaddle Blanket Wrap",
      slug: "organic-muslin-cotton-baby-swaddle-blanket-wrap",
      categorySlug: "baby-items",
      price: 780,
      salePrice: 650,
      stock: 55,
      sku: "SK-BB-001",
      isFeatured: true,
      images: ["/images/products/baby-muslin-cotton-swaddle.jpg"],
      description: "Ultra-soft pre-washed organic muslin cotton swaddle blanket. Open-weave breathable double gauze prevents overheating while wrapping infants in gentle comforting softness.",
      specifications: {
        Dimensions: "47 x 47 inches (120 x 120 cm)",
        Fabric: "100% GOTS Certified Organic Muslin Cotton",
        Weave: "Breathable Double-Layer Gauze",
        Care: "Machine Washable, Gets Softer Each Wash",
      },
    },
    {
      name: "Complete Infant Care Feeding and Grooming Essential Set",
      slug: "infant-care-feeding-grooming-essential-set",
      categorySlug: "baby-items",
      price: 950,
      salePrice: 790,
      stock: 45,
      sku: "SK-BB-002",
      isFeatured: false,
      images: ["/images/products/baby-gentle-care-grooming-set.jpg"],
      description: "Pediatrician-approved infant grooming and feeding care set. Includes anti-colic feeding bottles, gentle round-tip nail clipper, soft bristle brush, comb, and nasal aspirator.",
      specifications: {
        Safety: "100% BPA Free & Phthalate Free",
        AgeSuitability: "0-24 Months",
        Sterilization: "Boiling Water & Steam Sterilizer Safe",
      },
    },
    {
      name: "Soft Organic Cotton Plush Sensory Teddy Bear",
      slug: "soft-organic-cotton-plush-sensory-teddy-bear",
      categorySlug: "baby-items",
      price: 650,
      salePrice: 520,
      stock: 65,
      sku: "SK-BB-003",
      isFeatured: false,
      images: ["/images/products/baby-plush-sensory-teddy.jpg"],
      description: "Huggable baby plush teddy bear made with hypoallergenic organic cotton velour and embroidered facial features with no loose plastic buttons. Gentle companion for newborns.",
      specifications: {
        Height: "10 inches (25 cm)",
        OuterFabric: "100% Organic Cotton Velour",
        Filling: "Hypoallergenic Recycled Cotton Polyfill",
        Safety: "Embroidered Eyes, 100% Baby-Safe",
      },
    },

    // =========================================================================
    // 5. CORPORATE GIFT ITEMS (3 Products)
    // =========================================================================
    {
      name: "Executive Leatherette Planner Diary with Premium Pen Set",
      slug: "executive-leatherette-planner-diary-premium-pen-set",
      categorySlug: "corporate-gift-items",
      price: 1550,
      salePrice: 1290,
      stock: 50,
      sku: "SK-CG-001",
      isFeatured: true,
      images: ["/images/products/corporate-leatherette-diary-pen.jpg"],
      description: "Prestigious corporate executive notebook diary featuring a thermal PU leatherette cover with magnetic closure strap, pen loop, card slots, and an executive metal ballpoint pen in a gift box.",
      specifications: {
        Paper: "192 Ruled Pages (80 GSM Acid-Free Ivory Paper)",
        Cover: "Premium Thermal Texture PU Leatherette",
        Pen: "Weighted Metal Rollerball Pen (0.7mm Black)",
        Box: "Hardboard Matte Finish Presentation Box",
      },
    },
    {
      name: "Double-Wall Insulated Stainless Steel Thermal Flask (500ml)",
      slug: "double-wall-insulated-stainless-steel-thermal-flask-500ml",
      categorySlug: "corporate-gift-items",
      price: 1150,
      salePrice: 950,
      stock: 55,
      sku: "SK-CG-002",
      isFeatured: false,
      images: ["/images/products/corporate-insulated-thermal-flask.jpg"],
      description: "Matte black double-wall vacuum insulated thermal flask. Keeps hot beverages steaming for 12 hours and iced drinks cold for 24 hours. Sweat-proof powder coated exterior.",
      specifications: {
        Capacity: "500 ml",
        Interior: "Food-Grade SUS 304 Stainless Steel",
        Insulation: "Double-Wall Vacuum Core",
        Lid: "100% Leakproof BPA-Free Screw Cap",
      },
    },
    {
      name: "Solid Wood Executive Desktop Organizer with Phone Dock",
      slug: "solid-wood-executive-desktop-organizer-phone-dock",
      categorySlug: "corporate-gift-items",
      price: 2450,
      salePrice: 2090,
      stock: 30,
      sku: "SK-CG-003",
      isFeatured: false,
      images: ["/images/products/corporate-wooden-desk-dock.jpg"],
      description: "Meticulously crafted from solid natural walnut wood. Features dedicated docking channels for smartphone, pens, watch, keys, and visiting cards. Elevates any executive office desk.",
      specifications: {
        Material: "100% Natural Solid Walnut Wood",
        Dimensions: "280 x 180 x 25 mm",
        Finish: "Hand-Rubbed Organic Natural Wax",
        Features: "Cable Pass-Through Charging Channel",
      },
    },

    // =========================================================================
    // 6. RUDIMENT GARMENTS (3 Products)
    // =========================================================================
    {
      name: "Export Quality 100% Combed Cotton Crewneck Casual T-Shirt",
      slug: "export-quality-100-combed-cotton-crewneck-tshirt",
      categorySlug: "rudiment-garments",
      price: 650,
      salePrice: 520,
      stock: 90,
      sku: "SK-RG-001",
      isFeatured: false,
      images: ["/images/products/garments-combed-cotton-tshirt.jpg"],
      description: "Premium 180 GSM combed cotton jersey crewneck t-shirt. Bio-washed with silicone softener for an ultra-smooth hand-feel, zero shrinkage, and lasting color fastness.",
      specifications: {
        GSM: "180 GSM Bio-Washed Single Jersey",
        Fabric: "100% Combed Ring-Spun Cotton",
        Fit: "Modern Regular Contemporary Fit",
        Collar: "1x1 Ribbed Lycra Collar",
      },
    },
    {
      name: "Classic Honeycomb Pique Knit Cotton Polo Shirt",
      slug: "classic-honeycomb-pique-knit-cotton-polo-shirt",
      categorySlug: "rudiment-garments",
      price: 980,
      salePrice: 820,
      stock: 75,
      sku: "SK-RG-002",
      isFeatured: false,
      images: ["/images/products/garments-pique-cotton-polo.jpg"],
      description: "Breathable 220 GSM honeycomb pique cotton polo shirt featuring a structured ribbed knit collar, 2-button reinforced placket, and mother-of-pearl buttons.",
      specifications: {
        GSM: "220 GSM Breathable Honeycomb Pique",
        Fabric: "100% Combed Long-Staple Cotton",
        ColorFastness: "Grade 4+ Reactive Dyed",
        Care: "Machine Wash Cold, Hang Dry",
      },
    },
    {
      name: "Pure Cotton Casual Everyday Button-Down Shirt",
      slug: "pure-cotton-casual-everyday-button-down-shirt",
      categorySlug: "rudiment-garments",
      price: 1450,
      salePrice: 1250,
      stock: 45,
      sku: "SK-RG-003",
      isFeatured: false,
      images: ["/images/products/garments-casual-cotton-shirt.jpg"],
      description: "Lightweight, breathable pure cotton casual shirt with chest pocket and curved hemline. Tailored for comfort in warm tropical climates.",
      specifications: {
        Fabric: "100% Pre-Shrunk Breathable Cotton",
        Sleeves: "Full Sleeve with Buttoned Cuffs",
        Fit: "Smart Casual Fit",
      },
    },

    // =========================================================================
    // 7. INDUSTRIAL SOLUTIONS (3 Products)
    // =========================================================================
    {
      name: "ANSI Certified High-Impact Industrial Safety Hard Hat Helmet",
      slug: "ansi-certified-high-impact-industrial-safety-helmet",
      categorySlug: "industrial-solutions",
      price: 850,
      salePrice: 720,
      stock: 70,
      sku: "SK-IS-001",
      isFeatured: false,
      images: ["/images/products/industrial-safety-hard-hat.jpg"],
      description: "Heavy-duty industrial safety helmet manufactured from high-impact ABS resin. Features 6-point ratchet suspension for size adjustment, sweatband, and adjustable chin strap.",
      specifications: {
        Certification: "ANSI Z89.1 Type 1 Class E & CE EN 397",
        Material: "Virgin High-Impact ABS Polymer",
        Suspension: "6-Point Quick-Ratchet Headband",
        Ventilation: "Top Air Circulation Convection Ports",
      },
    },
    {
      name: "Heavy-Duty Textured Protective Work Safety Gloves",
      slug: "heavy-duty-textured-protective-work-safety-gloves",
      categorySlug: "industrial-solutions",
      price: 390,
      salePrice: 290,
      stock: 120,
      sku: "SK-IS-002",
      isFeatured: false,
      images: ["/images/products/industrial-nitrile-work-gloves.jpg"],
      description: "Abrasion-resistant industrial work gloves with reinforced textured palms for heavy handling and superior heat/cut resistance in workshop and factory environments.",
      specifications: {
        Material: "Heavy-Duty Split Cowhide & Reinforced Palm",
        Cuff: "Safety Gauntlet Cuff for Wrist Protection",
        Standard: "EN 388 Mechanical Risk Certified",
        Usage: "Welding, Fabrication, Warehouse, Handling",
      },
    },
    {
      name: "Anti-Fog Clear Polycarbonate Eye Protection Safety Goggles",
      slug: "anti-fog-clear-polycarbonate-eye-protection-safety-goggles",
      categorySlug: "industrial-solutions",
      price: 450,
      salePrice: 350,
      stock: 85,
      sku: "SK-IS-003",
      isFeatured: false,
      images: ["/images/products/industrial-safety-goggles.jpg"],
      description: "Wrap-around clear safety goggles engineered with dual-coated anti-fog and anti-scratch polycarbonate lenses. Soft vinyl seal conforms comfortably to facial contours.",
      specifications: {
        Standard: "ANSI Z87.1+ High-Impact & CE EN 166",
        Lens: "UV400 Optical Grade Clear Polycarbonate",
        Strap: "Adjustable Elastic Neoprene Headband",
        Ventilation: "Indirect Splash-Proof Air Baffle Vents",
      },
    },

    // =========================================================================
    // 8. HEALTH AND BEAUTY (3 Products)
    // =========================================================================
    {
      name: "Cold-Pressed Virgin Black Seed Kalijira Oil (250ml)",
      slug: "cold-pressed-virgin-black-seed-kalijira-oil-250ml",
      categorySlug: "health-and-beauty",
      price: 680,
      salePrice: 560,
      stock: 65,
      sku: "SK-HB-001",
      isFeatured: true,
      images: ["/images/products/health-virgin-black-seed-oil.jpg"],
      description: "100% pure virgin cold-pressed Nigella Sativa black seed oil extracted from organically cultivated Kalijira seeds. Rich in Thymoquinone antioxidants and essential fatty acids.",
      specifications: {
        Volume: "250 ml Dark Amber UV Glass Bottle",
        Extraction: "First-Press Cold Pressed (No Solvents)",
        Purity: "100% Raw Unfiltered Nigella Sativa",
        Usage: "Dietary Supplement & Hair/Skincare",
      },
    },
    {
      name: "Pure Raw Organic Sundarban Forest Honey Glass Jar (500g)",
      slug: "pure-raw-organic-sundarban-forest-honey-500g",
      categorySlug: "health-and-beauty",
      price: 980,
      salePrice: 850,
      stock: 50,
      sku: "SK-HB-002",
      isFeatured: false,
      images: ["/images/products/health-organic-sundarban-honey.jpg"],
      description: "Authentic raw mangrove wildflower honey sustainably harvested by traditional honey hunters (Mawals) from the deep mangrove forests of Sundarbans. Packed with active pollen.",
      specifications: {
        NetWeight: "500 Grams Glass Hexagonal Jar",
        FloraSource: "Sundarbans Wild Mangrove Forest",
        Processing: "Unheated, Unpasteurized Raw Honey",
        Certification: "100% Pure Natural Lab Tested",
      },
    },
    {
      name: "Artisanal Organic Neem and Aloe Vera Herbal Bath Soap Bar",
      slug: "artisanal-organic-neem-aloe-vera-herbal-soap-bar",
      categorySlug: "health-and-beauty",
      price: 240,
      salePrice: 190,
      stock: 95,
      sku: "SK-HB-003",
      isFeatured: false,
      images: ["/images/products/health-herbal-neem-soap.jpg"],
      description: "Cold-process handmade vegetable glycerine bar soap infused with cold-pressed antibacterial neem oil, soothing organic aloe vera gel, and pure tea tree essential oil.",
      specifications: {
        Weight: "125 Grams Bar",
        Base: "Cold-Pressed Coconut & Olive Oil",
        FreeFrom: "No SLS, No Parabens, No Animal Fat",
        SkinType: "Acne-Prone & Sensitive Skin",
      },
    },

    // =========================================================================
    // 9. AGRICULTURE (3 Products)
    // =========================================================================
    {
      name: "Premium Organic Vermicompost Earthworm Manure Fertilizer 5kg",
      slug: "premium-organic-vermicompost-fertilizer-5kg",
      categorySlug: "agriculture",
      price: 380,
      salePrice: 290,
      stock: 90,
      sku: "SK-AG-001",
      isFeatured: false,
      images: ["/images/products/agri-organic-vermicompost-5kg.jpg"],
      description: "Nutrient-dense organic earthworm vermicompost manure. Enriches topsoil with beneficial soil microflora, bio-available nitrogen, phosphorus, potassium, and humic acid.",
      specifications: {
        Weight: "5 kg Heavy Retail Poly Pack",
        OrganicMatter: "> 30% Active Carbon",
        Moisture: "< 18% Controlled Moisture",
        Application: "Rooftop Garden, Flowering & Fruit Plants",
      },
    },
    {
      name: "High-Germination Hybrid Kitchen Garden Vegetable Seedlings",
      slug: "high-germination-hybrid-vegetable-seed-collection",
      categorySlug: "agriculture",
      price: 480,
      salePrice: 380,
      stock: 75,
      sku: "SK-AG-002",
      isFeatured: false,
      images: ["/images/products/agri-hybrid-vegetable-seeds.jpg"],
      description: "Comprehensive home gardening seed kit containing 6 high-yield vegetable varieties: hybrid tomato, green chilli, spinach, red amaranth, coriander, and brinjal in moisture-locked packs.",
      specifications: {
        Varieties: "6 Foil-Sealed Air-Tight Packets",
        GerminationRate: "90% Minimum Guaranteed",
        Purity: "98% Clean Genetic Purity",
        Seasonality: "All-Season Homestead Cultivation",
      },
    },
    {
      name: "Balanced Organic Liquid Plant Growth Booster Spray (500ml)",
      slug: "balanced-organic-liquid-plant-growth-booster-500ml",
      categorySlug: "agriculture",
      price: 450,
      salePrice: 360,
      stock: 60,
      sku: "SK-AG-003",
      isFeatured: false,
      images: ["/images/products/agri-liquid-plant-booster.jpg"],
      description: "Fast-absorbing bio-organic liquid fertilizer spray fortified with sea kelp extract, chelated micronutrients, and amino acids. Promotes vigorous root growth and lush green foliage.",
      specifications: {
        Volume: "500 ml Ready-To-Use Trigger Spray Bottle",
        Formula: "Balanced Organic N-P-K + Seaweed Extract",
        Safety: "100% Non-Toxic & Pet Safe",
        Application: "Foliar Spray Every 10-14 Days",
      },
    },

    // =========================================================================
    // 10. SPECIAL E-SHEBA (3 Products)
    // =========================================================================
    {
      name: "Bespoke Corporate Gift Box Custom Branding Solution",
      slug: "bespoke-corporate-gift-box-custom-packaging-solution",
      categorySlug: "special-e-sheba",
      price: 3500,
      salePrice: 2990,
      stock: 35,
      sku: "SK-ES-001",
      isFeatured: false,
      images: ["/images/products/esheba-custom-gift-box.jpg"],
      description: "End-to-end bespoke institutional gifting consultation, custom rigid box fabrication with gold/silver hot foil stamping, curated artisanal merchandise, and nationwide delivery.",
      specifications: {
        ServiceScope: "Custom Box Sizing, Logo Stamping, Artisan Product Curation",
        MinOrder: "Bulk Corporate Packages from 25 Units",
        Turnaround: "3 to 5 Business Days Delivery",
      },
    },
    {
      name: "Bulk Artisan Heritage Crafts and Jute Sourcing Service",
      slug: "bulk-artisan-handloom-crafts-procurement-service",
      categorySlug: "special-e-sheba",
      price: 2500,
      salePrice: 2000,
      stock: 30,
      sku: "SK-ES-002",
      isFeatured: false,
      images: ["/images/products/esheba-bulk-artisan-sourcing.jpg"],
      description: "Direct village artisan matchmaking, quality control inspections, and fair-trade bulk procurement of handloom textiles, pottery, and brass items for retail chains and export buyers.",
      specifications: {
        SourcingHubs: "Tangail, Jessore, Dhamrai, Rajshahi Clusters",
        QualityControl: "Physical Pre-Dispatch Inspection & Batch Testing",
        Pricing: "Direct Fair-Trade Wholesale Artisan Rates",
      },
    },
    {
      name: "Eco-Friendly Biodegradable Recycled Kraft Paper Packaging",
      slug: "eco-friendly-recycled-kraft-packaging-solution",
      categorySlug: "special-e-sheba",
      price: 4200,
      salePrice: 3500,
      stock: 25,
      sku: "SK-ES-003",
      isFeatured: false,
      images: ["/images/products/esheba-recycled-kraft-packaging.jpg"],
      description: "Sustainable enterprise packaging design with unbleached recycled kraft paper corrugated cartons, biodegradable jute twine ties, and non-toxic soy-based ink printing.",
      specifications: {
        Material: "100% Recycled & Biodegradable Kraft Paperboard",
        Printing: "Eco Soy-Based Non-Toxic Inks",
        Customization: "Die-Cut Custom Dimensions & Brand Print",
      },
    },
  ];

  // 1. Clean up any old product images with unsplash.com to guarantee 100% authentic 1:1 images
  await prisma.productImage.deleteMany({
    where: {
      url: { contains: 'unsplash.com' },
    },
  });

  // 2. Clean up any legacy products not in our verified 30 products catalog
  const realisticSlugs = products.map((p) => p.slug);
  await prisma.product.deleteMany({
    where: {
      slug: { notIn: realisticSlugs },
    },
  });

  const productMap = new Map<string, any>();
  for (const prod of products) {
    const categoryId = categoryMap.get(prod.categorySlug);
    if (!categoryId) {
      console.warn(`Category not found for slug: ${prod.categorySlug}`);
      continue;
    }

    const createdProd = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        price: prod.price,
        salePrice: prod.salePrice || null,
        stock: prod.stock,
        sku: prod.sku,
        isFeatured: prod.isFeatured,
        description: prod.description,
        specifications: prod.specifications,
        images: {
          deleteMany: {},
          create: prod.images.map((url, idx) => ({
            url,
            altText: `${prod.name} image ${idx + 1}`,
            isPrimary: idx === 0,
            displayOrder: idx,
          })),
        },
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
          create: prod.images.map((url, idx) => ({
            url,
            altText: `${prod.name} image ${idx + 1}`,
            isPrimary: idx === 0,
            displayOrder: idx,
          })),
        },
      },
    });
    productMap.set(prod.slug, createdProd);
  }
  console.log(`✓ Seeded all ${products.length} verified products with 1:1 authentic images.`);

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
