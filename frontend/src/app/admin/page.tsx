"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Clock,
  TrendingUp,
  Package,
  AlertTriangle,
  Users,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
} from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MOCK_ORDERS,
  MOCK_PAYMENTS,
  MOCK_PRODUCTS,
  MOCK_INQUIRIES,
  MOCK_CATEGORIES,
} from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";

export default function AdminOverviewPage() {
  const [payments, setPayments] = React.useState(MOCK_PAYMENTS);

  const totalOrders = MOCK_ORDERS.length;
  const pendingOrders = MOCK_ORDERS.filter((o) => o.orderStatus === "PENDING").length;
  const totalRevenue = MOCK_ORDERS.reduce(
    (acc, o) => (o.paymentStatus === "PAID" ? acc + o.finalAmount : acc),
    0
  );
  const totalProducts = MOCK_PRODUCTS.length;
  const lowStockProducts = MOCK_PRODUCTS.filter((p) => p.stock <= 20).length;
  const pendingPayments = payments.filter((p) => p.status === "PENDING").length;

  const handleVerifyPayment = (paymentId: string, status: "VERIFIED" | "REJECTED") => {
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status } : p))
    );
  };

  return (
    <AdminLayoutShell>
      <div className="space-y-8">
        {/* Page Title & Quick Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-charcoal-900 font-heading">
              Store Operations Overview
            </h1>
            <p className="text-xs text-charcoal-500 mt-1">
              Live operational metrics, order fulfillments, and payment verification queue.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/products">
              <Button variant="primary" size="sm">
                <Package className="h-4 w-4 mr-1.5" />
                Add New Product
              </Button>
            </Link>
          </div>
        </div>

        {/* 7 Key Operational Summary KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Confirmed Revenue */}
          <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">
                Confirmed Revenue
              </span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-forest-900 font-heading mt-3">
              {formatPrice(totalRevenue)}
            </p>
            <p className="text-[10px] text-emerald-700 font-medium mt-1">
              +14.2% from last month
            </p>
          </div>

          {/* Total Orders */}
          <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">
                Total Orders
              </span>
              <div className="h-8 w-8 rounded-lg bg-forest-50 text-forest-800 flex items-center justify-center">
                <ShoppingCart className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-charcoal-900 font-heading mt-3">
              {totalOrders}
            </p>
            <p className="text-[10px] text-charcoal-500 mt-1">
              Across all categories
            </p>
          </div>

          {/* Pending Orders */}
          <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">
                Pending Orders
              </span>
              <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-700 font-heading mt-3">
              {pendingOrders}
            </p>
            <p className="text-[10px] text-amber-700 font-medium mt-1">
              Awaiting confirmation
            </p>
          </div>

          {/* Pending Payment Verifications */}
          <div className="p-5 rounded-2xl bg-white border-2 border-rose-300 bg-rose-50/20 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
                Pending Verifications
              </span>
              <div className="h-8 w-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-rose-800 font-heading mt-3">
              {pendingPayments}
            </p>
            <p className="text-[10px] text-rose-700 font-medium mt-1">
              Requires manual bKash/Nagad audit
            </p>
          </div>

          {/* Total Catalog Products */}
          <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">
                Active Catalog
              </span>
              <div className="h-8 w-8 rounded-lg bg-sand text-charcoal-700 flex items-center justify-center">
                <Package className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-charcoal-900 font-heading mt-3">
              {totalProducts}
            </p>
            <p className="text-[10px] text-charcoal-500 mt-1">
              In 10 categories
            </p>
          </div>

          {/* Low Stock Alerts */}
          <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">
                Low Stock Items
              </span>
              <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-800 font-heading mt-3">
              {lowStockProducts}
            </p>
            <p className="text-[10px] text-charcoal-500 mt-1">
              &le; 20 units remaining
            </p>
          </div>

          {/* Registered Customers */}
          <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">
                Customer Base
              </span>
              <div className="h-8 w-8 rounded-lg bg-forest-50 text-forest-800 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-charcoal-900 font-heading mt-3">
              428
            </p>
            <p className="text-[10px] text-charcoal-500 mt-1">
              Active buyer accounts
            </p>
          </div>
        </div>

        {/* Payment Verification Queue */}
        <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-sand pb-3">
            <div>
              <h2 className="font-heading font-bold text-base text-charcoal-900">
                Manual Payment Verification Queue
              </h2>
              <p className="text-xs text-charcoal-500">
                Audit incoming bKash, Nagad, and BRAC Bank transaction reference IDs.
              </p>
            </div>
            <Link
              href="/admin/payments"
              className="text-xs font-bold text-forest-800 hover:underline flex items-center gap-1"
            >
              <span>View All Payments</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand/40 text-charcoal-700 uppercase tracking-wider text-[10px] font-bold border-b border-brand-border">
                <tr>
                  <th className="py-2.5 px-3">Order #</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">TrxID Reference</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-sand/20 transition-colors">
                    <td className="py-3 px-3 font-bold text-forest-900">
                      {p.orderNumber}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-charcoal-900 block">
                        {p.customerName}
                      </span>
                      <span className="text-[10px] text-charcoal-500">
                        {p.senderPhone}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-charcoal-800">
                      {p.method}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-charcoal-900 bg-sand/30 rounded px-1.5 py-0.5">
                      {p.transactionId}
                    </td>
                    <td className="py-3 px-3 font-black text-forest-900">
                      {formatPrice(p.amount)}
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          p.status === "VERIFIED"
                            ? "success"
                            : p.status === "REJECTED"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5">
                      {p.status === "PENDING" ? (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleVerifyPayment(p.id, "VERIFIED")}
                            className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleVerifyPayment(p.id, "REJECTED")}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <span className="text-[11px] text-charcoal-400">
                          Audited
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders & Special E-Sheba Inquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Orders Table (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-sand pb-3">
              <h2 className="font-heading font-bold text-base text-charcoal-900">
                Recent Store Orders
              </h2>
              <Link
                href="/admin/orders"
                className="text-xs font-bold text-forest-800 hover:underline"
              >
                All Orders ➔
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-sand/40 text-[10px] font-bold text-charcoal-600 uppercase border-b border-brand-border">
                  <tr>
                    <th className="py-2 px-3">Order</th>
                    <th className="py-2 px-3">Customer</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand">
                  {MOCK_ORDERS.map((ord) => (
                    <tr key={ord.id} className="hover:bg-sand/20">
                      <td className="py-2.5 px-3 font-bold text-forest-900">
                        {ord.orderNumber}
                      </td>
                      <td className="py-2.5 px-3 text-charcoal-800">
                        {ord.customerName}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant={
                            ord.orderStatus === "DELIVERED"
                              ? "success"
                              : ord.orderStatus === "SHIPPED"
                              ? "primary"
                              : ord.orderStatus === "PROCESSING"
                              ? "warning"
                              : "default"
                          }
                        >
                          {ord.orderStatus}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-forest-900">
                        {formatPrice(ord.finalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent E-Sheba Inquiries (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-sand pb-3">
              <h2 className="font-heading font-bold text-base text-charcoal-900 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-forest-800" />
                <span>Special E-Sheba Inquiries</span>
              </h2>
              <Link
                href="/admin/inquiries"
                className="text-xs font-bold text-forest-800 hover:underline"
              >
                Manage ➔
              </Link>
            </div>

            <div className="space-y-3">
              {MOCK_INQUIRIES.map((inq) => (
                <div
                  key={inq.id}
                  className="p-3.5 rounded-xl border border-brand-border bg-sand/20 space-y-1.5"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-xs text-charcoal-900">
                      {inq.customerName}
                    </span>
                    <Badge variant={inq.status === "NEW" ? "gold" : "primary"}>
                      {inq.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-forest-800 font-semibold">
                    {inq.serviceType}
                  </p>
                  <p className="text-[11px] text-charcoal-600 line-clamp-2">
                    {inq.requirements}
                  </p>
                  <p className="text-[10px] text-charcoal-400 pt-1">
                    Contact: {inq.customerPhone} • {inq.submittedAt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayoutShell>
  );
}
