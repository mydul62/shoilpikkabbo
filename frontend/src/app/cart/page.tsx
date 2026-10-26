"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  Truck,
  ArrowLeft,
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { CLIENT_INFO } from "@/data/mock-data";

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    shippingCity,
    setShippingCity,
    subtotal,
    discount,
    deliveryCharge,
    total,
  } = useCart();

  const [couponInput, setCouponInput] = React.useState("");
  const [couponFeedback, setCouponFeedback] = React.useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
  };

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 font-heading mb-6 flex items-center gap-3">
          <ShoppingBag className="h-7 w-7 text-forest-800" />
          <span>Shopping Cart ({items.length} items)</span>
        </h1>

        {items.length === 0 ? (
          <div className="p-16 text-center rounded-2xl border border-brand-border bg-white shadow-xs max-w-xl mx-auto my-8">
            <div className="h-20 w-20 mx-auto rounded-full bg-forest-50 text-forest-800 flex items-center justify-center mb-4">
              <ShoppingBag className="h-10 w-10 stroke-[1.5]" />
            </div>
            <h2 className="font-heading font-bold text-xl text-charcoal-900">
              Your Shopping Cart is Empty
            </h2>
            <p className="text-sm text-charcoal-500 max-w-sm mx-auto mt-2 mb-6">
              Looks like you haven't added any handcrafted items or lifestyle essentials yet.
            </p>
            <Link href="/shop">
              <Button variant="primary" size="lg">
                Explore Catalog
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Items Table (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="rounded-2xl border border-brand-border bg-white shadow-xs overflow-hidden">
                <div className="p-4 bg-sand/40 border-b border-brand-border flex items-center justify-between text-xs font-bold text-charcoal-700 uppercase tracking-wider">
                  <span>Product Information</span>
                  <button
                    onClick={clearCart}
                    className="text-rose-600 hover:text-rose-800 transition-colors font-medium cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-sand">
                  {items.map((item) => {
                    const price = item.product.salePrice ?? item.product.price;
                    return (
                      <div
                        key={item.product.id}
                        className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                      >
                        <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden bg-sand shrink-0 border border-brand-border">
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-forest-800 uppercase tracking-wider">
                            {item.product.categoryName}
                          </span>
                          <h3 className="text-sm font-bold text-charcoal-900 line-clamp-1 mt-0.5">
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="hover:text-forest-800"
                            >
                              {item.product.name}
                            </Link>
                          </h3>
                          <p className="text-xs text-charcoal-400 mt-0.5">
                            SKU: {item.product.sku}
                          </p>
                          <p className="text-sm font-extrabold text-forest-900 mt-1">
                            {formatPrice(price)}
                          </p>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center border border-brand-border rounded-xl bg-sand/30">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="h-9 w-9 flex items-center justify-center text-charcoal-700 hover:bg-sand rounded-l-xl transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-10 text-center text-xs font-bold text-charcoal-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="h-9 w-9 flex items-center justify-center text-charcoal-700 hover:bg-sand rounded-r-xl transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Line Subtotal */}
                        <div className="text-right sm:w-28">
                          <p className="text-sm font-black text-forest-900">
                            {formatPrice(price * item.quantity)}
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-2 text-charcoal-400 hover:text-rose-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 hover:text-forest-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* Right Summary Card (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Order Summary Box */}
              <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-5">
                <h2 className="font-heading font-bold text-lg text-charcoal-900 border-b border-sand pb-3">
                  Order Summary
                </h2>

                {/* Delivery Zone Toggle */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-charcoal-800 flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-forest-800" />
                    <span>Delivery Location</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setShippingCity("Dhaka")}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        shippingCity === "Dhaka"
                          ? "bg-forest-50 border-forest-800 text-forest-900 ring-1 ring-forest-800/20"
                          : "border-brand-border bg-white text-charcoal-600"
                      }`}
                    >
                      Inside Dhaka (৳{CLIENT_INFO.deliveryChargeDhaka})
                    </button>
                    <button
                      type="button"
                      onClick={() => setShippingCity("Outside Dhaka")}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        shippingCity === "Outside Dhaka"
                          ? "bg-forest-50 border-forest-800 text-forest-900 ring-1 ring-forest-800/20"
                          : "border-brand-border bg-white text-charcoal-600"
                      }`}
                    >
                      Outside Dhaka (৳{CLIENT_INFO.deliveryChargeOutside})
                    </button>
                  </div>
                  {subtotal >= CLIENT_INFO.freeDeliveryThreshold && (
                    <p className="text-[11px] font-semibold text-emerald-700">
                      🎉 Free Delivery threshold reached! (Over ৳
                      {CLIENT_INFO.freeDeliveryThreshold.toLocaleString()})
                    </p>
                  )}
                </div>

                {/* Coupon Input Form */}
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="text-xs font-bold text-charcoal-800 flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-forest-800" />
                    <span>Promo Voucher</span>
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="e.g. WELCOME10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="uppercase text-xs"
                    />
                    <Button type="submit" variant="secondary" size="md">
                      Apply
                    </Button>
                  </div>
                  {couponFeedback && (
                    <p
                      className={`text-xs ${
                        couponFeedback.success ? "text-emerald-700" : "text-rose-600"
                      }`}
                    >
                      {couponFeedback.message}
                    </p>
                  )}
                  {appliedCoupon && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                      <span>Applied: {appliedCoupon.code} ({appliedCoupon.discountPercentage}% OFF)</span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-rose-700 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </form>

                {/* Subtotals Breakdown */}
                <div className="space-y-2 text-xs pt-3 border-t border-sand">
                  <div className="flex justify-between text-charcoal-600">
                    <span>Items Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Coupon Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-charcoal-600">
                    <span>Standard Shipping</span>
                    <span>{deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-charcoal-900 border-t border-brand-border pt-3">
                    <span>Estimated Total</span>
                    <span className="text-forest-900">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Checkout Link */}
                <Link href="/checkout" className="block pt-2">
                  <Button variant="primary" size="lg" className="w-full shadow-lg">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
