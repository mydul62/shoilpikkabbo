"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Check, Package, Loader2, HelpCircle } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { formatPrice } from "@/lib/utils";
import { API_BASE } from "@/lib/api";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams?.get("order") || "";

  const [order, setOrder] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState<boolean>(Boolean(orderNumber));

  React.useEffect(() => {
    if (!orderNumber) {
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/orders/track/${encodeURIComponent(orderNumber)}`);
        const json = await res.json();
        if (json.success && json.data) {
          setOrder(json.data);
        }
      } catch {
        // Handled via fallback
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#0D3B37] animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-medium">
            Retrieving order confirmation details...
          </p>
        </div>
      </div>
    );
  }

  // If directly navigated or order not found
  if (!orderNumber || !order) {
    return (
      <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-16">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#0D3B37]/10 text-[#0D3B37] flex items-center justify-center mx-auto">
              <Package className="w-8 h-8 stroke-[1.8]" />
            </div>
            <h1 className="text-2xl sm:text-3xl text-[#0D3B37] font-bold">
              Order Confirmation Desk
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed max-w-md mx-auto">
              To review invoice details or tracking progress for an order, please visit our live tracking page with your order reference number.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/track-order"
                className="h-11 px-6 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-sm font-bold rounded-xl inline-flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>Track an order</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop"
                className="h-11 px-6 bg-[#FAF8F5] hover:bg-[#F3EFE7] text-[#0D3B37] text-sm font-bold rounded-xl inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Browse catalog</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const firstName = order.customerName ? order.customerName.split(" ")[0] : "Customer";
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-10 sm:py-16">
      <div className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tag & Checkmark */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <Check className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#E0592A] uppercase tracking-wider block">
              A Good Choice, On Its Way
            </span>
            <h1 className="text-3xl sm:text-4xl text-[#0D3B37] font-extrabold tracking-tight mt-1 leading-tight">
              Thank you, {firstName}.
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-normal mt-1.5">
              Your order has been recorded and our workshop is preparing your parcel.
            </p>
          </div>
        </div>

        {/* Dark Teal Summary Bar */}
        <div className="bg-[#0D3B37] text-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(13,59,55,0.12)] grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <span className="text-xs text-white/70 uppercase tracking-wider block mb-1 font-semibold">
              ORDER
            </span>
            <span className="text-base sm:text-lg text-white font-bold">
              {order.orderNumber}
            </span>
          </div>
          <div>
            <span className="text-xs text-white/70 uppercase tracking-wider block mb-1 font-semibold">
              PLACED
            </span>
            <span className="text-base sm:text-lg text-white font-medium">
              {orderDate}
            </span>
          </div>
          <div>
            <span className="text-xs text-white/70 uppercase tracking-wider block mb-1 font-semibold">
              TOTAL AMOUNT
            </span>
            <span className="text-lg sm:text-xl text-white font-extrabold">
              {formatPrice(Number(order.totalAmount))}
            </span>
          </div>
          <div>
            <span className="text-xs text-white/70 uppercase tracking-wider block mb-1 font-semibold">
              PAYMENT METHOD
            </span>
            <span className="text-base sm:text-lg text-white font-medium capitalize">
              {order.paymentMethod?.replace("_", " ").toLowerCase() || "Verified"}
            </span>
          </div>
        </div>

        {/* Two Column Content */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
          {/* Left Column: Delivery destination details (6 cols) */}
          <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-6">
            <h2 className="text-xl sm:text-2xl text-[#0D3B37] font-bold">
              Delivery Details
            </h2>
            <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-1">
              <p className="font-bold text-[#0D3B37]">{order.customerName}</p>
              <p>{order.shippingAddress}</p>
              <p className="text-gray-500">
                {order.city} {order.postalCode ? `· ${order.postalCode}` : ""} · {order.customerPhone}
              </p>
            </div>

            <div>
              <span className="inline-block bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xs">
                Status · {order.orderStatus}
              </span>
            </div>

            {order.customerEmail && (
              <p className="text-xs sm:text-sm text-gray-500 pt-1 leading-relaxed">
                Order updates will be sent to {order.customerEmail}. Keep your order number for tracking.
              </p>
            )}

            {/* Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href={`/track-order?order=${order.orderNumber}`}
                className="h-11 px-6 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>Track my order</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop"
                className="h-11 px-6 bg-[#FAF8F5] hover:bg-[#F3EFE7] text-[#0D3B37] text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Continue shopping</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Ordered Items (6 cols) */}
          <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)]">
            <h2 className="text-xl sm:text-2xl text-[#0D3B37] font-bold mb-6">
              Your Artisanal Selections
            </h2>

            <div className="space-y-4">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] flex items-center justify-center shrink-0 text-[#0D3B37]">
                    <Package className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                      {item.productName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Qty: {item.quantity} · {formatPrice(Number(item.unitPrice))} each
                    </p>
                  </div>
                  <span className="text-sm sm:text-base font-extrabold text-[#0D3B37] shrink-0">
                    {formatPrice(Number(item.totalPrice))}
                  </span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="mt-6 pt-5 border-t border-gray-100 space-y-2.5 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">{formatPrice(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-semibold text-gray-800">{formatPrice(Number(order.deliveryCharge || order.shippingCost || 0))}</span>
              </div>
              {Number(order.discountAmount) > 0 && (
                <div className="flex justify-between text-[#E0592A] font-semibold">
                  <span>Discount</span>
                  <span>-{formatPrice(Number(order.discountAmount))}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-extrabold text-[#0D3B37] pt-3 border-t border-gray-100">
                <span>Total</span>
                <span>{formatPrice(Number(order.totalAmount))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <StorefrontLayout>
      <React.Suspense
        fallback={
          <div className="min-h-[500px] flex items-center justify-center bg-[#F7F4EE]">
            <Loader2 className="w-8 h-8 text-[#143527] animate-spin" />
          </div>
        }
      >
        <OrderConfirmationContent />
      </React.Suspense>
    </StorefrontLayout>
  );
}
