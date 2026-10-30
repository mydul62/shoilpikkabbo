"use client";

import * as React from "react";
import Image from "next/image";
import {
  Settings,
  Save,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Phone,
  RefreshCw,
  Share2,
  MapPin,
  Megaphone,
  AlertCircle,
  Loader2,
  Smartphone,
  Building2,
  CreditCard,
  Mail,
  Clock,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Eye,
  Check,
  Copy,
  Info,
  ChevronRight,
  Sliders,
  DollarSign,
  Globe,
  Radio,
  AlertTriangle,
} from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { settingsApi } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { formatPrice } from "@/lib/utils";

interface AlertToastState {
  type: "success" | "error" | "warning";
  title: string;
  message: string;
}

export default function AdminSettingsPage() {
  const { refreshSettings } = useSettings();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string>("brand");
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  // Form State
  const [initialForm, setInitialForm] = React.useState<Record<string, string>>({});
  const [form, setForm] = React.useState({
    store_name: "SHOILPIKKABBO",
    tagline: "Delivery • Quality • Reliability",
    store_name_bn: "শিল্পকাব্য",
    tagline_bn: "ঐতিহ্য ও আধুনিকতার অনন্য কারুশিল্প",
    contact_email: "shoilpikkabbo@gmail.com",
    contact_primary: "01731214379",
    contact_secondary: "01811909068",
    contact_payment: "01977765999",
    payment_bkash_number: "01977765999",
    payment_nagad_number: "01977765999",
    payment_rocket_number: "",
    bank_name: "BRAC Bank PLC",
    bank_account_name: "SHOILPIKKABBO",
    bank_account_number: "1501204892001",
    bank_branch: "Gulshan Corporate Branch, Dhaka",
    delivery_dhaka: "70",
    delivery_outside: "130",
    free_delivery_threshold: "3000",
    delivery_time_dhaka: "24 - 48 Hours",
    delivery_time_outside: "3 - 5 Business Days",
    social_whatsapp: "https://wa.me/8801731214379",
    social_facebook: "https://facebook.com/shoilpikkabbo",
    social_messenger: "https://m.me/shoilpikkabbo",
    social_youtube: "https://youtube.com/@shoilpikkabbo",
    social_instagram: "https://instagram.com/shoilpikkabbo",
    office_address: "House 12, Road 4, Sector 3, Uttara, Dhaka - 1230, Bangladesh",
    office_hours: "Saturday - Thursday: 9:00 AM - 8:00 PM",
    header_announcement: "Free delivery nationwide on orders above ৳3,000 | Authentic Bengali Craftsmanship",
    header_announcement_enabled: "true",
    store_logo_url: "",
    payment_instructions_note: "Send payment via Send Money or Make Payment. Paste your TrxID in the box below to authorize fulfillment.",
  });

  // Modern Toast Alert
  const [alertToast, setAlertToast] = React.useState<AlertToastState | null>(null);

  const showAlert = (type: "success" | "error" | "warning", title: string, message: string) => {
    setAlertToast({ type, title, message });
    setTimeout(() => {
      setAlertToast((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await settingsApi.getAll();
      if (res.success && res.data) {
        const d = res.data as Record<string, string>;
        const loaded = {
          store_name: d["store_name"] || "SHOILPIKKABBO",
          tagline: d["tagline"] || "Delivery • Quality • Reliability",
          store_name_bn: d["store_name_bn"] || "শিল্পকাব্য",
          tagline_bn: d["tagline_bn"] || "ঐতিহ্য ও আধুনিকতার অনন্য কারুশিল্প",
          contact_email: d["contact_email"] || "shoilpikkabbo@gmail.com",
          contact_primary: d["contact_primary"] || "01731214379",
          contact_secondary: d["contact_secondary"] || "01811909068",
          contact_payment: d["contact_payment"] || d["payment_bkash_number"] || "01977765999",
          payment_bkash_number: d["payment_bkash_number"] || "01977765999",
          payment_nagad_number: d["payment_nagad_number"] || "01977765999",
          payment_rocket_number: d["payment_rocket_number"] || "",
          bank_name: d["bank_name"] || "BRAC Bank PLC",
          bank_account_name: d["bank_account_name"] || "SHOILPIKKABBO",
          bank_account_number: d["bank_account_number"] || "1501204892001",
          bank_branch: d["bank_branch"] || "Gulshan Corporate Branch, Dhaka",
          delivery_dhaka: d["delivery_dhaka"] || "70",
          delivery_outside: d["delivery_outside"] || "130",
          free_delivery_threshold: d["free_delivery_threshold"] || "3000",
          delivery_time_dhaka: d["delivery_time_dhaka"] || "24 - 48 Hours",
          delivery_time_outside: d["delivery_time_outside"] || "3 - 5 Business Days",
          social_whatsapp: d["social_whatsapp"] || "https://wa.me/8801731214379",
          social_facebook: d["social_facebook"] || "https://facebook.com/shoilpikkabbo",
          social_messenger: d["social_messenger"] || "https://m.me/shoilpikkabbo",
          social_youtube: d["social_youtube"] || "https://youtube.com/@shoilpikkabbo",
          social_instagram: d["social_instagram"] || "https://instagram.com/shoilpikkabbo",
          office_address: d["office_address"] || "House 12, Road 4, Sector 3, Uttara, Dhaka - 1230, Bangladesh",
          office_hours: d["office_hours"] || "Saturday - Thursday: 9:00 AM - 8:00 PM",
          header_announcement: d["header_announcement"] || "Free delivery nationwide on orders above ৳3,000 | Authentic Bengali Craftsmanship",
          header_announcement_enabled: d["header_announcement_enabled"] ?? "true",
          store_logo_url: d["store_logo_url"] || "",
          payment_instructions_note: d["payment_instructions_note"] || "Send payment via Send Money or Make Payment. Paste your TrxID in the box below to authorize fulfillment.",
        };
        setForm(loaded);
        setInitialForm(loaded);
      }
    } catch (err: any) {
      console.error("Failed to load settings:", err);
      showAlert("error", "Failed to Load", err?.message || "Could not retrieve store settings.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSettings();
  }, []);

  // Keyboard shortcut Ctrl + S or Cmd + S to save
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveSettings();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [form]);

  // Check if form is dirty
  const isDirty = React.useMemo(() => {
    if (Object.keys(initialForm).length === 0) return false;
    return JSON.stringify(form) !== JSON.stringify(initialForm);
  }, [form, initialForm]);

  const saveSettings = async () => {
    try {
      setSaving(true);
      const res = await settingsApi.update(form);
      if (res.success) {
        setInitialForm(form);
        await refreshSettings();
        showAlert(
          "success",
          "Settings Synchronized",
          "All changes have been successfully saved to the database and published live across the storefront."
        );
      } else {
        showAlert("error", "Save Failed", res.message || "Failed to update settings.");
      }
    } catch (err: any) {
      showAlert("error", "Error", err?.message || "An error occurred while saving settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (Object.keys(initialForm).length > 0) {
      setForm(initialForm as any);
      showAlert("warning", "Changes Reverted", "Form restored to last saved state.");
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <AdminLayoutShell>
      {/* Toast Alert */}
      {alertToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div
            className={`p-4 rounded-2xl shadow-2xl border flex items-center gap-3 max-w-md ${
              alertToast.type === "success"
                ? "bg-[#0D3B37] text-white border-emerald-700"
                : alertToast.type === "warning"
                ? "bg-amber-500 text-charcoal-900 border-amber-600"
                : "bg-rose-600 text-white border-rose-700"
            }`}
          >
            {alertToast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />}
            {alertToast.type === "warning" && <AlertTriangle className="w-5 h-5 text-charcoal-900 shrink-0" />}
            {alertToast.type === "error" && <AlertCircle className="w-5 h-5 text-white shrink-0" />}
            <div className="min-w-0">
              <h5 className="font-extrabold text-xs">{alertToast.title}</h5>
              <p className="text-[11px] opacity-90 line-clamp-2">{alertToast.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* FULL-WIDTH STUDIO CONTAINER */}
      <div className="w-full max-w-[1720px] mx-auto space-y-6">
        {/* HEADER BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-brand-border shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-forest-800/10 text-forest-900 font-extrabold text-[11px] uppercase tracking-wider">
                Store Operations Studio
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-charcoal-500">Live PostgreSQL Sync</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 font-heading mt-1">
              Store & Operations Settings
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-0.5">
              Control public storefront announcements, delivery charges, official banking details, and brand metadata.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {isDirty && (
              <Button
                variant="outline"
                size="md"
                onClick={handleReset}
                disabled={saving}
                className="border-brand-border text-charcoal-700 hover:bg-sand rounded-2xl text-xs font-bold"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Discard
              </Button>
            )}

            <Button
              variant="outline"
              size="md"
              onClick={fetchSettings}
              disabled={loading || saving}
              className="border-brand-border text-charcoal-700 hover:bg-sand rounded-2xl text-xs font-bold"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin text-forest-800" : ""}`} />
              Reload
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={saveSettings}
              disabled={saving}
              className="bg-[#0D3B37] hover:bg-forest-900 text-white rounded-2xl font-bold text-xs shadow-md"
            >
              {saving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  <span>Save All Settings</span>
                  <span className="ml-1.5 px-1.5 py-0.2 rounded bg-white/20 text-[10px] hidden sm:inline">
                    Ctrl+S
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 12-COLUMN FULL-WIDTH SPLIT ARCHITECTURE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT 8 COLUMNS: ALL CONFIGURATION PANELS */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. BRAND IDENTITY & LOGO */}
            <div
              id="brand"
              className="p-6 rounded-3xl border border-brand-border bg-white shadow-xs space-y-5"
            >
              <div className="flex items-center justify-between border-b border-sand pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-forest-800/10 text-forest-900 flex items-center justify-center font-bold">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-base text-charcoal-900">
                      1. Brand Identity & Visual Assets
                    </h2>
                    <p className="text-xs text-charcoal-500">
                      Core business name, brand taglines in English & Bengali, and logo assets.
                    </p>
                  </div>
                </div>
                <Badge variant="primary" className="text-[11px] font-bold">
                  Core
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal-800">Business Name (English)</label>
                  <Input
                    value={form.store_name}
                    onChange={(e) => setForm({ ...form, store_name: e.target.value })}
                    className="h-10 text-xs"
                    placeholder="e.g. SHOILPIKKABBO"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal-800 font-bengali">ব্যবসার নাম (বাংলা)</label>
                  <Input
                    value={form.store_name_bn}
                    onChange={(e) => setForm({ ...form, store_name_bn: e.target.value })}
                    className="h-10 text-xs font-bengali"
                    placeholder="e.g. শিল্পকাব্য"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal-800">Brand Tagline (English)</label>
                  <Input
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    className="h-10 text-xs"
                    placeholder="e.g. Delivery • Quality • Reliability"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal-800 font-bengali">ট্যাগলাইন (বাংলা)</label>
                  <Input
                    value={form.tagline_bn}
                    onChange={(e) => setForm({ ...form, tagline_bn: e.target.value })}
                    className="h-10 text-xs font-bengali"
                    placeholder="e.g. ঐতিহ্য ও আধুনিকতার অনন্য কারুশিল্প"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">Official Support & Orders Email</label>
                <Input
                  type="email"
                  value={form.contact_email}
                  onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                  className="h-10 text-xs"
                  placeholder="support@shoilpikkabbo.com"
                  required
                />
              </div>

              <div className="pt-2 border-t border-sand">
                <ImageUploader
                  label="Official Storefront Logo"
                  helperText="Upload official brand logo to Cloudinary CDN (SVG, Transparent PNG, or WEBP)"
                  value={form.store_logo_url}
                  onChange={(url) => setForm({ ...form, store_logo_url: url })}
                  folder="branding"
                />
              </div>
            </div>

            {/* 2. TOP ANNOUNCEMENT BAR */}
            <div
              id="announcement"
              className="p-6 rounded-3xl border border-brand-border bg-white shadow-xs space-y-5"
            >
              <div className="flex items-center justify-between border-b border-sand pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-base text-charcoal-900">
                      2. Top Announcement & Promo Banner
                    </h2>
                    <p className="text-xs text-charcoal-500">
                      Promotional banner displayed at the absolute top of the public website.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      header_announcement_enabled:
                        form.header_announcement_enabled === "true" ? "false" : "true",
                    })
                  }
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                    form.header_announcement_enabled === "true"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-gray-100 text-gray-500 border-gray-200"
                  }`}
                >
                  {form.header_announcement_enabled === "true" ? "Active (Visible)" : "Hidden"}
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Announcement Message / Promo Copy
                </label>
                <Input
                  value={form.header_announcement}
                  onChange={(e) => setForm({ ...form, header_announcement: e.target.value })}
                  className="h-10 text-xs"
                  placeholder="e.g. Free delivery nationwide on orders above ৳3,000 | Authentic Bengali Craftsmanship"
                />
              </div>
            </div>

            {/* 3. CUSTOMER HELPLINE & SUPPORT LINES */}
            <div
              id="support"
              className="p-6 rounded-3xl border border-brand-border bg-white shadow-xs space-y-5"
            >
              <div className="flex items-center justify-between border-b border-sand pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-base text-charcoal-900">
                      3. Customer Helplines & Direct Support
                    </h2>
                    <p className="text-xs text-charcoal-500">
                      Official phone contact lines rendered in header, footer, and checkout invoice.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal-800">Primary Support Phone</label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      value={form.contact_primary}
                      onChange={(e) => setForm({ ...form, contact_primary: e.target.value })}
                      className="h-10 text-xs font-mono"
                      placeholder="01731214379"
                      required
                    />
                    <a
                      href={`tel:${form.contact_primary}`}
                      className="p-2.5 rounded-xl bg-sand/60 hover:bg-sand text-forest-800 transition-colors"
                      title="Test call"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal-800">Secondary Support Phone</label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      value={form.contact_secondary}
                      onChange={(e) => setForm({ ...form, contact_secondary: e.target.value })}
                      className="h-10 text-xs font-mono"
                      placeholder="01811909068"
                    />
                    <a
                      href={`tel:${form.contact_secondary}`}
                      className="p-2.5 rounded-xl bg-sand/60 hover:bg-sand text-forest-800 transition-colors"
                      title="Test call"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. PAYMENT VERIFICATION & OFFICIAL BANKING */}
            <div
              id="payments"
              className="p-6 rounded-3xl border border-brand-border bg-white shadow-xs space-y-5"
            >
              <div className="flex items-center justify-between border-b border-sand pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-base text-charcoal-900">
                      4. Official Payment Channels & Accounts
                    </h2>
                    <p className="text-xs text-charcoal-500">
                      Merchant receiving accounts shown to buyers during manual checkout and payment audits.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Wallets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 p-3.5 rounded-2xl bg-pink-50/40 border border-pink-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-pink-900 flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-pink-600" />
                      <span>Official bKash Number</span>
                    </label>
                    <span className="text-[10px] text-pink-700 font-bold">Personal / Merchant</span>
                  </div>
                  <Input
                    value={form.payment_bkash_number}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        payment_bkash_number: e.target.value,
                        contact_payment: e.target.value,
                      })
                    }
                    className="h-10 text-xs font-mono bg-white"
                    placeholder="01977765999"
                    required
                  />
                </div>

                <div className="space-y-1 p-3.5 rounded-2xl bg-orange-50/40 border border-orange-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-orange-900 flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-orange-600" />
                      <span>Official Nagad Number</span>
                    </label>
                    <span className="text-[10px] text-orange-700 font-bold">Personal / Merchant</span>
                  </div>
                  <Input
                    value={form.payment_nagad_number}
                    onChange={(e) => setForm({ ...form, payment_nagad_number: e.target.value })}
                    className="h-10 text-xs font-mono bg-white"
                    placeholder="01977765999"
                    required
                  />
                </div>
              </div>

              {/* Bank Details */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-sand space-y-3">
                <h4 className="font-extrabold text-xs text-charcoal-800 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-forest-800" />
                  <span>Corporate Bank Wire Settlement Details</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-charcoal-800">Bank Name</label>
                    <Input
                      value={form.bank_name}
                      onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
                      className="h-10 text-xs bg-white"
                      placeholder="BRAC Bank PLC"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-charcoal-800">Account Name / Title</label>
                    <Input
                      value={form.bank_account_name}
                      onChange={(e) => setForm({ ...form, bank_account_name: e.target.value })}
                      className="h-10 text-xs bg-white"
                      placeholder="SHOILPIKKABBO"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-charcoal-800">Account Number</label>
                    <Input
                      value={form.bank_account_number}
                      onChange={(e) => setForm({ ...form, bank_account_number: e.target.value })}
                      className="h-10 text-xs font-mono bg-white"
                      placeholder="1501204892001"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-charcoal-800">Branch & Routing</label>
                    <Input
                      value={form.bank_branch}
                      onChange={(e) => setForm({ ...form, bank_branch: e.target.value })}
                      className="h-10 text-xs bg-white"
                      placeholder="Gulshan Corporate Branch, Dhaka"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Checkout Payment Instructions (Shown to customers)
                </label>
                <textarea
                  rows={2}
                  value={form.payment_instructions_note}
                  onChange={(e) => setForm({ ...form, payment_instructions_note: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-border bg-white text-xs focus:ring-2 focus:ring-[#0D3B37] focus:outline-hidden"
                />
              </div>
            </div>

            {/* 5. NATIONWIDE DELIVERY CHARGES & POLICIES */}
            <div
              id="shipping"
              className="p-6 rounded-3xl border border-brand-border bg-white shadow-xs space-y-5"
            >
              <div className="flex items-center justify-between border-b border-sand pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-base text-charcoal-900">
                      5. Nationwide Shipping Charges & Delivery Rules
                    </h2>
                    <p className="text-xs text-charcoal-500">
                      Dynamic delivery rates automatically applied at cart and checkout.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1 p-3.5 rounded-2xl bg-[#FAF8F5] border border-sand">
                  <label className="text-xs font-bold text-charcoal-800 block">
                    Inside Dhaka Fee (৳)
                  </label>
                  <Input
                    type="number"
                    value={form.delivery_dhaka}
                    onChange={(e) => setForm({ ...form, delivery_dhaka: e.target.value })}
                    className="h-10 text-xs font-bold text-forest-900 bg-white"
                    required
                  />
                  <span className="text-[10px] text-charcoal-400">Standard: ৳70 - ৳80</span>
                </div>

                <div className="space-y-1 p-3.5 rounded-2xl bg-[#FAF8F5] border border-sand">
                  <label className="text-xs font-bold text-charcoal-800 block">
                    Outside Dhaka Fee (৳)
                  </label>
                  <Input
                    type="number"
                    value={form.delivery_outside}
                    onChange={(e) => setForm({ ...form, delivery_outside: e.target.value })}
                    className="h-10 text-xs font-bold text-forest-900 bg-white"
                    required
                  />
                  <span className="text-[10px] text-charcoal-400">Standard: ৳130 - ৳150</span>
                </div>

                <div className="space-y-1 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                  <label className="text-xs font-bold text-emerald-900 block">
                    Free Delivery Threshold (৳)
                  </label>
                  <Input
                    type="number"
                    value={form.free_delivery_threshold}
                    onChange={(e) => setForm({ ...form, free_delivery_threshold: e.target.value })}
                    className="h-10 text-xs font-bold text-emerald-900 bg-white"
                    required
                  />
                  <span className="text-[10px] text-emerald-700">Orders above this get ৳0 delivery</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal-800">
                    Estimated Transit: Inside Dhaka
                  </label>
                  <Input
                    value={form.delivery_time_dhaka}
                    onChange={(e) => setForm({ ...form, delivery_time_dhaka: e.target.value })}
                    className="h-10 text-xs"
                    placeholder="24 - 48 Hours"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal-800">
                    Estimated Transit: Outside Dhaka
                  </label>
                  <Input
                    value={form.delivery_time_outside}
                    onChange={(e) => setForm({ ...form, delivery_time_outside: e.target.value })}
                    className="h-10 text-xs"
                    placeholder="3 - 5 Business Days"
                  />
                </div>
              </div>
            </div>

            {/* 6. SOCIAL MEDIA & CHAT CHANNELS */}
            <div
              id="social"
              className="p-6 rounded-3xl border border-brand-border bg-white shadow-xs space-y-5"
            >
              <div className="flex items-center justify-between border-b border-sand pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-forest-800/10 text-forest-900 flex items-center justify-center font-bold">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-base text-charcoal-900">
                      6. Social Media & Communication Channels
                    </h2>
                    <p className="text-xs text-charcoal-500">
                      Connected channels for direct buyer chats and public community links.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal-800">WhatsApp Link</label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      value={form.social_whatsapp}
                      onChange={(e) => setForm({ ...form, social_whatsapp: e.target.value })}
                      className="h-10 text-xs"
                      placeholder="https://wa.me/8801731214379"
                    />
                    <a
                      href={form.social_whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                      title="Test WhatsApp"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal-800">Messenger Link</label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      value={form.social_messenger}
                      onChange={(e) => setForm({ ...form, social_messenger: e.target.value })}
                      className="h-10 text-xs"
                      placeholder="https://m.me/shoilpikkabbo"
                    />
                    <a
                      href={form.social_messenger}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                      title="Test Messenger"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal-800">Facebook Page URL</label>
                  <Input
                    value={form.social_facebook}
                    onChange={(e) => setForm({ ...form, social_facebook: e.target.value })}
                    className="h-10 text-xs"
                    placeholder="https://facebook.com/shoilpikkabbo"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal-800">YouTube Channel URL</label>
                  <Input
                    value={form.social_youtube}
                    onChange={(e) => setForm({ ...form, social_youtube: e.target.value })}
                    className="h-10 text-xs"
                    placeholder="https://youtube.com/@shoilpikkabbo"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal-800">Instagram URL</label>
                  <Input
                    value={form.social_instagram}
                    onChange={(e) => setForm({ ...form, social_instagram: e.target.value })}
                    className="h-10 text-xs"
                    placeholder="https://instagram.com/shoilpikkabbo"
                  />
                </div>
              </div>
            </div>

            {/* 7. PHYSICAL HEADQUARTERS & RETURN ADDRESS */}
            <div
              id="office"
              className="p-6 rounded-3xl border border-brand-border bg-white shadow-xs space-y-5"
            >
              <div className="flex items-center justify-between border-b border-sand pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-base text-charcoal-900">
                      7. Physical Headquarters & Return Address
                    </h2>
                    <p className="text-xs text-charcoal-500">
                      Physical pickup location, courier returns, and working hours.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">Headquarters Address</label>
                <Input
                  value={form.office_address}
                  onChange={(e) => setForm({ ...form, office_address: e.target.value })}
                  className="h-10 text-xs"
                  placeholder="House 12, Road 4, Sector 3, Uttara, Dhaka - 1230, Bangladesh"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Customer Support Working Hours
                </label>
                <Input
                  value={form.office_hours}
                  onChange={(e) => setForm({ ...form, office_hours: e.target.value })}
                  className="h-10 text-xs"
                  placeholder="Saturday - Thursday: 9:00 AM - 8:00 PM"
                />
              </div>
            </div>
          </div>

          {/* RIGHT 4 COLUMNS: STICKY LIVE PREVIEWS & QUICK NAVIGATOR */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            {/* Quick Section Navigator */}
            <div className="p-5 rounded-3xl border border-brand-border bg-white shadow-xs space-y-3">
              <h3 className="font-heading font-extrabold text-xs text-charcoal-900 uppercase tracking-wider">
                Settings Navigator
              </h3>
              <div className="space-y-1">
                {[
                  { id: "brand", label: "Brand Identity & Logo", icon: Settings },
                  { id: "announcement", label: "Top Announcement Bar", icon: Megaphone },
                  { id: "support", label: "Support & Helplines", icon: Phone },
                  { id: "payments", label: "Payment Accounts", icon: ShieldCheck },
                  { id: "shipping", label: "Shipping Rates & Free Delivery", icon: Truck },
                  { id: "social", label: "Social & Chat Links", icon: Share2 },
                  { id: "office", label: "Headquarters & Office", icon: MapPin },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full p-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        activeSection === item.id
                          ? "bg-[#0D3B37] text-white shadow-xs"
                          : "text-charcoal-700 hover:bg-sand"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* REAL-TIME LIVE STOREFRONT PREVIEWS */}
            <div className="p-5 rounded-3xl border border-brand-border bg-white shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-sand pb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-forest-800" />
                  <span>Real-Time Public Storefront Previews</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* 1. Announcement Preview */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider block">
                  Top Announcement Bar (Live)
                </span>
                <div className="p-2.5 rounded-xl bg-[#0D3B37] text-white text-[11px] text-center font-medium shadow-2xs truncate">
                  {form.header_announcement_enabled === "true"
                    ? form.header_announcement || "Announcement message..."
                    : "(Announcement Bar Hidden)"}
                </div>
              </div>

              {/* 2. Checkout Payment Preview */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider block">
                  Checkout Manual Payment Box (Live)
                </span>
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-sand space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-charcoal-900">
                      bKash / Nagad / Bank
                    </span>
                    <Badge variant="primary" className="text-[10px] py-0">
                      Verified
                    </Badge>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <p className="text-charcoal-700">
                      bKash / Nagad: <strong>{form.payment_bkash_number}</strong>
                    </p>
                    <p className="text-charcoal-700">
                      Bank: <strong>{form.bank_name}</strong> ({form.bank_account_name})
                    </p>
                  </div>
                  <p className="text-[10px] text-charcoal-500 italic border-t border-sand pt-1.5">
                    {form.payment_instructions_note}
                  </p>
                </div>
              </div>

              {/* 3. Footer Snapshot Preview */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider block">
                  Footer Brand Snapshot (Live)
                </span>
                <div className="p-3.5 rounded-2xl bg-[#0D3B37] text-sand space-y-2 text-xs">
                  {form.store_logo_url && (
                    <div className="bg-white/10 p-2 rounded-xl inline-block mb-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.store_logo_url}
                        alt="Logo Live Preview"
                        className="h-8 w-auto max-w-[140px] object-contain"
                      />
                    </div>
                  )}
                  <h4 className="font-black text-white font-bengali text-sm">
                    {form.store_name_bn} / {form.store_name}
                  </h4>
                  <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                    {form.tagline_bn || form.tagline}
                  </p>
                  <p className="text-[10px] text-gray-300 font-mono">
                    Helpline: {form.contact_primary} • {form.contact_email}
                  </p>
                </div>
              </div>
            </div>

            {/* Sticky Save Card */}
            <div className="p-5 rounded-3xl border border-emerald-900/30 bg-[#0D3B37] text-white shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-white">Save Configuration</h4>
                  <p className="text-[11px] text-emerald-200/80 mt-0.5">
                    {isDirty ? "Unsaved changes detected" : "All settings up-to-date"}
                  </p>
                </div>
                {isDirty && (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                )}
              </div>

              <Button
                type="button"
                onClick={saveSettings}
                disabled={saving}
                className="w-full bg-[#E0592A] hover:bg-[#c94b20] text-white font-extrabold text-xs py-2.5 rounded-xl shadow-md cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    <span>Synchronizing...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1.5" />
                    <span>Save All Settings (Ctrl+S)</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* BOTTOM FLOATING SAVE BAR (Triggers whenever form is dirty) */}
        {isDirty && (
          <div className="sticky bottom-6 z-40 p-4 rounded-3xl bg-[#0D3B37] text-white shadow-2xl border border-emerald-900/40 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Unsaved Settings Detected</p>
                <p className="text-[11px] text-emerald-200/80">
                  You have modified configuration parameters. Save to apply changes across the storefront.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                disabled={saving}
                className="text-white hover:bg-white/10 text-xs font-bold"
              >
                Discard
              </Button>

              <Button
                size="sm"
                onClick={saveSettings}
                disabled={saving}
                className="bg-[#E0592A] hover:bg-[#c94b20] text-white font-bold text-xs shadow-md"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                ) : (
                  <Save className="w-3.5 h-3.5 mr-1" />
                )}
                <span>Save All Changes</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutShell>
  );
}
