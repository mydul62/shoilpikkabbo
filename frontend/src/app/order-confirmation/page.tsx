"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { CLIENT_INFO } from "@/data/mock-data";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();

  const orderNumber = searchParams?.get("order") || "SK-261102-1042";
  const fullName = searchParams?.get("name") || "Nusrat Rahman";
  const firstName = fullName.split(" ")[0] || "Nusrat";
  const phone = searchParams?.get("phone") || "01700 000000";
  const email = searchParams?.get("email") || "nusrat@example.com";
  const address = searchParams?.get("address") || "House 12, Road 7, Dhanmondi";
  const district = searchParams?.get("district") || "Dhaka";
  const postcode = searchParams?.get("postcode") || "1209";
  const paymentMethod = searchParams?.get("payment") || "bKash";

  const orderDate = "2 November 2026";
  const subtotal = 1900;
  const discount = 150;
  const deliveryCharge = 80;
  const total = subtotal - discount + deliveryCharge; // 1830

  const items = [
    {
      id: "prod-jute-basket",
      name: "Everyday jute basket",
      quantity: 1,
      price: 1450,
      imageUrl: "/images/product-jute-basket.png",
    },
    {
      id: "prod-woven-coasters",
      name: "Woven coaster set",
      quantity: 1,
      price: 450,
      imageUrl: "/images/product-woven-coasters.png",
    },
  ];

  return (
    <div className="bg-[#F7F4EE] min-h-[calc(100vh-280px)] py-10 sm:py-16">
      <div className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tag & Checkmark */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#E5ECE7] text-[#143527] flex items-center justify-center shrink-0 mt-1">
            <Check className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#B85D38] uppercase tracking-widest block">
              A GOOD CHOICE, ON ITS WAY
            </span>
            <h1 className="font-serif text-3xl sm:text-[42px] text-[#143527] font-normal tracking-tight mt-1 leading-tight">
              Thank you, {firstName}.
            </h1>
            <p className="text-[13.5px] sm:text-[14px] text-[#556059] font-light mt-1.5">
              Your payment is verified and your order is confirmed.
            </p>
          </div>
        </div>

        {/* Dark Green Summary Bar */}
        <div className="mt-8 bg-[#143527] text-white rounded-[3px] p-5 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <span className="text-[10px] text-[#A3B8AA] uppercase tracking-wider block mb-1 font-light">
              ORDER
            </span>
            <span className="text-[14.5px] text-white font-medium">
              {orderNumber}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#A3B8AA] uppercase tracking-wider block mb-1 font-light">
              PLACED
            </span>
            <span className="text-[13.5px] text-white font-light">
              {orderDate}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#A3B8AA] uppercase tracking-wider block mb-1 font-light">
              TOTAL PAID
            </span>
            <span className="text-[15.5px] text-white font-medium">
              ৳{total.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#A3B8AA] uppercase tracking-wider block mb-1 font-light">
              PAYMENT
            </span>
            <span className="text-[13.5px] text-white font-light">
              {paymentMethod} · Verified
            </span>
          </div>
        </div>

        {/* Two Column Content */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 pt-2">
          {/* Left Column: Delivery destination details (6 cols) */}
          <div className="md:col-span-6 space-y-4">
            <h2 className="font-serif text-[24px] text-[#143527] font-normal">
              A place to arrive.
            </h2>
            <div className="text-[13.5px] text-[#333E35] leading-relaxed font-light">
              <p className="font-medium text-[#143527]">{fullName}</p>
              <p>{address}</p>
              <p>
                {district} {postcode} · {phone}
              </p>
            </div>

            <div className="pt-2">
              <span className="inline-block bg-[#E5ECE6] text-[#143527] px-3 py-1 rounded-full text-[11.5px] font-medium border border-[#D5DDD6]">
                Estimated delivery · 3–5 Nov 2026
              </span>
            </div>

            <p className="text-[12px] text-[#6F7771] font-light pt-2 leading-relaxed">
              Order updates will be sent to {email}. Keep your order number for tracking.
            </p>

            {/* Buttons - Stacked vertically */}
            <div className="pt-3 flex flex-col items-start gap-2.5">
              <Link
                href={`/track-order?order=${orderNumber}`}
                className="h-10 px-6 bg-[#143527] hover:bg-[#1B4332] text-white text-[13px] font-medium rounded-[3px] inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Track my order</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/shop"
                className="h-10 px-6 bg-white hover:bg-[#F3EFE7] border border-[#D5CDC0] text-[#143527] text-[13px] font-medium rounded-[3px] inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Continue shopping</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Your finds (6 cols) */}
          <div className="md:col-span-6">
            <h2 className="font-serif text-[24px] text-[#143527] font-normal mb-5">
              Your finds
            </h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 py-1"
                >
                  <div className="relative w-16 h-16 rounded-[3px] overflow-hidden bg-[#EBE7DF] shrink-0 border border-[#E0D9CD]">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-medium text-[#143527]">
                      {item.name}
                    </h4>
                    <p className="text-[12px] text-[#6F7771] font-light mt-0.5">
                      Quantity {item.quantity} · ৳{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E8E2D8] mt-6 pt-3 text-[12px] text-[#6F7771] font-light">
              <p>
                Subtotal ৳{subtotal.toLocaleString()} · Discount -৳{discount.toLocaleString()} · Delivery ৳{deliveryCharge.toLocaleString()}
              </p>
              <p className="mt-2 text-[#8C948E] text-[11.5px]">
                Need to make a change? Contact support with your order number as soon as possible.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Support Bar */}
        <div className="border-t border-[#E8E2D8] mt-16 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px] text-[#6F7771] font-light">
          <span>We're here for the next step.</span>
          <div className="flex items-center gap-4 text-[12px]">
            <a
              href={`https://wa.me/${CLIENT_INFO.whatsapp || "8801731214379"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#143527] hover:text-[#B85D38] font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span>WhatsApp</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <span className="text-[#B0AAA0]">·</span>
            <a
              href={CLIENT_INFO.messengerUrl || "https://m.me/shoilpikkabbo"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#143527] hover:text-[#B85D38] font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span>Facebook Messenger</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <StorefrontLayout>
      <React.Suspense
        fallback={
          <div className="min-h-[500px] flex items-center justify-center bg-[#F7F4EE]">
            <p className="text-[13px] text-[#6F7771] font-light">
              Loading order confirmation...
            </p>
          </div>
        }
      >
        <OrderConfirmationContent />
      </React.Suspense>
    </StorefrontLayout>
  );
}
