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
    <div className="bg-[#F7F4EE] min-h-[calc(100vh-280px)] py-10 sm:py-16">
      <div className="max-w-[1524px] mx-auto px-5">
        {/* Breadcrumb */}
        <nav className="text-[12px] text-[#7A837C] font-light mb-4">
          <Link href="/" className="hover:text-[#143527] transition-colors">
            Home
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-[#143527]">Track an order</span>
        </nav>

        {/* Title & Tagline */}
        <h1 className="font-serif text-3xl sm:text-[42px] text-[#143527] font-normal tracking-tight leading-tight">
          Track your package.
        </h1>
        <p className="text-[13px] text-[#7A837C] font-light mt-2 mb-8 sm:mb-10">
          Real-time updates on hand-packed parcels from our Dhaka workshop to your door.
        </p>

        {/* Search Input Box */}
        <div className="bg-white border border-[#E8E2D8] rounded-[4px] p-6 sm:p-8 shadow-xs">
          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
          >
            <div className="md:col-span-5 space-y-1.5">
              <label
                htmlFor="orderNumber"
                className="text-[11px] font-semibold text-[#143527] uppercase tracking-wider block"
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
                  className="w-full h-11 px-3.5 bg-[#FAF7F2] border border-[#D5CDC0] focus:border-[#143527] focus:bg-white rounded-[3px] text-[13.5px] text-[#143527] placeholder:text-[#9BA39D] outline-hidden transition-colors"
                />
              </div>
            </div>

            <div className="md:col-span-4 space-y-1.5">
              <label
                htmlFor="phoneNumber"
                className="text-[11px] font-semibold text-[#143527] uppercase tracking-wider block"
              >
                Recipient Phone (Optional)
              </label>
              <input
                id="phoneNumber"
                type="tel"
                placeholder="017... or 018..."
                value={phoneQuery}
                onChange={(e) => setPhoneQuery(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#FAF7F2] border border-[#D5CDC0] focus:border-[#143527] focus:bg-white rounded-[3px] text-[13.5px] text-[#143527] placeholder:text-[#9BA39D] outline-hidden transition-colors"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 px-5 bg-[#143527] hover:bg-[#1B4332] text-white text-[13px] font-medium rounded-[3px] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 stroke-[2]" />
                    <span>Find tracking</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Area */}
        {isLoading ? (
          <div className="mt-12 bg-white border border-[#E8E2D8] rounded-[4px] p-12 text-center max-w-md mx-auto shadow-xs">
            <Loader2 className="w-8 h-8 text-[#143527] animate-spin mx-auto mb-3" />
            <p className="text-[13px] text-[#6F7771] font-light">
              Checking consignment and dispatch logs...
            </p>
          </div>
        ) : matchedOrder ? (
          <div className="mt-10 sm:mt-12 space-y-8 animate-fadeIn">
            {/* Status Header Banner */}
            <div className="bg-[#143527] text-[#FAF7F2] rounded-[4px] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div>
                <span className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-widest block mb-1">
                  Active Shipment
                </span>
                <h2 className="font-serif text-2xl sm:text-[28px] font-normal leading-tight">
                  Order {matchedOrder.orderNumber}
                </h2>
                <p className="text-[12.5px] text-[#C4CFC7] font-light mt-1">
                  Placed on {matchedOrder.createdAt} · Destination: {matchedOrder.city}
                </p>
              </div>

              <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-[3px] border border-white/15">
                <Truck className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <span className="text-[10px] text-[#C4CFC7] uppercase tracking-wider block">
                    Current Status
                  </span>
                  <span className="text-[13px] font-semibold tracking-wide capitalize">
                    {matchedOrder.orderStatus.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* 2-Column Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              {/* Left Column: Items (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-[#E8E2D8] rounded-[4px] p-6 sm:p-8 shadow-xs space-y-6">
                <h3 className="font-serif text-[20px] text-[#143527] font-normal">
                  Items in this consignment
                </h3>

                <div className="divide-y divide-[#EFECE6]">
                  {matchedOrder.items?.map((item, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-[3px] bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center shrink-0 text-[#143527]">
                          <Package className="w-6 h-6 stroke-[1.5]" />
                        </div>
                        <div>
                          <h4 className="text-[13.5px] font-medium text-[#143527]">
                            {item.productName}
                          </h4>
                          <p className="text-[12px] text-[#7A837C] font-light">
                            Qty: {item.quantity} · {formatPrice(item.price)} each
                          </p>
                        </div>
                      </div>
                      <span className="text-[13.5px] font-semibold text-[#143527]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#E8E2D8] pt-4 space-y-1.5 text-[12.5px] text-[#556059] font-light">
                  <div className="flex justify-between">
                    <span>Delivery charge</span>
                    <span>{formatPrice(matchedOrder.deliveryCharge)}</span>
                  </div>
                  {matchedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-[#B85D38]">
                      <span>Discount</span>
                      <span>-{formatPrice(matchedOrder.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[14px] font-semibold text-[#143527] pt-2 border-t border-[#EFECE6]">
                    <span>Total Amount</span>
                    <span>{formatPrice(matchedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Customer & Delivery Info (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-[#E8E2D8] rounded-[4px] p-6 shadow-xs space-y-4">
                  <h3 className="font-serif text-[18px] text-[#143527] font-normal">
                    Recipient & Address
                  </h3>
                  <div className="space-y-3 text-[13px] text-[#556059] font-light leading-relaxed">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#7A837C] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-[#143527] block">
                          {matchedOrder.customerName}
                        </span>
                        <p>{matchedOrder.shippingAddress}</p>
                        <p>{matchedOrder.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 pt-2 border-t border-[#EFECE6]">
                      <Phone className="w-4 h-4 text-[#7A837C] shrink-0" />
                      <span>{matchedOrder.customerPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#EFECE6] border border-[#E5DFD3] rounded-[4px] p-6">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-[#B85D38] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[13px] font-medium text-[#143527] mb-1">
                        Need assistance with this delivery?
                      </h4>
                      <p className="text-[12px] text-[#556059] font-light leading-relaxed mb-3">
                        Our logistics desk operates Saturday through Thursday, 9 AM to 8 PM.
                      </p>
                      <Link
                        href="/contact"
                        className="text-[12px] font-medium text-[#143527] hover:text-[#B85D38] inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Contact customer care</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : hasSearched ? (
          <div className="mt-12 bg-white border border-[#E8E2D8] rounded-[4px] p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-[22px] text-[#143527] font-normal mb-2">
              Order not found
            </h3>
            <p className="text-[13px] text-[#6F7771] font-light leading-relaxed mb-6">
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
                className="h-10 px-5 bg-transparent border border-[#D5CDC0] text-[#143527] text-[13px] font-medium rounded-[3px] transition-colors cursor-pointer"
              >
                Clear Search
              </button>
              <Link
                href="/contact"
                className="h-10 px-5 bg-[#143527] hover:bg-[#1B4332] text-white text-[13px] font-medium rounded-[3px] inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Contact Support</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-12 border border-[#E8E2D8] border-dashed rounded-[4px] p-10 text-center max-w-lg mx-auto bg-white/50">
            <Package className="w-10 h-10 text-[#7A837C] stroke-[1.2] mx-auto mb-3" />
            <h3 className="font-serif text-[18px] text-[#143527] font-normal mb-1.5">
              Ready to track your parcel
            </h3>
            <p className="text-[12.5px] text-[#7A837C] font-light leading-relaxed max-w-sm mx-auto">
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
