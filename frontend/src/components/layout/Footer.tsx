"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, Phone, CreditCard, Building2, Send } from "lucide-react";
import { CLIENT_INFO } from "@/data/mock-data";

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = React.useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = React.useState(false);
  const [lang, setLang] = React.useState<"bn" | "en">("bn");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setTimeout(() => setNewsletterSubscribed(false), 3000);
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="mt-auto bg-[#092B28] text-white overflow-hidden border-t border-[#072220]">
      <div className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-10 border-b border-white/10">
          {/* Column 1: Brand Info & Socials (Col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-9 h-9 shrink-0">
                <svg className="w-full h-full" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 12C8 10.8954 8.89543 10 10 10H30C31.1046 10 32 10.8954 32 12L34 33C34 34.6569 32.6569 36 31 36H9C7.34315 36 6 34.6569 6 33L8 12Z" fill="#134E48" />
                  <path d="M14 12V9C14 6.79086 15.7909 5 18 5H22C24.2091 5 26 6.79086 26 9V12" stroke="#134E48" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M14 27C14 20 22 17 26 15C26 21 21 27 15 28" fill="#22C55E" />
                  <path d="M12 29C14 24 19 22 23 23C20 26 16 30 12 29Z" fill="#E0592A" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[20px] tracking-tight text-white leading-none">
                  SHOILPIKKABBO
                </span>
                <span className="text-[9px] font-bold tracking-[0.2em] text-white/70 mt-1 uppercase">
                  DELIVERY • QUALITY • RELIABILITY
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-[13px] text-white/75 font-light leading-relaxed max-w-sm">
              High quality products, trusted service, for a better tomorrow.
            </p>

            {/* Social Media Circles */}
            <div className="flex items-center gap-2.5 pt-2">
              {/* Facebook */}
              <a
                href="https://facebook.com/shoilpikkabbo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                title="Facebook"
              >
                <span className="text-xs font-bold">f</span>
              </a>

              {/* Messenger */}
              <a
                href="https://m.me/shoilpikkabbo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#0084FF] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                title="Messenger"
              >
                <span className="text-xs font-bold">💬</span>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/88${CLIENT_INFO.phonePrimary}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                title="WhatsApp"
              >
                <span className="text-xs font-bold">✆</span>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@shoilpikkabbo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#FF0000] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                title="YouTube"
              >
                <span className="text-xs font-bold">▶</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (Col 5-6) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-white/75">
              <li>
                <Link href="/" className="hover:text-[#E0592A] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#E0592A] transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-[#E0592A] transition-colors">
                  Offers
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#E0592A] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#E0592A] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-[#E0592A] transition-colors">
                  Career
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#E0592A] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care (Col 7-8) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-white/75">
              <li>
                <Link href="/track-order" className="hover:text-[#E0592A] transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-[#E0592A] transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-[#E0592A] transition-colors">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#E0592A] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#E0592A] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us (Col 9-10) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-xs text-white/80">
              <li className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-white/60 shrink-0 mt-0.5" />
                <a href="mailto:shoilpikkabbo@gmail.com" className="hover:text-[#E0592A] transition-colors break-all">
                  shoilpikkabbo@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-white/60 shrink-0 mt-0.5" />
                <span className="leading-tight">
                  01731214379, 01811909068
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CreditCard className="w-3.5 h-3.5 text-white/60 shrink-0 mt-0.5" />
                <span>01977765999 (Payment)</span>
              </li>
              <li className="flex items-start gap-2">
                <Building2 className="w-3.5 h-3.5 text-white/60 shrink-0 mt-0.5" />
                <span>BRAC Bank</span>
              </li>
            </ul>
          </div>

          {/* Column 5: Newsletter & Language (Col 11-12) */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide mb-1">
                Newsletter
              </h4>
              <p className="text-xs text-white/70 mb-2.5">
                Get the latest updates and offers.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="relative flex items-center">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full h-9 pl-3 pr-9 rounded bg-white text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 w-7 bg-[#0D3B37] hover:bg-[#E0592A] text-white rounded flex items-center justify-center transition-colors cursor-pointer"
                  title="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              {newsletterSubscribed && (
                <p className="text-[11px] text-emerald-400 mt-1 font-medium">
                  ✓ Thank you for subscribing!
                </p>
              )}
            </div>

            <div>
              <h4 className="text-xs font-semibold text-white/90 mb-1.5 uppercase tracking-wider">
                Language
              </h4>
              <div className="inline-flex items-center gap-1 bg-[#061F1D] p-1 rounded-md">
                <button
                  type="button"
                  onClick={() => setLang("bn")}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    lang === "bn"
                      ? "bg-white text-[#092B28] shadow-xs"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  বাংলা
                </button>
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    lang === "en"
                      ? "bg-white text-[#092B28] shadow-xs"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p>© 2025 SHOILPIKKABBO. All rights reserved.</p>
          <p className="tracking-wide">Delivery • Quality • Reliability</p>
        </div>
      </div>
    </footer>
  );
}
