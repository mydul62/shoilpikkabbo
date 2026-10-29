"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Briefcase, MapPin, Calendar, Check, Loader2 } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { CLIENT_INFO } from "@/data/mock-data";

export default function CareersPage() {
  const [vacancies, setVacancies] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/careers");
        const json = await res.json();
        if (json.success && json.data) {
          setVacancies(json.data);
        }
      } catch (e) {
        // use fallback
      } finally {
        setLoading(false);
      }
    };
    fetchVacancies();
  }, []);

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
                Interested in working with SHOILPIKKABBO? We share verified roles, responsibilities, and artisan craft opportunities here.
              </p>

              {/* Status Badge */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-medium bg-[#E5ECE6] text-[#143527] border border-[#D5DDD6]">
                  {vacancies.length > 0
                    ? `${vacancies.length} Active Positions Open`
                    : "No confirmed vacancies published"}
                </span>
              </div>

              {/* Advisory Text */}
              <p className="text-[11.5px] text-[#8C948E] font-light leading-relaxed mb-6 max-w-md">
                We value integrity, transparent compensation, and artisan dignity. Please do not send application fees or unauthorized deposits.
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

          {/* Active Vacancies Section */}
          {vacancies.length > 0 && (
            <div className="mt-16 pt-12 border-t border-[#E8E2D8] space-y-6">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#143527] font-normal tracking-tight">
                Current Open Positions
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {vacancies.map((vac) => (
                  <div
                    key={vac.id}
                    className="p-6 rounded-xl border border-[#E0D9CD] bg-white/70 shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE3D6] pb-3">
                      <div>
                        <h3 className="font-serif text-xl font-normal text-[#143527]">
                          {vac.title}
                        </h3>
                        <p className="text-xs text-[#556059] mt-0.5">
                          {vac.department} • {vac.type} • Exp: {vac.experience}
                        </p>
                      </div>
                      <a
                        href={`mailto:${CLIENT_INFO.email}?subject=Application%20for%20${encodeURIComponent(vac.title)}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#143527] text-white text-xs font-medium rounded hover:bg-[#0F261B] transition-colors self-start sm:self-auto"
                      >
                        <span>Apply via Email</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <p className="text-xs text-[#556059] leading-relaxed">
                      {vac.description}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-[#7A837C] pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#143527]" />
                        {vac.location}
                      </span>
                      <span>
                        Application Deadline: {new Date(vac.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Section: When a role is available. */}
          <div className="border-t border-[#E8E2D8] mt-16 pt-12 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6">
              <h2 className="font-serif text-3xl sm:text-[36px] text-[#143527] font-normal tracking-tight leading-tight">
                When a role is available.
              </h2>
            </div>
            <div className="lg:col-span-6">
              <p className="text-[13px] text-[#556059] font-light leading-relaxed mb-4 max-w-lg">
                Each listing includes a clear role description, location, employment type, selection process and closing date.
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
                  Use the subject "Career enquiry" and tell us the area of work that interests you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
