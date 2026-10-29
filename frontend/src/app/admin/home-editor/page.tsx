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
} from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { pagesApi } from "@/lib/api";
import { HomeSectionsRenderer, HomeSectionData } from "@/components/home/HomeSectionsRenderer";

type DeviceMode = "desktop" | "tablet" | "mobile";

export default function AdminHomeEditorPage() {
  const [sections, setSections] = React.useState<HomeSectionData[]>([]);
  const [selectedSectionId, setSelectedSectionId] = React.useState<string | null>(null);
  const [deviceMode, setDeviceMode] = React.useState<DeviceMode>("desktop");
  const [activeLeftTab, setActiveLeftTab] = React.useState<"tree" | "library">("tree");
  const [activeSettingsTab, setActiveSettingsTab] = React.useState<"content" | "style" | "items">("content");

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

  // Initial Data Fetch
  const loadPageData = async () => {
    try {
      setLoading(true);
      const res = await pagesApi.getDraft("home");
      const pageData = res.data as any;
      if (res.success && pageData?.sections) {
        setSections(pageData.sections);
        setHistory([pageData.sections]);
        setHistoryIndex(0);
        if (pageData.sections.length > 0) {
          setSelectedSectionId(pageData.sections[0].id);
        }
      }
    } catch (err: any) {
      console.error("Failed to load page builder:", err);
      setStatusMessage("Failed to load page builder data.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadPageData();
  }, []);

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
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setSections(history[nextIndex]);
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
    if (confirm("Are you sure you want to remove this section from the Home Page?")) {
      const updated = sections.filter((s) => s.id !== id);
      updateSections(updated);
      if (selectedSectionId === id) {
        setSelectedSectionId(updated[0]?.id || null);
      }
    }
  };

  const handleAddSection = (type: string) => {
    const sectionTemplates: Record<string, Partial<HomeSectionData>> = {
      hero: {
        name: "Hero Section",
        props: {
          overline: "THE EVERYDAY EDIT / 01",
          headline: "A little craft.\nA lot of\ncharacter.",
          subtitle: "Thoughtful objects, everyday essentials and services in one considered place.",
          ctaText: "Explore the collection",
          ctaLink: "/shop",
          imageUrl: "/images/hero-artisan.png",
          imageAlt: "Hero artisan craft",
          caption: "Natural textures. Considered details.",
          captionLink: "/shop",
          bgColor: "#FAF7F2",
          textColor: "#143527",
        },
      },
      manifesto: {
        name: "Manifesto Banner",
        props: {
          headline: "For the way you live, give\nand grow.",
          body: "Welcome to SHOILPIKKABBO. From handcrafted pieces to practical essentials, discover new possibilities for every day.",
          bgColor: "#EBF0EC",
          textColor: "#143527",
        },
      },
      category_discovery: {
        name: "Category Discovery",
        props: {
          overline: "MANY NEEDS. ONE DESTINATION.",
          headline: "Find your everyday.",
          bgColor: "#FAF7F2",
          featuredCategories: [
            { name: "Handicrafts", slug: "handicraft", image: "/images/category-handicrafts.png" },
            { name: "Jute Items", slug: "jute-items", image: "/images/category-jute.png" },
            { name: "Corporate Gift Items", slug: "corporate-gift-items", image: "/images/category-corporate.png" },
          ],
          pills: [
            { name: "Polymer", slug: "polymer" },
            { name: "Baby Items", slug: "baby-items" },
            { name: "Rudiment Garments", slug: "rudiment-garments" },
            { name: "Special E-Sheba", slug: "special-services", href: "/services" },
          ],
        },
      },
      product_grid: {
        name: "Product Grid",
        props: {
          overline: "THE CONSIDERED EDIT",
          headline: "Small details.\nLasting delight.",
          ctaText: "Shop all",
          ctaLink: "/shop",
          bgColor: "#FAF7F2",
        },
      },
      promo_banner: {
        name: "Promotional Banner",
        props: {
          tag: "A LITTLE SOMETHING TO BEGIN",
          headline: "Your first find,\na little sweeter.",
          offerHighlight: "৳150 off your first ৳1,500 order.",
          code: "WELCOME150",
          terms: "One use per customer · Valid online",
          ctaText: "Explore offers",
          ctaLink: "/offers",
          bgColor: "#143527",
          textColor: "#ffffff",
        },
      },
      services_showcase: {
        name: "Services Showcase",
        props: {
          overline: "BEYOND THE BASKET",
          headline: "Make room for possibilities.",
          subtitle: "Proposed service areas. Share your brief; scope and availability are confirmed before any commitment.",
          ctaText: "Explore services",
          ctaLink: "/services",
          bgColor: "#FAF7F2",
          services: [
            { title: "Corporate gifting", link: "/services", icon: "gift" },
            { title: "Industrial Solutions", link: "/services", icon: "factory" },
            { title: "Special E-Sheba / Services", link: "/services", icon: "headset" },
          ],
        },
      },
      brand_story: {
        name: "Brand Story",
        props: {
          overline: "TEXTURE & EVERYDAY LIFE",
          headline: "Beauty in the things\nwe choose.",
          body: "The warmth of clay. The quiet character of natural fibres. Objects that feel at home in your life.",
          ctaText: "Get to know us",
          ctaLink: "/about",
          imageUrl: "/images/story-artisan.png",
          imageAlt: "Artisan storytelling",
          bgColor: "#EFECE6",
          textColor: "#143527",
        },
      },
      corporate_gifting: {
        name: "Corporate Gifting",
        props: {
          overline: "FOR PEOPLE, NOT JUST OCCASIONS",
          headline: "A thoughtful gesture\ngoes a long way.",
          body: "Gift-worthy pieces for your people or your team. Start larger orders with a simple brief.",
          ctaText: "Discover gifting",
          ctaLink: "/services",
          imageUrl: "/images/corporate-gifting-feature.png",
          imageAlt: "Corporate gifting feature",
          bgColor: "#FAF7F2",
          textColor: "#143527",
        },
      },
    };

    const template = sectionTemplates[type];
    if (!template) return;

    const newSection: HomeSectionData = {
      id: `${type}-${Date.now()}`,
      name: template.name || type,
      type,
      isVisible: true,
      props: template.props || {},
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
      const res = await pagesApi.saveDraft("home", {
        title: "Home Page",
        sections,
      });
      if (res.success) {
        setHasUnsavedChanges(false);
        setStatusMessage("Draft successfully saved to database!");
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
      // First save draft
      await pagesApi.saveDraft("home", {
        title: "Home Page",
        sections,
      });
      // Then publish
      const res = await pagesApi.publish("home");
      if (res.success) {
        setHasUnsavedChanges(false);
        setStatusMessage("🎉 Home Page published live to customer storefront!");
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
      const res = await pagesApi.getRevisions("home");
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
    if (confirm("Restore this version? Unsaved changes will be replaced.")) {
      try {
        setRevisionsLoading(true);
        const res = await pagesApi.restoreRevision("home", versionId);
        if (res.success) {
          setIsRevisionsModalOpen(false);
          await loadPageData();
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

  return (
    <AdminLayoutShell>
      <div className="flex flex-col h-[calc(100vh-6rem)] -m-4 sm:-m-6 lg:-m-8 bg-[#F0ECE1]">
        {/* Top Control Bar */}
        <header className="h-14 bg-white border-b border-brand-border px-4 flex items-center justify-between shrink-0 z-30 shadow-xs">
          {/* Left Actions: Device switcher & Undo/Redo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-sand/60 rounded-lg p-0.5 border border-brand-border">
              <button
                onClick={() => setDeviceMode("desktop")}
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  deviceMode === "desktop"
                    ? "bg-white text-forest-900 shadow-xs"
                    : "text-charcoal-500 hover:text-charcoal-800"
                }`}
                title="Desktop View (100%)"
              >
                <Monitor className="h-4 w-4" />
                <span className="hidden sm:inline">Desktop</span>
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
                <Tablet className="h-4 w-4" />
                <span className="hidden sm:inline">Tablet</span>
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
                <Smartphone className="h-4 w-4" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            <div className="h-5 w-px bg-sand mx-1" />

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

          {/* Center: Live Status Toast */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            {statusMessage ? (
              <span className="font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-pulse">
                {statusMessage}
              </span>
            ) : hasUnsavedChanges ? (
              <span className="font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                ● Unsaved Changes
              </span>
            ) : (
              <span className="text-charcoal-400 font-medium">
                Draft Saved
              </span>
            )}
          </div>

          {/* Right Actions: Revisions, Preview, Save Draft, Publish */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenRevisions}
              className="px-2.5 py-1.5 rounded-lg border border-brand-border text-xs font-medium text-charcoal-700 hover:bg-sand flex items-center gap-1.5 cursor-pointer"
              title="View Revision History"
            >
              <History className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Revisions</span>
            </button>

            <Link
              href="/?preview=true"
              target="_blank"
              className="px-2.5 py-1.5 rounded-lg border border-brand-border text-xs font-medium text-charcoal-700 hover:bg-sand flex items-center gap-1.5"
              title="Preview in new tab"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </Link>

            <Button
              size="sm"
              variant="outline"
              disabled={saveLoading}
              onClick={handleSaveDraft}
              className="border-forest-800 text-forest-900 hover:bg-forest-50"
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
              className="bg-forest-900 hover:bg-forest-950 text-white font-bold shadow-sm"
            >
              {publishLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
              ) : (
                <Globe className="h-3.5 w-3.5 mr-1 text-gold-400" />
              )}
              Publish Live
            </Button>
          </div>
        </header>

        {/* 3-Column Editor Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar: Section Hierarchy & Section Library */}
          <div className="w-64 bg-white border-r border-brand-border flex flex-col shrink-0 z-20 shadow-xs">
            {/* Tabs */}
            <div className="flex border-b border-brand-border text-xs">
              <button
                onClick={() => setActiveLeftTab("tree")}
                className={`flex-1 py-2.5 font-bold text-center border-b-2 -mb-px transition-colors cursor-pointer ${
                  activeLeftTab === "tree"
                    ? "border-forest-800 text-forest-900 bg-sand/20"
                    : "border-transparent text-charcoal-500 hover:text-charcoal-800"
                }`}
              >
                Section Tree ({sections.length})
              </button>
              <button
                onClick={() => setActiveLeftTab("library")}
                className={`flex-1 py-2.5 font-bold text-center border-b-2 -mb-px transition-colors cursor-pointer ${
                  activeLeftTab === "library"
                    ? "border-forest-800 text-forest-900 bg-sand/20"
                    : "border-transparent text-charcoal-500 hover:text-charcoal-800"
                }`}
              >
                + Add Section
              </button>
            </div>

            {/* Content of Left Tab */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {activeLeftTab === "tree" ? (
                sections.map((sec, idx) => {
                  const isSelected = selectedSectionId === sec.id;
                  return (
                    <div
                      key={sec.id}
                      onClick={() => setSelectedSectionId(sec.id)}
                      className={`p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? "bg-forest-800 text-white border-forest-900 shadow-sm"
                          : "bg-white border-brand-border text-charcoal-800 hover:bg-sand/40"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`text-[10px] font-bold ${isSelected ? "text-gold-400" : "text-charcoal-400"}`}>
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
                          title={sec.isVisible ? "Hide" : "Show"}
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
                        >
                          <ChevronDown className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 px-1">
                    Available Section Blocks
                  </p>
                  {[
                    { type: "hero", label: "Hero Showcase", desc: "Large editorial visual + headline" },
                    { type: "manifesto", label: "Manifesto Banner", desc: "Brand statement banner" },
                    { type: "category_discovery", label: "Category Discovery", desc: "Craft cards and pills" },
                    { type: "product_grid", label: "Product Grid", desc: "The Considered Edit catalog" },
                    { type: "promo_banner", label: "Promo Offer Banner", desc: "Voucher discount callout" },
                    { type: "services_showcase", label: "Services Showcase", desc: "Beyond the basket cards" },
                    { type: "brand_story", label: "Brand Story", desc: "Texture & artisan narrative" },
                    { type: "corporate_gifting", label: "Corporate Gifting", desc: "B2B client procurement" },
                  ].map((item) => (
                    <button
                      key={item.type}
                      onClick={() => handleAddSection(item.type)}
                      className="w-full text-left p-3 rounded-xl border border-brand-border bg-white hover:bg-forest-50 hover:border-forest-800/40 transition-all cursor-pointer group"
                    >
                      <p className="font-bold text-xs text-charcoal-900 group-hover:text-forest-900 flex items-center justify-between">
                        <span>{item.label}</span>
                        <Plus className="h-3.5 w-3.5 text-forest-800" />
                      </p>
                      <p className="text-[11px] text-charcoal-500 mt-0.5">
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Central Canvas: Full Home Page Preview Simulator */}
          <div className="flex-1 bg-[#E8E2D6] overflow-y-auto p-4 sm:p-6 lg:p-8 flex justify-center">
            {loading ? (
              <div className="flex flex-col items-center justify-center m-auto">
                <Loader2 className="h-8 w-8 text-forest-800 animate-spin mb-3" />
                <p className="text-xs font-semibold text-charcoal-600">
                  Loading visual Home Page canvas...
                </p>
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
                    ? "border-[6px] border-charcoal-900 rounded-3xl overflow-hidden my-4"
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
                />
              </div>
            )}
          </div>

          {/* Right Settings Panel: Contextual Section Settings */}
          <div className="w-80 bg-white border-l border-brand-border flex flex-col shrink-0 z-20 shadow-xs">
            {selectedSection ? (
              <>
                <div className="p-4 border-b border-brand-border bg-sand/30 flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-extrabold text-sm text-charcoal-900">
                      {selectedSection.name || selectedSection.type}
                    </h3>
                    <p className="text-[10px] text-charcoal-500 uppercase tracking-wider font-semibold">
                      Type: {selectedSection.type}
                    </p>
                  </div>
                  <Badge variant={selectedSection.isVisible ? "success" : "default"}>
                    {selectedSection.isVisible ? "Visible" : "Hidden"}
                  </Badge>
                </div>

                {/* Sub-tabs for Settings */}
                <div className="flex border-b border-brand-border text-xs">
                  <button
                    onClick={() => setActiveSettingsTab("content")}
                    className={`flex-1 py-2 font-bold text-center border-b-2 -mb-px transition-colors cursor-pointer ${
                      activeSettingsTab === "content"
                        ? "border-forest-800 text-forest-900"
                        : "border-transparent text-charcoal-500 hover:text-charcoal-800"
                    }`}
                  >
                    Content
                  </button>
                  <button
                    onClick={() => setActiveSettingsTab("style")}
                    className={`flex-1 py-2 font-bold text-center border-b-2 -mb-px transition-colors cursor-pointer ${
                      activeSettingsTab === "style"
                        ? "border-forest-800 text-forest-900"
                        : "border-transparent text-charcoal-500 hover:text-charcoal-800"
                    }`}
                  >
                    Style & Colors
                  </button>
                </div>

                {/* Form Controls */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                  {activeSettingsTab === "content" && (
                    <>
                      {/* Overline Tag */}
                      {"overline" in selectedSection.props && (
                        <div className="space-y-1">
                          <label className="font-bold text-charcoal-800">
                            Overline Tagline
                          </label>
                          <Input
                            value={selectedSection.props.overline || ""}
                            onChange={(e) => updateSelectedProp("overline", e.target.value)}
                          />
                        </div>
                      )}

                      {/* Headline */}
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

                      {/* Subtitle / Body */}
                      {"subtitle" in selectedSection.props && (
                        <div className="space-y-1">
                          <label className="font-bold text-charcoal-800">
                            Subtitle Copy
                          </label>
                          <Textarea
                            rows={3}
                            value={selectedSection.props.subtitle || ""}
                            onChange={(e) => updateSelectedProp("subtitle", e.target.value)}
                          />
                        </div>
                      )}

                      {"body" in selectedSection.props && (
                        <div className="space-y-1">
                          <label className="font-bold text-charcoal-800">
                            Body Paragraph
                          </label>
                          <Textarea
                            rows={3}
                            value={selectedSection.props.body || ""}
                            onChange={(e) => updateSelectedProp("body", e.target.value)}
                          />
                        </div>
                      )}

                      {/* CTA Label & Link */}
                      {"ctaText" in selectedSection.props && (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="font-bold text-charcoal-800">
                              Button Text
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

                      {/* Image settings */}
                      {"imageUrl" in selectedSection.props && (
                        <div className="space-y-2 pt-2 border-t border-sand">
                          <label className="font-bold text-charcoal-800 flex items-center gap-1.5">
                            <ImageIcon className="h-3.5 w-3.5 text-forest-800" />
                            <span>Visual Asset URL</span>
                          </label>
                          <Input
                            placeholder="https://..."
                            value={selectedSection.props.imageUrl || ""}
                            onChange={(e) => updateSelectedProp("imageUrl", e.target.value)}
                          />
                          <Input
                            placeholder="Image Alt text for SEO"
                            value={selectedSection.props.imageAlt || ""}
                            onChange={(e) => updateSelectedProp("imageAlt", e.target.value)}
                          />
                        </div>
                      )}

                      {/* Promo fields */}
                      {"offerHighlight" in selectedSection.props && (
                        <div className="space-y-2 pt-2 border-t border-sand">
                          <label className="font-bold text-charcoal-800">
                            Offer Highlight Text
                          </label>
                          <Input
                            value={selectedSection.props.offerHighlight || ""}
                            onChange={(e) => updateSelectedProp("offerHighlight", e.target.value)}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="font-bold text-charcoal-800 block mb-1">
                                Promo Code
                              </label>
                              <Input
                                value={selectedSection.props.code || ""}
                                onChange={(e) => updateSelectedProp("code", e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="font-bold text-charcoal-800 block mb-1">
                                Expiration Tag
                              </label>
                              <Input
                                value={selectedSection.props.terms || ""}
                                onChange={(e) => updateSelectedProp("terms", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

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
                            {["#FAF7F2", "#143527", "#EBF0EC", "#EFECE6", "#FFFFFF"].map((hex) => (
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
                              {selectedSection.props.textColor || "#143527"}
                            </span>
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={selectedSection.props.textColor || "#143527"}
                              onChange={(e) => updateSelectedProp("textColor", e.target.value)}
                              className="h-8 w-12 rounded cursor-pointer border border-brand-border"
                            />
                            <div className="flex gap-1.5 flex-1">
                              {["#143527", "#ffffff", "#B85D38", "#2D3F33"].map((hex) => (
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

                      {/* Section Name */}
                      <div className="space-y-1 pt-2 border-t border-sand">
                        <label className="font-bold text-charcoal-800">
                          Internal Label
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
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-charcoal-400 m-auto">
                <Sparkles className="h-8 w-8 mx-auto mb-2 text-charcoal-300" />
                <p className="text-xs font-semibold">
                  Select a section from the canvas to edit its live parameters.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Revisions History Modal */}
        <Modal
          isOpen={isRevisionsModalOpen}
          onClose={() => setIsRevisionsModalOpen(false)}
          title="Home Page Revision History"
          description="Restore previously published or drafted version snapshots."
          maxWidth="xl"
        >
          <div className="space-y-4">
            {revisionsLoading ? (
              <div className="py-8 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-forest-800 mb-2" />
                <p className="text-xs text-charcoal-500">Loading version logs...</p>
              </div>
            ) : revisions.length === 0 ? (
              <p className="text-xs text-charcoal-500 py-6 text-center">
                No previous version snapshots available.
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
                          Version {rev.versionNumber}
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
