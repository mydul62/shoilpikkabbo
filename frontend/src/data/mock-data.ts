export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  itemCount: number;
  imageUrl: string;
  isService?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  price: number;
  salePrice?: number;
  stock: number;
  sku: string;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  imageUrl: string;
  galleryUrls: string[];
  description: string;
  specifications: Record<string, string>;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  totalAmount: number;
  deliveryCharge: number;
  discountAmount: number;
  finalAmount: number;
  orderStatus: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "PARTIALLY_PAID" | "REFUNDED";
  paymentMethod: "BKASH" | "NAGAD" | "BANK_TRANSFER" | "CASH_ON_DELIVERY";
  transactionId?: string;
  createdAt: string;
  items: OrderItem[];
}

export interface PaymentVerification {
  id: string;
  orderNumber: string;
  customerName: string;
  senderPhone: string;
  method: "bKash" | "Nagad" | "BRAC Bank";
  transactionId: string;
  amount: number;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  submittedAt: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  discountAmount?: number;
  minOrderValue: number;
  description: string;
  expiresAt: string;
}

export interface ServiceInquiry {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  organization?: string;
  serviceType: string;
  requirements: string;
  status: "NEW" | "IN_REVIEW" | "CONTACTED" | "RESOLVED";
  submittedAt: string;
}

export interface CareerVacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Contract" | "Part-time";
  experience: string;
  deadline: string;
  description: string;
  requirements: string[];
}

// Live Categories Collection matching Client Design
export const MOCK_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Handicrafts",
    slug: "handicraft",
    description: "Authentic pottery, Nakshi Kantha, and traditional heritage artisan crafts.",
    itemCount: 48,
    imageUrl: "/images/client-mockup/cat-handicrafts.png",
  },
  {
    id: "cat-2",
    name: "Jute Items",
    slug: "jute-items",
    description: "Eco-friendly golden fiber shopping bags, baskets, rugs, and living decor.",
    itemCount: 64,
    imageUrl: "/images/client-mockup/cat-jute.png",
  },
  {
    id: "cat-3",
    name: "Polymer",
    slug: "polymer",
    description: "High quality polymer storage jars, household containers, and utility wares.",
    itemCount: 32,
    imageUrl: "/images/client-mockup/cat-polymer.png",
  },
  {
    id: "cat-4",
    name: "Baby Items",
    slug: "baby-items",
    description: "Gentle baby care essentials, soft handcrafted plush toys, and nursery gifts.",
    itemCount: 29,
    imageUrl: "/images/client-mockup/cat-baby.png",
  },
  {
    id: "cat-5",
    name: "Corporate Gift Items",
    slug: "corporate-gift-items",
    description: "Premium curated gift boxes, executive bespoke packaging, and corporate hampers.",
    itemCount: 25,
    imageUrl: "/images/client-mockup/cat-corporate.png",
  },
  {
    id: "cat-6",
    name: "Rudiment Garments",
    slug: "rudiment-garments",
    description: "Comfort cotton t-shirts, polo shirts, and everyday casual wear.",
    itemCount: 54,
    imageUrl: "/images/client-mockup/cat-garments.png",
  },
  {
    id: "cat-7",
    name: "Industrial Solutions",
    slug: "industrial-solutions",
    description: "Machinery spares, industrial fittings, and enterprise equipment supplies.",
    itemCount: 18,
    imageUrl: "/images/client-mockup/cat-industrial.png",
  },
  {
    id: "cat-8",
    name: "Health & Beauty",
    slug: "health-and-beauty",
    description: "Natural organic skincare, cosmetics, and wellness formulations.",
    itemCount: 37,
    imageUrl: "/images/client-mockup/cat-beauty.png",
  },
  {
    id: "cat-9",
    name: "Agriculture",
    slug: "agriculture",
    description: "Organic fertilizers, bio-nutrients, farming inputs, and garden tools.",
    itemCount: 22,
    imageUrl: "/images/client-mockup/cat-agriculture.png",
  },
  {
    id: "cat-10",
    name: "Special E-Sheba / Services",
    slug: "special-services",
    description: "Custom bulk orders, corporate gifting consultations, and personalized client support.",
    itemCount: 15,
    imageUrl: "/images/client-mockup/cat-services.png",
    isService: true,
  },
];

