import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { CLIENT_INFO } from "@/data/mock-data";

export const metadata = {
  title: "Career · Future possibilities | SHOILPIKKABBO",
  description:
    "Good work begins with good people. Explore future opportunities and career enquiries at SHOILPIKKABBO.",
};

export default function CareersPage() {
  return (
    <StorefrontLayout>
      <div className="bg-[#F7F4EE] min-h-[calc(100vh-280px)] py-10 sm:py-16">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-[12px] text-[#7A837C] font-light mb-4">
            <Link href="/" className="hover:text-[#143527] transition-colors">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-[#143527]">Career</span>
          </nav>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-[42px] text-[#143527] font-normal tracking-tight leading-tight mb-12 sm:mb-14">
            Good work begins with good people.
          </h1>

          {/* Hero Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Narrative (6 cols) */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="text-[10.5px] font-semibold text-[#B85D38] uppercase tracking-widest block mb-2.5">
                FUTURE OPPORTUNITIES
              </span>
              <h2 className="font-serif text-2xl sm:text-[34px] text-[#143527] font-normal leading-snug mb-4">
                Bring your curiosity. Keep in touch.
              </h2>
              <p className="text-[13px] text-[#556059] font-light leading-relaxed mb-4 max-w-lg">
                Interested in working with SHOILPIKKABBO? We'll share approved
                roles, responsibilities and application details here when
                opportunities are confirmed.
              </p>

              {/* Status Badge */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-medium bg-[#E5ECE6] text-[#143527] border border-[#D5DDD6]">
                  No confirmed vacancies published
                </span>
              </div>

              {/* Advisory Text */}
              <p className="text-[11.5px] text-[#8C948E] font-light leading-relaxed mb-6 max-w-md">
                We are not accepting applications for a specific role at this
                time. Please do not send identity documents, banking
                information or application fees.
              </p>

              {/* Action Button */}
              <div>
                <a
                  href={`mailto:${CLIENT_INFO.email}?subject=Career%20enquiry`}
                  className="h-10 px-5 bg-transparent hover:bg-black/[0.03] border border-[#D5CDC0] text-[#143527] text-[13px] font-medium rounded-[3px] inline-flex items-center gap-2 transition-colors cursor-pointer w-fit"
                >
                  <span>Contact us about careers</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right Column: Artisan Image (6 cols) */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-[4px] overflow-hidden bg-[#EAE5DC] border border-[#E0D9CD]">
                <Image
                  src="/images/story-artisan.png"
                  alt="Artisan hands carefully crafting a woven jute basket"
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Bottom Section: When a role is available. */}
          <div className="border-t border-[#E8E2D8] mt-16 pt-12 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6">
              <h2 className="font-serif text-3xl sm:text-[36px] text-[#143527] font-normal tracking-tight leading-tight">
                When a role is available.
              </h2>
            </div>
            <div className="lg:col-span-6">
              <p className="text-[13px] text-[#556059] font-light leading-relaxed mb-4 max-w-lg">
                Each listing will include a clear role description, location,
                employment type, selection process and closing date.
              </p>
              <div className="text-[12px] text-[#6F7771] font-light leading-relaxed mb-4 space-y-0.5">
                <p>
                  Career enquiries:{" "}
                  <a
                    href={`mailto:${CLIENT_INFO.email}`}
                    className="text-[#143527] underline hover:text-[#B85D38]"
                  >
                    {CLIENT_INFO.email}
                  </a>
                </p>
                <p>
                  Use the subject "Career enquiry" and tell us the area of work
                  that interests you.
                </p>
              </div>
              <p className="text-[11px] text-[#B85D38] font-light leading-relaxed">
                Career content and hiring process await client confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
