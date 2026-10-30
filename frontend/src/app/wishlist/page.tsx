"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Check,
  Star,
  Sparkles,
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist, totalWishlistCount } =
    useWishlist();
  const { addToCart } = useCart();

  const [addedItemIds, setAddedItemIds] = React.useState<Record<string, boolean>>({});

  const handleAddToCart = (item: any) => {
    addToCart(
      {
        id: item.id,
        name: item.name,
        slug: item.slug || item.id,
        categoryId: item.categoryId || "",
        categoryName: item.categoryName || "Artisanal",
        price: Number(item.price) || 0,
        salePrice: item.salePrice ? Number(item.salePrice) : undefined,
        stock: item.stock ?? 10,
        sku: `SKU-${item.id.slice(0, 6)}`,
        rating: item.rating ?? 5,
        reviewCount: item.reviewCount ?? 10,
        imageUrl: item.imageUrl,
        galleryUrls: [item.imageUrl],
        description: item.name,
        specifications: {},
      },
      1
    );

    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1800);
  };

  return (
    <StorefrontLayout>
      <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-8 sm:py-12 pb-20">
        <div className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-4">
            <Link href="/" className="hover:text-[#E0592A] transition-colors">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#0D3B37] font-bold">My Wishlist</span>
          </nav>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 pb-6 border-b border-gray-200/80">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/60 text-[#E0592A] text-xs font-bold mb-2.5">
                <Heart className="w-3.5 h-3.5 fill-[#E0592A]" />
                <span>Saved For Later</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#0D3B37] tracking-tight">
                My Wishlist
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {totalWishlistCount > 0
                  ? `You have ${totalWishlistCount} ${
                      totalWishlistCount === 1 ? "item" : "items"
                    } saved in your personal wishlist.`
                  : "Keep track of items you love and move them directly to your bag."}
              </p>
            </div>

            {totalWishlistCount > 0 && (
              <button
                type="button"
                onClick={clearWishlist}
                className="text-xs font-bold text-gray-500 hover:text-rose-600 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Wishlist</span>
              </button>
            )}
          </div>

          {/* Empty State */}
          {totalWishlistCount === 0 ? (
            <div className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-gray-100 shadow-[0_2px_14px_rgba(0,0,0,0.03)] max-w-xl mx-auto my-6">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#E0592A] flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 stroke-[1.6]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0D3B37] mb-2">
                Your wishlist is currently empty
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
                Discover authentic Bengali handicrafts, golden jute essentials, lifestyle products and tap the heart icon on any product to save it here.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0D3B37] hover:bg-[#E0592A] text-white text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
              >
                <span>Explore Shop Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            /* Wishlist Products Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5 lg:gap-6">
              {wishlist.map((item) => {
                const price = Number(item.price) || 0;
                const salePrice = item.salePrice ? Number(item.salePrice) : null;
                const isAdded = Boolean(addedItemIds[item.id]);

                // Calculate discount if sale price exists
                let discountPct = 0;
                let currentPrice = price;
                let regularPrice = price;

                if (salePrice && salePrice < price) {
                  regularPrice = price;
                  currentPrice = salePrice;
                  discountPct = Math.round(((price - salePrice) / price) * 100);
                } else if (salePrice && salePrice > price) {
                  regularPrice = salePrice;
                  currentPrice = price;
                  discountPct = Math.round(((salePrice - price) / salePrice) * 100);
                }

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all duration-300 relative group border border-gray-100"
                  >
                    {/* Discount Badge on Top Left */}
                    {discountPct > 0 && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="text-[9px] font-bold text-white bg-gradient-to-r from-[#E0592A] to-[#F59E0B] px-2 py-0.5 rounded-md shadow-2xs">
                          {discountPct}% OFF
                        </span>
                      </div>
                    )}

                    {/* Remove from Wishlist Button on Top Right */}
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/95 hover:bg-rose-50 text-gray-400 hover:text-rose-600 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                      title="Remove from wishlist"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div>
                      {/* Product Image Link */}
                      <Link
                        href={`/products/${item.slug || item.id}`}
                        className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#FAF8F5] mb-3 sm:mb-3.5 flex items-center justify-center p-3 group-hover:bg-[#F5F1E9] transition-colors block cursor-pointer"
                      >
                        <Image
                          src={item.imageUrl || "/images/client-mockup/cat-handicrafts.png"}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                          className="object-contain p-2 group-hover:scale-106 transition-transform duration-300"
                        />
                      </Link>

                      {/* Category Name */}
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 font-medium truncate">
                          {item.categoryName || "Artisanal"}
                        </p>

                        {/* Product Title */}
                        <Link
                          href={`/products/${item.slug || item.id}`}
                          className="block font-semibold text-sm sm:text-[15px] text-gray-900 group-hover:text-[#E0592A] transition-colors line-clamp-2 leading-snug h-10 overflow-hidden cursor-pointer"
                          title={item.name}
                        >
                          {item.name}
                        </Link>
                      </div>

                      {/* Rating Row */}
                      <div className="flex items-center gap-1.5 pt-2">
                        <div className="flex items-center text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        </div>
                        <span className="text-xs font-bold text-gray-700">
                          {item.rating || 4.8}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          ({item.reviewCount || 24})
                        </span>
                      </div>

                      {/* Price Row */}
                      <div className="flex items-baseline gap-2 pt-2">
                        <span className="text-base sm:text-lg font-black text-[#0D3B37]">
                          ৳ {currentPrice.toLocaleString()}
                        </span>
                        {regularPrice > currentPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            ৳ {regularPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Move to Cart Button */}
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
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
          )}
        </div>
      </div>
    </StorefrontLayout>
  );
}

