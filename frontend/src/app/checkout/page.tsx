"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowRight,
  Phone,
  Building,
  Wallet,
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { CLIENT_INFO } from "@/data/mock-data";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    discount,
    deliveryCharge,
    total,
    shippingCity,
    setShippingCity,
    clearCart,
  } = useCart();

  // Form states
  const [formData, setFormData] = React.useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    deliveryNotes: "",
    paymentMethod: "BKASH" as "BKASH" | "NAGAD" | "BANK_TRANSFER" | "COD",
    transactionId: "",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = React.useState<string | null>(null);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Please fill in your name, contact phone, and delivery address.");
      return;
    }

    if (
      (formData.paymentMethod === "BKASH" ||
        formData.paymentMethod === "NAGAD" ||
        formData.paymentMethod === "BANK_TRANSFER") &&
      !formData.transactionId.trim()
    ) {
      alert("Please provide the Transaction ID / Reference for your payment.");
      return;
    }

    setIsSubmitting(true);

    // Simulate reliable order placement
    setTimeout(() => {
      const orderNum = `SK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setCompletedOrderNumber(orderNum);
      clearCart();
      setIsSubmitting(false);
    }, 1200);
  };

  if (completedOrderNumber) {
    return (
      <StorefrontLayout>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
          <div className="h-20 w-20 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <h1 className="text-3xl font-extrabold text-charcoal-900 font-heading">
            Order Successfully Placed!
          </h1>

          <div className="p-6 rounded-2xl border border-brand-border bg-white text-left space-y-3 shadow-xs">
            <div className="flex justify-between border-b border-sand pb-3">
              <span className="text-xs text-charcoal-500">Order Reference</span>
              <span className="text-sm font-extrabold text-forest-900">
                {completedOrderNumber}
              </span>
            </div>
            <div className="flex justify-between border-b border-sand pb-3">
              <span className="text-xs text-charcoal-500">Recipient Name</span>
              <span className="text-sm font-bold text-charcoal-900">
                {formData.fullName}
              </span>
            </div>
            <div className="flex justify-between border-b border-sand pb-3">
              <span className="text-xs text-charcoal-500">Phone</span>
              <span className="text-sm font-bold text-charcoal-900">
                {formData.phone}
              </span>
            </div>
            <div className="flex justify-between border-b border-sand pb-3">
              <span className="text-xs text-charcoal-500">Delivery City</span>
              <span className="text-sm font-bold text-charcoal-900">
                {shippingCity}
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-xs text-charcoal-500">Payment Method</span>
              <span className="text-sm font-extrabold text-forest-800">
                {formData.paymentMethod === "COD" ? "Cash on Delivery" : formData.paymentMethod}
              </span>
            </div>
          </div>

          <p className="text-xs text-charcoal-500 max-w-md mx-auto leading-relaxed">
            We will verify your transaction details and contact you at{" "}
            <strong>{formData.phone}</strong> before dispatching your package.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link href={`/track-order?order=${completedOrderNumber}`}>
              <Button variant="primary" size="lg">
                Track This Order
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline" size="lg">
                Return to Shop
              </Button>
            </Link>
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 font-heading mb-8">
          Checkout & Shipping
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-charcoal-500 mb-4">
              Your cart is empty. Please add items before checking out.
            </p>
            <Link href="/shop">
              <Button variant="primary" size="md">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmitOrder}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            {/* Left Column: Customer & Delivery & Payment (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* 1. Customer Information */}
              <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-4">
                <h2 className="font-heading font-bold text-base text-charcoal-900 border-b border-sand pb-3">
                  1. Contact Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-charcoal-800">
                      Full Name *
                    </label>
                    <Input
                      required
                      placeholder="e.g. Tanvir Ahmed"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-charcoal-800">
                      Contact Phone Number *
                    </label>
                    <Input
                      required
                      type="tel"
                      placeholder="e.g. 017XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal-800">
                    Email Address (Optional)
                  </label>
                  <Input
                    type="email"
                    placeholder="e.g. yourname@gmail.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-4">
                <h2 className="font-heading font-bold text-base text-charcoal-900 border-b border-sand pb-3">
                  2. Delivery Address & Zone
                </h2>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-charcoal-800">
                    Destination Region *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setShippingCity("Dhaka")}
                      className={`p-3 rounded-xl text-left border text-xs font-semibold cursor-pointer ${
                        shippingCity === "Dhaka"
                          ? "bg-forest-50 border-forest-800 text-forest-900 ring-1 ring-forest-800/20"
                          : "border-brand-border bg-white text-charcoal-700"
                      }`}
                    >
                      <span className="block font-bold">Inside Dhaka</span>
                      <span className="text-[11px] text-charcoal-500">
                        Charge: ৳{CLIENT_INFO.deliveryChargeDhaka}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShippingCity("Outside Dhaka")}
                      className={`p-3 rounded-xl text-left border text-xs font-semibold cursor-pointer ${
                        shippingCity === "Outside Dhaka"
                          ? "bg-forest-50 border-forest-800 text-forest-900 ring-1 ring-forest-800/20"
                          : "border-brand-border bg-white text-charcoal-700"
                      }`}
                    >
                      <span className="block font-bold">Outside Dhaka</span>
                      <span className="text-[11px] text-charcoal-500">
                        Charge: ৳{CLIENT_INFO.deliveryChargeOutside}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal-800">
                    Full Street Address / Holding / Thana *
                  </label>
                  <Textarea
                    required
                    placeholder="House number, road number, area, district..."
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal-800">
                    Delivery Instructions / Notes (Optional)
                  </label>
                  <Input
                    placeholder="e.g. Call before arrival, leave with concierge"
                    value={formData.deliveryNotes}
                    onChange={(e) =>
                      setFormData({ ...formData, deliveryNotes: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-5">
                <h2 className="font-heading font-bold text-base text-charcoal-900 border-b border-sand pb-3">
                  3. Select Payment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === "BKASH"
                        ? "bg-forest-50 border-forest-800 ring-1 ring-forest-800/20"
                        : "border-brand-border bg-white hover:border-sand-dark"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BKASH"
                      checked={formData.paymentMethod === "BKASH"}
                      onChange={() =>
                        setFormData({ ...formData, paymentMethod: "BKASH" })
                      }
                      className="mt-1 text-forest-800 focus:ring-forest-800"
                    />
                    <div>
                      <p className="text-xs font-bold text-charcoal-900">
                        bKash Manual Send Money
                      </p>
                      <p className="text-[11px] text-charcoal-500 mt-0.5">
                        Verification Phone: {CLIENT_INFO.phonePayment}
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === "NAGAD"
                        ? "bg-forest-50 border-forest-800 ring-1 ring-forest-800/20"
                        : "border-brand-border bg-white hover:border-sand-dark"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="NAGAD"
                      checked={formData.paymentMethod === "NAGAD"}
                      onChange={() =>
                        setFormData({ ...formData, paymentMethod: "NAGAD" })
                      }
                      className="mt-1 text-forest-800 focus:ring-forest-800"
                    />
                    <div>
                      <p className="text-xs font-bold text-charcoal-900">
                        Nagad Manual Transfer
                      </p>
                      <p className="text-[11px] text-charcoal-500 mt-0.5">
                        Verification Phone: {CLIENT_INFO.phonePayment}
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === "BANK_TRANSFER"
                        ? "bg-forest-50 border-forest-800 ring-1 ring-forest-800/20"
                        : "border-brand-border bg-white hover:border-sand-dark"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BANK_TRANSFER"
                      checked={formData.paymentMethod === "BANK_TRANSFER"}
                      onChange={() =>
                        setFormData({ ...formData, paymentMethod: "BANK_TRANSFER" })
                      }
                      className="mt-1 text-forest-800 focus:ring-forest-800"
                    />
                    <div>
                      <p className="text-xs font-bold text-charcoal-900">
                        BRAC Bank PLC Transfer
                      </p>
                      <p className="text-[11px] text-charcoal-500 mt-0.5">
                        Direct Account Wire
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === "COD"
                        ? "bg-forest-50 border-forest-800 ring-1 ring-forest-800/20"
                        : "border-brand-border bg-white hover:border-sand-dark"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === "COD"}
                      onChange={() =>
                        setFormData({ ...formData, paymentMethod: "COD" })
                      }
                      className="mt-1 text-forest-800 focus:ring-forest-800"
                    />
                    <div>
                      <p className="text-xs font-bold text-charcoal-900">
                        Cash on Delivery
                      </p>
                      <p className="text-[11px] text-charcoal-500 mt-0.5">
                        Pay upon receiving package
                      </p>
                    </div>
                  </label>
                </div>

                {/* Instructions & Transaction ID Input for Manual Payments */}
                {formData.paymentMethod !== "COD" && (
                  <div className="p-4 rounded-xl bg-sand/50 border border-brand-border space-y-3">
                    <p className="text-xs text-charcoal-700 leading-relaxed">
                      Please send the total order amount{" "}
                      <strong className="text-forest-900">{formatPrice(total)}</strong> to our
                      verified merchant/personal number:{" "}
                      <strong className="text-forest-800 font-bold">
                        {CLIENT_INFO.phonePayment}
                      </strong>{" "}
                      ({formData.paymentMethod === "BANK_TRANSFER" ? "BRAC Bank" : formData.paymentMethod}). Then input your TrxID below:
                    </p>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-charcoal-800">
                        Transaction ID (TrxID) / Bank Reference Code *
                      </label>
                      <Input
                        required
                        placeholder="e.g. BK9X7782A or BRAC-TX-88210"
                        value={formData.transactionId}
                        onChange={(e) =>
                          setFormData({ ...formData, transactionId: e.target.value })
                        }
                        className="bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary Review (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-4 sticky top-24">
                <h3 className="font-heading font-bold text-base text-charcoal-900 border-b border-sand pb-3">
                  Order Summary ({items.length} items)
                </h3>

                <div className="max-h-60 overflow-y-auto divide-y divide-sand pr-1 space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="pt-2 flex justify-between items-center text-xs"
                    >
                      <div className="pr-2">
                        <p className="font-semibold text-charcoal-900 line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-charcoal-500">
                          {item.quantity} × {formatPrice(item.product.salePrice ?? item.product.price)}
                        </p>
                      </div>
                      <span className="font-bold text-forest-900 shrink-0">
                        {formatPrice((item.product.salePrice ?? item.product.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-sand pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-charcoal-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-charcoal-600">
                    <span>Shipping ({shippingCity})</span>
                    <span>{deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}</span>
                  </div>
                  <div className="border-t border-sand-dark pt-3 flex justify-between text-base font-black text-charcoal-900">
                    <span>Payable Amount</span>
                    <span className="text-forest-900">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full shadow-lg"
                >
                  Place Order ({formatPrice(total)})
                </Button>

                <p className="text-[11px] text-charcoal-400 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-forest-800" />
                  <span>Secure 256-Bit SSL Encrypted Verification</span>
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </StorefrontLayout>
  );
}
