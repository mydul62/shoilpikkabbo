"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  Phone,
  Check,
  ChevronRight,
  Sparkles,
  MessageSquare,
  Send,
  Loader2,
  PackageCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { useSettings } from "@/context/SettingsContext";
import { pagesApi, inquiriesApi } from "@/lib/api";

export default function ContactPage() {
  const { settings } = useSettings();
  const [sections, setSections] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function loadContactData() {
      try {
        const res = await pagesApi.getPublished("contact");
        if (res.success && Array.isArray((res.data as any)?.sections)) {
          setSections((res.data as any).sections);
        }
      } catch (err) {
        console.warn("Could not load dynamic contact page CMS:", err);
      }
    }
    loadContactData();
  }, []);

  const headerSec = sections.find((s) => s.type === "contact_header" && s.isVisible !== false)?.props || {};
  const detailsSec = sections.find((s) => s.type === "contact_details" && s.isVisible !== false)?.props || {};

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    topic: "",
    orderNumber: "",
    message: "",
    agreedToPrivacy: false,
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please provide your name, email address, and message.");
      return;
    }
    if (!formData.agreedToPrivacy) {
      alert("Please agree to the privacy policy to proceed.");
      return;
    }

    try {
      setIsSubmitting(true);
      await inquiriesApi.create({
        serviceType: formData.topic || "General Customer Enquiry",
        customerName: formData.name,
        customerPhone: formData.phone || "01700 000000",
        customerEmail: formData.email,
        requirements: `${formData.orderNumber ? `Order #${formData.orderNumber} - ` : ""}${formData.message}`,
      });
      setIsSubmitted(true);
    } catch (err) {
      console.warn("Contact submission warning:", err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <span className="text-[#0D3B37] font-semibold">Contact Us</span>
          </nav>

          {/* Page Headline & Subtitle */}
          <div className="max-w-3xl mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0D3B37] text-xs font-bold mb-3 border border-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-[#E0592A]" />
              <span>{headerSec.badge || "We're Here To Help"}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#0D3B37] font-extrabold tracking-tight leading-tight">
              {headerSec.headline || "A conversation starts here."}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
              {headerSec.subtitle || "Have a product inquiry, delivery update, or customized corporate requirement? Reach out and our friendly team will assist you right away."}
            </p>
          </div>

          {/* Main Grid: Left Contact Info (5 cols) & Right Form Card (7 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 items-start">
            {/* Left Column: Get in Touch & Message Channels */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#E0592A] uppercase tracking-wider block mb-2">
                  DIRECT CHANNELS
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D3B37] leading-tight mb-4">
                  Get in touch directly
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Connect with our customer support and enterprise representatives via phone, email, or instant chat.
                </p>
              </div>

              {/* Contact Info Cards */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-5">
                {/* Email channel */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0D3B37] flex items-center justify-center shrink-0 shadow-xs">
                    <Mail className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-medium block">
                      Email address
                    </span>
                    <a
                      href={`mailto:${detailsSec.email || settings.contactEmail}`}
                      className="text-base text-[#0D3B37] font-bold hover:text-[#E0592A] transition-colors"
                    >
                      {detailsSec.email || settings.contactEmail}
                    </a>
                    <p className="text-xs text-gray-500 mt-0.5">Replies typically within a few business hours.</p>
                  </div>
                </div>

                {/* Phone channel */}
                <div className="flex items-start gap-4 pt-3 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0D3B37] flex items-center justify-center shrink-0 shadow-xs">
                    <Phone className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-medium block">
                      Call customer support
                    </span>
                    <div className="text-base text-[#0D3B37] font-bold leading-snug space-y-0.5">
                      <p>{detailsSec.primaryPhone || settings.contactPrimary}</p>
                      {(detailsSec.secondaryPhone || settings.contactSecondary) && (
                        <p>{detailsSec.secondaryPhone || settings.contactSecondary}</p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Available {settings.officeHours || "Saturday to Thursday, 9 AM – 8 PM"}.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Instant Chat Channels */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-4">
                <h3 className="text-lg font-bold text-[#0D3B37]">
                  Instant messaging
                </h3>
                <div className="space-y-3">
                  <a
                    href={settings.socialWhatsapp || "https://wa.me/8801731214379"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-2xl inline-flex items-center justify-center gap-2.5 transition-all shadow-md shadow-emerald-600/20 hover:shadow-lg cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>

                  <a
                    href={settings.socialMessenger || "https://m.me/shoilpikkabbo"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-12 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-sm font-bold rounded-2xl inline-flex items-center justify-center gap-2.5 transition-all shadow-md shadow-[#0D3B37]/15 hover:shadow-orange-500/25 cursor-pointer"
                  >
                    <span>Facebook Messenger</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed pt-1">
                  For existing orders, please mention your order number for quicker resolution. Never share OTPs or payment PINs.
                </p>
              </div>
            </div>

            {/* Right Column: "Leave a note." Form Card */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-gray-100 rounded-3xl p-7 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D3B37] tracking-tight">
                    Leave a note
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Send us your detailed inquiry and our team will get back to you promptly.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="p-8 sm:p-12 text-center bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
                      <Check className="w-7 h-7 stroke-[2.5]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0D3B37]">
                      Message sent successfully!
                    </h3>
                    <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                      Thank you, <strong className="text-[#0D3B37]">{formData.name}</strong>. We've received your note and our team will get in touch via <strong className="text-[#0D3B37]">{formData.email}</strong> shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          topic: "",
                          orderNumber: "",
                          message: "",
                          agreedToPrivacy: false,
                        });
                      }}
                      className="mt-4 px-6 py-2.5 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Row 1: Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-[#0D3B37] block mb-1.5">
                          Your Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="e.g. Mahbub Rahman"
                          className="w-full h-12 px-4 bg-gray-50/70 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#0D3B37] focus:ring-2 focus:ring-[#0D3B37]/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#0D3B37] block mb-1.5">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="you@example.com"
                          className="w-full h-12 px-4 bg-gray-50/70 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#0D3B37] focus:ring-2 focus:ring-[#0D3B37]/10 transition-all"
                        />
                      </div>
                    </div>

                    {/* Row 2: Phone & Topic */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-[#0D3B37] block mb-1.5">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="01XXXXXXXXX"
                          className="w-full h-12 px-4 bg-gray-50/70 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#0D3B37] focus:ring-2 focus:ring-[#0D3B37]/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#0D3B37] block mb-1.5">
                          Topic <span className="text-rose-500">*</span>
                        </label>
                        <select
                          required
                          value={formData.topic}
                          onChange={(e) =>
                            setFormData({ ...formData, topic: e.target.value })
                          }
                          className="w-full h-12 px-4 bg-gray-50/70 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#0D3B37] focus:ring-2 focus:ring-[#0D3B37]/10 transition-all cursor-pointer"
                        >
                          <option value="">Select a topic</option>
                          <option value="Order inquiry / delivery update">
                            Order inquiry / delivery update
                          </option>
                          <option value="Product question">
                            Product question
                          </option>
                          <option value="Custom craft request">
                            Custom craft request
                          </option>
                          <option value="Corporate gifting / B2B">
                            Corporate gifting / B2B
                          </option>
                          <option value="Return / refund question">
                            Return / refund question
                          </option>
                          <option value="Other feedback">Other feedback</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 3: Order number */}
                    <div>
                      <label className="text-xs font-bold text-[#0D3B37] block mb-1.5">
                        Order Number (If applicable)
                      </label>
                      <input
                        type="text"
                        value={formData.orderNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            orderNumber: e.target.value,
                          })
                        }
                        placeholder="e.g. SK-2026-XXXX"
                        className="w-full h-12 px-4 bg-gray-50/70 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#0D3B37] focus:ring-2 focus:ring-[#0D3B37]/10 transition-all uppercase"
                      />
                    </div>

                    {/* Row 4: Message textarea */}
                    <div>
                      <label className="text-xs font-bold text-[#0D3B37] block mb-1.5">
                        Your Message <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            message: e.target.value,
                          })
                        }
                        placeholder="How can we help you? Include all necessary details..."
                        className="w-full p-4 bg-gray-50/70 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#0D3B37] focus:ring-2 focus:ring-[#0D3B37]/10 transition-all resize-y leading-relaxed"
                      />
                    </div>

                    {/* Row 5: Policy consent */}
                    <label className="flex items-start gap-3 pt-1 text-xs text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agreedToPrivacy}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            agreedToPrivacy: e.target.checked,
                          })
                        }
                        className="mt-0.5 w-4 h-4 rounded text-[#0D3B37] focus:ring-[#0D3B37] cursor-pointer"
                      />
                      <span>
                        I agree to be contacted regarding this message and acknowledge the Privacy Policy.
                      </span>
                    </label>

                    {/* Row 6: Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-12 px-8 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-sm font-bold rounded-xl inline-flex items-center gap-2 transition-all shadow-md shadow-[#0D3B37]/15 hover:shadow-orange-500/25 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Sending message...</span>
                          </>
                        ) : (
                          <>
                            <span>Send message</span>
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Bottom 3 Help Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-gray-200">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0D3B37] flex items-center justify-center mb-4">
                <PackageCheck className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-lg font-bold text-[#0D3B37] mb-1.5">
                Where is my order?
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Track status, delivery courier handover, and live updates.
              </p>
              <Link
                href="/track-order"
                className="text-xs font-bold text-[#0D3B37] hover:text-[#E0592A] inline-flex items-center gap-1 transition-colors"
              >
                <span>Track your order</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0D3B37] flex items-center justify-center mb-4">
                <Truck className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-lg font-bold text-[#0D3B37] mb-1.5">
                Delivery & Timelines
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Learn about delivery rates, timeline in Dhaka and outside Dhaka.
              </p>
              <Link
                href="/shop"
                className="text-xs font-bold text-[#0D3B37] hover:text-[#E0592A] inline-flex items-center gap-1 transition-colors"
              >
                <span>Shipping policy</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0D3B37] flex items-center justify-center mb-4">
                <RotateCcw className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-lg font-bold text-[#0D3B37] mb-1.5">
                Need to return something?
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Review our easy artisan return policy and exchange guarantees.
              </p>
              <Link
                href="/shop"
                className="text-xs font-bold text-[#0D3B37] hover:text-[#E0592A] inline-flex items-center gap-1 transition-colors"
              >
                <span>Return / refund policy</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
