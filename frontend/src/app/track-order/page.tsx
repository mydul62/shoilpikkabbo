"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  Check,
  Package,
  Truck,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { MOCK_ORDERS, CLIENT_INFO, Order } from "@/data/mock-data";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderParam = searchParams?.get("order") || "";
  const initialPhoneParam = searchParams?.get("phone") || "";

  const [orderQuery, setOrderQuery] = React.useState(
    initialOrderParam || "SK-261102-1042"
  );
  const [phoneQuery, setPhoneQuery] = React.useState(
    initialPhoneParam || "01700 000000"
  );

  const [matchedOrder, setMatchedOrder] = React.useState<Order | null>(() => {
    const lookup = initialOrderParam || "SK-261102-1042";
    const found = MOCK_ORDERS.find(
      (o) => o.orderNumber.toLowerCase() === lookup.toLowerCase()
    );
    return found || MOCK_ORDERS[0];
  });

  const [hasSearched, setHasSearched] = React.useState(true);

  React.useEffect(() => {
    if (initialOrderParam) {
      setOrderQuery(initialOrderParam);
      const found = MOCK_ORDERS.find(
        (o) => o.orderNumber.toLowerCase() === initialOrderParam.toLowerCase()
      );
      if (found) {
        setMatchedOrder(found);
        setHasSearched(true);
      }
    }
  }, [initialOrderParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const cleanOrder = orderQuery.trim().toLowerCase();
    const cleanPhone = phoneQuery.trim();

    const found = MOCK_ORDERS.find((o) => {
      const matchNum = o.orderNumber.toLowerCase() === cleanOrder;
      const matchPhone = cleanPhone
        ? o.customerPhone.replace(/\s+/g, "").includes(cleanPhone.replace(/\s+/g, ""))
        : true;
      return matchNum && matchPhone;
    });

    setMatchedOrder(found || null);
  };

  // Timeline events for Nusrat's delivered order (or dynamically generated)
  const isDelivered = matchedOrder?.orderStatus === "DELIVERED";
  const isShipped = matchedOrder?.orderStatus === "SHIPPED";
  const isProcessing = matchedOrder?.orderStatus === "PROCESSING";

  const timelineSteps = [
    {
      icon: Check,
      title: "Order confirmed",
      description: "Payment verified. Your order is being prepared.",
      time: "2 Nov · 10:24 AM",
      active: true,
    },
    {
      icon: Package,
      title: "Courier pickup",
      description: "Parcel collected for delivery · Dhaka dispatch point.",
      time: "3 Nov · 11:10 AM",
      active: isProcessing || isShipped || isDelivered,
    },
    {
      icon: Truck,
      title: "In transit",
      description: "Parcel reached the Dhaka sorting location.",
      time: "3 Nov · 5:40 PM",
      active: isShipped || isDelivered,
    },
    {
      icon: MapPin,
      title: "Out for delivery",
      description: "Dhanmondi delivery area · Dhaka.",
      time: "4 Nov · 9:15 AM",
      active: isShipped || isDelivered,
    },
    {
      icon: CheckCircle2,
      title: "Delivered",
      description: `Received by ${matchedOrder?.customerName.split(" ")[0] || "Nusrat"} · Dhanmondi, Dhaka 1209.`,
      time: "4 Nov · 2:35 PM",
      active: isDelivered,
    },
  ];

  return (
    <div className="bg-[#F7F4EE] min-h-[calc(100vh-280px)] py-10 sm:py-16">
      <div className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-[12px] text-[#7A837C] font-light mb-4">
          <Link href="/" className="hover:text-[#143527] transition-colors">
            Home
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-[#143527]">Track an order</span>
        </nav>

        {/* Page Title & Subtitle */}
        <h1 className="font-serif text-3xl sm:text-[42px] text-[#143527] font-normal tracking-tight leading-tight">
          Follow your thoughtful finds.
        </h1>
        <p className="text-[13.5px] sm:text-[14px] text-[#556059] font-light mt-2 mb-8">
          Use your order number and the phone number you checked out with.
        </p>

        {/* Search Bar / Card */}
        <form
          onSubmit={handleSearch}
          className="bg-[#EFECE6] border border-[#E5DFD3] rounded-[4px] p-5 sm:p-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-5">
              <label className="text-[11.5px] font-medium text-[#143527] block mb-1.5">
                Order number
              </label>
              <input
                type="text"
                required
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="SK-261102-1042"
                className="w-full h-11 px-3.5 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="text-[11.5px] font-medium text-[#143527] block mb-1.5">
                Phone number
              </label>
              <input
                type="text"
                value={phoneQuery}
                onChange={(e) => setPhoneQuery(e.target.value)}
                placeholder="01700 000000"
                className="w-full h-11 px-3.5 bg-white border border-[#D5CDC0] rounded-[2px] text-[13px] text-[#143527] focus:outline-none focus:border-[#143527] transition-colors"
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full h-11 bg-[#143527] hover:bg-[#1B4332] text-white text-[13px] font-medium rounded-[3px] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <span>Track order</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>

        {/* Tracking Details View */}
        {hasSearched && matchedOrder ? (
          <div className="mt-12">
            {/* Order Header & Delivered Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-[26px] sm:text-[30px] text-[#143527] font-normal tracking-tight">
                  Order {matchedOrder.orderNumber}
                </h2>
                <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-medium bg-[#E5ECE6] text-[#143527] border border-[#D5DDD6]">
                  {matchedOrder.orderStatus === "DELIVERED"
                    ? "Delivered"
                    : matchedOrder.orderStatus === "SHIPPED"
                    ? "In Transit"
                    : matchedOrder.orderStatus}
                </span>
              </div>
            </div>
            <p className="text-[12px] text-[#8C948E] font-light mb-8">
              Last updated 4 Nov 2026, 2:35 PM · All times Bangladesh time
            </p>

            {/* Two Column Delivery Journey */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left Column: 5 Timeline Milestones (8 cols) */}
              <div className="lg:col-span-8 space-y-6 sm:space-y-7">
                {timelineSteps.map((step, idx) => {
                  const IconComponent = step.icon;
                  return (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 sm:gap-4 py-1"
                    >
                      <div className="flex items-start gap-3.5 sm:gap-4">
                        <div
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            step.active
                              ? "bg-[#E5ECE7] text-[#143527]"
                              : "bg-[#EFECE6] text-[#A0A8A2]"
                          }`}
                        >
                          <IconComponent className="w-4 h-4 stroke-[2.2]" />
                        </div>
                        <div>
                          <h4 className="text-[13.5px] font-medium text-[#143527]">
                            {step.title}
                          </h4>
                          <p className="text-[12px] text-[#6F7771] font-light mt-0.5 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] sm:text-[11.5px] text-[#8C948E] font-light shrink-0 text-left sm:text-right pl-11.5 sm:pl-0 pt-0.5">
                        {step.time}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Safely at your door card (4 cols) */}
              <div className="lg:col-span-4">
                <div className="bg-white border border-[#E8E2D8] rounded-xl p-6 sm:p-7 shadow-xs">
                  <span className="text-[10px] font-semibold text-[#B85D38] uppercase tracking-widest block mb-2">
                    DELIVERY COMPLETE
                  </span>
                  <h3 className="font-serif text-[24px] text-[#143527] font-normal leading-tight mb-4">
                    Safely at your door.
                  </h3>

                  {/* Recipient Address */}
                  <div className="text-[13px] text-[#333E35] leading-relaxed font-light mb-4">
                    <p className="font-medium text-[#143527]">
                      {matchedOrder.customerName}
                    </p>
                    <p>{matchedOrder.shippingAddress}</p>
                    <p>{matchedOrder.city}</p>
                    <p>{matchedOrder.customerPhone}</p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#F0EBE1] pt-3.5 mb-3.5 space-y-1 text-[12px] text-[#6F7771] font-light">
                    <p>Delivery method: Standard delivery</p>
                    <p>Order placed: 2 Nov 2026</p>
                    <p>Total paid: ৳{matchedOrder.finalAmount.toLocaleString()}</p>
                  </div>

                  {/* Advisory Notice */}
                  <p className="text-[11px] text-[#8C948E] font-light leading-relaxed mb-5">
                    Location updates appear when available. This view shows
                    shipment events, not a live GPS location.
                  </p>

                  {/* Action Button */}
                  <a
                    href={`https://wa.me/${CLIENT_INFO.whatsapp || "8801731214379"}?text=Hello%20Shoilpikkabbo%2C%20I%20have%20an%20inquiry%20about%20Order%20${matchedOrder.orderNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-11 bg-[#143527] hover:bg-[#1B4332] text-white text-[13px] font-medium rounded-[3px] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Contact delivery support</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>

                  {/* Quick Channels subtext */}
                  <div className="mt-4 pt-3 text-[11px] text-[#8C948E] text-center font-light leading-relaxed">
                    <p>WhatsApp · Facebook Messenger</p>
                    <p>
                      {CLIENT_INFO.phonePrimary} · {CLIENT_INFO.phoneSecondary}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-12 bg-white border border-[#E8E2D8] rounded-xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
            <h3 className="font-serif text-[22px] text-[#143527] font-normal mb-2">
              Order not found
            </h3>
            <p className="text-[13px] text-[#6F7771] font-light leading-relaxed mb-6">
              We couldn't find an order matching "{orderQuery}". Please verify
              your reference number or phone number.
            </p>
            <button
              onClick={() => {
                setOrderQuery("SK-261102-1042");
                setPhoneQuery("01700 000000");
                const found = MOCK_ORDERS.find(
                  (o) => o.orderNumber === "SK-261102-1042"
                );
                if (found) setMatchedOrder(found);
              }}
              className="h-10 px-6 bg-[#143527] hover:bg-[#1B4332] text-white text-[13px] font-medium rounded-[3px] inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>View demo order SK-261102-1042</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <StorefrontLayout>
      <React.Suspense
        fallback={
          <div className="min-h-[500px] flex items-center justify-center bg-[#F7F4EE]">
            <p className="text-[13px] text-[#6F7771] font-light">
              Loading order tracker...
            </p>
          </div>
        }
      >
        <TrackOrderContent />
      </React.Suspense>
    </StorefrontLayout>
  );
}
