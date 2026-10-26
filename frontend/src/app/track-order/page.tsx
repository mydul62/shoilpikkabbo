"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  AlertCircle,
  Phone,
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MOCK_ORDERS, CLIENT_INFO, Order } from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get("order") || "";

  const [orderQuery, setOrderQuery] = React.useState(initialOrder);
  const [phoneQuery, setPhoneQuery] = React.useState("");
  const [matchedOrder, setMatchedOrder] = React.useState<Order | null>(null);
  const [hasSearched, setHasSearched] = React.useState(false);

  React.useEffect(() => {
    if (initialOrder) {
      const found = MOCK_ORDERS.find(
        (o) => o.orderNumber.toLowerCase() === initialOrder.toLowerCase()
      );
      if (found) {
        setMatchedOrder(found);
        setHasSearched(true);
      }
    }
  }, [initialOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const cleanOrder = orderQuery.trim().toLowerCase();
    const cleanPhone = phoneQuery.trim();

    const found = MOCK_ORDERS.find((o) => {
      const matchNum = o.orderNumber.toLowerCase() === cleanOrder;
      const matchPhone = cleanPhone ? o.customerPhone.includes(cleanPhone) : true;
      return matchNum && matchPhone;
    });

    setMatchedOrder(found || null);
  };

  const steps = [
    { title: "Order Placed", status: "complete", desc: "Order details received" },
    {
      title: "Payment Verified",
      status:
        matchedOrder?.paymentStatus === "PAID"
          ? "complete"
          : matchedOrder?.orderStatus === "CANCELLED"
          ? "error"
          : "current",
      desc:
        matchedOrder?.paymentStatus === "PAID"
          ? "TrxID verified by staff"
          : "Pending verification",
    },
    {
      title: "Packaging & QA",
      status:
        matchedOrder?.orderStatus === "PROCESSING" ||
        matchedOrder?.orderStatus === "SHIPPED" ||
        matchedOrder?.orderStatus === "DELIVERED"
          ? "complete"
          : "upcoming",
      desc: "Fragile check & bubble wrap",
    },
    {
      title: "In Transit",
      status:
        matchedOrder?.orderStatus === "SHIPPED" ||
        matchedOrder?.orderStatus === "DELIVERED"
          ? "complete"
          : "upcoming",
      desc: "Dispatched to delivery partner",
    },
    {
      title: "Delivered",
      status:
        matchedOrder?.orderStatus === "DELIVERED" ? "complete" : "upcoming",
      desc: "Handed over to customer",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center space-y-3 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 font-heading">
          Track Your Delivery
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500 max-w-md mx-auto">
          Enter your order reference code (e.g. SK-2026-101) to view real-time fulfillment status.
        </p>
      </div>

      {/* Search Card */}
      <form
        onSubmit={handleSearch}
        className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-4 mb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-charcoal-800">
              Order Reference Number *
            </label>
            <Input
              required
              placeholder="e.g. SK-2026-101"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              className="uppercase"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-charcoal-800">
              Customer Phone Number (Optional verification)
            </label>
            <Input
              type="tel"
              placeholder="e.g. 017XXXXXXXX"
              value={phoneQuery}
              onChange={(e) => setPhoneQuery(e.target.value)}
            />
          </div>
        </div>
        <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto">
          <Search className="h-4 w-4 mr-2" />
          Track Order
        </Button>
      </form>

      {/* Result Display */}
      {hasSearched && (
        <>
          {matchedOrder ? (
            <div className="space-y-6">
              {/* Status Header Banner */}
              <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-forest-900">
                      {matchedOrder.orderNumber}
                    </span>
                    <Badge
                      variant={
                        matchedOrder.orderStatus === "DELIVERED"
                          ? "success"
                          : matchedOrder.orderStatus === "SHIPPED"
                          ? "primary"
                          : matchedOrder.orderStatus === "PROCESSING"
                          ? "warning"
                          : "default"
                      }
                    >
                      {matchedOrder.orderStatus}
                    </Badge>
                  </div>
                  <p className="text-xs text-charcoal-500 mt-1">
                    Placed on: {matchedOrder.createdAt} • Recipient: {matchedOrder.customerName}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-charcoal-500 block">Total Payable</span>
                  <span className="text-lg font-black text-forest-900">
                    {formatPrice(matchedOrder.finalAmount)}
                  </span>
                </div>
              </div>

              {/* Visual Timeline */}
              <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-6">
                <h3 className="font-heading font-bold text-sm text-charcoal-900 uppercase tracking-wider">
                  Fulfillment Timeline
                </h3>
                <div className="relative border-l-2 border-forest-800/30 ml-4 pl-6 space-y-8">
                  {steps.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 border-white shadow-xs ${
                          step.status === "complete"
                            ? "bg-emerald-600"
                            : step.status === "current"
                            ? "bg-amber-500 ring-4 ring-amber-100"
                            : "bg-sand-dark"
                        }`}
                      />
                      <div>
                        <h4
                          className={`text-sm font-bold ${
                            step.status === "complete"
                              ? "text-emerald-800"
                              : step.status === "current"
                              ? "text-amber-800"
                              : "text-charcoal-400"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p className="text-xs text-charcoal-500 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Items & Shipping Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-3">
                  <h4 className="font-heading font-bold text-xs text-charcoal-900 uppercase tracking-wider">
                    Shipping Details
                  </h4>
                  <p className="text-xs text-charcoal-800 leading-relaxed">
                    <strong>Address:</strong> {matchedOrder.shippingAddress}, {matchedOrder.city}
                  </p>
                  <p className="text-xs text-charcoal-800">
                    <strong>Contact:</strong> {matchedOrder.customerPhone}
                  </p>
                  <p className="text-xs text-charcoal-800">
                    <strong>Payment:</strong> {matchedOrder.paymentMethod} (TrxID:{" "}
                    {matchedOrder.transactionId || "Pending"})
                  </p>
                </div>

                <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-3">
                  <h4 className="font-heading font-bold text-xs text-charcoal-900 uppercase tracking-wider">
                    Package Contents
                  </h4>
                  <div className="divide-y divide-sand text-xs">
                    {matchedOrder.items.map((it) => (
                      <div key={it.id} className="py-2 flex justify-between">
                        <span>
                          {it.productName} × {it.quantity}
                        </span>
                        <span className="font-bold text-forest-900">
                          {formatPrice(it.price * it.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 rounded-2xl border border-brand-border bg-white text-center space-y-3">
              <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
              <h3 className="font-heading font-bold text-base text-charcoal-900">
                Order Not Found
              </h3>
              <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                No matching record found for "{orderQuery}". Try SK-2026-101 or contact customer care at {CLIENT_INFO.phonePrimary}.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <StorefrontLayout>
      <React.Suspense fallback={<div className="p-12 text-center text-xs">Loading order tracker...</div>}>
        <TrackOrderContent />
      </React.Suspense>
    </StorefrontLayout>
  );
}
