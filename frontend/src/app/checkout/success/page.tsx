"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, PackageCheck, ArrowRight, Truck, ShieldCheck, PhoneCall, Loader2 } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { useCart } from "@/context/CartContext";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const orderNumber = searchParams.get("orderNumber") || "";
  const paymentStatus = searchParams.get("paymentStatus") || "PAID";
  const tranId = searchParams.get("tranId") || "";
  const method = searchParams.get("method") || "SSLCOMMERZ";

  const [order, setOrder] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Clear cart on successful checkout completion
    clearCart();

    if (orderNumber) {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://shoilpikkabbo.onrender.com/api/v1";
      fetch(`${API_BASE}/orders/track/${encodeURIComponent(orderNumber)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setOrder(data.data);
          }
        })
        .catch((err) => console.warn("Failed to fetch order details:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderNumber]);

  return (
    <StorefrontLayout>
      <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-10 sm:py-16">
        <div className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Banner Status */}
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-gray-100 text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
            </div>

            <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-wider mb-2 border border-emerald-200">
              Payment Confirmed & Verified
            </span>

            <h1 className="text-3xl sm:text-4xl text-[#0D3B37] font-black tracking-tight leading-tight">
              অর্ডার ও পেমেন্ট সফল হয়েছে!
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-normal mt-2 max-w-lg mx-auto">
              ধন্যবাদ! আপনার অনলাইন পেমেন্ট সফলভাবে গৃহীত হয়েছে। আমাদের ঢাকা সেন্ট্রাল হাব থেকে পণ্য দ্রুত প্যাকেজিং করে পাঠানো হচ্ছে।
            </p>

            {/* Quick Metadata Box */}
            <div className="mt-8 bg-[#0D3B37] text-white rounded-2xl p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left shadow-[0_4px_20px_rgba(13,59,55,0.1)]">
              <div>
                <span className="text-[11px] text-white/70 uppercase tracking-wider block mb-1 font-semibold">
                  অর্ডার নাম্বার
                </span>
                <span className="text-base sm:text-lg font-black tracking-tight text-white">
                  {orderNumber || "SK-2026-CONFIRMED"}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-white/70 uppercase tracking-wider block mb-1 font-semibold">
                  পেমেন্ট মাধ্যম
                </span>
                <span className="text-sm sm:text-base font-bold text-emerald-300">
                  {method === "SSLCOMMERZ" ? "SSLCommerz Online" : method}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-white/70 uppercase tracking-wider block mb-1 font-semibold">
                  পেমেন্ট স্ট্যাটাস
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {paymentStatus}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-white/70 uppercase tracking-wider block mb-1 font-semibold">
                  ট্রানজেকশন আইডি
                </span>
                <span className="text-xs sm:text-sm font-mono font-medium text-white/90 truncate block">
                  {tranId || order?.transactionId || "TRX-VERIFIED"}
                </span>
              </div>
            </div>

            {/* Order Items & Customer Overview */}
            {order && (
              <div className="mt-8 border-t border-gray-100 pt-6 text-left">
                <h2 className="text-base font-bold text-[#0D3B37] mb-3">ডেলিভারি বিবরণ:</h2>
                <div className="bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 border border-gray-200 text-sm text-gray-700 space-y-1">
                  <p className="font-bold text-[#0D3B37] text-base">{order.customerName}</p>
                  <p>ফোন: {order.customerPhone}</p>
                  <p>ঠিকানা: {order.shippingAddress}, {order.city}</p>
                  <p className="pt-2 font-black text-[#E0592A] text-base">
                    পরিশোধিত মোট মূল্য: ৳{Number(order.totalAmount).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Trust and Help Features */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex items-start gap-3">
                <Truck className="w-5 h-5 text-[#E0592A] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#0D3B37]">সরাসরি ট্র্যাকিং</p>
                  <p className="text-[11px] text-gray-500">এসএমএস এবং ট্র্যাকিং পোর্টালে লাইভ আপডেট পাবেন।</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#0D3B37]">১০০% নিরাপদ ট্রানজেকশন</p>
                  <p className="text-[11px] text-gray-500">ব্যাংক লেভেল সিকিউরিটি ও ভেরিফাইড গেটওয়ে।</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200/70 flex items-start gap-3">
                <PhoneCall className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#0D3B37]">২৪/৭ কাস্টমার সাপোর্ট</p>
                  <p className="text-[11px] text-gray-500">যেকোনো সহায়তায় হেল্পলাইনে যোগাযোগ করুন।</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/track-order?orderNumber=${orderNumber}`}
                className="w-full sm:w-auto h-12 px-6 bg-[#0D3B37] text-white rounded-xl font-bold text-sm hover:bg-[#0D3B37]/90 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <PackageCheck className="w-4 h-4" />
                অর্ডার ট্র্যাক করুন
              </Link>
              <Link
                href="/shop"
                className="w-full sm:w-auto h-12 px-6 bg-white border border-gray-300 text-gray-800 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                আরো কেনাকাটা করুন
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}

function CheckoutSuccessLoading() {
  return (
    <StorefrontLayout>
      <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D3B37] mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500">পেমেন্ট স্ট্যাটাস যাচাই করা হচ্ছে...</p>
        </div>
      </div>
    </StorefrontLayout>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <React.Suspense fallback={<CheckoutSuccessLoading />}>
      <CheckoutSuccessContent />
    </React.Suspense>
  );
}
