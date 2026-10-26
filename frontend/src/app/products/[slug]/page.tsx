"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  ShoppingCart,
  Check,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { MOCK_PRODUCTS, CLIENT_INFO, Product } from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { addToCart } = useCart();

  const product = MOCK_PRODUCTS.find((p) => p.slug === slug) || MOCK_PRODUCTS[0];
  const [selectedImage, setSelectedImage] = React.useState<string>(product.imageUrl);
  const [quantity, setQuantity] = React.useState<number>(1);
  const [isAdded, setIsAdded] = React.useState<boolean>(false);

  React.useEffect(() => {
    setSelectedImage(product.imageUrl);
    setQuantity(1);
  }, [product]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const discountPercent = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.categoryId === product.categoryId && p.id !== product.id
  ).slice(0, 4);

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-charcoal-500 mb-6">
          <Link href="/" className="hover:text-forest-800">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/shop" className="hover:text-forest-800">
            Shop
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link
            href={`/shop?category=${product.categoryName.toLowerCase().replace(/ /g, "-")}`}
            className="hover:text-forest-800"
          >
            {product.categoryName}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-charcoal-900 font-medium truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Product Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Gallery (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-brand-border bg-sand/30 shadow-xs">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-bold shadow-xs">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[product.imageUrl, ...product.galleryUrls].map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(url)}
                  className={`relative h-20 w-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    selectedImage === url
                      ? "border-forest-800 ring-2 ring-forest-800/20"
                      : "border-brand-border opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={url}
                    alt={`${product.name} preview ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Product Overview (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="primary">{product.categoryName}</Badge>
                <span className="text-xs text-charcoal-400">SKU: {product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 font-heading leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-gold-500 text-gold-500"
                          : "text-sand-dark"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-charcoal-800">
                  {product.rating}
                </span>
                <span className="text-xs text-charcoal-400">
                  ({product.reviewCount} customer reviews)
                </span>
              </div>
            </div>

            {/* Price section */}
            <div className="p-4 rounded-xl bg-sand/40 border border-brand-border flex items-baseline gap-3">
              <span className="text-3xl font-black text-forest-900 font-heading">
                {formatPrice(product.salePrice ?? product.price)}
              </span>
              {product.salePrice && (
                <span className="text-base text-charcoal-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full ml-auto">
                  Save {formatPrice(product.price - (product.salePrice ?? product.price))}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-emerald-800">
                In Stock ({product.stock} units available in Tejgaon hub)
              </span>
            </div>

            <p className="text-sm text-charcoal-700 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector & Add-to-cart */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center border border-brand-border rounded-xl bg-white w-fit">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-11 w-11 flex items-center justify-center text-charcoal-700 hover:bg-sand rounded-l-xl transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-charcoal-900">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  className="h-11 w-11 flex items-center justify-center text-charcoal-700 hover:bg-sand rounded-r-xl transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                variant={isAdded ? "secondary" : "primary"}
                size="lg"
                className="flex-1 shadow-md"
              >
                {isAdded ? (
                  <>
                    <Check className="h-5 w-5 mr-2 stroke-[3]" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    <span>Add to Cart ({formatPrice((product.salePrice ?? product.price) * quantity)})</span>
                  </>
                )}
              </Button>

              <Link href="/e-sheba">
                <Button variant="outline" size="lg" title="Bulk / Corporate Inquiry">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <span>Bulk Inquiry</span>
                </Button>
              </Link>
            </div>

            {/* Delivery & Trust Highlights */}
            <div className="border-t border-sand pt-6 space-y-3">
              <div className="flex items-start gap-3 text-xs text-charcoal-700">
                <Truck className="h-4 w-4 text-forest-800 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-charcoal-900">Standard Delivery:</span> ৳
                  {CLIENT_INFO.deliveryChargeDhaka} inside Dhaka, ৳
                  {CLIENT_INFO.deliveryChargeOutside} outside Dhaka. Free delivery above ৳
                  {CLIENT_INFO.freeDeliveryThreshold.toLocaleString()}!
                </div>
              </div>
              <div className="flex items-start gap-3 text-xs text-charcoal-700">
                <ShieldCheck className="h-4 w-4 text-forest-800 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-charcoal-900">Payment Methods:</span> bKash,
                  Nagad, BRAC Bank Direct Transfer, or Cash on Delivery.
                </div>
              </div>
            </div>

            {/* Specifications Table */}
            {product.specifications && (
              <div className="border-t border-sand pt-6">
                <h3 className="font-heading font-bold text-sm text-charcoal-900 uppercase tracking-wider mb-3">
                  Product Specifications
                </h3>
                <div className="rounded-xl border border-brand-border overflow-hidden text-xs">
                  {Object.entries(product.specifications).map(([key, val], idx) => (
                    <div
                      key={key}
                      className={`grid grid-cols-3 p-3 ${
                        idx % 2 === 0 ? "bg-sand/30" : "bg-white"
                      }`}
                    >
                      <span className="font-semibold text-charcoal-600">{key}</span>
                      <span className="col-span-2 text-charcoal-900 font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-brand-border">
            <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 font-heading mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
