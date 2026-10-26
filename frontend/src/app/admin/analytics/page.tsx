"use client";

import * as React from "react";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  CreditCard,
  ShoppingBag,
  ArrowUpRight,
} from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Badge } from "@/components/ui/badge";
import { MOCK_PRODUCTS } from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  const monthlyData = [
    { month: "May", sales: 124000, orders: 48 },
    { month: "Jun", sales: 148000, orders: 56 },
    { month: "Jul", sales: 189000, orders: 72 },
    { month: "Aug", sales: 215000, orders: 84 },
    { month: "Sep", sales: 268000, orders: 104 },
    { month: "Oct", sales: 342000, orders: 138 },
  ];

  const maxSale = Math.max(...monthlyData.map((m) => m.sales));

  return (
    <AdminLayoutShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-charcoal-900 font-heading">
            Sales & Commerce Analytics
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Historical sales volume, category revenue distribution, and payment preferences.
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-2">
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
              Monthly Revenue Run-Rate
            </span>
            <p className="font-heading font-black text-3xl text-forest-900">
              ৳342,000
            </p>
            <p className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+27.6% growth this quarter</span>
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-2">
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
              Average Order Value (AOV)
            </span>
            <p className="font-heading font-black text-3xl text-charcoal-900">
              ৳2,478
            </p>
            <p className="text-xs text-charcoal-500">
              Driven by corporate gift sets & pottery collections
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-2">
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
              Repeat Customer Rate
            </span>
            <p className="font-heading font-black text-3xl text-gold-600">
              34.8%
            </p>
            <p className="text-xs text-charcoal-500">
              High retention on organic health oils & jute decor
            </p>
          </div>
        </div>

        {/* Sales Trend Bar Chart */}
        <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-sand pb-4">
            <div>
              <h2 className="font-heading font-bold text-base text-charcoal-900">
                Monthly Revenue Trend (Last 6 Months)
              </h2>
              <p className="text-xs text-charcoal-500">
                Gross sales figures in Bangladeshi Taka (BDT)
              </p>
            </div>
            <Badge variant="primary">2026 Growth Metric</Badge>
          </div>

          <div className="h-64 flex items-end gap-4 sm:gap-8 pt-8 px-4">
            {monthlyData.map((item) => {
              const heightPercent = Math.round((item.sales / maxSale) * 100);
              return (
                <div
                  key={item.month}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                >
                  <span className="text-[10px] font-bold text-charcoal-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    ৳{Math.round(item.sales / 1000)}k
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[48px] rounded-t-xl bg-forest-800 group-hover:bg-gold-600 transition-all duration-300 shadow-xs"
                  />
                  <span className="text-xs font-bold text-charcoal-700">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown & Payment Method Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Selling Products */}
          <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-4">
            <h3 className="font-heading font-bold text-base text-charcoal-900 border-b border-sand pb-3">
              Top Products by Volume
            </h3>
            <div className="divide-y divide-sand text-xs">
              {MOCK_PRODUCTS.slice(0, 4).map((p, idx) => (
                <div key={p.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full bg-sand text-charcoal-800 font-bold flex items-center justify-center text-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-charcoal-900 line-clamp-1">
                        {p.name}
                      </p>
                      <p className="text-charcoal-400 text-[11px]">{p.categoryName}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-forest-900">
                    {formatPrice(p.salePrice ?? p.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Share */}
          <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-4">
            <h3 className="font-heading font-bold text-base text-charcoal-900 border-b border-sand pb-3">
              Payment Gateway & Channel Distribution
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-bold text-charcoal-800 mb-1">
                  <span>bKash Manual & Merchant</span>
                  <span>58%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-sand overflow-hidden">
                  <div className="h-full bg-pink-500 rounded-full w-[58%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-charcoal-800 mb-1">
                  <span>Cash on Delivery (COD)</span>
                  <span>24%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-sand overflow-hidden">
                  <div className="h-full bg-forest-800 rounded-full w-[24%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-charcoal-800 mb-1">
                  <span>Nagad Manual Transfer</span>
                  <span>12%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-sand overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[12%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-charcoal-800 mb-1">
                  <span>BRAC Bank PLC Wire</span>
                  <span>6%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-sand overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-[6%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayoutShell>
  );
}
