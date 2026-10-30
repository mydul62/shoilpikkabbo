"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Home,
  Info,
  Briefcase,
  PhoneCall,
  ExternalLink,
  Edit3,
  Layers,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { pagesApi } from "@/lib/api";

interface PageMeta {
  slug: string;
  title: string;
  banglaTitle: string;
  path: string;
  icon: any;
  description: string;
  publishedVersion?: number;
  publishedAt?: string;
  hasDraft?: boolean;
  updatedAt?: string;
}

const PAGES_CONFIG: PageMeta[] = [
  {
    slug: "home",
    title: "Home Page",
    banglaTitle: "হোম পেজ",
    path: "/",
    icon: Home,
    description: "Main panoramic hero carousel, shop by category, featured products, 3 promo banners, personalized recommendations & brand mission.",
  },
  {
    slug: "about",
    title: "About Us Page",
    banglaTitle: "আমাদের সম্পর্কে",
    path: "/about",
    icon: Info,
    description: "Brand heritage narrative, artisan cooperatives, 3 core pillars (Delivery, Quality, Reliability) and sustainability promise.",
  },
  {
    slug: "services",
    title: "Special E-Sheba & Services",
    banglaTitle: "সেবা ও সমাধান",
    path: "/services",
    icon: Briefcase,
    description: "Institutional sourcing, bespoke corporate gifting, industrial B2B supplies, direct e-sheba advisory desk & inquiry brief.",
  },
  {
    slug: "contact",
    title: "Contact Us Page",
    banglaTitle: "যোগাযোগ",
    path: "/contact",
    icon: PhoneCall,
    description: "Direct customer helpline, operations desk, Dhaka Uttara office address, WhatsApp and live support channels.",
  },
];

export default function AdminPagesManagerPage() {
  const [pagesList, setPagesList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadPages() {
      try {
        setLoading(true);
        const res = await pagesApi.listPages();
        if (res.success && Array.isArray(res.data)) {
          setPagesList(res.data);
        }
      } catch (err) {
        console.error("Failed to load pages list:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPages();
  }, []);

  return (
    <AdminLayoutShell>
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-border pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0D3B37] text-xs font-bold mb-2 border border-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-[#E0592A]" />
              <span>Visual CMS Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D3B37] tracking-tight">
              Website Pages & Content Manager
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Customize, visually edit and publish content for all pages across SHOILPIKKABBO with live database sync.
            </p>
          </div>

          <Link href="/admin/home-editor">
            <Button size="md" variant="primary" className="bg-[#0D3B37] text-white">
              <Edit3 className="w-4 h-4 mr-2" />
              Open Visual Studio Editor
            </Button>
          </Link>
        </div>

        {/* Page Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PAGES_CONFIG.map((page) => {
            const Icon = page.icon;
            const apiData = pagesList.find((p) => p.slug === page.slug);

            return (
              <div
                key={page.slug}
                className="bg-white rounded-2xl border border-brand-border p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-sand/60 text-[#0D3B37] flex items-center justify-center border border-brand-border">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-gray-900">
                            {page.title}
                          </h3>
                          <Badge variant="gold" className="text-[10px]">
                            {page.banglaTitle}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                          {page.path}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {apiData?.publishedVersion ? (
                        <Badge variant="success" className="text-[10px]">
                          Live (v{apiData.publishedVersion})
                        </Badge>
                      ) : (
                        <Badge variant="default" className="text-[10px]">
                          Draft Available
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed mb-4">
                    {page.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-sand flex items-center justify-between gap-2">
                  <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {apiData?.updatedAt
                        ? `Updated ${new Date(apiData.updatedAt).toLocaleDateString()}`
                        : "Ready to edit"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={page.path}
                      target="_blank"
                      className="p-2 rounded-xl border border-brand-border text-gray-600 hover:text-gray-900 hover:bg-sand/40 transition-colors"
                      title="View Live Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <Link href={`/admin/home-editor?page=${page.slug}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#0D3B37] text-[#0D3B37] hover:bg-emerald-50 text-xs font-bold"
                      >
                        <Edit3 className="w-3 h-3 mr-1" />
                        Edit Page
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayoutShell>
  );
}
