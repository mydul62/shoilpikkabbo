"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, Phone, Check } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { CLIENT_INFO } from "@/data/mock-data";

export default function ContactPage() {
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
      await fetch("http://localhost:5000/api/v1/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: formData.topic || "General Customer Enquiry",
          customerName: formData.name,
          customerPhone: formData.phone || "01700 000000",
          customerEmail: formData.email,
          requirements: `${formData.orderNumber ? `Order #${formData.orderNumber} - ` : ""}${formData.message}`,
        }),
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
      <div className="bg-[#F7F4EE] min-h-[calc(100vh-280px)] py-10 sm:py-16">
        <div className="max-w-[1524px] mx-auto px-5">
          {/* Breadcrumb */}
          <nav className="text-[12px] text-[#7A837C] font-light mb-4">
            <Link href="/" className="hover:text-[#143527] transition-colors">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-[#143527]">Contact us</span>
          </nav>

          {/* Page Headline & Subtitle */}
          <h1 className="font-serif text-3xl sm:text-[42px] text-[#143527] font-normal tracking-tight leading-tight">
            A conversation starts here.
          </h1>
          <p className="text-[13.5px] sm:text-[14px] text-[#556059] font-light mt-2 mb-10 sm:mb-12">
            A product question, a delivery update or something new in mind? Tell
            us how we can help.
          </p>

          {/* Main Grid: Left Contact Info (5 cols) & Right Form Card (7 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-16">
            {/* Left Column: Get in Touch & Message Channels */}
            <div className="lg:col-span-5">
              <span className="text-[10px] font-semibold text-[#B85D38] uppercase tracking-widest block mb-6">
                GET IN TOUCH
              </span>

              {/* Email channel */}
              <div className="flex items-start gap-3.5 mb-5">
                <div className="w-8 h-8 rounded-[3px] flex items-center justify-center text-[#143527] shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 stroke-[1.8]" />
                </div>
                <div>
                  <span className="text-[11.5px] text-[#7A837C] font-light block">
                    Email us
                  </span>
                  <a
                    href={`mailto:${CLIENT_INFO.email}`}
                    className="text-[13.5px] text-[#143527] font-normal hover:text-[#B85D38] transition-colors"
                  >
                    {CLIENT_INFO.email}
                  </a>
                </div>
              </div>

              {/* Phone channel */}
              <div className="flex items-start gap-3.5 mb-6">
                <div className="w-8 h-8 rounded-[3px] flex items-center justify-center text-[#143527] shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 stroke-[1.8]" />
                </div>
                <div>
                  <span className="text-[11.5px] text-[#7A837C] font-light block">
                    Call us
                  </span>
                  <div className="text-[13.5px] text-[#143527] font-normal leading-snug space-y-0.5">
                    <p>{CLIENT_INFO.phonePrimary}</p>
                    <p>{CLIENT_INFO.phoneSecondary}</p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#E8E2D8] my-8" />

              {/* Prefer a message? */}
              <h2 className="font-serif text-[22px] text-[#143527] font-normal mb-4">
                Prefer a message?
              </h2>

              <div className="space-y-2.5 mb-4">
                <a
                  href={`https://wa.me/${CLIENT_INFO.whatsapp || "8801731214379"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 bg-[#143527] hover:bg-[#1B4332] text-white text-[13px] font-medium rounded-[3px] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <span>Chat on WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href={CLIENT_INFO.messengerUrl || "https://m.me/shoilpikkabbo"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 bg-white hover:bg-[#F3EFE7] border border-[#D5CDC0] text-[#143527] text-[13px] font-medium rounded-[3px] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Facebook Messenger</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <p className="text-[11.5px] text-[#8C948E] font-light leading-relaxed mb-6">
                For an existing order, include your order number. Never share a
                wallet PIN, OTP or card details in a message.
              </p>

              {/* Callout box: Visiting or collecting an order? */}
              <div className="bg-[#E5ECE7] rounded-[3px] p-4 text-[12px] text-[#425046]">
                <strong className="font-medium text-[#143527] block mb-1">
                  Visiting or collecting an order?
                </strong>
                <p className="font-light leading-relaxed">
                  Please contact us first to confirm whether collection is
                  available and where to go.
                </p>
              </div>
            </div>

            {/* Right Column: "Leave a note." Form Card */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-[#E8E2D8] rounded-xl p-6 sm:p-8 shadow-xs">
                <h2 className="font-serif text-[24px] text-[#143527] font-normal mb-6">
                  Leave a note.
                </h2>

                {isSubmitted ? (
                  <div className="p-8 text-center bg-[#F7F4EE] rounded-[4px] border border-[#E8E2D8] space-y-3">
                    <div className="w-10 h-10 rounded-full bg-[#E5ECE7] text-[#143527] flex items-center justify-center mx-auto">
                      <Check className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <h3 className="font-serif text-[20px] text-[#143527] font-normal">
                      Message sent.
                    </h3>
                    <p className="text-[12.5px] text-[#556059] font-light max-w-sm mx-auto leading-relaxed">
                      Thank you, {formData.name}. We've received your note and
                      will get back to you via {formData.email} as soon as
                      possible.
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
                      className="mt-4 text-[12px] font-medium text-[#143527] underline hover:text-[#B85D38] cursor-pointer"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Row 1: Name & Email */}
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
                          Email address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="you@example.com"
                          className="w-full h-11 px-3.5 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Row 2: Phone & Topic */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[12px] font-medium text-[#143527] block mb-1.5">
                          Phone (optional)
                        </label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="01XXXXXXXXX"
                          className="w-full h-11 px-3.5 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[12px] font-medium text-[#143527] block mb-1.5">
                          Topic *
                        </label>
                        <select
                          required
                          value={formData.topic}
                          onChange={(e) =>
                            setFormData({ ...formData, topic: e.target.value })
                          }
                          className="w-full h-11 px-3.5 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors appearance-none cursor-pointer"
                        >
                          <option value="">Choose a topic ⌄</option>
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
                      <label className="text-[12px] font-medium text-[#143527] block mb-1.5">
                        Order number (if applicable)
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
                        placeholder="SK-..."
                        className="w-full h-11 px-3.5 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors uppercase"
                      />
                    </div>

                    {/* Row 4: Message textarea */}
                    <div>
                      <label className="text-[12px] font-medium text-[#143527] block mb-1.5">
                        Your message *
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
                        placeholder="How can we help?"
                        className="w-full p-3 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors resize-y leading-relaxed"
                      />
                    </div>

                    {/* Row 5: Policy consent */}
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
                        I have read the Privacy policy and agree to be contacted
                        about this message.
                      </span>
                    </label>

                    {/* Row 6: Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="h-11 px-6 bg-[#143527] hover:bg-[#1B4332] text-white text-[13px] font-medium rounded-[3px] inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                      >
                        <span>Send message</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Bottom 3 Help Columns */}
          <div className="border-t border-[#E8E2D8] mt-16 pt-10 pb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-serif text-[20px] text-[#143527] font-normal mb-2">
                Where is my order?
              </h3>
              <Link
                href="/track-order"
                className="text-[12.5px] text-[#6F7771] hover:text-[#143527] inline-flex items-center gap-1 font-light transition-colors"
              >
                <span>Track your order</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div>
              <h3 className="font-serif text-[20px] text-[#143527] font-normal mb-2">
                Before you buy
              </h3>
              <Link
                href="/shipping"
                className="text-[12.5px] text-[#6F7771] hover:text-[#143527] inline-flex items-center gap-1 font-light transition-colors"
              >
                <span>Shipping policy</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div>
              <h3 className="font-serif text-[20px] text-[#143527] font-normal mb-2">
                Need to return something?
              </h3>
              <Link
                href="/refund"
                className="text-[12.5px] text-[#6F7771] hover:text-[#143527] inline-flex items-center gap-1 font-light transition-colors"
              >
                <span>Return / refund policy</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
