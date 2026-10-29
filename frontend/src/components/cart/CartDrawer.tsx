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

  // Prevent background scrolling and handle Escape key when cart drawer is open
  React.useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsCartOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isCartOpen, setIsCartOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-500 ease-in-out ${
        isCartOpen ? "visible pointer-events-auto" : "invisible pointer-events-none delay-500"
      }`}
      aria-hidden={!isCartOpen}
    >
      {/* Backdrop with smooth slow fade-in/fade-out */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-500 ease-in-out ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-2 sm:pl-10">
        <div
          className={`w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-brand-border transform transition-transform duration-500 ease-out ${
            isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#FAF8F5]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="h-5 w-5 text-[#0D3B37]" />
              <h2 className="font-bold text-lg text-[#0D3B37] tracking-tight">
                Shopping Cart ({items.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-white transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5 bg-gray-50/50">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="h-20 w-20 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#0D3B37] mb-4">
                  <ShoppingBag className="h-10 w-10 stroke-[1.5]" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">
                  Your cart is empty
                </h3>
                <p className="text-sm text-gray-500 max-w-xs mt-1.5 mb-6">
                  Explore our authentic Bangladeshi artisanal handicrafts and everyday essentials.
                </p>
                <Button
                  onClick={() => setIsCartOpen(false)}
                  variant="primary"
                  size="md"
                  className="rounded-xl px-6 py-3 font-bold text-sm bg-[#0D3B37] hover:bg-[#E0592A]"
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
                    className="flex gap-3.5 p-3.5 rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.07)] transition-all"
                  >
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden shrink-0 bg-[#FAF8F5] p-2">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-contain p-1"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors shrink-0 p-1 cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm font-extrabold text-[#0D3B37] mt-1">
                          {formatPrice(currentPrice)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2.5">
                        <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="h-7 w-7 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="h-7 w-7 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-xs text-gray-500 font-medium ml-auto">
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
            <div className="border-t border-gray-100 p-5 sm:p-6 bg-white space-y-3.5 shadow-lg">
              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
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
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400 text-xs">
                  <span>Delivery Charge</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-base text-gray-900">
                  <span>Estimated Total</span>
                  <span className="text-lg text-[#0D3B37] font-extrabold">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full"
                >
                  <Button variant="primary" size="lg" className="w-full rounded-xl py-3 font-bold text-sm bg-[#0D3B37] hover:bg-[#E0592A] shadow-xs">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full"
                >
                  <Button variant="outline" size="md" className="w-full rounded-xl py-2.5 font-semibold text-sm border-gray-200 text-gray-700 hover:bg-gray-50">
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
