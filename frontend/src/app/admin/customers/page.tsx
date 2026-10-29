"use client";

import * as React from "react";
import { Users, Search, Phone, Mail, MapPin, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { customersApi } from "@/lib/api";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await customersApi.getAll();
      if (res.success) {
        setCustomers((res.data as any[]) || []);
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

  const filtered = customers.filter(
    (c) =>
      !search.trim() ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayoutShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-charcoal-900 font-heading">
              Registered Customer Accounts
            </h1>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Live customer registry, lifetime order counts, and cumulative order metrics.
            </p>
          </div>
          <Button
            variant="outline"
            size="md"
            onClick={fetchCustomers}
            disabled={loading}
            className="border-brand-border text-charcoal-700 hover:bg-sand"
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
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
        <div className="p-4 rounded-2xl border border-brand-border bg-white shadow-xs flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Input
              placeholder="Search by name, phone, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
            <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-charcoal-400" />
          </div>
          <span className="text-xs font-bold text-charcoal-600">
            Total Customers: {customers.length}
          </span>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-brand-border bg-white shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-sand/40 text-[10px] font-bold uppercase tracking-wider text-charcoal-700 border-b border-brand-border">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-center">Orders</th>
                <th className="py-3 px-4">Cumulative Spend</th>
                <th className="py-3 px-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Loader2 className="h-6 w-6 text-forest-800 animate-spin mx-auto mb-2" />
                    <p className="text-charcoal-500 text-xs">Loading customer accounts...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-charcoal-500">
                    No customers found matching search.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-sand/20 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-charcoal-900">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-charcoal-700">
                      {c.phone}
                    </td>
                    <td className="py-3.5 px-4 text-charcoal-600">
                      {c.email || "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={c.role === "ADMIN" ? "gold" : c.role === "STAFF" ? "primary" : "default"}>
                        {c.role}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-charcoal-800">
                      {c.ordersCount ?? 0}
                    </td>
                    <td className="py-3.5 px-4 font-black text-forest-900">
                      {formatPrice(Number(c.totalSpent ?? 0))}
                    </td>
                    <td className="py-3.5 px-4 text-charcoal-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayoutShell>
  );
}
