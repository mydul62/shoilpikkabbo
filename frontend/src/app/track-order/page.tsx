"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  Package,
  Check,
  Clock,
  Truck,
  MapPin,
  Phone,
  Search,
  AlertCircle,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { CLIENT_INFO, Order } from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderParam = searchParams?.get("order") || "";
  const initialPhoneParam = searchParams?.get("phone") || "";

  const [orderQuery, setOrderQuery] = React.useState(initialOrderParam);
  const [phoneQuery, setPhoneQuery] = React.useState(initialPhoneParam);
  const [matchedOrder, setMatchedOrder] = React.useState<Order | null>(null);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const performSearch = React.useCallback(async (orderNo: string, phoneNo: string) => {
    const cleanOrder = orderNo.trim();
    const cleanPhone = phoneNo.trim();
    if (!cleanOrder) return;

    try {
      setIsLoading(true);
      setErrorMsg(null);
      setHasSearched(true);

      const qs = cleanPhone ? `?phone=${encodeURIComponent(cleanPhone.replace(/\s+/g, ""))}` : "";
      const res = await fetch(`http://localhost:5000/api/v1/orders/track/${encodeURIComponent(cleanOrder)}${qs}`);
      const json = await res.json();

      if (json.success && json.data) {
        const ord = json.data;
        setMatchedOrder({
          id: ord.id,
          orderNumber: ord.orderNumber,
          customerName: ord.customerName,
          customerPhone: ord.customerPhone,
          customerEmail: ord.customerEmail || "",
          shippingAddress: ord.shippingAddress,
          city: ord.city,
          totalAmount: Number(ord.totalAmount),
          finalAmount: Number(ord.totalAmount),
          deliveryCharge: Number(ord.deliveryCharge || ord.shippingCost || 0),
          discountAmount: Number(ord.discountAmount || 0),
          paymentMethod: ord.paymentMethod,
          paymentStatus: ord.paymentStatus,
          orderStatus: ord.orderStatus,
          createdAt: new Date(ord.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          items: (ord.items || []).map((i: any) => ({
            id: i.id,
            productId: i.productId,
            productName: i.productName,
            price: Number(i.unitPrice),
            quantity: i.quantity,
            imageUrl: i.product?.images?.[0]?.url || "/images/placeholder-product.png",
          })),
        });
      } else {
        setMatchedOrder(null);
        setErrorMsg(json.message || `No order found with number "${cleanOrder}". Please check your invoice.`);
      }
    } catch {
      setMatchedOrder(null);
      setErrorMsg("Unable to reach the tracking service. Please try again in a few moments.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (initialOrderParam) {
      performSearch(initialOrderParam, initialPhoneParam);
    }
  }, [initialOrderParam, initialPhoneParam, performSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) {
      alert("Please enter an Order Number to track.");
      return;
    }
    performSearch(orderQuery, phoneQuery);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-10 sm:py-16">
      <div className="max-w-[1524px] mx-auto px-5">
        {/* Breadcrumb */}
        <nav className="text-xs sm:text-sm text-gray-500 font-medium mb-4">
          <Link href="/" className="hover:text-[#0D3B37] transition-colors">
            Home
          </Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-[#0D3B37] font-semibold">Track an order</span>
        </nav>

        {/* Title & Tagline */}
        <h1 className="text-3xl sm:text-4xl text-[#0D3B37] font-extrabold tracking-tight leading-tight">
          Track Your Package
        </h1>
        <p className="text-sm sm:text-base text-gray-600 font-normal mt-2 mb-8 sm:mb-10">
          Real-time updates on hand-packed parcels from our Dhaka workshop to your door.
        </p>

        {/* Search Input Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)]">
          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
          >
            <div className="md:col-span-5 space-y-1.5">
              <label
                htmlFor="orderNumber"
                className="text-xs font-bold text-[#0D3B37] uppercase tracking-wider block"
              >
                Order Reference Number *
              </label>
              <div className="relative">
                <input
                  id="orderNumber"
                  type="text"
                  required
                  placeholder="e.g. SK-2026-101"
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  className="w-full h-11 px-4 bg-[#FAF8F5] border border-gray-200 focus:border-[#E0592A] focus:bg-white rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all"
                />
              </div>
            </div>

            <div className="md:col-span-4 space-y-1.5">
              <label
                htmlFor="phoneNumber"
                className="text-xs font-bold text-[#0D3B37] uppercase tracking-wider block"
              >
                Recipient Phone (Optional)
              </label>
              <input
                id="phoneNumber"
                type="tel"
                placeholder="017... or 018..."
                value={phoneQuery}
                onChange={(e) => setPhoneQuery(e.target.value)}
                className="w-full h-11 px-4 bg-[#FAF8F5] border border-gray-200 focus:border-[#E0592A] focus:bg-white rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 px-6 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 stroke-[2.2]" />
                    <span>Find Tracking</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Area */}
        {isLoading ? (
          <div className="mt-12 bg-white rounded-3xl p-12 text-center max-w-md mx-auto shadow-[0_2px_14px_rgba(0,0,0,0.03)]">
            <Loader2 className="w-8 h-8 text-[#0D3B37] animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500 font-medium">
              Checking consignment and dispatch logs...
            </p>
          </div>
        ) : matchedOrder ? (
          <div className="mt-10 sm:mt-12 space-y-8 animate-fadeIn">
            {/* Status Header Banner */}
            <div className="bg-[#0D3B37] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(13,59,55,0.12)]">
              <div>
                <span className="text-xs font-bold text-[#E0592A] uppercase tracking-wider block mb-1">
                  Active Shipment
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                  Order {matchedOrder.orderNumber}
                </h2>
                <p className="text-xs sm:text-sm text-white/80 font-normal mt-1">
                  Placed on {matchedOrder.createdAt} · Destination: {matchedOrder.city}
                </p>
              </div>

              <div className="flex items-center gap-3 bg-white/10 px-5 py-3 rounded-2xl border border-white/10">
                <Truck className="w-5 h-5 text-[#E0592A]" />
                <div>
                  <span className="text-[11px] text-white/70 uppercase tracking-wider block font-semibold">
                    Current Status
                  </span>
                  <span className="text-sm font-bold tracking-wide capitalize text-white">
                    {matchedOrder.orderStatus.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* 2-Column Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Items (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-6">
                <h3 className="text-xl sm:text-2xl text-[#0D3B37] font-bold">
                  Items in this Consignment
                </h3>

                <div className="divide-y divide-gray-100">
                  {matchedOrder.items?.map((item, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] flex items-center justify-center shrink-0 text-[#0D3B37]">
                          <Package className="w-6 h-6 stroke-[1.8]" />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                            {item.productName}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Qty: {item.quantity} · {formatPrice(item.price)} each
                          </p>
                        </div>
                      </div>
                      <span className="text-sm sm:text-base font-extrabold text-[#0D3B37]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-5 space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span className="font-semibold text-gray-800">{formatPrice(matchedOrder.deliveryCharge)}</span>
                  </div>
                  {matchedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-[#E0592A] font-semibold">
                      <span>Discount</span>
                      <span>-{formatPrice(matchedOrder.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-extrabold text-[#0D3B37] pt-3 border-t border-gray-100">
                    <span>Total Amount</span>
                    <span>{formatPrice(matchedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Customer & Delivery Info (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-4">
                  <h3 className="text-xl sm:text-2xl text-[#0D3B37] font-bold">
                    Recipient & Address
                  </h3>
                  <div className="space-y-3 text-sm sm:text-base text-gray-700 leading-relaxed">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#E0592A] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#0D3B37] block">
                          {matchedOrder.customerName}
                        </span>
                        <p>{matchedOrder.shippingAddress}</p>
                        <p className="text-gray-500">{matchedOrder.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <Phone className="w-5 h-5 text-[#E0592A] shrink-0" />
                      <span className="font-semibold text-gray-800">{matchedOrder.customerPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)]">
                  <div className="flex items-start gap-3.5">
                    <HelpCircle className="w-5 h-5 text-[#E0592A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-base font-bold text-[#0D3B37] mb-1">
                        Need assistance with this delivery?
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-4">
                        Our logistics desk operates Saturday through Thursday, 9 AM to 8 PM.
                      </p>
                      <Link
                        href="/contact"
                        className="text-sm font-bold text-[#0D3B37] hover:text-[#E0592A] inline-flex items-center gap-1.5 transition-colors"
                      >
                        <span>Contact Customer Care</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : hasSearched ? (
          <div className="mt-12 bg-white rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-[0_2px_14px_rgba(0,0,0,0.03)]">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-xl sm:text-2xl text-[#0D3B37] font-bold mb-2">
              Order Not Found
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              {errorMsg || `We couldn't find an order matching "${orderQuery}". Please verify your reference number or phone number.`}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setOrderQuery("");
                  setPhoneQuery("");
                  setHasSearched(false);
                }}
                className="h-11 px-6 bg-[#FAF8F5] hover:bg-[#F3EFE7] text-[#0D3B37] text-sm font-bold rounded-xl transition-colors cursor-pointer"
              >
                Clear Search
              </button>
              <Link
                href="/contact"
                className="h-11 px-6 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-sm font-bold rounded-xl inline-flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>Contact Support</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-12 bg-white rounded-3xl p-10 sm:p-12 text-center max-w-lg mx-auto shadow-[0_2px_14px_rgba(0,0,0,0.03)]">
            <div className="w-16 h-16 rounded-2xl bg-[#0D3B37]/10 text-[#0D3B37] flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 stroke-[1.8]" />
            </div>
            <h3 className="text-xl sm:text-2xl text-[#0D3B37] font-bold mb-2">
              Ready to Track Your Parcel
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
              Please enter the Order Reference Number sent to your phone or email during checkout to view dispatch and courier milestones.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <StorefrontLayout>
      <React.Suspense
        fallback={
          <div className="min-h-[500px] flex items-center justify-center bg-[#F7F4EE]">
            <p className="text-[13px] text-[#6F7771] font-light">
              Loading order tracker...
            </p>
          </div>
        }
      >
        <TrackOrderContent />
      </React.Suspense>
    </StorefrontLayout>
  );
}
