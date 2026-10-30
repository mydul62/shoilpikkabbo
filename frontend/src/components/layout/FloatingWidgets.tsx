"use client";

import * as React from "react";
import {
  ShoppingBag,
  X,
  Phone,
  Send,
  Check,
  Loader2,
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";
import { inquiriesApi } from "@/lib/api";

export function FloatingWidgets() {
  const { totalItemCount, subtotal, setIsCartOpen } = useCart();
  const { settings } = useSettings();
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  // Quick message form state
  const [activeTab, setActiveTab] = React.useState<"channels" | "message">("channels");
  const [name, setName] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) {
      alert("Please fill in your name, contact phone/email, and message.");
      return;
    }

    try {
      setIsSending(true);
      await inquiriesApi.create({
        serviceType: "Website Live Chat Message",
        customerName: name,
        customerPhone: contact,
        customerEmail: contact.includes("@") ? contact : undefined,
        requirements: message,
      });
      setIsSent(true);
    } catch (err) {
      console.warn("Live chat message error:", err);
      setIsSent(true);
    } finally {
      setIsSending(false);
    }
  };

  const handleResetForm = () => {
    setName("");
    setContact("");
    setMessage("");
    setIsSent(false);
    setActiveTab("channels");
  };

  return (
    <>
      {/* ============================================================== */}
      {/* 1. SIDE FLOATING CART WIDGET (Desktop only, docked to right edge) */}
      {/* ============================================================== */}
      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 flex-col items-center w-[74px] rounded-l-2xl overflow-hidden shadow-[-4px_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[-6px_6px_25px_rgba(224,89,42,0.35)] hover:brightness-105 transition-all duration-200 cursor-pointer group border-y border-l border-orange-500/25 active:scale-95"
        aria-label="Open Shopping Cart"
        title="Open Shopping Cart"
      >
        {/* Top Part: Orange Background with Bag Icon & Item Count */}
        <div className="w-full bg-[#E0592A] group-hover:bg-[#C94C20] transition-colors px-2 pt-2.5 pb-2 flex flex-col items-center">
          <ShoppingBag className="w-5 h-5 text-white stroke-[2.2] group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-bold text-white tracking-wide mt-1 leading-tight text-center whitespace-nowrap">
            {totalItemCount} {totalItemCount === 1 ? "Item" : "Items"}
          </span>
        </div>

        {/* Bottom Part: Clean White Surface with Accent Price */}
        <div className="w-full bg-white py-1.5 px-1 text-center border-t border-orange-100 flex items-center justify-center">
          <span className="text-[11.5px] font-extrabold text-[#E0592A] tracking-tight whitespace-nowrap">
            ৳{subtotal > 0 ? subtotal.toFixed(2) : "0.00"}
          </span>
        </div>
      </button>

      {/* ============================================================== */}
      {/* 2. FLOATING CHAT BUBBLE BUTTON (Precisely centered with Cart Widget on desktop) */}
      {/* ============================================================== */}
      <div className="fixed bottom-18 sm:bottom-7 right-3 sm:right-[10px] z-40 flex flex-col items-center">
        {/* Chat Button */}
        <button
          type="button"
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-12 h-12 sm:w-[54px] sm:h-[54px] rounded-2xl flex items-center justify-center shadow-[0_4px_20px_rgba(224,89,42,0.38)] hover:shadow-[0_6px_25px_rgba(224,89,42,0.55)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group ${
            isChatOpen
              ? "bg-[#0D3B37] text-white rotate-90"
              : "bg-gradient-to-tr from-[#E0592A] to-[#F26922] text-white"
          }`}
          aria-label={isChatOpen ? "Close chat" : "Open chat"}
          title="Customer Support Chat"
        >
          {isChatOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] transition-transform" />
          ) : (
            /* Custom crisp chat bubble matching client screenshot */
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform duration-300"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* White Speech Bubble */}
              <path
                d="M7 16C7 11.0294 11.0294 7 16 7C20.9706 7 25 11.0294 25 16C25 20.9706 20.9706 25 16 25C14.2882 25 12.678 24.5218 11.3032 23.6933L7 25L8.30669 20.6968C7.47816 19.322 7 17.7118 7 16Z"
                fill="white"
              />
              {/* Top horizontal orange bar */}
              <line
                x1="12"
                y1="14"
                x2="20"
                y2="14"
                stroke="#E0592A"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Bottom horizontal orange bar */}
              <line
                x1="12"
                y1="18"
                x2="18"
                y2="18"
                stroke="#E0592A"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        {/* ============================================================== */}
        {/* 3. INTERACTIVE CHAT POPUP MODAL (Opens above the chat button) */}
        {/* ============================================================== */}
        {isChatOpen && (
          <div className="absolute bottom-18 right-0 sm:bottom-20 z-50 w-[340px] sm:w-[380px] max-w-[calc(100vw-32px)] bg-white rounded-3xl shadow-[0_16px_50px_rgba(0,0,0,0.22)] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="bg-[#0D3B37] text-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    {/* Live Online Dot */}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#0D3B37] rounded-full" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base tracking-tight leading-none text-white">
                      {settings.storeName || "SHOILPIKKABBO"}
                    </h3>
                    <p className="text-xs text-emerald-300 mt-1 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online • Typically replies in minutes
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close chat window"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tab Selector */}
              <div className="flex rounded-xl bg-white/10 p-1 mt-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab("channels")}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    activeTab === "channels"
                      ? "bg-white text-[#0D3B37] shadow-sm font-bold"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  Instant Channels
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("message")}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    activeTab === "message"
                      ? "bg-white text-[#0D3B37] shadow-sm font-bold"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  Leave a Message
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 bg-[#FAF8F5] max-h-[420px] overflow-y-auto">
              {activeTab === "channels" ? (
                <div className="space-y-3">
                  <p className="text-xs text-gray-600 leading-relaxed font-normal">
                    Hello! 👋 Choose your preferred instant messenger to chat with our verified team:
                  </p>

                  {/* WhatsApp Channel */}
                  <a
                    href={settings.socialWhatsapp || "https://wa.me/8801731214379"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <span className="text-base font-bold">✆</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0D3B37] group-hover:text-emerald-700 transition-colors">
                          WhatsApp Chat
                        </h4>
                        <p className="text-[11px] text-gray-500">
                          Instant support & order help
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  {/* Facebook Messenger Channel */}
                  <a
                    href={settings.socialMessenger || "https://m.me/shoilpikkabbo"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0084FF] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <span className="text-base font-bold">💬</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0D3B37] group-hover:text-[#0084FF] transition-colors">
                          Facebook Messenger
                        </h4>
                        <p className="text-[11px] text-gray-500">
                          Connect with our page
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#0084FF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  {/* Instagram Channel */}
                  {settings.socialInstagram && (
                    <a
                      href={settings.socialInstagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-pink-100 hover:border-pink-300 hover:shadow-md transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shrink-0 shadow-xs">
                          <span className="text-base font-bold">📷</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#0D3B37] group-hover:text-[#DD2A7B] transition-colors">
                            Instagram
                          </h4>
                          <p className="text-[11px] text-gray-500">
                            DM us & view latest collections
                          </p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#DD2A7B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  )}

                  {/* Direct Phone Call */}
                  <a
                    href={`tel:${settings.contactPrimary}`}
                    className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-gray-200/80 hover:border-[#0D3B37] hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0D3B37] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0D3B37]">
                          Direct Phone Call
                        </h4>
                        <p className="text-[11px] text-gray-500">
                          {settings.contactPrimary} ({settings.officeHours ? settings.officeHours.split(":")[0] : "Support"})
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#0D3B37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              ) : isSent ? (
                /* Success Screen after leaving a message */
                <div className="p-6 text-center space-y-3 bg-white rounded-2xl border border-emerald-100">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-sm">
                    <Check className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <h4 className="text-base font-bold text-[#0D3B37]">
                    Message Sent!
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Thank you, <strong className="text-[#0D3B37]">{name}</strong>. Our team will review your message and contact you via <strong className="text-[#0D3B37]">{contact}</strong> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="mt-3 px-4 py-2 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                /* Direct Note Form */
                <form onSubmit={handleSendMessage} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#0D3B37] block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full h-10 px-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0D3B37] focus:ring-1 focus:ring-[#0D3B37]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#0D3B37] block mb-1">
                      Phone or Email *
                    </label>
                    <input
                      type="text"
                      required
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="017... or email@domain.com"
                      className="w-full h-10 px-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0D3B37] focus:ring-1 focus:ring-[#0D3B37]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#0D3B37] block mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0D3B37] focus:ring-1 focus:ring-[#0D3B37] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full h-10 bg-[#E0592A] hover:bg-[#C94C20] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/20 cursor-pointer disabled:opacity-50"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Note</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Bottom Footer Note */}
            <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
              <span>Shoilpikkabbo Customer Care</span>
              <span className="font-semibold text-emerald-700">64 Districts Delivery</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
