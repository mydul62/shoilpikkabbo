"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CLIENT_INFO } from "@/data/mock-data";

export function Footer() {
  return (
    <div className="mt-auto">
      {/* 1. Value Proposition 3-Step Process & Help Bar */}
      <div className="bg-[#F7F4EE] border-t border-[#EAE3D5]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          {/* 3-Step Ordering Process */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 py-12 sm:py-16">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <span className="font-serif text-2xl sm:text-[28px] font-normal text-[#B85D38] leading-none shrink-0 pt-0.5">
                01
              </span>
              <div>
                <h4 className="text-[14px] sm:text-[15px] font-medium text-[#143527] leading-snug">
                  Find something you love
                </h4>
                <p className="text-[12.5px] sm:text-[13px] text-[#6A736C] font-light mt-1.5 leading-relaxed">
                  Browse by category or search the collection.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <span className="font-serif text-2xl sm:text-[28px] font-normal text-[#B85D38] leading-none shrink-0 pt-0.5">
                02
              </span>
              <div>
                <h4 className="text-[14px] sm:text-[15px] font-medium text-[#143527] leading-snug">
                  Choose how to pay
                </h4>
                <p className="text-[12.5px] sm:text-[13px] text-[#6A736C] font-light mt-1.5 leading-relaxed">
                  bKash, Nagad, BRAC Bank transfer or card.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <span className="font-serif text-2xl sm:text-[28px] font-normal text-[#B85D38] leading-none shrink-0 pt-0.5">
                03
              </span>
              <div>
                <h4 className="text-[14px] sm:text-[15px] font-medium text-[#143527] leading-snug">
                  Follow your delivery
                </h4>
                <p className="text-[12.5px] sm:text-[13px] text-[#6A736C] font-light mt-1.5 leading-relaxed">
                  View order updates and delivery details.
                </p>
              </div>
            </div>
          </div>

          {/* Divider Line */}
          <div className="border-t border-[#EAE3D5]" />

          {/* Customer Pre-Purchase Consultation Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 py-8 sm:py-10">
            <p className="text-[13.5px] sm:text-[14.5px] text-[#556059] font-light">
              A question before you choose? We&apos;re here to help.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/88${CLIENT_INFO.phonePrimary}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/70 hover:bg-white border border-[#D5CDC0] hover:border-[#143527] text-[#143527] text-[13px] font-medium rounded-[2px] transition-all group shadow-2xs"
              >
                <span>WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <a
                href="https://m.me/shoilpikkabbo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/70 hover:bg-white border border-[#D5CDC0] hover:border-[#143527] text-[#143527] text-[13px] font-medium rounded-[2px] transition-all group shadow-2xs"
              >
                <span>Facebook Messenger</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#143527] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Deep Green Footer */}
      <footer className="bg-[#133829] text-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-16 sm:pt-20 pb-12 sm:pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 sm:pb-16">
            {/* Column 1: Brand Info */}
            <div className="lg:col-span-5">
              <h3 className="font-serif text-2xl sm:text-[28px] font-normal tracking-[0.08em] text-white uppercase mb-2">
                SHOILPIKKABBO
              </h3>
              <p className="text-[12px] sm:text-[12.5px] text-[#A8BDB2] font-light mb-6 tracking-wide">
                Delivery • Quality • Reliability
              </p>
              <div className="space-y-1.5 text-[13px] text-[#A8BDB2] font-light">
                <a
                  href={`mailto:${CLIENT_INFO.email}`}
                  className="hover:text-white transition-colors block"
                >
                  {CLIENT_INFO.email}
                </a>
                <p className="text-[#A8BDB2]">
                  {CLIENT_INFO.phonePrimary} · {CLIENT_INFO.phoneSecondary}
                </p>
              </div>
            </div>

            {/* Column 2: Explore */}
            <div className="lg:col-span-2">
              <h4 className="text-[13.5px] sm:text-[14px] font-medium text-white mb-4 sm:mb-5">
                Explore
              </h4>
              <ul className="space-y-2.5 text-[12.5px] sm:text-[13px] text-[#A8BDB2] font-light">
                <li>
                  <Link href="/shop" className="hover:text-white transition-colors">
                    Shop all products
                  </Link>
                </li>
                <li>
                  <Link href="/e-sheba" className="hover:text-white transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Career
                  </Link>
                </li>
                <li>
                  <Link href="/offers" className="hover:text-white transition-colors">
                    Offers / Discounts
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Here to help */}
            <div className="lg:col-span-2">
              <h4 className="text-[13.5px] sm:text-[14px] font-medium text-white mb-4 sm:mb-5">
                Here to help
              </h4>
              <ul className="space-y-2.5 text-[12.5px] sm:text-[13px] text-[#A8BDB2] font-light">
                <li>
                  <Link href="/track-order" className="hover:text-white transition-colors">
                    Track an order
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact us
                  </Link>
                </li>
                <li>
                  <a
                    href={`https://wa.me/88${CLIENT_INFO.phonePrimary}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="https://m.me/shoilpikkabbo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Facebook Messenger
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Pay your way */}
            <div className="lg:col-span-3">
              <h4 className="text-[13.5px] sm:text-[14px] font-medium text-white mb-4 sm:mb-5">
                Pay your way
              </h4>
              <div className="space-y-1.5 text-[12.5px] sm:text-[13px] text-[#D0DFD7] font-light">
                <p>bKash · Nagad · Card</p>
                <p>Bank transfer · BRAC Bank</p>
                <p className="text-[11.5px] sm:text-[12px] text-[#869E90] pt-2 leading-relaxed max-w-[260px]">
                  Online payments continue through a secure payment gateway.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Hairline Divider & Legal / Language */}
          <div className="border-t border-[#1C4936] pt-8 sm:pt-10 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-x-2 text-[12px] text-[#869E90] font-light">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <span>·</span>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <span>·</span>
              <Link href="/refund" className="hover:text-white transition-colors">
                Return / refund
              </Link>
              <span>·</span>
              <Link href="/shipping" className="hover:text-white transition-colors">
                Shipping policy
              </Link>
            </div>
            <p className="text-[11px] sm:text-[11.5px] text-[#71887A] font-light">
              © SHOILPIKKABBO <span className="mx-1">·</span> EN / বাংলা
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
