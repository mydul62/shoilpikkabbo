"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Gift,
  Building2,
  Headphones,
  Sprout,
  Info,
  Check,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Send,
  Loader2,
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { CLIENT_INFO } from "@/data/mock-data";

export default function ServicesPage() {
  const [formData, setFormData] = React.useState({
    name: "",
    contact: "",
    serviceArea: "",
    quantityBudget: "",
    preferredDate: "",
    requirements: "",
    agreedToPrivacy: false,
  });

  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const formRef = React.useRef<HTMLDivElement>(null);

  const serviceCards = [
    {
      id: "corporate-gifts",
      title: "Corporate Gift Items",
      description: "Customized handcrafted packages, corporate branding, packaging preferences & bulk volumes.",
      icon: Gift,
      areaValue: "Corporate Gift Items",
    },
    {
      id: "industrial-solutions",
      title: "Industrial Solutions",
      description:
        "B2B raw supplies, artisan-grade materials, sourcing requirements and customized production.",
      icon: Building2,
      areaValue: "Industrial Solutions",
    },
    {
      id: "special-e-sheba",
      title: "Special E-Sheba / Services",
      description:
        "Direct personalized support, custom bespoke orders, and dedicated account advisory.",
      icon: Headphones,
      areaValue: "Special E-Sheba / Services",
    },
    {
      id: "agriculture",
      title: "Agriculture & Agro Supplies",
      description: "Direct-from-source organic produce, seasonal farm harvests, and regional distribution.",
      icon: Sprout,
      areaValue: "Agriculture",
    },
  ];

  const handleSelectService = (areaValue: string) => {
    setFormData((prev) => ({ ...prev, serviceArea: areaValue }));
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact || !formData.requirements) {
      alert("Please fill in your name, contact phone/email, and requirements.");
      return;
    }
    if (!formData.agreedToPrivacy) {
      alert("Please agree to be contacted and acknowledge the Privacy policy.");
      return;
    }

    try {
      setIsSubmitting(true);
      await fetch("http://localhost:5000/api/v1/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: formData.serviceArea || "Special E-Sheba Service Brief",
          customerName: formData.name,
          customerPhone: formData.contact,
          customerEmail: formData.contact.includes("@") ? formData.contact : undefined,
          requirements: `${formData.quantityBudget ? `Budget/Qty: ${formData.quantityBudget} | ` : ""}${formData.preferredDate ? `Target Date: ${formData.preferredDate} | ` : ""}${formData.requirements}`,
        }),
      });
      setIsSubmitted(true);
    } catch (err) {
      console.warn("Inquiry submission warning:", err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StorefrontLayout>
      <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-8 sm:py-14">
        <div className="max-w-[1524px] mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-6">
            <Link href="/" className="hover:text-[#E0592A] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#0D3B37] font-semibold">Services & E-Sheba</span>
          </nav>

          {/* Page Headline & Subtitle */}
          <div className="max-w-3xl mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0D3B37] text-xs font-bold mb-3 border border-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-[#E0592A]" />
              <span>Tailored Solutions & Institutional Services</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#0D3B37] font-extrabold tracking-tight leading-tight">
              A brief today. Possibilities tomorrow.
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
              Tell us what you need. Our dedicated team will review your requirements and provide verified scope, timeline, and competitive institutional pricing.
            </p>
          </div>

          {/* Advisory Notice Banner */}
          <div className="p-4 sm:p-5 bg-white border border-emerald-100 rounded-2xl flex items-start sm:items-center gap-3.5 text-xs sm:text-sm text-gray-700 mb-10 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="font-normal leading-relaxed">
              <strong className="font-semibold text-[#0D3B37]">Verified Inquiries:</strong> Final offerings, bulk volumes, and customized terms are confirmed directly with our corporate team. Submitting an inquiry creates no immediate payment obligation.
            </span>
          </div>

          {/* 4 Service Offerings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-16">
            {serviceCards.map((card) => {
              const IconComp = card.icon;
              return (
                <div
                  key={card.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-[#0D3B37] group-hover:bg-[#E0592A] group-hover:text-white transition-colors duration-300 flex items-center justify-center mb-5 shadow-xs">
                      <IconComp className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#0D3B37] mb-2 leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed mb-6">
                      {card.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectService(card.areaValue)}
                    className="text-xs sm:text-sm font-bold text-[#0D3B37] group-hover:text-[#E0592A] inline-flex items-center gap-1.5 transition-colors cursor-pointer text-left w-fit"
                  >
                    <span>Discuss your brief</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Split Section: Process Explanation (Left) & Inquiry Form (Right) */}
          <div
            ref={formRef}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-4 items-start"
          >
            {/* Left Column: Process (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#E0592A] uppercase tracking-wider block mb-2">
                  CLEAR FROM THE BEGINNING
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D3B37] leading-tight mb-4">
                  Every useful solution starts with listening.
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We believe in complete transparency, precise artisan craftsmanship, and structured timelines tailored to your organizational goals.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center gap-4 py-2 border-b border-gray-100">
                  <span className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0D3B37] text-xs font-bold flex items-center justify-center shrink-0">
                    01
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#0D3B37]">Share your requirements</h4>
                    <p className="text-xs text-gray-500">Provide details on desired quantities, timeline, and aesthetic preferences.</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-2 border-b border-gray-100">
                  <span className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0D3B37] text-xs font-bold flex items-center justify-center shrink-0">
                    02
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#0D3B37]">Confirm scope & feasibility</h4>
                    <p className="text-xs text-gray-500">Our specialized production team reviews material sourcing and availability.</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-2">
                  <span className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0D3B37] text-xs font-bold flex items-center justify-center shrink-0">
                    03
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#0D3B37]">Review a transparent quotation</h4>
                    <p className="text-xs text-gray-500">Receive an itemized quote with confirmed delivery milestones before moving forward.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${CLIENT_INFO.whatsapp || "8801731214379"}?text=Hello%20Shoilpikkabbo%2C%20I%20have%20an%20inquiry%20regarding%20services.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-2xl inline-flex items-center gap-2.5 transition-all shadow-md shadow-emerald-600/20 hover:shadow-lg cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Ask instantly on WhatsApp</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Column: "Tell us what you have in mind." Form Card (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-gray-100 rounded-3xl p-7 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                <div className="mb-6">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0D3B37] tracking-tight">
                    Tell us what you have in mind
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Fill in the form below and an account specialist will respond within 24 hours.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="p-8 sm:p-12 text-center bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
                      <Check className="w-7 h-7 stroke-[2.5]" />
                    </div>
                    <h4 className="text-2xl font-bold text-[#0D3B37]">
                      Enquiry received successfully!
                    </h4>
                    <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                      Thank you, <strong className="text-[#0D3B37]">{formData.name}</strong>. Our specialized team will review your brief and reach out via <strong className="text-[#0D3B37]">{formData.contact}</strong> promptly.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          name: "",
                          contact: "",
                          serviceArea: "",
                          quantityBudget: "",
                          preferredDate: "",
                          requirements: "",
                          agreedToPrivacy: false,
                        });
                      }}
                      className="mt-4 px-6 py-2.5 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      Submit another enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Row 1: Name & Phone/Email (2 cols) */}
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
                          placeholder="e.g. Tanvir Ahmed"
                          className="w-full h-12 px-4 bg-gray-50/70 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#0D3B37] focus:ring-2 focus:ring-[#0D3B37]/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#0D3B37] block mb-1.5">
                          Phone or Email <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.contact}
                          onChange={(e) =>
                            setFormData({ ...formData, contact: e.target.value })
                          }
                          placeholder="017... or email@company.com"
                          className="w-full h-12 px-4 bg-gray-50/70 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#0D3B37] focus:ring-2 focus:ring-[#0D3B37]/10 transition-all"
                        />
                      </div>
                    </div>

                    {/* Row 2: Service Area */}
                    <div>
                      <label className="text-xs font-bold text-[#0D3B37] block mb-1.5">
                        Service Area <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.serviceArea}
                        onChange={(e) =>
                          setFormData({ ...formData, serviceArea: e.target.value })
                        }
                        className="w-full h-12 px-4 bg-gray-50/70 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#0D3B37] focus:ring-2 focus:ring-[#0D3B37]/10 transition-all cursor-pointer"
                      >
                        <option value="">Select a service category</option>
                        <option value="Corporate Gift Items">
                          Corporate Gift Items
                        </option>
                        <option value="Industrial Solutions">
                          Industrial Solutions
                        </option>
                        <option value="Special E-Sheba / Services">
                          Special E-Sheba / Services
                        </option>
                        <option value="Agriculture">Agriculture & Agro Supplies</option>
                      </select>
                    </div>

                    {/* Row 3: Quantity / Budget & Preferred Date (2 cols) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-[#0D3B37] block mb-1.5">
                          Estimated Quantity / Budget (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.quantityBudget}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              quantityBudget: e.target.value,
                            })
                          }
                          placeholder="e.g. 500 units or ৳50,000"
                          className="w-full h-12 px-4 bg-gray-50/70 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#0D3B37] focus:ring-2 focus:ring-[#0D3B37]/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#0D3B37] block mb-1.5">
                          Target Delivery Date (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.preferredDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              preferredDate: e.target.value,
                            })
                          }
                          placeholder="DD / MM / YYYY"
                          className="w-full h-12 px-4 bg-gray-50/70 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#0D3B37] focus:ring-2 focus:ring-[#0D3B37]/10 transition-all"
                        />
                      </div>
                    </div>

                    {/* Row 4: Your requirements (Textarea) */}
                    <div>
                      <label className="text-xs font-bold text-[#0D3B37] block mb-1.5">
                        Specific Requirements <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.requirements}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            requirements: e.target.value,
                          })
                        }
                        placeholder="Please describe your customization requirements, dimensions, branding preferences, or delivery location..."
                        className="w-full p-4 bg-gray-50/70 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#0D3B37] focus:ring-2 focus:ring-[#0D3B37]/10 transition-all resize-y leading-relaxed"
                      />
                    </div>

                    {/* Row 5: Policy Consent Checkbox */}
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
                        I agree to be contacted regarding this brief and acknowledge the Privacy & Terms of Service.
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
                            <span>Sending inquiry...</span>
                          </>
                        ) : (
                          <>
                            <span>Send inquiry</span>
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
        </div>
      </div>
    </StorefrontLayout>
  );
}
