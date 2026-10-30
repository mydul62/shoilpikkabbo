"use client";

import * as React from "react";
import Link from "next/link";
import {
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  Save,
  Globe,
  History,
  Layers,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Palette,
  Type,
  Image as ImageIcon,
  Link2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  ExternalLink,
  FileText,
  Home,
  Info,
  Briefcase,
  PhoneCall,
  Sliders,
  Check,
  RefreshCw,
} from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { pagesApi, productsApi, categoriesApi } from "@/lib/api";
import { HomeSectionsRenderer, HomeSectionData } from "@/components/home/HomeSectionsRenderer";
import { ImageUploader } from "@/components/admin/ImageUploader";

type DeviceMode = "desktop" | "tablet" | "mobile";

interface PageConfig {
  slug: string;
  title: string;
  banglaTitle: string;
  icon: any;
  path: string;
}

const AVAILABLE_PAGES: PageConfig[] = [
  { slug: "home", title: "Home Page", banglaTitle: "হোম পেজ", icon: Home, path: "/" },
  { slug: "about", title: "About Us", banglaTitle: "আমাদের সম্পর্কে", icon: Info, path: "/about" },
  { slug: "services", title: "Special E-Sheba / Services", banglaTitle: "সেবা ও সমাধান", icon: Briefcase, path: "/services" },
  { slug: "contact", title: "Contact Us", banglaTitle: "যোগাযোগ", icon: PhoneCall, path: "/contact" },
];

