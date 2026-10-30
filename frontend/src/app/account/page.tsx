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
import { API_BASE } from "@/lib/api";

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
          const res = await fetch(`${API_BASE}/orders/track?phone=${encodeURIComponent(user.phone)}`);
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
      <div className="bg-[#FAF8F5] min-h-[calc(100vh-280px)] py-10 sm:py-16">
        <div className="max-w-[1524px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* User Welcome Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0D3B37] text-white shadow-[0_4px_20px_rgba(13,59,55,0.12)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-2xl bg-white/10 text-white font-black text-2xl flex items-center justify-center border border-white/20">
                {initials}
              </div>
              <div>
                <h1 className="font-bold text-xl sm:text-2xl text-white">
                  {user.name}
                </h1>
                <p className="text-sm text-white/80 mt-0.5">
                  {user.phone} {user.email ? `• ${user.email}` : ""}
                </p>
                <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-[#E0592A] text-white text-xs font-bold shadow-2xs">
                  {user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? "Administrator" : "Verified Customer"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {(user.role === "ADMIN" || user.role === "SUPER_ADMIN" || user.role === "STAFF") && (
                <Link href="/admin">
                  <Button variant="secondary" size="sm" className="bg-white text-[#0D3B37] hover:bg-white/90 rounded-xl font-bold text-xs h-10 px-4">
                    <ShieldCheck className="h-4 w-4 mr-1.5" />
                    Admin Dashboard
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => logout()}
                className="border-white/20 text-white hover:bg-white/10 rounded-xl font-bold text-xs h-10 px-4 cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-1.5" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2.5 pb-2">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "orders"
                  ? "bg-[#0D3B37] text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-white/80 shadow-2xs"
              }`}
            >
              Order History ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-[#0D3B37] text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-white/80 shadow-2xs"
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "addresses"
                  ? "bg-[#0D3B37] text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-white/80 shadow-2xs"
              }`}
            >
              Saved Delivery Addresses
            </button>
          </div>

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#0D3B37]">
                Recent Purchase Records
              </h2>

              {ordersLoading ? (
                <div className="p-12 text-center bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)]">
                  <Loader2 className="w-8 h-8 text-[#0D3B37] animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium">Retrieving your order records...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-6 sm:p-7 rounded-3xl bg-white shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="text-base font-extrabold text-[#0D3B37]">
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
                          <p className="text-xs text-gray-400 mt-1">
                            Ordered on {new Date(order.createdAt).toLocaleDateString()} • Payment: {order.paymentMethod}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-lg font-extrabold text-[#0D3B37]">
                            {formatPrice(Number(order.totalAmount))}
                          </span>
                          <Link href={`/track-order?order=${order.orderNumber}`}>
                            <Button variant="secondary" size="sm" className="rounded-xl h-10 px-4 bg-[#FAF8F5] hover:bg-[#0D3B37] hover:text-white text-[#0D3B37] text-xs font-bold transition-all">
                              <span>Track Delivery</span>
                              <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <div className="divide-y divide-gray-100 text-sm">
                        {order.items?.map((item: any) => (
                          <div key={item.id} className="py-2.5 flex items-center justify-between">
                            <span className="font-semibold text-gray-800">
                              {item.productName} × {item.quantity}
                            </span>
                            <span className="font-bold text-[#0D3B37]">
                              {formatPrice(Number(item.totalPrice))}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#0D3B37]/10 text-[#0D3B37] flex items-center justify-center mx-auto mb-2">
                    <ShoppingBag className="w-8 h-8 stroke-[1.8]" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">
                    No orders placed yet
                  </h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                    When you purchase handcrafted creations from SHOILPIKKABBO, your invoices, package tracking, and order history will appear here.
                  </p>
                  <Link href="/shop">
                    <Button className="h-11 px-6 bg-[#0D3B37] hover:bg-[#E0592A] text-white text-sm font-bold rounded-xl transition-all shadow-md">
                      Explore Handcrafted Collection
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="p-7 sm:p-10 rounded-3xl bg-white shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-6 max-w-2xl">
              <h2 className="text-xl font-bold text-[#0D3B37]">
                Account Credentials & Security
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-5 rounded-2xl bg-[#FAF8F5]">
                  <span className="text-gray-400 block mb-1 font-semibold uppercase tracking-wider text-[11px]">Full Name</span>
                  <span className="font-bold text-gray-900 text-base">{user.name}</span>
                </div>
                <div className="p-5 rounded-2xl bg-[#FAF8F5]">
                  <span className="text-gray-400 block mb-1 font-semibold uppercase tracking-wider text-[11px]">Primary Phone</span>
                  <span className="font-bold text-gray-900 text-base">{user.phone}</span>
                </div>
                <div className="p-5 rounded-2xl bg-[#FAF8F5]">
                  <span className="text-gray-400 block mb-1 font-semibold uppercase tracking-wider text-[11px]">Email Address</span>
                  <span className="font-bold text-gray-900 text-base">{user.email || "Not provided"}</span>
                </div>
                <div className="p-5 rounded-2xl bg-[#FAF8F5]">
                  <span className="text-gray-400 block mb-1 font-semibold uppercase tracking-wider text-[11px]">Access Role</span>
                  <span className="font-bold text-[#0D3B37] text-base">{user.role}</span>
                </div>
              </div>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div className="p-10 sm:p-14 text-center bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#0D3B37]/10 text-[#0D3B37] flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-8 h-8 stroke-[1.8]" />
              </div>
              <h3 className="font-bold text-lg text-gray-800">
                No saved addresses yet
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                Your default delivery address will be securely remembered on your next checkout.
              </p>
            </div>
          )}
        </div>
      </div>
    </StorefrontLayout>
  );
}