// Rich Product Catalog (30 Verified 1:1 Square Products Across 10 Categories)
export const MOCK_PRODUCTS: Product[] = [
  // 1. HANDICRAFTS
  {
    id: "prod-hc-1",
    name: "Handcrafted Terracotta Ceramic Tea Set",
    slug: "handcrafted-terracotta-ceramic-tea-set",
    categoryId: "cat-1",
    categoryName: "Handicrafts",
    price: 1850,
    salePrice: 1550,
    stock: 35,
    sku: "SK-HC-001",
    rating: 4.9,
    reviewCount: 38,
    isFeatured: true,
    imageUrl: "/images/products/handicraft-terracotta-tea-set.jpg",
    galleryUrls: ["/images/products/handicraft-terracotta-tea-set.jpg"],
    description: "Exquisite handmade clay terracotta tea set shaped and fired by traditional master potters. Features one covered teapot and four matching clay cups with a natural semi-matte rustic finish.",
    specifications: {
      Material: "100% Pure Natural Fired Terracotta Clay",
      Origin: "Dhamrai, Dhaka, Bangladesh",
      Pieces: "1 Teapot (750ml) + 4 Tea Cups (150ml)",
      Finish: "Hand-Smoothed Semi-Matte Terracotta",
    },
  },
  {
    id: "prod-hc-2",
    name: "Traditional Hand-Embroidered Nakshi Kantha Quilt",
    slug: "traditional-hand-embroidered-nakshi-kantha-quilt",
    categoryId: "cat-1",
    categoryName: "Handicrafts",
    price: 4500,
    salePrice: 3890,
    stock: 18,
    sku: "SK-HC-002",
    rating: 5.0,
    reviewCount: 29,
    isFeatured: true,
    imageUrl: "/images/products/handicraft-nakshi-kantha-quilt.jpg",
    galleryUrls: ["/images/products/handicraft-nakshi-kantha-quilt.jpg"],
    description: "Authentic heritage heirloom Nakshi Kantha meticulously hand-stitched by skilled rural women artisans. Features vibrant traditional floral, vine, and folklore motifs on pure hand-spun cotton.",
    specifications: {
      Dimensions: "90 x 100 inches (King Size)",
      Fabric: "100% Pure Hand-Spun Cotton",
      Origin: "Jessore, Bangladesh",
      Craft: "Authentic Running Stitch Hand Embroidery",
    },
  },
  {
    id: "prod-hc-3",
    name: "Solid Brass Handcrafted Peacock Incense Burner",
    slug: "solid-brass-handcrafted-peacock-incense-burner",
    categoryId: "cat-1",
    categoryName: "Handicrafts",
    price: 1450,
    salePrice: 1250,
    stock: 40,
    sku: "SK-HC-003",
    rating: 4.8,
    reviewCount: 16,
    imageUrl: "/images/products/handicraft-brass-peacock-burner.jpg",
    galleryUrls: ["/images/products/handicraft-brass-peacock-burner.jpg"],
    description: "Lost-wax hand-cast bell brass incense burner featuring an ornate peacock finial emblem and filigree smoke perforations. Hand-polished to an antique golden shine.",
    specifications: {
      Material: "Solid Bell Brass Metal",
      Weight: "480g",
      Origin: "Dhamrai Brass Craft Heritage",
      Finish: "Antique Brushed Brass",
    },
  },

  // 2. JUTE ITEMS
  {
    id: "prod-jt-1",
    name: "Eco-Friendly Golden Jute Shopping Tote Bag",
    slug: "eco-friendly-golden-jute-shopping-tote-bag",
    categoryId: "cat-2",
    categoryName: "Jute Items",
    price: 650,
    salePrice: 520,
    stock: 65,
    sku: "SK-JT-001",
    rating: 4.7,
    reviewCount: 52,
    isFeatured: true,
    imageUrl: "/images/products/jute-shopping-tote-bag.jpg",
    galleryUrls: ["/images/products/jute-shopping-tote-bag.jpg"],
    description: "Durable eco-friendly shopping tote crafted from 100% natural export-grade golden jute fiber. Equipped with padded cotton webbing shoulder handles and interior water-resistant barrier.",
    specifications: {
      Material: "100% Export-Grade Golden Jute",
      Capacity: "15 kg Weight Capacity",
      Handles: "Soft Padded Cotton Webbing",
      Dimensions: "16 x 14 x 6 inches",
    },
  },
  {
    id: "prod-jt-2",
    name: "Handwoven Golden Jute Round Storage Basket",
    slug: "handwoven-golden-jute-round-storage-basket",
    categoryId: "cat-2",
    categoryName: "Jute Items",
    price: 950,
    salePrice: 820,
    stock: 45,
    sku: "SK-JT-002",
    rating: 4.8,
    reviewCount: 34,
    imageUrl: "/images/products/jute-storage-basket-round.jpg",
    galleryUrls: ["/images/products/jute-storage-basket-round.jpg"],
    description: "Versatile cylindrical storage organizer handwoven from twisted golden jute coils with sturdy integrated carry handles. Ideal for living room throws, laundry, and nursery organization.",
    specifications: {
      Diameter: "14 inches",
      Height: "12 inches",
      Material: "Braided Natural Jute & Cotton Cord",
      Structure: "Free-standing Structured Coil",
    },
  },
  {
    id: "prod-jt-3",
    name: "Hand-Braided Spiral Jute Table Coasters (Set of 6)",
    slug: "hand-braided-spiral-jute-table-coasters-set-6",
    categoryId: "cat-2",
    categoryName: "Jute Items",
    price: 490,
    salePrice: 390,
    stock: 70,
    sku: "SK-JT-003",
    rating: 4.6,
    reviewCount: 22,
    imageUrl: "/images/products/jute-braided-coasters-set.jpg",
    galleryUrls: ["/images/products/jute-braided-coasters-set.jpg"],
    description: "Set of 6 natural golden jute circular table coasters. Heat resistant, eco-friendly, and hand-braided with reinforced edge stitching to protect dining surfaces.",
    specifications: {
      Pieces: "6 Circular Coasters",
      Diameter: "5 inches each",
      Material: "100% Natural Biodegradable Jute",
      HeatResistance: "Up to 120°C",
    },
  },

  // 3. POLYMER
  {
    id: "prod-pl-1",
    name: "Airtight Clear Polymer Kitchen Canister Set of 4",
    slug: "airtight-clear-polymer-kitchen-canister-set-4",
    categoryId: "cat-3",
    categoryName: "Polymer",
    price: 1150,
    salePrice: 950,
    stock: 50,
    sku: "SK-PL-001",
    rating: 4.8,
    reviewCount: 41,
    isFeatured: true,
    imageUrl: "/images/products/polymer-airtight-food-canisters.jpg",
    galleryUrls: ["/images/products/polymer-airtight-food-canisters.jpg"],
    description: "Set of 4 stackable crystal-clear food-grade polymer pantry storage canisters. Airtight silicone clamp lids lock in freshness for spices, rice, pulses, and dry foods.",
    specifications: {
      Pieces: "4 Canisters (500ml, 1L, 1.5L, 2L)",
      Material: "BPA-Free Food-Grade Polymer (PETG)",
      Seal: "Hermetic Silicone Ring Clamp Lock",
      Care: "Dishwasher Safe Top Rack",
    },
  },
  {
    id: "prod-pl-2",
    name: "Heavy-Duty Stackable Polymer Utility Storage Crate",
    slug: "heavy-duty-stackable-polymer-utility-storage-crate",
    categoryId: "cat-3",
    categoryName: "Polymer",
    price: 850,
    salePrice: 720,
    stock: 60,
    sku: "SK-PL-002",
    rating: 4.7,
    reviewCount: 19,
    imageUrl: "/images/products/polymer-industrial-storage-crate.jpg",
    galleryUrls: ["/images/products/polymer-industrial-storage-crate.jpg"],
    description: "Industrial strength virgin polymer utility crate designed for heavy household storage, grocery transport, and workshop organization. Perforated walls for ventilation.",
    specifications: {
      Volume: "45 Liters",
      LoadCapacity: "35 kg Max Load",
      Material: "High-Density Virgin Polypropylene",
      Dimensions: "520 x 360 x 280 mm",
    },
  },
  {
    id: "prod-pl-3",
    name: "BPA-Free Reusable Polymer Sports Water Bottle (750ml)",
    slug: "bpa-free-reusable-polymer-sports-water-bottle-750ml",
    categoryId: "cat-3",
    categoryName: "Polymer",
    price: 490,
    salePrice: 390,
    stock: 80,
    sku: "SK-PL-003",
    rating: 4.9,
    reviewCount: 65,
    imageUrl: "/images/products/polymer-sports-water-bottle.jpg",
    galleryUrls: ["/images/products/polymer-sports-water-bottle.jpg"],
    description: "Sleek translucent matte polymer water bottle with one-click flip lid, secure locking latch, and silicone straw. Lightweight, shatterproof, and 100% leakproof.",
    specifications: {
      Capacity: "750 ml",
      Material: "100% Eastman Tritan BPA-Free Polymer",
      Temperature: "-10°C to 90°C Safe",
      Features: "Time & Volume Capacity Markers",
    },
  },

  // 4. BABY ITEMS
  {
    id: "prod-bb-1",
    name: "Organic Muslin Cotton Baby Swaddle Blanket Wrap",
    slug: "organic-muslin-cotton-baby-swaddle-blanket-wrap",
    categoryId: "cat-4",
    categoryName: "Baby Items",
    price: 780,
    salePrice: 650,
    stock: 55,
    sku: "SK-BB-001",
    rating: 4.9,
    reviewCount: 46,
    isFeatured: true,
    imageUrl: "/images/products/baby-muslin-cotton-swaddle.jpg",
    galleryUrls: ["/images/products/baby-muslin-cotton-swaddle.jpg"],
    description: "Ultra-soft pre-washed organic muslin cotton swaddle blanket. Open-weave breathable double gauze prevents overheating while wrapping infants in gentle comforting softness.",
    specifications: {
      Dimensions: "47 x 47 inches (120 x 120 cm)",
      Fabric: "100% GOTS Certified Organic Muslin Cotton",
      Weave: "Breathable Double-Layer Gauze",
      Care: "Machine Washable, Gets Softer Each Wash",
    },
  },
  {
    id: "prod-bb-2",
    name: "Complete Infant Care Feeding and Grooming Essential Set",
    slug: "infant-care-feeding-grooming-essential-set",
    categoryId: "cat-4",
    categoryName: "Baby Items",
    price: 950,
    salePrice: 790,
    stock: 45,
    sku: "SK-BB-002",
    rating: 4.8,
    reviewCount: 31,
    imageUrl: "/images/products/baby-gentle-care-grooming-set.jpg",
    galleryUrls: ["/images/products/baby-gentle-care-grooming-set.jpg"],
    description: "Pediatrician-approved infant grooming and feeding care set. Includes anti-colic feeding bottles, gentle round-tip nail clipper, soft bristle brush, comb, and nasal aspirator.",
    specifications: {
      Safety: "100% BPA Free & Phthalate Free",
      AgeSuitability: "0-24 Months",
      Sterilization: "Boiling Water & Steam Sterilizer Safe",
    },
  },
  {
    id: "prod-bb-3",
    name: "Soft Organic Cotton Plush Sensory Teddy Bear",
    slug: "soft-organic-cotton-plush-sensory-teddy-bear",
    categoryId: "cat-4",
    categoryName: "Baby Items",
    price: 650,
    salePrice: 520,
    stock: 65,
    sku: "SK-BB-003",
    rating: 4.9,
    reviewCount: 28,
    imageUrl: "/images/products/baby-plush-sensory-teddy.jpg",
    galleryUrls: ["/images/products/baby-plush-sensory-teddy.jpg"],
    description: "Huggable baby plush teddy bear made with hypoallergenic organic cotton velour and embroidered facial features with no loose plastic buttons. Gentle companion for newborns.",
    specifications: {
      Height: "10 inches (25 cm)",
      OuterFabric: "100% Organic Cotton Velour",
      Filling: "Hypoallergenic Recycled Cotton Polyfill",
      Safety: "Embroidered Eyes, 100% Baby-Safe",
    },
  },

  // 5. CORPORATE GIFT ITEMS
  {
    id: "prod-cg-1",
    name: "Executive Leatherette Planner Diary with Premium Pen Set",
    slug: "executive-leatherette-planner-diary-premium-pen-set",
    categoryId: "cat-5",
    categoryName: "Corporate Gift Items",
    price: 1550,
    salePrice: 1290,
    stock: 50,
    sku: "SK-CG-001",
    rating: 4.9,
    reviewCount: 44,
    isFeatured: true,
    imageUrl: "/images/products/corporate-leatherette-diary-pen.jpg",
    galleryUrls: ["/images/products/corporate-leatherette-diary-pen.jpg"],
    description: "Prestigious corporate executive notebook diary featuring a thermal PU leatherette cover with magnetic closure strap, pen loop, card slots, and an executive metal ballpoint pen in a gift box.",
    specifications: {
      Paper: "192 Ruled Pages (80 GSM Acid-Free Ivory Paper)",
      Cover: "Premium Thermal Texture PU Leatherette",
      Pen: "Weighted Metal Rollerball Pen (0.7mm Black)",
      Box: "Hardboard Matte Finish Presentation Box",
    },
  },
  {
    id: "prod-cg-2",
    name: "Double-Wall Insulated Stainless Steel Thermal Flask (500ml)",
    slug: "double-wall-insulated-stainless-steel-thermal-flask-500ml",
    categoryId: "cat-5",
    categoryName: "Corporate Gift Items",
    price: 1150,
    salePrice: 950,
    stock: 55,
    sku: "SK-CG-002",
    rating: 4.8,
    reviewCount: 39,
    imageUrl: "/images/products/corporate-insulated-thermal-flask.jpg",
    galleryUrls: ["/images/products/corporate-insulated-thermal-flask.jpg"],
    description: "Matte black double-wall vacuum insulated thermal flask. Keeps hot beverages steaming for 12 hours and iced drinks cold for 24 hours. Sweat-proof powder coated exterior.",
    specifications: {
      Capacity: "500 ml",
      Interior: "Food-Grade SUS 304 Stainless Steel",
      Insulation: "Double-Wall Vacuum Core",
      Lid: "100% Leakproof BPA-Free Screw Cap",
    },
  },
  {
    id: "prod-cg-3",
    name: "Solid Wood Executive Desktop Organizer with Phone Dock",
    slug: "solid-wood-executive-desktop-organizer-phone-dock",
    categoryId: "cat-5",
    categoryName: "Corporate Gift Items",
    price: 2450,
    salePrice: 2090,
    stock: 30,
    sku: "SK-CG-003",
    rating: 4.9,
    reviewCount: 25,
    imageUrl: "/images/products/corporate-wooden-desk-dock.jpg",
    galleryUrls: ["/images/products/corporate-wooden-desk-dock.jpg"],
    description: "Meticulously crafted from solid natural walnut wood. Features dedicated docking channels for smartphone, pens, watch, keys, and visiting cards. Elevates any executive office desk.",
    specifications: {
      Material: "100% Natural Solid Walnut Wood",
      Dimensions: "280 x 180 x 25 mm",
      Finish: "Hand-Rubbed Organic Natural Wax",
      Features: "Cable Pass-Through Charging Channel",
    },
  },

  // 6. RUDIMENT GARMENTS
  {
    id: "prod-rg-1",
    name: "Export Quality 100% Combed Cotton Crewneck Casual T-Shirt",
    slug: "export-quality-100-combed-cotton-crewneck-tshirt",
    categoryId: "cat-6",
    categoryName: "Rudiment Garments",
    price: 650,
    salePrice: 520,
    stock: 90,
    sku: "SK-RG-001",
    rating: 4.8,
    reviewCount: 77,
    imageUrl: "/images/products/garments-combed-cotton-tshirt.jpg",
    galleryUrls: ["/images/products/garments-combed-cotton-tshirt.jpg"],
    description: "Premium 180 GSM combed cotton jersey crewneck t-shirt. Bio-washed with silicone softener for an ultra-smooth hand-feel, zero shrinkage, and lasting color fastness.",
    specifications: {
      GSM: "180 GSM Bio-Washed Single Jersey",
      Fabric: "100% Combed Ring-Spun Cotton",
      Fit: "Modern Regular Contemporary Fit",
      Collar: "1x1 Ribbed Lycra Collar",
    },
  },
  {
    id: "prod-rg-2",
    name: "Classic Honeycomb Pique Knit Cotton Polo Shirt",
    slug: "classic-honeycomb-pique-knit-cotton-polo-shirt",
    categoryId: "cat-6",
    categoryName: "Rudiment Garments",
    price: 980,
    salePrice: 820,
    stock: 75,
    sku: "SK-RG-002",
    rating: 4.7,
    reviewCount: 42,
    imageUrl: "/images/products/garments-pique-cotton-polo.jpg",
    galleryUrls: ["/images/products/garments-pique-cotton-polo.jpg"],
    description: "Breathable 220 GSM honeycomb pique cotton polo shirt featuring a structured ribbed knit collar, 2-button reinforced placket, and mother-of-pearl buttons.",
    specifications: {
      GSM: "220 GSM Breathable Honeycomb Pique",
      Fabric: "100% Combed Long-Staple Cotton",
      ColorFastness: "Grade 4+ Reactive Dyed",
      Care: "Machine Wash Cold, Hang Dry",
    },
  },
  {
    id: "prod-rg-3",
    name: "Pure Cotton Casual Everyday Button-Down Shirt",
    slug: "pure-cotton-casual-everyday-button-down-shirt",
    categoryId: "cat-6",
    categoryName: "Rudiment Garments",
    price: 1450,
    salePrice: 1250,
    stock: 45,
    sku: "SK-RG-003",
    rating: 4.8,
    reviewCount: 26,
    imageUrl: "/images/products/garments-casual-cotton-shirt.jpg",
    galleryUrls: ["/images/products/garments-casual-cotton-shirt.jpg"],
    description: "Lightweight, breathable pure cotton casual shirt with chest pocket and curved hemline. Tailored for comfort in warm tropical climates.",
    specifications: {
      Fabric: "100% Pre-Shrunk Breathable Cotton",
      Sleeves: "Full Sleeve with Buttoned Cuffs",
      Fit: "Smart Casual Fit",
    },
  },

  // 7. INDUSTRIAL SOLUTIONS
  {
    id: "prod-is-1",
    name: "ANSI Certified High-Impact Industrial Safety Hard Hat Helmet",
    slug: "ansi-certified-high-impact-industrial-safety-helmet",
    categoryId: "cat-7",
    categoryName: "Industrial Solutions",
    price: 850,
    salePrice: 720,
    stock: 70,
    sku: "SK-IS-001",
    rating: 4.9,
    reviewCount: 33,
    imageUrl: "/images/products/industrial-safety-hard-hat.jpg",
    galleryUrls: ["/images/products/industrial-safety-hard-hat.jpg"],
    description: "Heavy-duty industrial safety helmet manufactured from high-impact ABS resin. Features 6-point ratchet suspension for size adjustment, sweatband, and adjustable chin strap.",
    specifications: {
      Certification: "ANSI Z89.1 Type 1 Class E & CE EN 397",
      Material: "Virgin High-Impact ABS Polymer",
      Suspension: "6-Point Quick-Ratchet Headband",
      Ventilation: "Top Air Circulation Convection Ports",
    },
  },
  {
    id: "prod-is-2",
    name: "Heavy-Duty Textured Protective Work Safety Gloves",
    slug: "heavy-duty-textured-protective-work-safety-gloves",
    categoryId: "cat-7",
    categoryName: "Industrial Solutions",
    price: 390,
    salePrice: 290,
    stock: 120,
    sku: "SK-IS-002",
    rating: 4.8,
    reviewCount: 51,
    imageUrl: "/images/products/industrial-nitrile-work-gloves.jpg",
    galleryUrls: ["/images/products/industrial-nitrile-work-gloves.jpg"],
    description: "Abrasion-resistant industrial work gloves with reinforced textured palms for heavy handling and superior heat/cut resistance in workshop and factory environments.",
    specifications: {
      Material: "Heavy-Duty Split Cowhide & Reinforced Palm",
      Cuff: "Safety Gauntlet Cuff for Wrist Protection",
      Standard: "EN 388 Mechanical Risk Certified",
      Usage: "Welding, Fabrication, Warehouse, Handling",
    },
  },
  {
    id: "prod-is-3",
    name: "Anti-Fog Clear Polycarbonate Eye Protection Safety Goggles",
    slug: "anti-fog-clear-polycarbonate-eye-protection-safety-goggles",
    categoryId: "cat-7",
    categoryName: "Industrial Solutions",
    price: 450,
    salePrice: 350,
    stock: 85,
    sku: "SK-IS-003",
    rating: 4.9,
    reviewCount: 40,
    imageUrl: "/images/products/industrial-safety-goggles.jpg",
    galleryUrls: ["/images/products/industrial-safety-goggles.jpg"],
    description: "Wrap-around clear safety goggles engineered with dual-coated anti-fog and anti-scratch polycarbonate lenses. Soft vinyl seal conforms comfortably to facial contours.",
    specifications: {
      Standard: "ANSI Z87.1+ High-Impact & CE EN 166",
      Lens: "UV400 Optical Grade Clear Polycarbonate",
      Strap: "Adjustable Elastic Neoprene Headband",
      Ventilation: "Indirect Splash-Proof Air Baffle Vents",
    },
  },

  // 8. HEALTH AND BEAUTY
  {
    id: "prod-hb-1",
    name: "Cold-Pressed Virgin Black Seed Kalijira Oil (250ml)",
    slug: "cold-pressed-virgin-black-seed-kalijira-oil-250ml",
    categoryId: "cat-8",
    categoryName: "Health & Beauty",
    price: 680,
    salePrice: 560,
    stock: 65,
    sku: "SK-HB-001",
    rating: 5.0,
    reviewCount: 68,
    isFeatured: true,
    imageUrl: "/images/products/health-virgin-black-seed-oil.jpg",
    galleryUrls: ["/images/products/health-virgin-black-seed-oil.jpg"],
    description: "100% pure virgin cold-pressed Nigella Sativa black seed oil extracted from organically cultivated Kalijira seeds. Rich in Thymoquinone antioxidants and essential fatty acids.",
    specifications: {
      Volume: "250 ml Dark Amber UV Glass Bottle",
      Extraction: "First-Press Cold Pressed (No Solvents)",
      Purity: "100% Raw Unfiltered Nigella Sativa",
      Usage: "Dietary Supplement & Hair/Skincare",
    },
  },
  {
    id: "prod-hb-2",
    name: "Pure Raw Organic Sundarban Forest Honey Glass Jar (500g)",
    slug: "pure-raw-organic-sundarban-forest-honey-500g",
    categoryId: "cat-8",
    categoryName: "Health & Beauty",
    price: 980,
    salePrice: 850,
    stock: 50,
    sku: "SK-HB-002",
    rating: 4.9,
    reviewCount: 55,
    imageUrl: "/images/products/health-organic-sundarban-honey.jpg",
    galleryUrls: ["/images/products/health-organic-sundarban-honey.jpg"],
    description: "Authentic raw mangrove wildflower honey sustainably harvested by traditional honey hunters (Mawals) from the deep mangrove forests of Sundarbans. Packed with active pollen.",
    specifications: {
      NetWeight: "500 Grams Glass Hexagonal Jar",
      FloraSource: "Sundarbans Wild Mangrove Forest",
      Processing: "Unheated, Unpasteurized Raw Honey",
      Certification: "100% Pure Natural Lab Tested",
    },
  },
  {
    id: "prod-hb-3",
    name: "Artisanal Organic Neem and Aloe Vera Herbal Bath Soap Bar",
    slug: "artisanal-organic-neem-aloe-vera-herbal-soap-bar",
    categoryId: "cat-8",
    categoryName: "Health & Beauty",
    price: 240,
    salePrice: 190,
    stock: 95,
    sku: "SK-HB-003",
    rating: 4.7,
    reviewCount: 39,
    imageUrl: "/images/products/health-herbal-neem-soap.jpg",
    galleryUrls: ["/images/products/health-herbal-neem-soap.jpg"],
    description: "Cold-process handmade vegetable glycerine bar soap infused with cold-pressed antibacterial neem oil, soothing organic aloe vera gel, and pure tea tree essential oil.",
    specifications: {
      Weight: "125 Grams Bar",
      Base: "Cold-Pressed Coconut & Olive Oil",
      FreeFrom: "No SLS, No Parabens, No Animal Fat",
      SkinType: "Acne-Prone & Sensitive Skin",
    },
  },

  // 9. AGRICULTURE
  {
    id: "prod-ag-1",
    name: "Premium Organic Vermicompost Earthworm Manure Fertilizer 5kg",
    slug: "premium-organic-vermicompost-fertilizer-5kg",
    categoryId: "cat-9",
    categoryName: "Agriculture",
    price: 380,
    salePrice: 290,
    stock: 90,
    sku: "SK-AG-001",
    rating: 4.8,
    reviewCount: 62,
    imageUrl: "/images/products/agri-organic-vermicompost-5kg.jpg",
    galleryUrls: ["/images/products/agri-organic-vermicompost-5kg.jpg"],
    description: "Nutrient-dense organic earthworm vermicompost manure. Enriches topsoil with beneficial soil microflora, bio-available nitrogen, phosphorus, potassium, and humic acid.",
    specifications: {
      Weight: "5 kg Heavy Retail Poly Pack",
      OrganicMatter: "> 30% Active Carbon",
      Moisture: "< 18% Controlled Moisture",
      Application: "Rooftop Garden, Flowering & Fruit Plants",
    },
  },
  {
    id: "prod-ag-2",
    name: "High-Germination Hybrid Kitchen Garden Vegetable Seedlings",
    slug: "high-germination-hybrid-vegetable-seed-collection",
    categoryId: "cat-9",
    categoryName: "Agriculture",
    price: 480,
    salePrice: 380,
    stock: 75,
    sku: "SK-AG-002",
    rating: 4.9,
    reviewCount: 47,
    imageUrl: "/images/products/agri-hybrid-vegetable-seeds.jpg",
    galleryUrls: ["/images/products/agri-hybrid-vegetable-seeds.jpg"],
    description: "Comprehensive home gardening seed kit containing 6 high-yield vegetable varieties: hybrid tomato, green chilli, spinach, red amaranth, coriander, and brinjal in moisture-locked packs.",
    specifications: {
      Varieties: "6 Foil-Sealed Air-Tight Packets",
      GerminationRate: "90% Minimum Guaranteed",
      Purity: "98% Clean Genetic Purity",
      Seasonality: "All-Season Homestead Cultivation",
    },
  },
  {
    id: "prod-ag-3",
    name: "Balanced Organic Liquid Plant Growth Booster Spray (500ml)",
    slug: "balanced-organic-liquid-plant-growth-booster-500ml",
    categoryId: "cat-9",
    categoryName: "Agriculture",
    price: 450,
    salePrice: 360,
    stock: 60,
    sku: "SK-AG-003",
    rating: 4.7,
    reviewCount: 23,
    imageUrl: "/images/products/agri-liquid-plant-booster.jpg",
    galleryUrls: ["/images/products/agri-liquid-plant-booster.jpg"],
    description: "Fast-absorbing bio-organic liquid fertilizer spray fortified with sea kelp extract, chelated micronutrients, and amino acids. Promotes vigorous root growth and lush green foliage.",
    specifications: {
      Volume: "500 ml Ready-To-Use Trigger Spray Bottle",
      Formula: "Balanced Organic N-P-K + Seaweed Extract",
      Safety: "100% Non-Toxic & Pet Safe",
      Application: "Foliar Spray Every 10-14 Days",
    },
  },

  // 10. SPECIAL E-SHEBA
  {
    id: "prod-es-1",
    name: "Bespoke Corporate Gift Box Custom Branding Solution",
    slug: "bespoke-corporate-gift-box-custom-packaging-solution",
    categoryId: "cat-10",
    categoryName: "Special E-Sheba / Services",
    price: 3500,
    salePrice: 2990,
    stock: 35,
    sku: "SK-ES-001",
    rating: 5.0,
    reviewCount: 21,
    imageUrl: "/images/products/esheba-custom-gift-box.jpg",
    galleryUrls: ["/images/products/esheba-custom-gift-box.jpg"],
    description: "End-to-end bespoke institutional gifting consultation, custom rigid box fabrication with gold/silver hot foil stamping, curated artisanal merchandise, and nationwide delivery.",
    specifications: {
      ServiceScope: "Custom Box Sizing, Logo Stamping, Artisan Product Curation",
      MinOrder: "Bulk Corporate Packages from 25 Units",
      Turnaround: "3 to 5 Business Days Delivery",
    },
  },
  {
    id: "prod-es-2",
    name: "Bulk Artisan Heritage Crafts and Jute Sourcing Service",
    slug: "bulk-artisan-handloom-crafts-procurement-service",
    categoryId: "cat-10",
    categoryName: "Special E-Sheba / Services",
    price: 2500,
    salePrice: 2000,
    stock: 30,
    sku: "SK-ES-002",
    rating: 4.9,
    reviewCount: 18,
    imageUrl: "/images/products/esheba-bulk-artisan-sourcing.jpg",
    galleryUrls: ["/images/products/esheba-bulk-artisan-sourcing.jpg"],
    description: "Direct village artisan matchmaking, quality control inspections, and fair-trade bulk procurement of handloom textiles, pottery, and brass items for retail chains and export buyers.",
    specifications: {
      SourcingHubs: "Tangail, Jessore, Dhamrai, Rajshahi Clusters",
      QualityControl: "Physical Pre-Dispatch Inspection & Batch Testing",
      Pricing: "Direct Fair-Trade Wholesale Artisan Rates",
    },
  },
  {
    id: "prod-es-3",
    name: "Eco-Friendly Biodegradable Recycled Kraft Paper Packaging",
    slug: "eco-friendly-recycled-kraft-packaging-solution",
    categoryId: "cat-10",
    categoryName: "Special E-Sheba / Services",
    price: 4200,
    salePrice: 3500,
    stock: 25,
    sku: "SK-ES-003",
    rating: 4.8,
    reviewCount: 15,
    imageUrl: "/images/products/esheba-recycled-kraft-packaging.jpg",
    galleryUrls: ["/images/products/esheba-recycled-kraft-packaging.jpg"],
    description: "Sustainable enterprise packaging design with unbleached recycled kraft paper corrugated cartons, biodegradable jute twine ties, and non-toxic soy-based ink printing.",
    specifications: {
      Material: "100% Recycled & Biodegradable Kraft Paperboard",
      Printing: "Eco Soy-Based Non-Toxic Inks",
      Customization: "Die-Cut Custom Dimensions & Brand Print",
    },
  },
];

