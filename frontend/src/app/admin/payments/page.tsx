"use client";

import * as React from "react";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Search,
  AlertCircle,
  Phone,
  ShieldCheck,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CLIENT_INFO } from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";
import { paymentsApi } from "@/lib/api";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("ALL");
  const [error, setError] = React.useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await paymentsApi.getAll();
      if (res.success) {
        setPayments((res.data as any[]) || []);
      }
    } catch (err: any) {
      console.error("Failed to load payments:", err);
      setError(err?.message || "Failed to load payment records.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPayments();
  }, []);

  const filtered = payments.filter((p) => {
    const matchStatus = filter === "ALL" || p.status === filter;
    const orderNum = p.order?.orderNumber || "";
    const customer = p.order?.customerName || "";
    const phone = p.senderPhone || p.order?.customerPhone || "";
    const trx = p.transactionId || "";

    const matchQuery =
      !search.trim() ||
      orderNum.toLowerCase().includes(search.toLowerCase()) ||
      trx.toLowerCase().includes(search.toLowerCase()) ||
      customer.toLowerCase().includes(search.toLowerCase()) ||
      phone.includes(search);
    return matchStatus && matchQuery;
  });

  const handleUpdate = async (id: string, status: "VERIFIED" | "REJECTED") => {
    try {
      setActionLoading(id);
      const res = await paymentsApi.verify(id, status);
      if (res.success) {
        setPayments((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status } : p))
        );
      }
    } catch (err: any) {
      alert("Error updating payment verification: " + (err?.message || "Server error"));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <AdminLayoutShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-charcoal-900 font-heading">
              Payment Verification & Audit
            </h1>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Audit manual bKash/Nagad transfers and BRAC Bank wire references before dispatching orders.
            </p>
          </div>
          <Button
            variant="outline"
            size="md"
            onClick={fetchPayments}
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
            <Button size="sm" variant="outline" onClick={fetchPayments}>
              Retry
            </Button>
          </div>
        )}

        {/* Info Banner */}
        <div className="p-4 rounded-xl bg-forest-900 text-sand flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-gold-500 shrink-0" />
            <span>
              Official Recipient Number: <strong>{CLIENT_INFO.phonePayment}</strong> | Banking Partner: <strong>{CLIENT_INFO.bankName}</strong>
            </span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="p-4 rounded-2xl border border-brand-border bg-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Input
              placeholder="Search by TrxID, order #, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
            <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-charcoal-400" />
          </div>

          <div className="flex items-center gap-2">
            {["ALL", "PENDING", "VERIFIED", "REJECTED"].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filter === st
                    ? "bg-forest-800 text-white"
                    : "bg-sand/40 text-charcoal-700 hover:bg-sand"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Payments Table */}
        <div className="rounded-2xl border border-brand-border bg-white shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-sand/40 text-[10px] font-bold uppercase tracking-wider text-charcoal-700 border-b border-brand-border">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer & Sender</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Transaction ID (TrxID)</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Audit Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Loader2 className="h-6 w-6 text-forest-800 animate-spin mx-auto mb-2" />
                    <p className="text-charcoal-500 text-xs">Loading payments from database...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-charcoal-500">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-sand/20 transition-colors">
                    <td className="py-3.5 px-4 font-black text-forest-900">
                      {item.order?.orderNumber || "—"}
                      <span className="block text-[10px] text-charcoal-400 font-normal">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-charcoal-900">
                        {item.order?.customerName || "Customer"}
                      </p>
                      <p className="text-[10px] text-charcoal-500 flex items-center gap-1 mt-0.5">
                        <Phone className="h-2.5 w-2.5" />
                        {item.senderPhone || item.order?.customerPhone || "—"}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-charcoal-800">
                      {item.method}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-charcoal-900">
                      <span className="bg-sand px-2 py-1 rounded border border-sand-dark">
                        {item.transactionId || "—"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-forest-900">
                      {formatPrice(Number(item.amount))}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          item.status === "VERIFIED"
                            ? "success"
                            : item.status === "REJECTED"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      {item.status === "PENDING" ? (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={actionLoading === item.id}
                            onClick={() => handleUpdate(item.id, "VERIFIED")}
                            className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 cursor-pointer"
                          >
                            {actionLoading === item.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" />
                                Verify & Settle
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            disabled={actionLoading === item.id}
                            onClick={() => handleUpdate(item.id, "REJECTED")}
                            className="cursor-pointer"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <span className="text-[11px] text-charcoal-400 font-medium">
                          Audited by Operations
                        </span>
                      )}
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
