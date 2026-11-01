"use client";

import * as React from "react";
import {
  CreditCard,
  ShieldCheck,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  Smartphone,
  Building2,
  Truck,
  HelpCircle,
  Sliders,
  AlertTriangle,
} from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { settingsApi } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";

interface AlertToastState {
  type: "success" | "error" | "warning";
  title: string;
  message: string;
}

export default function AdminPaymentSetupPage() {
  const { settings, refreshSettings, updateSettings } = useSettings();

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  // Form State for Payment Settings
  const [form, setForm] = React.useState({
    // SSLCommerz
    sslcommerz_enabled: "true",
    sslcommerz_is_sandbox: "true",
    sslcommerz_store_id: "testbox",
    sslcommerz_store_pass: "qwerty",

    // Cash on Delivery
    cod_enabled: "true",
    cod_note: "পণ্য হাতে পেয়ে দেখে ডেলিভারিম্যানকে ক্যাশ টাকা পরিশোধ করুন।",

    // Manual Mobile Banking & Accounts
    payment_bkash_number: "01977765999",
    payment_nagad_number: "01977765999",
    payment_instructions_note: "টাকা পাঠিয়ে আপনার TrxID সংরক্ষণ করুন এবং কল দিলে জানান।",

    // Bank
    bank_name: "BRAC Bank PLC",
    bank_account_name: "SHOILPIKKABBO",
    bank_account_number: "1501204892001",
    bank_branch: "Gulshan Corporate Branch, Dhaka",
  });

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

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await settingsApi.getAll();
      if (res.success && res.data) {
        const d = res.data as Record<string, string>;
        setForm({
          sslcommerz_enabled: d["sslcommerz_enabled"] !== undefined ? d["sslcommerz_enabled"] : "true",
          sslcommerz_is_sandbox: d["sslcommerz_is_sandbox"] !== undefined ? d["sslcommerz_is_sandbox"] : "true",
          sslcommerz_store_id: d["sslcommerz_store_id"] || "testbox",
          sslcommerz_store_pass: d["sslcommerz_store_pass"] || "qwerty",
          cod_enabled: d["cod_enabled"] !== undefined ? d["cod_enabled"] : "true",
          cod_note: d["cod_note"] || "পণ্য হাতে পেয়ে দেখে ডেলিভারিম্যানকে ক্যাশ টাকা পরিশোধ করুন।",
          payment_bkash_number: d["payment_bkash_number"] || "01977765999",
          payment_nagad_number: d["payment_nagad_number"] || "01977765999",
          payment_instructions_note:
            d["payment_instructions_note"] ||
            "টাকা পাঠিয়ে আপনার TrxID সংরক্ষণ করুন এবং কল দিলে জানান।",
          bank_name: d["bank_name"] || "BRAC Bank PLC",
          bank_account_name: d["bank_account_name"] || "SHOILPIKKABBO",
          bank_account_number: d["bank_account_number"] || "1501204892001",
          bank_branch: d["bank_branch"] || "Gulshan Corporate Branch, Dhaka",
        });
      }
    } catch (err) {
      console.warn("Failed to load settings:", err);
      showAlert("error", "Error", "Failed to load payment settings from server.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await updateSettings(form);
      if (result.success) {
        showAlert("success", "Settings Saved", "Payment setup and gateway credentials updated successfully.");
        await refreshSettings();
      } else {
        showAlert("error", "Save Failed", result.message || "Failed to update payment settings.");
      }
    } catch (err: any) {
      showAlert("error", "Error", err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const isLive = form.sslcommerz_is_sandbox === "false";
  const isSslEnabled = form.sslcommerz_enabled === "true";
  const isCodEnabled = form.cod_enabled === "true";

  // Base URL for callback preview
  const backendBaseUrl =
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : (process.env.NEXT_PUBLIC_BACKEND_URL || "https://shoilpikkabbo-backend.vercel.app");

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

      <form onSubmit={handleSave} className="w-full max-w-[1720px] mx-auto space-y-6">
        {/* HEADER BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-brand-border shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-forest-800/10 text-forest-900 font-extrabold text-[11px] uppercase tracking-wider">
                Payment Gateway Studio
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-charcoal-500">Live PostgreSQL Sync</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 font-heading mt-1">
              Payment Setup & Gateway Configuration
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-0.5">
              Manage SSLCommerz merchant credentials, sandbox/live modes, Cash on Delivery, and manual receiving accounts.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={loadSettings}
              disabled={loading || saving}
              className="border-brand-border text-charcoal-700 hover:bg-sand rounded-2xl text-xs font-bold"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin text-forest-800" : ""}`} />
              Reload
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={saving}
              className="bg-[#0D3B37] hover:bg-forest-900 text-white rounded-2xl font-bold text-xs shadow-md"
            >
              {saving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  Save Payment Setup
                </>
              )}
            </Button>
          </div>
        </div>

        {/* STATUS HERO BANNER */}
        <div className="bg-[#0D3B37] text-white rounded-3xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shadow-[0_4px_20px_rgba(13,59,55,0.12)]">
          <div>
            <span className="text-[11px] text-white/70 uppercase tracking-wider block mb-1 font-semibold">
              SSLCOMMERZ GATEWAY
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${isSslEnabled ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`}
              />
              <span className="text-lg font-black tracking-tight text-white">
                {isSslEnabled ? "Active & Ready" : "Disabled"}
              </span>
            </div>
            <p className="text-[11px] text-white/60 mt-1">bKash, Nagad, Rocket & Cards</p>
          </div>

          <div>
            <span className="text-[11px] text-white/70 uppercase tracking-wider block mb-1 font-semibold">
              GATEWAY ENVIRONMENT
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  isLive ? "bg-emerald-500 text-white" : "bg-amber-400 text-charcoal-900"
                }`}
              >
                {isLive ? "Live Production" : "Sandbox Test Mode"}
              </span>
            </div>
            <p className="text-[11px] text-white/60 mt-1">
              {isLive ? "Real transactions active" : "Testing with dummy accounts"}
            </p>
          </div>

          <div>
            <span className="text-[11px] text-white/70 uppercase tracking-wider block mb-1 font-semibold">
              CASH ON DELIVERY (COD)
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${isCodEnabled ? "bg-emerald-400" : "bg-rose-400"}`}
              />
              <span className="text-lg font-black tracking-tight text-white">
                {isCodEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
            <p className="text-[11px] text-white/60 mt-1">Doorstep cash payment</p>
          </div>

          <div>
            <span className="text-[11px] text-white/70 uppercase tracking-wider block mb-1 font-semibold">
              ACTIVE STORE ID
            </span>
            <span className="text-base font-mono font-bold text-amber-300 block truncate">
              {form.sslcommerz_store_id || "Not Configured"}
            </span>
            <p className="text-[11px] text-white/60 mt-1">SSLCommerz merchant credential</p>
          </div>
        </div>

        {/* 12-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT 8 COLUMNS: SSLCOMMERZ & COD SETUP */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. SSLCOMMERZ GATEWAY CARD */}
            <div className="p-6 rounded-3xl border border-brand-border bg-white shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-sand pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#0D3B37] flex items-center justify-center font-bold">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-base text-charcoal-900">
                      1. SSLCommerz Payment Gateway Configuration
                    </h2>
                    <p className="text-xs text-charcoal-500">
                      Direct integration with bKash, Nagad, Rocket, Upay, Visa, Mastercard, and Bangladeshi banking.
                    </p>
                  </div>
                </div>
                <Badge variant={isSslEnabled ? "success" : "outline"} className="text-[11px] font-bold">
                  {isSslEnabled ? "Online Active" : "Offline"}
                </Badge>
              </div>

              {/* Status Toggle & Environment Switch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Gateway Enable/Disable */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-sand space-y-2">
                  <label className="text-xs font-extrabold text-charcoal-800 block">
                    Gateway Status
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sslcommerz_enabled"
                        checked={form.sslcommerz_enabled === "true"}
                        onChange={() => setForm({ ...form, sslcommerz_enabled: "true" })}
                        className="w-4 h-4 text-[#0D3B37] accent-[#0D3B37]"
                      />
                      <span className="text-xs font-bold text-emerald-800">Enabled (সক্রিয়)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sslcommerz_enabled"
                        checked={form.sslcommerz_enabled === "false"}
                        onChange={() => setForm({ ...form, sslcommerz_enabled: "false" })}
                        className="w-4 h-4 text-rose-600 accent-rose-600"
                      />
                      <span className="text-xs font-bold text-rose-700">Disabled (নিষ্ক্রিয়)</span>
                    </label>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    বন্ধ রাখলে চেকআউটে অনলাইন পেমেন্ট অপশনটি দেখানো হবে না।
                  </p>
                </div>

                {/* Sandbox vs Live */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-sand space-y-2">
                  <label className="text-xs font-extrabold text-charcoal-800 block">
                    Operation Mode
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sslcommerz_is_sandbox"
                        checked={form.sslcommerz_is_sandbox === "true"}
                        onChange={() => setForm({ ...form, sslcommerz_is_sandbox: "true" })}
                        className="w-4 h-4 text-amber-600 accent-amber-600"
                      />
                      <span className="text-xs font-bold text-amber-800">Sandbox (Test Mode)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sslcommerz_is_sandbox"
                        checked={form.sslcommerz_is_sandbox === "false"}
                        onChange={() => setForm({ ...form, sslcommerz_is_sandbox: "false" })}
                        className="w-4 h-4 text-emerald-700 accent-emerald-700"
                      />
                      <span className="text-xs font-bold text-emerald-800">Live (Production)</span>
                    </label>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {isLive
                      ? "সতর্কতা: লাইভ মোডে আসল ব্যাংকিং লেনদেন সম্পন্ন হবে।"
                      : "স্যান্ডবক্স মোডে টেস্ট আইডি দিয়ে সম্পূর্ণ নিরাপদ লেনদেন পরীক্ষা করা যায়।"}
                  </p>
                </div>
              </div>

              {/* Store Credentials */}
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-charcoal-800 flex items-center justify-between">
                      <span>SSLCommerz Store ID *</span>
                      <span className="text-[10px] text-gray-400 font-normal">Provided by SSLCommerz</span>
                    </label>
                    <Input
                      type="text"
                      value={form.sslcommerz_store_id}
                      onChange={(e) => setForm({ ...form, sslcommerz_store_id: e.target.value.trim() })}
                      className="h-10 text-xs font-mono bg-white"
                      placeholder="e.g. testbox or your_store_id"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-charcoal-800 flex items-center justify-between">
                      <span>SSLCommerz Store Password *</span>
                      <span className="text-[10px] text-gray-400 font-normal">Encrypted secret</span>
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={form.sslcommerz_store_pass}
                        onChange={(e) => setForm({ ...form, sslcommerz_store_pass: e.target.value.trim() })}
                        className="h-10 text-xs font-mono bg-white pr-10"
                        placeholder="••••••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                  <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 leading-relaxed">
                    <p className="font-bold">মার্চেন্ট ক্রেডেনশিয়াল কীভাবে পাবেন?</p>
                    <p className="text-[11px] text-amber-800">
                      SSLCommerz অ্যাকাউন্ট অ্যাক্টিভ হলে তাদের টিম ইমেইলের মাধ্যমে আপনার অফিসিয়াল <strong>Store ID</strong> এবং <strong>Store Password</strong> পাঠাবে। তা এখানে বসিয়ে মোড &quot;Live (Production)&quot; করে দিলেই আপনার ওয়েবসাইট স্বয়ংক্রিয়ভাবে আসল পেমেন্ট গ্রহণ শুরু করবে।
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. CASH ON DELIVERY (COD) CARD */}
            <div className="p-6 rounded-3xl border border-brand-border bg-white shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-sand pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-base text-charcoal-900">
                      2. Cash on Delivery (COD) Settings
                    </h2>
                    <p className="text-xs text-charcoal-500">
                      Doorstep cash payments collected by courier delivery personnel.
                    </p>
                  </div>
                </div>
                <Badge variant={isCodEnabled ? "warning" : "outline"} className="text-[11px] font-bold">
                  {isCodEnabled ? "COD Active" : "COD Disabled"}
                </Badge>
              </div>

              <div className="space-y-4">
                {/* COD Toggle */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-sand flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-charcoal-900">
                      ক্যাশ অন ডেলিভারি সুবিধা সক্রিয় রাখুন
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      অনুমোদন দিলে ক্রেতারা ডেলিভারির সময় পণ্য হাতে পেয়ে মূল্য পরিশোধ করতে পারবে।
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="cod_enabled"
                        checked={form.cod_enabled === "true"}
                        onChange={() => setForm({ ...form, cod_enabled: "true" })}
                        className="w-4 h-4 text-[#0D3B37] accent-[#0D3B37]"
                      />
                      <span className="text-xs font-bold text-emerald-800">চালু</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="cod_enabled"
                        checked={form.cod_enabled === "false"}
                        onChange={() => setForm({ ...form, cod_enabled: "false" })}
                        className="w-4 h-4 text-rose-600 accent-rose-600"
                      />
                      <span className="text-xs font-bold text-rose-700">বন্ধ</span>
                    </label>
                  </div>
                </div>

                {/* COD Custom Notice */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal-800">
                    ক্যাশ অন ডেলিভারি নির্দেশিকা / নোটিশ
                  </label>
                  <Input
                    value={form.cod_note}
                    onChange={(e) => setForm({ ...form, cod_note: e.target.value })}
                    className="h-10 text-xs bg-white font-bengali"
                    placeholder="পণ্য হাতে পেয়ে দেখে ডেলিভারিম্যানকে ক্যাশ টাকা পরিশোধ করুন।"
                  />
                  <p className="text-[11px] text-gray-400">
                    চেকআউট পেজে ক্যাশ অন ডেলিভারি সিলেক্ট করার সময় ক্রেতাদের এই বার্তাটি দেখানো হবে।
                  </p>
                </div>
              </div>
            </div>

            {/* 3. MANUAL MOBILE BANKING & SETTLEMENT ACCOUNTS */}
            <div className="p-6 rounded-3xl border border-brand-border bg-white shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-sand pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-base text-charcoal-900">
                      3. Manual Receiving Numbers & Corporate Bank Details
                    </h2>
                    <p className="text-xs text-charcoal-500">
                      Fallback accounts shown to corporate customers or buyers who prefer direct transfers.
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
                    <span className="text-[10px] text-pink-700 font-bold">Manual Wallet</span>
                  </div>
                  <Input
                    value={form.payment_bkash_number}
                    onChange={(e) => setForm({ ...form, payment_bkash_number: e.target.value })}
                    className="h-10 text-xs font-mono bg-white"
                    placeholder="01977765999"
                  />
                </div>

                <div className="space-y-1 p-3.5 rounded-2xl bg-orange-50/40 border border-orange-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-orange-900 flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-orange-600" />
                      <span>Official Nagad Number</span>
                    </label>
                    <span className="text-[10px] text-orange-700 font-bold">Manual Wallet</span>
                  </div>
                  <Input
                    value={form.payment_nagad_number}
                    onChange={(e) => setForm({ ...form, payment_nagad_number: e.target.value })}
                    className="h-10 text-xs font-mono bg-white"
                    placeholder="01977765999"
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
                      placeholder="e.g. BRAC Bank PLC"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-charcoal-800">Account Name</label>
                    <Input
                      value={form.bank_account_name}
                      onChange={(e) => setForm({ ...form, bank_account_name: e.target.value })}
                      className="h-10 text-xs bg-white"
                      placeholder="e.g. SHOILPIKKABBO"
                    />
                  </div>
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
                    <label className="text-xs font-bold text-charcoal-800">Branch Name</label>
                    <Input
                      value={form.bank_branch}
                      onChange={(e) => setForm({ ...form, bank_branch: e.target.value })}
                      className="h-10 text-xs bg-white"
                      placeholder="e.g. Gulshan Corporate Branch"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 4 COLUMNS: INTEGRATION URLS REFERENCE & HELPER GUIDE */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            {/* Quick Action Box */}
            <div className="p-6 rounded-3xl border border-brand-border bg-white shadow-xs space-y-4">
              <h3 className="font-heading font-extrabold text-sm text-charcoal-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#0D3B37]" />
                <span>Quick Actions</span>
              </h3>
              <p className="text-xs text-gray-500">
                পরিবর্তন করার পর নিচে সংরক্ষণ করুন। সাথে সাথে ডাটাবেজে আপডেট হয়ে লাইভ হয়ে যাবে।
              </p>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={saving}
                className="w-full bg-[#0D3B37] hover:bg-forest-900 text-white rounded-xl font-bold text-xs py-3"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5 mr-1.5" />
                    Save All Changes
                  </>
                )}
              </Button>
            </div>

            {/* SSLCOMMERZ WEBHOOK & CALLBACK URLS BOX */}
            <div className="p-6 rounded-3xl border border-brand-border bg-white shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-sand pb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <h3 className="font-heading font-extrabold text-xs text-charcoal-900 uppercase tracking-wider">
                  SSLCommerz Merchant Callbacks
                </h3>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                SSLCommerz পোর্টালে আপনার মার্চেন্ট একাউন্টে এই URL গুলো সেট করতে পারেন:
              </p>

              <div className="space-y-3">
                {/* Success URL */}
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-sand space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase">Success Callback</span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(`${backendBaseUrl}/api/v1/payments/sslcommerz/success`, "success_url")
                      }
                      className="text-gray-400 hover:text-charcoal-800 transition-colors"
                      title="Copy URL"
                    >
                      {copiedKey === "success_url" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] font-mono text-gray-700 truncate">
                    {backendBaseUrl}/api/v1/payments/sslcommerz/success
                  </p>
                </div>

                {/* Fail URL */}
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-sand space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-800 uppercase">Fail Callback</span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(`${backendBaseUrl}/api/v1/payments/sslcommerz/fail`, "fail_url")
                      }
                      className="text-gray-400 hover:text-charcoal-800 transition-colors"
                      title="Copy URL"
                    >
                      {copiedKey === "fail_url" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] font-mono text-gray-700 truncate">
                    {backendBaseUrl}/api/v1/payments/sslcommerz/fail
                  </p>
                </div>

                {/* Cancel URL */}
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-sand space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-800 uppercase">Cancel Callback</span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(`${backendBaseUrl}/api/v1/payments/sslcommerz/cancel`, "cancel_url")
                      }
                      className="text-gray-400 hover:text-charcoal-800 transition-colors"
                      title="Copy URL"
                    >
                      {copiedKey === "cancel_url" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] font-mono text-gray-700 truncate">
                    {backendBaseUrl}/api/v1/payments/sslcommerz/cancel
                  </p>
                </div>

                {/* IPN Webhook URL */}
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-sand space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-800 uppercase">IPN Webhook (Instant Notification)</span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(`${backendBaseUrl}/api/v1/payments/sslcommerz/ipn`, "ipn_url")
                      }
                      className="text-gray-400 hover:text-charcoal-800 transition-colors"
                      title="Copy URL"
                    >
                      {copiedKey === "ipn_url" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] font-mono text-gray-700 truncate">
                    {backendBaseUrl}/api/v1/payments/sslcommerz/ipn
                  </p>
                </div>
              </div>
            </div>

            {/* SECURITY & COMPLIANCE BADGE */}
            <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-charcoal-700 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#0D3B37]">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>নিরাপত্তা নিশ্চয়তা</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                SSLCommerz আন্তর্জাতিক PCI-DSS কমপ্লায়েন্ট এবং বাংলাদেশ ব্যাংক দ্বারা অনুমোদিত। কোনো কাস্টমার কার্ড বা পিন ডাটাবেজে সংরক্ষিত হয় না।
              </p>
            </div>
          </div>
        </div>
      </form>
    </AdminLayoutShell>
  );
}
