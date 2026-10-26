"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, Check } from "lucide-react";
import { Product } from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = React.useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const discountPercent = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col rounded-2xl border border-brand-border bg-white overflow-hidden shadow-xs hover:shadow-md hover:border-forest-700/40 transition-all duration-300">
      {/* Product Image Area */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square w-full overflow-hidden bg-sand/40"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold shadow-xs">
              -{discountPercent}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2 py-0.5 rounded-full bg-forest-800 text-white text-[10px] font-bold shadow-xs">
              NEW
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-0.5 rounded-full bg-gold-600 text-white text-[10px] font-bold shadow-xs">
              TOP RATED
            </span>
          )}
        </div>

        {/* Stock status indicator */}
        <div className="absolute bottom-2 left-2 z-10">
          {product.stock <= 5 ? (
            <span className="px-2 py-0.5 rounded bg-amber-500/90 text-charcoal-950 text-[10px] font-bold backdrop-blur-xs">
              Only {product.stock} left
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-emerald-900/80 text-white text-[10px] font-medium backdrop-blur-xs">
              In Stock
            </span>
          )}
        </div>
      </Link>

      {/* Card Content Area */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[11px] font-medium text-forest-800 uppercase tracking-wider">
            {product.categoryName}
          </span>
          <div className="flex items-center gap-1 text-gold-600 font-semibold text-xs">
            <Star className="h-3 w-3 fill-gold-500 text-gold-500" />
            <span>{product.rating}</span>
            <span className="text-charcoal-400 font-normal text-[10px]">
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Product Title */}
        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-semibold text-charcoal-900 hover:text-forest-800 line-clamp-2 transition-colors min-h-[2.5rem]"
        >
          {product.name}
        </Link>

        {/* Price & Action */}
        <div className="mt-auto pt-3 border-t border-sand flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold text-forest-900 font-heading">
                {formatPrice(product.salePrice ?? product.price)}
              </span>
              {product.salePrice && (
                <span className="text-xs text-charcoal-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAdd}
            className={`p-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-forest-800 text-white hover:bg-forest-700 shadow-sm"
            }`}
            title="Add to cart"
            aria-label="Add to cart"
          >
            {isAdded ? (
              <Check className="h-4 w-4 stroke-[3]" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
