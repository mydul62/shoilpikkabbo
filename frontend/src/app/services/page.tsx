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
      description: "Occasion, quantity, budget and packaging preferences.",
      icon: Gift,
      areaValue: "Corporate Gift Items",
    },
    {
      id: "industrial-solutions",
      title: "Industrial Solutions",
      description:
        "Product specifications, sourcing requirements and intended use.",
      icon: Building2,
      areaValue: "Industrial Solutions",
    },
    {
      id: "special-e-sheba",
      title: "Special E-Sheba / Services",
      description:
        "The assistance you need and your preferred way to be contacted.",
      icon: Headphones,
      areaValue: "Special E-Sheba / Services",
    },
    {
      id: "agriculture",
      title: "Agriculture",
      description: "Product or supply needs, quantities and delivery area.",
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
      <div className="bg-[#F7F4EE] min-h-[calc(100vh-280px)] py-10 sm:py-16">
        <div className="max-w-[1524px] mx-auto px-5">
          {/* Breadcrumb */}
          <nav className="text-[12px] text-[#7A837C] font-light mb-4">
            <Link href="/" className="hover:text-[#143527] transition-colors">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-[#143527]">Services</span>
          </nav>

          {/* Page Headline & Subtitle */}
          <h1 className="font-serif text-3xl sm:text-[42px] text-[#143527] font-normal tracking-tight leading-tight">
            A brief today. Possibilities tomorrow.
          </h1>
          <p className="text-[13.5px] sm:text-[14px] text-[#556059] font-light mt-2 mb-8">
            Tell us what you need. We'll review the request before confirming scope,
            availability or pricing.
          </p>

          {/* Advisory Notice Banner */}
          <div className="p-4 bg-[#EFECE6] border border-[#E5DFD3] rounded-[4px] flex items-center gap-3 text-[12px] text-[#556059] mb-10 font-light">
            <Info className="w-4 h-4 text-[#143527] shrink-0" />
            <span>
              Proposed service areas · Final offerings and service terms are awaiting
              client confirmation. An enquiry is not a booking.
            </span>
          </div>

          {/* 4 Service Offerings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {serviceCards.map((card) => {
              const IconComp = card.icon;
              return (
                <div
                  key={card.id}
                  className="bg-white border border-[#E8E2D8] rounded-[4px] p-6 flex flex-col justify-between shadow-xs transition-shadow hover:shadow-sm"
                >
                  <div>
                    <div className="w-8 h-8 rounded-[3px] flex items-center justify-center text-[#143527] mb-4">
                      <IconComp className="w-6 h-6 stroke-[1.6]" />
                    </div>
                    <h3 className="font-serif text-[18px] text-[#143527] font-normal mb-2 leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-[12px] text-[#6F7771] font-light leading-relaxed mb-6">
                      {card.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectService(card.areaValue)}
                    className="text-[12px] font-medium text-[#143527] hover:text-[#B85D38] inline-flex items-center gap-1 transition-colors cursor-pointer text-left w-fit"
                  >
                    <span>Discuss your brief</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Split Section: Process Explanation (Left) & Inquiry Form (Right) */}
          <div
            ref={formRef}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pt-4"
          >
            {/* Left Column: Process (5 cols) */}
            <div className="lg:col-span-5">
              <span className="text-[10px] font-semibold text-[#B85D38] uppercase tracking-widest block mb-2.5">
                CLEAR FROM THE BEGINNING
              </span>
              <h2 className="font-serif text-2xl sm:text-[34px] text-[#143527] font-normal leading-snug mb-8">
                Every useful solution starts with listening.
              </h2>

              <div className="space-y-4 text-[13px] text-[#333E35] font-light">
                <div className="flex items-baseline gap-3 py-2 border-b border-[#F0EBE1]">
                  <span className="font-serif text-[15px] text-[#8C948E]">01</span>
                  <span>Share your requirements</span>
                </div>
                <div className="flex items-baseline gap-3 py-2 border-b border-[#F0EBE1]">
                  <span className="font-serif text-[15px] text-[#8C948E]">02</span>
                  <span>Confirm scope and availability</span>
                </div>
                <div className="flex items-baseline gap-3 py-2 border-b border-[#F0EBE1]">
                  <span className="font-serif text-[15px] text-[#8C948E]">03</span>
                  <span>Review a written quote</span>
                </div>
              </div>

              <p className="text-[11.5px] text-[#8C948E] font-light mt-4 mb-6 leading-relaxed">
                No payment is requested before scope and terms are agreed.
              </p>

              <div>
                <a
                  href={`https://wa.me/${CLIENT_INFO.whatsapp || "8801731214379"}?text=Hello%20Shoilpikkabbo%2C%20I%20have%20an%20inquiry%20regarding%20services.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-5 bg-white hover:bg-[#F3EFE7] border border-[#D5CDC0] text-[#143527] text-[13px] font-medium rounded-[3px] inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <span>Ask on WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right Column: "Tell us what you have in mind." Form Card (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-[#E8E2D8] rounded-xl p-6 sm:p-8 shadow-xs">
                <h3 className="font-serif text-[22px] sm:text-[24px] text-[#143527] font-normal mb-6">
                  Tell us what you have in mind.
                </h3>

                {isSubmitted ? (
                  <div className="p-8 text-center bg-[#F7F4EE] rounded-[4px] border border-[#E8E2D8] space-y-3">
                    <div className="w-10 h-10 rounded-full bg-[#E5ECE7] text-[#143527] flex items-center justify-center mx-auto">
                      <Check className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <h4 className="font-serif text-[20px] text-[#143527] font-normal">
                      Enquiry received.
                    </h4>
                    <p className="text-[12.5px] text-[#556059] font-light max-w-sm mx-auto leading-relaxed">
                      Thank you, {formData.name}. Our specialized team will review
                      your brief and reach out via {formData.contact} shortly.
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
                      className="mt-4 text-[12px] font-medium text-[#143527] underline hover:text-[#B85D38] cursor-pointer"
                    >
                      Submit another enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Row 1: Name & Phone/Email (2 cols) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[12px] font-medium text-[#143527] block mb-1.5">
                          Your name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Full name"
                          className="w-full h-11 px-3.5 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[12px] font-medium text-[#143527] block mb-1.5">
                          Phone or email *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.contact}
                          onChange={(e) =>
                            setFormData({ ...formData, contact: e.target.value })
                          }
                          placeholder="How we can reach you"
                          className="w-full h-11 px-3.5 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Row 2: Service Area */}
                    <div>
                      <label className="text-[12px] font-medium text-[#143527] block mb-1.5">
                        Service area *
                      </label>
                      <select
                        required
                        value={formData.serviceArea}
                        onChange={(e) =>
                          setFormData({ ...formData, serviceArea: e.target.value })
                        }
                        className="w-full h-11 px-3.5 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">Choose an area ⌄</option>
                        <option value="Corporate Gift Items">
                          Corporate Gift Items
                        </option>
                        <option value="Industrial Solutions">
                          Industrial Solutions
                        </option>
                        <option value="Special E-Sheba / Services">
                          Special E-Sheba / Services
                        </option>
                        <option value="Agriculture">Agriculture</option>
                      </select>
                    </div>

                    {/* Row 3: Quantity / Budget & Preferred Date (2 cols) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[12px] font-medium text-[#143527] block mb-1.5">
                          Quantity / budget (optional)
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
                          placeholder="A helpful starting point"
                          className="w-full h-11 px-3.5 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[12px] font-medium text-[#143527] block mb-1.5">
                          Preferred date (optional)
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
                          placeholder="Day / Month / Year"
                          className="w-full h-11 px-3.5 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Row 4: Your requirements (Textarea) */}
                    <div>
                      <label className="text-[12px] font-medium text-[#143527] block mb-1.5">
                        Your requirements *
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
                        placeholder="What do you need help with? Include your location if relevant."
                        className="w-full p-3 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors resize-y leading-relaxed"
                      />
                    </div>

                    {/* Row 5: Policy Consent Checkbox */}
                    <label className="flex items-start gap-2.5 pt-1 text-[12px] text-[#6F7771] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agreedToPrivacy}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            agreedToPrivacy: e.target.checked,
                          })
                        }
                        className="mt-0.5 w-4 h-4 text-[#143527] rounded-[2px] focus:ring-[#143527]"
                      />
                      <span>
                        I agree to be contacted about this enquiry and have read the
                        Privacy policy.
                      </span>
                    </label>

                    {/* Row 6: Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="h-11 px-6 bg-[#143527] hover:bg-[#1B4332] text-white text-[13px] font-medium rounded-[3px] inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                      >
                        <span>Send an enquiry</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
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
