"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus, Check, Copy, Heart, Star, ShoppingCart } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";
import { CLIENT_INFO, MOCK_PRODUCTS } from "@/data/mock-data";

export default function OffersPage() {
  const { settings } = useSettings();
  const { addToCart, setIsCartOpen } = useCart();
  const [copied, setCopied] = React.useState(false);
  const [addedItem, setAddedItem] = React.useState<string | null>(null);
  const [wishlist, setWishlist] = React.useState<Record<string, boolean>>({});

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddProduct = (productId: string, productName: string) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (product) {
      addToCart(product, 1);
      setAddedItem(productName);
      setTimeout(() => setAddedItem(null), 2000);
      setIsCartOpen(true);
    }
  };

  return (
    <StorefrontLayout>
      <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-8 sm:py-12 pb-16">
        <div className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-4">
            <Link href="/" className="hover:text-[#E0592A] transition-colors">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#0D3B37] font-bold">Offers & Discounts</span>
          </nav>

          {/* Headline & Subtitle */}
          <div className="mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0D3B37] tracking-tight leading-tight">
              Exclusive Offers & Discounts
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-normal mt-2">
              Enjoy verified discount coupons, seasonal reductions, and artisanal gift packages.
            </p>
          </div>

          {/* Hero Promo Card */}
          <div className="bg-gradient-to-r from-[#0D3B37] to-[#124B46] text-white rounded-3xl overflow-hidden mb-14 shadow-[0_4px_24px_rgba(13,59,55,0.12)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left Column: Coupon Info (7 cols) */}
              <div className="lg:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
                <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest block mb-2.5">
                  WELCOME VOUCHER · NEW CUSTOMERS
                </span>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-2">
                  Enjoy Instant Savings
                </h2>

                <p className="text-sm sm:text-base text-emerald-100 font-normal mb-6">
                  ৳150 off on all orders of ৳1,500 or more with promo voucher.
                </p>

                {/* Dashed Code Box */}
                <div className="mb-5">
                  <button
                    type="button"
                    onClick={() => handleCopyCode("WELCOME150")}
                    className="border border-dashed border-emerald-400/60 hover:border-white px-5 py-3 rounded-2xl bg-white/10 inline-flex items-center gap-3.5 transition-all cursor-pointer group shadow-xs"
                    title="Click to copy code"
                  >
                    <span className="font-mono text-base text-white tracking-widest font-bold">
                      WELCOME150
                    </span>
                    {copied ? (
                      <span className="text-xs text-emerald-300 flex items-center gap-1 font-sans font-bold">
                        <Check className="w-4 h-4 text-emerald-300" />
                        Copied!
                      </span>
                    ) : (
                      <span className="text-xs text-white/80 group-hover:text-white flex items-center gap-1 font-sans font-semibold">
                        <Copy className="w-4 h-4" />
                        Copy Code
                      </span>
                    )}
                  </button>
                </div>

                <div className="text-xs text-emerald-200/80 font-normal leading-relaxed mb-6 space-y-1">
                  <p>Valid for all registered clients across Bangladesh · Expires 30 Nov 2026</p>
                  <p>Applicable during checkout on any handcrafted or packaged essentials.</p>
                </div>

                <div>
                  <Link
                    href="/shop"
                    className="bg-[#E0592A] hover:bg-[#c94b20] text-white text-sm font-bold px-6 py-3 rounded-xl inline-flex items-center gap-2 transition-all cursor-pointer w-fit shadow-md hover:shadow-lg"
                  >
                    <span>Explore Products to Redeem</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Gift Image (5 cols) */}
              <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-[#18534C]">
                <Image
                  src="/images/corporate-gifting-feature.png"
                  alt="Special gift package"
                  fill
                  sizes="(max-width: 1024px) 100vw, 440px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Toast Notification when item is added */}
          {addedItem && (
            <div className="fixed bottom-6 right-6 z-50 bg-[#143527] text-white px-4 py-3 rounded-[3px] shadow-lg flex items-center gap-2.5 text-[13px] animate-fade-in">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Added <strong>{addedItem}</strong> to your bag.</span>
            </div>
          )}

          {/* Bottom Section: Good finds. Better prices. */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0D3B37] tracking-tight">
                Special Marked Reductions
              </h2>
              <span className="text-xs font-bold text-[#E0592A] uppercase tracking-wider">
                PRICES AS MARKED
              </span>
            </div>

            {/* 3 Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Product 1 */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all duration-300 group relative border border-gray-100">
                {/* For You / Discount Badge on Top Left */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                  <span className="text-[9px] sm:text-[10px] font-bold text-white bg-gradient-to-r from-[#E0592A] to-[#F59E0B] px-2 py-0.5 rounded-md shadow-2xs">
                    12% OFF
                  </span>
                </div>

                {/* Wishlist Button on Top Right */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist("prod-jute-basket");
                  }}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-gray-400 hover:text-[#E0592A] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  title="Save to Wishlist"
                  aria-label="Save to Wishlist"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      wishlist["prod-jute-basket"]
                        ? "fill-[#E0592A] text-[#E0592A]"
                        : "text-gray-400"
                    }`}
                  />
                </button>

                <div>
                  <Link
                    href="/products/everyday-jute-basket"
                    className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#FAF8F5] mb-3 flex items-center justify-center p-2 group-hover:bg-[#F5F1E9] transition-colors block cursor-pointer"
                  >
                    <Image
                      src="/images/product-jute-basket.png"
                      alt="Everyday jute basket"
                      fill
                      sizes="(max-width: 640px) 100vw, 320px"
                      className="object-contain p-2 group-hover:scale-106 transition-transform duration-300"
                    />
                  </Link>

                  <span className="text-[11px] text-gray-400 font-medium block truncate">
                    Jute items
                  </span>
                  <Link
                    href="/products/everyday-jute-basket"
                    className="block font-semibold text-xs sm:text-sm text-gray-900 hover:text-[#E0592A] transition-colors line-clamp-2 mt-0.5 cursor-pointer leading-snug"
                  >
                    Everyday jute basket
                  </Link>

                  {/* Star Rating Row */}
                  <div className="flex items-center gap-1 text-xs text-amber-500 pt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-gray-700">4.9</span>
                    <span className="text-gray-400 text-[10.5px]">(38)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 flex-wrap pt-2">
                    <span className="font-extrabold text-sm sm:text-base text-[#0D3B37]">
                      ৳ 1,450
                    </span>
                    <span className="text-[11px] text-gray-400 line-through">
                      ৳ 1,650
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      12% OFF
                    </span>
                  </div>
                </div>

                {/* Full-width Add to Cart Button */}
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => handleAddProduct("prod-jute-basket", "Everyday jute basket")}
                    className={`w-full py-2.5 sm:py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                      addedItem === "Everyday jute basket"
                        ? "bg-emerald-600 text-white"
                        : "bg-[#0D3B37] hover:bg-[#E0592A] text-white active:scale-95"
                    }`}
                  >
                    {addedItem === "Everyday jute basket" ? (
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

              {/* Product 2 */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all duration-300 group relative border border-gray-100">
                {/* For You / Discount Badge on Top Left */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                  <span className="text-[9px] sm:text-[10px] font-bold text-white bg-gradient-to-r from-[#E0592A] to-[#F59E0B] px-2 py-0.5 rounded-md shadow-2xs">
                    11% OFF
                  </span>
                </div>

                {/* Wishlist Button on Top Right */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist("prod-jute-tote");
                  }}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-gray-400 hover:text-[#E0592A] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  title="Save to Wishlist"
                  aria-label="Save to Wishlist"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      wishlist["prod-jute-tote"]
                        ? "fill-[#E0592A] text-[#E0592A]"
                        : "text-gray-400"
                    }`}
                  />
                </button>

                <div>
                  <Link
                    href="/products/everyday-jute-tote"
                    className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#FAF8F5] mb-3 flex items-center justify-center p-2 group-hover:bg-[#F5F1E9] transition-colors block cursor-pointer"
                  >
                    <Image
                      src="/images/product-jute-tote.png"
                      alt="The everyday jute tote"
                      fill
                      sizes="(max-width: 640px) 100vw, 320px"
                      className="object-contain p-2 group-hover:scale-106 transition-transform duration-300"
                    />
                  </Link>

                  <span className="text-[11px] text-gray-400 font-medium block truncate">
                    Jute items
                  </span>
                  <Link
                    href="/products/everyday-jute-tote"
                    className="block font-semibold text-xs sm:text-sm text-gray-900 hover:text-[#E0592A] transition-colors line-clamp-2 mt-0.5 cursor-pointer leading-snug"
                  >
                    The everyday jute tote
                  </Link>

                  {/* Star Rating Row */}
                  <div className="flex items-center gap-1 text-xs text-amber-500 pt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-gray-700">4.8</span>
                    <span className="text-gray-400 text-[10.5px]">(24)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 flex-wrap pt-2">
                    <span className="font-extrabold text-sm sm:text-base text-[#0D3B37]">
                      ৳ 850
                    </span>
                    <span className="text-[11px] text-gray-400 line-through">
                      ৳ 950
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      11% OFF
                    </span>
                  </div>
                </div>

                {/* Full-width Add to Cart Button */}
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => handleAddProduct("prod-jute-tote", "The everyday jute tote")}
                    className={`w-full py-2.5 sm:py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                      addedItem === "The everyday jute tote"
                        ? "bg-emerald-600 text-white"
                        : "bg-[#0D3B37] hover:bg-[#E0592A] text-white active:scale-95"
                    }`}
                  >
                    {addedItem === "The everyday jute tote" ? (
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

              {/* Column 3: Information Card */}
              <div className="col-span-2 md:col-span-1 bg-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-emerald-100">
                <div>
                  <span className="text-xs font-bold text-[#E0592A] uppercase tracking-wider block mb-2">
                    HELPFUL PROMO TIPS
                  </span>
                  <h3 className="text-xl font-bold text-[#0D3B37] mb-3">
                    Easy Code Redemption
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    Enter your coupon code in the shopping bag. Reductions are reflected in your subtotal before confirming your order.
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Have any questions regarding eligible order amounts or bulk discounts? Chat directly with our customer concierge.
                  </p>
                </div>

                <div className="pt-6">
                  <a
                    href={`${settings.socialWhatsapp || "https://wa.me/8801731214379"}?text=Hello%20Shoilpikkabbo%2C%20I%20have%20a%20question%20about%20offers.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0D3B37] hover:bg-[#E0592A] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl inline-flex items-center gap-2 transition-all cursor-pointer w-fit shadow-xs"
                  >
                    <span>Ask on WhatsApp</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
