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
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { useCart } from "@/context/CartContext";
import { MOCK_PRODUCTS, Product, CLIENT_INFO } from "@/data/mock-data";

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
              imageUrl: p.images?.[0]?.url || "/images/product-jute-basket.png",
              galleryUrls: p.images?.map((img: any) => img.url) || [],
              description: p.description || p.name,
              specifications: p.specifications || {},
            });
          }
        })
        .catch(() => {});
    }
  }, [slug]);

  // Gallery images
  const galleryImages = React.useMemo(() => {
    if (product.slug === "everyday-jute-basket") {
      return [
        "/images/product-jute-basket.png",
        "/images/jute-basket-lifestyle.png",
        "/images/story-artisan.png",
      ];
    }
    const imgs = [product.imageUrl];
    if (product.galleryUrls && product.galleryUrls.length > 0) {
      product.galleryUrls.forEach((url) => {
        if (!imgs.includes(url)) imgs.push(url);
      });
    }
    return imgs;
  }, [product]);

  const [selectedImage, setSelectedImage] = React.useState<string>(galleryImages[0]);
  const [selectedSize, setSelectedSize] = React.useState<string>("Medium · 28 cm");
  const [quantity, setQuantity] = React.useState<number>(1);
  const [isAdded, setIsAdded] = React.useState<boolean>(false);
  const [addedCrossSellId, setAddedCrossSellId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setSelectedImage(galleryImages[0]);
    setQuantity(1);
    setSelectedSize("Medium · 28 cm");
  }, [product, galleryImages]);

  // Handle Add to Bag
  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
    setIsCartOpen(true);
  };

  // Handle Buy Now
  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/checkout");
  };

  // Handle Cross-sell quick add
  const handleCrossSellAdd = (item: Product) => {
    addToCart(item, 1);
    setAddedCrossSellId(item.id);
    setTimeout(() => setAddedCrossSellId(null), 1500);
    setIsCartOpen(true);
  };

  // Cross-sell products ("Good company for your basket.")
  const crossSellProducts = React.useMemo(() => {
    const slugs = ["woven-coaster-set", "terracotta-stem-vase", "the-everyday-jute-tote"];
    return slugs
      .map((s) => MOCK_PRODUCTS.find((p) => p.slug === s))
      .filter((p): p is Product => Boolean(p));
  }, []);

  const savings =
    product.salePrice && product.salePrice > product.price
      ? product.salePrice - product.price
      : 200;

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
            <div className="lg:col-span-6">
              {/* Main Image Frame */}
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-white p-6 shadow-[0_2px_14px_rgba(0,0,0,0.03)] mb-4 flex items-center justify-center">
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-4 transition-opacity duration-300"
                />
              </div>

              {/* Thumbnails Row */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-3">
                {galleryImages.map((imgUrl, idx) => {
                  const isSelected = selectedImage === imgUrl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`relative aspect-[1.75/1] rounded-xl overflow-hidden bg-white p-1 cursor-pointer transition-all shadow-2xs ${
                        isSelected
                          ? "ring-2 ring-[#0D3B37]"
                          : "opacity-75 hover:opacity-100 hover:shadow-xs"
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <Image
                        src={imgUrl}
                        alt=""
                        fill
                        sizes="160px"
                        className="object-contain p-1"
                      />
                    </button>
                  );
                })}
              </div>

              {/* Caption */}
              <p className="text-xs text-gray-400 font-normal leading-relaxed">
                Natural fibres have their own character. Colour and weave may vary slightly.
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

              {/* Short Description */}
              <p className="text-sm sm:text-[15px] text-gray-600 font-normal leading-relaxed mb-6">
                {product.description ||
                  "A place for the little things. A handwoven basket that brings warmth and order to a corner of your home."}
              </p>

              {/* Price & Savings Row */}
              <div className="flex items-center gap-3.5 mb-5 flex-wrap">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#0D3B37]">
                  ৳{product.price.toLocaleString()}
                </span>
                <span className="text-base text-gray-400 line-through font-normal">
                  ৳{(product.salePrice ?? product.price + savings).toLocaleString()}
                </span>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg">
                  Save ৳{savings.toLocaleString()}
                </span>
              </div>

              {/* Stock Indicator */}
              <div className="mb-6">
                <span className="inline-flex items-center px-3.5 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl">
                  ✓ In stock · ready to dispatch
                </span>
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
                      <span>Add to Cart · ৳{(product.price * quantity).toLocaleString()}</span>
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

          {/* 3. Narrative Story & Specifications: Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 pt-12 sm:pt-16 border-t border-gray-200/60 mb-16 sm:mb-20">
            {/* Left Column: Narrative Story */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)]">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0D3B37] mb-3 leading-snug tracking-tight">
                Crafted with Care & Heritage
              </h2>
              <p className="text-sm text-gray-600 font-normal leading-relaxed">
                Authentic handcrafted creations representing the finest natural materials and sustainable artisanal techniques of Bengal. Designed for beauty, durability and practical utility in modern homes.
              </p>
            </div>

            {/* Right Column: The Details */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)]">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0D3B37] mb-4 leading-snug tracking-tight">
                Specifications & Details
              </h2>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-3 py-2 border-b border-gray-100">
                  <span className="font-bold text-[#0D3B37]">Material</span>
                  <span className="col-span-2 text-gray-600 font-normal">
                    {product.specifications?.Material || "Natural Golden Jute / Organic Clay"}
                  </span>
                </div>
                <div className="grid grid-cols-3 py-2 border-b border-gray-100">
                  <span className="font-bold text-[#0D3B37]">Dimensions</span>
                  <span className="col-span-2 text-gray-600 font-normal">
                    {product.specifications?.Dimensions || "Standard Handcrafted Dimension"}
                  </span>
                </div>
                <div className="grid grid-cols-3 py-2 border-b border-gray-100">
                  <span className="font-bold text-[#0D3B37]">Origin</span>
                  <span className="col-span-2 text-gray-600 font-normal">
                    {product.specifications?.Origin || "Dhaka & Faridpur, Bangladesh"}
                  </span>
                </div>
                <div className="grid grid-cols-3 py-2 border-b border-gray-100">
                  <span className="font-bold text-[#0D3B37]">Product SKU</span>
                  <span className="col-span-2 text-gray-600 font-normal">
                    {product.sku || `SK-${product.slug}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Cross-sell Showcase */}
          <div className="pt-4">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0D3B37] tracking-tight">
                Recommended For You
              </h2>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0D3B37] hover:text-[#E0592A] transition-colors group"
              >
                <span>View All</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {/* 3 Cross-sell Product Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {crossSellProducts.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all duration-300 group relative"
                >
                  <div>
                    {/* Card Visual with Floating Quick-Add */}
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#FAF8F5] p-3 mb-3 group-hover:bg-[#F5F1E9] transition-colors">
                      <Link href={`/products/${item.slug}`} className="block relative w-full h-full">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-contain p-2 group-hover:scale-106 transition-transform duration-300"
                        />
                      </Link>

                      {/* Floating Add to Bag Button */}
                      <button
                        onClick={() => handleCrossSellAdd(item)}
                        className="absolute bottom-2.5 right-2.5 h-8 w-8 rounded-xl bg-[#0D3B37] hover:bg-[#E0592A] text-white shadow-md flex items-center justify-center transition-all cursor-pointer group/btn"
                        title="Add to cart"
                        aria-label={`Add ${item.name} to cart`}
                      >
                        {addedCrossSellId === item.id ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform duration-200" />
                        )}
                      </button>
                    </div>

                    {/* Category Label */}
                    <p className="text-xs text-gray-400 font-medium truncate mb-1">
                      {item.categoryName}
                    </p>

                    {/* Product Title */}
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="text-sm sm:text-[15px] font-semibold text-gray-900 group-hover:text-[#E0592A] transition-colors line-clamp-2 leading-snug">
                        {item.name}
                      </h3>
                    </Link>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-50 mt-3">
                    <span className="text-base sm:text-lg font-bold text-[#0D3B37]">
                      ৳ {item.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}

