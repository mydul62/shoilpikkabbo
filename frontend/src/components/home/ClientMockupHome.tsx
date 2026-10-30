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
  ChevronDown,
  Loader2,
  LayoutGrid,
  Gift,
  Settings,
  Headset,
  Package,
  Lock,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";
import { useWishlist } from "@/context/WishlistContext";
import { productsApi, categoriesApi, bannersApi, pagesApi } from "@/lib/api";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/data/mock-data";

// Fallback icon map for the 10 core categories
const CATEGORY_ICON_MAP: Record<string, string> = {
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

function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center shadow-[0_2px_10px_rgba(0,0,0,0.03)] animate-pulse">
      <div className="w-16 h-14 sm:w-20 sm:h-16 mb-2.5 sm:mb-3 bg-gray-100/90 rounded-2xl" />
      <div className="h-3.5 w-20 bg-gray-200 rounded-md" />
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] animate-pulse min-h-[320px]">
      <div>
        <div className="w-full aspect-square rounded-xl bg-gray-100/90 mb-3" />
        <div className="h-2.5 w-16 bg-gray-100 rounded mb-2" />
        <div className="h-4 w-4/5 bg-gray-200 rounded mb-1.5" />
        <div className="h-3 w-1/3 bg-gray-100 rounded mb-3" />
        <div className="h-4 w-20 bg-gray-200 rounded mt-2" />
      </div>
      <div className="pt-4 mt-3 border-t border-gray-100">
        <div className="h-10 w-full bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

