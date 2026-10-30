"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  PhoneCall,
  Mail,
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { useSettings } from "@/context/SettingsContext";

export default function RefundPolicyPage() {
  const { settings } = useSettings();

  return (
    <StorefrontLayout>
      <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-8 sm:py-14">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-6">
            <Link href="/" className="hover:text-[#E0592A] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#0D3B37] font-semibold">Return & Refund Policy</span>
          </nav>

          {/* Page Header */}
          <div className="max-w-3xl mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#E0592A] text-xs font-bold mb-3 border border-orange-100">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Hassle-Free Returns</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#0D3B37] font-extrabold tracking-tight leading-tight">
              রিটার্ন ও রিফান্ড পলিসি (Return & Refund)
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
              গ্রাহক সন্তুষ্টিই শিল্পিকাব্য-এর প্রধান লক্ষ্য। আমাদের কোনো পণ্যে ত্রুটি থাকলে আমরা সম্পূর্ণ বিনামূল্যে রিপ্লেসমেন্ট অথবা টাকা ফেরতের নিশ্চয়তা দিই।
            </p>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0D3B37]">৭ দিনের সহজ রিটার্ন</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                পণ্য হাতে পাওয়ার পর ৭ দিনের মধ্যে ত্রুটির তথ্য জানালে দ্রুততম সময়ে ব্যবস্থা নেওয়া হবে।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0D3B37]">ফ্রি রিপ্লেসমেন্ট</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                ভাঙা বা ভুল পণ্য পৌঁছালে আমাদের নিজস্ব খরচে নতুন ফ্রেশ পণ্য ডেলিভারি করা হবে।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0D3B37]">১০০% মানিব্যাক গ্যারান্টি</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                রিপ্লেসমেন্ট সম্ভব না হলে বা গ্রাহক রিফান্ড চাইলে পরবর্তী ৫-৭ কার্যদিবসে টাকা ফেরত পাবেন।
              </p>
            </div>
          </div>

          {/* Step by step procedure */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-gray-100 space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">
            <h2 className="text-xl font-bold text-[#0D3B37]">কীভাবে রিটার্ন বা রিফান্ড আবেদন করবেন:</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-gray-100 space-y-2">
                <span className="w-7 h-7 rounded-full bg-[#0D3B37] text-white flex items-center justify-center text-xs font-bold">1</span>
                <h4 className="text-sm font-bold text-[#0D3B37]">ছবি বা ভিডিও তুলুন</h4>
                <p className="text-xs text-gray-600">
                  প্যাকেট খোলার সময় কোনো ত্রুটি লক্ষ্য করলে স্পষ্ট ছবি বা ছোট ভিডিও ধারণ করুন।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-gray-100 space-y-2">
                <span className="w-7 h-7 rounded-full bg-[#0D3B37] text-white flex items-center justify-center text-xs font-bold">2</span>
                <h4 className="text-sm font-bold text-[#0D3B37]">আমাদের সাপোর্ট টিমে পাঠান</h4>
                <p className="text-xs text-gray-600">
                  WhatsApp অথবা ইমেইলে আপনার অর্ডার নম্বর সহ বিস্তারিত পাঠিয়ে জানান।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-gray-100 space-y-2">
                <span className="w-7 h-7 rounded-full bg-[#0D3B37] text-white flex items-center justify-center text-xs font-bold">3</span>
                <h4 className="text-sm font-bold text-[#0D3B37]">রিপ্লেসমেন্ট / রিফান্ড</h4>
                <p className="text-xs text-gray-600">
                  আমাদের কোয়ালিটি টিম দ্রুত ভেরিফাই করে নতুন পণ্য বা পুরো টাকা ফেরত পাঠানোর ব্যবস্থা করবে।
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-gray-500">
                সহায়তার জন্য হেল্পলাইন: <strong>{settings.contactPrimary || "01977765999"}</strong> (সকাল ১০টা - রাত ১০টা)
              </span>
              <Link
                href="/contact"
                className="px-5 py-2.5 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 shrink-0"
              >
                <span>যোগাযোগ করুন</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
