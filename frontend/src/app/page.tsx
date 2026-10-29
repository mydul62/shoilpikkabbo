"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Plus,
  Check,
  Gift,
  Factory,
  Headset,
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { useCart } from "@/context/CartContext";

export default function HomePage() {
  const { addToCart, setIsCartOpen } = useCart();
  const [addedProductId, setAddedProductId] = React.useState<string | null>(null);

  const handleQuickAdd = (productData: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number;
    imageUrl: string;
    categoryName: string;
    stock: number;
  }) => {
    addToCart(
      {
        id: productData.id,
        name: productData.name,
        slug: productData.slug,
        categoryId: "quick-cat",
        categoryName: productData.categoryName,
        price: productData.price,
        salePrice: productData.salePrice,
        stock: productData.stock,
        sku: `SK-${productData.slug}`,
        rating: 5,
        reviewCount: 18,
        imageUrl: productData.imageUrl,
        galleryUrls: [productData.imageUrl],
        description: productData.name,
        specifications: {},
      },
      1
    );
    setAddedProductId(productData.id);
    setTimeout(() => setAddedProductId(null), 1500);
    setIsCartOpen(true);
  };

  return (
    <StorefrontLayout>
      {/* 1. Hero Section - Exact Match with Client Reference (Mobile Screenshot 1 & Tablet Screenshot 1) */}
      <section className="relative bg-[#FAF7F2] pt-6 pb-6 sm:py-10 md:py-12 lg:py-16 border-b border-[#EAE3D6] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-12 xl:gap-16 items-center">
            {/* Left Column: Typography & Action */}
            <div className="md:col-span-6 lg:col-span-5 flex flex-col justify-center">
              {/* Overline Tag */}
              <p className="text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-[#B85D38] mb-3 sm:mb-4 md:mb-5">
                THE EVERYDAY EDIT / 01
              </p>

              {/* Main Headline in Editorial Serif */}
              <h1 className="font-serif text-[34px] sm:text-[42px] md:text-[48px] lg:text-[64px] xl:text-[72px] leading-[1.08] md:leading-[1.04] text-[#143527] font-normal tracking-tight mb-4 sm:mb-5 md:mb-6">
                A little craft.<br />
                A lot of<br />
                character.
              </h1>

              {/* Sub-paragraph */}
              <p className="text-[#555A54] text-[13.5px] sm:text-base lg:text-[17px] leading-relaxed max-w-[420px] mb-6 sm:mb-7 md:mb-8 font-light">
                Thoughtful objects, everyday essentials and services in one considered place.
              </p>

              {/* Explore Button */}
              <div>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 bg-[#143527] hover:bg-[#0F261B] text-white text-xs sm:text-sm font-medium rounded-[2px] transition-colors shadow-xs group"
                >
                  <span>Explore the collection</span>
                  <ArrowUpRight className="h-4 w-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>

              {/* Desktop-only Feature Teaser / "01" (Hidden on mobile & tablet) */}
              <div className="hidden lg:flex pt-8 lg:pt-12 mt-8 lg:mt-12 border-t border-[#EAE3D6] items-center gap-4">
                <span className="font-serif text-3xl sm:text-4xl font-normal text-[#B85D38] leading-none select-none">
                  01
                </span>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#14261D]">
                    THE EVERYDAY EDIT
                  </span>
                  <span className="text-xs text-[#6B665F] font-light mt-0.5">
                    Natural textures. Considered details.
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset */}
            <div className="md:col-span-6 lg:col-span-7">
              <div className="relative w-full aspect-[4/3] sm:aspect-[1.35/1] rounded-none sm:rounded-2xl overflow-hidden shadow-xs bg-[#EFE9DF]">
                <Image
                  src="/images/hero-artisan.png"
                  alt="Handwoven artisanal jute baskets, natural linen and ceramics"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 55vw"
                />

                {/* Floating Card Link in Bottom Left on Desktop (Hidden on mobile & tablet) */}
                <Link
                  href="/shop?category=jute-items"
                  className="hidden lg:flex absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-white/95 backdrop-blur-xs px-4 sm:px-5 py-3 sm:py-3.5 shadow-md border border-[#EAE3D6] items-center justify-between gap-5 sm:gap-8 hover:bg-white transition-all group"
                >
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#737069]">
                      THE NATURAL COLLECTION
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-[#14261D] group-hover:text-[#B85D38] transition-colors mt-0.5">
                      Woven into everyday life
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[#14261D] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                </Link>
              </div>

              {/* Mobile Hero Image Caption Link directly underneath image - Matching Mobile Screenshot 1 */}
              <Link
                href="/shop"
                className="flex sm:hidden items-center justify-between pt-3 text-[12px] text-[#555A54] hover:text-[#143527] transition-colors group"
              >
                <span>Natural textures. Considered details.</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-[#555A54] group-hover:text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Manifesto Banner - 2 Columns on Tablet (Tablet Screenshot 1) / Stacks on Mobile (Mobile Screenshot 1) */}
      <section className="bg-[#EBF0EC] border-b border-[#D8DFD9] py-8 sm:py-10 md:py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-center">
            <div className="md:col-span-6">
              <h2 className="font-serif text-[24px] sm:text-3xl md:text-[32px] font-normal text-[#143527] leading-[1.2] tracking-tight">
                For the way you live, give<br className="hidden sm:inline" /> and grow.
              </h2>
            </div>
            <div className="md:col-span-6">
              <p className="text-[13px] sm:text-[14px] md:text-[14.5px] text-[#556059] font-light leading-relaxed max-w-xl">
                Welcome to SHOILPIKKABBO. From handcrafted pieces to practical essentials, discover new possibilities for every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Section Ordering Wrapper:
          • On Mobile (< md): Product Grid appears FIRST (order-1), Category Discovery appears SECOND (order-2) (matching Mobile Screenshots 2 & 3).
          • On Tablet & Desktop (md+): Category Discovery appears FIRST (order-1), Product Grid appears SECOND (order-2) (matching Tablet Screenshots 1 & 2).
      */}
      <div className="flex flex-col">
        {/* Category Discovery Section - Order 2 on Mobile, Order 1 on Tablet & Desktop */}
        <section className="order-2 md:order-1 bg-[#FAF7F2] py-10 sm:py-14 md:py-16 lg:py-20 border-b border-[#EAE3D5]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 sm:mb-8 md:mb-10">
              <div>
                <p className="text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-[#B85D38] mb-2 sm:mb-2.5">
                  MANY NEEDS. ONE DESTINATION.
                </p>
                <h2 className="font-serif text-[28px] sm:text-3xl md:text-[36px] lg:text-[44px] font-normal text-[#143527] leading-[1.15] sm:leading-[1.1] tracking-tight">
                  Find your everyday.
                </h2>
                <p className="md:hidden text-[13px] sm:text-[14px] text-[#6A736C] font-light mt-1">
                  Explore every category.
                </p>
              </div>
              <Link
                href="/shop"
                className="hidden lg:inline-flex items-center gap-1.5 text-[13px] sm:text-[14px] font-medium text-[#143527] hover:text-[#B85D38] transition-colors self-start sm:self-auto group"
              >
                <span>Explore all categories</span>
                <ArrowUpRight className="w-4 h-4 text-[#143527] group-hover:text-[#B85D38] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {/* Mobile Categories Layout: 2 Featured Visual Cards + Vertical Category List (Mobile Screenshot 2 & 3) */}
            <div className="md:hidden">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Link href="/shop?category=handicraft" className="group block">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#E8E2D6] shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-2">
                    <Image
                      src="/images/category-handicrafts.png"
                      alt="Handcrafts category"
                      fill
                      sizes="50vw"
                      className="object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[13.5px] font-medium text-[#143527] group-hover:text-[#B85D38]">
                    <span>Handicrafts</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </Link>

                <Link href="/shop?category=jute-items" className="group block">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#E8E2D6] shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-2">
                    <Image
                      src="/images/category-jute.png"
                      alt="Jute items category"
                      fill
                      sizes="50vw"
                      className="object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[13.5px] font-medium text-[#143527] group-hover:text-[#B85D38]">
                    <span>Jute Items</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </div>

              {/* Mobile Vertical Divided Category List */}
              <div className="divide-y divide-[#EAE3D6] border-t border-[#EAE3D6]">
                {[
                  { name: "Polymer", slug: "polymer" },
                  { name: "Baby Items", slug: "baby-items" },
                  { name: "Corporate Gift Items", slug: "corporate-gift-items" },
                  { name: "Rudiment Garments", slug: "rudiment-garments" },
                  { name: "Industrial Solutions", slug: "industrial-solutions" },
                  { name: "Health & Beauty (Cosmetics, Food, Medicine)", slug: "health-and-beauty" },
                  { name: "Agriculture", slug: "agriculture" },
                  { name: "Special E-Sheba / Services", slug: "special-services", href: "/e-sheba" },
                ].map((cat) => (
                  <Link
                    key={cat.slug}
                    href={cat.href || `/shop?category=${cat.slug}`}
                    className="flex items-center justify-between py-3 text-[13px] text-[#2D3F33] hover:text-[#143527] transition-colors group"
                  >
                    <span className="font-normal">{cat.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#6A736C] group-hover:text-[#143527] transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Tablet & Desktop Categories Layout: 3 Cards + 2 Rows of Pills (Tablet Screenshot 1 & 2) */}
            <div className="hidden md:block">
              <div className="grid grid-cols-3 gap-4 md:gap-5 lg:gap-8 mb-6 md:mb-8">
                {/* 1. Handicrafts */}
                <Link href="/shop?category=handicraft" className="group block">
                  <div className="relative w-full aspect-square md:aspect-[1.15/1] lg:aspect-[1.65/1] rounded-xl sm:rounded-2xl overflow-hidden bg-[#E8E2D6] shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-3">
                    <Image
                      src="/images/category-handicrafts.png"
                      alt="Handcrafted ceramic pottery vase with dried botanical branch"
                      fill
                      sizes="33vw"
                      className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl md:text-[22px] lg:text-[25px] font-normal text-[#143527] group-hover:text-[#B85D38] transition-colors leading-tight">
                      Handicrafts
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-[#143527] group-hover:text-[#B85D38] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                  </div>
                </Link>

                {/* 2. Jute Items */}
                <Link href="/shop?category=jute-items" className="group block">
                  <div className="relative w-full aspect-square md:aspect-[1.15/1] lg:aspect-[1.65/1] rounded-xl sm:rounded-2xl overflow-hidden bg-[#E8E2D6] shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-3">
                    <Image
                      src="/images/category-jute.png"
                      alt="Eco-friendly golden jute tote bag with dark green handles"
                      fill
                      sizes="33vw"
                      className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl md:text-[22px] lg:text-[25px] font-normal text-[#143527] group-hover:text-[#B85D38] transition-colors leading-tight">
                      Jute Items
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-[#143527] group-hover:text-[#B85D38] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                  </div>
                </Link>

                {/* 3. Corporate Gift Items */}
                <Link href="/shop?category=corporate-gift-items" className="group block">
                  <div className="relative w-full aspect-square md:aspect-[1.15/1] lg:aspect-[1.65/1] rounded-xl sm:rounded-2xl overflow-hidden bg-[#E8E2D6] shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-3">
                    <Image
                      src="/images/category-corporate.png"
                      alt="Kraft paper corporate gift box with dark green ribbon and ceramic tea mug"
                      fill
                      sizes="33vw"
                      className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl md:text-[22px] lg:text-[25px] font-normal text-[#143527] group-hover:text-[#B85D38] transition-colors leading-tight">
                      Corporate Gift Items
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-[#143527] group-hover:text-[#B85D38] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                  </div>
                </Link>
              </div>

              {/* Two Rows of Category Pills on Tablet (Tablet Screenshot 1 & 2) */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 md:gap-3 pt-1">
                {[
                  { name: "Polymer", slug: "polymer" },
                  { name: "Baby Items", slug: "baby-items" },
                  { name: "Rudiment Garments", slug: "rudiment-garments" },
                  { name: "Industrial Solutions", slug: "industrial-solutions" },
                  { name: "Health & Beauty (Cosmetics, Food, Medicine)", slug: "health-and-beauty" },
                  { name: "Agriculture", slug: "agriculture" },
                  { name: "Special E-Sheba / Services", slug: "special-services", href: "/e-sheba" },
                ].map((pill) => (
                  <Link
                    key={pill.slug}
                    href={pill.href || `/shop?category=${pill.slug}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 md:px-4 md:py-2 rounded-full border border-[#D5CDC0] bg-[#FAF7F2] hover:bg-white hover:border-[#143527] text-[#2D3F33] hover:text-[#143527] text-[11.5px] md:text-[12px] font-normal transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] group"
                  >
                    <span>{pill.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#6A736C] group-hover:text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* The Considered Edit (Product Grid) - Order 1 on Mobile, Order 2 on Tablet & Desktop */}
        <section className="order-1 md:order-2 bg-[#FAF7F2] py-10 sm:py-14 md:py-16 lg:py-20 border-b border-[#EAE3D5]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 md:mb-10">
              <div>
                <p className="hidden lg:block text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase text-[#B85D38] mb-2 sm:mb-3">
                  THE CONSIDERED EDIT
                </p>
                <h2 className="font-serif text-[28px] sm:text-3xl md:text-[36px] lg:text-[44px] font-normal text-[#143527] leading-[1.15] sm:leading-[1.1] tracking-tight">
                  Small details.<br className="sm:hidden" /> Lasting delight.
                </h2>
              </div>
              {/* Tablet & Desktop Header Link: "Shop all ↗" matching Tablet Screenshot 2 */}
              <Link
                href="/shop"
                className="hidden sm:inline-flex items-center gap-1.5 text-[13px] md:text-[13.5px] font-medium text-[#143527] hover:text-[#B85D38] transition-colors group"
              >
                <span>Shop all</span>
                <ArrowUpRight className="w-4 h-4 text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {/* 4-Product Grid: 2 Columns on mobile & tablet (2x2 grid matching Tablet Screenshot 2), 4 on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-7">
              {/* Product 1: Everyday jute basket */}
              <div className="group flex flex-col">
                <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#E8E2D6] shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-2 sm:mb-3">
                  <Link href="/products/natural-braided-golden-jute-floor-rug" className="block relative w-full h-full">
                    <Image
                      src="/images/product-jute-basket.png"
                      alt="Everyday handwoven jute basket with handles"
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                    />
                  </Link>
                  <button
                    onClick={() => handleQuickAdd({
                      id: "prod-jute-basket",
                      name: "Everyday jute basket",
                      slug: "everyday-jute-basket",
                      price: 1450,
                      imageUrl: "/images/product-jute-basket.png",
                      categoryName: "Jute Items",
                      stock: 25,
                    })}
                    className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white hover:bg-[#143527] text-[#143527] hover:text-white shadow-sm flex items-center justify-center transition-all cursor-pointer group/btn"
                    title="Add to bag"
                    aria-label="Add Everyday jute basket to bag"
                  >
                    {addedProductId === "prod-jute-basket" ? (
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#143527]" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:rotate-90 transition-transform duration-200" />
                    )}
                  </button>
                </div>
                <span className="text-[10px] sm:text-[11.5px] text-[#6A736C] font-light">
                  Jute Items
                </span>
                <Link href="/products/natural-braided-golden-jute-floor-rug">
                  <h3 className="text-[13px] sm:text-[15px] font-medium text-[#143527] group-hover:text-[#B85D38] transition-colors mt-0.5 leading-snug line-clamp-1">
                    Everyday jute basket
                  </h3>
                </Link>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5">
                  <span className="text-[13px] sm:text-[14.5px] font-semibold text-[#143527]">
                    ৳1,450
                  </span>
                  <span className="text-[11px] sm:text-[12px] text-[#8C948E] line-through font-light">
                    ৳1,650
                  </span>
                </div>
              </div>

              {/* Product 2: Woven coaster set */}
              <div className="group flex flex-col">
                <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#E8E2D6] shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-2 sm:mb-3">
                  <Link href="/products/handcrafted-terracotta-ceramic-tea-set" className="block relative w-full h-full">
                    <Image
                      src="/images/product-woven-coasters.png"
                      alt="Natural woven circular jute coaster set"
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                    />
                  </Link>
                  <button
                    onClick={() => handleQuickAdd({
                      id: "prod-woven-coasters",
                      name: "Woven coaster set",
                      slug: "woven-coaster-set",
                      price: 450,
                      imageUrl: "/images/product-woven-coasters.png",
                      categoryName: "Handicrafts",
                      stock: 35,
                    })}
                    className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white hover:bg-[#143527] text-[#143527] hover:text-white shadow-sm flex items-center justify-center transition-all cursor-pointer group/btn"
                    title="Add to bag"
                    aria-label="Add Woven coaster set to bag"
                  >
                    {addedProductId === "prod-woven-coasters" ? (
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#143527]" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:rotate-90 transition-transform duration-200" />
                    )}
                  </button>
                </div>
                <span className="text-[10px] sm:text-[11.5px] text-[#6A736C] font-light">
                  Handicrafts
                </span>
                <Link href="/products/handcrafted-terracotta-ceramic-tea-set">
                  <h3 className="text-[13px] sm:text-[15px] font-medium text-[#143527] group-hover:text-[#B85D38] transition-colors mt-0.5 leading-snug line-clamp-1">
                    Woven coaster set
                  </h3>
                </Link>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5">
                  <span className="text-[13px] sm:text-[14.5px] font-semibold text-[#143527]">
                    ৳450
                  </span>
                </div>
              </div>

              {/* Product 3: Terracotta stem vase */}
              <div className="group flex flex-col">
                <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#E8E2D6] shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-2 sm:mb-3">
                  <Link href="/products/handcrafted-terracotta-ceramic-tea-set" className="block relative w-full h-full">
                    <Image
                      src="/images/product-terracotta-vase.png"
                      alt="Handmade terracotta bud and stem vase on stone block"
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                    />
                  </Link>
                  <button
                    onClick={() => handleQuickAdd({
                      id: "prod-terracotta-vase",
                      name: "Terracotta stem vase",
                      slug: "terracotta-stem-vase",
                      price: 680,
                      imageUrl: "/images/product-terracotta-vase.png",
                      categoryName: "Handicrafts",
                      stock: 20,
                    })}
                    className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white hover:bg-[#143527] text-[#143527] hover:text-white shadow-sm flex items-center justify-center transition-all cursor-pointer group/btn"
                    title="Add to bag"
                    aria-label="Add Terracotta stem vase to bag"
                  >
                    {addedProductId === "prod-terracotta-vase" ? (
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#143527]" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:rotate-90 transition-transform duration-200" />
                    )}
                  </button>
                </div>
                <span className="text-[10px] sm:text-[11.5px] text-[#6A736C] font-light">
                  Handicrafts
                </span>
                <Link href="/products/handcrafted-terracotta-ceramic-tea-set">
                  <h3 className="text-[13px] sm:text-[15px] font-medium text-[#143527] group-hover:text-[#B85D38] transition-colors mt-0.5 leading-snug line-clamp-1">
                    Terracotta stem vase
                  </h3>
                </Link>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5">
                  <span className="text-[13px] sm:text-[14.5px] font-semibold text-[#143527]">
                    ৳680
                  </span>
                </div>
              </div>

              {/* Product 4: The everyday jute tote */}
              <div className="group flex flex-col">
                <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#E8E2D6] shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-2 sm:mb-3">
                  <Link href="/products/executive-eco-jute-laptop-tote-bag" className="block relative w-full h-full">
                    <Image
                      src="/images/product-jute-tote.png"
                      alt="The everyday natural golden jute tote bag with dark green handles"
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                    />
                  </Link>
                  <button
                    onClick={() => handleQuickAdd({
                      id: "prod-jute-tote",
                      name: "The everyday jute tote",
                      slug: "the-everyday-jute-tote",
                      price: 850,
                      imageUrl: "/images/product-jute-tote.png",
                      categoryName: "Jute Items",
                      stock: 40,
                    })}
                    className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white hover:bg-[#143527] text-[#143527] hover:text-white shadow-sm flex items-center justify-center transition-all cursor-pointer group/btn"
                    title="Add to bag"
                    aria-label="Add The everyday jute tote to bag"
                  >
                    {addedProductId === "prod-jute-tote" ? (
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#143527]" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:rotate-90 transition-transform duration-200" />
                    )}
                  </button>
                </div>
                <span className="text-[10px] sm:text-[11.5px] text-[#6A736C] font-light">
                  Jute Items
                </span>
                <Link href="/products/executive-eco-jute-laptop-tote-bag">
                  <h3 className="text-[13px] sm:text-[15px] font-medium text-[#143527] group-hover:text-[#B85D38] transition-colors mt-0.5 leading-snug line-clamp-1">
                    The everyday jute tote
                  </h3>
                </Link>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5">
                  <span className="text-[13px] sm:text-[14.5px] font-semibold text-[#143527]">
                    ৳850
                  </span>
                </div>
              </div>
            </div>

            {/* Full-width "Shop all products ↗" button on mobile only - Matching Mobile Screenshot 2 */}
            <div className="mt-7 sm:hidden">
              <Link
                href="/shop"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[2px] border border-[#D5CDC0] bg-[#FAF7F2] hover:bg-white text-[#143527] text-[13px] font-medium transition-all shadow-2xs group"
              >
                <span>Shop all products</span>
                <ArrowUpRight className="w-4 h-4 text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* 5. Promotional Welcome Offer Banner - Exact Match with Tablet Screenshot 2 & 3 */}
      <section className="bg-[#143527] text-white py-10 sm:py-14 md:py-16 lg:py-20 border-y border-[#0E2C1F] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-14 items-start sm:items-center">
            {/* Left Column: Heading */}
            <div className="md:col-span-6 flex flex-col justify-center">
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-[#A8BDB2] mb-2 sm:mb-3 md:mb-4">
                A LITTLE SOMETHING TO BEGIN
              </p>
              <h2 className="font-serif text-[28px] sm:text-3xl md:text-[36px] lg:text-[44px] xl:text-[46px] font-normal text-white leading-[1.12] tracking-tight">
                Your first find,<br /> a little sweeter.
              </h2>
            </div>

            {/* Right Column: Offer Details & Action */}
            <div className="md:col-span-6 flex flex-col items-start justify-center">
              <p className="text-[15px] sm:text-[17px] md:text-[18px] font-normal text-[#E6EFE9] mb-1 leading-snug">
                ৳150 off your first ৳1,500 order.
              </p>
              <p className="text-[11.5px] sm:text-[12px] md:text-[12.5px] font-light text-[#9EB5A7] mb-4 sm:mb-5 md:mb-6">
                WELCOME150 <span className="select-none mx-1">·</span> One use per customer <span className="select-none mx-1">·</span> Until 30 Nov 2026
              </p>
              <Link
                href="/offers"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white hover:bg-[#FAF7F2] text-[#143527] text-xs sm:text-sm font-medium rounded-[2px] shadow-sm transition-all group"
              >
                <span>Explore offers</span>
                <ArrowUpRight className="w-4 h-4 text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Beyond the Basket - Services Showcase - Exact Match with Tablet Screenshot 3 */}
      <section className="bg-[#FAF7F2] py-10 sm:py-14 md:py-16 lg:py-24 border-b border-[#EAE3D5]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Header Row */}
          <div className="mb-6 sm:mb-8 md:mb-10">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-[#B85D38] mb-2 sm:mb-2.5">
              BEYOND THE BASKET
            </p>
            <h2 className="font-serif text-[28px] sm:text-3xl md:text-[36px] lg:text-[44px] font-normal text-[#143527] leading-[1.12] tracking-tight mb-2">
              Make room for possibilities.
            </h2>
            <p className="text-[12.5px] sm:text-[13.5px] md:text-[14px] text-[#556059] font-light leading-relaxed max-w-2xl">
              Proposed service areas. Share your brief; scope and availability are confirmed before any commitment.
            </p>
          </div>

          {/* Mobile Stacked Service Cards (Mobile Screenshot 3 & 4) */}
          <div className="md:hidden space-y-2.5">
            <Link
              href="/services"
              className="flex items-center justify-between p-4 bg-[#F5F2EB]/80 hover:bg-white border border-[#EAE3D6] rounded-[3px] transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <Gift className="w-4 h-4 text-[#143527] shrink-0" />
                <span className="text-[13px] text-[#143527] font-normal">Corporate gifting</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#6A736C] group-hover:text-[#143527] transition-colors" />
            </Link>

            <Link
              href="/services"
              className="flex items-center justify-between p-4 bg-[#F5F2EB]/80 hover:bg-white border border-[#EAE3D6] rounded-[3px] transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <Factory className="w-4 h-4 text-[#143527] shrink-0" />
                <span className="text-[13px] text-[#143527] font-normal">Industrial Solutions</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#6A736C] group-hover:text-[#143527] transition-colors" />
            </Link>

            <Link
              href="/e-sheba"
              className="flex items-center justify-between p-4 bg-[#F5F2EB]/80 hover:bg-white border border-[#EAE3D6] rounded-[3px] transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <Headset className="w-4 h-4 text-[#143527] shrink-0" />
                <span className="text-[13px] text-[#143527] font-normal">Special E-Sheba / Services</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#6A736C] group-hover:text-[#143527] transition-colors" />
            </Link>

            <div className="pt-2">
              <Link
                href="/services"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[2px] border border-[#D5CDC0] bg-[#FAF7F2] hover:bg-white text-[#143527] text-[13px] font-medium transition-all shadow-2xs group"
              >
                <span>Explore services</span>
                <ArrowUpRight className="w-4 h-4 text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Tablet & Desktop 3-Card Grid Matching Tablet Screenshot 3 */}
          <div className="hidden md:block">
            <div className="grid grid-cols-3 gap-4 md:gap-5 lg:gap-8 mb-6 md:mb-8">
              {/* Card 1: Corporate gifting */}
              <Link
                href="/services"
                className="group block p-5 sm:p-6 lg:p-8 bg-transparent hover:bg-white/60 border border-[#E2DDD2] hover:border-[#C4B8A5] rounded-[2px] transition-all duration-300"
              >
                <div className="mb-5 sm:mb-6 text-[#143527]">
                  <Gift className="w-5 h-5 stroke-[1.6] text-[#143527] group-hover:text-[#B85D38] transition-colors" />
                </div>
                <h3 className="font-serif text-lg sm:text-xl md:text-[22px] font-normal text-[#143527] group-hover:text-[#B85D38] transition-colors mb-5 leading-snug">
                  Corporate gifting
                </h3>
                <span className="inline-flex items-center gap-1 text-[12px] md:text-[12.5px] text-[#556059] group-hover:text-[#143527] font-light">
                  <span>Discuss your brief</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              {/* Card 2: Industrial Solutions */}
              <Link
                href="/services"
                className="group block p-5 sm:p-6 lg:p-8 bg-transparent hover:bg-white/60 border border-[#E2DDD2] hover:border-[#C4B8A5] rounded-[2px] transition-all duration-300"
              >
                <div className="mb-5 sm:mb-6 text-[#143527]">
                  <Factory className="w-5 h-5 stroke-[1.6] text-[#143527] group-hover:text-[#B85D38] transition-colors" />
                </div>
                <h3 className="font-serif text-lg sm:text-xl md:text-[22px] font-normal text-[#143527] group-hover:text-[#B85D38] transition-colors mb-5 leading-snug">
                  Industrial Solutions
                </h3>
                <span className="inline-flex items-center gap-1 text-[12px] md:text-[12.5px] text-[#556059] group-hover:text-[#143527] font-light">
                  <span>Discuss your brief</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              {/* Card 3: Special E-Sheba / Services */}
              <Link
                href="/e-sheba"
                className="group block p-5 sm:p-6 lg:p-8 bg-transparent hover:bg-white/60 border border-[#E2DDD2] hover:border-[#C4B8A5] rounded-[2px] transition-all duration-300"
              >
                <div className="mb-5 sm:mb-6 text-[#143527]">
                  <Headset className="w-5 h-5 stroke-[1.6] text-[#143527] group-hover:text-[#B85D38] transition-colors" />
                </div>
                <h3 className="font-serif text-lg sm:text-xl md:text-[22px] font-normal text-[#143527] group-hover:text-[#B85D38] transition-colors mb-5 leading-snug">
                  Special E-Sheba / Services
                </h3>
                <span className="inline-flex items-center gap-1 text-[12px] md:text-[12.5px] text-[#556059] group-hover:text-[#143527] font-light">
                  <span>Discuss your brief</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>

            {/* Explore Services Button below cards */}
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F7F4EE] hover:bg-white border border-[#D5CDC0] hover:border-[#143527] text-[#143527] text-[13px] font-medium rounded-[2px] transition-all group shadow-2xs"
            >
              <span>Explore services</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Brand Story & Craft Heritage - Exact Match with Tablet Screenshot 3 & Mobile Screenshot 4 */}
      <section className="w-full bg-[#EFECE6] border-b border-[#E0D8CB] overflow-hidden">
        {/* Mobile Layout (Mobile Screenshot 4) */}
        <div className="md:hidden">
          <div className="relative w-full aspect-[4/3] bg-[#E8E2D6]">
            <Image
              src="/images/story-artisan.png"
              alt="Artisan hand-weaving natural jute basket on wooden table"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#B85D38] mb-2.5">
              TEXTURE & EVERYDAY LIFE
            </p>
            <h2 className="font-serif text-[26px] sm:text-3xl font-normal text-[#143527] leading-[1.2] tracking-tight mb-3">
              Beauty in the things<br /> we choose.
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[#556059] font-light leading-relaxed mb-6">
              The warmth of clay. The quiet character of natural fibres. Objects that feel at home in your life.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 hover:bg-white border border-[#D5CDC0] text-[#143527] text-[12.5px] font-medium rounded-[2px] transition-all shadow-2xs group"
            >
              <span>Get to know us</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Tablet & Desktop 2-Column Side-by-Side Layout (Tablet Screenshot 3) */}
        <div className="hidden md:grid grid-cols-12 items-stretch min-h-[380px] lg:min-h-[460px]">
          <div className="col-span-6 relative w-full h-full min-h-[360px]">
            <Image
              src="/images/story-artisan.png"
              alt="Artisan hand-weaving natural jute basket on wooden table"
              fill
              sizes="50vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="col-span-6 flex flex-col justify-center px-8 md:px-10 lg:px-16 xl:px-20 py-10 md:py-12 lg:py-16 bg-[#ECE7DB]">
            <div className="max-w-lg">
              <p className="text-[10.5px] md:text-[11px] font-bold tracking-[0.16em] uppercase text-[#B85D38] mb-3">
                TEXTURE & EVERYDAY LIFE
              </p>
              <h2 className="font-serif text-[28px] md:text-[34px] lg:text-[42px] font-normal text-[#143527] leading-[1.16] tracking-tight mb-4">
                Beauty in the things<br /> we choose.
              </h2>
              <p className="text-[13px] md:text-[13.5px] lg:text-[14.5px] text-[#556059] font-light leading-relaxed mb-6 md:mb-8">
                The warmth of clay. The quiet character of natural fibres. Objects that feel at home in your life.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 hover:bg-white border border-[#D5CDC0] hover:border-[#143527] text-[#143527] text-[12.5px] md:text-[13px] font-medium rounded-[2px] transition-all group self-start shadow-2xs"
              >
                <span>Get to know us</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Corporate Gifting Feature - Exact Match with Tablet Screenshot 3 & 4 */}
      <section className="bg-[#FAF7F2] py-10 sm:py-14 md:py-16 lg:py-24 border-b border-[#EAE3D5]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Mobile Layout (Mobile Screenshot 4 & 5) */}
          <div className="md:hidden">
            <div className="relative w-full aspect-[16/10] rounded-none sm:rounded-xl overflow-hidden bg-[#E8E2D6] mb-5">
              <Image
                src="/images/corporate-gifting-feature.png"
                alt="Kraft paper gift box tied with forest green ribbon and ceramic mug on stone table"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#B85D38] mb-2.5">
                FOR PEOPLE, NOT JUST OCCASIONS
              </p>
              <h2 className="font-serif text-[26px] sm:text-3xl font-normal text-[#143527] leading-[1.2] tracking-tight mb-2.5">
                A thoughtful gesture<br /> goes a long way.
              </h2>
              <p className="text-[13px] sm:text-[14px] text-[#556059] font-light leading-relaxed mb-6">
                Gift-worthy pieces for your people or your team. Start larger orders with a simple brief.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#143527] text-white text-[12.5px] font-medium rounded-[2px] transition-all shadow-2xs group"
              >
                <span>Discover gifting</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Tablet & Desktop 2-Column Layout (Tablet Screenshot 3 & 4) */}
          <div className="hidden md:grid grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Column: Text & CTA */}
            <div className="col-span-6 flex flex-col justify-center">
              <p className="text-[10.5px] md:text-[11px] font-bold tracking-[0.16em] uppercase text-[#B85D38] mb-3">
                FOR PEOPLE, NOT JUST OCCASIONS
              </p>
              <h2 className="font-serif text-[28px] md:text-[34px] lg:text-[44px] font-normal text-[#143527] leading-[1.14] tracking-tight mb-3 md:mb-4">
                A thoughtful gesture<br /> goes a long way.
              </h2>
              <p className="text-[13px] md:text-[13.5px] lg:text-[14.5px] text-[#556059] font-light leading-relaxed mb-6 md:mb-8 max-w-[440px]">
                Gift-worthy pieces for your people or your team. Start larger orders with a simple brief.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#143527] hover:bg-[#1B4332] text-white text-[12.5px] md:text-[13px] font-medium rounded-[2px] transition-all group self-start shadow-sm"
              >
                <span>Discover gifting</span>
                <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {/* Right Column: Visual Feature Image */}
            <div className="col-span-6">
              <div className="relative w-full aspect-[16/11] sm:aspect-[16/10] rounded-xl lg:rounded-2xl overflow-hidden bg-[#E8E2D6] shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <Image
                  src="/images/corporate-gifting-feature.png"
                  alt="Kraft paper gift box tied with forest green ribbon and ceramic mug on stone table"
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </StorefrontLayout>
  );
}
