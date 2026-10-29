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
      <div className="bg-[#F7F4EE] min-h-screen">
        <div className="max-w-[1524px] mx-auto px-5 py-8 sm:py-12">
          {/* 1. Breadcrumbs */}
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-1.5 text-[11.5px] sm:text-[12px] text-[#7E8881] font-light mb-6"
          >
            <Link href="/" className="hover:text-[#143527] transition-colors">
              Home
            </Link>
            <span className="select-none text-[#A8B2AA]">/</span>
            <Link
              href={`/shop?category=${product.categoryName.toLowerCase().replace(/ /g, "-")}`}
              className="hover:text-[#143527] transition-colors"
            >
              {product.categoryName}
            </Link>
            <span className="select-none text-[#A8B2AA]">/</span>
            <span className="text-[#143527] font-normal">{product.name}</span>
          </nav>

          {/* 2. Main Product Presentation: Two Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start pb-16 sm:pb-20">
            {/* Left Column: Visual Gallery (6 cols) */}
            <div className="lg:col-span-6">
              {/* Main Image Frame */}
              <div className="relative w-full aspect-square sm:aspect-[1.05/1] rounded-2xl overflow-hidden bg-[#E8E2D6] shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-4">
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-opacity duration-300"
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
                      className={`relative aspect-[1.75/1] rounded-lg overflow-hidden bg-[#E8E2D6] cursor-pointer border transition-all ${
                        isSelected
                          ? "border-[#143527] ring-1 ring-[#143527]"
                          : "border-[#D5CDC0] opacity-80 hover:opacity-100"
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <Image
                        src={imgUrl}
                        alt=""
                        fill
                        sizes="160px"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>

              {/* Caption */}
              <p className="text-[11.5px] sm:text-[12px] text-[#7E8881] font-light leading-relaxed">
                Natural fibres have their own character. Colour and weave may vary slightly.
              </p>
            </div>

            {/* Right Column: Buy Box & Product Options (6 cols) */}
            <div className="lg:col-span-6 flex flex-col justify-start">
              {/* Overline Tag */}
              <p className="text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase text-[#B85D38] mb-2 sm:mb-3">
                {product.categoryName.toUpperCase()} / THE NATURAL COLLECTION
              </p>

              {/* Product Headline */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-normal text-[#143527] leading-[1.14] tracking-tight mb-3">
                {product.name}
              </h1>

              {/* Short Description */}
              <p className="text-[13.5px] sm:text-[14px] text-[#556059] font-light leading-relaxed mb-5">
                {product.description ||
                  "A place for the little things. A handwoven basket that brings warmth and order to a corner of your home."}
              </p>

              {/* Price & Savings Row */}
              <div className="flex items-center gap-3 mb-4">
                <span className="font-serif text-2xl sm:text-[28px] font-semibold text-[#143527]">
                  ৳{product.price.toLocaleString()}
                </span>
                <span className="text-[14px] text-[#8C948E] line-through font-light">
                  ৳{(product.salePrice ?? product.price + savings).toLocaleString()}
                </span>
                <span className="px-2 py-0.5 bg-[#FAF7F2] border border-[#D5CDC0] text-[#143527] text-[11px] font-medium rounded-[2px]">
                  Save ৳{savings.toLocaleString()}
                </span>
              </div>

              {/* Stock Indicator */}
              <div className="mb-6">
                <span className="inline-flex items-center px-3 py-1 bg-[#EEF4F0] text-[#1E563E] text-[11.5px] font-medium rounded-[2px]">
                  In stock · ready to order
                </span>
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <label className="text-[12.5px] font-semibold text-[#143527] mb-2.5 block tracking-tight">
                  Size
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedSize("Medium · 28 cm")}
                    className={`px-4 py-2.5 rounded-[2px] text-[13px] transition-all cursor-pointer ${
                      selectedSize.startsWith("Medium")
                        ? "border-2 border-[#143527] bg-white text-[#143527] font-medium"
                        : "border border-[#D5CDC0] bg-transparent hover:bg-white text-[#556059]"
                    }`}
                  >
                    Medium · 28 cm
                  </button>
                  <Link
                    href="/products/everyday-jute-basket-large"
                    className="px-4 py-2.5 border border-[#D5CDC0] bg-transparent hover:bg-white text-[#556059] hover:text-[#143527] rounded-[2px] text-[13px] inline-flex items-center gap-1.5 transition-all group"
                  >
                    <span>Large · 34 cm</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#556059] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
                <p className="text-[12px] text-[#7E8881] font-light mt-2.5">
                  Selected: {selectedSize} · Natural
                </p>
              </div>

              {/* Quantity Stepper & Add to Bag Row */}
              <div className="flex items-center gap-2.5 sm:gap-3 mb-3">
                {/* Quantity Stepper */}
                <div className="flex items-center justify-between border border-[#D5CDC0] bg-white rounded-[2px] h-11 sm:h-12 w-24 sm:w-28 px-2.5 sm:px-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-[#143527] hover:text-[#B85D38] p-1 cursor-pointer transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[13px] font-medium text-[#143527]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="text-[#143527] hover:text-[#B85D38] p-1 cursor-pointer transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 h-11 sm:h-12 bg-[#143527] hover:bg-[#1B4332] text-white text-[12.5px] sm:text-[13px] font-medium rounded-[2px] inline-flex items-center justify-center gap-1.5 sm:gap-2 transition-colors cursor-pointer shadow-sm px-2"
                >
                  {isAdded ? (
                    <>
                      <span>Added to bag!</span>
                      <Check className="w-4 h-4 text-white" />
                    </>
                  ) : (
                    <>
                      <span>Add to bag · ৳{(product.price * quantity).toLocaleString()}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Buy Now Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full h-11 sm:h-12 bg-transparent hover:bg-white border border-[#D5CDC0] hover:border-[#143527] text-[#143527] text-[12.5px] sm:text-[13px] font-medium rounded-[2px] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer mb-6"
              >
                <span>Buy now</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              {/* Assurances & Need Help */}
              <div className="space-y-2 text-[12px] text-[#6A736C] font-light leading-relaxed pt-2 border-t border-[#EAE3D5]">
                <p>
                  Delivery charge and estimated arrival are shown after you choose your area at checkout.
                </p>
                <p className="text-[#143527] font-medium">
                  bKash · Nagad · Card · BRAC Bank transfer
                </p>
                <div className="flex items-center gap-1.5 pt-1 text-[#6A736C]">
                  <span>Need help choosing?</span>
                  <a
                    href={`https://wa.me/88${CLIENT_INFO.phonePrimary}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#143527] hover:text-[#B85D38] font-medium inline-flex items-center gap-0.5 transition-colors"
                  >
                    <span>WhatsApp</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                  <span>·</span>
                  <a
                    href="https://m.me/shoilpikkabbo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#143527] hover:text-[#B85D38] font-medium inline-flex items-center gap-0.5 transition-colors"
                  >
                    <span>Messenger</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Narrative Story & Specifications: Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 pt-12 sm:pt-16 border-t border-[#EAE3D5] mb-16 sm:mb-20">
            {/* Left Column: Narrative Story */}
            <div>
              <h2 className="font-serif text-2xl sm:text-[28px] font-normal text-[#143527] mb-3 leading-snug">
                A natural home for everyday things.
              </h2>
              <p className="text-[13.5px] sm:text-[14px] text-[#556059] font-light leading-relaxed max-w-lg">
                Use it for folded throws, toys or the essentials you like to keep close. The loop handles make it easy to move from room to room. Designed for dry indoor storage.
              </p>
            </div>

            {/* Right Column: The Details */}
            <div>
              <h2 className="font-serif text-2xl sm:text-[28px] font-normal text-[#143527] mb-4 leading-snug">
                The details
              </h2>
              <div className="space-y-2.5 text-[13px]">
                <div className="grid grid-cols-3 py-1.5 border-b border-[#EAE3D5]/70">
                  <span className="font-medium text-[#143527]">Material</span>
                  <span className="col-span-2 text-[#556059] font-light">
                    {product.specifications?.Material || "Natural jute"}
                  </span>
                </div>
                <div className="grid grid-cols-3 py-1.5 border-b border-[#EAE3D5]/70">
                  <span className="font-medium text-[#143527]">Dimensions</span>
                  <span className="col-span-2 text-[#556059] font-light">
                    {product.specifications?.Dimensions || "28 cm diameter × 25 cm height"}
                  </span>
                </div>
                <div className="grid grid-cols-3 py-1.5 border-b border-[#EAE3D5]/70">
                  <span className="font-medium text-[#143527]">Care</span>
                  <span className="col-span-2 text-[#556059] font-light">
                    {product.specifications?.Care || "Spot clean; air dry; avoid soaking"}
                  </span>
                </div>
                <div className="grid grid-cols-3 py-1.5 border-b border-[#EAE3D5]/70">
                  <span className="font-medium text-[#143527]">Product code</span>
                  <span className="col-span-2 text-[#556059] font-light">
                    {product.sku || "SK-JB-020"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Cross-sell Showcase: Good company for your basket */}
          <div className="pt-8 sm:pt-10">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-normal text-[#143527] tracking-tight">
                Good company for your basket.
              </h2>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#143527] hover:text-[#B85D38] transition-colors group"
              >
                <span>More to discover</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {/* 3 Cross-sell Product Cards (2 on mobile, 3 on tablet/desktop) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8">
              {crossSellProducts.map((item) => (
                <div key={item.id} className="group flex flex-col">
                  {/* Card Visual with Floating Quick-Add */}
                  <div className="relative w-full aspect-[1.48/1] rounded-xl sm:rounded-2xl overflow-hidden bg-[#E8E2D6] shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-2.5 sm:mb-3.5">
                    <Link href={`/products/${item.slug}`} className="block relative w-full h-full">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                      />
                    </Link>

                    {/* Floating Add to Bag Button */}
                    <button
                      onClick={() => handleCrossSellAdd(item)}
                      className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white hover:bg-[#143527] text-[#143527] hover:text-white shadow-sm flex items-center justify-center transition-all cursor-pointer group/btn"
                      title="Add to bag"
                      aria-label={`Add ${item.name} to bag`}
                    >
                      {addedCrossSellId === item.id ? (
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#143527]" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:rotate-90 transition-transform duration-200" />
                      )}
                    </button>
                  </div>

                  {/* Category Label */}
                  <span className="text-[10px] sm:text-[11.5px] text-[#6A736C] font-light">
                    {item.categoryName}
                  </span>

                  {/* Product Title */}
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="text-[13px] sm:text-[15.5px] font-medium text-[#143527] group-hover:text-[#B85D38] transition-colors mt-0.5 leading-snug line-clamp-1">
                      {item.name}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5">
                    <span className="text-[13px] sm:text-[14.5px] font-semibold text-[#143527]">
                      ৳{item.price.toLocaleString()}
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

