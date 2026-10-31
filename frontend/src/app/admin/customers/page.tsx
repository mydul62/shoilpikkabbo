"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Loader2,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  ShoppingBag,
  ExternalLink,
  Calendar,
  Sparkles,
  CheckCircle2,
  UserCheck,
} from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { customersApi } from "@/lib/api";

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  role: string;
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
  shippingAddress?: string | null;
  lastOrderDate?: string | null;
  isRegistered?: boolean;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = React.useState<CustomerRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await customersApi.getAll();
      if (res.success) {
        setCustomers((res.data as CustomerRecord[]) || []);
      }
    } catch (err: any) {
      console.error("Failed to load customers:", err);
      setError(err?.message || "Failed to load customers from database.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.shippingAddress?.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const totalOrdersAcrossCustomers = React.useMemo(() => {
    return customers.reduce((sum, c) => sum + (c.ordersCount || 0), 0);
  }, [customers]);

  const totalRevenueAcrossCustomers = React.useMemo(() => {
    return customers.reduce((sum, c) => sum + Number(c.totalSpent || 0), 0);
  }, [customers]);

  const formatWhatsAppUrl = (phone: string, customerName: string) => {
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) clean = "880" + clean.slice(1);
    else if (!clean.startsWith("880") && clean.length === 10) clean = "880" + clean;
    const msg = encodeURIComponent(
      `Hello ${customerName}, greetings from Shoilpikkabbo! Thank you for ordering with us.`
    );
    return `https://wa.me/${clean}?text=${msg}`;
  };

  return (
    <AdminLayoutShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-charcoal-900 font-heading">
              Customer Directory & Buyer Profiles
            </h1>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Live customer registry auto-collected across all store orders and customer accounts.
            </p>
          </div>
          <Button
            variant="outline"
            size="md"
            onClick={fetchCustomers}
            disabled={loading}
            className="border-brand-border text-charcoal-700 hover:bg-sand cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-brand-border shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-charcoal-500 block uppercase tracking-wider">
                Total Customers
              </span>
              <strong className="text-xl font-black text-charcoal-900 font-heading">
                {customers.length}
              </strong>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-brand-border shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-charcoal-500 block uppercase tracking-wider">
                Total Orders Placed
              </span>
              <strong className="text-xl font-black text-charcoal-900 font-heading">
                {totalOrdersAcrossCustomers}
              </strong>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-brand-border shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-charcoal-500 block uppercase tracking-wider">
                Lifetime Revenue
              </span>
              <strong className="text-xl font-black text-emerald-900 font-heading">
                {formatPrice(totalRevenueAcrossCustomers)}
              </strong>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            <Button size="sm" variant="outline" onClick={fetchCustomers}>
              Retry
            </Button>
          </div>
        )}

        {/* Search */}
        <div className="p-4 rounded-2xl border border-brand-border bg-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Input
              placeholder="Search by customer name, phone, email, address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
            <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-charcoal-400" />
          </div>
          <span className="text-xs font-bold text-charcoal-600 whitespace-nowrap">
            Showing {filtered.length} of {customers.length} customer profiles
          </span>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-brand-border bg-white shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-sand/40 text-[10px] font-bold uppercase tracking-wider text-charcoal-700 border-b border-brand-border">
              <tr>
                <th className="py-3 px-4 min-w-[200px]">Customer</th>
                <th className="py-3 px-4 min-w-[170px]">Contact Phone</th>
                <th className="py-3 px-4 min-w-[180px]">Email</th>
                <th className="py-3 px-4 min-w-[220px]">Shipping Address</th>
                <th className="py-3 px-4 text-center min-w-[100px]">Orders</th>
                <th className="py-3 px-4 min-w-[130px]">Total Spend</th>
                <th className="py-3 px-4 min-w-[130px]">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-charcoal-500">
                    <Loader2 className="h-7 w-7 text-forest-800 animate-spin mx-auto mb-2" />
                    <p className="text-xs font-bold text-charcoal-700">Loading customer profiles from orders...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-charcoal-500">
                    <Users className="w-8 h-8 text-charcoal-300 mx-auto mb-2" />
                    <p className="font-bold text-sm text-charcoal-700">No customer records found</p>
                    <p className="text-xs text-charcoal-400 mt-1">
                      Customers who place orders on the storefront will automatically appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const initials = c.name
                    ? c.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : "CU";

                  return (
                    <tr key={c.id} className="hover:bg-sand/20 transition-colors">
                      {/* Customer Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-forest-800 text-gold-400 font-bold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-extrabold text-charcoal-900 leading-tight">
                              {c.name}
                            </p>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded mt-0.5 inline-block ${
                                c.isRegistered
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : "bg-blue-50 text-blue-800 border border-blue-200"
                              }`}
                            >
                              {c.isRegistered ? "Registered Member" : "Store Buyer"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Phone & WhatsApp */}
                      <td className="py-3.5 px-4 font-mono text-charcoal-800">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${c.phone}`}
                            className="font-bold hover:underline hover:text-forest-900 inline-flex items-center gap-1"
                            title="Call customer"
                          >
                            <Phone className="w-3 h-3 text-forest-700" />
                            <span>{c.phone}</span>
                          </a>
                          <a
                            href={formatWhatsAppUrl(c.phone, c.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-3 h-3" />
                          </a>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-charcoal-600">
                        {c.email ? (
                          <a
                            href={`mailto:${c.email}`}
                            className="hover:underline hover:text-forest-900 inline-flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3 text-charcoal-400 shrink-0" />
                            <span className="truncate max-w-[160px]">{c.email}</span>
                          </a>
                        ) : (
                          <span className="text-charcoal-400 font-mono text-[11px]">Not provided</span>
                        )}
                      </td>

                      {/* Shipping Address */}
                      <td className="py-3.5 px-4 text-charcoal-700">
                        {c.shippingAddress ? (
                          <div className="flex items-start gap-1 max-w-[240px]">
                            <MapPin className="w-3 h-3 text-forest-700 shrink-0 mt-0.5" />
                            <span className="line-clamp-2 text-[11px] leading-tight">
                              {c.shippingAddress}
                            </span>
                          </div>
                        ) : (
                          <span className="text-charcoal-400 font-mono text-[11px]">No address on file</span>
                        )}
                      </td>

                      {/* Orders Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full font-black text-xs bg-forest-50 text-forest-900 border border-forest-200">
                          {c.ordersCount || 0}
                        </span>
                      </td>

                      {/* Cumulative Spend */}
                      <td className="py-3.5 px-4">
                        <span className="font-black text-[#0D3B37] text-sm">
                          {formatPrice(Number(c.totalSpent || 0))}
                        </span>
                      </td>

                      {/* Joined Date / Last Active */}
                      <td className="py-3.5 px-4 text-charcoal-500">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Calendar className="w-3 h-3 text-charcoal-400" />
                          <span>
                            {new Date(c.lastOrderDate || c.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayoutShell>
  );
}
