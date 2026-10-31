"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, Sparkles, Truck, ShieldCheck, HeartHandshake } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { pagesApi } from "@/lib/api";

export default function AboutPage() {
  const [sections, setSections] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function loadAboutData() {
      try {
        const res = await pagesApi.getPublished("about");
        if (res.success && Array.isArray((res.data as any)?.sections)) {
          setSections((res.data as any).sections);
        }
      } catch (err) {
        console.warn("Could not load dynamic about page CMS:", err);
      }
    }
    loadAboutData();
  }, []);

  const headerSec = sections.find((s) => s.type === "about_header" && s.isVisible !== false)?.props || {};
  const storySec = sections.find((s) => (s.type === "about_story" || s.type === "brand_story") && s.isVisible !== false)?.props || {};
  const pillarsSec = sections.find((s) => (s.type === "about_pillars" || s.type === "manifesto") && s.isVisible !== false)?.props || {};
  const valuesSec = sections.find((s) => s.type === "about_values" && s.isVisible !== false)?.props || {};

  return (
    <StorefrontLayout>
      <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-8 sm:py-14">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
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
              <span>{headerSec.badge || "Heritage Craft & Everyday Commerce"}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#0D3B37] font-extrabold tracking-tight leading-tight">
              {headerSec.headline || "Thoughtfully brought together."}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
              {headerSec.subtitle || "SHOILPIKKABBO is built upon three foundational tenets: Delivery, Quality, and Reliability. Bridging traditional artisans with modern lifestyle needs across Bangladesh."}
            </p>
          </div>

          {/* Hero Story: 2 Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center mb-16">
            {/* Left Column: Artisan weaving image (6 cols) */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100">
                <Image
                  src={storySec.imageUrl || "/images/story-artisan.png"}
                  alt={storySec.imageAlt || "Artisan hands hand-weaving a natural golden jute basket"}
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
                {storySec.tag || "OUR HERITAGE & MISSION"}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D3B37] leading-tight">
                {storySec.headline || "A place for products, people and possibilities."}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed">
                {storySec.paragraph1 || "SHOILPIKKABBO is a premier Bangladeshi destination celebrating indigenous artisanal craft, sustainable lifestyle goods, and institutional enterprise solutions."}
              </p>
              <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed">
                {storySec.paragraph2 || "We bridge multigenerational artisans across Bengal with discerning homes and enterprises, empowering craftspeople with fair compensation while delivering authentic craftsmanship with seamless digital convenience."}
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
                02 / ASPIRATION
              </span>
              <h3 className="text-2xl font-bold text-[#0D3B37] mb-3">
                Our vision
              </h3>
              <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed">
                To become the most dependable and inspiring bridge for Bangladeshi craft and daily utilities, celebrating Bengal&apos;s identity on the global stage.
              </p>
            </div>
          </div>

          {/* Three Foundational Tenets (Delivery, Quality, Reliability) */}
          <div className="mb-16">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
              <span className="text-xs font-bold text-[#E0592A] uppercase tracking-wider block mb-2">
                WHAT WE STAND FOR
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D3B37]">
                {pillarsSec.headline || "The Principles That Guide Us"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                {pillarsSec.subtitle || "Every order, interaction and service is held to our three uncompromising benchmarks."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Pillar 1: Delivery */}
              <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-gray-100 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0D3B37] flex items-center justify-center mb-5 border border-emerald-100 shadow-xs">
                  <Truck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[#0D3B37] mb-2">
                  {pillarsSec.pillar1Title || "Delivery"}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {pillarsSec.pillar1Desc || "Dependable, trackable, and prompt nationwide shipping reaching all 64 districts in Bangladesh. We treat every parcel as precious cargo."}
                </p>
              </div>

              {/* Pillar 2: Quality */}
              <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-gray-100 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0D3B37] flex items-center justify-center mb-5 border border-emerald-100 shadow-xs">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[#0D3B37] mb-2">
                  {pillarsSec.pillar2Title || "Quality"}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {pillarsSec.pillar2Desc || "Uncompromising raw material selection, artisanal inspection, and durable export-standard craftsmanship in every piece we curate."}
                </p>
              </div>

              {/* Pillar 3: Reliability */}
              <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-gray-100 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0D3B37] flex items-center justify-center mb-5 border border-emerald-100 shadow-xs">
                  <HeartHandshake className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[#0D3B37] mb-2">
                  {pillarsSec.pillar3Title || "Reliability"}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {pillarsSec.pillar3Desc || "Consistent customer care, transparent billing, and an authentic, long-term relationship with our patrons, artisans, and partners."}
                </p>
              </div>
            </div>
          </div>

          {/* Sustainability & Eco-Friendly Banner */}
          <div className="relative rounded-3xl bg-[#0D3B37] text-white p-8 sm:p-12 lg:p-14 overflow-hidden shadow-xl">
            <div className="max-w-2xl relative z-10 space-y-4">
              <span className="text-xs font-bold text-[#E0592A] uppercase tracking-wider block">
                SUSTAINABLE & ETHICAL
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                {valuesSec.headline || "Rooted in eco-friendly principles."}
              </h2>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                {valuesSec.body || "From biodegradable golden jute to natural non-toxic terracotta pottery, we prioritize natural alternatives over single-use plastics. Every acquisition directly sustains indigenous craft clusters across Bangladesh."}
              </p>
              <div className="pt-2">
                <Link
                  href={valuesSec.ctaLink || "/shop"}
                  className="h-11 px-6 bg-white hover:bg-emerald-50 text-[#0D3B37] text-xs font-bold rounded-xl inline-flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>{valuesSec.ctaText || "Explore our products"}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
