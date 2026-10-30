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
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Gift,
  Settings,
  Headset,
  Package,
  Lock,
  Sparkles,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  HeartHandshake,
  Loader2,
} from "lucide-react";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/data/mock-data";

export interface HomeSectionData {
  id: string;
  name?: string;
  type: string;
  isVisible: boolean;
  props: Record<string, any>;
}

interface HomeSectionsRendererProps {
  sections: HomeSectionData[];
  isEditorMode?: boolean;
  selectedSectionId?: string | null;
  onSelectSection?: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  onDelete?: (id: string) => void;
  onQuickAdd?: (product: any) => void;
  addedProductId?: string | null;
  liveProducts?: any[];
  liveCategories?: any[];
}

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

export function HomeSectionsRenderer({
  sections,
  isEditorMode = false,
  selectedSectionId,
  onSelectSection,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onToggleVisibility,
  onDelete,
  onQuickAdd,
  addedProductId,
  liveProducts = [],
  liveCategories = [],
}: HomeSectionsRendererProps) {
  const [hoveredSectionId, setHoveredSectionId] = React.useState<string | null>(null);
  const [wishlist, setWishlist] = React.useState<Record<string, boolean>>({});
  const [forYouVisibleCount, setForYouVisibleCount] = React.useState<number>(10);
  const [isLoadingMoreForYou, setIsLoadingMoreForYou] = React.useState<boolean>(false);
  const [heroSlideIndex, setHeroSlideIndex] = React.useState<number>(0);

  // Fallback products and categories
  const products = liveProducts.length > 0 ? liveProducts : MOCK_PRODUCTS;
  const categories = liveCategories.length > 0 ? liveCategories : MOCK_CATEGORIES;

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

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

  // Editor floating action bar overlay
  const renderEditorControls = (section: HomeSectionData, index: number) => {
    if (!isEditorMode) return null;
    const isSelected = selectedSectionId === section.id;
    const isHovered = hoveredSectionId === section.id;

    if (!isSelected && !isHovered) return null;

    return (
      <div
        className="absolute top-3 left-3 z-30 flex items-center gap-1.5 bg-[#0D3B37]/95 text-white backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xl text-xs font-medium border border-amber-500/40"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-bold text-[#F59E0B] mr-1.5 flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{section.name || section.type}</span>
        </span>
        <button
          onClick={() => onMoveUp && onMoveUp(section.id)}
          disabled={index === 0}
          className="p-1 hover:bg-white/20 rounded disabled:opacity-20 cursor-pointer transition-colors"
          title="Move up"
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onMoveDown && onMoveDown(section.id)}
          disabled={index === sections.length - 1}
          className="p-1 hover:bg-white/20 rounded disabled:opacity-20 cursor-pointer transition-colors"
          title="Move down"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onDuplicate && onDuplicate(section.id)}
          className="p-1 hover:bg-white/20 rounded cursor-pointer transition-colors"
          title="Duplicate section"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onToggleVisibility && onToggleVisibility(section.id)}
          className="p-1 hover:bg-white/20 rounded cursor-pointer transition-colors"
          title={section.isVisible ? "Hide on website" : "Show on website"}
        >
          {section.isVisible ? (
            <Eye className="h-3.5 w-3.5 text-emerald-300" />
          ) : (
            <EyeOff className="h-3.5 w-3.5 text-rose-300" />
          )}
        </button>
        <button
          onClick={() => onDelete && onDelete(section.id)}
          className="p-1 hover:bg-rose-900 rounded text-rose-300 cursor-pointer transition-colors"
          title="Delete section"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  };

  // =========================================================================
  // 1. HOME: HERO CAROUSEL
  // =========================================================================
  const renderHeroCarousel = (section: HomeSectionData) => {
    const p = section.props || {};
    const bgImage = p.bgImage || "/images/client-mockup/hero-bg-exact.png";
    const ctaLink = p.ctaLink || "/shop";

    return (
      <section className="w-full bg-[#FAF6EB] border-b border-[#EDE8DC] relative overflow-hidden select-none">
        <div className="relative w-full max-w-[1524px] mx-auto aspect-[16/10] xs:aspect-[16/9] sm:aspect-[1024/302] min-h-[250px] sm:min-h-[280px] md:min-h-[340px] lg:min-h-[400px]">
          <Image
            src={bgImage}
            alt="Hero Background"
            fill
            priority
            className="object-cover object-right sm:object-fill"
          />

          {/* Subtle Mobile Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6EB]/95 via-[#FAF6EB]/80 to-transparent sm:from-transparent sm:via-transparent sm:to-transparent z-1 pointer-events-none" />

          <div className="absolute left-4 sm:left-[8%] top-0 bottom-0 flex flex-col justify-center max-w-[72%] sm:max-w-[48%] z-10 py-3 sm:py-0">
            {p.pill && (
              <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 rounded-full bg-[#084035] text-white text-[9px] sm:text-xs font-semibold w-fit tracking-wide shadow-xs mb-1.5 sm:mb-2">
                <span>{p.pill}</span>
              </div>
            )}

            <h1 className="font-bengali font-bold sm:font-black tracking-tight leading-[1.12]">
              <span className="block text-[#083D33] text-lg sm:text-2xl md:text-3xl lg:text-4xl">
                {p.titleLine1 || "বাংলার ঐতিহ্য,"}
              </span>
              <span className="block text-[#E0592A] text-lg sm:text-2xl md:text-3xl lg:text-4xl mt-0.5">
                {p.titleLine2 || "আপনার প্রয়োজন"}
              </span>
            </h1>

            <p className="font-bengali font-medium text-[#143D34] text-[10.5px] sm:text-xs md:text-sm leading-snug mt-1 sm:mt-2.5 max-w-sm line-clamp-2 sm:line-clamp-none">
              <span>{p.subtitleLine1 || "দেশীয় পণ্য ও আধুনিক সেবার সমন্বয়ে"}</span>
              {p.subtitleLine2 && (
                <>
                  <br className="hidden sm:inline" />
                  <span className="hidden sm:inline"> {p.subtitleLine2}</span>
                </>
              )}
            </p>

            <div className="hidden sm:flex items-center gap-2.5 sm:gap-4 mt-2 sm:mt-3 text-[#083D33]">
              <div className="flex items-center gap-1 text-[9px] sm:text-[11px] font-bold">
                <Truck className="w-3.5 h-3.5 shrink-0" />
                <span>{p.badge1Text || "Fast Delivery"}</span>
              </div>
              <div className="flex items-center gap-1 text-[9px] sm:text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>{p.badge2Text || "Quality Products"}</span>
              </div>
              <div className="flex items-center gap-1 text-[9px] sm:text-[11px] font-bold">
                <Handshake className="w-3.5 h-3.5 shrink-0" />
                <span>{p.badge3Text || "Reliable Service"}</span>
              </div>
            </div>

            <div className="sm:hidden flex items-center gap-1.5 mt-1.5 text-[10px] text-[#083D33] font-semibold">
              <span className="text-emerald-700">✓</span>
              <span>দ্রুত ডেলিভারি • প্রিমিয়াম মান</span>
            </div>

            <div className="mt-2.5 sm:mt-3.5">
              {isEditorMode ? (
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-6 py-1.5 sm:py-2.5 rounded-full bg-[#E0592A] text-white font-bold text-[11px] sm:text-xs shadow-md"
                >
                  <span>{p.ctaText || "Shop Now"}</span>
                  <span>→</span>
                </button>
              ) : (
                <Link
                  href={ctaLink}
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-6 py-1.5 sm:py-2.5 rounded-full bg-[#E0592A] hover:bg-[#C8481C] text-white font-bold text-[11px] sm:text-xs shadow-md transition-all hover:scale-105 cursor-pointer"
                >
                  <span>{p.ctaText || "Shop Now"}</span>
                  <span>→</span>
                </Link>
              )}
            </div>
          </div>

          {p.showLocalBadge !== false && (
            <div className="absolute right-[3%] sm:right-[5%] top-[5%] sm:top-[8%] z-10 pointer-events-none">
              <Image
                src="/images/client-mockup/support-local-badge.png"
                alt="Support Local"
                width={90}
                height={100}
                className="w-10 sm:w-20 h-auto object-contain"
              />
            </div>
          )}
        </div>
      </section>
    );
  };

  // =========================================================================
  // 2. HOME: CATEGORIES GRID
  // =========================================================================
  const renderCategoriesGrid = (section: HomeSectionData) => {
    const p = section.props || {};

    return (
      <section className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0D3B37]/10 flex items-center justify-center text-[#0D3B37]">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0D3B37] tracking-tight">
                {p.headline || "Shop by Category"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {p.subtitle || "Explore our wide range of products and services"}
              </p>
            </div>
          </div>

          {isEditorMode ? (
            <span className="text-xs sm:text-sm font-semibold text-[#0D3B37]">
              {p.ctaText || "View All Categories"} →
            </span>
          ) : (
            <Link
              href="/shop"
              className="text-xs sm:text-sm font-semibold text-[#0D3B37] hover:text-[#E0592A] transition-colors cursor-pointer"
            >
              {p.ctaText || "View All Categories"} →
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {categories.slice(0, 10).map((cat) => {
            const iconSrc =
              CATEGORY_ICON_MAP[cat.slug] ||
              (cat.imageUrl?.startsWith("http") || cat.imageUrl?.startsWith("/")
                ? cat.imageUrl
                : "/images/client-mockup/cat-handicrafts.png");

            const href =
              cat.slug === "e-sheba" ? "/services" : `/shop?category=${cat.slug}`;

            const cardInner = (
              <>
                <div className="relative w-16 h-14 mb-2 flex items-center justify-center">
                  <Image
                    src={iconSrc}
                    alt={cat.name}
                    width={64}
                    height={54}
                    className="object-contain max-h-14 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-[#E0592A] transition-colors">
                  {cat.name}
                </span>
              </>
            );

            if (isEditorMode) {
              return (
                <div
                  key={cat.id || cat.slug}
                  className="bg-white rounded-2xl p-4 flex flex-col items-center text-center shadow-xs border border-gray-100"
                >
                  {cardInner}
                </div>
              );
            }

            return (
              <Link
                key={cat.id || cat.slug}
                href={href}
                className="bg-white hover:bg-[#FAF8F5] rounded-2xl p-4 flex flex-col items-center text-center shadow-xs border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer"
              >
                {cardInner}
              </Link>
            );
          })}

          {/* Quality Products Better Life Banner */}
          <div className="col-span-2 relative rounded-2xl overflow-hidden shadow-xs min-h-[145px] flex items-center group">
            <Image
              src={p.promoBgImage || "/images/client-mockup/quality-products-bg.png"}
              alt="Promo Banner"
              fill
              className="object-cover object-right group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10 pl-5 pr-4 py-4 max-w-[60%] flex flex-col justify-center space-y-2">
              <h3 className="text-white font-extrabold text-base sm:text-lg leading-tight whitespace-pre-line">
                {p.promoHeadline || "Quality Products\nBetter Life"}
              </h3>
              {isEditorMode ? (
                <span className="px-3 py-1.5 bg-[#E0592A] text-white text-xs font-bold rounded-full w-fit">
                  {p.promoCtaText || "Explore Categories"} →
                </span>
              ) : (
                <Link
                  href={p.promoCtaLink || "/shop"}
                  className="px-3 py-1.5 bg-[#E0592A] hover:bg-[#C8481C] text-white text-xs font-bold rounded-full w-fit transition-transform hover:scale-105 cursor-pointer shadow-sm"
                >
                  {p.promoCtaText || "Explore Categories"} →
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };

  // =========================================================================
  // 3. HOME: FEATURED PRODUCTS
  // =========================================================================
  const renderFeaturedProducts = (section: HomeSectionData) => {
    const p = section.props || {};
    const limit = Number(p.limit) || 5;
    const items = products.slice(0, limit);

    return (
      <section className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Star className="w-5 h-5 fill-emerald-600 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0D3B37] tracking-tight">
                {p.headline || "Featured Products"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {p.subtitle || "Best selling and most popular products"}
              </p>
            </div>
          </div>

          {isEditorMode ? (
            <span className="text-xs sm:text-sm font-semibold text-[#0D3B37]">
              {p.ctaText || "View All Products"} →
            </span>
          ) : (
            <Link
              href="/shop"
              className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#0D3B37] hover:text-[#E0592A] transition-colors cursor-pointer"
            >
              <span>{p.ctaText || "View All Products"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {items.map((prod) => {
            const imageSrc = getProductImage(prod);
            const price = Number(prod.price) || 0;
            const salePrice = prod.salePrice ? Number(prod.salePrice) : null;
            const isAdded = addedProductId === prod.id;
            const isWishlisted = Boolean(wishlist[prod.id]);
            const discountPct = getProductDiscount(prod);

            return (
              <div
                key={prod.id}
                className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all duration-300 relative group border border-gray-100"
              >
                {/* Wishlist Heart Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(prod.id);
                  }}
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
                  {/* Product Image Link */}
                  {isEditorMode ? (
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#FAF8F5] mb-3 flex items-center justify-center p-2">
                      <Image
                        src={imageSrc}
                        alt={prod.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  ) : (
                    <Link
                      href={`/products/${prod.slug}`}
                      className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#FAF8F5] mb-3 flex items-center justify-center p-2 group-hover:bg-[#F5F1E9] transition-colors block cursor-pointer"
                    >
                      <Image
                        src={imageSrc}
                        alt={prod.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-contain p-2 group-hover:scale-106 transition-transform duration-300"
                      />
                    </Link>
                  )}

                  {/* Category Name */}
                  <p className="text-[11px] text-gray-400 font-medium truncate">
                    {prod.category?.name || prod.categoryName || "Artisanal"}
                  </p>

                  {/* Product Title */}
                  {isEditorMode ? (
                    <p className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-2 mt-0.5">
                      {prod.name}
                    </p>
                  ) : (
                    <Link
                      href={`/products/${prod.slug}`}
                      className="block font-semibold text-xs sm:text-sm text-gray-900 hover:text-[#E0592A] transition-colors line-clamp-2 mt-0.5 cursor-pointer leading-snug"
                      title={prod.name}
                    >
                      {prod.name}
                    </Link>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-xs text-amber-500 pt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-gray-700">
                      {prod.rating ?? 4.8}
                    </span>
                    <span className="text-gray-400 text-[10.5px]">
                      ({prod.reviewCount ?? 45})
                    </span>
                  </div>

                  {/* Price & Discount */}
                  <div className="flex items-center gap-2 flex-wrap pt-2">
                    <span className="font-extrabold text-sm sm:text-base text-[#0D3B37]">
                      ৳ {price.toLocaleString()}
                    </span>
                    {salePrice && (
                      <span className="text-[11px] text-gray-400 line-through">
                        ৳ {salePrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {discountPct}% OFF
                    </span>
                  </div>
                </div>

                {/* Real Add to Cart Button */}
                <div className="pt-3">
                  <button
                    type="button"
                    disabled={isEditorMode}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!isEditorMode && onQuickAdd) {
                        onQuickAdd(prod);
                      }
                    }}
                    className={`w-full py-2.5 sm:py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-[#0D3B37] hover:bg-[#E0592A] text-white active:scale-95"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
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
    );
  };

  // =========================================================================
  // 4. HOME: PROMO TRIO
  // =========================================================================
  const renderPromoTrio = (section: HomeSectionData) => {
    const p = section.props || {};

    return (
      <section className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Card 1: Special Offer */}
          <div className="relative bg-[#0B4632] rounded-3xl p-6 text-white flex flex-col justify-between min-h-[240px] overflow-hidden shadow-xs">
            <Image
              src={p.card1BgImage || "/images/client-mockup/special-offer-banner-bg.png"}
              alt="Special Offer"
              fill
              className="object-cover object-right"
            />
            <div className="relative z-10 max-w-[62%] flex flex-col justify-between h-full space-y-2">
              <div>
                <span className="text-xs sm:text-sm font-bold block">
                  {p.card1Tag || "Special Offer"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  UP TO <span className="text-[#F59F05]">{p.card1Discount || "50%"}</span> OFF
                </h3>
                <p className="text-xs text-white/90 mt-1">
                  {p.card1Subtitle || "On Selected Products"}
                </p>
              </div>
              <div>
                {isEditorMode ? (
                  <span className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#F26922] text-white font-bold text-xs shadow-md">
                    <span>{p.card1CtaText || "Shop Now"}</span>
                    <span>→</span>
                  </span>
                ) : (
                  <Link
                    href={p.card1Link || "/offers"}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#F26922] hover:bg-[#D95513] text-white font-bold text-xs shadow-md transition-all hover:scale-105 cursor-pointer"
                  >
                    <span>{p.card1CtaText || "Shop Now"}</span>
                    <span>→</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Our Services */}
          <div className="bg-[#FAF8F3] rounded-3xl p-6 flex flex-col justify-between shadow-xs border border-gray-100 min-h-[240px]">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg sm:text-xl font-bold text-[#0D3B37]">
                  {p.card2Headline || "Our Services"}
                </h3>
                {!isEditorMode && (
                  <Link
                    href="/services"
                    className="text-xs text-[#0D3B37] font-bold hover:text-[#E0592A] transition-colors"
                  >
                    Details →
                  </Link>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-3">
                {p.card2Subtitle || "More than just products"}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-800">
                <Link
                  href="/services"
                  className="bg-white hover:bg-emerald-50 p-2.5 rounded-xl shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 text-[#0D3B37]" />
                  <span>Home Delivery</span>
                </Link>
                <Link
                  href="/services"
                  className="bg-white hover:bg-emerald-50 p-2.5 rounded-xl shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Gift className="w-3.5 h-3.5 text-[#0D3B37]" />
                  <span>Corporate Gifts</span>
                </Link>
                <Link
                  href="/services"
                  className="bg-white hover:bg-emerald-50 p-2.5 rounded-xl shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-[#0D3B37]" />
                  <span>Custom Orders</span>
                </Link>
                <Link
                  href="/e-sheba"
                  className="bg-white hover:bg-emerald-50 p-2.5 rounded-xl shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Headset className="w-3.5 h-3.5 text-[#0D3B37]" />
                  <span>Special E-Sheba</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Stay Connected */}
          <div className="bg-[#FAF8F3] rounded-3xl p-6 flex items-center justify-between shadow-xs border border-gray-100 min-h-[240px] relative overflow-hidden">
            <div className="space-y-2 z-10 max-w-[60%]">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                {p.card3Tag || "Stay Connected"}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0D3B37] leading-tight">
                {p.card3Headline || "Get in Touch"}
              </h3>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href="https://wa.me/8801731214379"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center font-bold text-sm shadow-xs transition-transform hover:scale-110 cursor-pointer"
                  title="Chat on WhatsApp"
                >
                  ✆
                </a>
                <a
                  href="tel:+8801731214379"
                  className="w-9 h-9 rounded-full bg-[#0084FF] hover:bg-[#0074e0] text-white flex items-center justify-center font-bold text-sm shadow-xs transition-transform hover:scale-110 cursor-pointer"
                  title="Call Customer Care"
                >
                  💬
                </a>
              </div>
              <p className="text-[11px] text-gray-500">
                {p.card3Note || "Chat with us anytime"}
              </p>
            </div>
            <div className="relative w-28 h-32 shrink-0">
              <Image
                src={p.card3Image || "/images/client-mockup/promo-get-in-touch.png"}
                alt="Support"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    );
  };

  // =========================================================================
  // 5. HOME: FOR YOU RECOMMENDATIONS
  // =========================================================================
  const renderForYou = (section: HomeSectionData) => {
    const p = section.props || {};
    const items = products.slice(0, forYouVisibleCount);

    return (
      <section className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0D3B37] tracking-tight">
                {p.headline || "For You"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {p.subtitle || "Specially handpicked recommendations tailored for you"}
              </p>
            </div>
          </div>

          {isEditorMode ? (
            <span className="text-xs sm:text-sm font-semibold text-[#0D3B37]">
              {p.ctaText || "View All"} →
            </span>
          ) : (
            <Link
              href="/shop"
              className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#0D3B37] hover:text-[#E0592A] transition-colors cursor-pointer"
            >
              <span>{p.ctaText || "View All"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {items.map((prod) => {
            const imageSrc = getProductImage(prod);
            const price = Number(prod.price) || 0;
            const isAdded = addedProductId === prod.id;
            const isWishlisted = Boolean(wishlist[prod.id]);

            return (
              <div
                key={prod.id}
                className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all duration-300 relative group border border-gray-100"
              >
                {/* For You Tag Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="text-[9px] font-bold text-white bg-gradient-to-r from-[#E0592A] to-[#F59E0B] px-2 py-0.5 rounded-md shadow-2xs">
                    For You
                  </span>
                </div>

                {/* Wishlist Heart Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(prod.id);
                  }}
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
                  {/* Product Image Link */}
                  {isEditorMode ? (
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#FAF8F5] mb-3 flex items-center justify-center p-2">
                      <Image
                        src={imageSrc}
                        alt={prod.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  ) : (
                    <Link
                      href={`/products/${prod.slug}`}
                      className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#FAF8F5] mb-3 flex items-center justify-center p-2 group-hover:bg-[#F5F1E9] transition-colors block cursor-pointer"
                    >
                      <Image
                        src={imageSrc}
                        alt={prod.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-contain p-2 group-hover:scale-106 transition-transform duration-300"
                      />
                    </Link>
                  )}

                  {/* Category Name */}
                  <p className="text-[11px] text-gray-400 font-medium truncate">
                    {prod.category?.name || prod.categoryName || "Artisanal"}
                  </p>

                  {/* Product Title */}
                  {isEditorMode ? (
                    <p className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-2 mt-0.5">
                      {prod.name}
                    </p>
                  ) : (
                    <Link
                      href={`/products/${prod.slug}`}
                      className="block font-semibold text-xs sm:text-sm text-gray-900 hover:text-[#E0592A] transition-colors line-clamp-2 mt-0.5 cursor-pointer leading-snug"
                      title={prod.name}
                    >
                      {prod.name}
                    </Link>
                  )}

                  {/* Price */}
                  <p className="font-extrabold text-sm sm:text-base text-[#0D3B37] mt-1.5">
                    ৳ {price.toLocaleString()}
                  </p>
                </div>

                {/* Real Add to Cart Button */}
                <div className="pt-3">
                  <button
                    type="button"
                    disabled={isEditorMode}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!isEditorMode && onQuickAdd) {
                        onQuickAdd(prod);
                      }
                    }}
                    className={`w-full py-2.5 sm:py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-[#0D3B37] hover:bg-[#E0592A] text-white active:scale-95"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Load More Products Button */}
        <div className="mt-8 flex flex-col items-center justify-center text-center">
          <p className="text-xs text-gray-500 mb-2 font-medium">
            Showing <span className="font-bold text-[#0D3B37]">{items.length}</span> of{" "}
            <span className="font-bold text-[#0D3B37]">{products.length}</span> recommendations
          </p>
          <button
            type="button"
            disabled={isEditorMode || forYouVisibleCount >= products.length}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isEditorMode) {
                setIsLoadingMoreForYou(true);
                setTimeout(() => {
                  setForYouVisibleCount((c) => Math.min(c + 10, products.length));
                  setIsLoadingMoreForYou(false);
                }, 300);
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0D3B37] hover:bg-[#072421] text-white font-bold text-xs shadow-md transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
          >
            {isLoadingMoreForYou ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Loading Products...</span>
              </>
            ) : (
              <>
                <span>
                  {forYouVisibleCount >= products.length
                    ? "All Products Loaded"
                    : "Load More Products"}
                </span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </section>
    );
  };

  // =========================================================================
  // 6. HOME: TRUST & MISSION
  // =========================================================================
  const renderTrustMission = (section: HomeSectionData) => {
    const p = section.props || {};

    return (
      <section className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#0D3B37]">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                    {p.headline || "Why Choose SHOILPIKKABBO?"}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">
                  {p.subtitle || "Your trust is our biggest asset"}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="space-y-1 bg-[#FAF8F5] p-3 rounded-xl border border-sand">
                  <div className="w-8 h-8 rounded-lg bg-white text-[#0D3B37] flex items-center justify-center shadow-2xs">
                    <Package className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-900">{p.pillar1Title || "Wide Product Range"}</h4>
                  <p className="text-[10.5px] text-gray-500">{p.pillar1Desc || "From local to modern"}</p>
                </div>
                <div className="space-y-1 bg-[#FAF8F5] p-3 rounded-xl border border-sand">
                  <div className="w-8 h-8 rounded-lg bg-white text-[#0D3B37] flex items-center justify-center shadow-2xs">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-900">{p.pillar2Title || "Secure Payment"}</h4>
                  <p className="text-[10.5px] text-gray-500">{p.pillar2Desc || "Safe & trusted transaction"}</p>
                </div>
                <div className="space-y-1 bg-[#FAF8F5] p-3 rounded-xl border border-sand">
                  <div className="w-8 h-8 rounded-lg bg-white text-[#0D3B37] flex items-center justify-center shadow-2xs">
                    <Truck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-900">{p.pillar3Title || "Fast Delivery"}</h4>
                  <p className="text-[10.5px] text-gray-500">{p.pillar3Desc || "On time, every time"}</p>
                </div>
                <div className="space-y-1 bg-[#FAF8F5] p-3 rounded-xl border border-sand">
                  <div className="w-8 h-8 rounded-lg bg-white text-[#0D3B37] flex items-center justify-center shadow-2xs">
                    <Headset className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-900">{p.pillar4Title || "Customer Support"}</h4>
                  <p className="text-[10.5px] text-gray-500">{p.pillar4Desc || "Always here for you"}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative bg-[#07382E] rounded-2xl p-6 text-white flex flex-col justify-center min-h-[190px] overflow-hidden shadow-xs">
              <Image
                src={p.missionBgImage || "/images/client-mockup/trust-mission-banner-bg.png"}
                alt="Mission"
                fill
                className="object-cover object-right"
              />
              <div className="relative z-10 max-w-[65%] space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8 shrink-0">
                    <Image
                      src={p.missionIcon || "/images/client-mockup/trust-brand-icon.png"}
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">
                      {p.missionTitle || "SHOILPIKKABBO"}
                    </h4>
                    <p className="text-[9px] font-semibold text-emerald-100 uppercase tracking-wider">
                      {p.missionTagline || "DELIVERY • QUALITY • RELIABILITY"}
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-white/90 leading-relaxed font-normal">
                  {p.missionDesc || "We are committed to delivering high-quality products and services with trust, care and reliability to make your life easier."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // =========================================================================
  // 7. ABOUT US SECTIONS
  // =========================================================================
  const renderAboutHeader = (section: HomeSectionData) => {
    const p = section.props || {};
    return (
      <div className="max-w-[1524px] mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0D3B37] text-xs font-bold mb-3 border border-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-[#E0592A]" />
            <span>{p.badge || "Heritage Craft & Everyday Commerce"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl text-[#0D3B37] font-extrabold tracking-tight">
            {p.headline || "Thoughtfully brought together."}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
            {p.subtitle || "SHOILPIKKABBO is built upon three foundational tenets: Delivery, Quality, and Reliability."}
          </p>
        </div>
      </div>
    );
  };

  const renderAboutStory = (section: HomeSectionData) => {
    const p = section.props || {};
    return (
      <div className="max-w-[1524px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 shadow-md">
              <Image
                src={p.imageUrl || "/images/story-artisan.png"}
                alt={p.imageAlt || "Story"}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-6 space-y-3">
            <span className="text-xs font-bold text-[#E0592A] uppercase tracking-wider block">
              {p.tag || "OUR HERITAGE & MISSION"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D3B37] leading-tight">
              {p.headline || "Connecting root artisans with modern Bangladeshi homes."}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {p.paragraph1 || "Founded with the ambition of making authentic Bangladeshi craftsmanship accessible to everyone."}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {p.paragraph2 || "We work directly with craft guilds, women cooperatives, and master makers."}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderAboutPillars = (section: HomeSectionData) => {
    const p = section.props || {};
    return (
      <div className="max-w-[1524px] mx-auto px-4 sm:px-6 py-8">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h3 className="text-2xl font-bold text-[#0D3B37]">{p.headline || "The Principles That Guide Us"}</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">{p.subtitle || "Every order is held to our three benchmarks."}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-2">
            <Truck className="w-6 h-6 text-[#E0592A]" />
            <h4 className="font-bold text-sm text-[#0D3B37]">{p.pillar1Title || "Delivery"}</h4>
            <p className="text-xs text-gray-600">{p.pillar1Desc || "Dependable and prompt nationwide shipping."}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#E0592A]" />
            <h4 className="font-bold text-sm text-[#0D3B37]">{p.pillar2Title || "Quality"}</h4>
            <p className="text-xs text-gray-600">{p.pillar2Desc || "Uncompromising raw material selection."}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-2">
            <Handshake className="w-6 h-6 text-[#E0592A]" />
            <h4 className="font-bold text-sm text-[#0D3B37]">{p.pillar3Title || "Reliability"}</h4>
            <p className="text-xs text-gray-600">{p.pillar3Desc || "Consistent customer care and transparent billing."}</p>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // 8. SERVICES / E-SHEBA SECTIONS
  // =========================================================================
  const renderServicesHeader = (section: HomeSectionData) => {
    const p = section.props || {};
    return (
      <div className="max-w-[1524px] mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0D3B37] text-xs font-bold mb-3 border border-emerald-100">
            <Building2 className="w-3.5 h-3.5 text-[#E0592A]" />
            <span>{p.badge || "Special E-Sheba & Institutional Sourcing"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl text-[#0D3B37] font-extrabold tracking-tight">
            {p.headline || "Special E-Sheba & Corporate Solutions"}
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            {p.subtitle || "Tailor-made institutional procurement and bespoke corporate gifts."}
          </p>
        </div>
      </div>
    );
  };

  const renderServicesList = (section: HomeSectionData) => {
    const p = section.props || {};
    return (
      <div className="max-w-[1524px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-start gap-3">
            <Gift className="w-6 h-6 text-[#0D3B37] shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-[#0D3B37]">{p.service1Title || "Corporate Gift Items"}</h4>
              <p className="text-xs text-gray-500 mt-1">{p.service1Desc || "Custom handcrafted hampers and packaging."}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-start gap-3">
            <Building2 className="w-6 h-6 text-[#0D3B37] shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-[#0D3B37]">{p.service2Title || "Industrial Solutions"}</h4>
              <p className="text-xs text-gray-500 mt-1">{p.service2Desc || "B2B raw supplies and customized production."}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-start gap-3">
            <Headset className="w-6 h-6 text-[#0D3B37] shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-[#0D3B37]">{p.service3Title || "Special E-Sheba / Services"}</h4>
              <p className="text-xs text-gray-500 mt-1">{p.service3Desc || "Direct bespoke orders and personalized support."}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-start gap-3">
            <Package className="w-6 h-6 text-[#0D3B37] shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-[#0D3B37]">{p.service4Title || "Bespoke Jute & Agro Packaging"}</h4>
              <p className="text-xs text-gray-500 mt-1">{p.service4Desc || "Biodegradable bulk packaging solutions."}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // 9. CONTACT SECTIONS
  // =========================================================================
  const renderContactHeader = (section: HomeSectionData) => {
    const p = section.props || {};
    return (
      <div className="max-w-[1524px] mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold text-[#E0592A] uppercase tracking-wider block mb-1">
            {p.badge || "We Are Here For You"}
          </span>
          <h1 className="text-3xl font-extrabold text-[#0D3B37]">
            {p.headline || "Get in Touch With SHOILPIKKABBO"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            {p.subtitle || "Have a question about an order, bespoke product, or partnership? Reach out anytime."}
          </p>
        </div>
      </div>
    );
  };

  const renderContactDetails = (section: HomeSectionData) => {
    const p = section.props || {};
    return (
      <div className="max-w-[1524px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-1.5">
            <Phone className="w-5 h-5 text-[#0D3B37]" />
            <h4 className="font-bold text-xs text-gray-900">Phone Support</h4>
            <a
              href={`tel:${p.primaryPhone || "+8801731214379"}`}
              className="text-xs text-emerald-800 font-semibold hover:underline block"
            >
              {p.primaryPhone || "+880 1731214379"}
            </a>
            <p className="text-xs text-gray-500">{p.secondaryPhone || "+880 1811909068"}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-1.5">
            <Mail className="w-5 h-5 text-[#0D3B37]" />
            <h4 className="font-bold text-xs text-gray-900">Email Address</h4>
            <a
              href={`mailto:${p.email || "shoilpikkabbo@gmail.com"}`}
              className="text-xs text-emerald-800 font-semibold hover:underline block"
            >
              {p.email || "shoilpikkabbo@gmail.com"}
            </a>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-1.5">
            <MapPin className="w-5 h-5 text-[#0D3B37]" />
            <h4 className="font-bold text-xs text-gray-900">Operations Office</h4>
            <p className="text-xs text-gray-600">{p.officeAddress || "Uttara, Dhaka - 1230, Bangladesh"}</p>
          </div>
        </div>
      </div>
    );
  };

  // Dispatcher by section.type
  const renderSectionContent = (section: HomeSectionData) => {
    switch (section.type) {
      // Home sections
      case "hero_carousel":
      case "hero":
        return renderHeroCarousel(section);
      case "categories_grid":
      case "category_discovery":
        return renderCategoriesGrid(section);
      case "featured_products":
      case "product_grid":
        return renderFeaturedProducts(section);
      case "promo_trio":
      case "promo_banner":
        return renderPromoTrio(section);
      case "for_you_products":
        return renderForYou(section);
      case "trust_mission":
        return renderTrustMission(section);

      // About sections
      case "about_header":
        return renderAboutHeader(section);
      case "about_story":
      case "brand_story":
        return renderAboutStory(section);
      case "about_pillars":
      case "manifesto":
        return renderAboutPillars(section);

      // Services sections
      case "services_header":
        return renderServicesHeader(section);
      case "services_list":
      case "services_showcase":
        return renderServicesList(section);

      // Contact sections
      case "contact_header":
        return renderContactHeader(section);
      case "contact_details":
        return renderContactDetails(section);

      default:
        return (
          <div className="p-8 text-center bg-gray-50 border border-dashed border-gray-300 rounded-2xl m-4">
            <p className="text-sm font-bold text-gray-700">{section.name || section.type}</p>
            <p className="text-xs text-gray-400 mt-1">Section type: {section.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full bg-[#F8F9FA]">
      {sections.map((section, index) => {
        const isSelected = selectedSectionId === section.id;

        return (
          <div
            key={section.id}
            onClick={() => onSelectSection && onSelectSection(section.id)}
            onMouseEnter={() => setHoveredSectionId(section.id)}
            onMouseLeave={() => setHoveredSectionId(null)}
            className={`relative transition-all duration-200 ${
              !section.isVisible && isEditorMode ? "opacity-50 grayscale-20" : ""
            } ${
              isEditorMode
                ? `cursor-pointer ${
                    isSelected
                      ? "ring-3 ring-[#0D3B37] ring-offset-2 z-20"
                      : "hover:ring-2 hover:ring-[#E0592A]/50"
                  }`
                : ""
            }`}
          >
            {renderEditorControls(section, index)}
            {renderSectionContent(section)}
          </div>
        );
      })}
    </div>
  );
}