export default function AdminVisualPageEditor() {
  const [selectedPageSlug, setSelectedPageSlug] = React.useState<string>("home");
  const [sections, setSections] = React.useState<HomeSectionData[]>([]);
  const [selectedSectionId, setSelectedSectionId] = React.useState<string | null>(null);
  const [deviceMode, setDeviceMode] = React.useState<DeviceMode>("desktop");
  const [activeLeftTab, setActiveLeftTab] = React.useState<"tree" | "library" | "pages">("tree");
  const [activeSettingsTab, setActiveSettingsTab] = React.useState<"content" | "media" | "style">("content");

  // History stack for Undo / Redo
  const [history, setHistory] = React.useState<HomeSectionData[][]>([]);
  const [historyIndex, setHistoryIndex] = React.useState<number>(-1);

  // Status & loading
  const [loading, setLoading] = React.useState(true);
  const [saveLoading, setSaveLoading] = React.useState(false);
  const [publishLoading, setPublishLoading] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  // Revisions Modal
  const [isRevisionsModalOpen, setIsRevisionsModalOpen] = React.useState(false);
  const [revisions, setRevisions] = React.useState<any[]>([]);
  const [revisionsLoading, setRevisionsLoading] = React.useState(false);

  // Live products & categories for live canvas simulation
  const [liveProducts, setLiveProducts] = React.useState<any[]>([]);
  const [liveCategories, setLiveCategories] = React.useState<any[]>([]);

  // Fetch live store items once
  React.useEffect(() => {
    async function loadStoreData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          productsApi.getAll({ limit: 40 }),
          categoriesApi.getAll(),
        ]);
        if (prodRes.success && Array.isArray(prodRes.data)) {
          setLiveProducts(prodRes.data);
        }
        if (catRes.success && Array.isArray(catRes.data)) {
          setLiveCategories(catRes.data);
        }
      } catch (e) {
        console.warn("Could not load store data for editor simulator:", e);
      }
    }
    loadStoreData();
  }, []);
  // Check URL query param (e.g. ?page=about)
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get("page");
      if (pageParam && AVAILABLE_PAGES.some((p) => p.slug === pageParam)) {
        setSelectedPageSlug(pageParam);
      }
    }
  }, []);

  // Fetch Page Data whenever selectedPageSlug changes
  const loadPageData = React.useCallback(async (slug: string) => {
    try {
      setLoading(true);
      const res = await pagesApi.getDraft(slug);
      const pageData = res.data as any;
      if (res.success && Array.isArray(pageData?.sections)) {
        setSections(pageData.sections);
        setHistory([pageData.sections]);
        setHistoryIndex(0);
        setHasUnsavedChanges(false);
        if (pageData.sections.length > 0) {
          setSelectedSectionId(pageData.sections[0].id);
        } else {
          setSelectedSectionId(null);
        }
      }
    } catch (err: any) {
      console.error(`Failed to load page builder data for [${slug}]:`, err);
      setStatusMessage(`Failed to load data for ${slug}.`);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadPageData(selectedPageSlug);
  }, [selectedPageSlug, loadPageData]);

  // Handle Page Switching
  const handleSelectPage = (newSlug: string) => {
    if (newSlug === selectedPageSlug) return;
    if (hasUnsavedChanges) {
      const confirmSwitch = confirm("You have unsaved changes on this page. Discard changes and switch?");
      if (!confirmSwitch) return;
    }
    setSelectedPageSlug(newSlug);
  };

  // Push new state into undo/redo history
  const updateSections = (newSections: HomeSectionData[]) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(newSections);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setSections(newSections);
    setHasUnsavedChanges(true);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setSections(history[prevIndex]);
      setHasUnsavedChanges(true);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setSections(history[nextIndex]);
      setHasUnsavedChanges(true);
    }
  };

  // Section Manipulation
  const handleMoveUp = (id: string) => {
    const idx = sections.findIndex((s) => s.id === id);
    if (idx <= 0) return;
    const updated = [...sections];
    const [moved] = updated.splice(idx, 1);
    updated.splice(idx - 1, 0, moved);
    updateSections(updated);
  };

  const handleMoveDown = (id: string) => {
    const idx = sections.findIndex((s) => s.id === id);
    if (idx < 0 || idx >= sections.length - 1) return;
    const updated = [...sections];
    const [moved] = updated.splice(idx, 1);
    updated.splice(idx + 1, 0, moved);
    updateSections(updated);
  };

  const handleDuplicate = (id: string) => {
    const target = sections.find((s) => s.id === id);
    if (!target) return;
    const duplicated: HomeSectionData = {
      ...JSON.parse(JSON.stringify(target)),
      id: `${target.type}-${Date.now()}`,
      name: `${target.name || target.type} (Copy)`,
    };
    const idx = sections.findIndex((s) => s.id === id);
    const updated = [...sections];
    updated.splice(idx + 1, 0, duplicated);
    updateSections(updated);
    setSelectedSectionId(duplicated.id);
  };

  const handleToggleVisibility = (id: string) => {
    const updated = sections.map((s) =>
      s.id === id ? { ...s, isVisible: !s.isVisible } : s
    );
    updateSections(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this section?")) {
      const updated = sections.filter((s) => s.id !== id);
      updateSections(updated);
      if (selectedSectionId === id) {
        setSelectedSectionId(updated[0]?.id || null);
      }
    }
  };

  // Section Templates Library
  const SECTION_TEMPLATES: Record<string, Partial<HomeSectionData>> = {
    // 1. Home Page Sections
    hero_carousel: {
      name: "হিরো প্যানোরামিক কারোসেল (Hero Carousel)",
      props: {
        pill: "Handmade  •  Eco Friendly  •  Local Products",
        titleLine1: "বাংলার ঐতিহ্য,",
        titleLine2: "আপনার প্রয়োজন",
        subtitleLine1: "দেশীয় পণ্য ও আধুনিক সেবার সমন্বয়ে",
        subtitleLine2: "শিল্পকলা এখন আপনার হাতের কাছে!",
        ctaText: "Shop Now",
        ctaLink: "/shop",
        bgImage: "/images/client-mockup/hero-bg-exact.png",
        badge1Text: "Fast Delivery",
        badge2Text: "Quality Products",
        badge3Text: "Reliable Service",
        showLocalBadge: true,
      },
    },
    categories_grid: {
      name: "শপ বাই ক্যাটাগরি গ্রিড (Shop by Category)",
      props: {
        headline: "Shop by Category",
        subtitle: "Explore our wide range of products and services",
        ctaText: "View All Categories",
        ctaLink: "/shop",
        promoHeadline: "Quality Products\nBetter Life",
        promoCtaText: "Explore Categories",
        promoCtaLink: "/shop",
        promoBgImage: "/images/client-mockup/quality-products-bg.png",
      },
    },
    featured_products: {
      name: "ফিচার্ড কালেকশন (Featured Products)",
      props: {
        headline: "Featured Products",
        subtitle: "Best selling and most popular products",
        ctaText: "View All Products",
        ctaLink: "/shop",
        limit: 5,
      },
    },
    promo_trio: {
      name: "প্রোমো ব্যানার ত্রয়ী (Promo 3-Cards)",
      props: {
        card1Tag: "Special Offer",
        card1Discount: "50%",
        card1Subtitle: "On Selected Products",
        card1CtaText: "Shop Now",
        card1CtaLink: "/offers",
        card1BgImage: "/images/client-mockup/special-offer-banner-bg.png",
        card2Headline: "Our Services",
        card2Subtitle: "More than just products",
        card3Tag: "Stay Connected",
        card3Headline: "Get in Touch",
        card3Note: "Chat with us anytime",
        card3Image: "/images/client-mockup/promo-get-in-touch.png",
      },
    },
    for_you_products: {
      name: "আপনার জন্য বিশেষ কালেকশন (For You)",
      props: {
        headline: "For You",
        subtitle: "Specially handpicked recommendations tailored for you",
        ctaText: "View All",
        ctaLink: "/shop",
        initialCount: 10,
        batchSize: 10,
      },
    },
    trust_mission: {
      name: "ট্রাস্ট ও ব্র্যান্ড মিশন (Why Choose Us)",
      props: {
        headline: "Why Choose SHOILPIKKABBO?",
        subtitle: "Your trust is our biggest asset",
        pillar1Title: "Wide Product Range",
        pillar1Desc: "From local to modern",
        pillar2Title: "Secure Payment",
        pillar2Desc: "Safe & trusted transaction",
        pillar3Title: "Fast Delivery",
        pillar3Desc: "On time, every time",
        pillar4Title: "Customer Support",
        pillar4Desc: "Always here for you",
        missionTitle: "SHOILPIKKABBO",
        missionTagline: "DELIVERY • QUALITY • RELIABILITY",
        missionDesc: "We are committed to delivering high-quality products and services with trust, care and reliability to make your life easier.",
        missionBgImage: "/images/client-mockup/trust-mission-banner-bg.png",
        missionIcon: "/images/client-mockup/trust-brand-icon.png",
      },
    },

    // 2. About Us Sections
    about_header: {
      name: "আমাদের সম্পর্কে হেডার (About Hero)",
      props: {
        badge: "Heritage Craft & Everyday Commerce",
        headline: "Thoughtfully brought together.",
        subtitle: "SHOILPIKKABBO is built upon three foundational tenets: Delivery, Quality, and Reliability. Bridging traditional artisans with modern lifestyle needs across Bangladesh.",
      },
    },
    about_story: {
      name: "আমাদের গল্প ও কারুশিল্পী ঐতিহ্য (Our Story)",
      props: {
        tag: "OUR HERITAGE & MISSION",
        headline: "Connecting root artisans with modern Bangladeshi homes.",
        paragraph1: "Founded with the ambition of making authentic Bangladeshi craftsmanship accessible to everyone, SHOILPIKKABBO curates handloom textiles, natural golden jute creations, pottery, and sustainable daily lifestyle solutions.",
        paragraph2: "We work directly with craft guilds, women cooperatives, and master makers from Bogura, Tangail, Cumilla, and rural handicraft hubs. Every product empowers rural families with dignified, fair-trade earnings.",
        imageUrl: "/images/story-artisan.png",
        imageAlt: "Artisan hand-weaving natural jute basket on wooden table",
      },
    },
    about_pillars: {
      name: "মূল ৩টি স্তম্ভ (The 3 Core Pillars)",
      props: {
        headline: "The Principles That Guide Us",
        subtitle: "Every order, interaction and service is held to our three uncompromising benchmarks.",
        pillar1Title: "Delivery",
        pillar1Desc: "Dependable, trackable, and prompt nationwide shipping reaching all 64 districts in Bangladesh.",
        pillar2Title: "Quality",
        pillar2Desc: "Uncompromising raw material selection, artisanal inspection, and durable export-standard standards.",
        pillar3Title: "Reliability",
        pillar3Desc: "Consistent customer care, transparent billing, and authentic relationship with our patrons.",
      },
    },
    about_values: {
      name: "টেকসই ও পরিবেশবান্ধব প্রতিশ্রুতি (Sustainable Values)",
      props: {
        headline: "Our Sustainable Commitment",
        body: "Plastic reduction through biodegradable golden jute, fair compensation for indigenous artisan communities, and carbon-conscious packaging.",
        ctaText: "Explore Collection",
        ctaLink: "/shop",
      },
    },

    // 3. Services Sections
    services_header: {
      name: "স্পেশাল ই-সেবা হেডার (Services Hero)",
      props: {
        badge: "Institutional Sourcing & Customized Support",
        headline: "Special E-Sheba & Corporate Solutions",
        subtitle: "Tailor-made institutional procurement, personalized corporate hampers, customized branding, and direct business solutions backed by nationwide delivery.",
      },
    },
    services_list: {
      name: "সার্ভিস হাবসমূহ (Specialized Service Hubs)",
      props: {
        headline: "Our Service Specializations",
        subtitle: "Select a service area to submit an institutional brief or consultation request.",
        service1Title: "Corporate Gift Items",
        service1Desc: "Customized handcrafted packages, corporate branding, packaging preferences & bulk volumes.",
        service2Title: "Industrial Solutions",
        service2Desc: "B2B raw supplies, artisan-grade materials, sourcing requirements and customized production.",
        service3Title: "Special E-Sheba / Services",
        service3Desc: "Direct personalized support, custom bespoke orders, and dedicated account advisory.",
        service4Title: "Bespoke Jute & Agro Packaging",
        service4Desc: "Biodegradable bulk packaging solutions tailored for retail brands and industrial exports.",
      },
    },
    services_form_info: {
      name: "কনসালটেশন ও সাপোর্ট তথ্য (Consultation Info)",
      props: {
        headline: "Submit a Tailored Service Inquiry",
        subtitle: "Our corporate desk responds within 24 hours with custom quotes and sample timelines.",
        phoneSupport: "+880 1731214379",
        emailSupport: "shoilpikkabbo@gmail.com",
      },
    },

    // 4. Contact Sections
    contact_header: {
      name: "যোগাযোগ হেডার (Contact Hero)",
      props: {
        badge: "We Are Here For You",
        headline: "Get in Touch With SHOILPIKKABBO",
        subtitle: "Have a question about an order, bespoke product, or partnership? Reach out to our dedicated operations desk anytime.",
      },
    },
    contact_details: {
      name: "যোগাযোগ চ্যানেল ও ঠিকানা (Office Details)",
      props: {
        headline: "Communication Channels",
        primaryPhone: "+880 1731214379",
        secondaryPhone: "+880 1811909068",
        email: "shoilpikkabbo@gmail.com",
        officeAddress: "House 12, Road 4, Sector 3, Uttara, Dhaka - 1230, Bangladesh",
        officeHours: "Saturday - Thursday: 9:00 AM - 8:00 PM",
        whatsappLink: "https://wa.me/8801731214379",
        messengerLink: "https://m.me/shoilpikkabbo",
      },
    },
  };

  const handleAddSection = (type: string) => {
    const template = SECTION_TEMPLATES[type];
    if (!template) return;

    const newSection: HomeSectionData = {
      id: `${type}-${Date.now()}`,
      name: template.name || type,
      type,
      isVisible: true,
      props: JSON.parse(JSON.stringify(template.props || {})),
    };

    const updated = [...sections, newSection];
    updateSections(updated);
    setSelectedSectionId(newSection.id);
    setActiveLeftTab("tree");
  };

  // Section Props Editing
  const updateSelectedProp = (key: string, value: any) => {
    if (!selectedSectionId) return;
    const updated = sections.map((s) => {
      if (s.id === selectedSectionId) {
        return {
          ...s,
          props: {
            ...s.props,
            [key]: value,
          },
        };
      }
      return s;
    });
    updateSections(updated);
  };

  // Save Draft
  const handleSaveDraft = async () => {
    try {
      setSaveLoading(true);
      const currentPage = AVAILABLE_PAGES.find((p) => p.slug === selectedPageSlug);
      const res = await pagesApi.saveDraft(selectedPageSlug, {
        title: currentPage?.title || "Page",
        sections,
      });
      if (res.success) {
        setHasUnsavedChanges(false);
        setStatusMessage(`Draft for "${currentPage?.title}" saved!`);
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err: any) {
      alert("Error saving draft: " + (err?.message || "Server error"));
    } finally {
      setSaveLoading(false);
    }
  };

  // Publish Live
  const handlePublish = async () => {
    try {
      setPublishLoading(true);
      const currentPage = AVAILABLE_PAGES.find((p) => p.slug === selectedPageSlug);
      // 1. Save draft first
      await pagesApi.saveDraft(selectedPageSlug, {
        title: currentPage?.title || "Page",
        sections,
      });
      // 2. Publish
      const res = await pagesApi.publish(selectedPageSlug);
      if (res.success) {
        setHasUnsavedChanges(false);
        setStatusMessage(`🎉 "${currentPage?.title}" published live to storefront!`);
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch (err: any) {
      alert("Error publishing page: " + (err?.message || "Server error"));
    } finally {
      setPublishLoading(false);
    }
  };

  // Open Revisions Modal
  const handleOpenRevisions = async () => {
    try {
      setIsRevisionsModalOpen(true);
      setRevisionsLoading(true);
      const res = await pagesApi.getRevisions(selectedPageSlug);
      if (res.success) {
        setRevisions((res.data as any[]) || []);
      }
    } catch (err) {
      console.error("Failed to load revisions:", err);
    } finally {
      setRevisionsLoading(false);
    }
  };

  // Restore Revision
  const handleRestoreRevision = async (versionId: string) => {
    if (confirm("Restore this version? Any unsaved edits will be replaced.")) {
      try {
        setRevisionsLoading(true);
        const res = await pagesApi.restoreRevision(selectedPageSlug, versionId);
        if (res.success) {
          setIsRevisionsModalOpen(false);
          await loadPageData(selectedPageSlug);
          setStatusMessage("Version successfully restored!");
          setTimeout(() => setStatusMessage(null), 3000);
        }
      } catch (err: any) {
        alert("Failed to restore revision: " + (err?.message || "Error"));
      } finally {
        setRevisionsLoading(false);
      }
    }
  };

  const selectedSection = sections.find((s) => s.id === selectedSectionId);
  const activePage = AVAILABLE_PAGES.find((p) => p.slug === selectedPageSlug) || AVAILABLE_PAGES[0];

  return (
    <AdminLayoutShell>
      <div className="flex flex-col h-[calc(100vh-6rem)] -m-4 sm:-m-6 lg:-m-8 bg-[#F0ECE1]">
        {/* Top Control Bar */}
        <header className="h-16 bg-white border-b border-brand-border px-4 flex items-center justify-between shrink-0 z-30 shadow-xs">
          {/* Left Actions: Page Switcher & Device Modes */}
          <div className="flex items-center gap-3">
            {/* Page Selector Pill Dropdown / Buttons */}
            <div className="flex items-center bg-[#F4EFE6] p-1 rounded-xl border border-brand-border">
              {AVAILABLE_PAGES.map((page) => {
                const Icon = page.icon;
                const isActive = selectedPageSlug === page.slug;
                return (
                  <button
                    key={page.slug}
                    onClick={() => handleSelectPage(page.slug)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#0D3B37] text-white shadow-xs"
                        : "text-charcoal-600 hover:text-charcoal-900 hover:bg-white/60"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">{page.title}</span>
                    <span className="md:hidden">{page.banglaTitle}</span>
                  </button>
                );
              })}
            </div>

            <div className="h-6 w-px bg-sand" />

            {/* Device Switcher */}
            <div className="hidden sm:flex items-center bg-sand/60 rounded-lg p-0.5 border border-brand-border">
              <button
                onClick={() => setDeviceMode("desktop")}
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  deviceMode === "desktop"
                    ? "bg-white text-forest-900 shadow-xs"
                    : "text-charcoal-500 hover:text-charcoal-800"
                }`}
                title="Desktop View (100%)"
              >
                <Monitor className="h-3.5 w-3.5" />
                <span className="hidden xl:inline text-[11px]">Desktop</span>
              </button>
              <button
                onClick={() => setDeviceMode("tablet")}
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  deviceMode === "tablet"
                    ? "bg-white text-forest-900 shadow-xs"
                    : "text-charcoal-500 hover:text-charcoal-800"
                }`}
                title="Tablet View (768px)"
              >
                <Tablet className="h-3.5 w-3.5" />
                <span className="hidden xl:inline text-[11px]">Tablet</span>
              </button>
              <button
                onClick={() => setDeviceMode("mobile")}
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  deviceMode === "mobile"
                    ? "bg-white text-forest-900 shadow-xs"
                    : "text-charcoal-500 hover:text-charcoal-800"
                }`}
                title="Mobile View (390px)"
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span className="hidden xl:inline text-[11px]">Mobile</span>
              </button>
            </div>

            <div className="h-6 w-px bg-sand hidden sm:block" />

            {/* Undo / Redo */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-1.5 rounded-lg text-charcoal-600 hover:bg-sand disabled:opacity-20 transition-colors cursor-pointer"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="h-4 w-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-1.5 rounded-lg text-charcoal-600 hover:bg-sand disabled:opacity-20 transition-colors cursor-pointer"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Center Status / Toast */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            {statusMessage ? (
              <span className="font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-pulse">
                {statusMessage}
              </span>
            ) : hasUnsavedChanges ? (
              <span className="font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                Unsaved Draft Changes
              </span>
            ) : (
              <span className="text-charcoal-400 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Synced with Database
              </span>
            )}
          </div>

          {/* Right Actions: Revisions, Preview, Save Draft, Publish */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenRevisions}
              className="px-2.5 py-1.5 rounded-lg border border-brand-border text-xs font-semibold text-charcoal-700 hover:bg-sand flex items-center gap-1.5 cursor-pointer"
              title="View Revision History for this page"
            >
              <History className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Revisions</span>
            </button>

            <Link
              href={`${activePage.path}?preview=true`}
              target="_blank"
              className="px-2.5 py-1.5 rounded-lg border border-brand-border text-xs font-semibold text-charcoal-700 hover:bg-sand flex items-center gap-1.5"
              title="Preview Live Page in new tab"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </Link>

            <Button
              size="sm"
              variant="outline"
              disabled={saveLoading}
              onClick={handleSaveDraft}
              className="border-forest-800 text-forest-900 hover:bg-forest-50 font-bold"
            >
              {saveLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
              ) : (
                <Save className="h-3.5 w-3.5 mr-1" />
              )}
              Save Draft
            </Button>

            <Button
              size="sm"
              variant="primary"
              disabled={publishLoading}
              onClick={handlePublish}
              className="bg-[#0D3B37] hover:bg-[#072421] text-white font-bold shadow-sm"
            >
              {publishLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
              ) : (
                <Globe className="h-3.5 w-3.5 mr-1 text-[#E0592A]" />
              )}
              Publish Live
            </Button>
          </div>
        </header>

        {/* 3-Column Studio Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar: Section Hierarchy & Section Library */}
          <div className="w-68 bg-white border-r border-brand-border flex flex-col shrink-0 z-20 shadow-xs">
            {/* Tabs */}
            <div className="flex border-b border-brand-border text-xs">
              <button
                onClick={() => setActiveLeftTab("tree")}
                className={`flex-1 py-2.5 font-bold text-center border-b-2 -mb-px transition-colors cursor-pointer ${
                  activeLeftTab === "tree"
                    ? "border-[#0D3B37] text-[#0D3B37] bg-sand/20"
                    : "border-transparent text-charcoal-500 hover:text-charcoal-800"
                }`}
              >
                Sections ({sections.length})
              </button>
              <button
                onClick={() => setActiveLeftTab("library")}
                className={`flex-1 py-2.5 font-bold text-center border-b-2 -mb-px transition-colors cursor-pointer ${
                  activeLeftTab === "library"
                    ? "border-[#0D3B37] text-[#0D3B37] bg-sand/20"
                    : "border-transparent text-charcoal-500 hover:text-charcoal-800"
                }`}
              >
                + Add Block
              </button>
            </div>

            {/* Content of Left Tab */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {activeLeftTab === "tree" ? (
                sections.length === 0 ? (
                  <div className="p-6 text-center text-charcoal-400">
                    <Layers className="h-8 w-8 mx-auto mb-2 text-charcoal-300" />
                    <p className="text-xs font-semibold">No sections yet.</p>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Click "+ Add Block" to add a section to this page.
                    </p>
                  </div>
                ) : (
                  sections.map((sec, idx) => {
                    const isSelected = selectedSectionId === sec.id;
                    return (
                      <div
                        key={sec.id}
                        onClick={() => setSelectedSectionId(sec.id)}
                        className={`p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between group ${
                          isSelected
                            ? "bg-[#0D3B37] text-white border-[#0D3B37] shadow-sm"
                            : "bg-white border-brand-border text-charcoal-800 hover:bg-sand/40"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className={`text-[10px] font-bold ${isSelected ? "text-[#E0592A]" : "text-charcoal-400"}`}>
                            0{idx + 1}
                          </span>
                          <span className="font-semibold truncate">
                            {sec.name || sec.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleVisibility(sec.id);
                            }}
                            className="p-1 hover:bg-white/20 rounded"
                            title={sec.isVisible ? "Hide Section" : "Show Section"}
                          >
                            {sec.isVisible ? (
                              <Eye className="h-3 w-3" />
                            ) : (
                              <EyeOff className="h-3 w-3 text-rose-300" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveUp(sec.id);
                            }}
                            disabled={idx === 0}
                            className="p-1 hover:bg-white/20 rounded disabled:opacity-20"
                            title="Move Up"
                          >
                            <ChevronUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveDown(sec.id);
                            }}
                            disabled={idx === sections.length - 1}
                            className="p-1 hover:bg-white/20 rounded disabled:opacity-20"
                            title="Move Down"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )
              ) : (
                <div className="space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#0D3B37] px-1">
                    Available for {activePage.title}
                  </p>

                  {/* List templates according to active page */}
                  {selectedPageSlug === "home" && (
                    <div className="space-y-1.5">
                      {[
                        { type: "hero_carousel", label: "হিরো কারোসেল (Hero Carousel)", desc: "প্যানোরামিক ব্যানার, বাংলা শিরোনাম ও ট্রাস্ট ব্যাজ" },
                        { type: "categories_grid", label: "শপ বাই ক্যাটাগরি গ্রিড", desc: "১০টি ক্যাটাগরি ও কোয়ালিটি প্রোডাক্টস কার্ড" },
                        { type: "featured_products", label: "ফিচার্ড প্রডাক্টস শোকেস", desc: "সেরা নির্বাচিত পণ্যের ৫-কলাম গ্রিড" },
                        { type: "promo_trio", label: "প্রোমো ব্যানার ত্রয়ী (৩টি কার্ড)", desc: "৫০% স্পেশাল অফার, সেবা ও যোগাযোগ ব্যানার" },
                        { type: "for_you_products", label: "ফর ইউ রেকমেন্ডেশন", desc: "গ্রাহকের জন্য বিশেষ পণ্যের কালেকশন" },
                        { type: "trust_mission", label: "ট্রাস্ট ও ব্র্যান্ড মিশন", desc: "কেন শিল্পকাব্য? ৪টি স্তম্ভ ও ভিশন কার্ড" },
                      ].map((item) => (
                        <button
                          key={item.type}
                          onClick={() => handleAddSection(item.type)}
                          className="w-full text-left p-2.5 rounded-xl border border-brand-border bg-white hover:bg-emerald-50 hover:border-[#0D3B37]/40 transition-all cursor-pointer group"
                        >
                          <p className="font-bold text-xs text-charcoal-900 group-hover:text-[#0D3B37] flex items-center justify-between">
                            <span>{item.label}</span>
                            <Plus className="h-3.5 w-3.5 text-[#0D3B37]" />
                          </p>
                          <p className="text-[11px] text-charcoal-500 mt-0.5 line-clamp-1">
                            {item.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedPageSlug === "about" && (
                    <div className="space-y-1.5">
                      {[
                        { type: "about_header", label: "আমাদের সম্পর্কে হেডার", desc: "ব্র্যান্ড পরিচিতি, ব্যাজ ও মূল শিরোনাম" },
                        { type: "about_story", label: "আমাদের ঐতিহ্য ও গল্প", desc: "কারিগরদের হস্তশিল্প ও ছবিসহ ব্র্যান্ড গল্প" },
                        { type: "about_pillars", label: "৩টি মূল স্তম্ভ (Pillars)", desc: "Delivery, Quality & Reliability নির্দেশিকা" },
                        { type: "about_values", label: "টেকসই ও পরিবেশবান্ধব ভিশন", desc: "সবুজ পাট ও টেকসই ভবিষ্যতের প্রতিশ্রুতি" },
                      ].map((item) => (
                        <button
                          key={item.type}
                          onClick={() => handleAddSection(item.type)}
                          className="w-full text-left p-2.5 rounded-xl border border-brand-border bg-white hover:bg-emerald-50 hover:border-[#0D3B37]/40 transition-all cursor-pointer group"
                        >
                          <p className="font-bold text-xs text-charcoal-900 group-hover:text-[#0D3B37] flex items-center justify-between">
                            <span>{item.label}</span>
                            <Plus className="h-3.5 w-3.5 text-[#0D3B37]" />
                          </p>
                          <p className="text-[11px] text-charcoal-500 mt-0.5 line-clamp-1">
                            {item.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedPageSlug === "services" && (
                    <div className="space-y-1.5">
                      {[
                        { type: "services_header", label: "স্পেশাল সেবা হেডার", desc: "প্রতিষ্ঠানিক সোর্সিং ও করপোরেট সলিউশনস" },
                        { type: "services_list", label: "সার্ভিস হাবসমূহ", desc: "৪টি বিশেষ সেবা: গিফটিং, ইন্ডাস্ট্রিয়াল, ই-সেবা" },
                        { type: "services_form_info", label: "পরামর্শ ও সাপোর্ট তথ্য", desc: "২৪ ঘণ্টায় রেসপন্স ও সরাসরি সহায়তা নম্বর" },
                      ].map((item) => (
                        <button
                          key={item.type}
                          onClick={() => handleAddSection(item.type)}
                          className="w-full text-left p-2.5 rounded-xl border border-brand-border bg-white hover:bg-emerald-50 hover:border-[#0D3B37]/40 transition-all cursor-pointer group"
                        >
                          <p className="font-bold text-xs text-charcoal-900 group-hover:text-[#0D3B37] flex items-center justify-between">
                            <span>{item.label}</span>
                            <Plus className="h-3.5 w-3.5 text-[#0D3B37]" />
                          </p>
                          <p className="text-[11px] text-charcoal-500 mt-0.5 line-clamp-1">
                            {item.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedPageSlug === "contact" && (
                    <div className="space-y-1.5">
                      {[
                        { type: "contact_header", label: "যোগাযোগ হেডার", desc: "গ্রাহক সেবা ও অপারেশনস ডেস্ক শিরোনাম" },
                        { type: "contact_details", label: "অফিস ও হেল্পলাইন চ্যানেল", desc: "ফোন, ইমেইল, উত্তরা হেডকোয়ার্টার্স ও সময়সূচি" },
                      ].map((item) => (
                        <button
                          key={item.type}
                          onClick={() => handleAddSection(item.type)}
                          className="w-full text-left p-2.5 rounded-xl border border-brand-border bg-white hover:bg-emerald-50 hover:border-[#0D3B37]/40 transition-all cursor-pointer group"
                        >
                          <p className="font-bold text-xs text-charcoal-900 group-hover:text-[#0D3B37] flex items-center justify-between">
                            <span>{item.label}</span>
                            <Plus className="h-3.5 w-3.5 text-[#0D3B37]" />
                          </p>
                          <p className="text-[11px] text-charcoal-500 mt-0.5 line-clamp-1">
                            {item.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Central Live Interactive Canvas */}
          <div className="flex-1 bg-[#E8E2D6] overflow-y-auto p-4 sm:p-6 lg:p-8 flex justify-center">
            {loading ? (
              <div className="flex flex-col items-center justify-center m-auto">
                <Loader2 className="h-8 w-8 text-[#0D3B37] animate-spin mb-3" />
                <p className="text-xs font-semibold text-charcoal-600">
                  Loading visual page editor canvas...
                </p>
              </div>
            ) : sections.length === 0 ? (
              <div className="flex flex-col items-center justify-center m-auto p-8 bg-white/80 rounded-2xl border border-dashed border-charcoal-300 max-w-md text-center">
                <Layers className="h-10 w-10 text-charcoal-400 mb-2" />
                <h3 className="font-bold text-sm text-charcoal-800">
                  Page is currently empty
                </h3>
                <p className="text-xs text-charcoal-500 mt-1 mb-4">
                  Add initial sections from the left sidebar to start building this page.
                </p>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setActiveLeftTab("library")}
                  className="bg-[#0D3B37] text-white"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add First Section
                </Button>
              </div>
            ) : (
              <div
                style={{
                  width:
                    deviceMode === "mobile"
                      ? "390px"
                      : deviceMode === "tablet"
                      ? "768px"
                      : "100%",
                }}
                className={`transition-all duration-300 bg-white shadow-2xl rounded-none ${
                  deviceMode !== "desktop"
                    ? "border-[8px] border-charcoal-900 rounded-3xl overflow-hidden my-4"
                    : ""
                }`}
              >
                <HomeSectionsRenderer
                  sections={sections}
                  isEditorMode={true}
                  selectedSectionId={selectedSectionId}
                  onSelectSection={setSelectedSectionId}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  onDuplicate={handleDuplicate}
                  onToggleVisibility={handleToggleVisibility}
                  onDelete={handleDelete}
                  liveProducts={liveProducts}
                  liveCategories={liveCategories}
                />
              </div>
            )}
          </div>

          {/* Right Panel: Contextual Section Settings & Property Inspector */}
          <div className="w-88 bg-white border-l border-brand-border flex flex-col shrink-0 z-20 shadow-xs">
            {selectedSection ? (
              <>
                <div className="p-4 border-b border-brand-border bg-sand/30 flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-extrabold text-sm text-charcoal-900 truncate max-w-[180px]">
                      {selectedSection.name || selectedSection.type}
                    </h3>
                    <p className="text-[10px] text-charcoal-500 uppercase tracking-wider font-semibold">
                      Type: {selectedSection.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant={selectedSection.isVisible ? "success" : "default"}>
                      {selectedSection.isVisible ? "Visible" : "Hidden"}
                    </Badge>
                    <button
                      onClick={() => handleToggleVisibility(selectedSection.id)}
                      className="p-1.5 hover:bg-white rounded-lg border border-brand-border text-charcoal-600"
                      title={selectedSection.isVisible ? "Hide Section" : "Show Section"}
                    >
                      {selectedSection.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-rose-500" />}
                    </button>
                    <button
                      onClick={() => handleDelete(selectedSection.id)}
                      className="p-1.5 hover:bg-rose-50 rounded-lg border border-brand-border text-rose-600"
                      title="Delete Section"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sub-tabs for Settings */}
                <div className="flex border-b border-brand-border text-xs">
                  <button
                    onClick={() => setActiveSettingsTab("content")}
                    className={`flex-1 py-2 font-bold text-center border-b-2 -mb-px transition-colors cursor-pointer ${
                      activeSettingsTab === "content"
                        ? "border-[#0D3B37] text-[#0D3B37]"
                        : "border-transparent text-charcoal-500 hover:text-charcoal-800"
                    }`}
                  >
                    Content & Text
                  </button>
                  <button
                    onClick={() => setActiveSettingsTab("media")}
                    className={`flex-1 py-2 font-bold text-center border-b-2 -mb-px transition-colors cursor-pointer ${
                      activeSettingsTab === "media"
                        ? "border-[#0D3B37] text-[#0D3B37]"
                        : "border-transparent text-charcoal-500 hover:text-charcoal-800"
                    }`}
                  >
                    Images & Media
                  </button>
                  <button
                    onClick={() => setActiveSettingsTab("style")}
                    className={`flex-1 py-2 font-bold text-center border-b-2 -mb-px transition-colors cursor-pointer ${
                      activeSettingsTab === "style"
                        ? "border-[#0D3B37] text-[#0D3B37]"
                        : "border-transparent text-charcoal-500 hover:text-charcoal-800"
                    }`}
                  >
                    Style & Layout
                  </button>
                </div>

                {/* Property Inspector Fields */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                  {/* TAB 1: CONTENT & TEXT */}
                  {activeSettingsTab === "content" && (
                    <div className="space-y-3.5">
                      {/* Section Title / Name */}
                      <div className="space-y-1">
                        <label className="font-bold text-charcoal-800">
                          Section Internal Name
                        </label>
                        <Input
                          value={selectedSection.name || ""}
                          onChange={(e) => {
                            const updated = sections.map((s) =>
                              s.id === selectedSectionId ? { ...s, name: e.target.value } : s
                            );
                            updateSections(updated);
                          }}
                        />
                      </div>

                      {/* Overline / Pill / Badge */}
                      {"pill" in selectedSection.props && (
                        <div className="space-y-1">
                          <label className="font-bold text-charcoal-800">
                            Pill Tagline
                          </label>
                          <Input
                            value={selectedSection.props.pill || ""}
                            onChange={(e) => updateSelectedProp("pill", e.target.value)}
                          />
                        </div>
                      )}

                      {"badge" in selectedSection.props && (
                        <div className="space-y-1">
                          <label className="font-bold text-charcoal-800">
                            Badge Text
                          </label>
                          <Input
                            value={selectedSection.props.badge || ""}
                            onChange={(e) => updateSelectedProp("badge", e.target.value)}
                          />
                        </div>
                      )}

                      {"tag" in selectedSection.props && (
                        <div className="space-y-1">
                          <label className="font-bold text-charcoal-800">
                            Section Tag
                          </label>
                          <Input
                            value={selectedSection.props.tag || ""}
                            onChange={(e) => updateSelectedProp("tag", e.target.value)}
                          />
                        </div>
                      )}

                      {/* Hero Bengali Titles */}
                      {"titleLine1" in selectedSection.props && (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="font-bold text-charcoal-800">
                              Hero Title (Line 1)
                            </label>
                            <Input
                              value={selectedSection.props.titleLine1 || ""}
                              onChange={(e) => updateSelectedProp("titleLine1", e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-charcoal-800">
                              Hero Title (Line 2)
                            </label>
                            <Input
                              value={selectedSection.props.titleLine2 || ""}
                              onChange={(e) => updateSelectedProp("titleLine2", e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      {"subtitleLine1" in selectedSection.props && (
                        <div className="space-y-1">
                          <label className="font-bold text-charcoal-800">
                            Subtitle (Line 1)
                          </label>
                          <Input
                            value={selectedSection.props.subtitleLine1 || ""}
                            onChange={(e) => updateSelectedProp("subtitleLine1", e.target.value)}
                          />
                        </div>
                      )}

                      {"subtitleLine2" in selectedSection.props && (
                        <div className="space-y-1">
                          <label className="font-bold text-charcoal-800">
                            Subtitle (Line 2)
                          </label>
                          <Input
                            value={selectedSection.props.subtitleLine2 || ""}
                            onChange={(e) => updateSelectedProp("subtitleLine2", e.target.value)}
                          />
                        </div>
                      )}

                      {/* General Headline */}
                      {"headline" in selectedSection.props && (
                        <div className="space-y-1">
                          <label className="font-bold text-charcoal-800">
                            Headline Title
                          </label>
                          <Textarea
                            rows={2}
                            value={selectedSection.props.headline || ""}
                            onChange={(e) => updateSelectedProp("headline", e.target.value)}
                          />
                        </div>
                      )}

                      {/* General Subtitle */}
                      {"subtitle" in selectedSection.props && (
                        <div className="space-y-1">
                          <label className="font-bold text-charcoal-800">
                            Subtitle Copy
                          </label>
                          <Textarea
                            rows={2}
                            value={selectedSection.props.subtitle || ""}
                            onChange={(e) => updateSelectedProp("subtitle", e.target.value)}
                          />
                        </div>
                      )}

                      {/* Paragraph 1 & 2 (About Story) */}
                      {"paragraph1" in selectedSection.props && (
                        <div className="space-y-1">
                          <label className="font-bold text-charcoal-800">
                            Paragraph 1
                          </label>
                          <Textarea
                            rows={3}
                            value={selectedSection.props.paragraph1 || ""}
                            onChange={(e) => updateSelectedProp("paragraph1", e.target.value)}
                          />
                        </div>
                      )}

                      {"paragraph2" in selectedSection.props && (
                        <div className="space-y-1">
                          <label className="font-bold text-charcoal-800">
                            Paragraph 2
                          </label>
                          <Textarea
                            rows={3}
                            value={selectedSection.props.paragraph2 || ""}
                            onChange={(e) => updateSelectedProp("paragraph2", e.target.value)}
                          />
                        </div>
                      )}

                      {/* General Body */}
                      {"body" in selectedSection.props && (
                        <div className="space-y-1">
                          <label className="font-bold text-charcoal-800">
                            Body Narrative
                          </label>
                          <Textarea
                            rows={3}
                            value={selectedSection.props.body || ""}
                            onChange={(e) => updateSelectedProp("body", e.target.value)}
                          />
                        </div>
                      )}

                      {/* Primary CTA Label & Link */}
                      {"ctaText" in selectedSection.props && (
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-sand">
                          <div className="space-y-1">
                            <label className="font-bold text-charcoal-800">
                              Button Label
                            </label>
                            <Input
                              value={selectedSection.props.ctaText || ""}
                              onChange={(e) => updateSelectedProp("ctaText", e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-charcoal-800">
                              Button URL
                            </label>
                            <Input
                              value={selectedSection.props.ctaLink || ""}
                              onChange={(e) => updateSelectedProp("ctaLink", e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      {/* Categories Promo Card Props */}
                      {"promoHeadline" in selectedSection.props && (
                        <div className="space-y-2 pt-2 border-t border-sand">
                          <label className="font-bold text-[#0D3B37]">
                            Categories Right Promo Card
                          </label>
                          <Input
                            placeholder="Promo Headline"
                            value={selectedSection.props.promoHeadline || ""}
                            onChange={(e) => updateSelectedProp("promoHeadline", e.target.value)}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              placeholder="Promo CTA Text"
                              value={selectedSection.props.promoCtaText || ""}
                              onChange={(e) => updateSelectedProp("promoCtaText", e.target.value)}
                            />
                            <Input
                              placeholder="Promo CTA Link"
                              value={selectedSection.props.promoCtaLink || ""}
                              onChange={(e) => updateSelectedProp("promoCtaLink", e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      {/* Promo Trio Props */}
                      {"card1Tag" in selectedSection.props && (
                        <div className="space-y-2 pt-2 border-t border-sand">
                          <label className="font-bold text-[#0D3B37]">
                            Promo Card 1 (Offer)
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              placeholder="Card 1 Tag"
                              value={selectedSection.props.card1Tag || ""}
                              onChange={(e) => updateSelectedProp("card1Tag", e.target.value)}
                            />
                            <Input
                              placeholder="Discount (e.g. 50%)"
                              value={selectedSection.props.card1Discount || ""}
                              onChange={(e) => updateSelectedProp("card1Discount", e.target.value)}
                            />
                          </div>
                          <Input
                            placeholder="Card 1 Subtitle"
                            value={selectedSection.props.card1Subtitle || ""}
                            onChange={(e) => updateSelectedProp("card1Subtitle", e.target.value)}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              placeholder="Card 1 CTA Text"
                              value={selectedSection.props.card1CtaText || ""}
                              onChange={(e) => updateSelectedProp("card1CtaText", e.target.value)}
                            />
                            <Input
                              placeholder="Card 1 CTA Link"
                              value={selectedSection.props.card1CtaLink || ""}
                              onChange={(e) => updateSelectedProp("card1CtaLink", e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      {"card2Headline" in selectedSection.props && (
                        <div className="space-y-2 pt-2 border-t border-sand">
                          <label className="font-bold text-[#0D3B37]">
                            Promo Card 2 & 3
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              placeholder="Card 2 Headline"
                              value={selectedSection.props.card2Headline || ""}
                              onChange={(e) => updateSelectedProp("card2Headline", e.target.value)}
                            />
                            <Input
                              placeholder="Card 2 Subtitle"
                              value={selectedSection.props.card2Subtitle || ""}
                              onChange={(e) => updateSelectedProp("card2Subtitle", e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              placeholder="Card 3 Tag"
                              value={selectedSection.props.card3Tag || ""}
                              onChange={(e) => updateSelectedProp("card3Tag", e.target.value)}
                            />
                            <Input
                              placeholder="Card 3 Headline"
                              value={selectedSection.props.card3Headline || ""}
                              onChange={(e) => updateSelectedProp("card3Headline", e.target.value)}
                            />
                          </div>
                          <Input
                            placeholder="Card 3 Note"
                            value={selectedSection.props.card3Note || ""}
                            onChange={(e) => updateSelectedProp("card3Note", e.target.value)}
                          />
                        </div>
                      )}

                      {/* Product Limits */}
                      {"limit" in selectedSection.props && (
                        <div className="space-y-1 pt-2 border-t border-sand">
                          <label className="font-bold text-charcoal-800">
                            Number of Products to Display
                          </label>
                          <Input
                            type="number"
                            min={2}
                            max={20}
                            value={selectedSection.props.limit || 5}
                            onChange={(e) => updateSelectedProp("limit", Number(e.target.value))}
                          />
                        </div>
                      )}

                      {/* Trust Mission Pillars */}
                      {"pillar1Title" in selectedSection.props && (
                        <div className="space-y-2 pt-2 border-t border-sand">
                          <label className="font-bold text-[#0D3B37]">
                            Trust Pillars
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              placeholder="Pillar 1 Title"
                              value={selectedSection.props.pillar1Title || ""}
                              onChange={(e) => updateSelectedProp("pillar1Title", e.target.value)}
                            />
                            <Input
                              placeholder="Pillar 1 Desc"
                              value={selectedSection.props.pillar1Desc || ""}
                              onChange={(e) => updateSelectedProp("pillar1Desc", e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              placeholder="Pillar 2 Title"
                              value={selectedSection.props.pillar2Title || ""}
                              onChange={(e) => updateSelectedProp("pillar2Title", e.target.value)}
                            />
                            <Input
                              placeholder="Pillar 2 Desc"
                              value={selectedSection.props.pillar2Desc || ""}
                              onChange={(e) => updateSelectedProp("pillar2Desc", e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              placeholder="Pillar 3 Title"
                              value={selectedSection.props.pillar3Title || ""}
                              onChange={(e) => updateSelectedProp("pillar3Title", e.target.value)}
                            />
                            <Input
                              placeholder="Pillar 3 Desc"
                              value={selectedSection.props.pillar3Desc || ""}
                              onChange={(e) => updateSelectedProp("pillar3Desc", e.target.value)}
                            />
                          </div>
                          {"pillar4Title" in selectedSection.props && (
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                placeholder="Pillar 4 Title"
                                value={selectedSection.props.pillar4Title || ""}
                                onChange={(e) => updateSelectedProp("pillar4Title", e.target.value)}
                              />
                              <Input
                                placeholder="Pillar 4 Desc"
                                value={selectedSection.props.pillar4Desc || ""}
                                onChange={(e) => updateSelectedProp("pillar4Desc", e.target.value)}
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Brand Mission */}
                      {"missionTitle" in selectedSection.props && (
                        <div className="space-y-2 pt-2 border-t border-sand">
                          <label className="font-bold text-[#0D3B37]">
                            Brand Mission Card
                          </label>
                          <Input
                            placeholder="Mission Title"
                            value={selectedSection.props.missionTitle || ""}
                            onChange={(e) => updateSelectedProp("missionTitle", e.target.value)}
                          />
                          <Input
                            placeholder="Mission Tagline"
                            value={selectedSection.props.missionTagline || ""}
                            onChange={(e) => updateSelectedProp("missionTagline", e.target.value)}
                          />
                          <Textarea
                            rows={3}
                            placeholder="Mission Description"
                            value={selectedSection.props.missionDesc || ""}
                            onChange={(e) => updateSelectedProp("missionDesc", e.target.value)}
                          />
                        </div>
                      )}

                      {/* Services Hub Titles */}
                      {"service1Title" in selectedSection.props && (
                        <div className="space-y-2 pt-2 border-t border-sand">
                          <label className="font-bold text-[#0D3B37]">
                            Service Cards
                          </label>
                          <Input
                            placeholder="Service 1 Title"
                            value={selectedSection.props.service1Title || ""}
                            onChange={(e) => updateSelectedProp("service1Title", e.target.value)}
                          />
                          <Input
                            placeholder="Service 1 Desc"
                            value={selectedSection.props.service1Desc || ""}
                            onChange={(e) => updateSelectedProp("service1Desc", e.target.value)}
                          />
                          <Input
                            placeholder="Service 2 Title"
                            value={selectedSection.props.service2Title || ""}
                            onChange={(e) => updateSelectedProp("service2Title", e.target.value)}
                          />
                          <Input
                            placeholder="Service 2 Desc"
                            value={selectedSection.props.service2Desc || ""}
                            onChange={(e) => updateSelectedProp("service2Desc", e.target.value)}
                          />
                        </div>
                      )}

                      {/* Contact Details */}
                      {"primaryPhone" in selectedSection.props && (
                        <div className="space-y-2 pt-2 border-t border-sand">
                          <label className="font-bold text-[#0D3B37]">
                            Contact Numbers & Address
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              placeholder="Primary Phone"
                              value={selectedSection.props.primaryPhone || ""}
                              onChange={(e) => updateSelectedProp("primaryPhone", e.target.value)}
                            />
                            <Input
                              placeholder="Secondary Phone"
                              value={selectedSection.props.secondaryPhone || ""}
                              onChange={(e) => updateSelectedProp("secondaryPhone", e.target.value)}
                            />
                          </div>
                          <Input
                            placeholder="Email Address"
                            value={selectedSection.props.email || ""}
                            onChange={(e) => updateSelectedProp("email", e.target.value)}
                          />
                          <Textarea
                            rows={2}
                            placeholder="Office Address"
                            value={selectedSection.props.officeAddress || ""}
                            onChange={(e) => updateSelectedProp("officeAddress", e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: MEDIA & CLOUDINARY UPLOADER */}
                  {activeSettingsTab === "media" && (
                    <div className="space-y-4">
                      {/* Hero Panoramic Image */}
                      {"bgImage" in selectedSection.props && (
                        <div className="space-y-1.5 p-3 rounded-xl bg-sand/30 border border-sand">
                          <label className="font-bold text-[#0D3B37] block">
                            Hero Background Visual
                          </label>
                          <ImageUploader
                            label="Hero Background (Cloudinary)"
                            helperText="Recommended wide aspect ratio (e.g. 1920x600)"
                            value={selectedSection.props.bgImage || ""}
                            onChange={(url) => updateSelectedProp("bgImage", url)}
                            folder="hero-banners"
                          />
                        </div>
                      )}

                      {/* Category Promo Background */}
                      {"promoBgImage" in selectedSection.props && (
                        <div className="space-y-1.5 p-3 rounded-xl bg-sand/30 border border-sand">
                          <label className="font-bold text-[#0D3B37] block">
                            Quality Products Promo Card Image
                          </label>
                          <ImageUploader
                            label="Promo Background"
                            value={selectedSection.props.promoBgImage || ""}
                            onChange={(url) => updateSelectedProp("promoBgImage", url)}
                            folder="category-promo"
                          />
                        </div>
                      )}

                      {/* Promo Trio Card 1 Image */}
                      {"card1BgImage" in selectedSection.props && (
                        <div className="space-y-1.5 p-3 rounded-xl bg-sand/30 border border-sand">
                          <label className="font-bold text-[#0D3B37] block">
                            Special Offer Card Background
                          </label>
                          <ImageUploader
                            label="Offer Card Background"
                            value={selectedSection.props.card1BgImage || ""}
                            onChange={(url) => updateSelectedProp("card1BgImage", url)}
                            folder="promo-cards"
                          />
                        </div>
                      )}

                      {/* Promo Trio Card 3 Image */}
                      {"card3Image" in selectedSection.props && (
                        <div className="space-y-1.5 p-3 rounded-xl bg-sand/30 border border-sand">
                          <label className="font-bold text-[#0D3B37] block">
                            Get in Touch Illustration
                          </label>
                          <ImageUploader
                            label="Illustration Image"
                            value={selectedSection.props.card3Image || ""}
                            onChange={(url) => updateSelectedProp("card3Image", url)}
                            folder="promo-cards"
                          />
                        </div>
                      )}

                      {/* Mission Background Image */}
                      {"missionBgImage" in selectedSection.props && (
                        <div className="space-y-1.5 p-3 rounded-xl bg-sand/30 border border-sand">
                          <label className="font-bold text-[#0D3B37] block">
                            Trust Mission Banner Background
                          </label>
                          <ImageUploader
                            label="Mission Banner Background"
                            value={selectedSection.props.missionBgImage || ""}
                            onChange={(url) => updateSelectedProp("missionBgImage", url)}
                            folder="trust-banner"
                          />
                        </div>
                      )}

                      {/* Generic Image / Story Image */}
                      {"imageUrl" in selectedSection.props && (
                        <div className="space-y-1.5 p-3 rounded-xl bg-sand/30 border border-sand">
                          <label className="font-bold text-[#0D3B37] block">
                            Feature / Story Image
                          </label>
                          <ImageUploader
                            label="Section Image (Cloudinary)"
                            value={selectedSection.props.imageUrl || ""}
                            onChange={(url) => updateSelectedProp("imageUrl", url)}
                            folder="page-sections"
                          />
                          <Input
                            placeholder="SEO Alt text"
                            value={selectedSection.props.imageAlt || ""}
                            onChange={(e) => updateSelectedProp("imageAlt", e.target.value)}
                          />
                        </div>
                      )}

                      {!["bgImage", "promoBgImage", "card1BgImage", "card3Image", "missionBgImage", "imageUrl"].some(
                        (k) => k in selectedSection.props
                      ) && (
                        <div className="p-6 text-center text-charcoal-400">
                          <ImageIcon className="h-8 w-8 mx-auto mb-2 text-charcoal-300" />
                          <p className="text-xs font-semibold">
                            This section does not require direct background images.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: STYLE & LAYOUT */}
                  {activeSettingsTab === "style" && (
                    <div className="space-y-4">
                      {/* Background Color */}
                      <div className="space-y-2">
                        <label className="font-bold text-charcoal-800 flex items-center justify-between">
                          <span>Background Color</span>
                          <span className="font-mono text-charcoal-500">
                            {selectedSection.props.bgColor || "#FAF7F2"}
                          </span>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={selectedSection.props.bgColor || "#FAF7F2"}
                            onChange={(e) => updateSelectedProp("bgColor", e.target.value)}
                            className="h-8 w-12 rounded cursor-pointer border border-brand-border"
                          />
                          <div className="flex gap-1.5 flex-1">
                            {["#FAF7F2", "#0D3B37", "#FFFFFF", "#F4EFE6", "#0B4632"].map((hex) => (
                              <button
                                key={hex}
                                onClick={() => updateSelectedProp("bgColor", hex)}
                                style={{ backgroundColor: hex }}
                                className="h-6 w-6 rounded-full border border-charcoal-300 shadow-2xs hover:scale-110 transition-transform cursor-pointer"
                                title={hex}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Text Color */}
                      {"textColor" in selectedSection.props && (
                        <div className="space-y-2 pt-2 border-t border-sand">
                          <label className="font-bold text-charcoal-800 flex items-center justify-between">
                            <span>Text Color</span>
                            <span className="font-mono text-charcoal-500">
                              {selectedSection.props.textColor || "#0D3B37"}
                            </span>
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={selectedSection.props.textColor || "#0D3B37"}
                              onChange={(e) => updateSelectedProp("textColor", e.target.value)}
                              className="h-8 w-12 rounded cursor-pointer border border-brand-border"
                            />
                            <div className="flex gap-1.5 flex-1">
                              {["#0D3B37", "#ffffff", "#E0592A", "#143527"].map((hex) => (
                                <button
                                  key={hex}
                                  onClick={() => updateSelectedProp("textColor", hex)}
                                  style={{ backgroundColor: hex }}
                                  className="h-6 w-6 rounded-full border border-charcoal-300 shadow-2xs hover:scale-110 transition-transform cursor-pointer"
                                  title={hex}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Duplicate & Remove Actions */}
                      <div className="pt-4 border-t border-sand space-y-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDuplicate(selectedSection.id)}
                          className="w-full text-xs"
                        >
                          <Copy className="h-3.5 w-3.5 mr-1.5" />
                          Duplicate This Section
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(selectedSection.id)}
                          className="w-full text-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                          Remove From Page
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-charcoal-400 m-auto">
                <Sparkles className="h-8 w-8 mx-auto mb-2 text-[#0D3B37]/40" />
                <p className="text-xs font-semibold">
                  Click any section on the canvas or in the tree to edit its live parameters.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Revisions History Modal */}
        <Modal
          isOpen={isRevisionsModalOpen}
          onClose={() => setIsRevisionsModalOpen(false)}
          title={`"${activePage.title}" Revision History`}
          description="Restore previously published or drafted version snapshots from the database."
          maxWidth="xl"
        >
          <div className="space-y-4">
            {revisionsLoading ? (
              <div className="py-8 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#0D3B37] mb-2" />
                <p className="text-xs text-charcoal-500">Loading version logs...</p>
              </div>
            ) : revisions.length === 0 ? (
              <p className="text-xs text-charcoal-500 py-6 text-center">
                No previous version snapshots available for this page yet.
              </p>
            ) : (
              <div className="divide-y divide-sand max-h-96 overflow-y-auto">
                {revisions.map((rev) => (
                  <div
                    key={rev.id}
                    className="py-3 px-2 flex items-center justify-between hover:bg-sand/20 rounded-lg text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-charcoal-900">
                          Version {rev.version}
                        </span>
                        <Badge
                          variant={
                            rev.status === "PUBLISHED"
                              ? "success"
                              : rev.status === "DRAFT"
                              ? "gold"
                              : "default"
                          }
                        >
                          {rev.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-charcoal-400 mt-0.5">
                        Created {new Date(rev.createdAt).toLocaleString()}
                        {rev.publishedAt && ` • Published ${new Date(rev.publishedAt).toLocaleDateString()}`}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRestoreRevision(rev.id)}
                      className="border-brand-border text-charcoal-700 hover:bg-sand"
                    >
                      Restore This Version
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      </div>
    </AdminLayoutShell>
  );
}
