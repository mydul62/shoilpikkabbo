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
  ChevronUp,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Sparkles,
} from "lucide-react";

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
}

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
}: HomeSectionsRendererProps) {
  const [hoveredSectionId, setHoveredSectionId] = React.useState<string | null>(null);

  // Render Section Controls Overlay in Editor Mode
  const renderEditorControls = (section: HomeSectionData, index: number) => {
    if (!isEditorMode) return null;
    const isSelected = selectedSectionId === section.id;
    const isHovered = hoveredSectionId === section.id;

    if (!isSelected && !isHovered) return null;

    return (
      <div
        className="absolute top-2 left-2 z-30 flex items-center gap-1.5 bg-forest-950/90 text-sand backdrop-blur-md px-2.5 py-1.5 rounded-lg shadow-lg text-[11px] font-sans font-medium border border-gold-500/30"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-bold text-gold-400 mr-1 flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          {section.name || section.type.toUpperCase()}
        </span>
        <button
          onClick={() => onMoveUp && onMoveUp(section.id)}
          disabled={index === 0}
          className="p-1 hover:bg-forest-800 rounded disabled:opacity-20 cursor-pointer"
          title="Move section up"
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onMoveDown && onMoveDown(section.id)}
          disabled={index === sections.length - 1}
          className="p-1 hover:bg-forest-800 rounded disabled:opacity-20 cursor-pointer"
          title="Move section down"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onDuplicate && onDuplicate(section.id)}
          className="p-1 hover:bg-forest-800 rounded cursor-pointer"
          title="Duplicate section"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onToggleVisibility && onToggleVisibility(section.id)}
          className="p-1 hover:bg-forest-800 rounded cursor-pointer"
          title={section.isVisible ? "Hide on live website" : "Show on live website"}
        >
          {section.isVisible ? (
            <Eye className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <EyeOff className="h-3.5 w-3.5 text-rose-400" />
          )}
        </button>
        <button
          onClick={() => onDelete && onDelete(section.id)}
          className="p-1 hover:bg-rose-900 rounded text-rose-300 cursor-pointer"
          title="Delete section"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  };

  // Section 1: Hero
  const renderHero = (section: HomeSectionData) => {
    const p = section.props || {};
    return (
      <section
        style={{ backgroundColor: p.bgColor || "#FAF7F2" }}
        className="relative pt-6 pb-6 sm:py-10 md:py-12 lg:py-16 border-b border-[#EAE3D6] overflow-hidden"
      >
        <div className="max-w-[1524px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-12 xl:gap-16 items-center">
            {/* Left Column: Typography & Action */}
            <div className="md:col-span-6 lg:col-span-5 flex flex-col justify-center">
              <p className="text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-[#B85D38] mb-3 sm:mb-4 md:mb-5">
                {p.overline || "AUTHENTIC BANGLADESHI CRAFTS & ESSENTIALS"}
              </p>
              <h1
                style={{ color: p.textColor || "#143527" }}
                className="font-serif text-[34px] sm:text-[42px] md:text-[48px] lg:text-[64px] xl:text-[72px] leading-[1.08] md:leading-[1.04] font-normal tracking-tight mb-4 sm:mb-5 md:mb-6 whitespace-pre-line"
              >
                {p.headline || "Handcrafted for your home.\nThoughtfully made."}
              </h1>
              <p className="text-[#555A54] text-[13.5px] sm:text-base lg:text-[17px] leading-relaxed max-w-[420px] mb-6 sm:mb-7 md:mb-8 font-light">
                {p.subtitle || "Discover premium jute decor, traditional handicrafts, lifestyle essentials and custom corporate gifting — delivered all over Bangladesh."}
              </p>
              <div>
                <Link
                  href={p.ctaLink || "/shop"}
                  className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 bg-[#143527] hover:bg-[#0F261B] text-white text-xs sm:text-sm font-medium rounded-[2px] transition-colors shadow-xs group"
                >
                  <span>{p.ctaText || "Explore the collection"}</span>
                  <ArrowUpRight className="h-4 w-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>

              <div className="hidden lg:flex pt-8 lg:pt-12 mt-8 lg:mt-12 border-t border-[#EAE3D6] items-center gap-4">
                <span className="font-serif text-3xl sm:text-4xl font-normal text-[#B85D38] leading-none select-none">
                  01
                </span>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#14261D]">
                    {p.overline || "AUTHENTIC BANGLADESHI CRAFTS"}
                  </span>
                  <span className="text-xs text-[#6B665F] font-light mt-0.5">
                    {p.caption || "100% authentic craftsmanship · Sustainable & durable"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset */}
            <div className="md:col-span-6 lg:col-span-7">
              <div className="relative w-full aspect-[4/3] sm:aspect-[1.35/1] rounded-none sm:rounded-2xl overflow-hidden shadow-xs bg-[#EFE9DF]">
                <Image
                  src={p.imageUrl || "/images/hero-artisan.png"}
                  alt={p.imageAlt || "Hero visual"}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 55vw"
                />

                <Link
                  href={p.captionLink || "/shop?category=jute-items"}
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

              <Link
                href={p.captionLink || "/shop"}
                className="flex sm:hidden items-center justify-between pt-3 text-[12px] text-[#555A54] hover:text-[#143527] transition-colors group"
              >
                <span>{p.caption || "100% authentic craftsmanship · Sustainable & durable"}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-[#555A54] group-hover:text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Section 2: Manifesto Banner
  const renderManifesto = (section: HomeSectionData) => {
    const p = section.props || {};
    return (
      <section
        style={{ backgroundColor: p.bgColor || "#EBF0EC" }}
        className="border-b border-[#D8DFD9] py-8 sm:py-10 md:py-12"
      >
        <div className="max-w-[1524px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-center">
            <div className="md:col-span-6">
              <h2
                style={{ color: p.textColor || "#143527" }}
                className="font-serif text-[24px] sm:text-3xl md:text-[32px] font-normal leading-[1.2] tracking-tight whitespace-pre-line"
              >
                {p.headline || "Crafted with care.\nMade to last."}
              </h2>
            </div>
            <div className="md:col-span-6">
              <p className="text-[13px] sm:text-[14px] md:text-[14.5px] text-[#556059] font-light leading-relaxed max-w-xl">
                {p.body || "At SHOILPIKKABBO, we connect local rural artisans with modern homes. Every piece supports sustainable craftsmanship and brings authentic beauty into your everyday life."}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Section 3: Category Discovery
  const renderCategoryDiscovery = (section: HomeSectionData) => {
    const p = section.props || {};
    const featured = p.featuredCategories || [
      { name: "Handicrafts", slug: "handicraft", image: "/images/category-handicrafts.png" },
      { name: "Jute Items", slug: "jute-items", image: "/images/category-jute.png" },
      { name: "Corporate Gift Items", slug: "corporate-gift-items", image: "/images/category-corporate.png" },
    ];
    const pills = p.pills || [
      { name: "Polymer", slug: "polymer" },
      { name: "Baby Items", slug: "baby-items" },
      { name: "Rudiment Garments", slug: "rudiment-garments" },
      { name: "Industrial Solutions", slug: "industrial-solutions" },
      { name: "Health & Beauty", slug: "health-and-beauty" },
      { name: "Agriculture", slug: "agriculture" },
      { name: "Special E-Sheba", slug: "special-services", href: "/services" },
    ];

    return (
      <section
        style={{ backgroundColor: p.bgColor || "#FAF7F2" }}
        className="py-10 sm:py-14 md:py-16 lg:py-20 border-b border-[#EAE3D5]"
      >
        <div className="max-w-[1524px] mx-auto px-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 sm:mb-8 md:mb-10">
            <div>
              <p className="text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-[#B85D38] mb-2 sm:mb-2.5">
                {p.overline || "EXPLORE OUR CATEGORIES"}
              </p>
              <h2 className="font-serif text-[28px] sm:text-3xl md:text-[36px] lg:text-[44px] font-normal text-[#143527] leading-[1.15] sm:leading-[1.1] tracking-tight">
                {p.headline || "Shop by category."}
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden lg:inline-flex items-center gap-1.5 text-[13px] sm:text-[14px] font-medium text-[#143527] hover:text-[#B85D38] transition-colors self-start sm:self-auto group"
            >
              <span>Explore all categories</span>
              <ArrowUpRight className="w-4 h-4 text-[#143527] group-hover:text-[#B85D38] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-8 mb-6 md:mb-8">
            {featured.map((cat: any, i: number) => (
              <Link
                key={i}
                href={`/shop?category=${cat.slug}`}
                className="group block"
              >
                <div className="relative w-full aspect-square md:aspect-[1.15/1] lg:aspect-[1.65/1] rounded-xl sm:rounded-2xl overflow-hidden bg-[#E8E2D6] shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-2 md:mb-3">
                  <Image
                    src={cat.image || "/images/category-handicrafts.png"}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                  />
                </div>
                <div className="flex items-center justify-between text-[13.5px] md:text-xl font-medium text-[#143527] group-hover:text-[#B85D38]">
                  <span>{cat.name}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </div>
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 md:gap-3 pt-1">
            {pills.map((pill: any, i: number) => (
              <Link
                key={i}
                href={pill.href || `/shop?category=${pill.slug}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 md:px-4 md:py-2 rounded-full border border-[#D5CDC0] bg-[#FAF7F2] hover:bg-white hover:border-[#143527] text-[#2D3F33] hover:text-[#143527] text-[11.5px] md:text-[12px] font-normal transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] group"
              >
                <span>{pill.name}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#6A736C] group-hover:text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Section 4: Product Grid (Customer Favourites & New Arrivals)
  const renderProductGrid = (section: HomeSectionData) => {
    const p = section.props || {};
    const defaultProducts = [
      {
        id: "prod-jute-basket",
        name: "Everyday jute basket",
        slug: "everyday-jute-basket",
        price: 1450,
        oldPrice: 1650,
        imageUrl: "/images/product-jute-basket.png",
        categoryName: "Jute Items",
      },
      {
        id: "prod-woven-coasters",
        name: "Woven coaster set",
        slug: "woven-coaster-set",
        price: 450,
        imageUrl: "/images/product-woven-coasters.png",
        categoryName: "Handicrafts",
      },
      {
        id: "prod-terracotta-vase",
        name: "Terracotta stem vase",
        slug: "terracotta-stem-vase",
        price: 680,
        imageUrl: "/images/product-terracotta-vase.png",
        categoryName: "Handicrafts",
      },
      {
        id: "prod-jute-tote",
        name: "The everyday jute tote",
        slug: "the-everyday-jute-tote",
        price: 850,
        imageUrl: "/images/product-jute-tote.png",
        categoryName: "Jute Items",
      },
    ];

    return (
      <section
        style={{ backgroundColor: p.bgColor || "#FAF7F2" }}
        className="py-10 sm:py-14 md:py-16 lg:py-20 border-b border-[#EAE3D5]"
      >
        <div className="max-w-[1524px] mx-auto px-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 md:mb-10">
            <div>
              <p className="text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase text-[#B85D38] mb-2 sm:mb-3">
                {p.overline || "CURATED BESTSELLERS"}
              </p>
              <h2 className="font-serif text-[28px] sm:text-3xl md:text-[36px] lg:text-[44px] font-normal text-[#143527] leading-[1.15] sm:leading-[1.1] tracking-tight whitespace-pre-line">
                {p.headline || "Customer favourites\n& new arrivals."}
              </h2>
            </div>
            <Link
              href={p.ctaLink || "/shop"}
              className="inline-flex items-center gap-1.5 text-[13px] md:text-[13.5px] font-medium text-[#143527] hover:text-[#B85D38] transition-colors group"
            >
              <span>{p.ctaText || "Shop all"}</span>
              <ArrowUpRight className="w-4 h-4 text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-7">
            {defaultProducts.map((prod) => (
              <div key={prod.id} className="group flex flex-col">
                <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#E8E2D6] shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-2 sm:mb-3">
                  <Link href={`/products/${prod.slug}`} className="block relative w-full h-full">
                    <Image
                      src={prod.imageUrl}
                      alt={prod.name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                    />
                  </Link>
                  <button
                    onClick={() => onQuickAdd && onQuickAdd(prod)}
                    className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white hover:bg-[#143527] text-[#143527] hover:text-white shadow-sm flex items-center justify-center transition-all cursor-pointer group/btn"
                    title="Add to bag"
                  >
                    {addedProductId === prod.id ? (
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#143527]" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:rotate-90 transition-transform duration-200" />
                    )}
                  </button>
                </div>
                <span className="text-[10px] sm:text-[11.5px] text-[#6A736C] font-light">
                  {prod.categoryName}
                </span>
                <Link href={`/products/${prod.slug}`}>
                  <h3 className="text-[13px] sm:text-[15px] font-medium text-[#143527] group-hover:text-[#B85D38] transition-colors mt-0.5 leading-snug line-clamp-1">
                    {prod.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5">
                  <span className="text-[13px] sm:text-[14.5px] font-semibold text-[#143527]">
                    ৳{prod.price}
                  </span>
                  {prod.oldPrice && (
                    <span className="text-[11px] sm:text-[12px] text-[#8C948E] line-through font-light">
                      ৳{prod.oldPrice}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Section 5: Promotional Welcome Offer Banner
  const renderPromoBanner = (section: HomeSectionData) => {
    const p = section.props || {};
    return (
      <section
        style={{ backgroundColor: p.bgColor || "#143527" }}
        className="text-white py-10 sm:py-14 md:py-16 lg:py-20 border-y border-[#0E2C1F] overflow-hidden"
      >
        <div className="max-w-[1524px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-14 items-start sm:items-center">
            <div className="md:col-span-6 flex flex-col justify-center">
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-[#A8BDB2] mb-2 sm:mb-3 md:mb-4">
                {p.tag || "SPECIAL WELCOME OFFER"}
              </p>
              <h2
                style={{ color: p.textColor || "#ffffff" }}
                className="font-serif text-[28px] sm:text-3xl md:text-[36px] lg:text-[44px] xl:text-[46px] font-normal leading-[1.12] tracking-tight whitespace-pre-line"
              >
                {p.headline || "Save on your\nfirst purchase."}
              </h2>
            </div>
            <div className="md:col-span-6 flex flex-col items-start justify-center">
              <p className="text-[15px] sm:text-[17px] md:text-[18px] font-normal text-[#E6EFE9] mb-1 leading-snug">
                {p.offerHighlight || "৳150 off your first ৳1,500 order."}
              </p>
              <p className="text-[11.5px] sm:text-[12px] md:text-[12.5px] font-light text-[#9EB5A7] mb-4 sm:mb-5 md:mb-6">
                {p.code || "WELCOME150"} <span className="select-none mx-1">·</span> {p.terms || "One use per customer · Valid on all categories"}
              </p>
              <Link
                href={p.ctaLink || "/offers"}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white hover:bg-[#FAF7F2] text-[#143527] text-xs sm:text-sm font-medium rounded-[2px] shadow-sm transition-all group"
              >
                <span>{p.ctaText || "Explore offers"}</span>
                <ArrowUpRight className="w-4 h-4 text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Section 6: Services Showcase (Beyond the Basket)
  const renderServicesShowcase = (section: HomeSectionData) => {
    const p = section.props || {};
    const services = p.services || [
      { title: "Corporate gifting", link: "/services", icon: "gift" },
      { title: "Industrial Solutions", link: "/services", icon: "factory" },
      { title: "Special E-Sheba / Services", link: "/services", icon: "headset" },
    ];

    const getIcon = (type: string) => {
      switch (type) {
        case "factory":
          return <Factory className="w-5 h-5 text-[#143527] group-hover:text-[#B85D38] transition-colors" />;
        case "headset":
          return <Headset className="w-5 h-5 text-[#143527] group-hover:text-[#B85D38] transition-colors" />;
        default:
          return <Gift className="w-5 h-5 text-[#143527] group-hover:text-[#B85D38] transition-colors" />;
      }
    };

    return (
      <section
        style={{ backgroundColor: p.bgColor || "#FAF7F2" }}
        className="py-10 sm:py-14 md:py-16 lg:py-24 border-b border-[#EAE3D5]"
      >
        <div className="max-w-[1524px] mx-auto px-5">
          <div className="mb-6 sm:mb-8 md:mb-10">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-[#B85D38] mb-2 sm:mb-2.5">
              {p.overline || "SPECIAL E-SHEBA & CUSTOM SOLUTIONS"}
            </p>
            <h2 className="font-serif text-[28px] sm:text-3xl md:text-[36px] lg:text-[44px] font-normal text-[#143527] leading-[1.12] tracking-tight mb-2">
              {p.headline || "Need custom craft or bulk orders?"}
            </h2>
            <p className="text-[12.5px] sm:text-[13.5px] md:text-[14px] text-[#556059] font-light leading-relaxed max-w-2xl">
              {p.subtitle || "We design customized corporate gifts, bulk event items, and bespoke artisan solutions tailored to your unique requirements."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 lg:gap-8 mb-6 md:mb-8">
            {services.map((srv: any, i: number) => (
              <Link
                key={i}
                href={srv.link || "/services"}
                className="group block p-5 sm:p-6 lg:p-8 bg-transparent hover:bg-white/60 border border-[#E2DDD2] hover:border-[#C4B8A5] rounded-[2px] transition-all duration-300"
              >
                <div className="mb-5 sm:mb-6">{getIcon(srv.icon)}</div>
                <h3 className="font-serif text-lg sm:text-xl md:text-[22px] font-normal text-[#143527] group-hover:text-[#B85D38] transition-colors mb-5 leading-snug">
                  {srv.title}
                </h3>
                <span className="inline-flex items-center gap-1 text-[12px] md:text-[12.5px] text-[#556059] group-hover:text-[#143527] font-light">
                  <span>Discuss your brief</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>

          <Link
            href={p.ctaLink || "/services"}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F7F4EE] hover:bg-white border border-[#D5CDC0] hover:border-[#143527] text-[#143527] text-[13px] font-medium rounded-[2px] transition-all group shadow-2xs"
          >
            <span>{p.ctaText || "Request a consultation"}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </section>
    );
  };

  // Section 7: Brand Story (Texture & Everyday Life)
  const renderBrandStory = (section: HomeSectionData) => {
    const p = section.props || {};
    return (
      <section
        style={{ backgroundColor: p.bgColor || "#EFECE6" }}
        className="w-full border-b border-[#E0D8CB] overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 items-stretch min-h-[380px] lg:min-h-[460px]">
          <div className="md:col-span-6 relative w-full h-64 md:h-full min-h-[300px]">
            <Image
              src={p.imageUrl || "/images/story-artisan.png"}
              alt={p.imageAlt || "Brand story visual"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="md:col-span-6 flex flex-col justify-center px-6 sm:px-8 md:px-10 lg:px-16 xl:px-20 py-10 md:py-12 lg:py-16 bg-[#ECE7DB]">
            <div className="max-w-lg">
              <p className="text-[10.5px] md:text-[11px] font-bold tracking-[0.16em] uppercase text-[#B85D38] mb-3">
                {p.overline || "OUR ARTISAN HERITAGE"}
              </p>
              <h2
                style={{ color: p.textColor || "#143527" }}
                className="font-serif text-[28px] md:text-[34px] lg:text-[42px] font-normal leading-[1.16] tracking-tight mb-4 whitespace-pre-line"
              >
                {p.headline || "Empowering artisans,\npreserving traditions."}
              </h2>
              <p className="text-[13px] md:text-[13.5px] lg:text-[14.5px] text-[#556059] font-light leading-relaxed mb-6 md:mb-8">
                {p.body || "From traditional clay pottery to handwoven jute, every Shoilpikkabbo creation celebrates Bangladeshi heritage while providing sustainable livelihoods to rural craft communities."}
              </p>
              <Link
                href={p.ctaLink || "/about"}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 hover:bg-white border border-[#D5CDC0] hover:border-[#143527] text-[#143527] text-[12.5px] md:text-[13px] font-medium rounded-[2px] transition-all group self-start shadow-2xs"
              >
                <span>{p.ctaText || "Learn our story"}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Section 8: Corporate Gifting Feature
  const renderCorporateGifting = (section: HomeSectionData) => {
    const p = section.props || {};
    return (
      <section
        style={{ backgroundColor: p.bgColor || "#FAF7F2" }}
        className="py-10 sm:py-14 md:py-16 lg:py-24 border-b border-[#EAE3D5]"
      >
        <div className="max-w-[1524px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="md:col-span-6 flex flex-col justify-center">
              <p className="text-[10.5px] md:text-[11px] font-bold tracking-[0.16em] uppercase text-[#B85D38] mb-3">
                {p.overline || "CORPORATE & OCCASIONAL GIFTING"}
              </p>
              <h2
                style={{ color: p.textColor || "#143527" }}
                className="font-serif text-[28px] md:text-[34px] lg:text-[44px] font-normal leading-[1.14] tracking-tight mb-3 md:mb-4 whitespace-pre-line"
              >
                {p.headline || "Meaningful gifts your clients\n& team will cherish."}
              </h2>
              <p className="text-[13px] md:text-[13.5px] lg:text-[14.5px] text-[#556059] font-light leading-relaxed mb-6 md:mb-8 max-w-[440px]">
                {p.body || "Handmade gift hampers, custom branding, and premium artisan boxes for company events, celebrations, and festive occasions."}
              </p>
              <Link
                href={p.ctaLink || "/services"}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#143527] hover:bg-[#1B4332] text-white text-[12.5px] md:text-[13px] font-medium rounded-[2px] transition-all group self-start shadow-sm"
              >
                <span>{p.ctaText || "Discover gifting"}</span>
                <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            <div className="md:col-span-6">
              <div className="relative w-full aspect-[16/11] sm:aspect-[16/10] rounded-xl lg:rounded-2xl overflow-hidden bg-[#E8E2D6] shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <Image
                  src={p.imageUrl || "/images/corporate-gifting-feature.png"}
                  alt={p.imageAlt || "Corporate gifting visual"}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Section Dispatcher
  const renderSectionContent = (section: HomeSectionData) => {
    switch (section.type) {
      case "hero":
        return renderHero(section);
      case "manifesto":
        return renderManifesto(section);
      case "category_discovery":
        return renderCategoryDiscovery(section);
      case "product_grid":
        return renderProductGrid(section);
      case "promo_banner":
        return renderPromoBanner(section);
      case "services_showcase":
        return renderServicesShowcase(section);
      case "brand_story":
        return renderBrandStory(section);
      case "corporate_gifting":
        return renderCorporateGifting(section);
      default:
        return (
          <div className="p-8 text-center text-charcoal-400 bg-sand/20">
            Unknown section type: {section.type}
          </div>
        );
    }
  };

  return (
    <div className="w-full flex flex-col">
      {sections.map((section, idx) => {
        // Skip hidden sections on public website
        if (!isEditorMode && !section.isVisible) return null;

        const isSelected = isEditorMode && selectedSectionId === section.id;
        const isHovered = isEditorMode && hoveredSectionId === section.id;

        return (
          <div
            key={section.id}
            onMouseEnter={() => isEditorMode && setHoveredSectionId(section.id)}
            onMouseLeave={() => isEditorMode && setHoveredSectionId(null)}
            onClick={() => isEditorMode && onSelectSection && onSelectSection(section.id)}
            className={`relative transition-all duration-200 ${
              isEditorMode ? "cursor-pointer" : ""
            } ${
              isSelected
                ? "ring-3 ring-forest-800 ring-offset-2 z-20 shadow-xl"
                : isHovered
                ? "ring-2 ring-forest-600/60 ring-offset-1 z-10"
                : ""
            } ${isEditorMode && !section.isVisible ? "opacity-40 grayscale-30" : ""}`}
          >
            {renderEditorControls(section, idx)}
            {renderSectionContent(section)}
          </div>
        );
      })}
    </div>
  );
}
