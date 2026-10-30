"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Plus,
  Minus,
  Check,
  Star,
  Heart,
  ShoppingCart,
  Sparkles,
  ArrowRight,
  Truck,
  ShieldCheck,
  Package,
  ChevronLeft,
  ChevronRight,
  Share2,
  RotateCcw,
  CreditCard,
  Zap,
  Copy,
  Info,
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { useCart } from "@/context/CartContext";
import { MOCK_PRODUCTS, Product } from "@/data/mock-data";
import { productsApi } from "@/lib/api";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { addToCart, setIsCartOpen } = useCart();

  const fallbackProduct =
    MOCK_PRODUCTS.find((p) => p.slug === slug) || MOCK_PRODUCTS[0];

  const [product, setProduct] = React.useState<Product>(fallbackProduct);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [galleryImages, setGalleryImages] = React.useState<string[]>([
    fallbackProduct.imageUrl,
  ]);
  const [selectedImage, setSelectedImage] = React.useState<string>(
    fallbackProduct.imageUrl
  );
  const [quantity, setQuantity] = React.useState<number>(1);
  const [isAdded, setIsAdded] = React.useState<boolean>(false);
  const [isCopied, setIsCopied] = React.useState<boolean>(false);
  const [wishlist, setWishlist] = React.useState<Record<string, boolean>>({});
  const [liveRecommended, setLiveRecommended] = React.useState<any[]>([]);
  const [addedCrossSellId, setAddedCrossSellId] = React.useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = React.useState<
    "description" | "specs" | "shipping" | "care"
  >("description");

  // Fetch product from live backend
  React.useEffect(() => {
    let isMounted = true;
    if (slug) {
      setLoading(true);
      fetch(`http://localhost:5000/api/v1/products/${encodeURIComponent(slug)}`)
        .then((res) => res.json())
        .then((json) => {
          if (isMounted && json.success && json.data) {
            const p = json.data;
            const imagesList: string[] = [];

            if (p.images && Array.isArray(p.images)) {
              p.images.forEach((img: any) => {
                const u = typeof img === "string" ? img : img.url;
                if (u && !imagesList.includes(u)) imagesList.push(u);
              });
            }
            if (p.imageUrl && !imagesList.includes(p.imageUrl)) {
              imagesList.unshift(p.imageUrl);
            }
            if (imagesList.length === 0) {
              imagesList.push("/images/client-mockup/cat-handicrafts.png");
            }

            const mappedProduct: Product = {
              id: p.id,
              name: p.name,
              slug: p.slug,
              categoryId: p.categoryId,
              categoryName: p.category?.name || "Handicraft",
              price: Number(p.price),
              salePrice: p.salePrice ? Number(p.salePrice) : undefined,
              stock: p.stock !== undefined ? Number(p.stock) : 25,
              sku: p.sku || `SK-${p.slug}`,
              rating: 4.9,
              reviewCount: 28,
              imageUrl: imagesList[0],
              galleryUrls: imagesList,
              description: p.description || p.name,
              specifications: p.specifications || {},
            };

            setProduct(mappedProduct);
            setGalleryImages(imagesList);
            setSelectedImage(imagesList[0]);
          }
        })
        .catch((err) => {
          console.warn("Could not load live product:", err);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Fetch Recommended Products from PostgreSQL
  React.useEffect(() => {
    let isMounted = true;
    productsApi
      .getAll({ limit: 8 })
      .then((res) => {
        if (isMounted && res.success && Array.isArray(res.data)) {
          const filtered = res.data
            .filter((p: any) => p.slug !== slug)
            .slice(0, 4);
          setLiveRecommended(filtered);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Gallery Navigation
  const currentImageIndex = Math.max(0, galleryImages.indexOf(selectedImage));

  const handlePrevImage = () => {
    if (galleryImages.length <= 1) return;
    const prevIdx =
      (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[prevIdx]);
  };

  const handleNextImage = () => {
    if (galleryImages.length <= 1) return;
    const nextIdx = (currentImageIndex + 1) % galleryImages.length;
    setSelectedImage(galleryImages[nextIdx]);
  };

  // Touch Swipe for mobile gallery
  const [touchStartX, setTouchStartX] = React.useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 40) handleNextImage();
    else if (diff < -40) handlePrevImage();
    setTouchStartX(null);
  };

  // Pricing & Discounts
  const regularPrice = Number(product.price) || 0;
  const salePrice = product.salePrice ? Number(product.salePrice) : undefined;
  const hasDiscount = salePrice !== undefined && salePrice < regularPrice;
  const currentPrice = hasDiscount ? salePrice : regularPrice;
  const originalPrice = hasDiscount ? regularPrice : undefined;
  const savingsAmount = hasDiscount ? regularPrice - salePrice : 0;
  const discountPercent = hasDiscount
    ? Math.round((savingsAmount / regularPrice) * 100)
    : 0;

  // Actions
  const handleAddToCart = () => {
    addToCart({ ...product, price: currentPrice }, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, price: currentPrice }, quantity);
    router.push("/checkout");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCrossSellAdd = (item: any) => {
    addToCart(
      {
        id: item.id,
        name: item.name,
        slug: item.slug,
        categoryId: item.categoryId,
        categoryName: item.category?.name || "Artisanal",
        price: Number(item.salePrice || item.price),
        salePrice: item.salePrice ? Number(item.salePrice) : undefined,
        imageUrl:
          item.images?.[0]?.url ||
          item.imageUrl ||
          "/images/client-mockup/cat-handicrafts.png",
        galleryUrls: (item.images || []).map((img: any) => img.url),
        stock: item.stock ?? 20,
        sku: item.sku || `SK-${item.slug}`,
        rating: 4.9,
        reviewCount: 18,
        description: item.description || "",
        specifications: (item.specifications as Record<string, string>) || {},
      },
      1
    );
    setAddedCrossSellId(item.id);
    setTimeout(() => setAddedCrossSellId(null), 1500);
    setIsCartOpen(true);
  };

  return (
    <StorefrontLayout>
      <div className="bg-[#FAF8F5] min-h-screen pb-16">
        <div className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* ========================================================================= */}
          {/* 1. BREADCRUMBS & SHARE / WISHLIST ROW */}
          {/* ========================================================================= */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8 pb-4 border-b border-[#EAE3D5]/60">
            <nav
              aria-label="Breadcrumbs"
              className="flex items-center gap-2 text-xs text-gray-500 font-medium flex-wrap"
            >
              <Link
                href="/"
                className="hover:text-[#E0592A] transition-colors"
              >
                Home
              </Link>
              <span className="text-gray-300">/</span>
              <Link
                href={`/shop?category=${encodeURIComponent(
                  product.categoryName.toLowerCase().replace(/ /g, "-")
                )}`}
                className="hover:text-[#E0592A] transition-colors font-semibold"
              >
                {product.categoryName}
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-[#0D3B37] font-bold line-clamp-1 max-w-[280px] sm:max-w-md">
                {product.name}
              </span>
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#EAE3D5] text-xs font-semibold text-gray-700 hover:text-[#0D3B37] hover:border-[#0D3B37] transition-all shadow-2xs cursor-pointer"
                title="Share product link"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-gray-500" />
                    <span>Share</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`p-2 rounded-xl bg-white border border-[#EAE3D5] transition-all shadow-2xs cursor-pointer ${
                  wishlist[product.id]
                    ? "text-[#E0592A] border-[#E0592A]"
                    : "text-gray-400 hover:text-[#E0592A]"
                }`}
                title="Add to Wishlist"
              >
                <Heart
                  className={`w-4 h-4 ${
                    wishlist[product.id] ? "fill-[#E0592A]" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. MAIN PRESENTATION: TWO COLUMNS (GALLERY & BUY BOX) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start pb-14 sm:pb-20">
            {/* --------------------------------------------------------------------- */}
            {/* LEFT COLUMN: MULTI-IMAGE VISUAL GALLERY (6 COLS) */}
            {/* --------------------------------------------------------------------- */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Showcase Image Frame */}
              <div
                className="group relative w-full aspect-square sm:aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#EAE3D5]/80 flex items-center justify-center select-none"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <Image
                  src={selectedImage || galleryImages[0]}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                />

                {/* Hot Discount Pill Badge */}
                {hasDiscount && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-[#E0592A] to-[#F59E0B] text-white text-xs font-black tracking-wide shadow-md">
                    {discountPercent}% OFF
                  </span>
                )}

                {/* Image Counter Badge */}
                {galleryImages.length > 1 && (
                  <span className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-bold shadow-xs">
                    {currentImageIndex + 1} / {galleryImages.length}
                  </span>
                )}

                {/* Left/Right Circular Arrow Controls (Hidden on small mobile, visible on desktop/hover) */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/95 hover:bg-white text-[#0D3B37] shadow-lg opacity-85 group-hover:opacity-100 transition-all cursor-pointer hover:scale-110 items-center justify-center z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/95 hover:bg-white text-[#0D3B37] shadow-lg opacity-85 group-hover:opacity-100 transition-all cursor-pointer hover:scale-110 items-center justify-center z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  </>
                )}
              </div>

              {/* Multiple Thumbnails Row */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {galleryImages.map((imgUrl, idx) => {
                    const isSelected = selectedImage === imgUrl;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(imgUrl)}
                        className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden bg-white p-1.5 shrink-0 border-2 transition-all cursor-pointer shadow-2xs ${
                          isSelected
                            ? "border-[#0D3B37] ring-2 ring-[#0D3B37]/30 scale-[1.04]"
                            : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                        }`}
                        aria-label={`View image ${idx + 1}`}
                      >
                        <Image
                          src={imgUrl}
                          alt=""
                          fill
                          sizes="100px"
                          className="object-contain p-1"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Quality Guarantee Note below gallery */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center gap-3 text-xs text-emerald-950">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>১০০% খাঁটি ও পরিবেশবান্ধব:</strong> প্রতিটি পণ্য মান যাচাই করে সরাসরি নির্ভরযোগ্য কারিগরদের থেকে সংগ্রহ করা হয়।
                </span>
              </div>
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* RIGHT COLUMN: BUY BOX & PRODUCT DETAILS (6 COLS) */}
            {/* --------------------------------------------------------------------- */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#EAE3D5]/80 flex flex-col justify-start">
              {/* Category Pill & Authenticity */}
              <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#E0592A] bg-[#E0592A]/10 px-3 py-1 rounded-full">
                  {product.categoryName}
                </span>
                <span className="text-[11px] font-semibold text-[#0D3B37] bg-[#0D3B37]/5 px-2.5 py-0.5 rounded-full">
                  Authentic Bangladeshi Heritage
                </span>
              </div>

              {/* Main Product Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#0D3B37] leading-snug tracking-tight mb-2.5">
                {product.name}
              </h1>

              {/* Ratings & SKU Row */}
              <div className="flex items-center gap-4 text-xs pb-4 mb-4 border-b border-gray-100 flex-wrap">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-gray-800">
                    {product.rating ?? 4.9}
                  </span>
                  <span className="text-gray-400">
                    ({product.reviewCount ?? 28} verified reviews)
                  </span>
                </div>
                {product.sku && (
                  <span className="text-gray-400 font-mono">
                    SKU: <strong className="text-gray-700">{product.sku}</strong>
                  </span>
                )}
              </div>

              {/* Pricing & Savings Display */}
              <div className="flex items-baseline gap-3.5 mb-5 flex-wrap">
                {currentPrice === 0 ? (
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#0D3B37]">
                    Custom Institutional Quote
                  </span>
                ) : (
                  <>
                    <span className="text-3xl sm:text-4xl font-black text-[#0D3B37]">
                      ৳{currentPrice.toLocaleString()}
                    </span>
                    {originalPrice && (
                      <span className="text-lg text-gray-400 line-through font-normal">
                        ৳{originalPrice.toLocaleString()}
                      </span>
                    )}
                    {hasDiscount && (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
                        Save ৳{savingsAmount.toLocaleString()} ({discountPercent}% OFF)
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Stock Inventory Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-100">
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                    <span>
                      ইন স্টক · ডেলিভারির জন্য প্রস্তুত ({product.stock} টি মজুদ রয়েছে)
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-red-50 text-red-800 text-xs font-semibold border border-red-100">
                    <span>স্টক শেষ (Out of Stock)</span>
                  </div>
                )}
              </div>

              {/* Quick Specifications Preview from Dashboard Spec Data */}
              {product.specifications &&
                Object.keys(product.specifications).length > 0 && (
                  <div className="mb-6 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D5] space-y-2">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Quick Specifications
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(product.specifications)
                        .slice(0, 4)
                        .map(([key, value]) => (
                          <div key={key} className="flex flex-col">
                            <span className="text-gray-400 text-[10.5px]">
                              {key}:
                            </span>
                            <span className="font-semibold text-[#0D3B37] truncate">
                              {String(value)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              {/* Quantity Selector & Action Buttons */}
              {currentPrice > 0 ? (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-4">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Quantity:
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-[#FAF8F5]">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="p-2.5 hover:bg-gray-200 text-gray-700 transition-colors disabled:opacity-40 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-12 text-center text-sm font-bold text-gray-900 select-none">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity((q) =>
                            Math.min(product.stock || 99, q + 1)
                          )
                        }
                        disabled={quantity >= (product.stock || 99)}
                        className="p-2.5 hover:bg-gray-200 text-gray-700 transition-colors disabled:opacity-40 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Two Main High-Conversion Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {/* 1. Add to Cart Button */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`h-12 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-98 cursor-pointer ${
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-[#E0592A] hover:bg-[#C8481C] text-white"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>কার্টে যোগ করা হয়েছে!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          <span>কার্টে যোগ করুন</span>
                        </>
                      )}
                    </button>

                    {/* 2. Order Now Button (Direct to Checkout) */}
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="h-12 px-6 rounded-2xl font-bold text-sm bg-[#0D3B37] hover:bg-[#134A44] text-white flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-98 cursor-pointer"
                    >
                      <Zap className="w-4 h-4 text-[#F59E0B]" />
                      <span>সরাসরি অর্ডার করুন</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Institutional Service Inquiry Button */
                <div className="pt-2">
                  <Link
                    href="/services"
                    className="h-12 w-full px-6 rounded-2xl font-bold text-sm bg-[#0D3B37] hover:bg-[#134A44] text-white flex items-center justify-center gap-2.5 transition-all shadow-md"
                  >
                    <span>কর্পোরেট ইনকোয়ারি ও কোটেশন ফর্ম</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {/* Trust Guarantee Perks Grid */}
              <div className="grid grid-cols-2 gap-3 pt-8 mt-8 border-t border-gray-100 text-xs text-gray-600">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-[#E0592A] shrink-0" />
                  <span>ঢাকায় ২৪-৪৮ ঘণ্টা, সারা দেশে ৩-৫ দিন</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-[#0D3B37] shrink-0" />
                  <span>ক্যাশ অন ডেলিভারি ও বিকাশ সুবিধা</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>১০০% খাঁটি ও গুণগত মান নিশ্চিত</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>ট্রানজিট ক্ষতিতে ৪৮ ঘণ্টায় রিপ্লেসমেন্ট</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. PRODUCT TABS: RICH DESCRIPTION, SPECIFICATIONS, SHIPPING, CARE */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#EAE3D5]/80 mb-16">
            {/* Tab Headers */}
            <div className="flex items-center gap-4 sm:gap-8 border-b border-gray-200 overflow-x-auto scrollbar-none pb-0 text-sm font-bold">
              <button
                type="button"
                onClick={() => setActiveTab("description")}
                className={`pb-3.5 px-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "description"
                    ? "border-[#0D3B37] text-[#0D3B37]"
                    : "border-transparent text-gray-400 hover:text-gray-700"
                }`}
              >
                পণ্য বিবরণ ও বৈশিষ্ট্য (Description)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("specs")}
                className={`pb-3.5 px-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "specs"
                    ? "border-[#0D3B37] text-[#0D3B37]"
                    : "border-transparent text-gray-400 hover:text-gray-700"
                }`}
              >
                স্পেসিফিকেশন ও সাইজ (Specifications)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("shipping")}
                className={`pb-3.5 px-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "shipping"
                    ? "border-[#0D3B37] text-[#0D3B37]"
                    : "border-transparent text-gray-400 hover:text-gray-700"
                }`}
              >
                ডেলিভারি ও চার্জ (Delivery & Policy)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("care")}
                className={`pb-3.5 px-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "care"
                    ? "border-[#0D3B37] text-[#0D3B37]"
                    : "border-transparent text-gray-400 hover:text-gray-700"
                }`}
              >
                যত্ন ও ঐতিহ্য (Artisan Care)
              </button>
            </div>

            {/* Tab 1: Rich Description from Dashboard */}
            <div className="pt-8">
              {activeTab === "description" && (
                <div className="product-rich-description text-gray-700 leading-relaxed max-w-4xl">
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        product.description ||
                        `<p>Authentic handcrafted creation representing the finest sustainable artisanal techniques of Bengal.</p>`,
                    }}
                  />
                </div>
              )}

              {/* Tab 2: Dynamic Specifications Grid from Dashboard Upload */}
              {activeTab === "specs" && (
                <div className="max-w-4xl space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {product.specifications &&
                    Object.keys(product.specifications).length > 0 ? (
                      Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D5] flex flex-col justify-between shadow-2xs"
                          >
                            <span className="font-bold text-[11px] text-gray-400 uppercase tracking-wider">
                              {key}
                            </span>
                            <span className="font-bold text-sm text-[#0D3B37] mt-1.5 break-words">
                              {String(value)}
                            </span>
                          </div>
                        )
                      )
                    ) : (
                      <div className="col-span-full p-8 text-center text-gray-400 bg-[#FAF8F5] rounded-2xl">
                        No additional specifications recorded for this product.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Shipping & Delivery Info */}
              {activeTab === "shipping" && (
                <div className="space-y-4 max-w-3xl text-sm text-gray-700 leading-relaxed">
                  <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D5] flex items-start gap-4">
                    <Truck className="w-5 h-5 text-[#E0592A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-base text-[#0D3B37] mb-1">
                        সারাদেশে ডেলিভারি সময় ও চার্জ
                      </h4>
                      <p className="text-gray-600 mb-1">
                        • <strong>ঢাকার ভেতরে:</strong> ডেলিভারি চার্জ ৳৭০ (২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি)।
                      </p>
                      <p className="text-gray-600">
                        • <strong>ঢাকার বাইরে (সকল ৬৪ জেলা):</strong> ডেলিভারি চার্জ ৳১৩০ (৩ থেকে ৫ কার্যদিবসের মধ্যে)।
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D5] flex items-start gap-4">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-base text-[#0D3B37] mb-1">
                        রিটার্ন ও রিপ্লেসমেন্ট পলিসি
                      </h4>
                      <p className="text-gray-600">
                        ডেলিভারি ম্যানের সামনে পার্সেল চেক করে গ্রহণ করুন। পরিবহনের সময় কোনো ক্ষতি হলে ৪৮ ঘণ্টার মধ্যে আমাদের হেল্পলাইনে জানালে সম্পূর্ণ বিনামূল্যে রিপ্লেসমেন্ট প্রদান করা হবে।
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Artisan Care & Preservation */}
              {activeTab === "care" && (
                <div className="space-y-4 max-w-3xl text-sm text-gray-700 leading-relaxed">
                  <p>
                    আমাদের প্রতিটি পণ্য তৈরি হয় বাংলাদেশের প্রত্যন্ত অঞ্চলের গ্রামীণ মৃৎশিল্পী, তাঁতি ও নারী সমবায়ের আন্তরিক পরিশ্রমে। শতভাগ প্রাকৃতিক উপাদানে হাতে তৈরি বিধায় প্রতিটি পণ্যের নিজস্ব স্বকীয়তা ও আবহ রয়েছে।
                  </p>
                  <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs sm:text-sm space-y-2">
                    <p className="font-bold text-[#0D3B37]">
                      পণ্য দীর্ঘস্থায়ী রাখার প্রয়োজনীয় পরামর্শ:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>পাটের পণ্য শুষ্ক স্থানে রাখুন এবং স্যাঁতসেঁতে ভেজা জায়গা এড়িয়ে চলুন।</li>
                      <li>মাটির তৈজসপত্র হালকা গরম পানি ও নরম স্পঞ্জ দিয়ে পরিষ্কার করুন, কড়া সাবান এড়িয়ে চলুন।</li>
                      <li>ধুলোবালি জমলে নরম সুতি কাপড় বা ব্রাশ দিয়ে হালকাভাবে ঝেড়ে নিন।</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. CROSS-SELL: RECOMMENDED CREATIONS */}
          {/* ========================================================================= */}
          <div className="pt-6">
            <div className="flex items-center justify-between pb-6 sm:pb-7">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0D3B37] tracking-tight">
                    Recommended For You
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    আপনার পছন্দের সাথে সামঞ্জস্যপূর্ণ আরও কিছু দেশীয় সৃষ্টি
                  </p>
                </div>
              </div>

              <Link
                href="/shop"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0D3B37] hover:text-[#E0592A] transition-colors group cursor-pointer"
              >
                <span>সব পণ্য দেখুন</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Product Cards Grid: Matching Storefront Card Design */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {liveRecommended.map((item) => {
                const isWishlisted = Boolean(wishlist[item.id]);
                const isItemAdded = addedCrossSellId === item.id;
                const itemRegular = Number(item.price) || 0;
                const itemSale = item.salePrice ? Number(item.salePrice) : undefined;
                const itemHasDiscount = itemSale !== undefined && itemSale < itemRegular;
                const itemPrice = itemHasDiscount ? itemSale : itemRegular;
                const itemDiscountPct = itemHasDiscount
                  ? Math.round(((itemRegular - itemSale) / itemRegular) * 100)
                  : 0;
                const itemImg =
                  item.images?.[0]?.url ||
                  item.imageUrl ||
                  "/images/client-mockup/cat-handicrafts.png";

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all duration-300 relative group border border-gray-100"
                  >
                    {/* For You / Discount Badge on Top Left */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                      {itemHasDiscount ? (
                        <span className="text-[9px] sm:text-[10px] font-bold text-white bg-gradient-to-r from-[#E0592A] to-[#F59E0B] px-2 py-0.5 rounded-md shadow-2xs">
                          {itemDiscountPct}% OFF
                        </span>
                      ) : (
                        <span className="text-[9px] sm:text-[10px] font-bold text-white bg-[#0D3B37] px-2 py-0.5 rounded-md shadow-2xs">
                          Recommended
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button on Top Right */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(item.id);
                      }}
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-gray-400 hover:text-[#E0592A] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                      title="Save to Wishlist"
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
                      <Link
                        href={`/products/${item.slug}`}
                        className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#FAF8F5] mb-3 flex items-center justify-center p-2 group-hover:bg-[#F5F1E9] transition-colors block cursor-pointer"
                      >
                        <Image
                          src={itemImg}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-contain p-2 group-hover:scale-106 transition-transform duration-300"
                        />
                      </Link>

                      {/* Category Label */}
                      <p className="text-[11px] text-gray-400 font-medium truncate">
                        {item.category?.name || "Artisanal"}
                      </p>

                      {/* Product Title */}
                      <Link
                        href={`/products/${item.slug}`}
                        className="block font-semibold text-xs sm:text-sm text-gray-900 hover:text-[#E0592A] transition-colors line-clamp-2 mt-0.5 cursor-pointer leading-snug"
                        title={item.name}
                      >
                        {item.name}
                      </Link>

                      {/* Star Rating Row */}
                      <div className="flex items-center gap-1 text-xs text-amber-500 pt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-gray-700">4.9</span>
                        <span className="text-gray-400 text-[10.5px]">
                          ({item.stock ?? 25} in stock)
                        </span>
                      </div>

                      {/* Price Row */}
                      <div className="flex items-center gap-2 flex-wrap pt-2">
                        <span className="font-extrabold text-sm sm:text-base text-[#0D3B37]">
                          ৳{itemPrice.toLocaleString()}
                        </span>
                        {itemHasDiscount && (
                          <span className="text-[11px] text-gray-400 line-through">
                            ৳{itemRegular.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Add to Cart Button */}
                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={() => handleCrossSellAdd(item)}
                        className={`w-full py-2.5 sm:py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                          isItemAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-[#0D3B37] hover:bg-[#E0592A] text-white active:scale-95"
                        }`}
                      >
                        {isItemAdded ? (
                          <>
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>কার্টে যোগ হয়েছে</span>
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
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
