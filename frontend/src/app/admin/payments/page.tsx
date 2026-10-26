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
} from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MOCK_PAYMENTS, PaymentVerification, CLIENT_INFO } from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = React.useState<PaymentVerification[]>(MOCK_PAYMENTS);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("ALL");

  const filtered = payments.filter((p) => {
    const matchStatus = filter === "ALL" || p.status === filter;
    const matchQuery =
      !search.trim() ||
      p.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      p.senderPhone.includes(search);
    return matchStatus && matchQuery;
  });

  const handleUpdate = (id: string, status: "VERIFIED" | "REJECTED") => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  return (
    <AdminLayoutShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-charcoal-900 font-heading">
            Payment Verification & Audit
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Audit manual bKash/Nagad transfers and BRAC Bank wire references before dispatching orders.
          </p>
        </div>

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
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-sand/20 transition-colors">
                  <td className="py-3.5 px-4 font-black text-forest-900">
                    {item.orderNumber}
                    <span className="block text-[10px] text-charcoal-400 font-normal">
                      {item.submittedAt}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-charcoal-900">{item.customerName}</p>
                    <p className="text-[10px] text-charcoal-500 flex items-center gap-1 mt-0.5">
                      <Phone className="h-2.5 w-2.5" />
                      {item.senderPhone}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-charcoal-800">
                    {item.method}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-charcoal-900">
                    <span className="bg-sand px-2 py-1 rounded border border-sand-dark">
                      {item.transactionId}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-forest-900">
                    {formatPrice(item.amount)}
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
                          onClick={() => handleUpdate(item.id, "VERIFIED")}
                          className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" />
                          Verify & Settle
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleUpdate(item.id, "REJECTED")}
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </>
                    ) : (
                      <span className="text-[11px] text-charcoal-400 font-medium">
                        Verified by Operations
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayoutShell>
  );
}
