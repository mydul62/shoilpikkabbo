"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { useCart } from "@/context/CartContext";
import { CLIENT_INFO } from "@/data/mock-data";

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discount,
    deliveryCharge,
    total,
  } = useCart();

  const [couponInput, setCouponInput] = React.useState(
    appliedCoupon ? appliedCoupon.code : "WELCOME150"
  );
  const [couponFeedback, setCouponFeedback] = React.useState<{
    success?: boolean;
    message?: string;
  } | null>(
    appliedCoupon
      ? {
          success: true,
          message: `${appliedCoupon.code} applied. You saved ৳${
            appliedCoupon.discountAmount || 150
          }.`,
        }
      : null
  );

  // Sync coupon input when appliedCoupon changes
  React.useEffect(() => {
    if (appliedCoupon) {
      setCouponInput(appliedCoupon.code);
      setCouponFeedback({
        success: true,
        message: `${appliedCoupon.code} applied. You saved ৳${
          appliedCoupon.discountAmount || 150
        }.`,
      });
    }
  }, [appliedCoupon]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
  };

  const getItemVariantText = (item: (typeof items)[0]) => {
    if (item.product.id === "prod-jute-basket") return "Medium · Natural";
    if (item.product.id === "prod-woven-coasters") return "Set of 4 · Natural";
    if (item.product.id === "prod-jute-tote") return "One Size · Deep Green";
    if (item.product.specifications?.Material) {
      return `${item.product.specifications.Material} · Handcrafted`;
    }
    return "Standard Edition · Natural";
  };

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const getSubtitle = () => {
    if (totalCount === 1) return "One lovely addition. Take a moment to make it yours.";
    if (totalCount === 2) return "Two lovely additions. Take a moment to make them yours.";
    return `${totalCount} lovely additions. Take a moment to make them yours.`;
  };

  return (
    <StorefrontLayout>
      <div className="bg-[#F7F4EE] min-h-[calc(100vh-280px)] py-8 sm:py-12 border-b border-[#EAE3D5]">
        <div className="max-w-[1524px] mx-auto px-5">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-[12px] text-[#7A837C] mb-6">
            <Link href="/" className="hover:text-[#143527] transition-colors">
              Home
            </Link>
            <span className="text-[#B3ACA0]">/</span>
            <span className="text-[#143527] font-medium">Shopping bag</span>
          </nav>

          {/* Heading */}
          <div className="mb-8 sm:mb-10">
            <h1 className="font-serif text-3xl sm:text-[40px] text-[#143527] font-normal tracking-tight leading-tight">
              Your thoughtful finds.
            </h1>
            <p className="text-[14px] sm:text-[14.5px] text-[#6A736C] font-light mt-2">
              {items.length === 0
                ? "Your bag is currently empty. Explore our handcrafted pieces."
                : getSubtitle()}
            </p>
          </div>

          {items.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl max-w-xl mx-auto p-8 sm:p-10 shadow-[0_2px_14px_rgba(0,0,0,0.03)]">
              <h2 className="text-2xl text-[#0D3B37] mb-2 font-bold">
                Your shopping bag is empty
              </h2>
              <p className="text-sm text-gray-500 font-normal mb-8 max-w-sm mx-auto">
                Discover authentic handcrafted homeware, sustainable jute goods, and artisan textiles.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-sm font-bold rounded-xl transition-colors shadow-xs"
              >
                <span>Continue exploring</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* Left Column: Products List & Coupon (8 cols) */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)]">
                {/* Table Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 text-xs font-bold tracking-wider text-gray-400 uppercase">
                  <span>PRODUCT</span>
                  <span>QUANTITY / TOTAL</span>
                </div>

                {/* Items List */}
                <div className="divide-y divide-gray-100">
                  {items.map((item) => {
                    const lineTotal = item.product.price * item.quantity;
                    return (
                      <div
                        key={item.product.id}
                        className="py-6 sm:py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        {/* Product Info */}
                        <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#FAF8F5] shrink-0 p-2 flex items-center justify-center"
                          >
                            <Image
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              fill
                              sizes="96px"
                              className="object-contain p-1"
                            />
                          </Link>

                          <div className="flex flex-col justify-between self-stretch py-0.5">
                            <div>
                              <Link
                                href={`/products/${item.product.slug}`}
                                className="text-base sm:text-lg font-semibold text-[#0D3B37] hover:text-[#E0592A] transition-colors leading-snug block line-clamp-2"
                              >
                                {item.product.name}
                              </Link>
                              <p className="text-xs text-gray-400 font-medium mt-1">
                                {getItemVariantText(item)}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2 font-medium">
                              <span className="text-emerald-700">In stock</span>
                              <span>·</span>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Stepper & Line Total */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 shrink-0 pt-2 sm:pt-0">
                          {/* Stepper */}
                          <div className="inline-flex items-center border border-gray-200 rounded-xl bg-gray-50 h-9 px-1 overflow-hidden">
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                              className="w-7 h-full flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                              className="w-7 h-full flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Line Total */}
                          <div className="w-20 sm:w-24 text-right">
                            <span className="text-base sm:text-lg font-extrabold text-[#0D3B37]">
                              ৳{lineTotal.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Border */}
                <div className="border-b border-gray-100" />

                {/* Coupon Code Section */}
                <div className="mt-8 sm:mt-10">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                    Have a code?
                  </h3>
                  <form
                    onSubmit={handleApplyCoupon}
                    className="flex flex-col sm:flex-row items-stretch gap-2.5 max-w-lg"
                  >
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="ENTER CODE"
                      className="flex-1 h-11 px-4 bg-[#FAF8F5] border border-gray-200 rounded-xl text-xs sm:text-sm text-[#0D3B37] font-semibold placeholder:text-gray-400 uppercase tracking-wider focus:outline-none focus:border-[#0D3B37] focus:bg-white transition-colors"
                    />
                    <button
                      type="submit"
                      className="h-11 px-6 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-xs sm:text-sm font-bold rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <span>Apply</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </form>

                  {couponFeedback && (
                    <div className="flex items-center gap-2 mt-2.5 text-xs">
                      {couponFeedback.success ? (
                        <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
                          <span>✓</span>
                          <span>{couponFeedback.message}</span>
                        </p>
                      ) : (
                        <p className="text-rose-600 font-medium">
                          {couponFeedback.message}
                        </p>
                      )}
                      {appliedCoupon && (
                        <button
                          type="button"
                          onClick={() => {
                            removeCoupon();
                            setCouponFeedback(null);
                          }}
                          className="text-xs text-gray-400 hover:text-rose-600 underline ml-2 cursor-pointer font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Continue Exploring Action */}
                <div className="mt-8">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#FAF8F5] hover:bg-[#F3EFE6] rounded-xl text-xs sm:text-sm font-semibold text-[#0D3B37] transition-colors cursor-pointer"
                  >
                    <span>Continue exploring</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Questions / Support Link */}
                <div className="mt-8 text-xs text-gray-500 font-normal">
                  <span>Questions about your order? </span>
                  <a
                    href="https://wa.me/8801731214379"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0D3B37] hover:text-[#E0592A] font-semibold underline underline-offset-2 transition-colors"
                  >
                    WhatsApp
                  </a>
                  <span> or </span>
                  <a
                    href="https://m.me/shoilpikkabbo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0D3B37] hover:text-[#E0592A] font-semibold underline underline-offset-2 transition-colors inline-flex items-center gap-0.5"
                  >
                    <span>Facebook Messenger</span>
                    <ArrowUpRight className="w-3 h-3 inline" />
                  </a>
                </div>
              </div>

              {/* Right Column: Order Summary Card (4 cols) */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)] sticky top-24 space-y-4">
                  <h2 className="text-xl sm:text-2xl text-[#0D3B37] font-bold leading-tight">
                    Your Order
                  </h2>
                  <p className="text-xs text-gray-400 font-medium">
                    {totalCount} items · thoughtfully chosen
                  </p>

                  {/* Line Items Breakdown */}
                  <div className="space-y-3 pt-3 text-sm border-t border-gray-100">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex justify-between items-start text-gray-700"
                      >
                        <span className="pr-3 text-gray-600 font-normal line-clamp-1">
                          {item.product.name} × {item.quantity}
                        </span>
                        <span className="font-semibold text-[#0D3B37] shrink-0">
                          ৳{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}

                    <div className="flex justify-between text-gray-700 pt-1">
                      <span className="font-normal text-gray-600">Subtotal</span>
                      <span className="font-semibold text-[#0D3B37]">
                        ৳{subtotal.toLocaleString()}
                      </span>
                    </div>

                    {discount > 0 && appliedCoupon && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>{appliedCoupon.code}</span>
                        <span>
                          -৳{discount.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-700">
                      <span className="font-normal text-gray-600">Delivery · Dhaka</span>
                      <span className="font-semibold text-[#0D3B37]">
                        ৳{deliveryCharge.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Total Row */}
                  <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-gray-900">
                      Total · BDT
                    </span>
                    <span className="text-2xl sm:text-3xl text-[#0D3B37] font-black tracking-tight">
                      ৳{total.toLocaleString()}
                    </span>
                  </div>

                  {/* Continue to Checkout Button */}
                  <Link
                    href="/checkout"
                    className="w-full h-12 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 mt-4 transition-colors cursor-pointer shadow-md"
                  >
                    <span>Continue to checkout</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>

                  {/* Disclaimer subtext */}
                  <p className="text-[11px] text-gray-400 leading-relaxed font-normal">
                    Delivery is calculated for your selected address. Final charges are shown before payment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </StorefrontLayout>
  );
}
