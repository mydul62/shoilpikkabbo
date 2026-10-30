"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, Phone, Send, MapPin, Clock } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export function Footer() {
  const { settings } = useSettings();
  const [newsletterEmail, setNewsletterEmail] = React.useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = React.useState(false);

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
      <div className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand Info & Socials (Col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              {settings.logoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={settings.logoUrl}
                  alt={settings.storeNameBn || settings.storeName}
                  className="h-10 sm:h-12 w-auto max-w-[200px] object-contain hover:opacity-95 transition-opacity"
                />
              ) : (
                <div className="w-10 h-10 shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 12C8 10.8954 8.89543 10 10 10H30C31.1046 10 32 10.8954 32 12L34 33C34 34.6569 32.6569 36 31 36H9C7.34315 36 6 34.6569 6 33L8 12Z" fill="#134E48" />
                    <path d="M14 12V9C14 6.79086 15.7909 5 18 5H22C24.2091 5 26 6.79086 26 9V12" stroke="#134E48" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M14 27C14 20 22 17 26 15C26 21 21 27 15 28" fill="#22C55E" />
                    <path d="M12 29C14 24 19 22 23 23C20 26 16 30 12 29Z" fill="#E0592A" />
                  </svg>
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-extrabold text-[20px] sm:text-[22px] tracking-tight text-white leading-none">
                  {settings.storeNameBn || settings.storeName}
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-white/70 mt-1 uppercase">
                  {settings.taglineBn || settings.tagline}
                </span>
              </div>
            </Link>

            <p className="text-sm text-white/80 font-normal leading-relaxed max-w-sm">
              খাঁটি দেশীয় ঐতিহ্য, আধুনিক সেবা ও সর্বোচ্চ গুণগত মানের সমাহারে আপনার নির্ভরযোগ্য প্রতিষ্ঠান।
            </p>

            {/* Social Media Circles */}
            <div className="flex items-center gap-2.5 pt-2 flex-wrap">
              {settings.socialFacebook && (
                <a
                  href={settings.socialFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all shadow-xs"
                  title="Facebook"
                >
                  <span className="text-xs font-bold">f</span>
                </a>
              )}

              {settings.socialMessenger && (
                <a
                  href={settings.socialMessenger}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#0084FF] text-white flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all shadow-xs"
                  title="Messenger"
                >
                  <span className="text-xs font-bold">💬</span>
                </a>
              )}

              {settings.socialWhatsapp && (
                <a
                  href={settings.socialWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all shadow-xs"
                  title="WhatsApp"
                >
                  <span className="text-xs font-bold">✆</span>
                </a>
              )}

              {settings.socialInstagram && (
                <a
                  href={settings.socialInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all shadow-xs"
                  title="Instagram"
                >
                  <span className="text-xs font-bold">📷</span>
                </a>
              )}

              {settings.socialYoutube && (
                <a
                  href={settings.socialYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#FF0000] text-white flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all shadow-xs"
                  title="YouTube"
                >
                  <span className="text-xs font-bold">▶</span>
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links (Col 5-6) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-base font-bold text-white tracking-normal">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/80">
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
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-base font-bold text-white tracking-normal">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/80">
              <li>
                <Link href="/track-order" className="hover:text-[#E0592A] transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#E0592A] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#E0592A] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#E0592A] transition-colors">
                  Support Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Office Details (Col 9-10) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-base font-bold text-white tracking-normal">
              Contact & Office
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/80">
              {settings.contactPrimary && (
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <a href={`tel:${settings.contactPrimary}`} className="hover:text-emerald-400 transition-colors">
                    {settings.contactPrimary}
                  </a>
                </li>
              )}
              {settings.contactEmail && (
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <a href={`mailto:${settings.contactEmail}`} className="hover:text-emerald-400 transition-colors truncate">
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              {settings.officeAddress && (
                <li className="flex items-start gap-2 pt-1 border-t border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-white/75 leading-relaxed">{settings.officeAddress}</span>
                </li>
              )}
              {settings.officeHours && (
                <li className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-white/75">{settings.officeHours}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Column 5: Newsletter (Col 11-12) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-base font-bold text-white tracking-normal mb-1">
              Stay Updated
            </h4>
            <p className="text-xs text-white/70 mb-3">
              Subscribe for exclusive artisan collections, offers, and eco-friendly updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="relative flex items-center">
              <input
                type="email"
                required
                placeholder="Enter your email..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full h-10 pl-3.5 pr-10 rounded-xl bg-white text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 w-8 bg-[#0D3B37] hover:bg-[#E0592A] text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Subscribe"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            {newsletterSubscribed && (
              <p className="text-xs text-emerald-400 mt-1.5 font-medium">
                ✓ Thank you for subscribing!
              </p>
            )}
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
          <p className="tracking-wide">{settings.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
