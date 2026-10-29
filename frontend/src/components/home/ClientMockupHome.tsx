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

  // Top 6 Featured Products matching Client Mockup
  const featuredProducts = MOCK_PRODUCTS.slice(0, 6);

  return (
    <div className="w-full bg-[#F8F9FA] pb-16 space-y-8 sm:space-y-12">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative bg-[#FAF8F3] rounded-2xl sm:rounded-3xl border border-[#EDE8DC] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              {/* Overline Tag */}
              <div className="inline-flex items-center gap-2 bg-[#0D3B37] text-white px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide">
                <span>Handmade</span>
                <span>•</span>
                <span>Eco Friendly</span>
                <span>•</span>
                <span>Local Products</span>
              </div>

              {/* Large Bengali Headline */}
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-extrabold text-[#0D3B37] leading-[1.15] tracking-tight">
                  বাংলার ঐতিহ্য,
                </h1>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-extrabold text-[#E0592A] leading-[1.15] tracking-tight">
                  আপনার প্রয়োজন
                </h2>
              </div>

              {/* Bengali Subtitle */}
              <p className="text-sm sm:text-base lg:text-[17px] text-gray-600 font-normal leading-relaxed max-w-lg">
                দেশীয় পণ্য ও আধুনিক সেবার সমন্বয়ে শিল্পকলা এখন আপনার হাতের কাছে!
              </p>

              {/* 3 Value Propositions */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-1 sm:pt-2">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[#0D3B37]">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-[#0D3B37] shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold leading-tight">
                    Fast Delivery
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-[#0D3B37]">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#0D3B37] shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold leading-tight">
                    Quality Products
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-[#0D3B37]">
                  <Handshake className="w-4 h-4 sm:w-5 sm:h-5 text-[#0D3B37] shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold leading-tight">
                    Reliable Service
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2.5 px-7 py-3 sm:py-3.5 bg-[#E0592A] hover:bg-[#C94B20] text-white font-bold text-xs sm:text-sm rounded-full transition-all shadow-md hover:shadow-lg hover:gap-3 cursor-pointer"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Visual Image Column */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden shadow-md">
                <Image
                  src="/images/client-mockup/hero-composition.png"
                  alt="Bangladeshi Artisan Products Composition"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                {/* Floating Support Local Products Sticker */}
                <div className="absolute top-3 sm:top-5 right-3 sm:right-5 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-full shadow-md border border-gray-100 flex items-center gap-1.5">
                  <span className="text-[11px] sm:text-xs font-bold text-[#0D3B37]">
                    Support Local Products
                  </span>
                  <Heart className="w-3.5 h-3.5 text-[#E0592A] fill-[#E0592A]" />
                </div>
              </div>

              {/* Carousel Arrows */}
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? 1 : 0))}
                className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-[#0D3B37] shadow-md border border-gray-100 flex items-center justify-center hover:bg-[#0D3B37] hover:text-white transition-colors cursor-pointer z-10"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? 1 : 0))}
                className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-[#0D3B37] shadow-md border border-gray-100 flex items-center justify-center hover:bg-[#0D3B37] hover:text-white transition-colors cursor-pointer z-10"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-6">
            <span
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === 0 ? "bg-[#E0592A] w-5" : "bg-gray-300"
              }`}
            />
            <span
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === 1 ? "bg-[#E0592A] w-5" : "bg-gray-300"
              }`}
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SHOP BY CATEGORY */}
      {/* ========================================================================= */}
      <section className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0D3B37]/10 flex items-center justify-center text-[#0D3B37]">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0D3B37]">
                Shop by Category
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Explore our wide range of products and services
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#0D3B37] hover:text-[#E0592A] transition-colors group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 6-Column Responsive Grid matching Client Design */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Category 1: Handicrafts */}
          <Link
            href="/shop?category=handicraft"
            className="bg-white hover:bg-[#FAF8F3] border border-gray-100 hover:border-[#0D3B37]/20 rounded-xl p-3.5 flex flex-col items-center text-center transition-all shadow-2xs hover:shadow-md group"
          >
            <div className="relative w-14 h-12 mb-2 flex items-center justify-center">
              <Image
                src="/images/client-mockup/cat-handicrafts.png"
                alt="Handicrafts"
                width={56}
                height={48}
                className="object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-xs font-semibold text-gray-800 group-hover:text-[#E0592A] transition-colors">
              Handicrafts
            </span>
          </Link>

          {/* Category 2: Jute Items */}
          <Link
            href="/shop?category=jute-items"
            className="bg-white hover:bg-[#FAF8F3] border border-gray-100 hover:border-[#0D3B37]/20 rounded-xl p-3.5 flex flex-col items-center text-center transition-all shadow-2xs hover:shadow-md group"
          >
            <div className="relative w-14 h-12 mb-2 flex items-center justify-center">
              <Image
                src="/images/client-mockup/cat-jute.png"
                alt="Jute Items"
                width={56}
                height={48}
                className="object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-xs font-semibold text-gray-800 group-hover:text-[#E0592A] transition-colors">
              Jute Items
            </span>
          </Link>

          {/* Category 3: Polymer */}
          <Link
            href="/shop?category=polymer"
            className="bg-white hover:bg-[#FAF8F3] border border-gray-100 hover:border-[#0D3B37]/20 rounded-xl p-3.5 flex flex-col items-center text-center transition-all shadow-2xs hover:shadow-md group"
          >
            <div className="relative w-14 h-12 mb-2 flex items-center justify-center">
              <Image
                src="/images/client-mockup/cat-polymer.png"
                alt="Polymer"
                width={56}
                height={48}
                className="object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-xs font-semibold text-gray-800 group-hover:text-[#E0592A] transition-colors">
              Polymer
            </span>
          </Link>

          {/* Category 4: Baby Items */}
          <Link
            href="/shop?category=baby-items"
            className="bg-white hover:bg-[#FAF8F3] border border-gray-100 hover:border-[#0D3B37]/20 rounded-xl p-3.5 flex flex-col items-center text-center transition-all shadow-2xs hover:shadow-md group"
          >
            <div className="relative w-14 h-12 mb-2 flex items-center justify-center">
              <Image
                src="/images/client-mockup/cat-baby.png"
                alt="Baby Items"
                width={56}
                height={48}
                className="object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-xs font-semibold text-gray-800 group-hover:text-[#E0592A] transition-colors">
              Baby Items
            </span>
          </Link>

          {/* Category 5: Corporate Gift Items */}
          <Link
            href="/shop?category=corporate-gift-items"
            className="bg-white hover:bg-[#FAF8F3] border border-gray-100 hover:border-[#0D3B37]/20 rounded-xl p-3.5 flex flex-col items-center text-center transition-all shadow-2xs hover:shadow-md group"
          >
            <div className="relative w-14 h-12 mb-2 flex items-center justify-center">
              <Image
                src="/images/client-mockup/cat-corporate.png"
                alt="Corporate Gift Items"
                width={56}
                height={48}
                className="object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-xs font-semibold text-gray-800 group-hover:text-[#E0592A] transition-colors">
              Corporate Gift Items
            </span>
          </Link>

          {/* Category 6: Rudiment Garments */}
          <Link
            href="/shop?category=rudiment-garments"
            className="bg-white hover:bg-[#FAF8F3] border border-gray-100 hover:border-[#0D3B37]/20 rounded-xl p-3.5 flex flex-col items-center text-center transition-all shadow-2xs hover:shadow-md group"
          >
            <div className="relative w-14 h-12 mb-2 flex items-center justify-center">
              <Image
                src="/images/client-mockup/cat-garments.png"
                alt="Rudiment Garments"
                width={56}
                height={48}
                className="object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-xs font-semibold text-gray-800 group-hover:text-[#E0592A] transition-colors">
              Rudiment Garments
            </span>
          </Link>

          {/* Row 2: Category 7 - Industrial Solutions */}
          <Link
            href="/shop?category=industrial-solutions"
            className="bg-white hover:bg-[#FAF8F3] border border-gray-100 hover:border-[#0D3B37]/20 rounded-xl p-3.5 flex flex-col items-center text-center transition-all shadow-2xs hover:shadow-md group"
          >
            <div className="relative w-14 h-12 mb-2 flex items-center justify-center">
              <Image
                src="/images/client-mockup/cat-industrial.png"
                alt="Industrial Solutions"
                width={56}
                height={48}
                className="object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-xs font-semibold text-gray-800 group-hover:text-[#E0592A] transition-colors">
              Industrial Solutions
            </span>
          </Link>

          {/* Category 8: Health & Beauty */}
          <Link
            href="/shop?category=health-and-beauty"
            className="bg-white hover:bg-[#FAF8F3] border border-gray-100 hover:border-[#0D3B37]/20 rounded-xl p-3.5 flex flex-col items-center text-center transition-all shadow-2xs hover:shadow-md group"
          >
            <div className="relative w-14 h-12 mb-2 flex items-center justify-center">
              <Image
                src="/images/client-mockup/cat-beauty.png"
                alt="Health & Beauty"
                width={56}
                height={48}
                className="object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-xs font-semibold text-gray-800 group-hover:text-[#E0592A] transition-colors">
              Health & Beauty
            </span>
          </Link>

          {/* Category 9: Agriculture */}
          <Link
            href="/shop?category=agriculture"
            className="bg-white hover:bg-[#FAF8F3] border border-gray-100 hover:border-[#0D3B37]/20 rounded-xl p-3.5 flex flex-col items-center text-center transition-all shadow-2xs hover:shadow-md group"
          >
            <div className="relative w-14 h-12 mb-2 flex items-center justify-center">
              <Image
                src="/images/client-mockup/cat-agriculture.png"
                alt="Agriculture"
                width={56}
                height={48}
                className="object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-xs font-semibold text-gray-800 group-hover:text-[#E0592A] transition-colors">
              Agriculture
            </span>
          </Link>

          {/* Category 10: Special E-Sheba / Services */}
          <Link
            href="/services"
            className="bg-white hover:bg-[#FAF8F3] border border-gray-100 hover:border-[#0D3B37]/20 rounded-xl p-3.5 flex flex-col items-center text-center transition-all shadow-2xs hover:shadow-md group"
          >
            <div className="relative w-14 h-12 mb-2 flex items-center justify-center">
              <Image
                src="/images/client-mockup/cat-services.png"
                alt="Special E-Sheba"
                width={56}
                height={48}
                className="object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-xs font-semibold text-gray-800 group-hover:text-[#E0592A] transition-colors">
              Special E-Sheba / Services
            </span>
          </Link>

          {/* Quality Products Better Life Banner (Spans 2 columns) */}
          <div className="col-span-2 relative bg-gradient-to-r from-[#0D3B37] to-[#124B46] rounded-xl p-4 sm:p-5 flex items-center justify-between overflow-hidden shadow-xs">
            <div className="space-y-2 z-10">
              <p className="text-white font-extrabold text-sm sm:text-base leading-snug">
                Quality Products
                <br />
                <span className="text-emerald-300">Better Life</span>
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E0592A] hover:bg-[#C94B20] text-white text-[11px] font-bold rounded-full transition-colors shadow-2xs"
              >
                <span>Explore Categories</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="relative w-28 h-20 shrink-0">
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
      {/* 3. FEATURED PRODUCTS (6 Products matching Client Mockup) */}
      {/* ========================================================================= */}
      <section className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Star className="w-5 h-5 fill-emerald-600 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0D3B37]">
                Featured Products
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Best selling and most popular products
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#0D3B37] hover:text-[#E0592A] transition-colors group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 6-Column Grid of Products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
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
                className="bg-white border border-gray-100 hover:border-gray-200 rounded-xl p-3 flex flex-col justify-between transition-all hover:shadow-md group relative"
              >
                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-gray-400 hover:text-[#E0592A] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                  title="Save to Wishlist"
                  aria-label="Save to Wishlist"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted
                        ? "fill-[#E0592A] text-[#E0592A]"
                        : "text-gray-400"
                    }`}
                  />
                </button>

                {/* Product Image */}
                <Link
                  href={`/products/${product.slug}`}
                  className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-50 mb-2.5 flex items-center justify-center group-hover:bg-[#FAF8F3] transition-colors"
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={180}
                    height={180}
                    className="object-contain p-2 group-hover:scale-105 transition-transform"
                  />
                </Link>

                {/* Details */}
                <div className="space-y-1">
                  <Link
                    href={`/products/${product.slug}`}
                    className="block font-semibold text-xs text-gray-800 hover:text-[#E0592A] transition-colors truncate"
                    title={product.name}
                  >
                    {product.name}
                  </Link>

                  <p className="text-[10px] text-gray-400 truncate">
                    {product.categoryName}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-[10px] text-amber-500">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-gray-700">
                      {product.rating ?? 4.8}
                    </span>
                    <span className="text-gray-400">
                      ({product.reviewCount ?? 80})
                    </span>
                  </div>

                  {/* Price & Discount */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="font-extrabold text-xs sm:text-sm text-[#0D3B37]">
                      ৳ {product.price}
                    </span>
                    {product.salePrice && (
                      <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                        ৳ {product.salePrice}
                      </span>
                    )}
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">
                      {discountPct}% OFF
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className={`w-full py-2 px-2 rounded-lg font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-[#0D3B37] hover:bg-[#E0592A] text-white"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
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

      {/* ========================================================================= */}
      {/* 4. PROMOTIONAL 3-COLUMN BANNER SECTION */}
      {/* ========================================================================= */}
      <section className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Special Offer UP TO 50% OFF */}
          <div className="relative bg-gradient-to-br from-[#E86230] to-[#CF4E1D] rounded-2xl p-6 sm:p-7 text-white flex flex-col justify-between overflow-hidden shadow-xs min-h-[220px]">
            <div className="space-y-1 z-10">
              <span className="text-xs font-bold text-white/90 uppercase tracking-wider">
                Special Offer
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                UP TO 50% OFF
              </h3>
              <p className="text-xs sm:text-sm text-white/90">
                On Selected Products
              </p>
            </div>

            <div className="pt-4 z-10">
              <Link
                href="/offers"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#CF4E1D] hover:bg-[#FAF8F3] font-bold text-xs rounded-full shadow-sm transition-all hover:gap-2.5"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="absolute right-2 bottom-2 w-36 h-32 opacity-95 pointer-events-none">
              <Image
                src="/images/client-mockup/promo-special-offer.png"
                alt="Special Offer"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Card 2: Our Services */}
          <div className="bg-[#FAF8F3] border border-[#EDE8DC] rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-2xs min-h-[220px]">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0D3B37]">
                Our Services
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                More than just products
              </p>

              {/* 4 Quick Service Actions in 2x2 grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/track-order"
                  className="bg-white hover:bg-gray-50 border border-gray-100 rounded-xl p-2.5 flex items-center gap-2 text-xs font-semibold text-gray-700 transition-colors shadow-2xs group"
                >
                  <Truck className="w-4 h-4 text-[#0D3B37] group-hover:text-[#E0592A] shrink-0" />
                  <span className="truncate">Home Delivery</span>
                </Link>

                <Link
                  href="/shop?category=corporate-gift-items"
                  className="bg-white hover:bg-gray-50 border border-gray-100 rounded-xl p-2.5 flex items-center gap-2 text-xs font-semibold text-gray-700 transition-colors shadow-2xs group"
                >
                  <Gift className="w-4 h-4 text-[#0D3B37] group-hover:text-[#E0592A] shrink-0" />
                  <span className="truncate">Corporate Gifts</span>
                </Link>

                <Link
                  href="/services"
                  className="bg-white hover:bg-gray-50 border border-gray-100 rounded-xl p-2.5 flex items-center gap-2 text-xs font-semibold text-gray-700 transition-colors shadow-2xs group"
                >
                  <Settings className="w-4 h-4 text-[#0D3B37] group-hover:text-[#E0592A] shrink-0" />
                  <span className="truncate">Custom Orders</span>
                </Link>

                <Link
                  href="/services"
                  className="bg-white hover:bg-gray-50 border border-gray-100 rounded-xl p-2.5 flex items-center gap-2 text-xs font-semibold text-gray-700 transition-colors shadow-2xs group"
                >
                  <Headset className="w-4 h-4 text-[#0D3B37] group-hover:text-[#E0592A] shrink-0" />
                  <span className="truncate">Special E-Sheba</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Stay Connected / Get in Touch */}
          <div className="bg-[#FAF8F3] border border-[#EDE8DC] rounded-2xl p-6 sm:p-7 flex items-center justify-between shadow-2xs relative overflow-hidden min-h-[220px]">
            <div className="space-y-2 z-10 max-w-[60%]">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Stay Connected
              </span>
              <h3 className="text-2xl font-extrabold text-[#0D3B37] leading-tight">
                Get in Touch
              </h3>

              {/* Chat Buttons */}
              <div className="flex items-center gap-3 pt-2">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/8801731214379"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                  title="Chat on WhatsApp"
                >
                  <span className="text-base font-bold">✆</span>
                </a>

                {/* Messenger */}
                <a
                  href="https://m.me/shoilpikkabbo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#0084FF] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                  title="Chat on Messenger"
                >
                  <span className="text-base font-bold">💬</span>
                </a>
              </div>

              <p className="text-[11px] text-gray-500 pt-1">
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
      {/* 5. WHY CHOOSE SHOILPIKKABBO (Trust Section) */}
      {/* ========================================================================= */}
      <section className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 4 Features (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#0D3B37]">
                  <ShieldCheck className="w-5 h-5 text-[#0D3B37]" />
                  <h3 className="text-xl sm:text-2xl font-bold">
                    Why Choose SHOILPIKKABBO?
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Your trust is our biggest asset
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="w-9 h-9 rounded-full bg-[#FAF8F3] text-[#0D3B37] flex items-center justify-center mx-auto sm:mx-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-800">
                    Wide Product Range
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    From local to modern
                  </p>
                </div>

                <div className="space-y-1 text-center sm:text-left">
                  <div className="w-9 h-9 rounded-full bg-[#FAF8F3] text-[#0D3B37] flex items-center justify-center mx-auto sm:mx-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-800">
                    Secure Payment
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Safe & trusted transaction
                  </p>
                </div>

                <div className="space-y-1 text-center sm:text-left">
                  <div className="w-9 h-9 rounded-full bg-[#FAF8F3] text-[#0D3B37] flex items-center justify-center mx-auto sm:mx-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-800">
                    Fast Delivery
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    On time, every time
                  </p>
                </div>

                <div className="space-y-1 text-center sm:text-left">
                  <div className="w-9 h-9 rounded-full bg-[#FAF8F3] text-[#0D3B37] flex items-center justify-center mx-auto sm:mx-0">
                    <Headset className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-800">
                    Customer Support
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Always here for you
                  </p>
                </div>
              </div>
            </div>

            {/* Right Brand Mission Banner (5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-r from-[#0D3B37] to-[#124B46] rounded-xl p-5 sm:p-6 text-white flex items-center justify-between gap-4 shadow-sm relative overflow-hidden">
              <div className="space-y-2.5 z-10 max-w-[65%]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 shrink-0">
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

                <p className="text-xs sm:text-[13px] text-white/90 leading-relaxed font-light">
                  &ldquo;We are committed to delivering high-quality products
                  and services with trust, care and reliability to make your
                  life easier.&rdquo;
                </p>
              </div>

              <div className="relative w-28 h-24 shrink-0">
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
  );
}
