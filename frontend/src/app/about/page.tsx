import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, Sparkles, Truck, ShieldCheck, HeartHandshake } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";

export const metadata = {
  title: "About Us | SHOILPIKKABBO",
  description:
    "A Bangladeshi destination connecting craft, everyday commerce and practical services. Delivery • Quality • Reliability.",
};

export default function AboutPage() {
  return (
    <StorefrontLayout>
      <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-8 sm:py-14">
        <div className="max-w-[1524px] mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-6">
            <Link href="/" className="hover:text-[#E0592A] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#0D3B37] font-semibold">About Us</span>
          </nav>

          {/* Page Title & Subtitle */}
          <div className="max-w-3xl mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0D3B37] text-xs font-bold mb-3 border border-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-[#E0592A]" />
              <span>Heritage Craft & Everyday Commerce</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#0D3B37] font-extrabold tracking-tight leading-tight">
              Thoughtfully brought together.
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
              SHOILPIKKABBO is built upon three foundational tenets: Delivery, Quality, and Reliability. Bridging traditional artisans with modern lifestyle needs across Bangladesh.
            </p>
          </div>

          {/* Hero Story: 2 Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center mb-16">
            {/* Left Column: Artisan weaving image (6 cols) */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100">
                <Image
                  src="/images/story-artisan.png"
                  alt="Artisan hands hand-weaving a natural golden jute basket"
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>
            </div>

            {/* Right Column: Introduction Narrative (6 cols) */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-4">
              <span className="text-xs font-bold text-[#E0592A] uppercase tracking-wider block">
                OUR HERITAGE & MISSION
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D3B37] leading-tight">
                A place for products, people and possibilities.
              </h2>
              <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed">
                SHOILPIKKABBO is a premier Bangladeshi destination celebrating indigenous artisanal craft, sustainable lifestyle goods, and institutional enterprise solutions.
              </p>
              <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed">
                We bridge multigenerational artisans across Bengal with discerning homes and enterprises, empowering craftspeople with fair compensation while delivering authentic craftsmanship with seamless digital convenience.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="h-12 px-7 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-sm font-bold rounded-xl inline-flex items-center gap-2 transition-all shadow-md shadow-[#0D3B37]/15 hover:shadow-orange-500/25 cursor-pointer"
                >
                  <span>Explore our collection</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Mission & Vision Cards: 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16">
            {/* Mission Card */}
            <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 border border-gray-100">
              <span className="text-xs font-bold text-[#E0592A] uppercase tracking-wider block mb-2">
                01 / COMMITMENT
              </span>
              <h3 className="text-2xl font-bold text-[#0D3B37] mb-3">
                Our mission
              </h3>
              <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed">
                To preserve traditional artisan livelihoods by making thoughtfully handcrafted creations and customized institutional services effortless to discover, customize, and receive nationwide with uncompromised quality.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 border border-gray-100">
              <span className="text-xs font-bold text-[#E0592A] uppercase tracking-wider block mb-2">
                02 / HORIZON
              </span>
              <h3 className="text-2xl font-bold text-[#0D3B37] mb-3">
                Our vision
              </h3>
              <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed">
                To be Bengal's foremost heritage lifestyle label, celebrated globally for ethical sourcing, uncompromising quality, and elevating local crafting communities through sustainable economic dignity.
              </p>
            </div>
          </div>

          {/* Bottom Pillar Row: Delivery. Quality. Reliability. */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
              <div className="lg:col-span-6">
                <span className="text-xs font-bold text-[#E0592A] uppercase tracking-wider block mb-2">
                  OUR BRAND PROMISE
                </span>
                <h2 className="text-3xl sm:text-4xl text-[#0D3B37] font-extrabold tracking-tight leading-tight">
                  Delivery. Quality. Reliability.
                </h2>
              </div>
              <div className="lg:col-span-6">
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-5">
                  Three core principles define every customer touchpoint: prompt, secure door-to-door delivery across all 64 districts, authentic artisan grading, and customer-first support you can always count on.
                </p>
                <div>
                  <Link
                    href="/contact"
                    className="h-12 px-7 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-sm font-bold rounded-xl inline-flex items-center gap-2 transition-all shadow-md shadow-[#0D3B37]/15 hover:shadow-orange-500/25 cursor-pointer"
                  >
                    <span>Talk to us</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0D3B37] flex items-center justify-center shrink-0">
                  <Truck className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0D3B37]">Fast Delivery</h4>
                  <p className="text-xs text-gray-500 mt-1">Reliable nationwide doorstep dispatch across all 64 districts.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0D3B37] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0D3B37]">Guaranteed Quality</h4>
                  <p className="text-xs text-gray-500 mt-1">100% genuine handcrafted materials & rigorous quality checks.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0D3B37] flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0D3B37]">Trusted Reliability</h4>
                  <p className="text-xs text-gray-500 mt-1">Dedicated customer care with live order tracking & instant support.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