export function ClientMockupHome() {
  const { addToCart, setIsCartOpen } = useCart();
  const { settings } = useSettings();

  const [liveProducts, setLiveProducts] = React.useState<any[]>([]);
  const [liveCategories, setLiveCategories] = React.useState<any[]>([]);
  const [liveBanners, setLiveBanners] = React.useState<any[]>([]);
  const [categoryPromoBg, setCategoryPromoBg] = React.useState<string>(
    "/images/client-mockup/quality-products-bg.png"
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [addedProductId, setAddedProductId] = React.useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);

  // Fetch live products, categories, banners, and published CMS sections from PostgreSQL
  React.useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const [prodRes, catRes, banRes, pageRes] = await Promise.all([
          productsApi.getAll({ limit: 100 }).catch(() => null),
          categoriesApi.getAll().catch(() => null),
          bannersApi.getAll(true).catch(() => null),
          pagesApi.getPublished("home").catch(() => null),
        ]);

        if (!mounted) return;

        if (prodRes && prodRes.success && Array.isArray(prodRes.data) && prodRes.data.length > 0) {
          setLiveProducts(prodRes.data);
        }
        if (catRes && catRes.success && Array.isArray(catRes.data) && catRes.data.length > 0) {
          setLiveCategories(catRes.data);
        }
        if (banRes && banRes.success && Array.isArray(banRes.data) && banRes.data.length > 0) {
          setLiveBanners(banRes.data);
        }
        if (pageRes && pageRes.success && Array.isArray((pageRes.data as any)?.sections)) {
          const catSec = (pageRes.data as any).sections.find((s: any) => s.type === "categories_grid");
          if (catSec?.props?.promoBgImage) {
            setCategoryPromoBg(catSec.props.promoBgImage);
          }
        }
      } catch (err) {
        console.error("Error loading live storefront data:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  // Helper getters
  const getProductImage = (product: any): string => {
    if (product.images && product.images.length > 0 && product.images[0]?.url) {
      return product.images[0].url;
    }
    if (product.imageUrl) return product.imageUrl;
    return "/images/client-mockup/cat-handicrafts.png";
  };

  const getProductCategoryName = (product: any): string => {
    if (product.category && product.category.name) return product.category.name;
    if (product.categoryName) return product.categoryName;
    return "Handicrafts";
  };

  const getProductDiscount = (product: any): number => {
    const price = Number(product.price);
    const salePrice = product.salePrice ? Number(product.salePrice) : null;
    if (salePrice && salePrice > price) {
      return Math.round(((salePrice - price) / salePrice) * 100);
    }
    return 20;
  };

  const handleAddToCart = (product: any) => {
    const price = Number(product.price);
    const salePrice = product.salePrice ? Number(product.salePrice) : undefined;
    const imageUrl = getProductImage(product);
    const categoryName = getProductCategoryName(product);

    addToCart(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        categoryId: product.categoryId || product.category?.id || "cat-1",
        categoryName,
        price,
        salePrice,
        stock: product.stock ?? 30,
        sku: product.sku || `SK-${product.slug}`,
        rating: product.rating ?? 4.8,
        reviewCount: product.reviewCount ?? 50,
        imageUrl,
        galleryUrls: product.images?.map((img: any) => img.url) || [imageUrl],
        description: product.description || product.name,
        specifications: product.specifications || {},
      },
      1
    );
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  // 1. Featured Products: top 5 products from PostgreSQL database
  const featuredProducts = React.useMemo(() => {
    return liveProducts.slice(0, 5);
  }, [liveProducts]);

  // 2. "For You" Section: uses real database products (no artificial 40 dummy loop)
  const allForYouProducts = React.useMemo(() => {
    return liveProducts;
  }, [liveProducts]);

  // Show 2 rows initially (5 products per row = 10 products)
  const [forYouVisibleCount, setForYouVisibleCount] = React.useState(10);
  const [isLoadingMoreForYou, setIsLoadingMoreForYou] = React.useState(false);

  // Load 2 more rows (10 products) per click up to the total database count
  const handleLoadMoreForYou = () => {
    setIsLoadingMoreForYou(true);
    setTimeout(() => {
      setForYouVisibleCount((prev) => Math.min(prev + 10, allForYouProducts.length));
      setIsLoadingMoreForYou(false);
    }, 400);
  };

  const displayedForYouProducts = React.useMemo(() => {
    return allForYouProducts.slice(0, forYouVisibleCount);
  }, [allForYouProducts, forYouVisibleCount]);

  // 3. Categories: Live from database (capped at exactly 10 to keep the 6-col + 2-col promo banner layout intact)
  const categories = React.useMemo(() => {
    return (liveCategories || []).slice(0, 10);
  }, [liveCategories]);

  // 4. Hero carousel slides: Dynamic from database with high-res presets
  const defaultHeroSlides = React.useMemo(
    () => [
      {
        id: "slide-1",
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
        id: "slide-2",
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
        id: "slide-3",
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
        id: "slide-4",
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
    ],
    []
  );

  const heroSlides = React.useMemo(() => {
    if (liveBanners.length > 0) {
      return liveBanners.map((b: any, idx: number) => {
        const titleParts = b.title.includes(",")
          ? b.title.split(",")
          : [b.title, ""];

        return {
          id: b.id || `banner-${idx}`,
          bgImage:
            b.imageUrl ||
            defaultHeroSlides[idx % defaultHeroSlides.length].bgImage,
          pill:
            idx % 2 === 0
              ? "Handmade  •  Eco Friendly  •  Local Products"
              : "100% Authentic  •  Quality Assured",
          titleLine1: titleParts[0]?.trim() || b.title,
          titleLine2: titleParts[1]?.trim() || "",
          subtitleLine1:
            b.subtitle ||
            defaultHeroSlides[idx % defaultHeroSlides.length].subtitleLine1,
          subtitleLine2:
            defaultHeroSlides[idx % defaultHeroSlides.length].subtitleLine2,
          ctaText: "Shop Now",
          ctaLink: b.linkUrl || "/shop",
          showBadge: idx === 0 || idx === 3,
        };
      });
    }
    return defaultHeroSlides;
  }, [liveBanners, defaultHeroSlides]);

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

  const [touchStartX, setTouchStartX] = React.useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
    setTouchStartX(null);
  };

  const activeSlide = heroSlides[currentSlide] || heroSlides[0];

  return (
    <div className="w-full bg-[#F8F9FA] pb-16">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Exact Match to Client Design & High-Res Background Image) */}
      {/* ========================================================================= */}
      <section
        className="w-full bg-[#FAF6EB] border-b border-[#EDE8DC] relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full max-w-[1524px] mx-auto aspect-[16/10] xs:aspect-[16/9] sm:aspect-[1024/302] min-h-[250px] sm:min-h-[280px] md:min-h-[340px] lg:min-h-[380px] xl:min-h-[440px] select-none">
          {/* Panoramic High-Res Hero Background Image */}
          <Image
            src={activeSlide.bgImage}
            alt={`${activeSlide.titleLine1} ${activeSlide.titleLine2} - SHOILPIKKABBO`}
            fill
            priority
            className="object-cover object-right sm:object-fill transition-all duration-700"
            sizes="(max-width: 1524px) 100vw, 1524px"
          />

          {/* Subtle Mobile Gradient to ensure high-contrast readability without hiding artwork */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6EB]/95 via-[#FAF6EB]/80 to-transparent sm:from-transparent sm:via-transparent sm:to-transparent z-1 pointer-events-none" />

          {/* Left Content Overlay: Exact typography, badges, icons & CTA */}
          <div className="absolute left-4 sm:left-[8%] top-0 bottom-0 flex flex-col justify-center max-w-[72%] sm:max-w-[46%] z-10 py-3 sm:py-0">
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-0.5 sm:py-1 rounded-full bg-[#084035] text-white text-[9px] sm:text-xs md:text-[13px] font-semibold w-fit tracking-wide shadow-xs mb-1 sm:mb-2 md:mb-2.5">
              <span>Handmade</span>
              <span className="text-white/60">•</span>
              <span>Eco Friendly</span>
              <span className="hidden xs:inline text-white/60">•</span>
              <span className="hidden xs:inline">Local Products</span>
            </div>

            {/* Main Bengali Headline */}
            <h1 className="font-bengali font-bold sm:font-black tracking-tight leading-[1.12]">
              <span className="block text-[#083D33] text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-[46px]">
                {activeSlide.titleLine1}
              </span>
              <span className="block text-[#E0592A] text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-[46px] mt-0.5 sm:mt-1">
                {activeSlide.titleLine2}
              </span>
            </h1>

            {/* Subtitle Description */}
            <p className="font-bengali font-medium text-[#143D34] text-[10.5px] sm:text-xs md:text-sm lg:text-[15.5px] xl:text-[16.5px] leading-snug mt-1 sm:mt-2.5 md:mt-3 max-w-sm sm:max-w-md line-clamp-2 sm:line-clamp-none">
              <span>{activeSlide.subtitleLine1}</span>
              {activeSlide.subtitleLine2 && (
                <>
                  <br className="hidden sm:inline" />
                  <span className="hidden sm:inline"> {activeSlide.subtitleLine2}</span>
                </>
              )}
            </p>

            {/* Value Proposition Features: Clean compact line on mobile, full 3 items on sm+ */}
            <div className="hidden sm:flex items-center gap-2.5 sm:gap-4 md:gap-6 mt-2 sm:mt-3 md:mt-4 text-[#083D33]">
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

            <div className="sm:hidden flex items-center gap-1.5 mt-1.5 text-[10px] text-[#083D33] font-semibold">
              <span className="text-emerald-700">✓</span>
              <span>দ্রুত ডেলিভারি • প্রিমিয়াম মান</span>
            </div>

            {/* CTA Button */}
            <div className="mt-2.5 sm:mt-3.5 md:mt-4 lg:mt-5">
              <Link
                href={activeSlide.ctaLink}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 md:px-7 py-1.5 sm:py-2.5 md:py-3 rounded-full bg-[#E0592A] hover:bg-[#C8481C] text-white font-bold text-[11px] sm:text-xs md:text-sm lg:text-base shadow-[0_4px_14px_rgba(224,89,42,0.35)] transition-all hover:scale-105 cursor-pointer group"
              >
                <span>{activeSlide.ctaText}</span>
                <span className="text-xs sm:text-base transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>

          {/* Top Right "Support Local Products ♡" Stamp */}
          {activeSlide.showBadge && (
            <div className="absolute right-[3%] sm:right-[6%] md:right-[7.5%] top-[5%] sm:top-[9%] md:top-[10%] z-10 pointer-events-none select-none">
              <Image
                src="/images/client-mockup/support-local-badge.png"
                alt="Support Local Products"
                width={115}
                height={125}
                className="w-10 sm:w-18 md:w-22 lg:w-26 xl:w-28 h-auto object-contain drop-shadow-xs"
                priority
              />
            </div>
          )}

          {/* Interactive Carousel Left Arrow (Hidden on mobile to avoid overlapping text, visible on sm+) */}
          <button
            type="button"
            onClick={prevSlide}
            className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/95 hover:bg-white text-[#0D3B37] shadow-md items-center justify-center transition-all hover:scale-110 cursor-pointer z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          {/* Interactive Carousel Right Arrow (Hidden on mobile to avoid overlapping text, visible on sm+) */}
          <button
            type="button"
            onClick={nextSlide}
            className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/95 hover:bg-white text-[#0D3B37] shadow-md items-center justify-center transition-all hover:scale-110 cursor-pointer z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          {/* Interactive Pagination Dots */}
          <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-20">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentSlide === idx
                    ? idx === 1
                      ? "w-4 sm:w-6 h-1.5 sm:h-2.5 bg-[#E0592A] ring-1 ring-white/60"
                      : "w-4 sm:w-6 h-1.5 sm:h-2.5 bg-[#0D3B37] ring-1 ring-white/60"
                    : idx === 1
                    ? "w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 bg-[#E0592A]/60 hover:bg-[#E0592A]"
                    : "w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 bg-gray-300 hover:bg-gray-400"
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
      {/* 2. SHOP BY CATEGORY (Live from PostgreSQL) */}
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
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0D3B37] hover:text-[#E0592A] transition-colors group shrink-0"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 6-Column Responsive Grid matching Client Design */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <CategoryCardSkeleton key={i} />)
          ) : (
            categories.slice(0, 10).map((category) => {
              const iconSrc =
                CATEGORY_ICON_MAP[category.slug] ||
                (category.imageUrl?.startsWith("http") || category.imageUrl?.startsWith("/")
                  ? category.imageUrl
                  : "/images/client-mockup/cat-handicrafts.png");
              const href =
                category.slug === "e-sheba" ? "/services" : `/shop?category=${category.slug}`;

              return (
                <Link
                  key={category.id || category.slug}
                  href={href}
                  className="bg-white hover:bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 group"
                >
                  <div className="relative w-16 h-14 sm:w-20 sm:h-16 mb-2.5 sm:mb-3 flex items-center justify-center">
                    <Image
                      src={iconSrc}
                      alt={category.name}
                      width={64}
                      height={54}
                      className="object-contain group-hover:scale-108 transition-transform duration-300 max-h-14 sm:max-h-16"
                    />
                  </div>
                  <span className="text-xs sm:text-[13.5px] font-bold text-gray-800 group-hover:text-[#E0592A] transition-colors leading-tight">
                    {category.name}
                  </span>
                </Link>
              );
            })
          )}

          {/* Quality Products Better Life Banner (Spans 2 columns matching client design) */}
          <div className="col-span-2 relative rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] transition-all duration-300 min-h-[145px] sm:min-h-[155px] md:min-h-[165px] flex items-center group">
            {/* High-Res Background Image with Nature Vegetables Basket & Curved Arc */}
            <Image
              src={categoryPromoBg}
              alt="Quality Products Better Life - SHOILPIKKABBO"
              fill
              priority
              className="object-cover object-right sm:object-fill transition-transform duration-500 group-hover:scale-102"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 480px"
            />

            {/* Left Content Overlay: Quality Products Better Life + Explore Categories CTA */}
            <div className="relative z-10 pl-5 sm:pl-6 md:pl-7 pr-4 py-4 max-w-[58%] sm:max-w-[55%] flex flex-col justify-center space-y-2.5 sm:space-y-3.5">
              <h3 className="text-white font-extrabold text-base sm:text-lg md:text-xl lg:text-[22px] leading-tight tracking-tight drop-shadow-xs">
                Quality Products
                <br />
                Better Life
              </h3>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#E0592A] hover:bg-[#C8481C] text-white text-xs sm:text-[13px] font-bold rounded-full transition-all duration-200 shadow-sm hover:scale-105 cursor-pointer w-fit group/btn"
              >
                <span>Explore Categories</span>
                <span className="text-sm transition-transform duration-200 group-hover/btn:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FEATURED PRODUCTS (Live from PostgreSQL Database) */}
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
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0D3B37] hover:text-[#E0592A] transition-colors group shrink-0"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 5-Column Grid of Products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5 lg:gap-6">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <ProductCardSkeleton key={i} />)
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product) => {
              const isWishlisted = isInWishlist(product.id);
              const isAdded = addedProductId === product.id;
              const discountPct = getProductDiscount(product);
              const imageSrc = getProductImage(product);
              const categoryName = getProductCategoryName(product);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 group relative"
                >
                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() =>
                    toggleWishlist({
                      id: product.id,
                      name: product.name,
                      slug: product.slug || product.id,
                      categoryName,
                      price: Number(product.price) || 0,
                      salePrice: product.salePrice ? Number(product.salePrice) : undefined,
                      imageUrl: imageSrc,
                      stock: product.stock,
                      rating: product.rating,
                      reviewCount: product.reviewCount,
                    })
                  }
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-gray-400 hover:text-[#E0592A] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
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
                      src={imageSrc}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-contain p-2 group-hover:scale-106 transition-transform duration-300"
                    />
                  </Link>

                  {/* Details */}
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 font-medium truncate">
                      {categoryName}
                    </p>

                    <Link
                      href={`/products/${product.slug}`}
                      className="block font-semibold text-sm sm:text-[15px] text-gray-900 group-hover:text-[#E0592A] transition-colors line-clamp-2 leading-snug h-10 overflow-hidden"
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
                        ({product.reviewCount ?? 45})
                      </span>
                    </div>

                    {/* Price & Discount */}
                    <div className="flex items-center gap-2 flex-wrap pt-1.5">
                      <span className="font-extrabold text-base sm:text-lg text-[#0D3B37]">
                        ৳ {Number(product.price)}
                      </span>
                      {product.salePrice && (
                        <span className="text-xs sm:text-sm text-gray-400 line-through">
                          ৳ {Number(product.salePrice)}
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {discountPct}% OFF
                      </span>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button (Transparent outline initially, solid on hover) */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className={`w-full py-2.5 sm:py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                      isAdded
                        ? "bg-emerald-600 text-white border border-emerald-600 shadow-sm"
                        : "bg-transparent text-[#0D3B37] border border-[#0D3B37]/35 hover:bg-[#0D3B37] hover:text-white hover:border-[#0D3B37] hover:shadow-md active:scale-98"
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
          })
        ) : (
          <div className="col-span-full py-12 text-center text-sm text-gray-400">
            No featured products found.
          </div>
        )}
      </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PROMOTIONAL 3-COLUMN BANNER SECTION */}
      {/* ========================================================================= */}
      <section className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {/* Card 1: Special Offer UP TO 50% OFF (Exact Client Mockup & High-Res BG Asset) */}
          <div className="relative bg-[#0B4632] rounded-3xl p-6 sm:p-7 lg:p-8 text-white flex flex-col justify-between overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] min-h-[260px] sm:min-h-[280px] group transition-all duration-300">
            {/* Background: User's high-res asset with basket, green texture and top-left orange swoosh */}
            <Image
              src="/images/client-mockup/special-offer-banner-bg.png"
              alt="Special Offer Up To 50% Off"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-right group-hover:scale-103 transition-transform duration-500"
            />

            {/* Left side text overlay matching client mockup */}
            <div className="relative z-10 max-w-[62%] sm:max-w-[60%] flex flex-col justify-between h-full">
              <div className="space-y-1 sm:space-y-1.5">
                <span className="text-sm sm:text-base lg:text-lg font-bold text-white tracking-wide block drop-shadow-xs">
                  Special Offer
                </span>
                <h3 className="text-2xl sm:text-[28px] lg:text-[32px] xl:text-[34px] font-black text-white leading-tight tracking-tight drop-shadow-xs">
                  UP TO{" "}
                  <span className="text-[#F59F05]">50%</span>{" "}
                  OFF
                </h3>
                <p className="text-xs sm:text-sm lg:text-[15px] font-medium text-white/95 leading-snug drop-shadow-xs">
                  On Selected Products
                </p>
              </div>

              {/* Shop Now CTA Pill Button */}
              <div className="pt-4 sm:pt-5">
                <Link
                  href="/offers"
                  className="inline-flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-[#F26922] hover:bg-[#E0592A] active:scale-97 text-white font-bold text-xs sm:text-sm transition-all duration-300 shadow-[0_4px_14px_rgba(242,105,34,0.35)] hover:shadow-[0_6px_20px_rgba(242,105,34,0.45)] group/btn w-fit cursor-pointer"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
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

          {/* Card 3: Stay Connected / Get in Touch (Exact Design Matching Client Mockup) */}
          <div className="rounded-3xl p-6 sm:p-7 flex items-center justify-end shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] min-h-[250px] relative overflow-hidden group transition-all duration-300">
            {/* Background Image: Support lady on left, soft nature bokeh on right */}
            <Image
              src="/images/client-mockup/stay-connected-bg.png"
              alt="Customer Support - Stay Connected"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-left group-hover:scale-103 transition-transform duration-500"
            />

            {/* Right-aligned text & button overlay matching user's exact mockup */}
            <div className="relative z-10 flex flex-col items-start pl-2 sm:pl-4 max-w-[56%] sm:max-w-[54%] space-y-1">
              <span className="text-xs sm:text-[13px] font-bold text-[#0D3B37] tracking-tight">
                Stay Connected
              </span>
              <h3 className="text-2xl sm:text-[26px] lg:text-[28px] font-black text-[#0D3B37] leading-tight tracking-tight">
                Get in Touch
              </h3>

              {/* Chat Buttons: WhatsApp & Messenger */}
              <div className="flex items-center gap-3 pt-2 pb-1">
                {/* WhatsApp */}
                <a
                  href={settings.socialWhatsapp || "https://wa.me/8801731214379"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-white shadow-[0_3px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_16px_rgba(37,211,102,0.3)] flex items-center justify-center hover:scale-108 active:scale-95 transition-all duration-200 cursor-pointer"
                  title="Chat on WhatsApp"
                >
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 32 32" fill="none">
                    <path
                      d="M16 2C8.268 2 2 8.268 2 16c0 2.652.736 5.132 2.012 7.264L2.2 29.8l6.732-1.764A13.91 13.91 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2z"
                      fill="#25D366"
                    />
                    <path
                      d="M23.1 19.924c-.392-.196-2.316-1.144-2.676-1.272-.36-.132-.62-.196-.88.196-.26.392-1.008 1.272-1.236 1.532-.228.26-.456.292-.848.096-.392-.196-1.656-.612-3.156-1.948-1.168-1.04-1.956-2.328-2.184-2.72-.228-.392-.024-.604.172-.8.176-.176.392-.456.588-.684.196-.228.26-.392.392-.652.132-.26.064-.488-.032-.684-.096-.196-.88-2.12-1.208-2.9-.32-.76-.644-.656-.88-.668-.228-.012-.488-.012-.748-.012-.26 0-.684.096-1.04.488-.36.392-1.376 1.344-1.376 3.28 0 1.936 1.408 3.808 1.604 4.068.196.26 2.772 4.232 6.716 5.932.936.404 1.668.644 2.24.828.94.3 1.796.256 2.472.156.756-.112 2.316-.948 2.64-1.864.328-.916.328-1.7.232-1.864-.096-.164-.356-.26-.748-.456z"
                      fill="#ffffff"
                    />
                  </svg>
                </a>

                {/* Messenger */}
                <a
                  href={settings.socialMessenger || "https://m.me/shoilpikkabbo"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-white shadow-[0_3px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_16px_rgba(0,132,255,0.3)] flex items-center justify-center hover:scale-108 active:scale-95 transition-all duration-200 cursor-pointer"
                  title="Chat on Messenger"
                >
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 36 36" fill="none">
                    <defs>
                      <linearGradient id="cardMessengerGradHome" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00B2FF" />
                        <stop offset="50%" stopColor="#006AFF" />
                        <stop offset="100%" stopColor="#8000FF" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M18 2C9.163 2 2 8.716 2 17c0 4.72 2.348 8.92 6.02 11.668-.192 1.492-.76 3.844-2.42 5.568 2.648-.124 5.372-1.4 6.944-2.384.816.22 1.672.34 2.556.34 8.837 0 16-6.716 16-15S26.837 2 18 2z"
                      fill="url(#cardMessengerGradHome)"
                    />
                    <path
                      d="M9.5 20.75l5.25-8.25 4 4 6-4-5.25 8.25-4-4-6 4z"
                      fill="#ffffff"
                    />
                  </svg>
                </a>
              </div>

              <p className="text-xs sm:text-[13px] font-semibold text-[#0D3B37] tracking-tight">
                Chat with us anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FOR YOU SECTION (Live from PostgreSQL - Matches Real Database Count) */}
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
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0D3B37] hover:text-[#E0592A] transition-colors group shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 5-Column Grid (Loads 2 rows / 10 products per batch from PostgreSQL) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5 lg:gap-6">
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} />)
          ) : displayedForYouProducts.length > 0 ? (
            displayedForYouProducts.map((product) => {
              const isWishlisted = isInWishlist(product.id);
              const isAdded = addedProductId === product.id;
              const discountPct = getProductDiscount(product);
              const imageSrc = getProductImage(product);
              const categoryName = getProductCategoryName(product);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 group relative"
                >
                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() =>
                    toggleWishlist({
                      id: product.id,
                      name: product.name,
                      slug: product.slug || product.id,
                      categoryName,
                      price: Number(product.price) || 0,
                      salePrice: product.salePrice ? Number(product.salePrice) : undefined,
                      imageUrl: imageSrc,
                      stock: product.stock,
                      rating: product.rating,
                      reviewCount: product.reviewCount,
                    })
                  }
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
                      src={imageSrc}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-contain p-2 group-hover:scale-106 transition-transform duration-300"
                    />
                  </Link>

                  {/* Category Name */}
                  <p className="text-xs text-gray-500 font-medium truncate mb-1">
                    {categoryName}
                  </p>

                  {/* Product Title */}
                  <Link
                    href={`/products/${product.slug}`}
                    className="block font-semibold text-sm sm:text-[15px] text-gray-900 group-hover:text-[#E0592A] transition-colors line-clamp-2 leading-snug h-10 overflow-hidden mb-1.5"
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
                      ৳ {Number(product.price)}
                    </span>
                    {product.salePrice && (
                      <span className="text-xs sm:text-sm text-gray-400 line-through">
                        ৳ {Number(product.salePrice)}
                      </span>
                    )}
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {discountPct}% OFF
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button (Transparent outline initially, solid on hover) */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className={`w-full py-2.5 sm:py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                      isAdded
                        ? "bg-emerald-600 text-white border border-emerald-600 shadow-sm"
                        : "bg-transparent text-[#0D3B37] border border-[#0D3B37]/35 hover:bg-[#0D3B37] hover:text-white hover:border-[#0D3B37] hover:shadow-md active:scale-98"
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
          })
        ) : (
          <div className="col-span-full py-12 text-center text-sm text-gray-400">
            No products found.
          </div>
        )}
      </div>

        {/* Load More Button Area (Loads batches of products from real database pool) */}
        <div className="mt-10 sm:mt-12 flex flex-col items-center justify-center text-center">
          <p className="text-xs sm:text-sm text-gray-500 mb-3.5 font-medium">
            Showing <span className="font-bold text-[#0D3B37]">{displayedForYouProducts.length}</span> of{" "}
            <span className="font-bold text-[#0D3B37]">{allForYouProducts.length}</span> recommendations
          </p>

          {displayedForYouProducts.length < allForYouProducts.length ? (
            <button
              type="button"
              onClick={handleLoadMoreForYou}
              disabled={isLoadingMoreForYou}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:px-10 sm:py-4 rounded-full bg-[#0D3B37] hover:bg-[#E0592A] text-white font-bold text-sm sm:text-base transition-all duration-300 shadow-[0_4px_16px_rgba(13,59,55,0.18)] hover:shadow-[0_8px_24px_rgba(224,89,42,0.28)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-75 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isLoadingMoreForYou ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>আরও পণ্য লোড হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>Load More Products</span>
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </>
              )}
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-sm font-semibold shadow-xs">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>সব রিকমেন্ডেশন দেখানো হয়েছে (All Products Loaded)</span>
            </div>
          )}
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

            {/* Right Brand Mission Banner (5 Cols - Exact Client Mockup with High-Res BG Asset) */}
            <div className="lg:col-span-5 relative bg-[#07382E] rounded-2xl sm:rounded-3xl p-6 sm:p-7 text-white flex flex-col justify-center min-h-[200px] sm:min-h-[220px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 group">
              {/* High-res background image with hands holding seedling */}
              <Image
                src="/images/client-mockup/trust-mission-banner-bg.png"
                alt="Shoilpikkabbo - Delivery, Quality, Reliability"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-right group-hover:scale-103 transition-transform duration-500"
              />

              {/* Text & Brand Content */}
              <div className="relative z-10 max-w-[65%] sm:max-w-[62%] space-y-2.5">
                {/* Brand Header: Logo Icon + SHOILPIKKABBO + Tagline */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 bg-white/10 rounded-xl p-1 flex items-center justify-center">
                    {settings.logoUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={settings.logoUrl}
                        alt={settings.storeName}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Image
                        src="/images/client-mockup/trust-brand-icon.png"
                        alt={settings.storeName}
                        fill
                        className="object-contain"
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base lg:text-[17px] text-white tracking-wide leading-tight drop-shadow-xs">
                      {settings.storeName}
                    </h4>
                    <p className="text-[9.5px] sm:text-[10px] font-semibold text-emerald-100/90 tracking-widest uppercase mt-0.5 drop-shadow-xs">
                      {settings.tagline}
                    </p>
                  </div>
                </div>

                {/* Mission / Commitment Statement */}
                <p className="text-xs sm:text-[13px] lg:text-[13.5px] text-white/95 leading-relaxed font-normal drop-shadow-xs">
                  We are committed to delivering high-quality products and services
                  with trust, care and reliability to make your life easier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
