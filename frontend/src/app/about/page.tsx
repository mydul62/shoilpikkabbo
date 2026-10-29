import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";

export const metadata = {
  title: "About Us | SHOILPIKKABBO",
  description:
    "A Bangladeshi destination connecting craft, everyday commerce and practical services. Delivery • Quality • Reliability.",
};

export default function AboutPage() {
  return (
    <StorefrontLayout>
      <div className="bg-[#F7F4EE] min-h-[calc(100vh-280px)] py-10 sm:py-16">
        <div className="max-w-[1524px] mx-auto px-5">
          {/* Breadcrumb */}
          <nav className="text-[12px] text-[#7A837C] font-light mb-4">
            <Link href="/" className="hover:text-[#143527] transition-colors">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-[#143527]">About us</span>
          </nav>

          {/* Page Title & Subtitle */}
          <h1 className="font-serif text-3xl sm:text-[42px] text-[#143527] font-normal tracking-tight leading-tight">
            Thoughtfully brought together.
          </h1>
          <p className="text-[13px] text-[#7A837C] font-light mt-2 mb-10 sm:mb-12">
            SHOILPIKKABBO · Delivery • Quality • Reliability
          </p>

          {/* Hero Story: 2 Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Artisan weaving image (6 cols) */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-[4px] overflow-hidden bg-[#EAE5DC] border border-[#E0D9CD]">
                <Image
                  src="/images/story-artisan.png"
                  alt="Artisan hands hand-weaving a natural golden jute basket"
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Right Column: Introduction Narrative (6 cols) */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="text-[10.5px] font-semibold text-[#B85D38] uppercase tracking-widest block mb-2.5">
                OUR HERITAGE & MISSION
              </span>
              <h2 className="font-serif text-2xl sm:text-[34px] text-[#143527] font-normal leading-snug mb-4">
                A place for products, people and possibilities.
              </h2>
              <p className="text-[13.5px] sm:text-[14px] text-[#556059] font-light leading-relaxed mb-6">
                SHOILPIKKABBO is a premier Bangladeshi destination connecting
                artisanal craft, sustainable lifestyle goods, and practical institutional services.
                We bridge multigenerational artisans across Bengal with discerning homes and enterprises,
                delivering timeless craftsmanship with modern convenience.
              </p>
              <div>
                <Link
                  href="/shop"
                  className="h-11 px-6 bg-[#143527] hover:bg-[#1B4332] text-white text-[13px] font-medium rounded-[3px] inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <span>Explore our collection</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Mission & Vision Cards: 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14 sm:mt-16 mb-14 sm:mb-16">
            {/* Mission Card */}
            <div className="bg-[#EFECE6] border border-[#E5DFD3] rounded-[4px] p-6 sm:p-8">
              <span className="text-[10px] font-semibold text-[#B85D38] uppercase tracking-widest block mb-2">
                01 / COMMITMENT
              </span>
              <h3 className="font-serif text-[24px] text-[#143527] font-normal mb-3">
                Our mission
              </h3>
              <p className="text-[13px] text-[#556059] font-light leading-relaxed">
                To preserve traditional artisan livelihoods by making thoughtfully handcrafted
                creations and customized institutional services effortless to discover, customize,
                and receive nationwide.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-[#EFECE6] border border-[#E5DFD3] rounded-[4px] p-6 sm:p-8">
              <span className="text-[10px] font-semibold text-[#B85D38] uppercase tracking-widest block mb-2">
                02 / HORIZON
              </span>
              <h3 className="font-serif text-[24px] text-[#143527] font-normal mb-3">
                Our vision
              </h3>
              <p className="text-[13px] text-[#556059] font-light leading-relaxed">
                To be Bengal's foremost heritage lifestyle label, celebrated globally for ethical sourcing,
                uncompromising quality, and uplifting our local crafting communities.
              </p>
            </div>
          </div>

          {/* Bottom Pillar Row: Delivery. Quality. Reliability. */}
          <div className="border-t border-[#E8E2D8] pt-12 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6">
              <h2 className="font-serif text-3xl sm:text-[38px] text-[#143527] font-normal tracking-tight leading-tight">
                Delivery. Quality. Reliability.
              </h2>
            </div>
            <div className="lg:col-span-6">
              <p className="text-[13px] text-[#556059] font-light leading-relaxed mb-5 max-w-lg">
                Three words that define everything we do: prompt, secure door-to-door delivery across all 64 districts,
                authentic artisan grading, and customer-first support you can always count on.
              </p>
              <div>
                <Link
                  href="/contact"
                  className="h-10 px-5 bg-transparent hover:bg-black/[0.03] border border-[#D5CDC0] text-[#143527] text-[13px] font-medium rounded-[3px] inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Talk to us</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
