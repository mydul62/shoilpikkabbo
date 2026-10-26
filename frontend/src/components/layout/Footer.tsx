import * as React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, ShieldCheck, Truck, Clock, Sparkles } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { CLIENT_INFO } from "@/data/mock-data";

export function Footer() {
  return (
    <footer className="bg-forest-950 text-sand border-t border-forest-900 mt-auto">
      {/* Value Proposition Bar */}
      <div className="border-b border-forest-900/60 bg-forest-900/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-forest-900/40 border border-forest-800/40">
            <div className="h-12 w-12 rounded-xl bg-forest-800 flex items-center justify-center text-gold-500 shrink-0">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-white text-sm">
                Reliable Delivery
              </h4>
              <p className="text-xs text-sand/70 mt-0.5">
                Fast shipping across Dhaka & nationwide districts.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-forest-900/40 border border-forest-800/40">
            <div className="h-12 w-12 rounded-xl bg-forest-800 flex items-center justify-center text-gold-500 shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-white text-sm">
                Artisanal Quality
              </h4>
              <p className="text-xs text-sand/70 mt-0.5">
                Authentic handcrafted, organic, and industrial goods.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-forest-900/40 border border-forest-800/40">
            <div className="h-12 w-12 rounded-xl bg-forest-800 flex items-center justify-center text-gold-500 shrink-0">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-white text-sm">
                Customer Reliability
              </h4>
              <p className="text-xs text-sand/70 mt-0.5">
                Direct phone support & transparent order tracking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" />
            <p className="text-xs text-sand/80 leading-relaxed max-w-sm mt-3">
              SHOILPIKKABBO is dedicated to delivering excellence across traditional Bangladeshi handicrafts, eco-friendly jute creations, lifestyle essentials, and custom corporate e-sheba solutions.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-sand/90">
                <Phone className="h-4 w-4 text-gold-500 shrink-0" />
                <span>
                  Support: {CLIENT_INFO.phonePrimary} / {CLIENT_INFO.phoneSecondary}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sand/90">
                <Mail className="h-4 w-4 text-gold-500 shrink-0" />
                <span>Email: {CLIENT_INFO.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sand/90">
                <MapPin className="h-4 w-4 text-gold-500 shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-sand/80">
              <li>
                <Link href="/shop?category=handicraft" className="hover:text-gold-500 transition-colors">
                  Handicraft
                </Link>
              </li>
              <li>
                <Link href="/shop?category=jute-items" className="hover:text-gold-500 transition-colors">
                  Jute Items
                </Link>
              </li>
              <li>
                <Link href="/shop?category=polymer" className="hover:text-gold-500 transition-colors">
                  Polymer
                </Link>
              </li>
              <li>
                <Link href="/shop?category=baby-items" className="hover:text-gold-500 transition-colors">
                  Baby Items
                </Link>
              </li>
              <li>
                <Link href="/shop?category=corporate-gift-items" className="hover:text-gold-500 transition-colors">
                  Corporate Gifts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=rudiment-garments" className="hover:text-gold-500 transition-colors">
                  Rudiment Garments
                </Link>
              </li>
              <li>
                <Link href="/shop?category=health-and-beauty" className="hover:text-gold-500 transition-colors">
                  Health & Beauty
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick & Support Links */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs text-sand/80">
              <li>
                <Link href="/track-order" className="hover:text-gold-500 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/e-sheba" className="hover:text-gold-500 transition-colors font-medium text-gold-400">
                  Special E-Sheba
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-gold-500 transition-colors">
                  Promotions & Coupons
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold-500 transition-colors">
                  About Our Brand
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-500 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-gold-500 transition-colors">
                  Careers & Vacancies
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Payment Partners
            </h4>
            <p className="text-xs text-sand/70 mb-3 leading-relaxed">
              We support verified manual payments via bKash, Nagad, and BRAC Bank PLC, plus Cash on Delivery.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded bg-forest-900 border border-forest-800 text-[11px] font-semibold text-pink-400">
                bKash
              </span>
              <span className="px-2.5 py-1 rounded bg-forest-900 border border-forest-800 text-[11px] font-semibold text-amber-400">
                Nagad
              </span>
              <span className="px-2.5 py-1 rounded bg-forest-900 border border-forest-800 text-[11px] font-semibold text-blue-400">
                BRAC Bank
              </span>
              <span className="px-2.5 py-1 rounded bg-forest-900 border border-forest-800 text-[11px] font-semibold text-emerald-400">
                Cash on Delivery
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-forest-900">
              <p className="text-[11px] text-sand/60">
                Payment Verification: <strong className="text-sand">{CLIENT_INFO.phonePayment}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-forest-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-sand/60 gap-4">
          <p>© {new Date().getFullYear()} SHOILPIKKABBO. All rights reserved.</p>
          <div className="flex items-center gap-1 text-gold-500 font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Delivery • Quality • Reliability</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
