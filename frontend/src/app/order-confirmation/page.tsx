"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Check, Package, Loader2, HelpCircle } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { formatPrice } from "@/lib/utils";

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
        const res = await fetch(`http://localhost:5000/api/v1/orders/track/${encodeURIComponent(orderNumber)}`);
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
      <div className="bg-[#F7F4EE] min-h-[calc(100vh-280px)] py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#143527] animate-spin mx-auto" />
          <p className="text-[13px] text-[#6F7771] font-light">
            Retrieving order confirmation details...
          </p>
        </div>
      </div>
    );
  }

  // If directly navigated or order not found
  if (!orderNumber || !order) {
    return (
      <div className="bg-[#F7F4EE] min-h-[calc(100vh-280px)] py-16">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white border border-[#E8E2D8] rounded-[4px] p-8 sm:p-12 shadow-xs space-y-5">
            <div className="w-12 h-12 rounded-full bg-[#EFECE6] text-[#143527] flex items-center justify-center mx-auto">
              <Package className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#143527] font-normal">
              Order Confirmation Desk
            </h1>
            <p className="text-[13.5px] text-[#556059] font-light leading-relaxed max-w-md mx-auto">
              To review invoice details or tracking progress for an order, please visit our live tracking page with your order reference number.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/track-order"
                className="h-11 px-6 bg-[#143527] hover:bg-[#1B4332] text-white text-[13px] font-medium rounded-[3px] inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Track an order</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/shop"
                className="h-11 px-6 bg-white hover:bg-[#F3EFE7] border border-[#D5CDC0] text-[#143527] text-[13px] font-medium rounded-[3px] inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Browse catalog</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
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
    <div className="bg-[#F7F4EE] min-h-[calc(100vh-280px)] py-10 sm:py-16">
      <div className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tag & Checkmark */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#E5ECE7] text-[#143527] flex items-center justify-center shrink-0 mt-1">
            <Check className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#B85D38] uppercase tracking-widest block">
              A GOOD CHOICE, ON ITS WAY
            </span>
            <h1 className="font-serif text-3xl sm:text-[42px] text-[#143527] font-normal tracking-tight mt-1 leading-tight">
              Thank you, {firstName}.
            </h1>
            <p className="text-[13.5px] sm:text-[14px] text-[#556059] font-light mt-1.5">
              Your order has been recorded and our workshop is preparing your parcel.
            </p>
          </div>
        </div>

        {/* Dark Green Summary Bar */}
        <div className="mt-8 bg-[#143527] text-white rounded-[3px] p-5 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <span className="text-[10px] text-[#A3B8AA] uppercase tracking-wider block mb-1 font-light">
              ORDER
            </span>
            <span className="text-[14.5px] text-white font-medium">
              {order.orderNumber}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#A3B8AA] uppercase tracking-wider block mb-1 font-light">
              PLACED
            </span>
            <span className="text-[13.5px] text-white font-light">
              {orderDate}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#A3B8AA] uppercase tracking-wider block mb-1 font-light">
              TOTAL AMOUNT
            </span>
            <span className="text-[15.5px] text-white font-medium">
              {formatPrice(Number(order.totalAmount))}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#A3B8AA] uppercase tracking-wider block mb-1 font-light">
              PAYMENT METHOD
            </span>
            <span className="text-[13.5px] text-white font-light capitalize">
              {order.paymentMethod?.replace("_", " ").toLowerCase() || "Verified"}
            </span>
          </div>
        </div>

        {/* Two Column Content */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 pt-2">
          {/* Left Column: Delivery destination details (6 cols) */}
          <div className="md:col-span-6 space-y-4">
            <h2 className="font-serif text-[24px] text-[#143527] font-normal">
              A place to arrive.
            </h2>
            <div className="text-[13.5px] text-[#333E35] leading-relaxed font-light">
              <p className="font-medium text-[#143527]">{order.customerName}</p>
              <p>{order.shippingAddress}</p>
              <p>
                {order.city} {order.postalCode ? `· ${order.postalCode}` : ""} · {order.customerPhone}
              </p>
            </div>

            <div className="pt-2">
              <span className="inline-block bg-[#E5ECE6] text-[#143527] px-3 py-1 rounded-full text-[11.5px] font-medium border border-[#D5DDD6]">
                Status · {order.orderStatus}
              </span>
            </div>

            {order.customerEmail && (
              <p className="text-[12px] text-[#6F7771] font-light pt-2 leading-relaxed">
                Order updates will be sent to {order.customerEmail}. Keep your order number for tracking.
              </p>
            )}

            {/* Buttons */}
            <div className="pt-3 flex flex-col items-start gap-2.5">
              <Link
                href={`/track-order?order=${order.orderNumber}`}
                className="h-10 px-6 bg-[#143527] hover:bg-[#1B4332] text-white text-[13px] font-medium rounded-[3px] inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Track my order</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/shop"
                className="h-10 px-6 bg-white hover:bg-[#F3EFE7] border border-[#D5CDC0] text-[#143527] text-[13px] font-medium rounded-[3px] inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Continue shopping</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Ordered Items (6 cols) */}
          <div className="md:col-span-6">
            <h2 className="font-serif text-[24px] text-[#143527] font-normal mb-5">
              Your artisanal selections
            </h2>

            <div className="space-y-4">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 py-2 border-b border-[#E8E2D8] last:border-b-0">
                  <div className="w-12 h-12 rounded-[3px] bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center shrink-0 text-[#143527]">
                    <Package className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13.5px] font-medium text-[#143527] truncate">
                      {item.productName}
                    </h3>
                    <p className="text-[12px] text-[#7A837C] font-light">
                      Qty: {item.quantity} · {formatPrice(Number(item.unitPrice))} each
                    </p>
                  </div>
                  <span className="text-[13.5px] font-semibold text-[#143527] shrink-0">
                    {formatPrice(Number(item.totalPrice))}
                  </span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="mt-6 pt-4 border-t border-[#E8E2D8] space-y-2 text-[12.5px] text-[#556059] font-light">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{formatPrice(Number(order.deliveryCharge || order.shippingCost || 0))}</span>
              </div>
              {Number(order.discountAmount) > 0 && (
                <div className="flex justify-between text-[#B85D38]">
                  <span>Discount</span>
                  <span>-{formatPrice(Number(order.discountAmount))}</span>
                </div>
              )}
              <div className="flex justify-between text-[15px] font-semibold text-[#143527] pt-2 border-t border-[#143527]/10">
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
