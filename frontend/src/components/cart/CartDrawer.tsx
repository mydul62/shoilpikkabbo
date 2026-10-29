"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    appliedCoupon,
    removeCoupon,
    total,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-2 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-brand-border">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-sand bg-ivory">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-forest-800" />
              <h2 className="font-heading font-bold text-lg text-charcoal-900">
                Shopping Cart ({items.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-sand transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="h-20 w-20 rounded-full bg-forest-50 flex items-center justify-center text-forest-800 mb-4">
                  <ShoppingBag className="h-10 w-10 stroke-[1.5]" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-charcoal-900">
                  Your cart is empty
                </h3>
                <p className="text-sm text-charcoal-500 max-w-xs mt-1 mb-6">
                  Explore our authentic Bangladeshi artisanal handicrafts and everyday essentials.
                </p>
                <Button
                  onClick={() => setIsCartOpen(false)}
                  variant="primary"
                  size="md"
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              items.map((item) => {
                const currentPrice = item.product.salePrice ?? item.product.price;
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3 rounded-xl border border-brand-border bg-white hover:border-sand-dark transition-colors"
                  >
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden shrink-0 bg-sand">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-semibold text-charcoal-900 line-clamp-2">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-charcoal-400 hover:text-red-600 transition-colors shrink-0 p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-xs font-bold text-forest-800 mt-1">
                          {formatPrice(currentPrice)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-brand-border rounded-lg bg-sand/40">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="h-7 w-7 flex items-center justify-center text-charcoal-600 hover:text-charcoal-900 hover:bg-sand transition-colors rounded-l-lg"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-charcoal-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="h-7 w-7 flex items-center justify-center text-charcoal-600 hover:text-charcoal-900 hover:bg-sand transition-colors rounded-r-lg"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-xs text-charcoal-500 ml-auto">
                          Subtotal: {formatPrice(currentPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Totals */}
          {items.length > 0 && (
            <div className="border-t border-sand p-6 bg-ivory space-y-3">
              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <span>
                    Promo ({appliedCoupon.code} - {appliedCoupon.discountPercentage}% off)
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="underline text-emerald-800 hover:text-emerald-950 font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-charcoal-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-charcoal-500 text-xs">
                  <span>Delivery Charge</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-sand-dark pt-2 flex justify-between font-bold text-base text-charcoal-900">
                  <span>Estimated Total</span>
                  <span className="text-forest-800">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full"
                >
                  <Button variant="primary" size="lg" className="w-full">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full"
                >
                  <Button variant="outline" size="md" className="w-full">
                    View Full Cart
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