// Live Collections (Clean state - populated directly from backend PostgreSQL)
export const MOCK_ORDERS: Order[] = [];
export const MOCK_PAYMENTS: PaymentVerification[] = [];
export const MOCK_INQUIRIES: ServiceInquiry[] = [];

// Active Coupons
export const MOCK_COUPONS: Coupon[] = [
  {
    code: "WELCOME10",
    discountPercentage: 10,
    minOrderValue: 1000,
    description: "10% discount on your first order over ৳1,000",
    expiresAt: "2026-12-31",
  },
  {
    code: "WELCOME150",
    discountPercentage: 0,
    discountAmount: 150,
    minOrderValue: 1500,
    description: "৳150 off on orders of ৳1,500 or more",
    expiresAt: "2026-11-30",
  },
  {
    code: "SHOILPIK15",
    discountPercentage: 15,
    minOrderValue: 2500,
    description: "15% off on orders above ৳2,500",
    expiresAt: "2026-11-30",
  },
];

// Vacancies
export const MOCK_VACANCIES: CareerVacancy[] = [
  {
    id: "vac-1",
    title: "Quality Assurance Specialist (Handicraft & Textiles)",
    department: "Product Integrity & Sourcing",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    experience: "2-4 years",
    deadline: "15 November 2026",
    description: "Lead on-site quality inspection for artisanal pottery, handloom fabrics, and jute products across partner artisan clusters in Bangladesh.",
    requirements: [
      "Degree in Textile Engineering, Fine Arts, or relevant discipline.",
      "Thorough understanding of handicraft manufacturing standards and material grading.",
      "Strong communication and vendor management skills.",
    ],
  },
  {
    id: "vac-2",
    title: "Digital Operations & Logistics Coordinator",
    department: "Fulfillment & Supply Chain",
    location: "Dhaka (Tejgaon Operations Hub)",
    type: "Full-time",
    experience: "1-3 years",
    deadline: "20 November 2026",
    description: "Manage dispatch timelines, coordinate with courier partners nationwide, and oversee manual payment reconciliation.",
    requirements: [
      "Experience with e-commerce logistics or inventory management software.",
      "Proficient in Microsoft Excel / Google Sheets and client communication.",
      "High attention to detail and punctuality.",
    ],
  },
];

// Verified Client Profile
export const CLIENT_INFO = {
  name: "SHOILPIKKABBO",
  tagline: "Delivery • Quality • Reliability",
  email: "shoilpikkabbo@gmail.com",
  phonePrimary: "01731214379",
  phoneSecondary: "01811909068",
  phonePayment: "01977765999",
  bankName: "BRAC Bank PLC",
  deliveryChargeDhaka: 80,
  deliveryChargeOutside: 130,
  freeDeliveryThreshold: 3000,
  whatsapp: "8801731214379",
  messengerUrl: "https://m.me/shoilpikkabbo",
};
