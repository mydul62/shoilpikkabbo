"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronRight,
  ShieldCheck,
  Lock,
  Eye,
  Database,
  UserCheck,
  PhoneCall,
  Mail,
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { useSettings } from "@/context/SettingsContext";

export default function PrivacyPolicyPage() {
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
            <span className="text-[#0D3B37] font-semibold">Privacy Policy</span>
          </nav>

          {/* Page Header */}
          <div className="max-w-3xl mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0D3B37] text-xs font-bold mb-3 border border-emerald-100">
              <Lock className="w-3.5 h-3.5 text-[#E0592A]" />
              <span>Data Protection & Trust</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#0D3B37] font-extrabold tracking-tight leading-tight">
              গোপনীয়তা নীতিমালা (Privacy Policy)
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
              শিল্পিকাব্য (SHOILPIKKABBO) আপনার ব্যক্তিগত তথ্যের সর্বোচ্চ সুরক্ষা ও গোপনীয়তা বজায় রাখতে প্রতিশ্রুতিবদ্ধ। আমরা গ্রাহকের কোনো তথ্য বাণিজ্যিক উদ্দেশ্যে কোনো তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করি না।
            </p>
            <p className="text-xs text-gray-400 mt-2 font-medium">
              সর্বশেষ পরিমার্জন: অক্টোবর ২০২৬
            </p>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0D3B37] flex items-center justify-center">
                <Database className="w-5 h-5 text-[#0D3B37]" />
              </div>
              <h3 className="text-sm font-bold text-[#0D3B37]">তথ্য সংগ্রহ ও ব্যবহার</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                শুধুমাত্র আপনার নাম, যোগাযোগের নম্বর ও পার্সেল ডেলিভারি ঠিকানা সংগ্রহ করা হয় সঠিক গন্তব্যে পণ্য পৌঁছানোর স্বার্থে।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0D3B37]">পেমেন্ট ডেটা এনক্রিপশন</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                পেমেন্ট সম্পূর্ণ বাংলাদেশ ব্যাংক নিয়ন্ত্রিত SSLCommerz গেটওয়ের 256-bit SSL চ্যানেলে সম্পন্ন হয়। কোনো কার্ডের পিন আমাদের সার্ভারে রাখা হয় না।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0D3B37]">গ্রাহকের পূর্ণ নিয়ন্ত্রণ</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                যেকোনো সময় আপনি আপনার অ্যাকাউন্ট তথ্য আপডেট, সংশোধন বা প্রোফাইল মুছে ফেলার আবেদন করতে পারবেন।
              </p>
            </div>
          </div>

          {/* Detailed Policy Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-gray-100 space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#0D3B37]">১. আমরা কী কী তথ্য সংগ্রহ করি</h2>
              <p className="text-gray-600">
                অর্ডার প্রক্রিয়াকরণ এবং কাস্টমার সেবার জন্য আমরা আপনার নাম, ফোন নম্বর, ইমেইল ঠিকানা (প্রযোজ্য ক্ষেত্রে) এবং ডেলিভারির সম্পূর্ণ ঠিকানা সংগ্রহ করি।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-gray-100">
              <h2 className="text-lg font-bold text-[#0D3B37]">২. তথ্যের নিরাপত্তা ও সংরক্ষণ</h2>
              <p className="text-gray-600">
                আমাদের ডাটাবেজ আধুনিক ফায়ারওয়াল ও এনক্রিপশন প্রযুক্তির মাধ্যমে সুরক্ষিত। কুরিয়ার কোম্পানিগুলোকে শুধুমাত্র পার্সেল পৌঁছানোর জন্য প্রয়োজনীয় নাম, ফোন ও ঠিকানা হস্তান্তর করা হয়।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-gray-100">
              <h2 className="text-lg font-bold text-[#0D3B37]">৩. কুকিজ (Cookies) ও অ্যানালিটিক্স</h2>
              <p className="text-gray-600">
                ওয়েবসাইটের ব্রাউজিং অভিজ্ঞতা সহজ করতে এবং শপিং কার্ট সেশন সচল রাখতে আমরা স্ট্যান্ডার্ড কুকিজ প্রযুক্তি ব্যবহার করি।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-gray-100">
              <h2 className="text-lg font-bold text-[#0D3B37]">৪. যোগাযোগ ও তথ্য সংশোধন</h2>
              <p className="text-gray-600">
                গোপনীয়তা নীতিমালা সংক্রান্ত যেকোনো প্রশ্নের জন্য আপনি সরাসরি আমাদের সাপোর্ট সেন্টারে যোগাযোগ করতে পারেন:{" "}
                <strong className="text-[#0D3B37]">{settings.contactEmail}</strong> অথবা ফোন করুন{" "}
                <strong className="text-[#0D3B37]">{settings.contactPrimary}</strong> নম্বরে।
              </p>
            </section>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
