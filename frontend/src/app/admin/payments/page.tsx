"use client";

import * as React from "react";
import Link from "next/link";
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
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Trash2,
  Download,
  Clock,
  AlertTriangle,
  CheckSquare,
  Square,
  MinusSquare,
  X,
  Eye,
  FileText,
  Building2,
  Smartphone,
  Sparkles,
  ArrowRight,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { CLIENT_INFO } from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";
import { paymentsApi } from "@/lib/api";

interface AlertToastState {
  type: "success" | "error" | "warning";
  title: string;
  message: string;
}

type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [batchActionLoading, setBatchActionLoading] = React.useState(false);
  const [stats, setStats] = React.useState<any>({
    totalPayments: 0,
    pendingCount: 0,
    verifiedCount: 0,
    rejectedCount: 0,
    verifiedAmount: 0,
    pendingAmount: 0,
    todayVerifiedAmount: 0,
  });

  // Filter States
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [methodFilter, setMethodFilter] = React.useState<string>("ALL");
  const [dateRangeFilter, setDateRangeFilter] = React.useState<string>("ALL");

  // Selection for Batch Actions
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Modals & Drawer States
  const [selectedPayment, setSelectedPayment] = React.useState<any | null>(null);
  const [rejectTargetPayment, setRejectTargetPayment] = React.useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [auditNotes, setAuditNotes] = React.useState("");

  // Batch Modals
  const [showBatchRejectModal, setShowBatchRejectModal] = React.useState(false);
  const [showBatchDeleteModal, setShowBatchDeleteModal] = React.useState(false);
  const [deleteTargetPayment, setDeleteTargetPayment] = React.useState<any | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  // Copy Feedback
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Modern Toast Alert
  const [alertToast, setAlertToast] = React.useState<AlertToastState | null>(null);

  const showAlert = (type: "success" | "error" | "warning", title: string, message: string) => {
    setAlertToast({ type, title, message });
    setTimeout(() => {
      setAlertToast((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {};
      if (statusFilter !== "ALL") params.status = statusFilter;
      if (methodFilter !== "ALL" && !["BKASH", "NAGAD", "ROCKET"].includes(methodFilter)) {
        params.method = methodFilter;
      }
      if (dateRangeFilter !== "ALL") params.dateRange = dateRangeFilter;
      if (search.trim()) params.search = search.trim();

      const res = await paymentsApi.getAll(params);
      if (res.success && res.data) {
        if (Array.isArray(res.data)) {
          setPayments(res.data);
        } else if ((res.data as any).payments) {
          setPayments((res.data as any).payments);
          if ((res.data as any).stats) {
            setStats((res.data as any).stats);
          }
        }
      }
    } catch (err: any) {
      console.error("Failed to load payments:", err);
      showAlert("error", "Failed to Load", err?.message || "Could not load payment records.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPayments();
  }, [statusFilter, methodFilter, dateRangeFilter]);

  const getMethodBadge = React.useCallback((itemOrMethod: any) => {
    const item =
      typeof itemOrMethod === "object" && itemOrMethod !== null
        ? itemOrMethod
        : { method: itemOrMethod };
    const method = item.method || "";

    const siblingNotes = Array.isArray(item.order?.payments)
      ? item.order.payments
        .map((p: any) => `${p.verificationNotes || ""} ${p.bankReference || ""}`)
        .join(" ")
      : "";

    const combinedNotes = (
      (item.verificationNotes || "") +
      " " +
      (item.bankReference || "") +
      " " +
      siblingNotes
    ).toLowerCase();

    // 1. bKash (Gateway or Manual)
    if (method === "BKASH_MANUAL" || combinedNotes.includes("bkash")) {
      const isGateway =
        method === "ONLINE_GATEWAY" ||
        combinedNotes.includes("sslcommerz") ||
        combinedNotes.includes("gateway");
      return {
        bg: "bg-pink-50 text-[#e2136e] border-[#e2136e]/30",
        dot: "bg-[#e2136e]",
        label: isGateway ? "bKash (Online)" : "bKash (Manual)",
        shortName: "bKash",
        provider: "bKash",
        isGateway,
        gatewaySubtext: isGateway ? "SSLCommerz MFS" : "Personal / Agent",
      };
    }

    // 2. Nagad (Gateway or Manual)
    if (method === "NAGAD_MANUAL" || combinedNotes.includes("nagad")) {
      const isGateway =
        method === "ONLINE_GATEWAY" ||
        combinedNotes.includes("sslcommerz") ||
        combinedNotes.includes("gateway");
      return {
        bg: "bg-orange-50 text-[#d85604] border-[#f7941d]/30",
        dot: "bg-[#f7941d]",
        label: isGateway ? "Nagad (Online)" : "Nagad (Manual)",
        shortName: "Nagad",
        provider: "Nagad",
        isGateway,
        gatewaySubtext: isGateway ? "SSLCommerz MFS" : "Personal / Agent",
      };
    }

    // 3. Rocket (Gateway or Manual)
    if (
      method === "ROCKET_MANUAL" ||
      combinedNotes.includes("rocket") ||
      combinedNotes.includes("dbbl")
    ) {
      const isGateway =
        method === "ONLINE_GATEWAY" ||
        combinedNotes.includes("sslcommerz") ||
        combinedNotes.includes("gateway");
      return {
        bg: "bg-purple-50 text-[#8c3494] border-[#8c3494]/30",
        dot: "bg-[#8c3494]",
        label: isGateway ? "Rocket (Online)" : "Rocket (Manual)",
        shortName: "Rocket",
        provider: "Rocket",
        isGateway,
        gatewaySubtext: isGateway ? "SSLCommerz MFS" : "DBBL Rocket",
      };
    }

    // 4. Upay
    if (combinedNotes.includes("upay")) {
      return {
        bg: "bg-amber-50 text-amber-800 border-amber-300",
        dot: "bg-amber-500",
        label: "Upay (Online)",
        shortName: "Upay",
        provider: "Upay",
        isGateway: true,
        gatewaySubtext: "SSLCommerz MFS",
      };
    }

    // 5. Card (Visa / Mastercard / Amex)
    if (combinedNotes.includes("visa")) {
      return {
        bg: "bg-blue-50 text-blue-700 border-blue-200",
        dot: "bg-blue-600",
        label: "Visa Card (SSL)",
        shortName: "Visa",
        provider: "Visa",
        isGateway: true,
        gatewaySubtext: "Debit / Credit Card",
      };
    }
    if (combinedNotes.includes("master")) {
      return {
        bg: "bg-rose-50 text-rose-700 border-rose-200",
        dot: "bg-rose-600",
        label: "Mastercard (SSL)",
        shortName: "Mastercard",
        provider: "Mastercard",
        isGateway: true,
        gatewaySubtext: "Debit / Credit Card",
      };
    }
    if (combinedNotes.includes("amex")) {
      return {
        bg: "bg-cyan-50 text-cyan-800 border-cyan-200",
        dot: "bg-cyan-600",
        label: "Amex Card (SSL)",
        shortName: "Amex",
        provider: "Amex",
        isGateway: true,
        gatewaySubtext: "American Express",
      };
    }

    // 6. Generic Online Gateway
    if (method === "ONLINE_GATEWAY") {
      return {
        bg: "bg-teal-50 text-teal-800 border-teal-300",
        dot: "bg-teal-600",
        label: "SSL Gateway (Online)",
        shortName: "Gateway",
        provider: "SSLCommerz",
        isGateway: true,
        gatewaySubtext: "Card / MFS",
      };
    }

    if (method === "CASH_ON_DELIVERY") {
      return {
        bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
        dot: "bg-emerald-600",
        label: "COD (Cash)",
        shortName: "COD",
        provider: "Cash",
      };
    }

    if (method === "BANK_TRANSFER") {
      return {
        bg: "bg-blue-50 text-blue-700 border-blue-200",
        dot: "bg-blue-600",
        label: "Bank Transfer",
        shortName: "Bank",
        provider: "Bank",
      };
    }

    return {
      bg: "bg-gray-50 text-gray-700 border-gray-200",
      dot: "bg-gray-400",
      label: method || "Unknown",
      shortName: method,
      provider: method,
    };
  }, []);

  // Client-side quick filter
  const filteredPayments = React.useMemo(() => {
    return payments.filter((p) => {
      if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
      if (methodFilter !== "ALL") {
        const meta = getMethodBadge(p);
        if (methodFilter === "BKASH" && meta.shortName !== "bKash") return false;
        else if (methodFilter === "NAGAD" && meta.shortName !== "Nagad") return false;
        else if (methodFilter === "ROCKET" && meta.shortName !== "Rocket") return false;
        else if (methodFilter === "ONLINE_GATEWAY" && !meta.isGateway) return false;
        else if (
          !["BKASH", "NAGAD", "ROCKET", "ONLINE_GATEWAY"].includes(methodFilter) &&
          p.method !== methodFilter
        ) {
          return false;
        }
      }
      if (!search.trim()) return true;

      const q = search.toLowerCase();
      const orderNum = p.order?.orderNumber?.toLowerCase() || "";
      const customer = p.order?.customerName?.toLowerCase() || "";
      const phone = p.senderPhone || p.order?.customerPhone || "";
      const trx = p.transactionId?.toLowerCase() || "";
      const bankRef = p.bankReference?.toLowerCase() || "";
      const notes = p.verificationNotes?.toLowerCase() || "";
      const methodMeta = getMethodBadge(p);

      return (
        orderNum.includes(q) ||
        customer.includes(q) ||
        phone.includes(q) ||
        trx.includes(q) ||
        bankRef.includes(q) ||
        notes.includes(q) ||
        methodMeta.label.toLowerCase().includes(q) ||
        methodMeta.shortName.toLowerCase().includes(q)
      );
    });
  }, [payments, search, statusFilter, methodFilter, getMethodBadge]);

  // Multi-select helpers
  const allFilteredSelected =
    filteredPayments.length > 0 &&
    filteredPayments.every((p) => selectedIds.includes(p.id));
  const someFilteredSelected =
    filteredPayments.some((p) => selectedIds.includes(p.id)) && !allFilteredSelected;

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPayments.map((p) => p.id));
    }
  };

  const handleToggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  // Verification actions
  const handleVerify = async (
    id: string,
    decision: "VERIFIED" | "REJECTED",
    notes?: string
  ) => {
    try {
      setActionLoading(id);
      const res = await paymentsApi.verify(id, decision, notes);
      if (res.success) {
        setPayments((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                ...p,
                status: decision,
                verificationNotes: notes || p.verificationNotes,
                verifiedAt: new Date(),
              }
              : p
          )
        );
        if (selectedPayment && selectedPayment.id === id) {
          setSelectedPayment((curr: any) => ({
            ...curr,
            status: decision,
            verificationNotes: notes,
          }));
        }
        showAlert(
          decision === "VERIFIED" ? "success" : "warning",
          decision === "VERIFIED" ? "Payment Settled" : "Payment Rejected",
          decision === "VERIFIED"
            ? "Payment verified. Linked order marked as PAID."
            : "Payment rejected. Linked order marked as FAILED."
        );
      } else {
        showAlert("error", "Action Failed", res.message || "Failed to update verification.");
      }
    } catch (err: any) {
      showAlert("error", "Error", err?.message || "Server error updating payment.");
    } finally {
      setActionLoading(null);
      setRejectTargetPayment(null);
      setRejectionReason("");
    }
  };

  // Batch Verification
  const handleBatchVerify = async (decision: "VERIFIED" | "REJECTED", notes?: string) => {
    if (selectedIds.length === 0) return;
    try {
      setBatchActionLoading(true);
      const res = await paymentsApi.batchVerify(selectedIds, decision, notes);
      if (res.success) {
        setPayments((prev) =>
          prev.map((p) =>
            selectedIds.includes(p.id)
              ? {
                ...p,
                status: decision,
                verificationNotes: notes || p.verificationNotes,
                verifiedAt: new Date(),
              }
              : p
          )
        );
        showAlert(
          "success",
          "Batch Verification Completed",
          `${selectedIds.length} payments marked as ${decision}.`
        );
        setSelectedIds([]);
        setShowBatchRejectModal(false);
        setRejectionReason("");
      } else {
        showAlert("error", "Batch Failed", res.message || "Could not batch update payments.");
      }
    } catch (err: any) {
      showAlert("error", "Error", err?.message || "Batch verification error.");
    } finally {
      setBatchActionLoading(false);
    }
  };

  // Delete actions
  const handleConfirmSingleDelete = async () => {
    if (!deleteTargetPayment) return;
    try {
      setDeleteLoading(true);
      const res = await paymentsApi.delete(deleteTargetPayment.id);
      if (res.success) {
        setPayments((prev) => prev.filter((p) => p.id !== deleteTargetPayment.id));
        setSelectedIds((prev) => prev.filter((id) => id !== deleteTargetPayment.id));
        if (selectedPayment?.id === deleteTargetPayment.id) {
          setSelectedPayment(null);
        }
        showAlert("success", "Record Deleted", "Payment transaction record removed.");
        setDeleteTargetPayment(null);
      } else {
        showAlert("error", "Delete Failed", res.message || "Failed to delete payment.");
      }
    } catch (err: any) {
      showAlert("error", "Error", err?.message || "Server error deleting payment.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleConfirmBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      setDeleteLoading(true);
      const res = await paymentsApi.batchDelete(selectedIds);
      if (res.success) {
        setPayments((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
        showAlert(
          "success",
          "Records Deleted",
          `Successfully removed ${selectedIds.length} payment records.`
        );
        setSelectedIds([]);
        setShowBatchDeleteModal(false);
      } else {
        showAlert("error", "Delete Failed", res.message || "Failed to delete payments.");
      }
    } catch (err: any) {
      showAlert("error", "Error", err?.message || "Server error during batch delete.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Export CSV
  const exportPaymentsCSV = (itemsToExport: any[]) => {
    if (!itemsToExport || itemsToExport.length === 0) {
      showAlert("warning", "No Data", "There are no payment records to export.");
      return;
    }

    const headers = [
      "Payment ID",
      "Date",
      "Order Number",
      "Customer Name",
      "Customer Phone",
      "Sender Phone",
      "Payment Method",
      "Transaction ID (TrxID)",
      "Bank Reference",
      "Amount (BDT)",
      "Audit Status",
      "Verified At",
      "Verification Notes",
    ];

    const rows = itemsToExport.map((p) => [
      `"${p.id}"`,
      `"${new Date(p.createdAt).toLocaleString()}"`,
      `"${p.order?.orderNumber || ""}"`,
      `"${(p.order?.customerName || "").replace(/"/g, '""')}"`,
      `"${(p.order?.customerPhone || "").replace(/"/g, '""')}"`,
      `"${(p.senderPhone || "").replace(/"/g, '""')}"`,
      `"${p.method}"`,
      `"${p.transactionId || ""}"`,
      `"${p.bankReference || ""}"`,
      p.amount,
      `"${p.status}"`,
      `"${p.verifiedAt ? new Date(p.verifiedAt).toLocaleString() : ""}"`,
      `"${(p.verificationNotes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `shoilpikkabbo-payments-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showAlert("success", "Export Ready", `Exported ${itemsToExport.length} payment records.`);
  };

  // WhatsApp quick helper
  const formatWhatsAppUrl = (phone: string, orderNumber: string, customerName: string, trxId?: string) => {
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) clean = "880" + clean.slice(1);
    else if (!clean.startsWith("880") && clean.length === 10) clean = "880" + clean;
    const msg = encodeURIComponent(
      `Hello ${customerName}, greeting from Shoilpikkabbo regarding your payment verification for Order #${orderNumber} ${trxId ? `(TrxID: ${trxId})` : ""
      }.`
    );
    return `https://wa.me/${clean}?text=${msg}`;
  };

  const resetAllFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setMethodFilter("ALL");
    setDateRangeFilter("ALL");
  };

  const activeFilterCount =
    (statusFilter !== "ALL" ? 1 : 0) +
    (methodFilter !== "ALL" ? 1 : 0) +
    (dateRangeFilter !== "ALL" ? 1 : 0) +
    (search ? 1 : 0);

  const selectedPaymentsList = React.useMemo(() => {
    return payments.filter((p) => selectedIds.includes(p.id));
  }, [payments, selectedIds]);

  return (
    <AdminLayoutShell>
      {/* Toast Notification */}
      {alertToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div
            className={`p-4 rounded-2xl shadow-2xl border flex items-center gap-3 max-w-md ${alertToast.type === "success"
                ? "bg-[#0D3B37] text-white border-emerald-700"
                : alertToast.type === "warning"
                  ? "bg-amber-500 text-charcoal-900 border-amber-600"
                  : "bg-rose-600 text-white border-rose-700"
              }`}
          >
            {alertToast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />}
            {alertToast.type === "warning" && <AlertTriangle className="w-5 h-5 text-charcoal-900 shrink-0" />}
            {alertToast.type === "error" && <AlertCircle className="w-5 h-5 text-white shrink-0" />}
            <div className="min-w-0">
              <h5 className="font-extrabold text-xs">{alertToast.title}</h5>
              <p className="text-[11px] opacity-90 line-clamp-2">{alertToast.message}</p>
            </div>
            <button
              onClick={() => setAlertToast(null)}
              className="p-1 rounded-lg hover:bg-black/10 cursor-pointer ml-auto"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* FULL-WIDTH STUDIO CONTAINER */}
      <div className="w-full max-w-[1720px] mx-auto space-y-6">
        {/* HEADER BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-brand-border shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-forest-800/10 text-forest-900 font-extrabold text-[11px] uppercase tracking-wider">
                Financial Audit & Reconciliation
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-charcoal-500">Live Statements</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 font-heading mt-1">
              Payment Verification & Audit
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-0.5">
              Verify customer manual bKash/Nagad transfers, match TrxIDs against statements, and authorize order fulfillment.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="outline"
              size="md"
              onClick={() => exportPaymentsCSV(filteredPayments)}
              disabled={loading || filteredPayments.length === 0}
              className="border-brand-border text-charcoal-700 hover:bg-sand rounded-2xl text-xs font-bold"
            >
              <Download className="h-3.5 w-3.5 mr-1.5 text-forest-800" />
              Export CSV ({filteredPayments.length})
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={fetchPayments}
              disabled={loading}
              className="border-brand-border text-charcoal-700 hover:bg-sand rounded-2xl text-xs font-bold"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin text-forest-800" : ""}`} />
              Refresh Statements
            </Button>
          </div>
        </div>

        {/* OFFICIAL RECIPIENT ACCOUNTS INFORMATION STRIP */}
        <div className="p-4 rounded-3xl bg-[#0D3B37] text-white border border-emerald-900/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-emerald-100 uppercase tracking-wider">
                Official Business Payment Channels
              </h3>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Always cross-reference incoming SMS / Statements with customer submitted TrxID
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* bKash */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
              <Smartphone className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-gray-300">bKash/Nagad:</span>
              <strong className="font-mono">{CLIENT_INFO.phonePayment}</strong>
              <button
                type="button"
                onClick={() => copyToClipboard(CLIENT_INFO.phonePayment, "bkash-phone")}
                className="p-1 hover:text-emerald-300 transition-colors cursor-pointer"
                title="Copy phone number"
              >
                {copiedId === "bkash-phone" ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            {/* Bank */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
              <Building2 className="w-3.5 h-3.5 text-blue-300" />
              <span className="text-gray-300">Bank:</span>
              <strong>{CLIENT_INFO.bankName}</strong>
              <span className="text-emerald-300 font-mono text-[11px]">(A/C: Gulshan Corporate)</span>
              <button
                type="button"
                onClick={() => copyToClipboard(CLIENT_INFO.bankName, "bank-acc")}
                className="p-1 hover:text-emerald-300 transition-colors cursor-pointer"
                title="Copy bank name"
              >
                {copiedId === "bank-acc" ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* FINANCIAL KPI CARDS STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* 1. Total Payments */}
          <div
            onClick={() => setStatusFilter("ALL")}
            className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${statusFilter === "ALL"
                ? "bg-[#0D3B37] text-white border-forest-900 shadow-md ring-2 ring-forest-800/20"
                : "bg-white text-charcoal-900 border-brand-border hover:border-forest-800/50 shadow-xs"
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${statusFilter === "ALL" ? "text-emerald-200/80" : "text-charcoal-500"
                  }`}
              >
                Total Records
              </span>
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${statusFilter === "ALL" ? "bg-white/10 text-emerald-300" : "bg-forest-800/10 text-forest-900"
                  }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black">{stats.totalPayments || payments.length}</div>
            <div
              className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${statusFilter === "ALL" ? "text-emerald-300" : "text-forest-900"
                }`}
            >
              <span>Settled: {formatPrice(stats.verifiedAmount || 0)}</span>
            </div>
          </div>

          {/* 2. Pending Verification */}
          <div
            onClick={() => setStatusFilter("PENDING")}
            className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${statusFilter === "PENDING"
                ? "bg-amber-500 text-gray-950 border-amber-600 shadow-md ring-2 ring-amber-500/20"
                : "bg-white text-charcoal-900 border-brand-border hover:border-amber-400 shadow-xs"
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${statusFilter === "PENDING" ? "text-amber-950" : "text-charcoal-500"
                  }`}
              >
                Pending Audit
              </span>
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${statusFilter === "PENDING" ? "bg-black/15 text-amber-950" : "bg-amber-100 text-amber-800"
                  }`}
              >
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-700">
              {stats.pendingCount ?? payments.filter((p) => p.status === "PENDING").length}
            </div>
            <div
              className={`text-[11px] font-bold mt-1 ${statusFilter === "PENDING" ? "text-amber-950" : "text-amber-700"
                }`}
            >
              Vol: {formatPrice(stats.pendingAmount || 0)}
            </div>
          </div>

          {/* 3. Verified & Settled */}
          <div
            onClick={() => setStatusFilter("VERIFIED")}
            className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${statusFilter === "VERIFIED"
                ? "bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/20"
                : "bg-white text-charcoal-900 border-brand-border hover:border-emerald-400 shadow-xs"
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${statusFilter === "VERIFIED" ? "text-emerald-100" : "text-charcoal-500"
                  }`}
              >
                Verified & Settled
              </span>
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${statusFilter === "VERIFIED" ? "bg-white/15 text-white" : "bg-emerald-100 text-emerald-800"
                  }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black">
              {stats.verifiedCount ?? payments.filter((p) => p.status === "VERIFIED").length}
            </div>
            <div
              className={`text-[11px] font-semibold mt-1 ${statusFilter === "VERIFIED" ? "text-emerald-100" : "text-emerald-700"
                }`}
            >
              Vol: {formatPrice(stats.verifiedAmount || 0)}
            </div>
          </div>

          {/* 4. Rejected */}
          <div
            onClick={() => setStatusFilter("REJECTED")}
            className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${statusFilter === "REJECTED"
                ? "bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-500/20"
                : "bg-white text-charcoal-900 border-brand-border hover:border-rose-400 shadow-xs"
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${statusFilter === "REJECTED" ? "text-rose-100" : "text-charcoal-500"
                  }`}
              >
                Audit Rejected
              </span>
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${statusFilter === "REJECTED" ? "bg-white/15 text-white" : "bg-rose-100 text-rose-800"
                  }`}
              >
                <XCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black">
              {stats.rejectedCount ?? payments.filter((p) => p.status === "REJECTED").length}
            </div>
            <div
              className={`text-[11px] font-semibold mt-1 ${statusFilter === "REJECTED" ? "text-rose-100" : "text-rose-700"
                }`}
            >
              Flagged Transactions
            </div>
          </div>
        </div>

        {/* STATUS TABS NAVIGATION */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: "ALL", label: "All Records", count: stats.totalPayments || payments.length },
            { id: "PENDING", label: "Pending Verification", count: stats.pendingCount, dot: "bg-amber-400" },
            { id: "VERIFIED", label: "Verified & Settled", count: stats.verifiedCount, dot: "bg-emerald-400" },
            { id: "REJECTED", label: "Rejected", count: stats.rejectedCount, dot: "bg-rose-400" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${statusFilter === tab.id
                  ? "bg-[#0D3B37] text-white border-forest-900 shadow-xs"
                  : "bg-white text-charcoal-700 border-brand-border hover:bg-sand"
                }`}
            >
              {tab.dot && <span className={`w-2 h-2 rounded-full ${tab.dot}`} />}
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] ${statusFilter === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-sand text-charcoal-800"
                  }`}
              >
                {tab.count ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* SEARCH & FILTERS CONTROL BAR */}
        <div className="p-4 rounded-3xl bg-white border border-brand-border shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Quick Search */}
          <div className="relative w-full lg:w-96">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <Input
              placeholder="Search by TrxID, order #, sender phone, or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 text-xs sm:text-sm bg-[#FAF8F5] border-transparent focus:bg-white focus:border-brand-border rounded-2xl"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Secondary Filters */}
          <div className="flex items-center gap-2.5 w-full lg:w-auto flex-wrap">
            {/* Payment Method */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-charcoal-500 font-bold whitespace-nowrap">Channel:</span>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="h-10 px-3 rounded-2xl border border-brand-border bg-white text-xs text-charcoal-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0D3B37]"
              >
                <option value="ALL">All Channels</option>
                <option value="BKASH">bKash (Online & Manual)</option>
                <option value="NAGAD">Nagad (Online & Manual)</option>
                <option value="ROCKET">Rocket (Online & Manual)</option>
                <option value="ONLINE_GATEWAY">SSLCommerz Gateway (All)</option>
                <option value="CASH_ON_DELIVERY">Cash on Delivery (COD)</option>
                <option value="BANK_TRANSFER">Bank Wire / Transfer</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-charcoal-500 font-bold whitespace-nowrap">Period:</span>
              <select
                value={dateRangeFilter}
                onChange={(e) => setDateRangeFilter(e.target.value)}
                className="h-10 px-3 rounded-2xl border border-brand-border bg-white text-xs text-charcoal-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0D3B37]"
              >
                <option value="ALL">All Time</option>
                <option value="TODAY">Today</option>
                <option value="YESTERDAY">Yesterday</option>
                <option value="LAST_7_DAYS">Last 7 Days</option>
                <option value="THIS_MONTH">This Month</option>
              </select>
            </div>

            {/* Reset Filters */}
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetAllFilters}
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-2xl font-bold"
              >
                Reset Filters ({activeFilterCount})
              </Button>
            )}

            <span className="text-xs text-charcoal-400 font-medium ml-auto lg:ml-2">
              Showing {filteredPayments.length} of {payments.length}
            </span>
          </div>
        </div>

        {/* FLOATING / STICKY BATCH ACTION BAR (When 1+ items selected) */}
        {selectedIds.length > 0 && (
          <div className="sticky top-20 z-40 p-4 rounded-3xl bg-[#0D3B37] text-white shadow-2xl border border-emerald-900/40 flex flex-col md:flex-row items-center justify-between gap-3 animate-in slide-in-from-top-3 fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-sm text-[#E0592A]">
                {selectedIds.length}
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">
                  {selectedIds.length} payment(s) selected
                </p>
                <p className="text-[11px] text-emerald-200/80">
                  Bulk verify transactions or settle orders in single action
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Batch Verify & Settle */}
              <button
                type="button"
                disabled={batchActionLoading}
                onClick={() => handleBatchVerify("VERIFIED")}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {batchActionLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                <span>Verify & Settle All</span>
              </button>

              {/* Batch Reject */}
              <button
                type="button"
                disabled={batchActionLoading}
                onClick={() => setShowBatchRejectModal(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject Selected</span>
              </button>

              {/* Batch Export */}
              <button
                type="button"
                onClick={() => exportPaymentsCSV(selectedPaymentsList)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Selected</span>
              </button>

              {/* Batch Delete */}
              <button
                type="button"
                disabled={batchActionLoading}
                onClick={() => setShowBatchDeleteModal(true)}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              {/* Cancel Selection */}
              <button
                type="button"
                onClick={handleClearSelection}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Clear selection"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PAYMENTS DATA TABLE */}
        <div className="rounded-3xl border border-brand-border bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-sand text-charcoal-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  {/* Select All Checkbox */}
                  <th className="py-3.5 px-4 w-12 text-center">
                    <button
                      type="button"
                      onClick={handleToggleSelectAll}
                      className="p-1 rounded-md text-charcoal-600 hover:text-[#0D3B37] cursor-pointer"
                      title={allFilteredSelected ? "Deselect all" : "Select all"}
                    >
                      {allFilteredSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#0D3B37]" />
                      ) : someFilteredSelected ? (
                        <MinusSquare className="w-4 h-4 text-[#0D3B37]" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="py-3.5 px-4 min-w-[150px]">Order & Date</th>
                  <th className="py-3.5 px-4 min-w-[200px]">Customer & Sender Phone</th>
                  <th className="py-3.5 px-4 min-w-[120px]">Channel</th>
                  <th className="py-3.5 px-4 min-w-[180px]">Transaction ID (TrxID)</th>
                  <th className="py-3.5 px-4 min-w-[120px]">Transfer Amount</th>
                  <th className="py-3.5 px-4 min-w-[140px]">Audit Status</th>
                  <th className="py-3.5 px-4 text-right min-w-[160px]">Audit Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-charcoal-400">
                      <Loader2 className="h-7 w-7 animate-spin mx-auto mb-2 text-[#0D3B37]" />
                      <p className="font-bold text-xs">Loading payment transactions from database...</p>
                    </td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-charcoal-400">
                      <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="font-bold text-sm text-gray-600">No payment records found</p>
                      <p className="text-xs text-gray-400 mt-1">Try resetting search query or status filter</p>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    const methodMeta = getMethodBadge(item);
                    const orderNumber = item.order?.orderNumber;
                    const customerName = item.order?.customerName || "Customer";
                    const customerPhone = item.senderPhone || item.order?.customerPhone || "";

                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors group ${isSelected
                            ? "bg-emerald-50/60 hover:bg-emerald-50/80"
                            : "hover:bg-[#FAF8F5]/80"
                          }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleSelectItem(item.id)}
                            className="p-1 rounded-md cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#0D3B37]" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                            )}
                          </button>
                        </td>

                        {/* Order Number & Date */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            {orderNumber ? (
                              <Link
                                href="/admin/orders"
                                className="font-extrabold text-charcoal-900 font-mono text-xs hover:text-[#E0592A] transition-colors inline-flex items-center gap-1 group/ord"
                                title="View in Order Management"
                              >
                                <span>{orderNumber}</span>
                                <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover/ord:opacity-100 transition-opacity" />
                              </Link>
                            ) : (
                              <span className="font-mono text-charcoal-400">No linked order</span>
                            )}
                            {orderNumber && (
                              <button
                                type="button"
                                onClick={() => copyToClipboard(orderNumber, `ord-${item.id}`)}
                                className="p-0.5 text-gray-400 hover:text-forest-900 transition-colors cursor-pointer"
                                title="Copy order number"
                              >
                                {copiedId === `ord-${item.id}` ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>
                          <span className="text-[10px] text-charcoal-500 block mt-0.5">
                            {new Date(item.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}{" "}
                            •{" "}
                            {new Date(item.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </td>

                        {/* Customer & Sender Phone */}
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-charcoal-900">{customerName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {customerPhone && (
                              <a
                                href={`tel:${customerPhone}`}
                                className="text-[11px] text-forest-800 hover:underline font-mono inline-flex items-center gap-0.5"
                                title="Call sender"
                              >
                                <Phone className="w-2.5 h-2.5" />
                                <span>{customerPhone}</span>
                              </a>
                            )}
                            {customerPhone && orderNumber && (
                              <a
                                href={formatWhatsAppUrl(
                                  customerPhone,
                                  orderNumber,
                                  customerName,
                                  item.transactionId
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageSquare className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Channel / Method */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col items-start gap-1">
                            <span
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold border inline-flex items-center gap-1.5 shadow-2xs ${methodMeta.bg}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${methodMeta.dot || "bg-current"}`} />
                              <span>{methodMeta.label}</span>
                            </span>
                            {methodMeta.gatewaySubtext && (
                              <span className="text-[10px] text-charcoal-500 font-medium pl-0.5">
                                {methodMeta.gatewaySubtext}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* TrxID / Reference */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-charcoal-900 bg-sand/70 px-2 py-0.5 rounded-lg border border-sand-dark text-xs">
                              {item.transactionId || item.bankReference || "N/A (Cash)"}
                            </span>
                            {(item.transactionId || item.bankReference) && (
                              <button
                                type="button"
                                onClick={() =>
                                  copyToClipboard(
                                    item.transactionId || item.bankReference,
                                    `trx-${item.id}`
                                  )
                                }
                                className="p-1 text-gray-400 hover:text-forest-900 rounded transition-colors cursor-pointer"
                                title="Copy Transaction ID"
                              >
                                {copiedId === `trx-${item.id}` ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>
                          {item.verificationNotes && (
                            <div
                              className="mt-1 flex items-center gap-1.5 text-[10px] text-charcoal-700 bg-sand/60 px-2 py-0.5 rounded border border-sand-dark/60 max-w-fit"
                              title={item.verificationNotes}
                            >
                              <span className="font-bold text-forest-900">Source:</span>
                              <span className="font-mono text-charcoal-800 truncate max-w-[200px]">
                                {item.verificationNotes.replace("Verified via SSLCommerz Gateway ", "")}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Transfer Amount */}
                        <td className="py-3.5 px-4">
                          <span className="font-black text-[#0D3B37] text-sm block">
                            {formatPrice(Number(item.amount))}
                          </span>
                          {item.order?.totalAmount &&
                            Number(item.amount) !== Number(item.order.totalAmount) && (
                              <span className="text-[10px] text-amber-700 font-bold block" title="Amount differs from order grand total">
                                Order: {formatPrice(Number(item.order.totalAmount))}
                              </span>
                            )}
                        </td>

                        {/* Audit Status */}
                        <td className="py-3.5 px-4">
                          <Badge
                            variant={
                              item.status === "VERIFIED"
                                ? "success"
                                : item.status === "REJECTED"
                                  ? "danger"
                                  : "warning"
                            }
                            className="text-[11px] font-bold py-0.5"
                          >
                            {item.status === "VERIFIED"
                              ? "Verified & Settled"
                              : item.status === "REJECTED"
                                ? "Rejected"
                                : "Pending Audit"}
                          </Badge>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {item.status === "PENDING" ? (
                              <>
                                {/* Fast Verify Button */}
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  disabled={actionLoading === item.id}
                                  onClick={() => handleVerify(item.id, "VERIFIED")}
                                  className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold py-1 px-2.5 rounded-xl cursor-pointer border border-emerald-200"
                                >
                                  {actionLoading === item.id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                                      Verify
                                    </>
                                  )}
                                </Button>

                                {/* Reject Button */}
                                <Button
                                  size="sm"
                                  variant="danger"
                                  disabled={actionLoading === item.id}
                                  onClick={() => setRejectTargetPayment(item)}
                                  className="text-xs font-bold py-1 px-2 rounded-xl cursor-pointer"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </Button>
                              </>
                            ) : (
                              <span className="text-[10px] text-charcoal-400 font-semibold px-2">
                                Audited
                              </span>
                            )}

                            {/* View / Audit Drawer */}
                            <button
                              type="button"
                              onClick={() => setSelectedPayment(item)}
                              className="p-1.5 rounded-xl bg-sand/60 hover:bg-sand text-charcoal-700 transition-colors cursor-pointer"
                              title="Open payment audit drawer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete single */}
                            <button
                              type="button"
                              onClick={() => setDeleteTargetPayment(item)}
                              className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
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

        {/* PAYMENT AUDIT & RECONCILIATION MODAL / DRAWER */}
        <Modal
          isOpen={Boolean(selectedPayment)}
          onClose={() => setSelectedPayment(null)}
          title="Payment Audit & Statement Matching"
          description={`Payment Record #${selectedPayment?.id?.slice(0, 8)} • Placed on ${selectedPayment ? new Date(selectedPayment.createdAt).toLocaleString() : ""
            }`}
          maxWidth="xl"
        >
          {selectedPayment && (
            <div className="space-y-5 text-xs">
              {/* Status Header */}
              <div className="p-3.5 rounded-2xl bg-[#0D3B37] text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">
                    Verification State
                  </span>
                  <span className="font-extrabold text-sm">{selectedPayment.status}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">
                    Transfer Amount
                  </span>
                  <span className="font-black text-lg text-emerald-300">
                    {formatPrice(Number(selectedPayment.amount))}
                  </span>
                </div>
              </div>

              {/* Side-by-Side: Transfer vs Order Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Transfer Info */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-sand space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block">
                    Customer Submitted Transfer
                  </span>
                  <div>
                    <span className="text-charcoal-400 text-[10px] block">Channel / Provider</span>
                    {(() => {
                      const meta = getMethodBadge(selectedPayment);
                      return (
                        <div className="mt-1">
                          <span
                            className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold border inline-flex items-center gap-1.5 ${meta.bg}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot || "bg-current"}`} />
                            <span>{meta.label}</span>
                          </span>
                          {meta.gatewaySubtext && (
                            <span className="text-[10px] text-charcoal-500 block mt-0.5 font-medium">
                              Type: {meta.gatewaySubtext}
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  <div>
                    <span className="text-charcoal-400 text-[10px] block">Transaction ID (TrxID)</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <strong className="text-charcoal-900 font-mono text-sm bg-white px-2 py-0.5 rounded border border-sand">
                        {selectedPayment.transactionId || selectedPayment.bankReference || "N/A"}
                      </strong>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            selectedPayment.transactionId || selectedPayment.bankReference || "",
                            "modal-trx"
                          )
                        }
                        className="p-1 hover:text-forest-900 cursor-pointer"
                      >
                        {copiedId === "modal-trx" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-charcoal-400 text-[10px] block">Sender Phone</span>
                    <span className="font-mono font-bold text-charcoal-800">
                      {selectedPayment.senderPhone || "Not provided"}
                    </span>
                  </div>
                </div>

                {/* Linked Order */}
                <div className="p-4 rounded-2xl bg-white border border-brand-border space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block">
                    Linked Order Overview
                  </span>
                  <div>
                    <span className="text-charcoal-400 text-[10px] block">Order Reference</span>
                    <strong className="text-charcoal-900 font-mono text-xs">
                      {selectedPayment.order?.orderNumber || "No order linked"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-charcoal-400 text-[10px] block">Customer Name & City</span>
                    <strong className="text-charcoal-900">
                      {selectedPayment.order?.customerName || "Customer"} •{" "}
                      {selectedPayment.order?.city || "Dhaka"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-charcoal-400 text-[10px] block">Order Total Amount</span>
                    <strong className="text-forest-900 font-bold text-sm">
                      {selectedPayment.order?.totalAmount
                        ? formatPrice(Number(selectedPayment.order.totalAmount))
                        : "—"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Items in order */}
              {selectedPayment.order?.items && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                    Order Items ({selectedPayment.order.items.length})
                  </span>
                  <div className="border border-sand rounded-xl p-3 bg-white divide-y divide-sand">
                    {selectedPayment.order.items.map((it: any, i: number) => (
                      <div key={i} className="py-1.5 flex justify-between items-center text-xs">
                        <span className="font-bold text-charcoal-800">{it.productName}</span>
                        <span className="text-charcoal-500 font-mono">
                          {it.quantity} × {formatPrice(Number(it.unitPrice))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Actions in Drawer */}
              <div className="pt-3 border-t border-sand flex items-center justify-between gap-3">
                {selectedPayment.order?.customerPhone && (
                  <a
                    href={formatWhatsAppUrl(
                      selectedPayment.senderPhone || selectedPayment.order.customerPhone,
                      selectedPayment.order.orderNumber || "",
                      selectedPayment.order.customerName || "Customer",
                      selectedPayment.transactionId
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 text-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Customer</span>
                  </a>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPayment(null)}
                  >
                    Close
                  </Button>

                  {selectedPayment.status === "PENDING" && (
                    <>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setRejectTargetPayment(selectedPayment);
                          setSelectedPayment(null);
                        }}
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          handleVerify(selectedPayment.id, "VERIFIED");
                          setSelectedPayment(null);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                      >
                        Verify & Settle Order
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* REJECTION REASON PROMPT MODAL */}
        <Modal
          isOpen={Boolean(rejectTargetPayment)}
          onClose={() => setRejectTargetPayment(null)}
          title="Reject Payment Transaction"
          description="Specify a rejection reason to log in the audit trail and inform the customer."
          maxWidth="sm"
        >
          {rejectTargetPayment && (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-sand">
                <p className="font-bold text-charcoal-900">
                  {rejectTargetPayment.order?.orderNumber} • {formatPrice(Number(rejectTargetPayment.amount))}
                </p>
                <p className="text-charcoal-600 font-mono mt-0.5">
                  TrxID: {rejectTargetPayment.transactionId || "N/A"}
                </p>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider block">
                  Common Reasons:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "TrxID not found in statement",
                    "Amount less than order total",
                    "Invalid sender phone",
                    "Incomplete wire reference",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRejectionReason(preset)}
                      className="px-2.5 py-1 rounded-lg bg-sand/60 hover:bg-sand text-charcoal-800 text-[11px] font-semibold cursor-pointer border border-brand-border"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-charcoal-800 block">
                  Detailed Reason / Note:
                </span>
                <Input
                  placeholder="Enter rejection reason..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-sand">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRejectTargetPayment(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() =>
                    handleVerify(rejectTargetPayment.id, "REJECTED", rejectionReason)
                  }
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Confirm Rejection
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* BATCH REJECT MODAL */}
        <Modal
          isOpen={showBatchRejectModal}
          onClose={() => setShowBatchRejectModal(false)}
          title={`Reject ${selectedIds.length} Selected Payment(s)`}
          description="Mark all selected payments as REJECTED and set linked orders to FAILED."
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <Input
              placeholder="Rejection note (e.g. Bulk TrxID verification failed)"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="text-xs"
            />

            <div className="pt-2 flex justify-end gap-2 border-t border-sand">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBatchRejectModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={batchActionLoading}
                onClick={() => handleBatchVerify("REJECTED", rejectionReason)}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                {batchActionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />}
                Confirm Bulk Reject
              </Button>
            </div>
          </div>
        </Modal>

        {/* SINGLE DELETE CONFIRMATION MODAL */}
        <Modal
          isOpen={Boolean(deleteTargetPayment)}
          onClose={() => !deleteLoading && setDeleteTargetPayment(null)}
          title="Delete Payment Record"
          description="Are you sure you want to permanently remove this transaction log?"
          maxWidth="sm"
        >
          {deleteTargetPayment && (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                <p className="font-bold">This action cannot be undone.</p>
                <p className="text-[11px] mt-0.5">
                  Record #{deleteTargetPayment.id.slice(0, 8)} will be purged.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-sand">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={deleteLoading}
                  onClick={() => setDeleteTargetPayment(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={deleteLoading}
                  onClick={handleConfirmSingleDelete}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  {deleteLoading && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />}
                  Delete Record
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* BATCH DELETE CONFIRMATION MODAL */}
        <Modal
          isOpen={showBatchDeleteModal}
          onClose={() => !deleteLoading && setShowBatchDeleteModal(false)}
          title="Delete Multiple Payment Records"
          description={`Are you sure you want to delete ${selectedIds.length} selected record(s)?`}
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
              <p className="font-bold">Permanent Deletion</p>
              <p className="text-[11px] mt-0.5">
                All {selectedIds.length} transaction entries will be permanently removed from audit history.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-sand">
              <Button
                variant="ghost"
                size="sm"
                disabled={deleteLoading}
                onClick={() => setShowBatchDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={deleteLoading}
                onClick={handleConfirmBatchDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                {deleteLoading && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />}
                Delete {selectedIds.length} Records
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayoutShell>
  );
}
