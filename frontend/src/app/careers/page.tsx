"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Briefcase, MapPin, Calendar, Check, Loader2, ChevronRight, Sparkles } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { CLIENT_INFO } from "@/data/mock-data";
import { API_BASE } from "@/lib/api";

export default function CareersPage() {
  const [vacancies, setVacancies] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const res = await fetch(`${API_BASE}/careers`);
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
      <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-8 sm:py-14">
        <div className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-6">
            <Link href="/" className="hover:text-[#E0592A] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#0D3B37] font-semibold">Careers</span>
          </nav>

          {/* Headline */}
          <div className="max-w-3xl mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0D3B37] text-xs font-bold mb-3 border border-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-[#E0592A]" />
              <span>Join Our Mission</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#0D3B37] font-extrabold tracking-tight leading-tight">
              Good work begins with good people.
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
              We empower Bangladeshi artisans and forward-thinking professionals. Explore collaborative opportunities across supply chain, digital commerce, design, and operations.
            </p>
          </div>

          {/* Hero Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center mb-16">
            {/* Left Column: Narrative (6 cols) */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-4">
              <span className="text-xs font-bold text-[#E0592A] uppercase tracking-wider block">
                CAREER OPPORTUNITIES
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D3B37] leading-tight">
                Bring your curiosity. Keep in touch.
              </h2>
              <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed">
                Interested in working with SHOILPIKKABBO? We share verified roles, operations responsibilities, and artisan craft development opportunities here.
              </p>

              {/* Status Badge */}
              <div className="pt-1">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {vacancies.length > 0
                    ? `${vacancies.length} Active Positions Open`
                    : "No confirmed vacancies published currently"}
                </span>
              </div>

              {/* Advisory Text */}
              <p className="text-xs text-gray-500 font-normal leading-relaxed max-w-md">
                We value integrity, transparent compensation, and artisan dignity. Please do not send application fees or unauthorized deposits.
              </p>

              {/* Action Button */}
              <div className="pt-2">
                <a
                  href={`mailto:${CLIENT_INFO.email}?subject=Career%20enquiry`}
                  className="h-12 px-7 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-sm font-bold rounded-xl inline-flex items-center gap-2 transition-all shadow-md shadow-[#0D3B37]/15 hover:shadow-orange-500/25 cursor-pointer w-fit"
                >
                  <span>Contact us about careers</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Column: Artisan Image (6 cols) */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100">
                <Image
                  src="/images/story-artisan.png"
                  alt="Artisan hands carefully crafting a woven jute basket"
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Active Vacancies Section */}
          {vacancies.length > 0 && (
            <div className="mb-16 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#E0592A] uppercase tracking-wider block mb-1">
                    OPENINGS
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D3B37] tracking-tight">
                    Current Open Positions
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {vacancies.map((vac) => (
                  <div
                    key={vac.id}
                    className="p-6 sm:p-7 rounded-3xl border border-gray-100 bg-white shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                      <div>
                        <h3 className="text-xl font-bold text-[#0D3B37]">
                          {vac.title}
                        </h3>
                        <p className="text-xs font-medium text-gray-500 mt-1">
                          {vac.department} • {vac.type} • Experience: {vac.experience}
                        </p>
                      </div>
                      <a
                        href={`mailto:${CLIENT_INFO.email}?subject=Application%20for%20${encodeURIComponent(vac.title)}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0D3B37] text-white text-xs font-bold rounded-xl hover:bg-[#E0592A] transition-all shadow-sm self-start sm:self-auto cursor-pointer"
                      >
                        <span>Apply via Email</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {vac.description}
                    </p>
                    <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 pt-1 gap-2">
                      <span className="flex items-center gap-1.5 font-medium text-gray-700">
                        <MapPin className="h-3.5 w-3.5 text-[#0D3B37]" />
                        {vac.location}
                      </span>
                      <span>
                        Application Deadline: <strong className="text-[#0D3B37]">{new Date(vac.deadline).toLocaleDateString()}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Section: When a role is available. */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6">
                <span className="text-xs font-bold text-[#E0592A] uppercase tracking-wider block mb-2">
                  OUR HIRING ETHOS
                </span>
                <h2 className="text-3xl sm:text-4xl text-[#0D3B37] font-extrabold tracking-tight leading-tight">
                  When a role is available.
                </h2>
              </div>
              <div className="lg:col-span-6">
                <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed mb-4">
                  Each role listing includes a clear job description, department scope, required competencies, selection process, and closing date.
                </p>
                <div className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed space-y-1">
                  <p>
                    Direct career enquiries:{" "}
                    <a
                      href={`mailto:${CLIENT_INFO.email}`}
                      className="text-[#0D3B37] font-bold underline hover:text-[#E0592A] transition-colors"
                    >
                      {CLIENT_INFO.email}
                    </a>
                  </p>
                  <p>
                    Use the subject line "Career enquiry - [Your Discipline]" and tell us how you would like to contribute.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
