"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  Package,
  MapPin,
  Clock,
  LogOut,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_ORDERS } from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";

export default function AccountPage() {
  const [activeTab, setActiveTab] = React.useState<"orders" | "profile" | "addresses">("orders");

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* User Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-forest-950 text-sand border border-forest-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-forest-800 text-gold-400 font-heading font-black text-2xl flex items-center justify-center border border-gold-600/30">
              TA
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                Tanvir Ahmed
              </h1>
              <p className="text-xs text-sand/70 mt-0.5">
                01712345678 • tanvir.ahmed@example.com
              </p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-gold-600 text-charcoal-950 text-[10px] font-bold">
                Loyal Customer
              </span>
            </div>
          </div>

          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="border-sand/30 text-sand hover:bg-forest-900"
            >
              <LogOut className="h-3.5 w-3.5 mr-1.5" />
              Sign Out
            </Button>
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-sand pb-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "orders"
                ? "bg-forest-800 text-white"
                : "text-charcoal-600 hover:bg-sand"
            }`}
          >
            Order History ({MOCK_ORDERS.length})
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "profile"
                ? "bg-forest-800 text-white"
                : "text-charcoal-600 hover:bg-sand"
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("addresses")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "addresses"
                ? "bg-forest-800 text-white"
                : "text-charcoal-600 hover:bg-sand"
            }`}
          >
            Saved Delivery Addresses
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-lg text-charcoal-900">
              Recent Purchase Records
            </h2>
            <div className="space-y-4">
              {MOCK_ORDERS.map((order) => (
                <div
                  key={order.id}
                  className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-forest-900">
                          {order.orderNumber}
                        </span>
                        <Badge
                          variant={
                            order.orderStatus === "DELIVERED"
                              ? "success"
                              : order.orderStatus === "SHIPPED"
                              ? "primary"
                              : order.orderStatus === "PROCESSING"
                              ? "warning"
                              : "default"
                          }
                        >
                          {order.orderStatus}
                        </Badge>
                      </div>
                      <p className="text-xs text-charcoal-400 mt-1">
                        Ordered on {order.createdAt} • Payment: {order.paymentMethod} (
                        {order.paymentStatus})
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-forest-900">
                        {formatPrice(order.finalAmount)}
                      </span>
                      <Link href={`/track-order?order=${order.orderNumber}`}>
                        <Button variant="secondary" size="sm">
                          <span>Track Delivery</span>
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="divide-y divide-sand text-xs">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="py-2 flex items-center justify-between"
                      >
                        <span className="font-semibold text-charcoal-800">
                          {item.productName} × {item.quantity}
                        </span>
                        <span className="font-bold text-forest-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-between text-xs text-charcoal-500 border-t border-sand">
                    <span>Shipping Address: {order.shippingAddress}, {order.city}</span>
                    <span>Includes ৳{order.deliveryCharge} delivery charge</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs max-w-xl space-y-4">
            <h3 className="font-heading font-bold text-base text-charcoal-900 border-b border-sand pb-3">
              Personal Information
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-charcoal-500 block">Full Name</label>
                <p className="font-bold text-charcoal-900 text-sm mt-0.5">Tanvir Ahmed</p>
              </div>
              <div>
                <label className="text-charcoal-500 block">Contact Phone</label>
                <p className="font-bold text-charcoal-900 text-sm mt-0.5">01712345678</p>
              </div>
              <div>
                <label className="text-charcoal-500 block">Email Address</label>
                <p className="font-bold text-charcoal-900 text-sm mt-0.5">tanvir.ahmed@example.com</p>
              </div>
            </div>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert("Profile update saved.")}
              >
                Edit Profile Information
              </Button>
            </div>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === "addresses" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border-2 border-forest-800/40 bg-forest-50/30 shadow-xs space-y-3 relative">
              <span className="px-2 py-0.5 rounded-full bg-forest-800 text-white text-[10px] font-bold">
                Default Shipping Address
              </span>
              <h4 className="font-heading font-bold text-sm text-charcoal-900">
                Home (Banani, Dhaka)
              </h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                House 42, Road 11, Block D, Banani, Dhaka-1213
              </p>
              <p className="text-xs text-charcoal-600">
                Phone: 01712345678
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-dashed border-sand-dark bg-white shadow-xs flex flex-col items-center justify-center text-center p-8 space-y-2">
              <MapPin className="h-8 w-8 text-charcoal-400" />
              <p className="text-xs font-semibold text-charcoal-700">
                Add Another Delivery Address
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => alert("Address addition form opens.")}
              >
                Add Address
              </Button>
            </div>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
