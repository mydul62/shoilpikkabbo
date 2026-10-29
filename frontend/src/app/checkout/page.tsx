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

  const handleSubmitOrder = async (e: React.FormEvent) => {
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

    const paymentMap: Record<string, string> = {
      bKash: "BKASH_MANUAL",
      Nagad: "NAGAD_MANUAL",
      Card: "ONLINE_GATEWAY",
      "Bank transfer - BRAC Bank": "BANK_TRANSFER",
    };

    let orderNum = `SK-${Date.now().toString().slice(-6)}`;
    const now = new Date();
    const placedDate = `${now.getDate()} November ${now.getFullYear()}`;

    try {
      // First try to fetch a real product ID from database if current items are demo IDs
      let realProdId = "8ce7884f-c692-4787-a4ab-42df2d1de152";
      try {
        const prodRes = await fetch("http://localhost:5000/api/v1/products?limit=1");
        const prodData = await prodRes.json();
        if (prodData?.data?.[0]?.id) {
          realProdId = prodData.data[0].id;
        }
      } catch (e) {
        // use default
      }

      const activeItems = items.length > 0 ? items : displayItems;
      const orderPayload = {
        customerName: formData.fullName,
        customerPhone: formData.phone.replace(/\s+/g, ""),
        customerEmail: formData.email,
        shippingAddress: `${formData.address}, ${formData.area || ""}`,
        city: formData.district || "Dhaka",
        postalCode: formData.postcode,
        deliveryNotes: formData.deliveryNotes,
        paymentMethod: paymentMap[formData.paymentMethod] || "BKASH_MANUAL",
        transactionId: `TRX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        couponCode: appliedCoupon?.code,
        items: activeItems.map((item) => ({
          productId: item.product.id?.length === 36 ? item.product.id : realProdId,
          quantity: item.quantity,
        })),
      };

      const res = await fetch("http://localhost:5000/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      const resJson = await res.json();
      if (resJson.success && resJson.data?.orderNumber) {
        orderNum = resJson.data.orderNumber;
      }
    } catch (err) {
      console.warn("Backend order creation warning:", err);
    }

    setCompletedOrder({
      orderNumber: orderNum,
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
  };

  // If order is completed, show the architectural Order Confirmation screen
  if (completedOrder) {
    const firstName = completedOrder.fullName.split(" ")[0] || "Nusrat";
    return (
      <StorefrontLayout>
        <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-10 sm:py-16">
          <div className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top Tag & Checkmark */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-1 shadow-xs">
                <Check className="w-6 h-6 stroke-[2.4]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#E0592A] uppercase tracking-wider block">
                  ORDER PLACED SUCCESSFULLY
                </span>
                <h1 className="text-3xl sm:text-4xl text-[#0D3B37] font-black tracking-tight mt-1 leading-tight">
                  Thank you, {firstName}!
                </h1>
                <p className="text-sm sm:text-base text-gray-600 font-normal mt-1.5">
                  Your order is received and our Dhaka artisan hub is preparing your package.
                </p>
              </div>
            </div>

            {/* Dark Green Summary Bar */}
            <div className="mt-8 bg-[#0D3B37] text-white rounded-3xl p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 shadow-[0_4px_20px_rgba(13,59,55,0.12)]">
              <div>
                <span className="text-[11px] text-white/70 uppercase tracking-wider block mb-1 font-semibold">
                  ORDER NO.
                </span>
                <span className="text-lg sm:text-xl text-white font-extrabold tracking-tight">
                  {completedOrder.orderNumber}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-white/70 uppercase tracking-wider block mb-1 font-semibold">
                  PLACED DATE
                </span>
                <span className="text-sm sm:text-base text-white font-medium">
                  {completedOrder.placedDate}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-white/70 uppercase tracking-wider block mb-1 font-semibold">
                  TOTAL AMOUNT
                </span>
                <span className="text-lg sm:text-xl text-[#F59E0B] font-black">
                  ৳{completedOrder.total.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-white/70 uppercase tracking-wider block mb-1 font-semibold">
                  PAYMENT METHOD
                </span>
                <span className="text-sm sm:text-base text-emerald-300 font-bold">
                  {completedOrder.paymentMethod}
                </span>
              </div>
            </div>

            {/* Two Column Content */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pt-2">
              {/* Left Column: Delivery destination details */}
              <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-4">
                <h2 className="text-xl sm:text-2xl text-[#0D3B37] font-bold">
                  Shipping Destination
                </h2>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p className="font-bold text-gray-900">{completedOrder.fullName}</p>
                  <p>{completedOrder.address}</p>
                  <p>
                    {completedOrder.district} {completedOrder.postcode} · {completedOrder.phone}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="inline-block bg-emerald-50 text-emerald-800 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-200">
                    Estimated Delivery · 3–5 Business Days
                  </span>
                </div>

                <p className="text-xs text-gray-500 font-normal pt-2 leading-relaxed">
                  Order notifications and tracking links will be delivered to {completedOrder.email}.
                </p>

                {/* Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link
                    href={`/track-order?order=${completedOrder.orderNumber}`}
                    className="h-11 px-6 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-xs sm:text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <span>Track my order</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/shop"
                    className="h-11 px-6 bg-[#FAF8F5] hover:bg-[#F3EFE7] text-[#0D3B37] text-xs sm:text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Continue shopping</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Your Order Items */}
              <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)]">
                <h2 className="text-xl sm:text-2xl font-bold text-[#0D3B37] mb-5">
                  Your Order Items
                </h2>

                <div className="space-y-4">
                  {completedOrder.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-4 py-1"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 p-2 border border-gray-100">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gray-500 font-normal mt-0.5">
                          Quantity: {item.quantity} · ৳{item.product.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 mt-6 pt-3 text-xs text-gray-500 font-normal">
                  <p>
                    Subtotal ৳{completedOrder.subtotal.toLocaleString()} · Discount -৳{completedOrder.discount.toLocaleString()} · Delivery ৳{completedOrder.deliveryCharge.toLocaleString()}
                  </p>
                  <p className="mt-2 text-gray-400 text-[11.5px]">
                    Need to make a change? Contact our client support team with your order number.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Support Bar */}
            <div className="border-t border-gray-200/60 mt-16 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500 font-medium">
              <span>Have a question about your order? We're here to help.</span>
              <div className="flex items-center gap-4 text-xs">
                <a
                  href={`https://wa.me/${CLIENT_INFO.whatsapp || "8801731214379"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0D3B37] hover:text-[#E0592A] font-bold inline-flex items-center gap-1 transition-colors"
                >
                  <span>WhatsApp</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
                <span className="text-gray-300">·</span>
                <a
                  href={CLIENT_INFO.messengerUrl || "https://m.me/shoilpikkabbo"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0D3B37] hover:text-[#E0592A] font-bold inline-flex items-center gap-1 transition-colors"
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
      <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-8 sm:py-12">
        <div className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Steps */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-6">
            <Link href="/cart" className="hover:text-[#E0592A] transition-colors">
              Shopping Bag
            </Link>
            <span className="text-gray-300">→</span>
            <span className="text-[#0D3B37] font-bold">Delivery & Payment</span>
            <span className="text-gray-300">→</span>
            <span className="text-gray-400">Confirmation</span>
          </nav>

          {/* Headline */}
          <div className="mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl text-[#0D3B37] font-black tracking-tight leading-tight">
              Checkout & Order Placement
            </h1>
            <p className="text-sm text-gray-600 font-normal mt-1">
              Please provide your recipient details to ensure prompt delivery across Bangladesh.
            </p>
          </div>

          <form
            onSubmit={handleSubmitOrder}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
          >
            {/* Left Column: Guest banner + 01 Contact + 02 Delivery + 03 Payment (7-8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Guest Notification Bar */}
              <div className="bg-white rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-gray-500 shadow-2xs gap-2">
                <span>Checking out as a guest</span>
                <Link
                  href="/login"
                  className="text-[#0D3B37] hover:text-[#E0592A] font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  <span>Already a member? Sign in</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-8">
                {/* 01 Contact details */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#0D3B37]/10 text-[#0D3B37] flex items-center justify-center font-bold text-xs">01</span>
                    <h2 className="text-xl sm:text-2xl text-[#0D3B37] font-bold">
                      Contact Details
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                        Full name *
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="w-full h-11 px-4 bg-[#FAF8F5] border border-gray-200 rounded-xl text-sm text-[#0D3B37] font-medium focus:outline-none focus:border-[#0D3B37] focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                        Phone number *
                      </label>
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full h-11 px-4 bg-[#FAF8F5] border border-gray-200 rounded-xl text-sm text-[#0D3B37] font-medium focus:outline-none focus:border-[#0D3B37] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                      Email address *
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full h-11 px-4 bg-[#FAF8F5] border border-gray-200 rounded-xl text-sm text-[#0D3B37] font-medium focus:outline-none focus:border-[#0D3B37] focus:bg-white transition-colors"
                    />
                  </div>
                </section>

                {/* 02 Delivery address */}
                <section className="space-y-4 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#0D3B37]/10 text-[#0D3B37] flex items-center justify-center font-bold text-xs">02</span>
                    <h2 className="text-xl sm:text-2xl text-[#0D3B37] font-bold">
                      Delivery Address
                    </h2>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                      Street address *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full h-11 px-4 bg-[#FAF8F5] border border-gray-200 rounded-xl text-sm text-[#0D3B37] font-medium focus:outline-none focus:border-[#0D3B37] focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                        District *
                      </label>
                      <select
                        value={formData.district}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({ ...formData, district: val });
                          setShippingCity(val === "Dhaka" ? "Dhaka" : "Outside Dhaka");
                        }}
                        className="w-full h-11 px-3.5 bg-[#FAF8F5] border border-gray-200 rounded-xl text-sm text-[#0D3B37] font-medium focus:outline-none focus:border-[#0D3B37] focus:bg-white transition-colors cursor-pointer"
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
                      <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                        Area *
                      </label>
                      <select
                        value={formData.area}
                        onChange={(e) =>
                          setFormData({ ...formData, area: e.target.value })
                        }
                        className="w-full h-11 px-3.5 bg-[#FAF8F5] border border-gray-200 rounded-xl text-sm text-[#0D3B37] font-medium focus:outline-none focus:border-[#0D3B37] focus:bg-white transition-colors cursor-pointer"
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
                      <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                        Postcode
                      </label>
                      <input
                        type="text"
                        value={formData.postcode}
                        onChange={(e) =>
                          setFormData({ ...formData, postcode: e.target.value })
                        }
                        className="w-full h-11 px-4 bg-[#FAF8F5] border border-gray-200 rounded-xl text-sm text-[#0D3B37] font-medium focus:outline-none focus:border-[#0D3B37] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                      Delivery note (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.deliveryNotes}
                      onChange={(e) =>
                        setFormData({ ...formData, deliveryNotes: e.target.value })
                      }
                      className="w-full h-11 px-4 bg-[#FAF8F5] border border-gray-200 rounded-xl text-sm text-[#0D3B37] font-medium focus:outline-none focus:border-[#0D3B37] focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Selected Delivery Option Box */}
                  <div className="mt-4 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <span className="w-4 h-4 rounded-full border-4 border-[#0D3B37] bg-white mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-[#0D3B37]">
                          Standard delivery · {formData.district === "Dhaka" ? "Dhaka" : "Outside Dhaka"}
                        </p>
                        <p className="text-xs text-gray-500 font-normal mt-0.5">
                          Estimated 3–5 Nov 2026
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#0D3B37]">
                      ৳{displayDelivery.toLocaleString()}
                    </span>
                  </div>
                </section>

                {/* 03 Payment */}
                <section className="space-y-5 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#0D3B37]/10 text-[#0D3B37] flex items-center justify-center font-bold text-xs">03</span>
                    <h2 className="text-xl sm:text-2xl text-[#0D3B37] font-bold">
                      Payment
                    </h2>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      How would you like to pay?
                    </h3>
                    <p className="text-xs text-gray-500 font-normal mt-0.5">
                      Select a method. No card or wallet credentials are entered on this page.
                    </p>
                  </div>

                  {/* Payment Option Cards */}
                  <div className="space-y-3">
                    {/* bKash */}
                    <label
                      className={`block p-4 rounded-2xl cursor-pointer transition-all ${
                        formData.paymentMethod === "bKash"
                          ? "border border-[#0D3B37] bg-emerald-50/50 shadow-xs"
                          : "border border-gray-200 bg-white hover:border-gray-300"
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
                            className="w-4 h-4 text-[#0D3B37] accent-[#0D3B37]"
                          />
                          <div>
                            <p className="text-sm font-bold text-[#0D3B37]">
                              bKash
                            </p>
                            <p className="text-xs text-gray-500 font-normal">
                              Continue to secure bKash payment
                            </p>
                          </div>
                        </div>
                        {formData.paymentMethod === "bKash" && (
                          <span className="text-xs font-bold text-[#0D3B37]">
                            Selected
                          </span>
                        )}
                      </div>
                    </label>

                    {/* Nagad */}
                    <label
                      className={`block p-4 rounded-2xl cursor-pointer transition-all ${
                        formData.paymentMethod === "Nagad"
                          ? "border border-[#0D3B37] bg-emerald-50/50 shadow-xs"
                          : "border border-gray-200 bg-white hover:border-gray-300"
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
                            className="w-4 h-4 text-[#0D3B37] accent-[#0D3B37]"
                          />
                          <div>
                            <p className="text-sm font-bold text-[#0D3B37]">
                              Nagad
                            </p>
                            <p className="text-xs text-gray-500 font-normal">
                              Continue to secure Nagad payment
                            </p>
                          </div>
                        </div>
                        {formData.paymentMethod === "Nagad" && (
                          <span className="text-xs font-bold text-[#0D3B37]">
                            Selected
                          </span>
                        )}
                      </div>
                    </label>

                    {/* Card */}
                    <label
                      className={`block p-4 rounded-2xl cursor-pointer transition-all ${
                        formData.paymentMethod === "Card"
                          ? "border border-[#0D3B37] bg-emerald-50/50 shadow-xs"
                          : "border border-gray-200 bg-white hover:border-gray-300"
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
                            className="w-4 h-4 text-[#0D3B37] accent-[#0D3B37]"
                          />
                          <div>
                            <p className="text-sm font-bold text-[#0D3B37]">
                              Card
                            </p>
                            <p className="text-xs text-gray-500 font-normal">
                              Visa / Mastercard via secure gateway
                            </p>
                          </div>
                        </div>
                        {formData.paymentMethod === "Card" && (
                          <span className="text-xs font-bold text-[#0D3B37]">
                            Selected
                          </span>
                        )}
                      </div>
                    </label>

                    {/* Bank transfer - BRAC Bank */}
                    <label
                      className={`block p-4 rounded-2xl cursor-pointer transition-all ${
                        formData.paymentMethod === "Bank transfer - BRAC Bank"
                          ? "border border-[#0D3B37] bg-emerald-50/50 shadow-xs"
                          : "border border-gray-200 bg-white hover:border-gray-300"
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
                            className="w-4 h-4 text-[#0D3B37] accent-[#0D3B37]"
                          />
                          <div>
                            <p className="text-sm font-bold text-[#0D3B37]">
                              Bank transfer - BRAC Bank
                            </p>
                            <p className="text-xs text-gray-500 font-normal">
                              Receive verified transfer instructions securely
                            </p>
                          </div>
                        </div>
                        {formData.paymentMethod === "Bank transfer - BRAC Bank" && (
                          <span className="text-xs font-bold text-[#0D3B37]">
                            Selected
                          </span>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* Secure handoff banner */}
                  <div className="p-3.5 bg-[#FAF8F5] rounded-xl flex items-center gap-2.5 text-xs text-gray-600">
                    <ShieldCheck className="w-4 h-4 text-[#0D3B37] shrink-0" />
                    <span>
                      Secure handoff → authorize with your provider → return for confirmation. SHOILPIKKABBO does not store card details.
                    </span>
                  </div>

                  {/* Policy consent checkbox */}
                  <label className="flex items-start gap-2.5 pt-2 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreedToTerms}
                      onChange={(e) =>
                        setFormData({ ...formData, agreedToTerms: e.target.checked })
                      }
                      className="mt-0.5 w-4 h-4 text-[#0D3B37] accent-[#0D3B37] rounded"
                    />
                    <span>
                      I agree to the Terms, Privacy, Shipping and Return / refund policies.
                    </span>
                  </label>
                </section>
              </div>
            </div>

            {/* Right Column: Order Summary Card (4 cols) */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)] sticky top-24 space-y-4">
                <h2 className="text-xl sm:text-2xl text-[#0D3B37] font-bold leading-tight">
                  Your Order
                </h2>
                <p className="text-xs text-gray-400 font-medium">
                  {displayItems.reduce((acc, i) => acc + i.quantity, 0)} items · thoughtfully chosen
                </p>

                {/* Line Items Breakdown */}
                <div className="space-y-3 pt-3 text-sm border-t border-gray-100">
                  {displayItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between items-start text-gray-700"
                    >
                      <span className="pr-3 text-gray-600 font-normal line-clamp-1">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-semibold text-[#0D3B37] shrink-0">
                        ৳{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}

                  <div className="flex justify-between text-gray-700 pt-1">
                    <span className="font-normal text-gray-600">Subtotal</span>
                    <span className="font-semibold text-[#0D3B37]">
                      ৳{displaySubtotal.toLocaleString()}
                    </span>
                  </div>

                  {displayDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>{appliedCoupon?.code || "WELCOME150"}</span>
                      <span>
                        -৳{displayDiscount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-700">
                    <span className="font-normal text-gray-600">
                      Delivery · {formData.district === "Dhaka" ? "Dhaka" : "Outside Dhaka"}
                    </span>
                    <span className="font-semibold text-[#0D3B37]">
                      ৳{displayDelivery.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Total Row */}
                <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-gray-900">
                    Total · BDT
                  </span>
                  <span className="text-2xl sm:text-3xl text-[#0D3B37] font-black tracking-tight">
                    ৳{displayTotal.toLocaleString()}
                  </span>
                </div>

                {/* Continue / Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 mt-4 transition-colors cursor-pointer disabled:opacity-75 shadow-md"
                >
                  <span>
                    {isSubmitting
                      ? "Verifying details..."
                      : `Continue to ${formData.paymentMethod === "Bank transfer - BRAC Bank" ? "BRAC Bank" : formData.paymentMethod}`}
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                {/* Disclaimer subtext */}
                <p className="text-[11px] text-gray-400 leading-relaxed font-normal text-center">
                  You'll continue to the secure gateway. Card details are never stored by SHOILPIKKABBO.
                </p>
              </div>

              {/* Note outside card matching client mockup */}
              <p className="text-xs text-gray-400 leading-relaxed mt-4 font-normal">
                Your order is confirmed only after payment is verified. A cancelled or unsuccessful payment can be retried from your order page.
              </p>
            </div>
          </form>
        </div>
      </div>
    </StorefrontLayout>
  );
}
