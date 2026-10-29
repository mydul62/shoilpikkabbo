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
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="py-20 text-center bg-white border border-[#E8E2D8] rounded-xl max-w-xl mx-auto p-8 shadow-xs">
              <h2 className="font-serif text-2xl text-[#143527] mb-2 font-normal">
                Your shopping bag is empty
              </h2>
              <p className="text-[13.5px] text-[#6A736C] font-light mb-8 max-w-sm mx-auto">
                Discover authentic handcrafted homeware, sustainable jute goods, and artisan textiles.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#143527] hover:bg-[#1B4332] text-white text-[13px] font-medium rounded-[3px] transition-colors"
              >
                <span>Continue exploring</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* Left Column: Products List & Coupon (8 cols) */}
              <div className="lg:col-span-8">
                {/* Table Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E0D9CD] text-[11px] font-medium tracking-wider text-[#8C948E] uppercase">
                  <span>PRODUCT</span>
                  <span>QUANTITY / TOTAL</span>
                </div>

                {/* Items List */}
                <div className="divide-y divide-[#EAE3D5]">
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
                            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-[#EFECE6] shrink-0 border border-[#E8E2D8]"
                          >
                            <Image
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              fill
                              sizes="96px"
                              className="object-cover"
                            />
                          </Link>

                          <div className="flex flex-col justify-between self-stretch py-0.5">
                            <div>
                              <Link
                                href={`/products/${item.product.slug}`}
                                className="font-serif text-[17px] sm:text-[18px] text-[#143527] hover:text-[#B85D38] transition-colors leading-snug font-normal block"
                              >
                                {item.product.name}
                              </Link>
                              <p className="text-[12.5px] text-[#7A837C] font-light mt-1">
                                {getItemVariantText(item)}
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 text-[12px] text-[#7A837C] mt-2">
                              <span>In stock</span>
                              <span>·</span>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="hover:text-[#B85D38] hover:underline transition-colors cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Stepper & Line Total */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 shrink-0 pt-2 sm:pt-0">
                          {/* Stepper */}
                          <div className="inline-flex items-center border border-[#D5CDC0] rounded-[2px] bg-white h-9 px-1">
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                              className="w-7 h-full flex items-center justify-center text-[#143527] hover:bg-[#F7F4EE] transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-[13px] font-medium text-[#143527]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                              className="w-7 h-full flex items-center justify-center text-[#143527] hover:bg-[#F7F4EE] transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Line Total */}
                          <div className="w-20 sm:w-24 text-right">
                            <span className="text-[15px] sm:text-[16px] font-medium text-[#143527]">
                              ৳{lineTotal.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Border */}
                <div className="border-b border-[#E0D9CD]" />

                {/* Coupon Code Section */}
                <div className="mt-8 sm:mt-10">
                  <h3 className="text-[13px] font-semibold text-[#143527] mb-2.5">
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
                      className="flex-1 h-11 px-4 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] placeholder:text-[#9EA8A1] uppercase tracking-wider focus:outline-none focus:border-[#143527] transition-colors"
                    />
                    <button
                      type="submit"
                      className="h-11 px-6 bg-[#F4F1EB] hover:bg-[#EAE4D8] border border-[#D5CDC0] text-[#143527] text-[13px] font-medium rounded-[2px] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Apply</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </form>

                  {couponFeedback && (
                    <div className="flex items-center gap-2 mt-2.5 text-[12.5px]">
                      {couponFeedback.success ? (
                        <p className="text-[#143527] font-normal flex items-center gap-1.5">
                          <span>✓</span>
                          <span>{couponFeedback.message}</span>
                        </p>
                      ) : (
                        <p className="text-rose-600 font-normal">
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
                          className="text-[11.5px] text-[#7A837C] hover:text-rose-600 underline ml-2 cursor-pointer"
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
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#F4F1EB] border border-[#D5CDC0] rounded-[2px] text-[13px] font-medium text-[#143527] transition-colors cursor-pointer"
                  >
                    <span>Continue exploring</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Questions / Support Link */}
                <div className="mt-8 text-[12.5px] text-[#6A736C] font-light">
                  <span>Questions about your order? </span>
                  <a
                    href="https://wa.me/8801731214379"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#143527] hover:text-[#B85D38] underline underline-offset-2 transition-colors"
                  >
                    WhatsApp
                  </a>
                  <span> or </span>
                  <a
                    href="https://m.me/shoilpikkabbo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#143527] hover:text-[#B85D38] underline underline-offset-2 transition-colors inline-flex items-center gap-0.5"
                  >
                    <span>Facebook Messenger</span>
                    <ArrowUpRight className="w-3 h-3 inline" />
                  </a>
                </div>
              </div>

              {/* Right Column: Order Summary Card (4 cols) */}
              <div className="lg:col-span-4">
                <div className="bg-white border border-[#E8E2D8] rounded-xl p-6 sm:p-7 shadow-xs sticky top-24">
                  <h2 className="font-serif text-[22px] sm:text-[24px] text-[#143527] font-normal leading-tight">
                    Your order
                  </h2>
                  <p className="text-[12.5px] text-[#8C948E] font-light mt-1 mb-5">
                    {totalCount} items · thoughtfully chosen
                  </p>

                  {/* Line Items Breakdown */}
                  <div className="space-y-3 pt-2 text-[13px] border-t border-[#F0EBE1]">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex justify-between items-start text-[#333E35]"
                      >
                        <span className="pr-3 text-[#333E35] font-light line-clamp-1">
                          {item.product.name} × {item.quantity}
                        </span>
                        <span className="font-medium text-[#143527] shrink-0">
                          ৳{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}

                    <div className="flex justify-between text-[#333E35] pt-1">
                      <span className="font-light">Subtotal</span>
                      <span className="font-medium text-[#143527]">
                        ৳{subtotal.toLocaleString()}
                      </span>
                    </div>

                    {discount > 0 && appliedCoupon && (
                      <div className="flex justify-between text-[#333E35]">
                        <span className="font-light">{appliedCoupon.code}</span>
                        <span className="font-medium text-[#143527]">
                          -৳{discount.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#333E35]">
                      <span className="font-light">Delivery · Dhaka</span>
                      <span className="font-medium text-[#143527]">
                        ৳{deliveryCharge.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Total Row */}
                  <div className="border-t border-[#E8E2D8] mt-4 pt-4 flex justify-between items-baseline">
                    <span className="text-[14px] font-medium text-[#143527]">
                      Total · BDT
                    </span>
                    <span className="font-serif text-[26px] sm:text-[28px] text-[#143527] font-normal tracking-tight">
                      ৳{total.toLocaleString()}
                    </span>
                  </div>

                  {/* Continue to Checkout Button */}
                  <Link
                    href="/checkout"
                    className="w-full h-12 bg-[#143527] hover:bg-[#1B4332] text-white text-[13.5px] font-medium rounded-[3px] inline-flex items-center justify-center gap-2 mt-5 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Continue to checkout</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>

                  {/* Disclaimer subtext */}
                  <p className="text-[11px] text-[#8C948E] leading-relaxed mt-4 font-light">
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
