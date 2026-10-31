"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Copy,
  Heart,
  Star,
  ShoppingCart,
  Tag,
  Sparkles,
  TicketPercent,
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";
import { useWishlist } from "@/context/WishlistContext";
import { couponsApi, productsApi } from "@/lib/api";
import { MOCK_PRODUCTS } from "@/data/mock-data";

interface CouponItem {
  id: string;
  code: string;
  discountType?: "PERCENTAGE" | "FIXED";
  discountValue: number | string;
  minOrderAmount?: number | string;
  maxDiscountAmount?: number | string;
  endDate: string;
}

export default function OffersPage() {
  const { settings } = useSettings();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [coupons, setCoupons] = React.useState<CouponItem[]>([]);
  const [offerProducts, setOfferProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [addedProductId, setAddedProductId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function loadOffersData() {
      try {
        const [couponRes, prodRes] = await Promise.all([
          couponsApi.getPublic().catch(() => null),
          productsApi.getAll({ limit: 100 }).catch(() => null),
        ]);

        if (!mounted) return;

        // 1. Process Live Coupons from Admin
        if (couponRes && couponRes.success && Array.isArray(couponRes.data) && couponRes.data.length > 0) {
          setCoupons(couponRes.data);
        } else {
          // Fallback initial coupon if none created in admin yet
          setCoupons([
            {
              id: "fallback-welcome",
              code: "WELCOME150",
              discountType: "FIXED",
              discountValue: 150,
              minOrderAmount: 1500,
              endDate: "2026-12-31T23:59:59.000Z",
            },
          ]);
        }

        // 2. Process Discounted Products
        let candidateProducts: any[] = [];
        if (prodRes && prodRes.success && Array.isArray(prodRes.data) && prodRes.data.length > 0) {
          candidateProducts = prodRes.data;
        } else {
          candidateProducts = MOCK_PRODUCTS;
        }

        // Find products with active discount prices
        const discounted = candidateProducts.filter((p: any) => {
          const price = Number(p.price) || 0;
          const salePrice = p.salePrice ? Number(p.salePrice) : 0;
          return salePrice > 0 && salePrice !== price;
        });

        // If specific discounted items exist, use them; otherwise use top featured items
        if (discounted.length > 0) {
          setOfferProducts(discounted);
        } else {
          setOfferProducts(candidateProducts.slice(0, 8));
        }
      } catch (err) {
        console.error("Failed to load offers page data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadOffersData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleQuickAdd = (product: any) => {
    const imageUrl =
      product.images && product.images.length > 0 && product.images[0]?.url
        ? product.images[0].url
        : product.imageUrl || "/images/client-mockup/cat-handicrafts.png";

    addToCart(
      {
        id: product.id,
        name: product.name,
        slug: product.slug || product.id,
        categoryId: product.categoryId || "",
        categoryName: product.category?.name || product.categoryName || "Handicrafts",
        stock: product.stock ?? 10,
        sku: product.sku || `SKU-${product.id?.slice(0, 6)}`,
        rating: product.rating ?? 5,
        reviewCount: product.reviewCount ?? 1,
        price: Number(product.price),
        salePrice: product.salePrice ? Number(product.salePrice) : undefined,
        imageUrl,
        galleryUrls: product.images?.map((img: any) => img.url) || [imageUrl],
        description: product.description || product.name,
        specifications: product.specifications || {},
      },
      1
    );
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1800);
  };

  // Primary Featured Hero Coupon
  const primaryCoupon = coupons[0] || {
    id: "default",
    code: "WELCOME150",
    discountType: "FIXED",
    discountValue: 150,
    minOrderAmount: 1500,
    endDate: "2026-12-31T23:59:59.000Z",
  };

  const secondaryCoupons = coupons.slice(1);

  return (
    <StorefrontLayout>
      <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-8 sm:py-12 pb-16">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-[#E0592A] text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Deals & Verified Vouchers</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0D3B37] tracking-tight leading-tight">
              Exclusive Offers & Discounts
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-normal mt-2 max-w-2xl">
              Enjoy verified discount coupons, seasonal price reductions, and artisanal promotions across all categories.
            </p>
          </div>

          {/* Hero Promo Voucher Card (Dynamic from Admin Coupons) */}
          <div className="bg-gradient-to-r from-[#0D3B37] via-[#0F443F] to-[#124B46] text-white rounded-3xl overflow-hidden mb-12 shadow-[0_4px_24px_rgba(13,59,55,0.12)] border border-emerald-900/30">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left Column: Coupon Info (7 cols) */}
              <div className="lg:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
                <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest block mb-2.5 flex items-center gap-1.5">
                  <TicketPercent className="w-4 h-4" />
                  <span>SPECIAL PROMO VOUCHER · LIMITED TIME</span>
                </span>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-2">
                  {primaryCoupon.discountType === "PERCENTAGE"
                    ? `Enjoy ${primaryCoupon.discountValue}% Instant Savings`
                    : `Enjoy ৳${primaryCoupon.discountValue} Instant Savings`}
                </h2>

                <p className="text-sm sm:text-base text-emerald-100 font-normal mb-6">
                  {Number(primaryCoupon.minOrderAmount) > 0 ? (
                    <>Applicable on all orders of <strong>৳{Number(primaryCoupon.minOrderAmount).toLocaleString()}</strong> or more.</>
                  ) : (
                    <>Applicable on all orders across the store with no minimum purchase.</>
                  )}
                </p>

                {/* Dashed Code Box with 1-Click Copy */}
                <div className="mb-5">
                  <button
                    type="button"
                    onClick={() => handleCopyCode(primaryCoupon.code)}
                    className="border border-dashed border-emerald-300/80 hover:border-white px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 inline-flex items-center gap-3.5 transition-all cursor-pointer group shadow-sm active:scale-98"
                    title="Click to copy voucher code"
                  >
                    <span className="font-mono text-lg text-white tracking-widest font-extrabold">
                      {primaryCoupon.code}
                    </span>
                    {copiedCode === primaryCoupon.code ? (
                      <span className="text-xs text-emerald-300 flex items-center gap-1 font-sans font-bold bg-emerald-950/40 px-2 py-0.5 rounded">
                        <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
                        Copied!
                      </span>
                    ) : (
                      <span className="text-xs text-white/90 group-hover:text-white flex items-center gap-1.5 font-sans font-semibold">
                        <Copy className="w-4 h-4" />
                        Copy Code
                      </span>
                    )}
                  </button>
                </div>

                <div className="text-xs text-emerald-200/80 font-normal leading-relaxed mb-6 space-y-1">
                  <p>
                    Valid for all orders across Bangladesh · Expires on{" "}
                    <strong>
                      {new Date(primaryCoupon.endDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </strong>
                  </p>
                  <p>Apply this code in your shopping bag or during checkout to authorize instant deduction.</p>
                </div>

                <div>
                  <Link
                    href="/shop"
                    className="bg-[#E0592A] hover:bg-[#c94b20] text-white text-sm font-bold px-6 py-3 rounded-xl inline-flex items-center gap-2 transition-all cursor-pointer w-fit shadow-md hover:shadow-lg active:scale-98"
                  >
                    <span>Shop Products to Redeem</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Gift Image (5 cols) */}
              <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-[#18534C]">
                <Image
                  src="/images/corporate-gifting-feature.png"
                  alt="Special Shoilpikkabbo promo gift package"
                  fill
                  sizes="(max-width: 1024px) 100vw, 440px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Additional Active Coupons Grid (if multiple coupons created in Admin) */}
          {secondaryCoupons.length > 0 && (
            <div className="mb-14">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-[#E0592A]" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#0D3B37]">
                  More Available Coupons
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {secondaryCoupons.map((c) => {
                  const isCopied = copiedCode === c.code;
                  return (
                    <div
                      key={c.id}
                      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-emerald-200 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                            {c.discountType === "PERCENTAGE" ? `${c.discountValue}% OFF` : `৳${c.discountValue} OFF`}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            Expires {new Date(c.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                        <h3 className="font-mono text-base font-bold text-gray-900 tracking-wider">
                          {c.code}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {Number(c.minOrderAmount) > 0
                            ? `Min order ৳${Number(c.minOrderAmount).toLocaleString()}`
                            : "No minimum purchase required"}
                        </p>
                      </div>

                      <div className="pt-4 mt-2 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => handleCopyCode(c.code)}
                          className="w-full py-2 px-3 rounded-lg text-xs font-bold text-[#0D3B37] bg-emerald-50 hover:bg-[#0D3B37] hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Copied to Clipboard!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Coupon Code</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Toast Notification when item is added */}
          {addedProductId && (
            <div className="fixed bottom-6 right-6 z-50 bg-[#0D3B37] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm animate-fade-in border border-emerald-500/30">
              <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
              <span>Added product to your bag.</span>
            </div>
          )}

          {/* Bottom Section: Special Marked Reductions / Discounted Products */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0D3B37] tracking-tight">
                  Special Marked Reductions
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Exclusive price discounts applied directly — no promo code required.
                </p>
              </div>
              <span className="text-xs font-bold text-[#E0592A] uppercase tracking-wider">
                PRICES AS MARKED
              </span>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {offerProducts.map((prod) => {
                const imageSrc =
                  prod.images && prod.images.length > 0 && prod.images[0]?.url
                    ? prod.images[0].url
                    : prod.imageUrl || "/images/client-mockup/cat-handicrafts.png";

                const price = Number(prod.price) || 0;
                const salePrice = prod.salePrice ? Number(prod.salePrice) : null;
                const isAdded = addedProductId === prod.id;
                const isWishlisted = isInWishlist(prod.id);

                // Calculate discount percent
                let discountPct = 0;
                let regularPrice = price;
                let currentPrice = price;

                if (salePrice && salePrice < price) {
                  regularPrice = price;
                  currentPrice = salePrice;
                  discountPct = Math.round(((price - salePrice) / price) * 100);
                } else if (salePrice && salePrice > price) {
                  regularPrice = salePrice;
                  currentPrice = price;
                  discountPct = Math.round(((salePrice - price) / salePrice) * 100);
                } else {
                  discountPct = 15;
                  regularPrice = Math.round(price * 1.15);
                  currentPrice = price;
                }

                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all duration-300 group relative border border-gray-100"
                  >
                    {/* Discount Badge on Top Left */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                      <span className="text-[9px] sm:text-[10px] font-bold text-white bg-gradient-to-r from-[#E0592A] to-[#F59E0B] px-2 py-0.5 rounded-md shadow-2xs">
                        {discountPct}% OFF
                      </span>
                    </div>

                    {/* Wishlist Button on Top Right */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist({
                          id: prod.id,
                          name: prod.name,
                          slug: prod.slug || prod.id,
                          categoryName: prod.category?.name || prod.categoryName,
                          price: Number(prod.price) || 0,
                          salePrice: prod.salePrice ? Number(prod.salePrice) : undefined,
                          imageUrl: imageSrc,
                          stock: prod.stock,
                          rating: prod.rating,
                          reviewCount: prod.reviewCount,
                        });
                      }}
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
                      {/* 1:1 Product Image */}
                      <Link
                        href={`/products/${prod.slug}`}
                        className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#FAF8F5] mb-3 flex items-center justify-center p-3 group-hover:bg-[#F5F1E9] transition-colors block cursor-pointer"
                      >
                        <Image
                          src={imageSrc}
                          alt={prod.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                          className="object-contain p-2 group-hover:scale-106 transition-transform duration-300"
                        />
                      </Link>

                      {/* Category Name */}
                      <span className="text-[11px] text-gray-400 font-medium block truncate">
                        {prod.category?.name || prod.categoryName || "Artisanal"}
                      </span>

                      {/* Product Title (Fixed 2-line clamp) */}
                      <Link
                        href={`/products/${prod.slug}`}
                        className="block font-semibold text-xs sm:text-sm text-gray-900 group-hover:text-[#E0592A] transition-colors line-clamp-2 mt-0.5 cursor-pointer leading-snug h-10 overflow-hidden"
                        title={prod.name}
                      >
                        {prod.name}
                      </Link>

                      {/* Star Rating Row */}
                      <div className="flex items-center gap-1 text-xs text-amber-500 pt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-gray-700">{prod.rating || 4.8}</span>
                        <span className="text-gray-400 text-[10.5px]">
                          ({prod.reviewCount || 24})
                        </span>
                      </div>

                      {/* Price Row */}
                      <div className="flex items-center gap-2 flex-wrap pt-2">
                        <span className="font-extrabold text-sm sm:text-base text-[#0D3B37]">
                          ৳ {currentPrice.toLocaleString()}
                        </span>
                        {regularPrice > currentPrice && (
                          <span className="text-[11px] text-gray-400 line-through">
                            ৳ {regularPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {discountPct}% OFF
                        </span>
                      </div>
                    </div>

                    {/* Transparent Add to Cart Button (Solid on hover) */}
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(prod)}
                        className={`w-full py-2.5 sm:py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                          isAdded
                            ? "bg-emerald-600 text-white border border-emerald-600 shadow-sm"
                            : "bg-transparent text-[#0D3B37] border border-[#0D3B37]/35 hover:bg-[#0D3B37] hover:text-white hover:border-[#0D3B37] hover:shadow-md active:scale-98"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>Added to Cart</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Information / Concierge Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-emerald-100">
                <div>
                  <span className="text-xs font-bold text-[#E0592A] uppercase tracking-wider block mb-2">
                    HELPFUL PROMO TIPS
                  </span>
                  <h3 className="text-xl font-bold text-[#0D3B37] mb-3">
                    Easy Code Redemption
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    Enter your copied promo code in the shopping cart or checkout screen. Deductions are calculated automatically before confirming your order.
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Need customized corporate gift boxes or special bulk procurement discounts? Our concierge is ready to assist.
                  </p>
                </div>

                <div className="pt-6">
                  <a
                    href={`${settings.socialWhatsapp || "https://wa.me/8801731214379"}?text=Hello%20Shoilpikkabbo%2C%20I%20have%20a%20question%20about%20offers%20and%20discounts.`}
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
