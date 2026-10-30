"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Truck,
  Clock,
  MapPin,
  PackageCheck,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { useSettings } from "@/context/SettingsContext";

export default function ShippingPolicyPage() {
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
            <span className="text-[#0D3B37] font-semibold">Shipping Policy</span>
          </nav>

          {/* Page Header */}
          <div className="max-w-3xl mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0D3B37] text-xs font-bold mb-3 border border-emerald-100">
              <Truck className="w-3.5 h-3.5 text-[#E0592A]" />
              <span>Nationwide Delivery Network</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#0D3B37] font-extrabold tracking-tight leading-tight">
              শিপিং ও ডেলিভারি নীতিমালা (Shipping Policy)
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
              শিল্পিকাব্য সারা বাংলাদেশের সকল ৬৪টি জেলায় নির্ভরযোগ্য কুরিয়ার পার্টনারদের মাধ্যমে অত্যন্ত যত্নের সাথে পার্সেল হোম ডেলিভারি প্রদান করে।
            </p>
          </div>

          {/* Pricing & Timeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-100 text-emerald-800">
                  ঢাকা সিটির ভেতর (Inside Dhaka)
                </span>
                <span className="text-2xl font-black text-[#0D3B37]">
                  ৳{settings.deliveryDhaka ?? 60}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#0D3B37]">সুপারফাস্ট হোম ডেলিভারি</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                ঢাকার যেকোনো এরিয়াতে সাধারণত <strong>{settings.deliveryTimeDhaka || "২৪ থেকে ৪৮ ঘণ্টার"}</strong> মধ্যে কাস্টমারের দোরগোড়ায় পার্সেল পৌঁছে দেওয়া হয়।
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-gray-500 font-medium">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>অর্ডার কনফার্মেশনের পর দ্রুততম সময়ে প্যাকেজিং ও হ্যান্ডওভার</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-amber-100 text-amber-900">
                  ঢাকার বাইরে (Outside Dhaka)
                </span>
                <span className="text-2xl font-black text-[#0D3B37]">
                  ৳{settings.deliveryOutside ?? 120}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#0D3B37]">সমগ্র বাংলাদেশ কভারেজ</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                বাংলাদেশের যেকোনো জেলা ও উপজেলায় সাধারণত <strong>{settings.deliveryTimeOutside || "৩ থেকে ৫ কার্যদিবসের"}</strong> মধ্যে হোম ডেলিভারি সম্পন্ন হয়।
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-gray-500 font-medium">
                <MapPin className="w-4 h-4 text-[#E0592A]" />
                <span>স্টেডফাস্ট / পেপারফ্লাই / রেডএক্স ইত্যাদি বিশ্বস্ত কুরিয়ার সার্ভিস</span>
              </div>
            </div>
          </div>

          {/* Detailed Info Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-gray-100 space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
            <h2 className="text-xl font-bold text-[#0D3B37]">শিপিং সংক্রান্ত জরুরি তথ্যাবলী:</h2>
            <ul className="space-y-3 text-gray-600 pl-4 list-disc">
              <li>
                <strong>পার্সেল ট্র্যাকিং:</strong> পার্সেল কুরিয়ারে হস্তান্তর করার সাথে সাথে আপনার ফোনে ট্র্যাকিং লিংক সহ এসএমএস পাঠানো হয়। আপনি আমাদের ওয়েবসাইটের <Link href="/track-order" className="text-[#0D3B37] font-bold underline">Track Order</Link> পেজে অর্ডার নম্বর লিখে সরাসরি পার্সেলের বর্তমান অবস্থান জানতে পারবেন।
              </li>
              <li>
                <strong>প্যাকেজিং নিরাপত্তা:</strong> প্রতিটি মাটির, পিতলের বা ফ্যাব্রিক কারুশিল্প অত্যন্ত মজবুত বাবল র‍্যাপ ও হার্ডবোর্ড বক্সে সুরক্ষিত করা হয় যাতে ট্রানজিটে কোনো ক্ষতি না হয়।
              </li>
              <li>
                <strong>ডেলিভারিম্যানের সামনে চেক:</strong> ক্যাশ অন ডেলিভারিতে পার্সেল গ্রহণের সময় ডেলিভারিম্যানের সামনেই প্যাকেটটি চেক করে নিন।
              </li>
            </ul>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
