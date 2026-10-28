"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus, Check, Copy } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { useCart } from "@/context/CartContext";
import { CLIENT_INFO, MOCK_PRODUCTS } from "@/data/mock-data";

export default function OffersPage() {
  const { addToCart } = useCart();
  const [copied, setCopied] = React.useState(false);
  const [addedItem, setAddedItem] = React.useState<string | null>(null);

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
    }
  };

  return (
    <StorefrontLayout>
      <div className="bg-[#F7F4EE] min-h-[calc(100vh-280px)] py-10 sm:py-16">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-[12px] text-[#7A837C] font-light mb-4">
            <Link href="/" className="hover:text-[#143527] transition-colors">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-[#143527]">Offers / Discounts</span>
          </nav>

          {/* Headline & Subtitle */}
          <h1 className="font-serif text-3xl sm:text-[42px] text-[#143527] font-normal tracking-tight leading-tight">
            A little extra delight.
          </h1>
          <p className="text-[13.5px] sm:text-[14px] text-[#556059] font-light mt-2 mb-10">
            Considered finds, with a little something taken off.
          </p>

          {/* Hero Promo Card (Forest Green #143527) */}
          <div className="bg-[#143527] text-white rounded-[4px] overflow-hidden mb-16 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left Column: Coupon Info (7 cols) */}
              <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-center">
                <span className="text-[10px] font-semibold text-[#A3B8AA] uppercase tracking-widest block mb-3.5">
                  YOUR FIRST ORDER
                </span>

                <h2 className="font-serif text-3xl sm:text-[40px] text-white font-normal leading-tight mb-3">
                  Make yourself at home.
                </h2>

                <p className="text-[15px] sm:text-[16px] text-[#D8E2DA] font-light mb-6">
                  ৳150 off orders of ৳1,500 or more.
                </p>

                {/* Dashed Code Box */}
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => handleCopyCode("WELCOME150")}
                    className="border border-dashed border-[#5C7565] hover:border-white px-4 py-2 rounded-[2px] bg-white/5 inline-flex items-center gap-3 transition-colors cursor-pointer group"
                    title="Click to copy code"
                  >
                    <span className="font-mono text-[14px] text-white tracking-widest font-medium">
                      WELCOME150
                    </span>
                    {copied ? (
                      <span className="text-[11px] text-[#A3B8AA] flex items-center gap-1 font-sans">
                        <Check className="w-3.5 h-3.5 text-white" />
                        Copied
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#A3B8AA] group-hover:text-white flex items-center gap-1 font-sans">
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </span>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-[#8EA295] font-light leading-relaxed mb-6 space-y-0.5">
                  <p>One use per customer · Until 30 Nov 2026</p>
                  <p>
                    Cannot be combined with another order-level code. Delivery
                    excluded.
                  </p>
                </div>

                <div>
                  <Link
                    href="/shop"
                    className="bg-white hover:bg-[#F3EFE7] text-[#143527] text-[13px] font-medium px-5 py-2.5 rounded-[3px] inline-flex items-center gap-2 transition-colors cursor-pointer w-fit shadow-xs"
                  >
                    <span>Find your first favourite</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Gift Image (5 cols) */}
              <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-[#1B4332]">
                <Image
                  src="/images/corporate-gifting-feature.png"
                  alt="Gift box wrapped in forest green ribbon with a warm cup of tea"
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
              <h2 className="font-serif text-2xl sm:text-[34px] text-[#143527] font-normal leading-tight">
                Good finds. Better prices.
              </h2>
              <span className="text-[10px] font-semibold text-[#B85D38] uppercase tracking-widest">
                PRICES AS MARKED
              </span>
            </div>

            {/* 3 Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Product 1: Everyday jute basket */}
              <div className="group">
                <div className="relative aspect-square rounded-[4px] overflow-hidden bg-[#EAE5DC] border border-[#E0D9CD]">
                  <Link href="/products/everyday-jute-basket">
                    <Image
                      src="/images/product-jute-basket.png"
                      alt="Everyday jute basket"
                      fill
                      sizes="(max-width: 768px) 100vw, 320px"
                      className="object-cover transition-transform duration-300 group-hover:scale-102"
                    />
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      handleAddProduct("prod-jute-basket", "Everyday jute basket")
                    }
                    className="w-7 h-7 rounded-full bg-white hover:bg-[#F3EFE7] text-[#143527] shadow-sm flex items-center justify-center absolute bottom-3 right-3 cursor-pointer transition-transform hover:scale-110"
                    title="Add to bag"
                    aria-label="Add Everyday jute basket to bag"
                  >
                    <Plus className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>

                <div className="pt-3">
                  <span className="text-[11px] text-[#7A837C] font-light block mb-0.5">
                    Jute items
                  </span>
                  <Link
                    href="/products/everyday-jute-basket"
                    className="text-[13.5px] font-medium text-[#143527] hover:text-[#B85D38] transition-colors block"
                  >
                    Everyday jute basket
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[13px] font-medium text-[#143527]">
                      ৳1,450
                    </span>
                    <span className="text-[12px] text-[#8C948E] line-through font-light">
                      ৳1,650
                    </span>
                  </div>
                </div>
              </div>

              {/* Product 2: The everyday jute tote */}
              <div className="group">
                <div className="relative aspect-square rounded-[4px] overflow-hidden bg-[#EAE5DC] border border-[#E0D9CD]">
                  <Link href="/products/everyday-jute-tote">
                    <Image
                      src="/images/product-jute-tote.png"
                      alt="The everyday jute tote"
                      fill
                      sizes="(max-width: 768px) 100vw, 320px"
                      className="object-cover transition-transform duration-300 group-hover:scale-102"
                    />
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      handleAddProduct("prod-jute-tote", "The everyday jute tote")
                    }
                    className="w-7 h-7 rounded-full bg-white hover:bg-[#F3EFE7] text-[#143527] shadow-sm flex items-center justify-center absolute bottom-3 right-3 cursor-pointer transition-transform hover:scale-110"
                    title="Add to bag"
                    aria-label="Add The everyday jute tote to bag"
                  >
                    <Plus className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>

                <div className="pt-3">
                  <span className="text-[11px] text-[#7A837C] font-light block mb-0.5">
                    Jute items
                  </span>
                  <Link
                    href="/products/everyday-jute-tote"
                    className="text-[13.5px] font-medium text-[#143527] hover:text-[#B85D38] transition-colors block"
                  >
                    The everyday jute tote
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[13px] font-medium text-[#143527]">
                      ৳850
                    </span>
                    <span className="text-[12px] text-[#8C948E] line-through font-light">
                      ৳950
                    </span>
                  </div>
                </div>
              </div>

              {/* Column 3: Information Card (Keep the small print simple.) */}
              <div className="bg-[#EFF4EF] rounded-[4px] p-6 sm:p-7 flex flex-col justify-between border border-[#E0E8E1]">
                <div>
                  <span className="text-[10px] font-semibold text-[#B85D38] uppercase tracking-widest block mb-2.5">
                    BEFORE YOU CHECK OUT
                  </span>
                  <h3 className="font-serif text-[22px] sm:text-[24px] text-[#143527] font-normal leading-snug mb-4">
                    Keep the small print simple.
                  </h3>
                  <p className="text-[12.5px] text-[#556059] font-light leading-relaxed mb-4">
                    Enter your code in the bag. Your discount appears before you
                    pay. Product-level reductions are already included in the
                    displayed price.
                  </p>
                  <p className="text-[11.5px] text-[#7A837C] font-light leading-relaxed mb-6">
                    A code not working? Check the minimum spend, expiry and
                    eligibility, or ask our team.
                  </p>
                </div>

                <div>
                  <a
                    href={`https://wa.me/${CLIENT_INFO.whatsapp || "8801731214379"}?text=Hello%20Shoilpikkabbo%2C%20I%20have%20a%20question%20about%20offers%20and%20discounts.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white hover:bg-[#F3EFE7] border border-[#D5CDC0] text-[#143527] text-[12.5px] font-medium px-4 py-2 rounded-[3px] inline-flex items-center gap-1.5 transition-colors cursor-pointer w-fit shadow-xs"
                  >
                    <span>Ask about an offer</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
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
