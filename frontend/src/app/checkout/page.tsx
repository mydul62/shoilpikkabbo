"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { useCart, defaultInitialItems } from "@/context/CartContext";
import { CLIENT_INFO } from "@/data/mock-data";

export default function CheckoutPage() {
  const {
    items,
    subtotal,
    discount,
    deliveryCharge,
    total,
    shippingCity,
    setShippingCity,
    appliedCoupon,
    clearCart,
  } = useCart();

  // If cart is currently empty, use client mockup demo items for seamless presentation
  const displayItems = items.length > 0 ? items : defaultInitialItems;
  const displaySubtotal = items.length > 0 ? subtotal : 1900;
  const displayDiscount = items.length > 0 ? discount : 150;
  const displayDelivery =
    items.length > 0
      ? deliveryCharge
      : shippingCity === "Dhaka"
      ? 80
      : 130;
  const displayTotal =
    items.length > 0
      ? total
      : displaySubtotal - displayDiscount + displayDelivery;

  // Form states with default realistic values matching client mockup
  const [formData, setFormData] = React.useState({
    fullName: "Nusrat Rahman",
    phone: "01700 000000",
    email: "nusrat@example.com",
    address: "House 12, Road 7, Dhanmondi",
    district: "Dhaka",
    area: "Dhanmondi",
    postcode: "1209",
    deliveryNotes: "Call on arrival, please.",
    paymentMethod: "bKash" as "bKash" | "Nagad" | "Card" | "Bank transfer - BRAC Bank",
    agreedToTerms: true,
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Snapshot of order for confirmation screen
  const [completedOrder, setCompletedOrder] = React.useState<{
    orderNumber: string;
    placedDate: string;
    items: typeof items;
    subtotal: number;
    discount: number;
    deliveryCharge: number;
    total: number;
    fullName: string;
    address: string;
    district: string;
    area: string;
    postcode: string;
    phone: string;
    email: string;
    paymentMethod: string;
    appliedCouponCode?: string;
  } | null>(null);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Please fill in your name, contact phone, and delivery address.");
      return;
    }
    if (!formData.agreedToTerms) {
      alert("Please accept the Terms and Policies to proceed.");
      return;
    }

    setIsSubmitting(true);

    // Simulate order placement
    setTimeout(() => {
      const orderNumber = "SK-261102-1042";
      const now = new Date();
      const placedDate = `${now.getDate()} November ${now.getFullYear()}`;

      setCompletedOrder({
        orderNumber,
        placedDate,
        items: items.length > 0 ? [...items] : [...displayItems],
        subtotal: displaySubtotal,
        discount: displayDiscount,
        deliveryCharge: displayDelivery,
        total: displayTotal,
        fullName: formData.fullName,
        address: formData.address,
        district: formData.district,
        area: formData.area,
        postcode: formData.postcode,
        phone: formData.phone,
        email: formData.email,
        paymentMethod: formData.paymentMethod,
        appliedCouponCode: appliedCoupon?.code || (displayDiscount > 0 ? "WELCOME150" : undefined),
      });

      clearCart();
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 800);
  };

  // If order is completed, show the architectural Order Confirmation screen
  if (completedOrder) {
    const firstName = completedOrder.fullName.split(" ")[0] || "Nusrat";
    return (
      <StorefrontLayout>
        <div className="bg-[#F7F4EE] min-h-[calc(100vh-280px)] py-10 sm:py-16 border-b border-[#EAE3D5]">
          <div className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top Tag & Checkmark */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#E5ECE7] text-[#143527] flex items-center justify-center shrink-0 mt-1">
                <Check className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#B85D38] uppercase tracking-wider block">
                  A GOOD CHOICE, ON ITS WAY
                </span>
                <h1 className="font-serif text-3xl sm:text-[42px] text-[#143527] font-normal tracking-tight mt-1 leading-tight">
                  Thank you, {firstName}.
                </h1>
                <p className="text-[14px] text-[#6A736C] font-light mt-1.5">
                  Your payment is verified and your order is confirmed.
                </p>
              </div>
            </div>

            {/* Dark Green Summary Bar */}
            <div className="mt-8 bg-[#143527] text-white rounded-[4px] p-5 sm:p-7 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <span className="text-[10px] text-[#9EA8A1] uppercase tracking-wider block mb-1">
                  ORDER
                </span>
                <span className="font-serif text-[17px] text-white font-normal">
                  {completedOrder.orderNumber}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#9EA8A1] uppercase tracking-wider block mb-1">
                  PLACED
                </span>
                <span className="text-[14px] text-white font-light">
                  {completedOrder.placedDate}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#9EA8A1] uppercase tracking-wider block mb-1">
                  TOTAL PAID
                </span>
                <span className="font-serif text-[17px] text-white font-normal">
                  ৳{completedOrder.total.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#9EA8A1] uppercase tracking-wider block mb-1">
                  PAYMENT
                </span>
                <span className="text-[14px] text-white font-light">
                  {completedOrder.paymentMethod} · Verified
                </span>
              </div>
            </div>

            {/* Two Column Content */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 pt-2">
              {/* Left Column: Delivery destination details */}
              <div className="md:col-span-6 space-y-4">
                <h2 className="font-serif text-[22px] text-[#143527] font-normal">
                  A place to arrive.
                </h2>
                <div className="text-[13.5px] text-[#333E35] leading-relaxed font-light">
                  <p className="font-medium text-[#143527]">{completedOrder.fullName}</p>
                  <p>{completedOrder.address}</p>
                  <p>
                    {completedOrder.district} {completedOrder.postcode} · {completedOrder.phone}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="inline-block bg-[#EFECE6] text-[#143527] px-3.5 py-1.5 rounded-full text-[12px] font-medium border border-[#E5E0D5]">
                    Estimated delivery · 3–5 Nov 2026
                  </span>
                </div>

                <p className="text-[12.5px] text-[#6A736C] font-light pt-2 leading-relaxed">
                  Order updates will be sent to {completedOrder.email}. Keep your order number for tracking.
                </p>

                {/* Buttons */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/track-order?order=${completedOrder.orderNumber}`}
                    className="h-11 px-6 bg-[#143527] hover:bg-[#1B4332] text-white text-[13px] font-medium rounded-[3px] inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Track my order</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href="/shop"
                    className="h-11 px-6 bg-white hover:bg-[#F4F1EB] border border-[#D5CDC0] text-[#143527] text-[13px] font-medium rounded-[3px] inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Continue shopping</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Your finds */}
              <div className="md:col-span-6">
                <h2 className="font-serif text-[22px] text-[#143527] font-normal mb-5">
                  Your finds
                </h2>

                <div className="space-y-4">
                  {completedOrder.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-4 py-2"
                    >
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-[#EFECE6] shrink-0 border border-[#E8E2D8]">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-serif text-[15px] text-[#143527] font-normal">
                          {item.product.name}
                        </h4>
                        <p className="text-[12.5px] text-[#7A837C] font-light mt-0.5">
                          Quantity {item.quantity} · ৳{item.product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#E8E2D8] mt-6 pt-4 text-[12.5px] text-[#6A736C] font-light">
                  <p>
                    Subtotal ৳{completedOrder.subtotal.toLocaleString()} · Discount -৳{completedOrder.discount.toLocaleString()} · Delivery ৳{completedOrder.deliveryCharge.toLocaleString()}
                  </p>
                  <p className="mt-2 text-[#8C948E]">
                    Need to make a change? Contact support with your order number as soon as possible.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Support Bar */}
            <div className="border-t border-[#E8E2D8] mt-16 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12.5px] text-[#6A736C] font-light">
              <span>We're here for the next step.</span>
              <div className="flex items-center gap-6">
                <a
                  href="https://wa.me/8801731214379"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#143527] hover:text-[#B85D38] inline-flex items-center gap-1 transition-colors"
                >
                  <span>WhatsApp</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
                <a
                  href="https://m.me/shoilpikkabbo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#143527] hover:text-[#B85D38] inline-flex items-center gap-1 transition-colors"
                >
                  <span>Facebook Messenger</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  // Pre-order Checkout Form matching media_1793202314442.png
  return (
    <StorefrontLayout>
      <div className="bg-[#F7F4EE] min-h-[calc(100vh-280px)] py-8 sm:py-12 border-b border-[#EAE3D5]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Steps */}
          <nav className="flex items-center gap-2 text-[12px] text-[#7A837C] mb-6">
            <Link href="/cart" className="hover:text-[#143527] transition-colors">
              Bag
            </Link>
            <span className="text-[#B3ACA0]">→</span>
            <span className="text-[#143527] font-medium">Delivery & payment</span>
            <span className="text-[#B3ACA0]">→</span>
            <span className="text-[#9EA8A1]">Confirmation</span>
          </nav>

          {/* Headline */}
          <div className="mb-8 sm:mb-10">
            <h1 className="font-serif text-3xl sm:text-[40px] text-[#143527] font-normal tracking-tight leading-tight">
              One step closer to home.
            </h1>
          </div>

          <form
            onSubmit={handleSubmitOrder}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start"
          >
            {/* Left Column: Guest banner + 01 Contact + 02 Delivery + 03 Payment (7-8 cols) */}
            <div className="lg:col-span-8 space-y-10">
              {/* Guest Notification Bar */}
              <div className="bg-[#EFECE6] border border-[#E2DDD3] rounded-[2px] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between text-[12.5px] text-[#556059] gap-1">
                <span>Checking out as a guest</span>
                <Link
                  href="/login"
                  className="text-[#143527] hover:text-[#B85D38] font-medium inline-flex items-center gap-1 transition-colors"
                >
                  <span>Already a member? Sign in</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* 01 Contact details */}
              <section className="space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-[18px] text-[#7A837C]">01</span>
                  <h2 className="font-serif text-[22px] sm:text-[24px] text-[#143527] font-normal">
                    Contact details
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] font-medium text-[#143527] block mb-1.5">
                      Full name *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full h-11 px-3.5 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#143527] block mb-1.5">
                      Phone number *
                    </label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full h-11 px-3.5 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[12px] font-medium text-[#143527] block mb-1.5">
                    Email address *
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full h-11 px-3.5 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors"
                  />
                </div>
              </section>

              {/* 02 Delivery address */}
              <section className="space-y-4 pt-4 border-t border-[#E8E2D8]">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-[18px] text-[#7A837C]">02</span>
                  <h2 className="font-serif text-[22px] sm:text-[24px] text-[#143527] font-normal">
                    Delivery address
                  </h2>
                </div>

                <div>
                  <label className="text-[12px] font-medium text-[#143527] block mb-1.5">
                    Street address *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full h-11 px-3.5 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[12px] font-medium text-[#143527] block mb-1.5">
                      District *
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({ ...formData, district: val });
                        setShippingCity(val === "Dhaka" ? "Dhaka" : "Outside Dhaka");
                      }}
                      className="w-full h-11 px-3 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors cursor-pointer"
                    >
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chattogram">Chattogram</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Barishal">Barishal</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Mymensingh">Mymensingh</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[12px] font-medium text-[#143527] block mb-1.5">
                      Area *
                    </label>
                    <select
                      value={formData.area}
                      onChange={(e) =>
                        setFormData({ ...formData, area: e.target.value })
                      }
                      className="w-full h-11 px-3 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors cursor-pointer"
                    >
                      <option value="Dhanmondi">Dhanmondi</option>
                      <option value="Gulshan">Gulshan</option>
                      <option value="Banani">Banani</option>
                      <option value="Uttara">Uttara</option>
                      <option value="Mirpur">Mirpur</option>
                      <option value="Mohammadpur">Mohammadpur</option>
                      <option value="Bashundhara">Bashundhara</option>
                      <option value="Badda">Badda</option>
                      <option value="Motijheel">Motijheel</option>
                      <option value="Other">Other Area</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[12px] font-medium text-[#143527] block mb-1.5">
                      Postcode
                    </label>
                    <input
                      type="text"
                      value={formData.postcode}
                      onChange={(e) =>
                        setFormData({ ...formData, postcode: e.target.value })
                      }
                      className="w-full h-11 px-3.5 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[12px] font-medium text-[#143527] block mb-1.5">
                    Delivery note (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.deliveryNotes}
                    onChange={(e) =>
                      setFormData({ ...formData, deliveryNotes: e.target.value })
                    }
                    className="w-full h-11 px-3.5 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors"
                  />
                </div>

                {/* Selected Delivery Option Box */}
                <div className="mt-4 p-4 rounded-[2px] border border-[#143527] bg-[#F3F6F3] flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <span className="w-4 h-4 rounded-full border-4 border-[#143527] bg-white mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[13px] font-medium text-[#143527]">
                        Standard delivery · {formData.district === "Dhaka" ? "Dhaka" : "Outside Dhaka"}
                      </p>
                      <p className="text-[11.5px] text-[#6A736C] font-light mt-0.5">
                        Estimated 3–5 Nov 2026
                      </p>
                    </div>
                  </div>
                  <span className="text-[14px] font-medium text-[#143527]">
                    ৳{displayDelivery.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11.5px] text-[#8C948E] font-light">
                  Available delivery options and final charges depend on your address.
                </p>
              </section>

              {/* 03 Payment */}
              <section className="space-y-5 pt-4 border-t border-[#E8E2D8]">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-[18px] text-[#7A837C]">03</span>
                  <h2 className="font-serif text-[22px] sm:text-[24px] text-[#143527] font-normal">
                    Payment
                  </h2>
                </div>

                <div>
                  <h3 className="font-serif text-[18px] text-[#143527] font-normal">
                    How would you like to pay?
                  </h3>
                  <p className="text-[12.5px] text-[#6A736C] font-light mt-0.5">
                    Select a method. No card or wallet credentials are entered on this page.
                  </p>
                </div>

                {/* Payment Option Cards */}
                <div className="space-y-3">
                  {/* bKash */}
                  <label
                    className={`block p-4 rounded-[3px] border cursor-pointer transition-all ${
                      formData.paymentMethod === "bKash"
                        ? "border-[#143527] bg-[#F4F7F4] ring-1 ring-[#143527]"
                        : "border-[#D5CDC0] bg-white hover:border-[#143527]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bKash"
                          checked={formData.paymentMethod === "bKash"}
                          onChange={() =>
                            setFormData({ ...formData, paymentMethod: "bKash" })
                          }
                          className="w-4 h-4 text-[#143527] focus:ring-[#143527]"
                        />
                        <div>
                          <p className="text-[13.5px] font-medium text-[#143527]">
                            bKash
                          </p>
                          <p className="text-[11.5px] text-[#7A837C] font-light">
                            Continue to secure bKash payment
                          </p>
                        </div>
                      </div>
                      {formData.paymentMethod === "bKash" && (
                        <span className="text-[11.5px] font-medium text-[#143527]">
                          Selected
                        </span>
                      )}
                    </div>
                  </label>

                  {/* Nagad */}
                  <label
                    className={`block p-4 rounded-[3px] border cursor-pointer transition-all ${
                      formData.paymentMethod === "Nagad"
                        ? "border-[#143527] bg-[#F4F7F4] ring-1 ring-[#143527]"
                        : "border-[#D5CDC0] bg-white hover:border-[#143527]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Nagad"
                          checked={formData.paymentMethod === "Nagad"}
                          onChange={() =>
                            setFormData({ ...formData, paymentMethod: "Nagad" })
                          }
                          className="w-4 h-4 text-[#143527] focus:ring-[#143527]"
                        />
                        <div>
                          <p className="text-[13.5px] font-medium text-[#143527]">
                            Nagad
                          </p>
                          <p className="text-[11.5px] text-[#7A837C] font-light">
                            Continue to secure Nagad payment
                          </p>
                        </div>
                      </div>
                      {formData.paymentMethod === "Nagad" && (
                        <span className="text-[11.5px] font-medium text-[#143527]">
                          Selected
                        </span>
                      )}
                    </div>
                  </label>

                  {/* Card */}
                  <label
                    className={`block p-4 rounded-[3px] border cursor-pointer transition-all ${
                      formData.paymentMethod === "Card"
                        ? "border-[#143527] bg-[#F4F7F4] ring-1 ring-[#143527]"
                        : "border-[#D5CDC0] bg-white hover:border-[#143527]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Card"
                          checked={formData.paymentMethod === "Card"}
                          onChange={() =>
                            setFormData({ ...formData, paymentMethod: "Card" })
                          }
                          className="w-4 h-4 text-[#143527] focus:ring-[#143527]"
                        />
                        <div>
                          <p className="text-[13.5px] font-medium text-[#143527]">
                            Card
                          </p>
                          <p className="text-[11.5px] text-[#7A837C] font-light">
                            Visa / Mastercard via secure gateway
                          </p>
                        </div>
                      </div>
                      {formData.paymentMethod === "Card" && (
                        <span className="text-[11.5px] font-medium text-[#143527]">
                          Selected
                        </span>
                      )}
                    </div>
                  </label>

                  {/* Bank transfer - BRAC Bank */}
                  <label
                    className={`block p-4 rounded-[3px] border cursor-pointer transition-all ${
                      formData.paymentMethod === "Bank transfer - BRAC Bank"
                        ? "border-[#143527] bg-[#F4F7F4] ring-1 ring-[#143527]"
                        : "border-[#D5CDC0] bg-white hover:border-[#143527]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Bank transfer - BRAC Bank"
                          checked={formData.paymentMethod === "Bank transfer - BRAC Bank"}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              paymentMethod: "Bank transfer - BRAC Bank",
                            })
                          }
                          className="w-4 h-4 text-[#143527] focus:ring-[#143527]"
                        />
                        <div>
                          <p className="text-[13.5px] font-medium text-[#143527]">
                            Bank transfer - BRAC Bank
                          </p>
                          <p className="text-[11.5px] text-[#7A837C] font-light">
                            Receive verified transfer instructions securely
                          </p>
                        </div>
                      </div>
                      {formData.paymentMethod === "Bank transfer - BRAC Bank" && (
                        <span className="text-[11.5px] font-medium text-[#143527]">
                          Selected
                        </span>
                      )}
                    </div>
                  </label>
                </div>

                {/* Secure handoff banner */}
                <div className="p-3.5 bg-[#EFECE6] border border-[#E2DDD3] rounded-[2px] flex items-center gap-2.5 text-[12px] text-[#556059]">
                  <ShieldCheck className="w-4 h-4 text-[#143527] shrink-0" />
                  <span>
                    Secure handoff → authorize with your provider → return for confirmation. SHOILPIKKABBO does not store card details.
                  </span>
                </div>

                {/* Policy consent checkbox */}
                <label className="flex items-start gap-2.5 pt-2 text-[12.5px] text-[#556059] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={(e) =>
                      setFormData({ ...formData, agreedToTerms: e.target.checked })
                    }
                    className="mt-0.5 w-4 h-4 text-[#143527] rounded-[2px] focus:ring-[#143527]"
                  />
                  <span>
                    I agree to the Terms, Privacy, Shipping and Return / refund policies.
                  </span>
                </label>
              </section>
            </div>

            {/* Right Column: Order Summary Card (4 cols) */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-[#E8E2D8] rounded-xl p-6 sm:p-7 shadow-xs sticky top-24">
                <h2 className="font-serif text-[22px] sm:text-[24px] text-[#143527] font-normal leading-tight">
                  Your order
                </h2>
                <p className="text-[12.5px] text-[#8C948E] font-light mt-1 mb-5">
                  {displayItems.reduce((acc, i) => acc + i.quantity, 0)} items · thoughtfully chosen
                </p>

                {/* Line Items Breakdown */}
                <div className="space-y-3 pt-2 text-[13px] border-t border-[#F0EBE1]">
                  {displayItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between items-start text-[#333E35]"
                    >
                      <span className="pr-3 text-[#333E35] font-light line-clamp-1">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-medium text-[#143527] shrink-0">
                        ৳{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}

                  <div className="flex justify-between text-[#333E35] pt-1">
                    <span className="font-light">Subtotal</span>
                    <span className="font-medium text-[#143527]">
                      ৳{displaySubtotal.toLocaleString()}
                    </span>
                  </div>

                  {displayDiscount > 0 && (
                    <div className="flex justify-between text-[#333E35]">
                      <span className="font-light">{appliedCoupon?.code || "WELCOME150"}</span>
                      <span className="font-medium text-[#143527]">
                        -৳{displayDiscount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#333E35]">
                    <span className="font-light">
                      Delivery · {formData.district === "Dhaka" ? "Dhaka" : "Outside Dhaka"}
                    </span>
                    <span className="font-medium text-[#143527]">
                      ৳{displayDelivery.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Total Row */}
                <div className="border-t border-[#E8E2D8] mt-4 pt-4 flex justify-between items-baseline">
                  <span className="text-[14px] font-medium text-[#143527]">
                    Total · BDT
                  </span>
                  <span className="font-serif text-[26px] sm:text-[28px] text-[#143527] font-normal tracking-tight">
                    ৳{displayTotal.toLocaleString()}
                  </span>
                </div>

                {/* Continue / Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-[#143527] hover:bg-[#1B4332] text-white text-[13.5px] font-medium rounded-[3px] inline-flex items-center justify-center gap-2 mt-5 transition-colors cursor-pointer disabled:opacity-75 shadow-xs"
                >
                  <span>
                    {isSubmitting
                      ? "Verifying details..."
                      : `Continue to ${formData.paymentMethod === "Bank transfer - BRAC Bank" ? "BRAC Bank" : formData.paymentMethod}`}
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                {/* Disclaimer subtext */}
                <p className="text-[11px] text-[#8C948E] leading-relaxed mt-4 font-light text-center">
                  You'll continue to the secure gateway. Card details are never stored by SHOILPIKKABBO.
                </p>
              </div>

              {/* Note outside card matching client mockup */}
              <p className="text-[11.5px] text-[#8C948E] leading-relaxed mt-4 font-light">
                Your order is confirmed only after payment is verified. A cancelled or unsuccessful payment can be retried from your order page.
              </p>
            </div>
          </form>
        </div>
      </div>
    </StorefrontLayout>
  );
}
