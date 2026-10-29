"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Truck,
  ShieldCheck,
  Handshake,
  ArrowRight,
  Heart,
  Star,
  ShoppingCart,
  Check,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Gift,
  Settings,
  Headset,
  Package,
  Lock,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/data/mock-data";

export function ClientMockupHome() {
  const { addToCart, setIsCartOpen } = useCart();
  const [wishlist, setWishlist] = React.useState<Record<string, boolean>>({});
  const [addedProductId, setAddedProductId] = React.useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleAddToCart = (product: any) => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        categoryId: product.categoryId || "cat-1",
        categoryName: product.categoryName || "Handicrafts",
        price: product.price,
        salePrice: product.salePrice,
        stock: product.stock ?? 30,
        sku: product.sku || `SK-${product.slug}`,
        rating: product.rating ?? 4.8,
        reviewCount: product.reviewCount ?? 50,
        imageUrl: product.imageUrl,
        galleryUrls: product.galleryUrls || [product.imageUrl],
        description: product.description || product.name,
        specifications: product.specifications || {},
      },
      1
    );
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
    setIsCartOpen(true);
  };

  // Top 5 Featured Products matching user request
  const featuredProducts = MOCK_PRODUCTS.slice(0, 5);

  // 10 Products for "For You" Section (5 per row, 2 rows)
  const forYouProducts = [
    MOCK_PRODUCTS[0], // Jute Shopping Bag
    MOCK_PRODUCTS[1], // Baby Care Set
    MOCK_PRODUCTS[2], // Organic Honey
    MOCK_PRODUCTS[3], // Men's T-Shirt
    MOCK_PRODUCTS[4], // Organic Fertilizer
    MOCK_PRODUCTS[5], // Cosmetic Set
    MOCK_PRODUCTS[6], // Everyday Jute Basket
    MOCK_PRODUCTS[7], // The Everyday Jute Tote
    MOCK_PRODUCTS[8], // Woven Coaster Set
    MOCK_PRODUCTS[10] || MOCK_PRODUCTS[9], // Terracotta Stem Vase
  ].filter(Boolean);

  // Hero carousel slides data based on user assets
  const heroSlides = React.useMemo(() => [
    {
      id: 1,
      bgImage: "/images/client-mockup/hero-bg-exact.png",
      pill: "Handmade  •  Eco Friendly  •  Local Products",
      titleLine1: "বাংলার ঐতিহ্য,",
      titleLine2: "আপনার প্রয়োজন",
      subtitleLine1: "দেশীয় পণ্য ও আধুনিক সেবার সমন্বয়ে",
      subtitleLine2: "শিল্পকলা এখন আপনার হাতের কাছে!",
      ctaText: "Shop Now",
      ctaLink: "/shop",
      showBadge: true,
    },
    {
      id: 2,
      bgImage: "/images/client-mockup/hero-bg-green.png",
      pill: "100% Natural  •  Pure Living  •  Sustainable",
      titleLine1: "প্রকৃতির সান্নিধ্যে,",
      titleLine2: "বিশুদ্ধ সমাহার",
      subtitleLine1: "পরিবেশবান্ধব ও খাঁটি সামগ্রীর অনন্য কালেকশন",
      subtitleLine2: "আপনার প্রতিদিনের জীবনের সেরা সঙ্গী!",
      ctaText: "Explore More",
      ctaLink: "/shop",
      showBadge: false,
    },
    {
      id: 3,
      bgImage: "/images/client-mockup/hero-bg-peach.png",
      pill: "Artisanal Craft  •  Jute & Clay  •  Heritage",
      titleLine1: "মাটির সুরভী,",
      titleLine2: "ঐতিহ্যের কারুকাজ",
      subtitleLine1: "হাতে বোনা পাটজাত পণ্য ও লোকশিল্পের ভাণ্ডার",
      subtitleLine2: "বাঙালির ঘর সাজুক দেশীয় শিল্পে!",
      ctaText: "View Crafts",
      ctaLink: "/shop",
      showBadge: false,
    },
    {
      id: 4,
      bgImage: "/images/client-mockup/hero-bg-exact.png",
      pill: "Corporate Gifting  •  Custom Orders  •  Special E-Sheba",
      titleLine1: "কর্পোরেট সলিউশন,",
      titleLine2: "বিশেষ ই-সেবা",
      subtitleLine1: "প্রতিষ্ঠানিক উপহার ও কাস্টমাইজড শিল্পজাত সামগ্রী",
      subtitleLine2: "সারাদেশে নিরাপদ ও নির্ভরযোগ্য ডেলিভারি!",
      ctaText: "Order E-Sheba",
      ctaLink: "/e-sheba",
      showBadge: true,
    },
  ], []);

  const nextSlide = React.useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, [heroSlides.length]);

  const prevSlide = React.useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, [heroSlides.length]);

  // Auto-advance carousel every 6 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const activeSlide = heroSlides[currentSlide] || heroSlides[0];

  return (
    <div className="w-full bg-[#F8F9FA] pb-16">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Exact Match to Client Design & Background Image) */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#FAF6EB] border-b border-[#EDE8DC] relative overflow-hidden">
        <div className="relative w-full max-w-[1524px] mx-auto aspect-[1024/302] min-h-[220px] sm:min-h-[270px] md:min-h-[320px] lg:min-h-[380px] xl:min-h-[440px] select-none">
          {/* Panoramic High-Res Hero Background Image */}
          <Image
            src={activeSlide.bgImage}
            alt={`${activeSlide.titleLine1} ${activeSlide.titleLine2} - SHOILPIKKABBO`}
            fill
            priority
            className="object-cover sm:object-fill transition-all duration-700"
            sizes="(max-width: 1524px) 100vw, 1524px"
          />

          {/* Left Content Overlay: Exact typography, badges, icons & CTA */}
          <div className="absolute left-[7.5%] sm:left-[8%] top-0 bottom-0 flex flex-col justify-center max-w-[52%] sm:max-w-[46%] z-10">
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-[#084035] text-white text-[9.5px] sm:text-xs md:text-[13px] font-semibold w-fit tracking-wide shadow-xs mb-1 sm:mb-2 md:mb-2.5">
              <span>Handmade</span>
              <span className="text-white/60">•</span>
              <span>Eco Friendly</span>
              <span className="text-white/60">•</span>
              <span>Local Products</span>
            </div>

            {/* Main Bengali Headline */}
            <h1 className="font-bengali font-bold sm:font-black tracking-tight leading-[1.12]">
              <span className="block text-[#083D33] text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[46px]">
                {activeSlide.titleLine1}
              </span>
              <span className="block text-[#E0592A] text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[46px] mt-0.5 sm:mt-1">
                {activeSlide.titleLine2}
              </span>
            </h1>

            {/* Subtitle Description */}
            <p className="font-bengali font-medium text-[#143D34] text-[10.5px] sm:text-xs md:text-sm lg:text-[15.5px] xl:text-[16.5px] leading-snug mt-1.5 sm:mt-2.5 md:mt-3 max-w-sm sm:max-w-md">
              <span>{activeSlide.subtitleLine1}</span>
              <br />
              <span>{activeSlide.subtitleLine2}</span>
            </p>

            {/* 3 Value Proposition Features */}
            <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6 mt-2 sm:mt-3 md:mt-4 text-[#083D33]">
              <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] md:text-[13px] font-bold">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#083D33] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1 4h3v2H1V4zm0 4h5v2H1V8zm0 4h3v2H1v-2zm17 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm14-5v-4l-3-4H8v10h1.18a3 3 0 0 1 5.64 0h1.36a3 3 0 0 1 5.64 0H23v-2h-1zM9.5 8h4.5v3H9.5V8zm7.5 1l2 2.5h-2V9z"/>
                </svg>
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] md:text-[13px] font-bold">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#083D33] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                </svg>
                <span>Quality Products</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] md:text-[13px] font-bold">
                <Handshake className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#083D33] shrink-0" />
                <span>Reliable Service</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-2.5 sm:mt-3.5 md:mt-4 lg:mt-5">
              <Link
                href={activeSlide.ctaLink}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 md:px-7 py-1.5 sm:py-2.5 md:py-3 rounded-full bg-[#E0592A] hover:bg-[#C8481C] text-white font-bold text-[11px] sm:text-xs md:text-sm lg:text-base shadow-[0_4px_14px_rgba(224,89,42,0.35)] transition-all hover:scale-105 cursor-pointer group"
              >
                <span>{activeSlide.ctaText}</span>
                <span className="text-base transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>

          {/* Top Right "Support Local Products ♡" Stamp */}
          {activeSlide.showBadge && (
            <div className="absolute right-[5%] sm:right-[6%] md:right-[7.5%] top-[7%] sm:top-[9%] md:top-[10%] z-10 pointer-events-none select-none">
              <Image
                src="/images/client-mockup/support-local-badge.png"
                alt="Support Local Products"
                width={115}
                height={125}
                className="w-14 sm:w-18 md:w-22 lg:w-26 xl:w-28 h-auto object-contain"
                priority
              />
            </div>
          )}

          {/* Interactive Carousel Left Arrow */}
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/95 hover:bg-white text-[#0D3B37] shadow-md flex items-center justify-center transition-all hover:scale-110 cursor-pointer z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          {/* Interactive Carousel Right Arrow */}
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/95 hover:bg-white text-[#0D3B37] shadow-md flex items-center justify-center transition-all hover:scale-110 cursor-pointer z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          {/* Interactive Pagination Dots matching client design */}
          <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-20">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentSlide === idx
                    ? idx === 1
                      ? "w-5 sm:w-6 h-2 sm:h-2.5 bg-[#E0592A] ring-1 ring-white/60"
                      : "w-5 sm:w-6 h-2 sm:h-2.5 bg-[#0D3B37] ring-1 ring-white/60"
                    : idx === 1
                    ? "w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#E0592A]/60 hover:bg-[#E0592A]"
                    : "w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Spacing wrapper for downstream sections */}
      <div className="space-y-12 sm:space-y-16 lg:space-y-20 pt-10 sm:pt-14 pb-20">

      {/* ========================================================================= */}
      {/* 2. SHOP BY CATEGORY */}
      {/* ========================================================================= */}
      <section className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-6 sm:pb-7">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0D3B37]/10 flex items-center justify-center text-[#0D3B37]">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0D3B37] tracking-tight">
                Shop by Category
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-500 font-normal mt-0.5">
                Explore our wide range of products and services
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0D3B37] hover:text-[#E0592A] transition-colors group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 6-Column Responsive Grid matching Client Design */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5">
          {/* Category 1: Handicrafts */}
          <Link
            href="/shop?category=handicraft"
            className="bg-white hover:bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 group"
          >
            <div className="relative w-16 h-14 sm:w-20 sm:h-16 mb-2.5 sm:mb-3 flex items-center justify-center">
              <Image
                src="/images/client-mockup/cat-handicrafts.png"
                alt="Handicrafts"
                width={64}
                height={54}
                className="object-contain group-hover:scale-108 transition-transform duration-300"
              />
            </div>
            <span className="text-xs sm:text-[13.5px] font-bold text-gray-800 group-hover:text-[#E0592A] transition-colors leading-tight">
              Handicrafts
            </span>
          </Link>

          {/* Category 2: Jute Items */}
          <Link
            href="/shop?category=jute-items"
            className="bg-white hover:bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 group"
          >
            <div className="relative w-16 h-14 sm:w-20 sm:h-16 mb-2.5 sm:mb-3 flex items-center justify-center">
              <Image
                src="/images/client-mockup/cat-jute.png"
                alt="Jute Items"
                width={64}
                height={54}
                className="object-contain group-hover:scale-108 transition-transform duration-300"
              />
            </div>
            <span className="text-xs sm:text-[13.5px] font-bold text-gray-800 group-hover:text-[#E0592A] transition-colors leading-tight">
              Jute Items
            </span>
          </Link>

          {/* Category 3: Polymer */}
          <Link
            href="/shop?category=polymer"
            className="bg-white hover:bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 group"
          >
            <div className="relative w-16 h-14 sm:w-20 sm:h-16 mb-2.5 sm:mb-3 flex items-center justify-center">
              <Image
                src="/images/client-mockup/cat-polymer.png"
                alt="Polymer"
                width={64}
                height={54}
                className="object-contain group-hover:scale-108 transition-transform duration-300"
              />
            </div>
            <span className="text-xs sm:text-[13.5px] font-bold text-gray-800 group-hover:text-[#E0592A] transition-colors leading-tight">
              Polymer
            </span>
          </Link>

          {/* Category 4: Baby Items */}
          <Link
            href="/shop?category=baby-items"
            className="bg-white hover:bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 group"
          >
            <div className="relative w-16 h-14 sm:w-20 sm:h-16 mb-2.5 sm:mb-3 flex items-center justify-center">
              <Image
                src="/images/client-mockup/cat-baby.png"
                alt="Baby Items"
                width={64}
                height={54}
                className="object-contain group-hover:scale-108 transition-transform duration-300"
              />
            </div>
            <span className="text-xs sm:text-[13.5px] font-bold text-gray-800 group-hover:text-[#E0592A] transition-colors leading-tight">
              Baby Items
            </span>
          </Link>

          {/* Category 5: Corporate Gift Items */}
          <Link
            href="/shop?category=corporate-gift-items"
            className="bg-white hover:bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 group"
          >
            <div className="relative w-16 h-14 sm:w-20 sm:h-16 mb-2.5 sm:mb-3 flex items-center justify-center">
              <Image
                src="/images/client-mockup/cat-corporate.png"
                alt="Corporate Gift Items"
                width={64}
                height={54}
                className="object-contain group-hover:scale-108 transition-transform duration-300"
              />
            </div>
            <span className="text-xs sm:text-[13.5px] font-bold text-gray-800 group-hover:text-[#E0592A] transition-colors leading-tight">
              Corporate Gifts
            </span>
          </Link>

          {/* Category 6: Rudiment Garments */}
          <Link
            href="/shop?category=rudiment-garments"
            className="bg-white hover:bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 group"
          >
            <div className="relative w-16 h-14 sm:w-20 sm:h-16 mb-2.5 sm:mb-3 flex items-center justify-center">
              <Image
                src="/images/client-mockup/cat-garments.png"
                alt="Rudiment Garments"
                width={64}
                height={54}
                className="object-contain group-hover:scale-108 transition-transform duration-300"
              />
            </div>
            <span className="text-xs sm:text-[13.5px] font-bold text-gray-800 group-hover:text-[#E0592A] transition-colors leading-tight">
              Rudiment Garments
            </span>
          </Link>

          {/* Row 2: Category 7 - Industrial Solutions */}
          <Link
            href="/shop?category=industrial-solutions"
            className="bg-white hover:bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 group"
          >
            <div className="relative w-16 h-14 sm:w-20 sm:h-16 mb-2.5 sm:mb-3 flex items-center justify-center">
              <Image
                src="/images/client-mockup/cat-industrial.png"
                alt="Industrial Solutions"
                width={64}
                height={54}
                className="object-contain group-hover:scale-108 transition-transform duration-300"
              />
            </div>
            <span className="text-xs sm:text-[13.5px] font-bold text-gray-800 group-hover:text-[#E0592A] transition-colors leading-tight">
              Industrial Solutions
            </span>
          </Link>

          {/* Category 8: Health & Beauty */}
          <Link
            href="/shop?category=health-and-beauty"
            className="bg-white hover:bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 group"
          >
            <div className="relative w-16 h-14 sm:w-20 sm:h-16 mb-2.5 sm:mb-3 flex items-center justify-center">
              <Image
                src="/images/client-mockup/cat-beauty.png"
                alt="Health & Beauty"
                width={64}
                height={54}
                className="object-contain group-hover:scale-108 transition-transform duration-300"
              />
            </div>
            <span className="text-xs sm:text-[13.5px] font-bold text-gray-800 group-hover:text-[#E0592A] transition-colors leading-tight">
              Health & Beauty
            </span>
          </Link>

          {/* Category 9: Agriculture */}
          <Link
            href="/shop?category=agriculture"
            className="bg-white hover:bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 group"
          >
            <div className="relative w-16 h-14 sm:w-20 sm:h-16 mb-2.5 sm:mb-3 flex items-center justify-center">
              <Image
                src="/images/client-mockup/cat-agriculture.png"
                alt="Agriculture"
                width={64}
                height={54}
                className="object-contain group-hover:scale-108 transition-transform duration-300"
              />
            </div>
            <span className="text-xs sm:text-[13.5px] font-bold text-gray-800 group-hover:text-[#E0592A] transition-colors leading-tight">
              Agriculture
            </span>
          </Link>

          {/* Category 10: Special E-Sheba / Services */}
          <Link
            href="/services"
            className="bg-white hover:bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 group"
          >
            <div className="relative w-16 h-14 sm:w-20 sm:h-16 mb-2.5 sm:mb-3 flex items-center justify-center">
              <Image
                src="/images/client-mockup/cat-services.png"
                alt="Special E-Sheba"
                width={64}
                height={54}
                className="object-contain group-hover:scale-108 transition-transform duration-300"
              />
            </div>
            <span className="text-xs sm:text-[13.5px] font-bold text-gray-800 group-hover:text-[#E0592A] transition-colors leading-tight">
              Special E-Sheba
            </span>
          </Link>

          {/* Quality Products Better Life Banner (Spans 2 columns) */}
          <div className="col-span-2 relative bg-gradient-to-r from-[#0D3B37] to-[#124B46] rounded-2xl p-5 sm:p-6 flex items-center justify-between overflow-hidden shadow-sm">
            <div className="space-y-2.5 z-10">
              <p className="text-white font-extrabold text-base sm:text-lg leading-snug">
                Quality Products
                <br />
                <span className="text-emerald-300 font-bold">Better Life</span>
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E0592A] hover:bg-[#C94B20] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
              >
                <span>Explore Categories</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="relative w-28 h-20 sm:w-32 sm:h-22 shrink-0">
              <Image
                src="/images/client-mockup/cat-promo-banner.png"
                alt="Quality Products Better Life"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FEATURED PRODUCTS (5 Products matching Client Mockup) */}
      {/* ========================================================================= */}
      <section className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-6 sm:pb-7">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Star className="w-5 h-5 fill-emerald-600 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0D3B37] tracking-tight">
                Featured Products
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-500 font-normal mt-0.5">
                Best selling and most popular products
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0D3B37] hover:text-[#E0592A] transition-colors group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 5-Column Grid of Products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5 lg:gap-6">
          {featuredProducts.map((product) => {
            const isWishlisted = !!wishlist[product.id];
            const isAdded = addedProductId === product.id;
            const discountPct =
              product.salePrice && product.salePrice > product.price
                ? Math.round(
                    ((product.salePrice - product.price) / product.salePrice) * 100
                  )
                : 25;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 group relative"
              >
                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-gray-400 hover:text-[#E0592A] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  title="Save to Wishlist"
                  aria-label="Save to Wishlist"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isWishlisted
                        ? "fill-[#E0592A] text-[#E0592A]"
                        : "text-gray-400"
                    }`}
                  />
                </button>

                <div>
                  {/* Product Image */}
                  <Link
                    href={`/products/${product.slug}`}
                    className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#FAF8F5] mb-3 sm:mb-3.5 flex items-center justify-center p-3 group-hover:bg-[#F5F1E9] transition-colors block"
                  >
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-contain p-2 group-hover:scale-106 transition-transform duration-300"
                    />
                  </Link>

                  {/* Details */}
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 font-medium truncate">
                      {product.categoryName}
                    </p>

                    <Link
                      href={`/products/${product.slug}`}
                      className="block font-semibold text-sm sm:text-[15px] text-gray-900 group-hover:text-[#E0592A] transition-colors line-clamp-2 leading-snug"
                      title={product.name}
                    >
                      {product.name}
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1 text-xs text-amber-500 pt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-gray-700">
                        {product.rating ?? 4.8}
                      </span>
                      <span className="text-gray-400">
                        ({product.reviewCount ?? 80})
                      </span>
                    </div>

                    {/* Price & Discount */}
                    <div className="flex items-center gap-2 flex-wrap pt-1.5">
                      <span className="font-extrabold text-base sm:text-lg text-[#0D3B37]">
                        ৳ {product.price}
                      </span>
                      {product.salePrice && (
                        <span className="text-xs sm:text-sm text-gray-400 line-through">
                          ৳ {product.salePrice}
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {discountPct}% OFF
                      </span>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className={`w-full py-2.5 sm:py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-[#0D3B37] hover:bg-[#E0592A] text-white"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PROMOTIONAL 3-COLUMN BANNER SECTION */}
      {/* ========================================================================= */}
      <section className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {/* Card 1: Special Offer UP TO 50% OFF */}
          <div className="relative bg-gradient-to-br from-[#E0592A] to-[#C94B20] rounded-3xl p-7 sm:p-8 text-white flex flex-col justify-between overflow-hidden shadow-md min-h-[250px] group">
            <div className="space-y-1.5 z-10">
              <span className="text-xs sm:text-sm font-bold text-white/90 uppercase tracking-wider">
                Special Offer
              </span>
              <h3 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                UP TO 50% OFF
              </h3>
              <p className="text-sm text-white/90 font-medium">
                On Selected Products
              </p>
            </div>

            <div className="pt-5 z-10">
              <Link
                href="/offers"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#C94B20] hover:bg-[#FAF8F5] font-bold text-xs sm:text-sm rounded-full shadow-md transition-all hover:gap-2.5"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="absolute right-2 bottom-2 w-36 h-32 sm:w-40 sm:h-36 opacity-95 pointer-events-none group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/images/client-mockup/promo-special-offer.png"
                alt="Special Offer"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Card 2: Our Services */}
          <div className="bg-[#FAF8F3] rounded-3xl p-7 sm:p-8 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] min-h-[250px] transition-all duration-300">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0D3B37] tracking-tight">
                Our Services
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 font-normal mt-0.5">
                More than just products
              </p>

              {/* 4 Quick Service Actions in 2x2 grid */}
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/track-order"
                  className="bg-white hover:bg-white rounded-xl p-3 sm:p-3.5 flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-gray-800 transition-all shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-xs group"
                >
                  <Truck className="w-4 h-4 text-[#0D3B37] group-hover:text-[#E0592A] shrink-0 transition-colors" />
                  <span className="truncate">Home Delivery</span>
                </Link>

                <Link
                  href="/shop?category=corporate-gift-items"
                  className="bg-white hover:bg-white rounded-xl p-3 sm:p-3.5 flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-gray-800 transition-all shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-xs group"
                >
                  <Gift className="w-4 h-4 text-[#0D3B37] group-hover:text-[#E0592A] shrink-0 transition-colors" />
                  <span className="truncate">Corporate Gifts</span>
                </Link>

                <Link
                  href="/services"
                  className="bg-white hover:bg-white rounded-xl p-3 sm:p-3.5 flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-gray-800 transition-all shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-xs group"
                >
                  <Settings className="w-4 h-4 text-[#0D3B37] group-hover:text-[#E0592A] shrink-0 transition-colors" />
                  <span className="truncate">Custom Orders</span>
                </Link>

                <Link
                  href="/services"
                  className="bg-white hover:bg-white rounded-xl p-3 sm:p-3.5 flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-gray-800 transition-all shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-xs group"
                >
                  <Headset className="w-4 h-4 text-[#0D3B37] group-hover:text-[#E0592A] shrink-0 transition-colors" />
                  <span className="truncate">Special E-Sheba</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Stay Connected / Get in Touch */}
          <div className="bg-[#FAF8F3] rounded-3xl p-7 sm:p-8 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] min-h-[250px] relative overflow-hidden transition-all duration-300">
            <div className="space-y-2.5 z-10 max-w-[60%]">
              <span className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-wider">
                Stay Connected
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0D3B37] leading-tight">
                Get in Touch
              </h3>

              {/* Chat Buttons */}
              <div className="flex items-center gap-3 pt-2">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/8801731214379"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                  title="Chat on WhatsApp"
                >
                  <span className="text-lg font-bold">✆</span>
                </a>

                {/* Messenger */}
                <a
                  href="https://m.me/shoilpikkabbo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-[#0084FF] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                  title="Chat on Messenger"
                >
                  <span className="text-lg font-bold">💬</span>
                </a>
              </div>

              <p className="text-xs text-gray-500 pt-1">
                Chat with us anytime
              </p>
            </div>

            <div className="relative w-36 h-40 shrink-0 pointer-events-none">
              <Image
                src="/images/client-mockup/promo-get-in-touch.png"
                alt="Get in Touch with Customer Support"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FOR YOU SECTION (5 Products per Row x 2 Rows = 10 Products) */}
      {/* ========================================================================= */}
      <section className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-6 sm:pb-7">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0D3B37] tracking-tight">
                For You
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-500 font-normal mt-0.5">
                Specially handpicked recommendations tailored for you
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0D3B37] hover:text-[#E0592A] transition-colors group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 5-Column Grid with 2 Rows (10 Products total) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5 lg:gap-6">
          {forYouProducts.map((product) => {
            const isWishlisted = !!wishlist[product.id];
            const isAdded = addedProductId === product.id;
            const discountPct =
              product.salePrice && product.salePrice > product.price
                ? Math.round(
                    ((product.salePrice - product.price) / product.salePrice) * 100
                  )
                : 20;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 group relative"
              >
                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-gray-400 hover:text-[#E0592A] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isWishlisted ? "fill-[#E0592A] text-[#E0592A]" : "text-gray-400"
                    }`}
                  />
                </button>

                {/* For You Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="text-[10px] sm:text-[11px] font-bold text-white bg-gradient-to-r from-[#E0592A] to-[#F59E0B] px-2 py-0.5 rounded-md shadow-xs">
                    For You
                  </span>
                </div>

                <div>
                  {/* Product Image */}
                  <Link
                    href={`/products/${product.slug}`}
                    className="block relative w-full aspect-square mb-3 sm:mb-3.5 bg-[#FAF8F5] rounded-xl overflow-hidden p-3 group-hover:bg-[#F5F1E9] transition-colors"
                  >
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-contain p-2 group-hover:scale-106 transition-transform duration-300"
                    />
                  </Link>

                  {/* Category Name */}
                  <p className="text-xs text-gray-500 font-medium truncate mb-1">
                    {product.categoryName}
                  </p>

                  {/* Product Title */}
                  <Link
                    href={`/products/${product.slug}`}
                    className="block font-semibold text-sm sm:text-[15px] text-gray-900 group-hover:text-[#E0592A] transition-colors line-clamp-2 leading-snug mb-1.5"
                    title={product.name}
                  >
                    {product.name}
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-xs text-amber-500 pt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-gray-700">
                      {product.rating ?? 4.8}
                    </span>
                    <span className="text-gray-400">
                      ({product.reviewCount ?? 50})
                    </span>
                  </div>

                  {/* Price & Discount */}
                  <div className="flex items-center gap-2 flex-wrap pt-1.5">
                    <span className="font-extrabold text-base sm:text-lg text-[#0D3B37]">
                      ৳ {product.price}
                    </span>
                    {product.salePrice && (
                      <span className="text-xs sm:text-sm text-gray-400 line-through">
                        ৳ {product.salePrice}
                      </span>
                    )}
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {discountPct}% OFF
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className={`w-full py-2.5 sm:py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-[#0D3B37] hover:bg-[#E0592A] text-white"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. WHY CHOOSE SHOILPIKKABBO (Trust Section) */}
      {/* ========================================================================= */}
      <section className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 lg:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 4 Features (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#0D3B37]">
                  <ShieldCheck className="w-5 h-5 text-[#0D3B37]" />
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Why Choose SHOILPIKKABBO?
                  </h3>
                </div>
                <p className="text-sm sm:text-[15px] text-gray-500 font-normal">
                  Your trust is our biggest asset
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="w-11 h-11 rounded-2xl bg-[#FAF8F3] text-[#0D3B37] flex items-center justify-center mx-auto sm:mx-0 shadow-2xs">
                    <Package className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">
                    Wide Product Range
                  </h4>
                  <p className="text-xs text-gray-500">
                    From local to modern
                  </p>
                </div>

                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="w-11 h-11 rounded-2xl bg-[#FAF8F3] text-[#0D3B37] flex items-center justify-center mx-auto sm:mx-0 shadow-2xs">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">
                    Secure Payment
                  </h4>
                  <p className="text-xs text-gray-500">
                    Safe & trusted transaction
                  </p>
                </div>

                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="w-11 h-11 rounded-2xl bg-[#FAF8F3] text-[#0D3B37] flex items-center justify-center mx-auto sm:mx-0 shadow-2xs">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">
                    Fast Delivery
                  </h4>
                  <p className="text-xs text-gray-500">
                    On time, every time
                  </p>
                </div>

                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="w-11 h-11 rounded-2xl bg-[#FAF8F3] text-[#0D3B37] flex items-center justify-center mx-auto sm:mx-0 shadow-2xs">
                    <Headset className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">
                    Customer Support
                  </h4>
                  <p className="text-xs text-gray-500">
                    Always here for you
                  </p>
                </div>
              </div>
            </div>

            {/* Right Brand Mission Banner (5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-r from-[#0D3B37] to-[#124B46] rounded-2xl p-6 sm:p-7 text-white flex items-center justify-between gap-5 shadow-sm relative overflow-hidden">
              <div className="space-y-2.5 z-10 max-w-[65%]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 12C8 10.8954 8.89543 10 10 10H30C31.1046 10 32 10.8954 32 12L34 33C34 34.6569 32.6569 36 31 36H9C7.34315 36 6 34.6569 6 33L8 12Z" fill="#186A62" />
                      <path d="M14 12V9C14 6.79086 15.7909 5 18 5H22C24.2091 5 26 6.79086 26 9V12" stroke="#186A62" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M14 27C14 20 22 17 26 15C26 21 21 27 15 28" fill="#22C55E" />
                      <path d="M12 29C14 24 19 22 23 23C20 26 16 30 12 29Z" fill="#E0592A" />
                    </svg>
                  </div>
                  <span className="font-extrabold text-xs tracking-wider uppercase text-emerald-300">
                    SHOILPIKKABBO
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-light">
                  &ldquo;We are committed to delivering high-quality products
                  and services with trust, care and reliability to make your
                  life easier.&rdquo;
                </p>
              </div>

              <div className="relative w-28 h-24 sm:w-32 sm:h-28 shrink-0">
                <Image
                  src="/images/client-mockup/trust-mission-banner.png"
                  alt="Commitment and Trust"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
