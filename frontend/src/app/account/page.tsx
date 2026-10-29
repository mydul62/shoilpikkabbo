"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  Clock,
  LogOut,
  ChevronRight,
  ExternalLink,
  ShoppingBag,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = React.useState<"orders" | "profile" | "addresses">("orders");
  const [orders, setOrders] = React.useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/account");
    }
  }, [isLoading, isAuthenticated, router]);

  React.useEffect(() => {
    if (user?.phone) {
      const fetchMyOrders = async () => {
        try {
          setOrdersLoading(true);
          const res = await fetch(`http://localhost:5000/api/v1/orders/track?phone=${encodeURIComponent(user.phone)}`);
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setOrders(json.data);
          }
        } catch {
          // Keep empty array
        } finally {
          setOrdersLoading(false);
        }
      };
      fetchMyOrders();
    }
  }, [user]);

  if (isLoading) {
    return (
      <StorefrontLayout>
        <div className="min-h-[500px] flex items-center justify-center bg-[#F7F4EE]">
          <Loader2 className="w-8 h-8 text-[#143527] animate-spin" />
        </div>
      </StorefrontLayout>
    );
  }

  if (!user) {
    return null;
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "SK";

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* User Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-forest-950 text-sand border border-forest-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-forest-800 text-gold-400 font-heading font-black text-2xl flex items-center justify-center border border-gold-600/30">
              {initials}
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                {user.name}
              </h1>
              <p className="text-xs text-sand/70 mt-0.5">
                {user.phone} {user.email ? `• ${user.email}` : ""}
              </p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-gold-600 text-charcoal-950 text-[10px] font-bold">
                {user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? "Administrator" : "Verified Customer"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {(user.role === "ADMIN" || user.role === "SUPER_ADMIN" || user.role === "STAFF") && (
              <Link href="/admin">
                <Button variant="secondary" size="sm" className="bg-sand text-forest-950 hover:bg-sand/90">
                  <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                  Admin Dashboard
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
              className="border-sand/30 text-sand hover:bg-forest-900 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 mr-1.5" />
              Sign Out
            </Button>
          </div>
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
            Order History ({orders.length})
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

            {ordersLoading ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-brand-border">
                <Loader2 className="w-8 h-8 text-forest-800 animate-spin mx-auto mb-2" />
                <p className="text-xs text-charcoal-500">Retrieving your order records...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
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
                          Ordered on {new Date(order.createdAt).toLocaleDateString()} • Payment: {order.paymentMethod}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-base font-black text-forest-900">
                          {formatPrice(Number(order.totalAmount))}
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
                      {order.items?.map((item: any) => (
                        <div key={item.id} className="py-2 flex items-center justify-between">
                          <span className="font-semibold text-charcoal-800">
                            {item.productName} × {item.quantity}
                          </span>
                          <span className="text-charcoal-600">
                            {formatPrice(Number(item.totalPrice))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-brand-border space-y-4">
                <ShoppingBag className="w-12 h-12 text-charcoal-300 stroke-[1.2] mx-auto" />
                <h3 className="font-heading font-bold text-base text-charcoal-800">
                  No orders placed yet
                </h3>
                <p className="text-xs text-charcoal-500 max-w-sm mx-auto leading-relaxed">
                  When you purchase handcrafted heritage creations from SHOILPIKKABBO, your invoices, package tracking, and order history will appear here.
                </p>
                <Link href="/shop">
                  <Button className="bg-forest-800 hover:bg-forest-900 text-white text-xs">
                    Explore Handcrafted Collection
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-6 max-w-2xl">
            <h2 className="font-heading font-bold text-lg text-charcoal-900">
              Account Credentials & Security
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-sand/40 border border-sand">
                <span className="text-charcoal-500 block mb-1">Full Name</span>
                <span className="font-bold text-charcoal-900 text-sm">{user.name}</span>
              </div>
              <div className="p-4 rounded-xl bg-sand/40 border border-sand">
                <span className="text-charcoal-500 block mb-1">Primary Phone</span>
                <span className="font-bold text-charcoal-900 text-sm">{user.phone}</span>
              </div>
              <div className="p-4 rounded-xl bg-sand/40 border border-sand">
                <span className="text-charcoal-500 block mb-1">Email Address</span>
                <span className="font-bold text-charcoal-900 text-sm">{user.email || "Not provided"}</span>
              </div>
              <div className="p-4 rounded-xl bg-sand/40 border border-sand">
                <span className="text-charcoal-500 block mb-1">Access Role</span>
                <span className="font-bold text-charcoal-900 text-sm">{user.role}</span>
              </div>
            </div>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === "addresses" && (
          <div className="p-8 text-center bg-white rounded-2xl border border-brand-border space-y-4">
            <MapPin className="w-10 h-10 text-charcoal-300 stroke-[1.2] mx-auto" />
            <h3 className="font-heading font-bold text-base text-charcoal-800">
              No saved addresses yet
            </h3>
            <p className="text-xs text-charcoal-500 max-w-sm mx-auto leading-relaxed">
              Your default delivery address will be securely remembered on your next checkout.
            </p>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
