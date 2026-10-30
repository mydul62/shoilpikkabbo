import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedProductsRealistic() {
  console.log("==================================================================");
  console.log("🚀 Seeding Realistic Catalog matching Product Upload Dashboard Spec");
  console.log("==================================================================");

  // 1. Ensure all 10 core categories exist
  const coreCategories = [
    { name: "Handicrafts", slug: "handicraft", description: "Authentic pottery, Nakshi Kantha, and heritage artisan crafts.", imageUrl: "/images/client-mockup/cat-handicrafts.png", displayOrder: 1 },
    { name: "Jute Items", slug: "jute-items", description: "Eco-friendly golden fiber bags, braided rugs, and lifestyle decor.", imageUrl: "/images/client-mockup/cat-jute.png", displayOrder: 2 },
    { name: "Polymer", slug: "polymer", description: "High quality polymer storage jars, household containers, and crates.", imageUrl: "/images/client-mockup/cat-polymer.png", displayOrder: 3 },
    { name: "Baby Items", slug: "baby-items", description: "Gentle baby care essentials, soft muslin apparel, and gifts.", imageUrl: "/images/client-mockup/cat-baby.png", displayOrder: 4 },
    { name: "Corporate Gift Items", slug: "corporate-gift-items", description: "Curated gift boxes, executive packaging, and hampers.", imageUrl: "/images/client-mockup/cat-corporate.png", displayOrder: 5 },
    { name: "Rudiment Garments", slug: "rudiment-garments", description: "Export-standard premium combed cotton apparel and kurtas.", imageUrl: "/images/client-mockup/cat-garments.png", displayOrder: 6 },
    { name: "Industrial Solutions", slug: "industrial-solutions", description: "Workplace safety accessories, protective gear, and hardware.", imageUrl: "/images/client-mockup/cat-industrial.png", displayOrder: 7 },
    { name: "Health and Beauty", slug: "health-and-beauty", description: "Pure cold-pressed virgin oils, raw honey, and wellness care.", imageUrl: "/images/client-mockup/cat-beauty.png", displayOrder: 8 },
    { name: "Agriculture", slug: "agriculture", description: "High-yield seeds, organic fertilizers, and garden inputs.", imageUrl: "/images/client-mockup/cat-agriculture.png", displayOrder: 9 },
    { name: "Special E-Sheba & Services", slug: "special-e-sheba", description: "Institutional procurement, custom gift branding, and bespoke sourcing.", imageUrl: "/images/client-mockup/cat-services.png", displayOrder: 10 },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of coreCategories) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        imageUrl: cat.imageUrl,
        displayOrder: cat.displayOrder,
      },
      create: cat,
    });
    categoryMap.set(cat.slug, createdCat.id);
  }

  // Alias for e-sheba
  if (categoryMap.has("special-e-sheba")) {
    categoryMap.set("e-sheba", categoryMap.get("special-e-sheba")!);
  }

  console.log(`✓ Synchronized all 10 core categories in database.`);

  // 2. Clean up existing products, product images, cart items, order items cleanly
  console.log("🧹 Clearing old products, cart items, and product images...");
  await prisma.cartItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  console.log("✓ Old products and related records removed.");

  // 3. Define 25+ rich, realistic products across all categories with multiple gallery images, rich HTML descriptions, and full specifications
  const products = [
    // =========================================================================
    // 1. HANDICRAFTS (মৃৎশিল্প ও হস্তশিল্প)
    // =========================================================================
    {
      name: "হাতে তৈরি টেরাকোটা সিরামিক টি-সেট (৬ কাপ ও ১ টি-পট) / Handcrafted Terracotta Ceramic Tea Set",
      slug: "handcrafted-terracotta-ceramic-tea-set",
      categorySlug: "handicraft",
      price: 1850,
      salePrice: 1550,
      stock: 28,
      sku: "SK-HC-101",
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1576020799627-aeac74d58064?auto=format&fit=crop&w=900&q=80",
      ],
      description: `
        <p>বাংলার ঐতিহ্যবাহী কুমার সম্প্রদায়ের দক্ষ হাতের ছোঁয়ায় তৈরি এই প্রিমিয়াম টেরাকোটা টি-সেট। ধামরাইয়ের ঐতিহ্যবাহী মৃৎশিল্পীদের নিপুণ দক্ষতায় তৈরি পাত্রগুলো উচ্চ তাপে পোড়ানো এবং প্রাকৃতিক উপায়ে পলিশ করা, যা চায়ের আসল স্বাদ ও দীর্ঘস্থায়ী উষ্ণতা ধরে রাখে।</p>
        <h3>প্রধান বৈশিষ্ট্যসমূহ (Key Highlights):</h3>
        <ul>
          <li><strong>১০০% রাসায়নিক মুক্ত ও অর্গানিক:</strong> বিশুদ্ধ প্রাকৃতিক এঁটেল মাটি দিয়ে তৈরি এবং লেড-ফ্রি প্রাকৃতিক ফিনিশিং।</li>
          <li><strong>আরামদায়ক তাপ ধরে রাখার ক্ষমতা:</strong> সিরামিকের চেয়েও দ্বিগুণ সময় মাটির তৈরি পাত্র চায়ের উষ্ণতা ও সুবাস রক্ষা করে।</li>
          <li><strong>পূর্ণাঙ্গ পারিবারিক সেট:</strong> সেটটিতে রয়েছে ৬টি চমৎকার টেক্সচার্ড কাপ এবং ঢাকনাসহ ১টি বড় সাইজের টি-পট।</li>
          <li><strong>ড্রয়িংরুম ও অতিথি আপ্যায়নে অনন্য:</strong> যেকোনো অতিথি আপ্যায়নে কিংবা লিভিং রুমের ডেকোরে এনে দেয় ঐতিহ্যের রাজকীয় ছোঁয়া।</li>
        </ul>
        <h3>যত্ন ও ব্যবহারবিধি (Care & Maintenance):</h3>
        <p>প্রথম ব্যবহারের আগে সাধারণ পানিতে ৩০ মিনিট ভিজিয়ে শুকিয়ে নিন। হালকা উষ্ণ পানি ও নরম স্পঞ্জ দিয়ে ধুয়ে নিন। তীব্র ক্ষারযুক্ত ডিটারজেন্ট ব্যবহার এড়িয়ে চলুন।</p>
      `,
      specifications: {
        Material: "100% Pure Natural Terracotta Clay",
        Origin: "Dhamrai, Dhaka, Bangladesh",
        Pieces: "6 Cups (150ml each) + 1 Teapot (750ml)",
        Finish: "Natural Semi-Matte Heat Glaze",
        Dimensions: "Teapot: 6x7 inch, Cups: 3x3 inch",
        Weight: "1.45 kg (Complete Set)",
        Care: "Hand wash with mild warm water, air dry",
      },
    },
    {
      name: "ঐতিহ্যবাহী নকশিকাঁথা প্রিমিয়াম কিং সাইজ / Heritage Hand-Embroidered Nakshi Kantha (King Size)",
      slug: "heritage-nakshi-kantha-king-size",
      categorySlug: "handicraft",
      price: 4800,
      salePrice: 4200,
      stock: 14,
      sku: "SK-HC-102",
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80",
      ],
      description: `
        <p>যশোরের গ্রামীণ নারী শিল্পীদের নিপুণ হাতের সুই-সুতায় তৈরি এই নকশিকাঁথা বাংলার শতাব্দী প্রাচীন লোকজ সংস্কৃতির এক জীবন্ত দলিল। এক একটি কাঁথা সম্পূর্ণ সেলাই করতে একজন দক্ষ কারিগরের প্রায় তিন থেকে চার মাস সময় লাগে।</p>
        <h3>প্রধান বৈশিষ্ট্যসমূহ:</h3>
        <ul>
          <li><strong>শতভাগ খাঁটি সুতি ফেব্রিক:</strong> আরামদায়ক প্রিমিয়াম কম্বড কটন কাপড়ে তৈরি, যা সব ঋতুতেই আরামদায়ক উষ্ণতা দেয়।</li>
          <li><strong>বর্ণিল লোকজ নকশা:</strong> শাপলা, ময়ূর, পদ্মফুল ও গ্রামীণ দৃশ্য সংবলিত ঐতিহ্যবাহী নকশা।</li>
          <li><strong>রংয়ের স্থায়ী নিশ্চয়তা:</strong> পাকাপোক্ত সুতায় বোনা, ফলে ধোয়ার পরও রং নষ্ট হওয়ার ভয় নেই।</li>
        </ul>
      `,
      specifications: {
        Material: "100% Organic Combed Cotton",
        Origin: "Jessore, Bangladesh",
        Dimensions: "90 x 100 inches (King Bed Size)",
        Craft: "Authentic Hand-Needle Stitching",
        Weight: "1.8 kg",
        Care: "Gentle hand wash or dry clean recommended",
      },
    },
    {
      name: "খাঁটি পিতলের নকশাদার রাজকীয় ময়ূর আগরবাতি ও ধুনুচি দানি / Royal Brass Peacock Incense Holder",
      slug: "royal-brass-peacock-incense-holder",
      categorySlug: "handicraft",
      price: 1650,
      salePrice: 1390,
      stock: 35,
      sku: "SK-HC-103",
      isFeatured: false,
      images: [
        "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
      ],
      description: `
        <p>ধামরাইয়ের প্রাচীন ব্রাস কাস্টিং কারিগরদের তৈরি খাঁটি পিতলের ময়ূরপঙ্খী ধুনুচি ও সুগন্ধি দানি। ঘরকে মনোরম সুবাসে ভরিয়ে তুলতে এবং অ্যান্টিক হোম ডেকোরে এর জুড়ি নেই।</p>
      `,
      specifications: {
        Material: "Solid Cast Brass (খাঁটি পিতল)",
        Origin: "Dhamrai Metal Heritage",
        Finish: "Antique Gold Polished",
        Dimensions: "Height: 7.5 inches, Base: 4 inches",
        Weight: "520 grams",
        Care: "Wipe with dry soft cloth or brass cleaner",
      },
    },

    // =========================================================================
    // 2. JUTE ITEMS (সোনালী আঁশের পাটজাত পণ্য)
    // =========================================================================
    {
      name: "প্রিমিয়াম গোল্ডেন জুট স্টোরেজ বাস্কেট (Set of 3) / Handwoven Jute Storage Basket Set",
      slug: "handwoven-jute-storage-basket-set",
      categorySlug: "jute-items",
      price: 1750,
      salePrice: 1450,
      stock: 40,
      sku: "SK-JT-101",
      isFeatured: true,
      images: [
        "/images/product-jute-basket.png",
        "/images/product-jute-basket-large.png",
        "/images/jute-basket-lifestyle.png",
        "/images/story-artisan.png",
      ],
      description: `
        <p>ফরিদপুরের খাঁটি সোনালী আঁশের পরিবেশবান্ধব পাটের সুতায় দক্ষ তাঁতিদের হাতে বোনা ৩ পিসের কমপ্লিট স্টোরেজ বাস্কেট সেট। আপনার বেডরুম, লিভিং স্পেস কিংবা ড্রয়ার গোছাতে এটি অত্যন্ত টেকসই এবং স্টাইলিশ সমাধান।</p>
        <h3>প্রধান বৈশিষ্ট্যসমূহ:</h3>
        <ul>
          <li><strong>৩টি ভিন্ন সাইজ:</strong> বড়, মাঝারি ও ছোট সাইজের বাস্কেট যা কাপড়, বই, বাচ্চাদের খেলনা কিংবা প্ল্যান্টার কভার হিসেবে আদর্শ।</li>
          <li><strong>মজবুত হ্যান্ডেল ও বুনন:</strong> ডাবল-স্টিচড কটন রোপ হ্যান্ডেল থাকায় সহজে এক স্থান থেকে অন্য স্থানে বহন করা যায়।</li>
          <li><strong>১০০% বায়োডিগ্রেডেবল ও টেকসই:</strong> পরিবেশের কোনো ক্ষতি না করে বছরের পর বছর নতুনের মতো সেবা দেয়।</li>
        </ul>
      `,
      specifications: {
        Material: "100% Export-Grade Golden Jute Fiber",
        Origin: "Faridpur, Bangladesh",
        Dimensions: "Large: 14x12 in, Medium: 12x10 in, Small: 10x8 in",
        Weave: "Braided Spiral Coil",
        Weight: "920 grams (Combined Set)",
        Color: "Natural Golden Sand with Ivory Trim",
        Care: "Spot clean with damp cloth, keep in dry place",
      },
    },
    {
      name: "ন্যাচারাল ব্রেইডেড গোল্ডেন জুট ফ্লোর রাগ কার্পেট (5x3 ft) / Braided Golden Jute Floor Rug",
      slug: "braided-golden-jute-floor-rug-5x3",
      categorySlug: "jute-items",
      price: 2600,
      salePrice: 2250,
      stock: 22,
      sku: "SK-JT-102",
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80",
      ],
      description: `
        <p>খাঁটি সোনালী পাটের ব্রেইডেড লুপ টেকনিক্সে বোনা ৫x৩ ফুটের আন্তর্জাতিক মানের ফ্লোর কার্পেট। ড্রয়িং রুম, বেডরুমের সাইডওয়াক কিংবা অফিস লাউঞ্জে এনে দেয় শান্ত, মার্জিত ও নান্দনিক বোহো ভাইব।</p>
      `,
      specifications: {
        Material: "Pure Braided Golden Jute",
        Dimensions: "5 feet x 3 feet (152 x 91 cm)",
        Thickness: "12 mm Heavy-Duty Weave",
        Reversible: "Yes (উভয় পাশ ব্যবহারযোগ্য)",
        Origin: "Narsingdi Jute Mills Cluster",
        Care: "Vacuum clean lightly, avoid excessive moisture",
      },
    },
    {
      name: "এক্সিকিউটিভ ইকো-জুট ল্যাপটপ ব্যাগ / Executive Eco-Jute Laptop Tote Bag",
      slug: "executive-eco-jute-laptop-tote-bag",
      categorySlug: "jute-items",
      price: 1650,
      salePrice: 1380,
      stock: 36,
      sku: "SK-JT-103",
      isFeatured: false,
      images: [
        "/images/product-jute-tote.png",
        "/images/client-mockup/prod-jute-bag.png",
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80",
      ],
      description: `
        <p>ল্যাপটপ, ফাইল ও প্রয়োজনীয় অফিস সামগ্রী নিরাপদে বহনের জন্য ওয়াটার-রেজিস্ট্যান্ট লাইনিং ও প্রিমিয়াম ভেগান লেদার হ্যান্ডেল সংবলিত স্মার্ট জুট ব্যাগ।</p>
      `,
      specifications: {
        Material: "Laminated High-Density Golden Jute",
        Compartment: "Padded Laptop Sleeve (Up to 15.6 inch) + 3 Accessory Pockets",
        Handle: "Reinforced Vegan Leather Strap",
        Dimensions: "16 x 12.5 x 4.5 inches",
        Origin: "Dhaka Export Garments Division",
      },
    },

    // =========================================================================
    // 3. POLYMER (পলিমার ও টেকসই কন্টেইনার)
    // =========================================================================
    {
      name: "এয়ারটাইট ফুড-গ্রেড পলিমার স্টোরেজ জার সেট (৬ পিস) / Airtight Polymer Food Jar Set",
      slug: "airtight-polymer-food-storage-jar-set",
      categorySlug: "polymer",
      price: 1250,
      salePrice: 990,
      stock: 55,
      sku: "SK-PL-101",
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1585336261026-41865c5590b8?auto=format&fit=crop&w=900&q=80",
      ],
      description: `
        <p>১০০% বিপিএ-মুক্ত ও আন্তর্জাতিক ফুড-গ্রেড স্ট্যান্ডার্ড পলিমার উপাদান দিয়ে তৈরি কিচেন স্টোরেজ জার সেট। সিলিকন সিল লক সিস্টেম থাকায় চাল, ডাল, বিস্কুট, মসলা দীর্ঘদিন মুচমুচে ও সতেজ থাকে।</p>
      `,
      specifications: {
        Material: "BPA-Free Food Grade Virgin Polymer",
        SetContents: "2x 1800ml, 2x 1200ml, 2x 600ml Jars",
        Seal: "Silicone Air-Lock Leakproof Lid",
        Safety: "Microwave Safe (without lid), Freezer & Dishwasher Safe",
        Origin: "Industrial Polymer Hub, Gazipur",
      },
    },
    {
      name: "হেভি-ডিউটি কোল্যাপসিবল পলিমার স্টোরেজ ক্রেট (৪৫ লিটার) / Collapsible Heavy Polymer Crate",
      slug: "collapsible-heavy-polymer-crate-45l",
      categorySlug: "polymer",
      price: 850,
      salePrice: 720,
      stock: 45,
      sku: "SK-PL-102",
      isFeatured: false,
      images: [
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=900&q=80",
      ],
      description: `
        <p>গাড়ির ট্রাঙ্ক, স্টোররুম বা শপে ভারী মালামাল সংরক্ষণের জন্য ফোল্ডেবল পলিমার ক্রেট। ব্যবহার না করলে ভাঁজ করে অনায়াসে স্লিম করে রেখে দেওয়া যায়।</p>
      `,
      specifications: {
        Material: "High-Density Polypropylene (HDPE)",
        Capacity: "45 Liters / 30kg Weight Support",
        Dimensions: "Expanded: 52x36x28 cm, Folded: 52x36x6 cm",
        Feature: "Stackable Interlocking System",
      },
    },

    // =========================================================================
    // 4. BABY ITEMS (শিশুর কোমল যত্ন ও পোশাক)
    // =========================================================================
    {
      name: "অর্গানিক পিওর মসলিন কটন বেবি সোয়াডল ব্ল্যাঙ্কেট (৩ প্যাক) / Organic Muslin Baby Swaddle Set",
      slug: "organic-muslin-baby-swaddle-blanket-3pack",
      categorySlug: "baby-items",
      price: 1350,
      salePrice: 1150,
      stock: 35,
      sku: "SK-BB-101",
      isFeatured: true,
      images: [
        "/images/client-mockup/prod-baby-set.png",
        "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=80",
      ],
      description: `
        <p>নবজাতক শিশুর অত্যন্ত সংবেদনশীল ত্বকের কথা মাথায় রেখে তৈরি ১০০% প্রাকৃতিক অরগানিক মসলিন সুতি সোয়াডল সেট। প্রতিটি ধোয়ার সাথে সাথে এটি আরও বেশি নরম ও আরামদায়ক হয়ে ওঠে।</p>
      `,
      specifications: {
        Material: "100% GOTS Certified Organic Cotton Muslin",
        SetCount: "3 Large Swaddles (47 x 47 inches each)",
        AgeGroup: "Newborn to 18 Months",
        Dye: "Zero-Chemical Non-Toxic Botanical Pigments",
        Care: "Machine wash cold with gentle baby detergent",
      },
    },
    {
      name: "কমপ্লিট জেন্টল বেবি গ্রুমিং ও হাইজিন কেয়ার কিট / Essential Baby Care Grooming Kit",
      slug: "essential-baby-grooming-kit",
      categorySlug: "baby-items",
      price: 850,
      salePrice: 650,
      stock: 42,
      sku: "SK-BB-102",
      isFeatured: true,
      images: [
        "/images/client-mockup/prod-baby-set.png",
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80",
      ],
      description: `
        <p>শিশুর নখ কাটা, চুল আঁচড়ানো, নাক ও মুখের পরিচ্ছন্নতার জন্য প্রয়োজনীয় ৮টি নিরাপদ টুলের একটি সম্পূর্ণ ট্রাভেল-ফ্রেন্ডলি কিট। শিশু সুরক্ষা সার্টিফাইড ও বিপিএ-মুক্ত।</p>
      `,
      specifications: {
        Components: "Safety Nail Clipper, Soft Wool Brush, Comb, Nasal Aspirator, Scissors, Emery Boards",
        Safety: "BPA-Free, Phthalate-Free, Rounded Safety Tips",
        Case: "Waterproof Zipper Storage Pouch",
      },
    },

    // =========================================================================
    // 5. CORPORATE GIFT ITEMS (কর্পোরেট গিফট সলিউশন)
    // =========================================================================
    {
      name: "এক্সিকিউটিভ রয়্যাল করপোরেট গিফট হ্যাম্পার সেট / Executive Royal Corporate Gift Hamper",
      slug: "executive-royal-corporate-gift-hamper",
      categorySlug: "corporate-gift-items",
      price: 2450,
      salePrice: 2150,
      stock: 30,
      sku: "SK-CG-101",
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80",
      ],
      description: `
        <p>প্রতিষ্ঠানিক মিটিং, অ্যানুয়াল কনফারেন্স কিংবা ক্লায়েন্ট অ্যাপ্রিসিয়েশনের জন্য আদর্শ লাক্সারি গিফট বক্স। এতে রয়েছে ভেগান লেদার ফিনিশ অর্গানাইজার ডায়েরি, মেটাল রোলারবল পেন, থার্মো-ইনসুলেটেড ফ্লাস্ক এবং প্রিমিয়াম কি-রিং।</p>
      `,
      specifications: {
        BoxContents: "Leather Diary + 500ml Flask + Metal Pen + Keyring in Gift Box",
        CustomBranding: "Available on orders of 20+ units (Logo Engraving)",
        BoxDimensions: "12 x 10 x 3.5 inches Premium Matte Box",
        LeadTime: "Same day dispatch for stock; 3-5 days for custom logos",
      },
    },
    {
      name: "স্মার্ট টেম্পারেচার ডিসপ্লে স্টেইনলেস স্টিল থার্মাল ফ্লাস্ক (৫০০ মিলি) / Smart Temperature Flask",
      slug: "smart-temperature-display-flask-500ml",
      categorySlug: "corporate-gift-items",
      price: 750,
      salePrice: 590,
      stock: 75,
      sku: "SK-CG-102",
      isFeatured: false,
      images: [
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=80",
      ],
      description: `
        <p>ঢাকনার উপর স্পর্শ করলেই ভেতরের তরলের তাপমাত্রা দেখানোর জন্য ডিজিটাল এলইডি স্ক্রিনযুক্ত ডাবল-ওয়াল ভ্যাকুয়াম ফ্লাস্ক। গরম পানি ১২ ঘণ্টা এবং ঠান্ডা পানি ২৪ ঘণ্টা ধরে রাখে।</p>
      `,
      specifications: {
        Material: "304 Food Grade Stainless Steel",
        Capacity: "500 ml",
        Insulation: "Double-Wall Vacuum Insulation (Hot 12h / Cold 24h)",
        Battery: "Built-in 500-day long life LED battery",
      },
    },

    // =========================================================================
    // 6. RUDIMENT GARMENTS (রপ্তানি মানের তৈরি পোশাক)
    // =========================================================================
    {
      name: "প্রিমিয়াম কম্বড কটন ক্লাসিক পোলো শার্ট / Premium Combed Cotton Classic Polo",
      slug: "premium-combed-cotton-classic-polo-shirt",
      categorySlug: "rudiment-garments",
      price: 850,
      salePrice: 690,
      stock: 60,
      sku: "SK-RG-101",
      isFeatured: true,
      images: [
        "/images/client-mockup/prod-tshirt.png",
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
      ],
      description: `
        <p>১০০% প্রিমিয়াম সুতি কম্বড পিক ফেব্রিকের আন্তর্জাতিক রপ্তানি মানের পোলো শার্ট। প্রি-শ্রাঙ্ক ও কালার-ফাস্ট ওয়াশ করা, ফলে ধোয়ার পর আকৃতি নষ্ট হয় না এবং দীর্ঘস্থায়ী থাকে।</p>
      `,
      specifications: {
        Fabric: "100% Compact Combed Cotton Pique (220 GSM)",
        Fit: "Regular Modern Fit",
        Sizes: "M, L, XL, XXL Available",
        Finish: "Enzyme and Bio-Washed for Ultra Softness",
        Origin: "Made in Narayanganj Knitwear Cluster",
      },
    },
    {
      name: "ট্রেডিশনাল পিওর সুতি হ্যান্ডলুম পাঞ্জাবি / Traditional Handloom Cotton Panjabi",
      slug: "traditional-handloom-cotton-panjabi",
      categorySlug: "rudiment-garments",
      price: 1850,
      salePrice: 1550,
      stock: 25,
      sku: "SK-RG-102",
      isFeatured: false,
      images: [
        "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=900&q=80",
      ],
      description: `
        <p>টাঙ্গাইলের ঐতিহ্যবাহী তাঁতে বোনা সুতি ফেব্রিক দিয়ে তৈরি মার্জিত নকশার পাঞ্জাবি। উৎসব, জুমার নামাজ কিংবা যেকোনো ঘরোয়া আয়োজনে দেয় পরম আরাম ও আভিজাত্য।</p>
      `,
      specifications: {
        Fabric: "Pure Tangail Handloom Cotton",
        Collar: "Band Collar with Wooden Button Placket",
        Pockets: "Two Deep Side Pockets",
        Origin: "Tangail Weavers Cluster",
      },
    },

    // =========================================================================
    // 7. INDUSTRIAL SOLUTIONS (শিল্প ও নিরাপত্তা সমাধান)
    // =========================================================================
    {
      name: "ইন্ডাস্ট্রিয়াল হেভি-ডিউটি সেফটি হেলমেট ও প্রোটেক্টিভ ভাইজর / Industrial Safety Helmet Kit",
      slug: "industrial-safety-helmet-protective-visor",
      categorySlug: "industrial-solutions",
      price: 950,
      salePrice: 790,
      stock: 45,
      sku: "SK-IS-101",
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80",
      ],
      description: `
        <p>কনস্ট্রাকশন সাইট, ওয়্যারহাউস ও কারখানার কর্মীদের সার্বিক নিরাপত্তার জন্য হাই-ইম্প্যাক্ট এবিএস পলিমারে তৈরি ইএন-৩৯৭ সার্টিফাইড ইন্ডাস্ট্রিয়াল সেফটি হেলমেট।</p>
      `,
      specifications: {
        Material: "High-Impact Shock Resistant ABS Polymer",
        Standard: "EN 397 & ANSI Z89.1 Industrial Standard",
        Suspension: "6-Point Ratchet Adjustable Suspension",
        Ventilation: "Side Airflow Ventilation Ports",
      },
    },
    {
      name: "কাট-রেজিস্ট্যান্ট ইন্ডাস্ট্রিয়াল ওয়ার্কিং গ্লাভস (৩ জোড়া) / Cut-Resistant Work Gloves Set",
      slug: "cut-resistant-industrial-work-gloves-set",
      categorySlug: "industrial-solutions",
      price: 650,
      stock: 80,
      sku: "SK-IS-102",
      isFeatured: false,
      images: [
        "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=900&q=80",
      ],
      description: `
        <p>গ্লাস, মেটাল ও ভারী মালামাল নাড়াচাড়ার জন্য লেভেল ৫ কাট-রেজিস্ট্যান্ট মাইক্রো-ফোম নাইট্রিল কোটিংযুক্ত নিরাপত্তা গ্লাভস।</p>
      `,
      specifications: {
        Protection: "EN 388 Level 5 Cut Resistance",
        Coating: "Non-slip Breathable Micro-Foam Nitrile Grip",
        PackQuantity: "3 Pairs (6 Gloves)",
      },
    },

    // =========================================================================
    // 8. HEALTH & BEAUTY (প্রাকৃতিক রূপচর্চা ও স্বাস্থ্য উপাদান)
    // =========================================================================
    {
      name: "খাঁটি সুন্দরবনের প্রাকৃতিক বুনো মধু (৫০০ গ্রাম) / Raw Sundarban Wild Honey (500g)",
      slug: "raw-sundarban-wild-honey-500g",
      categorySlug: "health-and-beauty",
      price: 850,
      salePrice: 720,
      stock: 50,
      sku: "SK-HB-101",
      isFeatured: true,
      images: [
        "/images/client-mockup/prod-honey.png",
        "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=900&q=80",
      ],
      description: `
        <p>সুন্দরবনের গভীর ম্যানগ্রোভ অরণ্য থেকে ঐতিহ্যবাহী মৌয়ালদের মাধ্যমে আহরিত শতভাগ খাঁটি ও অপরিশোধিত প্রাকৃতিক বুনো মধু। কোনো ধরনের হিট বা পাস্তুরায়ন ছাড়াই বোতলজাত করা হয়, ফলে মধুর প্রাকৃতিক এনজাইম ও ঔষধি গুণাগুণ অক্ষুণ্ণ থাকে।</p>
      `,
      specifications: {
        NetWeight: "500 grams Glass Jar",
        Source: "Wild Khalsi & Goran Mangrove Flowers, Sundarbans",
        Purity: "100% Raw, Unheated, Unfiltered",
        ShelfLife: "2 Years from harvest date",
      },
    },
    {
      name: "কোল্ড-প্রেসড এক্সট্রা ভার্জিন কালোজিরা তেল (২৫০ মিলি) / Cold-Pressed Virgin Black Seed Oil",
      slug: "cold-pressed-virgin-black-seed-oil-250ml",
      categorySlug: "health-and-beauty",
      price: 650,
      salePrice: 520,
      stock: 65,
      sku: "SK-HB-102",
      isFeatured: true,
      images: [
        "/images/client-mockup/prod-cosmetic-set.png",
        "https://images.unsplash.com/photo-1608248597359-57778b87c716?auto=format&fit=crop&w=900&q=80",
      ],
      description: `
        <p>যশোরের নির্বাচিত সেরা জাতের কালোজিরা থেকে কাঠের ঘানিতে ঠাণ্ডা চাপে ভাঙানো প্রথম চাপের শতভাগ খাঁটি কালোজিরা তেল। রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি এবং ত্বকের সুরক্ষায় অত্যন্ত কার্যকর।</p>
      `,
      specifications: {
        Volume: "250 ml Dark UV-Protected Amber Glass Bottle",
        Method: "First-Press Cold Extraction (কাঠের ঘানি)",
        ActiveCompound: "Rich in Thymoquinone & Essential Fatty Acids",
      },
    },

    // =========================================================================
    // 9. AGRICULTURE (কৃষি উপকরণ ও ছাদবাগান সলিউশন)
    // =========================================================================
    {
      name: "উচ্চফলনশীল হাইব্রিড সবজি বীজ ও ছাদবাগান কিট (১০ জাত) / High-Yield Garden Seeds Kit",
      slug: "high-yield-hybrid-vegetable-seeds-kit",
      categorySlug: "agriculture",
      price: 450,
      salePrice: 380,
      stock: 75,
      sku: "SK-AG-101",
      isFeatured: true,
      images: [
        "/images/client-mockup/prod-fertilizer.png",
        "https://images.unsplash.com/photo-1592417817098-8f3d6ef23963?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80",
      ],
      description: `
        <p>বাংলাদেশের মাটি ও আবহাওয়ার জন্য উপযোগী ১০ ধরনের পুষ্টিকর সবজি বীজের কমপ্লিট কিট: টমেটো, শসা, লালশাক, পালংশাক, বেগুন, মরিচ, শিম, লাউ, ঢ্যাঁড়শ ও মিষ্টি কুমড়া। ৯০%+ অঙ্কুরোদগম হার পরীক্ষিত।</p>
      `,
      specifications: {
        Varieties: "10 Packets Moisture-Proof Sealed Foil",
        GerminationRate: "90%+ Tested Viability",
        BestSeason: "All Season & Winter Planting",
        SuitableFor: "Rooftop Garden, Balcony Pots & Soil Plots",
      },
    },
    {
      name: "প্রিমিয়াম অর্গানিক ভার্মিকম্পোস্ট কেঁচো সার (৫ কেজি) / Premium Organic Vermicompost (5kg)",
      slug: "premium-organic-vermicompost-fertilizer-5kg",
      categorySlug: "agriculture",
      price: 350,
      salePrice: 280,
      stock: 90,
      sku: "SK-AG-102",
      isFeatured: false,
      images: [
        "/images/client-mockup/prod-fertilizer.png",
        "https://images.unsplash.com/photo-1585336261026-41865c5590b8?auto=format&fit=crop&w=900&q=80",
      ],
      description: `
        <p>গাছের পাতা ও মাটির উর্বরতা বাড়াতে সম্পূর্ণ গন্ধহীন ও পুষ্টিসমৃদ্ধ শতভাগ জৈব কেঁচো সার। মাটির পানি ধারণ ক্ষমতা বৃদ্ধি করে এবং গাছের দ্রুত বৃদ্ধি ত্বরান্বিত করে।</p>
      `,
      specifications: {
        Weight: "5 Kilograms Packed Bag",
        Composition: "100% Pure Earthworm Castings enriched with Nitrogen & Phosphorus",
        Certification: "Organic Fertilizer Bangladesh Standard",
      },
    },

    // =========================================================================
    // 10. SPECIAL E-SHEBA & SERVICES (বিশেষ কর্পোরেট ও কাস্টম সেবা)
    // =========================================================================
    {
      name: "ইনস্টিটিউশনাল কাস্টম ব্র্যান্ডিং ও বাল্ক প্রকিউরমেন্ট সেবা / Corporate Bulk Procurement Service",
      slug: "corporate-custom-branding-bulk-procurement",
      categorySlug: "e-sheba",
      price: 0,
      stock: 999,
      sku: "SK-ES-101",
      isFeatured: true,
      images: [
        "/images/corporate-gifting-feature.png",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
      ],
      description: `
        <p>ব্যাংক, বহুজাতিক প্রতিষ্ঠান ও করপোরেট সংস্থার উপহার, পাটের প্যাকেজিং এবং বার্ষিক কনফারেন্সের জন্য কাস্টমাইজড সামগ্রী সংগ্রহের প্রাতিষ্ঠানিক সেবা। আমাদের বিশেষ টিম আপনার প্রয়োজনীয় বাজেট ও সময় অনুযায়ী সরাসরি ডেলিভারি নিশ্চিত করে।</p>
      `,
      specifications: {
        ServiceType: "Institutional Bulk Ordering & Customization",
        MinimumOrder: "50+ Units for Custom Branding",
        TurnaroundTime: "5-10 Business Days",
        Consultation: "Free Dedicated Account Manager Support",
      },
    },
  ];

  // 4. Insert each product with its multiple gallery images
  console.log(`📦 Inserting ${products.length} rich products with multi-image galleries...`);

  for (const p of products) {
    const categoryId = categoryMap.get(p.categorySlug);
    if (!categoryId) {
      console.warn(`⚠️ Warning: Category slug "${p.categorySlug}" not found in database. Skipping ${p.name}`);
      continue;
    }

    const createdProduct = await prisma.product.create({
      data: {
        categoryId,
        name: p.name,
        slug: p.slug,
        description: p.description.trim(),
        price: p.price,
        salePrice: p.salePrice || null,
        stock: p.stock,
        sku: p.sku,
        isFeatured: p.isFeatured,
        isActive: true,
        specifications: p.specifications,
        images: {
          create: p.images.map((imgUrl, idx) => ({
            url: imgUrl,
            isPrimary: idx === 0,
            displayOrder: idx,
            altText: `${p.name} - View ${idx + 1}`,
          })),
        },
      },
    });

    console.log(`  ✓ Created [${p.categorySlug}] ${p.name} (${p.images.length} images)`);
  }

  console.log("==================================================================");
  console.log(`🎉 SUCCESS! Re-seeded ${products.length} products with complete dashboard structure.`);
  console.log("==================================================================");
}

seedProductsRealistic()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
