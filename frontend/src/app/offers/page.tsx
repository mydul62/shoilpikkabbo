"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Copy, Check, ArrowRight, Tag } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_COUPONS, MOCK_PRODUCTS } from "@/data/mock-data";

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const saleProducts = MOCK_PRODUCTS.filter((p) => p.salePrice);

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-3 mb-12">
          <Badge variant="gold" className="text-xs px-3 py-1">
            Exclusive Deals & Vouchers
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 font-heading">
            Promotional Offers & Discount Coupons
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 max-w-lg mx-auto">
            Take advantage of special seasonal savings across handcrafted items, organic wellness products, and everyday essentials.
          </p>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {MOCK_COUPONS.map((coupon) => (
            <div
              key={coupon.code}
              className="p-6 rounded-2xl border-2 border-dashed border-gold-600/40 bg-gold-50/50 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Tag className="h-4 w-4 text-gold-700" />
                    <span className="text-xs font-bold text-gold-800 uppercase tracking-wider">
                      Promo Voucher
                    </span>
                  </div>
                  <h3 className="font-heading font-black text-2xl text-charcoal-900">
                    {coupon.discountPercentage}% OFF
                  </h3>
                  <p className="text-xs text-charcoal-600 mt-1">
                    {coupon.description}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-charcoal-400 block">Valid Until</span>
                  <span className="text-xs font-semibold text-charcoal-700">
                    {coupon.expiresAt}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-gold-200/60 flex items-center justify-between">
                <span className="font-mono font-bold text-sm tracking-widest text-forest-900 bg-white px-3 py-1.5 rounded-lg border border-gold-300">
                  {coupon.code}
                </span>

                <Button
                  onClick={() => handleCopy(coupon.code)}
                  variant="outline"
                  size="sm"
                  className="bg-white border-gold-600 text-gold-800 hover:bg-gold-100"
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      <span>Copy Code</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* On-Sale Products Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-charcoal-900 font-heading">
              Current Flash Discounts
            </h2>
            <Link
              href="/shop"
              className="text-xs font-bold text-forest-800 hover:underline flex items-center gap-1"
            >
              <span>Explore All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {saleProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
