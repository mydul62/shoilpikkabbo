"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowUpRight,
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
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { useCart } from "@/context/CartContext";
import { MOCK_PRODUCTS, Product, CLIENT_INFO } from "@/data/mock-data";
import { productsApi } from "@/lib/api";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { addToCart, setIsCartOpen } = useCart();

  const fallbackProduct =
    MOCK_PRODUCTS.find((p) => p.slug === slug) ||
    MOCK_PRODUCTS[0];

  const [product, setProduct] = React.useState<Product>(fallbackProduct);

  React.useEffect(() => {
    if (slug) {
      fetch(`http://localhost:5000/api/v1/products/${encodeURIComponent(slug)}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            const p = json.data;
            const fetchedGallery: string[] = [];
            if (p.images && Array.isArray(p.images)) {
              p.images.forEach((img: any) => {
                const u = typeof img === "string" ? img : img.url;
                if (u && !fetchedGallery.includes(u)) fetchedGallery.push(u);
              });
            }
            if (p.imageUrl && !fetchedGallery.includes(p.imageUrl)) {
              fetchedGallery.unshift(p.imageUrl);
            }

            setProduct({
              id: p.id,
              name: p.name,
              slug: p.slug,
              categoryId: p.categoryId,
              categoryName: p.category?.name || "Artisanal",
              price: Number(p.price),
              salePrice: p.salePrice ? Number(p.salePrice) : undefined,
              stock: p.stock ?? 25,
              sku: p.sku || `SK-${p.slug}`,
              rating: 5,
              reviewCount: 12,
              imageUrl: fetchedGallery[0] || p.imageUrl || "/images/product-jute-basket.png",
              galleryUrls: fetchedGallery,
              description: p.description || p.name,
              specifications: p.specifications || {},
            });
          }
        })
        .catch(() => {});
    }
  }, [slug]);

  // Gallery images prioritizing active database entries
  const galleryImages = React.useMemo(() => {
    const list: string[] = [];
    if (product.imageUrl) list.push(product.imageUrl);
    if (product.galleryUrls && Array.isArray(product.galleryUrls)) {
      product.galleryUrls.forEach((url) => {
        if (url && !list.includes(url)) list.push(url);
      });
    }
    if (list.length > 0) return list;

    if (product.slug === "everyday-jute-basket") {
      return [
        "/images/product-jute-basket.png",
        "/images/jute-basket-lifestyle.png",
        "/images/story-artisan.png",
      ];
    }
    return ["/images/client-mockup/cat-handicrafts.png"];
  }, [product]);

  const [selectedImage, setSelectedImage] = React.useState<string>(galleryImages[0]);
  const [selectedSize, setSelectedSize] = React.useState<string>("Medium · 28 cm");
  const [quantity, setQuantity] = React.useState<number>(1);
  const [isAdded, setIsAdded] = React.useState<boolean>(false);
  const [addedCrossSellId, setAddedCrossSellId] = React.useState<string | null>(null);
  const [liveRecommended, setLiveRecommended] = React.useState<Product[]>([]);
  const [wishlist, setWishlist] = React.useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = React.useState<"description" | "specs" | "shipping" | "care">("description");

  const currentImageIndex = Math.max(0, galleryImages.indexOf(selectedImage));

  const handlePrevImage = () => {
    if (galleryImages.length <= 1) return;
    const prevIdx = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[prevIdx]);
  };

  const handleNextImage = () => {
    if (galleryImages.length <= 1) return;
    const nextIdx = (currentImageIndex + 1) % galleryImages.length;
    setSelectedImage(galleryImages[nextIdx]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  React.useEffect(() => {
    setSelectedImage(galleryImages[0]);
    setQuantity(1);
    setSelectedSize("Medium · 28 cm");
  }, [product, galleryImages]);

  // Fetch live products for Recommended section from PostgreSQL
  React.useEffect(() => {
    productsApi
      .getAll({ limit: 12 })
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: Product[] = res.data
            .filter((p: any) => p.slug !== slug)
            .map((p: any) => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              categoryId: p.categoryId,
              categoryName: p.category?.name || "Artisanal",
              price: Number(p.price),
              salePrice: p.salePrice ? Number(p.salePrice) : undefined,
              stock: p.stock ?? 25,
              sku: p.sku || `SK-${p.slug}`,
              rating: p.rating ?? 4.8,
              reviewCount: p.reviewCount ?? 35,
              imageUrl: p.images?.[0]?.url || p.imageUrl || "/images/client-mockup/cat-handicrafts.png",
              galleryUrls: p.images?.map((img: any) => img.url) || [],
              description: p.description || p.name,
              specifications: p.specifications || {},
            }));
          setLiveRecommended(mapped);
        }
      })
      .catch(() => {});
  }, [slug]);

  // Pricing calculations
  const currentPrice =
    product.salePrice && product.salePrice < product.price
      ? product.salePrice
      : product.price;

  const originalPrice =
    product.salePrice && product.salePrice > product.price
      ? product.salePrice
      : product.salePrice && product.salePrice < product.price
      ? product.price
      : undefined;

  const savings = originalPrice ? originalPrice - currentPrice : 0;

  // Handle Add to Bag
  const handleAddToCart = () => {
    addToCart({ ...product, price: currentPrice }, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
    setIsCartOpen(true);
  };

  // Handle Buy Now
  const handleBuyNow = () => {
    addToCart({ ...product, price: currentPrice }, quantity);
    router.push("/checkout");
  };

  // Handle Cross-sell quick add
  const handleCrossSellAdd = (item: Product) => {
    addToCart(item, 1);
    setAddedCrossSellId(item.id);
    setTimeout(() => setAddedCrossSellId(null), 1500);
    setIsCartOpen(true);
  };

  // Cross-sell products ("Recommended For You" matching Home Page)
  const crossSellProducts = React.useMemo(() => {
    if (liveRecommended.length > 0) {
      return liveRecommended.slice(0, 4);
    }
    return MOCK_PRODUCTS.filter((p) => p.slug !== slug).slice(0, 4);
  }, [liveRecommended, slug]);

  return (
    <StorefrontLayout>
      <div className="bg-[#FAF8F5] min-h-screen pb-16">
        <div className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* 1. Breadcrumbs */}
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-6"
          >
            <Link href="/" className="hover:text-[#E0592A] transition-colors">
              Home
            </Link>
            <span className="select-none text-gray-300">/</span>
            <Link
              href={`/shop?category=${product.categoryName.toLowerCase().replace(/ /g, "-")}`}
              className="hover:text-[#E0592A] transition-colors"
            >
              {product.categoryName}
            </Link>
            <span className="select-none text-gray-300">/</span>
            <span className="text-[#0D3B37] font-bold">{product.name}</span>
          </nav>

          {/* 2. Main Product Presentation: Two Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start pb-16 sm:pb-20">
            {/* Left Column: Visual Gallery (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Image Frame with hover zoom & prev/next arrows */}
              <div className="group relative w-full aspect-square rounded-3xl overflow-hidden bg-white p-6 shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-sand/80 flex items-center justify-center">
                <Image
                  src={selectedImage || galleryImages[0]}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                />

                {/* Counter Badge */}
                {galleryImages.length > 1 && (
                  <span className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold shadow-xs">
                    {currentImageIndex + 1} / {galleryImages.length}
                  </span>
                )}

                {/* Left/Right Arrow Controls */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:scale-110"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-5 h-5 text-[#0D3B37]" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:scale-110"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-5 h-5 text-[#0D3B37]" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails Row */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {galleryImages.map((imgUrl, idx) => {
                    const isSelected = selectedImage === imgUrl;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(imgUrl)}
                        className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white p-1.5 shrink-0 border-2 transition-all cursor-pointer shadow-2xs ${
                          isSelected
                            ? "border-[#0D3B37] ring-2 ring-[#0D3B37]/30 scale-[1.02]"
                            : "border-gray-200 hover:border-gray-400 opacity-75 hover:opacity-100"
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

              {/* Caption */}
              <p className="text-xs text-gray-400 font-normal leading-relaxed">
                Natural fibres & authentic handcrafted creations have their own unique character. Tone and weave may vary slightly.
              </p>
            </div>

            {/* Right Column: Buy Box & Product Options (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_2px_14px_rgba(0,0,0,0.03)] flex flex-col justify-start">
              {/* Overline Tag */}
              <p className="text-xs font-bold tracking-wider uppercase text-[#E0592A] mb-2 sm:mb-2.5">
                {product.categoryName.toUpperCase()} / AUTHENTIC BANGLADESHI
              </p>

              {/* Product Headline */}
              <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#0D3B37] leading-snug tracking-tight mb-3">
                {product.name}
              </h1>

              {/* Short Clean Summary */}
              <p className="text-sm text-gray-600 leading-relaxed mb-6 line-clamp-3">
                {product.description
                  ? product.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
                  : "Authentic handcrafted creation representing the finest sustainable artisanal techniques of Bengal."}
              </p>

              {/* Price & Savings Row */}
              <div className="flex items-center gap-3.5 mb-5 flex-wrap">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#0D3B37]">
                  ৳{currentPrice.toLocaleString()}
                </span>
                {originalPrice && originalPrice > currentPrice && (
                  <span className="text-base text-gray-400 line-through font-normal">
                    ৳{originalPrice.toLocaleString()}
                  </span>
                )}
                {savings > 0 && (
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-100">
                    Save ৳{savings.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stock Indicator */}
              <div className="mb-6 flex items-center gap-3">
                <span className="inline-flex items-center px-3.5 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-100">
                  ✓ In stock · ready to dispatch
                </span>
                {product.sku && (
                  <span className="text-xs text-gray-400 font-mono">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 block">
                  Select Size
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedSize("Medium · 28 cm")}
                    className={`px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer font-semibold ${
                      selectedSize.startsWith("Medium")
                        ? "bg-[#0D3B37] text-white shadow-xs"
                        : "bg-[#FAF8F5] hover:bg-[#F3EFE6] text-gray-700"
                    }`}
                  >
                    Medium · 28 cm
                  </button>
                  <Link
                    href="/products/everyday-jute-basket-large"
                    className="px-4 py-2.5 bg-[#FAF8F5] hover:bg-[#F3EFE6] text-gray-700 rounded-xl text-sm font-semibold inline-flex items-center gap-1.5 transition-all group"
                  >
                    <span>Large · 34 cm</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
                <p className="text-xs text-gray-400 font-medium mt-2.5">
                  Selected: {selectedSize} · Natural
                </p>
              </div>

              {/* Quantity Stepper & Add to Bag Row */}
              <div className="flex items-center gap-3 mb-3.5">
                {/* Quantity Stepper */}
                <div className="flex items-center justify-between border border-gray-200 bg-gray-50 rounded-xl h-12 w-28 px-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-gray-600 hover:text-gray-900 p-1 cursor-pointer transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="text-gray-600 hover:text-gray-900 p-1 cursor-pointer transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 h-12 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md px-3"
                >
                  {isAdded ? (
                    <>
                      <span>Added to cart!</span>
                      <Check className="w-4 h-4 text-white" />
                    </>
                  ) : (
                    <>
                      <span>Add to Cart · ৳{(currentPrice * quantity).toLocaleString()}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Buy Now Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full h-12 bg-[#E0592A] hover:bg-[#c94b20] text-white text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-all cursor-pointer mb-6 shadow-md hover:shadow-lg"
              >
                <span>Buy now</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              {/* Assurances & Need Help */}
              <div className="space-y-2 text-xs text-gray-500 font-normal leading-relaxed pt-3 border-t border-gray-100">
                <p>
                  Delivery charge and estimated arrival are shown after you choose your area at checkout.
                </p>
                <p className="text-[#0D3B37] font-semibold">
                  bKash · Nagad · Card · BRAC Bank transfer
                </p>
                <div className="flex items-center gap-2 pt-1 text-gray-500 font-medium">
                  <span>Need help choosing?</span>
                  <a
                    href={`https://wa.me/88${CLIENT_INFO.phonePrimary}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0D3B37] hover:text-[#E0592A] font-bold inline-flex items-center gap-0.5 transition-colors"
                  >
                    <span>WhatsApp</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <span>·</span>
                  <a
                    href="https://m.me/shoilpikkabbo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0D3B37] hover:text-[#E0592A] font-bold inline-flex items-center gap-0.5 transition-colors"
                  >
                    <span>Messenger</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Tabbed Information Showcase (Rich Description from WYSIWYG Editor, Specs, Shipping, Care) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-sand/80 mb-16 sm:mb-20">
            {/* Tab navigation */}
            <div className="flex items-center gap-2 sm:gap-6 border-b border-sand pb-3 overflow-x-auto text-xs sm:text-sm font-bold scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab("description")}
                className={`pb-3 px-2 border-b-2 -mb-3.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "description"
                    ? "border-[#0D3B37] text-[#0D3B37]"
                    : "border-transparent text-gray-400 hover:text-gray-800"
                }`}
              >
                Product Description & Story
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("specs")}
                className={`pb-3 px-2 border-b-2 -mb-3.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "specs"
                    ? "border-[#0D3B37] text-[#0D3B37]"
                    : "border-transparent text-gray-400 hover:text-gray-800"
                }`}
              >
                Specifications & Materials
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("shipping")}
                className={`pb-3 px-2 border-b-2 -mb-3.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "shipping"
                    ? "border-[#0D3B37] text-[#0D3B37]"
                    : "border-transparent text-gray-400 hover:text-gray-800"
                }`}
              >
                Shipping & Delivery
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("care")}
                className={`pb-3 px-2 border-b-2 -mb-3.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "care"
                    ? "border-[#0D3B37] text-[#0D3B37]"
                    : "border-transparent text-gray-400 hover:text-gray-800"
                }`}
              >
                Artisan Care & Origin
              </button>
            </div>

            {/* Tab Content */}
            <div className="pt-8">
              {activeTab === "description" && (
                <div className="product-rich-description text-gray-700 leading-relaxed max-w-4xl">
                  {/* Rich HTML formatted description from editor */}
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        product.description ||
                        `<p>Authentic handcrafted creations representing the finest natural materials and sustainable artisanal techniques of Bengal. Designed for beauty, durability and practical utility in modern homes.</p>`,
                    }}
                  />
                </div>
              )}

              {activeTab === "specs" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
                  {Object.entries(product.specifications || {}).length > 0 ? (
                    Object.entries(product.specifications || {}).map(([key, value]) => (
                      <div
                        key={key}
                        className="p-4 rounded-2xl bg-[#FAF8F5] border border-sand flex flex-col justify-between shadow-2xs"
                      >
                        <span className="font-bold text-[11px] text-gray-400 uppercase tracking-wider">{key}</span>
                        <span className="font-bold text-sm text-[#0D3B37] mt-1">{String(value)}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-sand flex flex-col justify-between shadow-2xs">
                        <span className="font-bold text-[11px] text-gray-400 uppercase tracking-wider">Material</span>
                        <span className="font-bold text-sm text-[#0D3B37] mt-1">Natural Golden Jute / Organic Clay</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-sand flex flex-col justify-between shadow-2xs">
                        <span className="font-bold text-[11px] text-gray-400 uppercase tracking-wider">Origin</span>
                        <span className="font-bold text-sm text-[#0D3B37] mt-1">Dhaka & Faridpur, Bangladesh</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-sand flex flex-col justify-between shadow-2xs">
                        <span className="font-bold text-[11px] text-gray-400 uppercase tracking-wider">SKU</span>
                        <span className="font-bold text-sm text-[#0D3B37] mt-1">{product.sku || `SK-${product.slug}`}</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-gray-600 leading-relaxed">
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-sand flex items-start gap-3">
                    <Truck className="w-5 h-5 text-[#0D3B37] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-[#0D3B37] mb-1">Nationwide Delivery Timeline</h4>
                      <p>Inside Dhaka: Delivered within 2-3 business days. Delivery fee ৳70.</p>
                      <p>Outside Dhaka: Delivered within 3-5 business days across all 64 districts. Delivery fee ৳130.</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-sand flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-[#0D3B37] mb-1">Authentic Guarantee & Returns</h4>
                      <p>Every product is hand-checked for quality before dispatch. If damaged in transit, we offer free replacements within 48 hours of delivery.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "care" && (
                <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-gray-600 leading-relaxed">
                  <p>
                    Our artisans work with pure Bangladeshi golden jute, organic terracotta clay, and natural wood. Because each piece is handmade by rural craftsmen and women cooperatives, minor variations in tone and texture are the signature of authentic handcrafting.
                  </p>
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-amber-950 text-xs">
                    <p className="font-bold mb-1">Care & Preservation Tips:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Keep dry and avoid prolonged exposure to direct rain or moisture.</li>
                      <li>Dust lightly with a soft brush or clean dry cloth.</li>
                      <li>For terracotta or brass, gently wipe with a damp cotton cloth without harsh detergents.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. Cross-sell Showcase: Home Page Card Design */}
          <div className="pt-8 border-t border-sand/80 mt-12">
            {/* Header Row */}
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
                    Specially handpicked recommendations tailored for you
                  </p>
                </div>
              </div>

              <Link
                href="/shop"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0D3B37] hover:text-[#E0592A] transition-colors group cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Product Cards Grid: Home Page Card Design */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {crossSellProducts.map((item) => {
                const isWishlisted = Boolean(wishlist[item.id]);
                const isAdded = addedCrossSellId === item.id;
                const discountPct =
                  item.salePrice && item.salePrice > item.price
                    ? Math.round(((item.salePrice - item.price) / item.salePrice) * 100)
                    : 20;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all duration-300 relative group border border-gray-100"
                  >
                    {/* For You Badge on Top Left */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                      <span className="text-[9px] sm:text-[10px] font-bold text-white bg-gradient-to-r from-[#E0592A] to-[#F59E0B] px-2 py-0.5 rounded-md shadow-2xs">
                        For You
                      </span>
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
                      <Link
                        href={`/products/${item.slug}`}
                        className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#FAF8F5] mb-3 flex items-center justify-center p-2 group-hover:bg-[#F5F1E9] transition-colors block cursor-pointer"
                      >
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-contain p-2 group-hover:scale-106 transition-transform duration-300"
                        />
                      </Link>

                      {/* Category Label */}
                      <p className="text-[11px] text-gray-400 font-medium truncate">
                        {item.categoryName}
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
                        <span className="font-bold text-gray-700">
                          {item.rating ?? 4.8}
                        </span>
                        <span className="text-gray-400 text-[10.5px]">
                          ({item.reviewCount ?? 45})
                        </span>
                      </div>

                      {/* Price Row */}
                      <div className="flex items-center gap-2 flex-wrap pt-2">
                        <span className="font-extrabold text-sm sm:text-base text-[#0D3B37]">
                          ৳ {item.price.toLocaleString()}
                        </span>
                        {item.salePrice && item.salePrice > item.price && (
                          <span className="text-[11px] text-gray-400 line-through">
                            ৳ {item.salePrice.toLocaleString()}
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {discountPct}% OFF
                        </span>
                      </div>
                    </div>

                    {/* Full-width Add to Cart Button with ShoppingCart Icon */}
                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={() => handleCrossSellAdd(item)}
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
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}

