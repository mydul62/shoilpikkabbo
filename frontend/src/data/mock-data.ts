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

// Rich Product Catalog
export const MOCK_PRODUCTS: Product[] = [
  // 6 Featured Products matching Client Mockup
  {
    id: "prod-mockup-1",
    name: "Jute Shopping Bag",
    slug: "jute-shopping-bag",
    categoryId: "cat-2",
    categoryName: "Jute Items",
    price: 250,
    salePrice: 350,
    stock: 50,
    sku: "JT-SHP-001",
    rating: 4.5,
    reviewCount: 120,
    isFeatured: true,
    isBestSeller: true,
    imageUrl: "/images/client-mockup/prod-jute-bag.png",
    galleryUrls: ["/images/client-mockup/prod-jute-bag.png"],
    description: "Premium eco-friendly handcrafted golden jute shopping bag with screen printed botanical leaf design and sturdy handles.",
    specifications: {
      Material: "100% Biodegradable Golden Jute",
      Handles: "Reinforced cotton webbing",
      Origin: "Faridpur, Bangladesh",
    },
  },
  {
    id: "prod-mockup-2",
    name: "Baby Care Set",
    slug: "baby-care-set",
    categoryId: "cat-4",
    categoryName: "Baby Items",
    price: 650,
    salePrice: 850,
    stock: 35,
    sku: "BB-SET-002",
    rating: 4.8,
    reviewCount: 98,
    isFeatured: true,
    imageUrl: "/images/client-mockup/prod-baby-set.png",
    galleryUrls: ["/images/client-mockup/prod-baby-set.png"],
    description: "Comprehensive gentle baby care grooming and feeding essential set. BPA free and pediatrician approved.",
    specifications: {
      Items: "Nail clipper, brush, comb, nasal aspirator & feeding accessories",
      Safety: "100% BPA Free",
      Suitability: "Newborn to 24 Months",
    },
  },
  {
    id: "prod-mockup-3",
    name: "Organic Honey",
    slug: "organic-honey",
    categoryId: "cat-8",
    categoryName: "Food & Health",
    price: 420,
    salePrice: 600,
    stock: 45,
    sku: "FD-HNY-003",
    rating: 4.6,
    reviewCount: 76,
    isFeatured: true,
    isBestSeller: true,
    imageUrl: "/images/client-mockup/prod-honey.png",
    galleryUrls: ["/images/client-mockup/prod-honey.png"],
    description: "100% pure raw organic Sundarbans forest wild honey. Unpasteurized and packed with natural antioxidants.",
    specifications: {
      Source: "Sundarbans Mangrove Forest",
      Purity: "100% Raw & Filtered",
      NetWeight: "500g Jar",
    },
  },
  {
    id: "prod-mockup-4",
    name: "Men's T-Shirt",
    slug: "mens-t-shirt",
    categoryId: "cat-6",
    categoryName: "Rudiment Garments",
    price: 380,
    salePrice: 550,
    stock: 80,
    sku: "GM-TSH-004",
    rating: 4.3,
    reviewCount: 64,
    isFeatured: true,
    imageUrl: "/images/client-mockup/prod-tshirt.png",
    galleryUrls: ["/images/client-mockup/prod-tshirt.png"],
    description: "Premium breathable 100% combed cotton round neck casual t-shirt in deep navy blue. Pre-shrunk and color-fast.",
    specifications: {
      Fabric: "180 GSM 100% Combed Cotton",
      Fit: "Regular Modern Fit",
      Care: "Machine wash cold",
    },
  },
  {
    id: "prod-mockup-5",
    name: "Organic Fertilizer",
    slug: "organic-fertilizer",
    categoryId: "cat-9",
    categoryName: "Agriculture",
    price: 520,
    salePrice: 700,
    stock: 60,
    sku: "AG-FRT-005",
    rating: 4.7,
    reviewCount: 52,
    isFeatured: true,
    imageUrl: "/images/client-mockup/prod-fertilizer.png",
    galleryUrls: ["/images/client-mockup/prod-fertilizer.png"],
    description: "Eco-friendly bio-organic plant fertilizer packed with micro and macronutrients for rooftop gardens and agriculture.",
    specifications: {
      Type: "Bio-composted organic fertilizer",
      Application: "Potted plants, vegetables, fruit trees",
      Weight: "5kg Sealed Bag",
    },
  },
  {
    id: "prod-mockup-6",
    name: "Cosmetic Set",
    slug: "cosmetic-set",
    categoryId: "cat-8",
    categoryName: "Health & Beauty",
    price: 1200,
    salePrice: 1600,
    stock: 28,
    sku: "HB-CSM-006",
    rating: 4.6,
    reviewCount: 89,
    isFeatured: true,
    isBestSeller: true,
    imageUrl: "/images/client-mockup/prod-cosmetic-set.png",
    galleryUrls: ["/images/client-mockup/prod-cosmetic-set.png"],
    description: "Luxury organic herbal skincare and facial revitalizing set including cleanser, toner, serum, and moisturizing cream.",
    specifications: {
      Formulation: "Herbal & Botanical Extracts",
      SkinType: "All Skin Types",
      SetIncludes: "4 Full Size Products",
    },
  },
  {
    id: "prod-jute-basket",
    name: "Everyday jute basket",
    slug: "everyday-jute-basket",
    categoryId: "cat-2",
    categoryName: "Jute Items",
    price: 1450,
    salePrice: 1650,
    stock: 25,
    sku: "JT-BSK-001",
    rating: 4.9,
    reviewCount: 38,
    isFeatured: true,
    imageUrl: "/images/product-jute-basket.png",
    galleryUrls: ["/images/product-jute-basket.png"],
    description: "Everyday natural braided golden jute basket with handles for home storage and living room character.",
    specifications: {
      Material: "100% Biodegradable Golden Jute",
      Origin: "Faridpur, Bangladesh",
      Craft: "Hand-braided spiral weave",
    },
  },
  {
    id: "prod-jute-tote",
    name: "The everyday jute tote",
    slug: "the-everyday-jute-tote",
    categoryId: "cat-2",
    categoryName: "Jute Items",
    price: 850,
    stock: 40,
    sku: "JT-TOT-002",
    rating: 5.0,
    reviewCount: 42,
    isFeatured: true,
    imageUrl: "/images/product-jute-tote.png",
    galleryUrls: ["/images/product-jute-tote.png"],
    description: "Durable and structured golden jute shopping and work tote with deep green reinforced handles.",
    specifications: {
      Material: "Laminated Natural Jute Fiber",
      Handles: "Comfort Cotton Webbing",
      Capacity: "Up to 12kg",
    },
  },
  {
    id: "prod-woven-coasters",
    name: "Woven coaster set",
    slug: "woven-coaster-set",
    categoryId: "cat-2",
    categoryName: "Jute Items",
    price: 450,
    stock: 35,
    sku: "JT-CST-003",
    rating: 4.8,
    reviewCount: 29,
    isFeatured: true,
    imageUrl: "/images/product-woven-coasters.png",
    galleryUrls: ["/images/product-woven-coasters.png"],
    description: "Set of 4 circular hand-braided golden jute drink coasters protecting delicate tables with natural warmth.",
    specifications: {
      Set: "4 Pieces",
      Diameter: "10cm each",
      Material: "Organic Jute Twine",
    },
  },
  {
    id: "prod-jute-basket-large",
    name: "Everyday jute basket - Large",
    slug: "everyday-jute-basket-large",
    categoryId: "cat-2",
    categoryName: "Jute Items",
    price: 1850,
    stock: 18,
    sku: "JT-BSK-004",
    rating: 4.9,
    reviewCount: 24,
    isFeatured: true,
    imageUrl: "/images/product-jute-basket-large.png",
    galleryUrls: ["/images/product-jute-basket-large.png"],
    description: "Large capacity natural jute floor basket with dual ergonomic handles for throws, laundry, and books.",
    specifications: {
      Dimensions: "38cm diameter x 32cm height",
      Material: "Heavy-duty braided golden jute",
      Care: "Spot clean with dry cloth",
    },
  },
  {
    id: "prod-terracotta-vase",
    name: "Terracotta stem vase",
    slug: "terracotta-stem-vase",
    categoryId: "cat-1",
    categoryName: "Handicraft",
    price: 680,
    stock: 20,
    sku: "HC-VAS-005",
    rating: 4.8,
    reviewCount: 19,
    isFeatured: true,
    imageUrl: "/images/product-terracotta-vase.png",
    galleryUrls: ["/images/product-terracotta-vase.png"],
    description: "Wheel-thrown raw terracotta bud vase celebrating organic asymmetry and earthy textures.",
    specifications: {
      Material: "Riverbed Terracotta Clay",
      Height: "18cm",
      Finish: "Matte unglazed exterior",
    },
  },
  {
    id: "prod-1",
    name: "Handcrafted Terracotta Ceramic Tea Set (6 Cups & Pot)",
    slug: "handcrafted-terracotta-ceramic-tea-set",
    categoryId: "cat-1",
    categoryName: "Handicraft",
    price: 1850,
    salePrice: 1550,
    stock: 18,
    sku: "HC-TC-001",
    rating: 4.9,
    reviewCount: 34,
    isFeatured: true,
    isBestSeller: true,
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
    galleryUrls: [
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    ],
    description: "Exquisite clay terracotta tea set shaped and fired by master potters of Dhamrai. Glazed inside with food-safe natural ceramic coating.",
    specifications: {
      Material: "Pure Riverbed Terracotta Clay",
      Capacity: "Teapot 650ml, Cups 120ml each",
      Origin: "Dhamrai, Dhaka, Bangladesh",
      Care: "Hand wash with mild organic soap",
    },
  },
  {
    id: "prod-2",
    name: "Natural Braided Golden Jute Floor Rug (5x3 ft)",
    slug: "natural-braided-golden-jute-floor-rug",
    categoryId: "cat-2",
    categoryName: "Jute Items",
    price: 2400,
    salePrice: 2150,
    stock: 14,
    sku: "JT-RG-002",
    rating: 4.8,
    reviewCount: 28,
    isFeatured: true,
    isNewArrival: true,
    imageUrl: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80",
    galleryUrls: [
      "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    ],
    description: "100% natural biodegradable jute rug tightly handwoven by skilled artisans. Adds organic rustic warmth to modern living rooms and executive lounges.",
    specifications: {
      Dimensions: "5 feet x 3 feet (150cm x 90cm)",
      Fiber: "Premium Grade-A Golden Jute",
      Texture: "Braided Spiral Flatweave",
      EcoProfile: "100% Biodegradable & Compostable",
    },
  },
  {
    id: "prod-3",
    name: "Executive Leatherette Corporate Gift Box Set",
    slug: "executive-leatherette-corporate-gift-box-set",
    categoryId: "cat-5",
    categoryName: "Corporate Gift Items",
    price: 3200,
    salePrice: 2890,
    stock: 25,
    sku: "CG-BX-003",
    rating: 5.0,
    reviewCount: 19,
    isFeatured: true,
    isBestSeller: true,
    imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    galleryUrls: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    ],
    description: "Luxury corporate executive bundle comprising a hardbound planner diary, heavy metal rollerball pen, stainless vacuum flask (500ml), and a 32GB metal USB drive.",
    specifications: {
      Includes: "Diary, Metal Pen, Thermal Flask, USB Drive",
      Branding: "Custom foil logo embossing available",
      Packaging: "Rigid magnetic gift box with velvet inlay",
    },
  },
  {
    id: "prod-4",
    name: "Organic Baby Muslin Cotton Swaddle Blankets (Set of 3)",
    slug: "organic-baby-muslin-cotton-swaddle-blankets",
    categoryId: "cat-4",
    categoryName: "Baby Items",
    price: 1350,
    stock: 32,
    sku: "BB-MS-004",
    rating: 4.9,
    reviewCount: 41,
    isNewArrival: true,
    imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80",
    galleryUrls: [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80",
    ],
    description: "Ultra-breathable 4-layer pure combed cotton swaddle blankets. Gets softer with every wash, preventing overheating while keeping baby comfortably snug.",
    specifications: {
      Fabric: "100% GOTS Certified Organic Cotton Muslin",
      Size: "110cm x 110cm",
      Patterns: "Natural dye botanical prints",
    },
  },
  {
    id: "prod-5",
    name: "Pure Cold-Pressed Kalijira (Black Seed) Oil (250ml)",
    slug: "pure-cold-pressed-kalijira-oil-250ml",
    categoryId: "cat-8",
    categoryName: "Health and Beauty",
    price: 750,
    stock: 45,
    sku: "HB-KJ-005",
    rating: 4.9,
    reviewCount: 63,
    isBestSeller: true,
    imageUrl: "https://images.unsplash.com/photo-1608248597359-58b18ec06f37?auto=format&fit=crop&w=600&q=80",
    galleryUrls: [
      "https://images.unsplash.com/photo-1608248597359-58b18ec06f37?auto=format&fit=crop&w=600&q=80",
    ],
    description: "100% virgin cold-pressed Nigella Sativa oil sourced from premium Jessore black seeds. Unrefined, unheated, free from solvents or preservatives.",
    specifications: {
      Volume: "250ml in dark amber glass bottle",
      Extraction: "Single cold-pressed wood expeller",
      Benefits: "Immunity support, skincare, hair nourishment",
    },
  },
  {
    id: "prod-6",
    name: "Industrial Grade Heavy-Duty Polyethylene Storage Crate (60L)",
    slug: "industrial-grade-storage-crate-60l",
    categoryId: "cat-3",
    categoryName: "Polymer",
    price: 980,
    stock: 50,
    sku: "PM-CR-006",
    rating: 4.7,
    reviewCount: 15,
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    galleryUrls: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    ],
    description: "High-density polymer stacking container engineered for warehouse material handling, agricultural transport, and chemical resistance.",
    specifications: {
      Capacity: "60 Liters (Load capacity up to 45kg)",
      Material: "Virgin HDPE Polymer",
      Features: "Interlocking stackable lips, ergonomic grip handles",
    },
  },
  {
    id: "prod-7",
    name: "Combed Piqué Cotton Polo Shirt — Forest Green",
    slug: "combed-pique-cotton-polo-shirt-forest-green",
    categoryId: "cat-6",
    categoryName: "Rudiment Garments",
    price: 890,
    salePrice: 750,
    stock: 60,
    sku: "RG-PL-007",
    rating: 4.6,
    reviewCount: 22,
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80",
    galleryUrls: [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80",
    ],
    description: "Classic semi-formal polo crafted from 220 GSM double-lacoste combed cotton. Features rib-knit collar and mother-of-pearl finish buttons.",
    specifications: {
      GSM: "220 GSM Heavyweight Cotton",
      Fit: "Regular Contemporary Fit",
      Sizes: "M, L, XL, XXL",
    },
  },
  {
    id: "prod-8",
    name: "Complete Organic Rooftop Gardening Starter Kit",
    slug: "complete-organic-rooftop-gardening-starter-kit",
    categoryId: "cat-9",
    categoryName: "Agriculture",
    price: 1950,
    stock: 20,
    sku: "AG-KT-008",
    rating: 4.8,
    reviewCount: 17,
    isNewArrival: true,
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6ef23963?auto=format&fit=crop&w=600&q=80",
    galleryUrls: [
      "https://images.unsplash.com/photo-1592417817098-8f3d6ef23963?auto=format&fit=crop&w=600&q=80",
    ],
    description: "All-in-one starter pack including 5 geo-textile grow bags, 10kg enriched vermicompost, hand trowel, 2L pressure sprayer, and 6 varieties of vegetable seeds.",
    specifications: {
      GrowBags: "5x 12-inch heavy geo-fabric pots",
      Seeds: "Tomato, Chili, Coriander, Spinach, Eggplant, Bean",
      Fertilizer: "100% Odorless Organic Vermicompost",
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
