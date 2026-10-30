"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronRight,
  ShieldCheck,
  Scale,
  CreditCard,
  Truck,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  PhoneCall,
  Mail,
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { useSettings } from "@/context/SettingsContext";

export default function TermsPage() {
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
            <span className="text-[#0D3B37] font-semibold">Terms & Conditions</span>
          </nav>

          {/* Page Header */}
          <div className="max-w-3xl mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0D3B37] text-xs font-bold mb-3 border border-emerald-100">
              <Scale className="w-3.5 h-3.5 text-[#E0592A]" />
              <span>Customer Agreement & Policies</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#0D3B37] font-extrabold tracking-tight leading-tight">
              শর্তাবলী ও নীতিমালা (Terms & Conditions)
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
              শিল্পিকাব্য (SHOILPIKKABBO)-এর ওয়েবসাইট ব্যবহার এবং যেকোনো পণ্য ক্রয়ের পূর্বে অনুগ্রহ করে এই নিয়ম ও শর্তাবলী মনোযোগ সহকারে পড়ুন। ওয়েবসাইটটি ব্যবহারের মাধ্যমে আপনি এই সকল শর্তে সম্মতি জ্ঞাপন করছেন।
            </p>
            <p className="text-xs text-gray-400 mt-2 font-medium">
              সর্বশেষ পরিমার্জন: অক্টোবর ২০২৬
            </p>
          </div>

          {/* Quick Navigation Tabs / Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0D3B37] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#0D3B37]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0D3B37]">১০০% জেনুইন পণ্য</p>
                <p className="text-[11px] text-gray-400">খাঁটি ঐতিহ্যবাহী ক্রাফট</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0D3B37]">নিরাপদ পেমেন্ট</p>
                <p className="text-[11px] text-gray-400">SSLCommerz ও COD</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0D3B37]">সারা বাংলাদেশে ডেলিভারি</p>
                <p className="text-[11px] text-gray-400">২৪-৪৮ ঘণ্টা / ৩-৫ দিন</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#E0592A] flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0D3B37]">৭ দিনের রিটার্ন সাপোর্ট</p>
                <p className="text-[11px] text-gray-400">সহজ রিপ্লেসমেন্ট সুবিধা</p>
              </div>
            </div>
          </div>

          {/* Legal Content Body */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-gray-100 space-y-10 text-gray-700 leading-relaxed text-sm sm:text-base">
            
            {/* 1. Introduction */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#0D3B37]/10 text-[#0D3B37] flex items-center justify-center font-bold text-xs shrink-0">
                  ১
                </span>
                <h2 className="text-xl font-bold text-[#0D3B37]">
                  সাধারণ পরিচয় ও চুক্তি (General Overview & Acceptance)
                </h2>
              </div>
              <p className="text-gray-600 pl-9.5">
                <strong>শিল্পিকাব্য (SHOILPIKKABBO)</strong> বাংলাদেশের একটি প্রিমিয়াম লাইফস্টাইল ও হস্তশিল্পের বিশ্বস্ত ই-কমার্স প্ল্যাটফর্ম। আমাদের প্ল্যাটফর্ম পরিদর্শনের মাধ্যমে বা অর্ডার করার মাধ্যমে আপনি আমাদের সাধারণ শর্তাবলী, গোপনীয়তা নীতিমালা, ডেলিভারি ও রিটার্ন সংক্রান্ত বিধিমালার সাথে সম্পূর্ণরূপে একমত প্রকাশ করছেন।
              </p>
            </section>

            {/* 2. Product Authenticity & Handcrafted Nature */}
            <section className="space-y-3 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#0D3B37]/10 text-[#0D3B37] flex items-center justify-center font-bold text-xs shrink-0">
                  ২
                </span>
                <h2 className="text-xl font-bold text-[#0D3B37]">
                  পণ্যের সত্যতা, মান ও কারুশিল্পের বৈশিষ্ট্য
                </h2>
              </div>
              <div className="text-gray-600 space-y-2 pl-9.5">
                <p>
                  • আমাদের প্রতিটি পণ্য দেশীয় ঐতিহ্য, কারিগরদের ভালোবাসা ও প্রাকৃতিক উপাদানে তৈরি।
                </p>
                <p>
                  • পণ্যের ছবি ও বিবরণে শতভাগ বাস্তব রূপ বজায় রাখার চেষ্টা করা হয়েছে। তবে স্ক্রিন রেজ্যুলেশন বা আলো-ছায়ার ভিন্নতার কারণে পণ্যের রঙে সামান্য পার্থক্য দেখা যেতে পারে।
                </p>
                <p>
                  • যেহেতু পণ্যগুলো হস্তশিল্প ও ঐতিহ্যবাহী প্রক্রিয়ায় প্রস্তুতকৃত, তাই প্রতিটি ব্যাচ বা টুকরোতে সামান্য স্বতন্ত্র বৈশিষ্ট্য বা নিজস্ব স্বকীয়তা থাকা স্বাভাবিক।
                </p>
              </div>
            </section>

            {/* 3. Pricing & Payments */}
            <section className="space-y-3 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#0D3B37]/10 text-[#0D3B37] flex items-center justify-center font-bold text-xs shrink-0">
                  ৩
                </span>
                <h2 className="text-xl font-bold text-[#0D3B37]">
                  মূল্য ও পেমেন্ট নিরাপত্তা (Pricing & Payments)
                </h2>
              </div>
              <div className="text-gray-600 space-y-2 pl-9.5">
                <p>
                  • ওয়েবসাইটে প্রদর্শিত সকল মূল্য বাংলাদেশি টাকা (BDT - ৳)-তে নির্ধারিত।
                </p>
                <p>
                  • <strong>অনলাইন পেমেন্ট:</strong> বাংলাদেশ ব্যাংক অনুমোদিত এবং দেশের শীর্ষস্থানীয় পেমেন্ট গেটওয়ে <strong>SSLCommerz</strong>-এর মাধ্যমে পরিচালিত হয়। আপনার ডেবিট/ক্রেডিট কার্ড, বিকাশ, নগদ, রকেট ইত্যাদির তথ্য সম্পূর্ণ এনক্রিপ্টেড এবং নিরাপদ। শিল্পিকাব্য কখনোই আপনার কার্ডের পিন বা পাসওয়ার্ড সংরক্ষণ করে না।
                </p>
                <p>
                  • <strong>ক্যাশ অন ডেলিভারি (Cash on Delivery):</strong> কাস্টমারদের সুবিধার জন্য পণ্য হাতে পাওয়ার পর মূল্য পরিশোধের সুযোগ রয়েছে।
                </p>
              </div>
            </section>

            {/* 4. Order Confirmation & Cancellation */}
            <section className="space-y-3 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#0D3B37]/10 text-[#0D3B37] flex items-center justify-center font-bold text-xs shrink-0">
                  ৪
                </span>
                <h2 className="text-xl font-bold text-[#0D3B37]">
                  অর্ডার প্লেসমেন্ট ও বাতিলকরণ (Order & Cancellation)
                </h2>
              </div>
              <div className="text-gray-600 space-y-2 pl-9.5">
                <p>
                  • ওয়েবসাইটে সফলভাবে অর্ডার সাবমিট করার পর স্বয়ংক্রিয় এসএমএস বা ফোন কলের মাধ্যমে অর্ডার নিশ্চিত করা হতে পারে।
                </p>
                <p>
                  • পার্সেল কুরিয়ারে হস্তান্তর করার পূর্বে গ্রাহক যেকোনো সময় কাস্টমার সাপোর্টে কল করে বিনা খরচে অর্ডার বাতিল বা পরিবর্তন করতে পারবেন।
                </p>
                <p>
                  • ভুল ঠিকানা বা অনুপলব্ধ ফোন নম্বরের ক্ষেত্রে কর্তৃপক্ষ অর্ডার স্থগিত রাখার অধিকার সংরক্ষণ করে।
                </p>
              </div>
            </section>

            {/* 5. Shipping & Delivery Timeline */}
            <section className="space-y-3 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#0D3B37]/10 text-[#0D3B37] flex items-center justify-center font-bold text-xs shrink-0">
                  ৫
                </span>
                <h2 className="text-xl font-bold text-[#0D3B37]">
                  শিপিং ও ডেলিভারি সময়সীমা (Shipping Timeline)
                </h2>
              </div>
              <div className="text-gray-600 space-y-2 pl-9.5">
                <p>
                  • <strong>ঢাকা সিটির ভেতর:</strong> সাধারণত {settings.deliveryTimeDhaka || "২৪ থেকে ৪৮ ঘণ্টার"} মধ্যে ডেলিভারি সম্পন্ন হয়। ডেলিভারি চার্জ ৳{settings.deliveryDhaka ?? 60}।
                </p>
                <p>
                  • <strong>ঢাকার বাইরে (সমগ্র বাংলাদেশ):</strong> সাধারণত {settings.deliveryTimeOutside || "৩ থেকে ৫ কার্যদিবসের"} মধ্যে ডেলিভারি সম্পন্ন হয়। ডেলিভারি চার্জ ৳{settings.deliveryOutside ?? 120}।
                </p>
                <p>
                  • জাতীয় দুর্যোগ, প্রাকৃতিক প্রতিকূলতা বা অনিবার্য কারণে ডেলিভারি সাময়িক বিলম্বিত হলে গ্রাহককে অবগত করা হবে।
                </p>
              </div>
            </section>

            {/* 6. Return, Replacement & Refund Policy */}
            <section className="space-y-3 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#0D3B37]/10 text-[#0D3B37] flex items-center justify-center font-bold text-xs shrink-0">
                  ৬
                </span>
                <h2 className="text-xl font-bold text-[#0D3B37]">
                  রিটার্ন ও রিফান্ড নীতি (Return & Refund Policy)
                </h2>
              </div>
              <div className="text-gray-600 space-y-2 pl-9.5">
                <p>
                  • পণ্য হাতে পাওয়ার পর যদি কোনো ত্রুটি, ভাঙা বা ভুল পণ্য পৌঁছায়, তবে ডেলিভারি পাওয়ার সর্বোচ্চ <strong>৭ দিনের</strong> মধ্যে আমাদের কাস্টমার সাপোর্টে অবহিত করতে হবে।
                </p>
                <p>
                  • ত্রুটিযুক্ত পণ্যের ক্ষেত্রে আমরা সম্পূর্ণ নিজস্ব খরচে নতুন ফ্রেশ পণ্য রিপ্লেসমেন্ট সরবরাহ করি।
                </p>
                <p>
                  • রিপ্লেসমেন্ট সম্ভব না হলে বা গ্রাহক টাকা ফেরত চাইলে পরবর্তী ৫-৭ কার্যদিবসের মধ্যে মূল পেমেন্ট মাধ্যমে (বিকাশ/নগদ/কার্ডে) রিফান্ড সম্পন্ন করা হয়।
                </p>
              </div>
            </section>

            {/* 7. Privacy & Intellectual Property */}
            <section className="space-y-3 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#0D3B37]/10 text-[#0D3B37] flex items-center justify-center font-bold text-xs shrink-0">
                  ৭
                </span>
                <h2 className="text-xl font-bold text-[#0D3B37]">
                  গোপনীয়তা ও মেধাস্বত্ব (Privacy & Intellectual Property)
                </h2>
              </div>
              <div className="text-gray-600 space-y-2 pl-9.5">
                <p>
                  • কাস্টমারের নাম, ফোন নম্বর, ডেলিভারি ঠিকানা শুধুমাত্র পণ্য পৌঁছানো এবং অর্ডার আপডেটের উদ্দেশ্যেই সংরক্ষিত থাকে। কোনো তৃতীয় পক্ষের কাছে গ্রাহকের ডেটা হস্তান্তর বা বিক্রি করা হয় না।
                </p>
                <p>
                  • ওয়েবসাইটের সকল কন্টেন্ট, পণ্যের ফটোগ্রাফি, ব্র্যান্ড লোগো ও ডিজাইন শিল্পিকাব্য-এর নিজস্ব মেধাস্বত্ব। অনুমতি ব্যতীত বাণিজ্যিক ব্যবহার সম্পূর্ণ নিষিদ্ধ।
                </p>
              </div>
            </section>

            {/* Support Callout */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
              <div>
                <h3 className="text-base font-bold text-[#0D3B37]">
                  শর্তাবলী বা অর্ডার নিয়ে কোনো প্রশ্ন আছে?
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  আমাদের কাস্টমার কেয়ার টিম আপনাকে আন্তরিক সহায়তায় সর্বদা প্রস্তুত।
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={`tel:${settings.contactPrimary || "01977765999"}`}
                  className="px-4 py-2.5 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>কল করুন: {settings.contactPrimary || "01977765999"}</span>
                </a>
                <Link
                  href="/contact"
                  className="px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-[#0D3B37] text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>যোগাযোগ পেজ</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
