"use client";

import * as React from "react";
import {
  MessageSquare,
  Phone,
  Mail,
  Building2,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  AlertCircle,
  Trash2,
  Download,
  Copy,
  Check,
  ExternalLink,
  Filter,
  Sparkles,
  AlertTriangle,
  CheckSquare,
  Square,
  MinusSquare,
  X,
  Eye,
  FileText,
  LayoutGrid,
  List,
  Send,
  Calendar,
  Building,
  ArrowRight,
  TrendingUp,
  Search,
} from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { inquiriesApi } from "@/lib/api";

interface AlertToastState {
  type: "success" | "error" | "warning";
  title: string;
  message: string;
}

type InquiryStatus = "NEW" | "IN_REVIEW" | "CONTACTED" | "RESOLVED";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [batchActionLoading, setBatchActionLoading] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"table" | "cards">("table");
  const [stats, setStats] = React.useState<any>({
    total: 0,
    newCount: 0,
    inReviewCount: 0,
    contactedCount: 0,
    resolvedCount: 0,
    todayCount: 0,
  });

  // Filter States
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [serviceTypeFilter, setServiceTypeFilter] = React.useState<string>("ALL");
  const [dateRangeFilter, setDateRangeFilter] = React.useState<string>("ALL");

  // Selection for Batch Actions
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Modals & Drawer States
  const [selectedInquiry, setSelectedInquiry] = React.useState<any | null>(null);
  const [adminNoteInput, setAdminNoteInput] = React.useState("");
  const [isSavingNote, setIsSavingNote] = React.useState(false);

  // Deletion Modals
  const [deleteTargetInquiry, setDeleteTargetInquiry] = React.useState<any | null>(null);
  const [showBatchDeleteModal, setShowBatchDeleteModal] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  // Copy Feedback
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Toast Notification
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

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {};
      if (statusFilter !== "ALL") params.status = statusFilter;
      if (serviceTypeFilter !== "ALL") params.serviceType = serviceTypeFilter;
      if (dateRangeFilter !== "ALL") params.dateRange = dateRangeFilter;
      if (search.trim()) params.search = search.trim();

      const res = await inquiriesApi.getAll(params);
      if (res.success && res.data) {
        if (Array.isArray(res.data)) {
          setInquiries(res.data);
        } else if ((res.data as any).inquiries) {
          setInquiries((res.data as any).inquiries);
          if ((res.data as any).stats) {
            setStats((res.data as any).stats);
          }
        }
      }
    } catch (err: any) {
      console.error("Failed to load inquiries:", err);
      showAlert("error", "Failed to Load", err?.message || "Could not retrieve inquiries.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchInquiries();
  }, [statusFilter, serviceTypeFilter, dateRangeFilter]);

  // Client-side quick filter
  const filteredInquiries = React.useMemo(() => {
    return inquiries.filter((inq) => {
      if (statusFilter !== "ALL" && inq.status !== statusFilter) return false;
      if (serviceTypeFilter !== "ALL" && inq.serviceType !== serviceTypeFilter) return false;
      if (!search.trim()) return true;

      const q = search.toLowerCase();
      const matchName = inq.customerName?.toLowerCase().includes(q);
      const matchPhone = inq.customerPhone?.includes(q);
      const matchEmail = inq.customerEmail?.toLowerCase().includes(q);
      const matchOrg = inq.organization?.toLowerCase().includes(q);
      const matchType = inq.serviceType?.toLowerCase().includes(q);
      const matchReq = inq.requirements?.toLowerCase().includes(q);

      return matchName || matchPhone || matchEmail || matchOrg || matchType || matchReq;
    });
  }, [inquiries, search, statusFilter, serviceTypeFilter]);

  // Multi-select helpers
  const allFilteredSelected =
    filteredInquiries.length > 0 &&
    filteredInquiries.every((i) => selectedIds.includes(i.id));
  const someFilteredSelected =
    filteredInquiries.some((i) => selectedIds.includes(i.id)) && !allFilteredSelected;

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredInquiries.map((i) => i.id));
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

  // Status updates
  const handleUpdateStatus = async (id: string, status: InquiryStatus, adminNotes?: string) => {
    try {
      setActionLoading(id);
      const res = await inquiriesApi.updateStatus(id, status, adminNotes);
      if (res.success) {
        setInquiries((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, status, adminNotes: adminNotes ?? i.adminNotes } : i
          )
        );
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry((curr: any) => ({
            ...curr,
            status,
            adminNotes: adminNotes ?? curr.adminNotes,
          }));
        }
        showAlert("success", "Status Updated", `Inquiry marked as ${status}.`);
      } else {
        showAlert("error", "Update Failed", res.message || "Failed to update status.");
      }
    } catch (err: any) {
      showAlert("error", "Error", err?.message || "Server error updating status.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveAdminNote = async () => {
    if (!selectedInquiry) return;
    try {
      setIsSavingNote(true);
      const res = await inquiriesApi.updateStatus(
        selectedInquiry.id,
        selectedInquiry.status,
        adminNoteInput.trim()
      );
      if (res.success) {
        setInquiries((prev) =>
          prev.map((i) =>
            i.id === selectedInquiry.id ? { ...i, adminNotes: adminNoteInput.trim() } : i
          )
        );
        setSelectedInquiry((curr: any) => ({
          ...curr,
          adminNotes: adminNoteInput.trim(),
        }));
        showAlert("success", "Note Saved", "Follow-up note logged successfully.");
      } else {
        showAlert("error", "Failed", res.message || "Could not save note.");
      }
    } catch (err: any) {
      showAlert("error", "Error", err?.message || "Failed to save note.");
    } finally {
      setIsSavingNote(false);
    }
  };

  // Batch actions
  const handleBatchStatus = async (status: InquiryStatus) => {
    if (selectedIds.length === 0) return;
    try {
      setBatchActionLoading(true);
      const res = await inquiriesApi.batchStatus(selectedIds, status);
      if (res.success) {
        setInquiries((prev) =>
          prev.map((i) => (selectedIds.includes(i.id) ? { ...i, status } : i))
        );
        showAlert(
          "success",
          "Batch Updated",
          `${selectedIds.length} inquiries marked as ${status}.`
        );
        setSelectedIds([]);
      } else {
        showAlert("error", "Batch Failed", res.message || "Could not update inquiries.");
      }
    } catch (err: any) {
      showAlert("error", "Error", err?.message || "Batch status update error.");
    } finally {
      setBatchActionLoading(false);
    }
  };

  // Delete actions
  const handleConfirmSingleDelete = async () => {
    if (!deleteTargetInquiry) return;
    try {
      setDeleteLoading(true);
      const res = await inquiriesApi.delete(deleteTargetInquiry.id);
      if (res.success) {
        setInquiries((prev) => prev.filter((i) => i.id !== deleteTargetInquiry.id));
        setSelectedIds((prev) => prev.filter((id) => id !== deleteTargetInquiry.id));
        if (selectedInquiry?.id === deleteTargetInquiry.id) {
          setSelectedInquiry(null);
        }
        showAlert("success", "Inquiry Deleted", "Inquiry record has been removed.");
        setDeleteTargetInquiry(null);
      } else {
        showAlert("error", "Delete Failed", res.message || "Could not delete inquiry.");
      }
    } catch (err: any) {
      showAlert("error", "Error", err?.message || "Server error deleting inquiry.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleConfirmBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      setDeleteLoading(true);
      const res = await inquiriesApi.batchDelete(selectedIds);
      if (res.success) {
        setInquiries((prev) => prev.filter((i) => !selectedIds.includes(i.id)));
        showAlert(
          "success",
          "Inquiries Deleted",
          `Successfully removed ${selectedIds.length} inquiry records.`
        );
        setSelectedIds([]);
        setShowBatchDeleteModal(false);
      } else {
        showAlert("error", "Batch Delete Failed", res.message || "Failed to delete inquiries.");
      }
    } catch (err: any) {
      showAlert("error", "Error", err?.message || "Server error during batch delete.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Export CSV
  const exportInquiriesCSV = (itemsToExport: any[]) => {
    if (!itemsToExport || itemsToExport.length === 0) {
      showAlert("warning", "No Data", "There are no inquiries to export.");
      return;
    }

    const headers = [
      "Inquiry ID",
      "Submission Date",
      "Customer Name",
      "Phone",
      "Email",
      "Organization",
      "Service Category",
      "Requirements",
      "Status",
      "Admin Notes",
    ];

    const rows = itemsToExport.map((i) => [
      `"${i.id}"`,
      `"${new Date(i.createdAt).toLocaleString()}"`,
      `"${(i.customerName || "").replace(/"/g, '""')}"`,
      `"${(i.customerPhone || "").replace(/"/g, '""')}"`,
      `"${(i.customerEmail || "").replace(/"/g, '""')}"`,
      `"${(i.organization || "").replace(/"/g, '""')}"`,
      `"${(i.serviceType || "").replace(/"/g, '""')}"`,
      `"${(i.requirements || "").replace(/"/g, '""')}"`,
      `"${i.status}"`,
      `"${(i.adminNotes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `shoilpikkabbo-inquiries-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showAlert("success", "Export Ready", `Exported ${itemsToExport.length} inquiry records.`);
  };

  // WhatsApp quick helper
  const formatWhatsAppUrl = (phone: string, customerName: string, serviceType: string) => {
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) clean = "880" + clean.slice(1);
    else if (!clean.startsWith("880") && clean.length === 10) clean = "880" + clean;
    const msg = encodeURIComponent(
      `Hello ${customerName}, greeting from Shoilpikkabbo regarding your inquiry for ${serviceType}. We would love to discuss your custom craft requirements.`
    );
    return `https://wa.me/${clean}?text=${msg}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return {
          bg: "bg-amber-50 text-amber-800 border-amber-200",
          dot: "bg-amber-500",
          label: "New Request",
        };
      case "IN_REVIEW":
        return {
          bg: "bg-sky-50 text-sky-800 border-sky-200",
          dot: "bg-sky-500",
          label: "In Review",
        };
      case "CONTACTED":
        return {
          bg: "bg-purple-50 text-purple-800 border-purple-200",
          dot: "bg-purple-500",
          label: "Contacted",
        };
      case "RESOLVED":
        return {
          bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
          dot: "bg-emerald-500",
          label: "Resolved",
        };
      default:
        return {
          bg: "bg-gray-50 text-gray-700 border-gray-200",
          dot: "bg-gray-400",
          label: status,
        };
    }
  };

  const resetAllFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setServiceTypeFilter("ALL");
    setDateRangeFilter("ALL");
  };

  const activeFilterCount =
    (statusFilter !== "ALL" ? 1 : 0) +
    (serviceTypeFilter !== "ALL" ? 1 : 0) +
    (dateRangeFilter !== "ALL" ? 1 : 0) +
    (search ? 1 : 0);

  const selectedInquiriesList = React.useMemo(() => {
    return inquiries.filter((i) => selectedIds.includes(i.id));
  }, [inquiries, selectedIds]);

  // Unique service types for dropdown
  const uniqueServiceTypes = React.useMemo(() => {
    const types = new Set<string>();
    inquiries.forEach((i) => {
      if (i.serviceType) types.add(i.serviceType);
    });
    return Array.from(types);
  }, [inquiries]);

  return (
    <AdminLayoutShell>
      {/* Toast Notification */}
      {alertToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div
            className={`p-4 rounded-2xl shadow-2xl border flex items-center gap-3 max-w-md ${
              alertToast.type === "success"
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
                Special E-Sheba CRM
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-charcoal-500">Corporate & Custom Leads</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 font-heading mt-1">
              Custom Craft & Service Inquiries
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-0.5">
              Review institutional gifting, custom handicraft procurement, and bespoke artisan inquiries.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-sand/60 p-1 rounded-2xl border border-brand-border">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-[#0D3B37] text-white shadow-xs"
                    : "text-charcoal-600 hover:text-charcoal-900"
                }`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  viewMode === "cards"
                    ? "bg-[#0D3B37] text-white shadow-xs"
                    : "text-charcoal-600 hover:text-charcoal-900"
                }`}
                title="Card grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            <Button
              variant="outline"
              size="md"
              onClick={() => exportInquiriesCSV(filteredInquiries)}
              disabled={loading || filteredInquiries.length === 0}
              className="border-brand-border text-charcoal-700 hover:bg-sand rounded-2xl text-xs font-bold"
            >
              <Download className="h-3.5 w-3.5 mr-1.5 text-forest-800" />
              Export CSV ({filteredInquiries.length})
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={fetchInquiries}
              disabled={loading}
              className="border-brand-border text-charcoal-700 hover:bg-sand rounded-2xl text-xs font-bold"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin text-forest-800" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* EXECUTIVE KPI STATS STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          {/* 1. Total Requests */}
          <div
            onClick={() => setStatusFilter("ALL")}
            className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
              statusFilter === "ALL"
                ? "bg-[#0D3B37] text-white border-forest-900 shadow-md ring-2 ring-forest-800/20"
                : "bg-white text-charcoal-900 border-brand-border hover:border-forest-800/50 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  statusFilter === "ALL" ? "text-emerald-200/80" : "text-charcoal-500"
                }`}
              >
                Total Leads
              </span>
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  statusFilter === "ALL" ? "bg-white/10 text-emerald-300" : "bg-forest-800/10 text-forest-900"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black">{stats.total || inquiries.length}</div>
            <div
              className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${
                statusFilter === "ALL" ? "text-emerald-300" : "text-forest-900"
              }`}
            >
              <span>Today: {stats.todayCount} new</span>
            </div>
          </div>

          {/* 2. New Inquiries */}
          <div
            onClick={() => setStatusFilter("NEW")}
            className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
              statusFilter === "NEW"
                ? "bg-amber-500 text-gray-950 border-amber-600 shadow-md ring-2 ring-amber-500/20"
                : "bg-white text-charcoal-900 border-brand-border hover:border-amber-400 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  statusFilter === "NEW" ? "text-amber-950" : "text-charcoal-500"
                }`}
              >
                New Requests
              </span>
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  statusFilter === "NEW" ? "bg-black/15 text-amber-950" : "bg-amber-100 text-amber-800"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-700">
              {stats.newCount ?? inquiries.filter((i) => i.status === "NEW").length}
            </div>
            <div
              className={`text-[11px] font-bold mt-1 ${
                statusFilter === "NEW" ? "text-amber-950" : "text-amber-700"
              }`}
            >
              Action Required
            </div>
          </div>

          {/* 3. In Review */}
          <div
            onClick={() => setStatusFilter("IN_REVIEW")}
            className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
              statusFilter === "IN_REVIEW"
                ? "bg-sky-600 text-white border-sky-700 shadow-md ring-2 ring-sky-500/20"
                : "bg-white text-charcoal-900 border-brand-border hover:border-sky-400 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  statusFilter === "IN_REVIEW" ? "text-sky-100" : "text-charcoal-500"
                }`}
              >
                In Review
              </span>
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  statusFilter === "IN_REVIEW" ? "bg-white/15 text-white" : "bg-sky-100 text-sky-800"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black">
              {stats.inReviewCount ?? inquiries.filter((i) => i.status === "IN_REVIEW").length}
            </div>
            <div
              className={`text-[11px] font-semibold mt-1 ${
                statusFilter === "IN_REVIEW" ? "text-sky-100" : "text-sky-700"
              }`}
            >
              Quotation Prep
            </div>
          </div>

          {/* 4. Contacted */}
          <div
            onClick={() => setStatusFilter("CONTACTED")}
            className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
              statusFilter === "CONTACTED"
                ? "bg-purple-600 text-white border-purple-700 shadow-md ring-2 ring-purple-500/20"
                : "bg-white text-charcoal-900 border-brand-border hover:border-purple-400 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  statusFilter === "CONTACTED" ? "text-purple-100" : "text-charcoal-500"
                }`}
              >
                Contacted
              </span>
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  statusFilter === "CONTACTED" ? "bg-white/15 text-white" : "bg-purple-100 text-purple-800"
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black">
              {stats.contactedCount ?? inquiries.filter((i) => i.status === "CONTACTED").length}
            </div>
            <div
              className={`text-[11px] font-semibold mt-1 ${
                statusFilter === "CONTACTED" ? "text-purple-100" : "text-purple-700"
              }`}
            >
              In Discussion
            </div>
          </div>

          {/* 5. Resolved */}
          <div
            onClick={() => setStatusFilter("RESOLVED")}
            className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
              statusFilter === "RESOLVED"
                ? "bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/20"
                : "bg-white text-charcoal-900 border-brand-border hover:border-emerald-400 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  statusFilter === "RESOLVED" ? "text-emerald-100" : "text-charcoal-500"
                }`}
              >
                Resolved / Won
              </span>
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  statusFilter === "RESOLVED" ? "bg-white/15 text-white" : "bg-emerald-100 text-emerald-800"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black">
              {stats.resolvedCount ?? inquiries.filter((i) => i.status === "RESOLVED").length}
            </div>
            <div
              className={`text-[11px] font-semibold mt-1 ${
                statusFilter === "RESOLVED" ? "text-emerald-100" : "text-emerald-700"
              }`}
            >
              Converted Orders
            </div>
          </div>
        </div>

        {/* STATUS TABS NAVIGATION */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: "ALL", label: "All Inquiries", count: stats.total || inquiries.length },
            { id: "NEW", label: "New Requests", count: stats.newCount, dot: "bg-amber-400" },
            { id: "IN_REVIEW", label: "In Review", count: stats.inReviewCount, dot: "bg-sky-400" },
            { id: "CONTACTED", label: "Contacted", count: stats.contactedCount, dot: "bg-purple-400" },
            { id: "RESOLVED", label: "Resolved", count: stats.resolvedCount, dot: "bg-emerald-400" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                statusFilter === tab.id
                  ? "bg-[#0D3B37] text-white border-forest-900 shadow-xs"
                  : "bg-white text-charcoal-700 border-brand-border hover:bg-sand"
              }`}
            >
              {tab.dot && <span className={`w-2 h-2 rounded-full ${tab.dot}`} />}
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                  statusFilter === tab.id
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
              placeholder="Search by customer, phone, email, organization, or notes..."
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
            {/* Service Type */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-charcoal-500 font-bold whitespace-nowrap">Service:</span>
              <select
                value={serviceTypeFilter}
                onChange={(e) => setServiceTypeFilter(e.target.value)}
                className="h-10 px-3 rounded-2xl border border-brand-border bg-white text-xs text-charcoal-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0D3B37]"
              >
                <option value="ALL">All Service Types</option>
                {uniqueServiceTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
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
              Showing {filteredInquiries.length} of {inquiries.length}
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
                  {selectedIds.length} inquiry(s) selected
                </p>
                <p className="text-[11px] text-emerald-200/80">
                  Bulk update status or export corporate client leads
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Batch to In Review */}
              <button
                type="button"
                disabled={batchActionLoading}
                onClick={() => handleBatchStatus("IN_REVIEW")}
                className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {batchActionLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FileText className="w-3.5 h-3.5" />
                )}
                <span>Mark In Review</span>
              </button>

              {/* Batch to Contacted */}
              <button
                type="button"
                disabled={batchActionLoading}
                onClick={() => handleBatchStatus("CONTACTED")}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Mark Contacted</span>
              </button>

              {/* Batch to Resolved */}
              <button
                type="button"
                disabled={batchActionLoading}
                onClick={() => handleBatchStatus("RESOLVED")}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Resolved</span>
              </button>

              {/* Batch Export */}
              <button
                type="button"
                onClick={() => exportInquiriesCSV(selectedInquiriesList)}
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

        {/* VIEW MODE: TABLE VIEW */}
        {viewMode === "table" ? (
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
                    <th className="py-3.5 px-4 min-w-[200px]">Customer & Organization</th>
                    <th className="py-3.5 px-4 min-w-[180px]">Contact Channels</th>
                    <th className="py-3.5 px-4 min-w-[140px]">Service Category</th>
                    <th className="py-3.5 px-4 min-w-[240px]">Requirements & Scope</th>
                    <th className="py-3.5 px-4 min-w-[150px]">Current Status</th>
                    <th className="py-3.5 px-4 text-right min-w-[130px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-charcoal-400">
                        <Loader2 className="h-7 w-7 animate-spin mx-auto mb-2 text-[#0D3B37]" />
                        <p className="font-bold text-xs">Loading inquiries from database...</p>
                      </td>
                    </tr>
                  ) : filteredInquiries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-charcoal-400">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="font-bold text-sm text-gray-600">No matching service inquiries</p>
                        <p className="text-xs text-gray-400 mt-1">Try resetting search or status filters</p>
                      </td>
                    </tr>
                  ) : (
                    filteredInquiries.map((inq) => {
                      const isSelected = selectedIds.includes(inq.id);
                      const statusMeta = getStatusBadge(inq.status);

                      return (
                        <tr
                          key={inq.id}
                          className={`transition-colors group ${
                            isSelected
                              ? "bg-emerald-50/60 hover:bg-emerald-50/80"
                              : "hover:bg-[#FAF8F5]/80"
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleSelectItem(inq.id)}
                              className="p-1 rounded-md cursor-pointer"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-[#0D3B37]" />
                              ) : (
                                <Square className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                              )}
                            </button>
                          </td>

                          {/* Customer & Organization */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-sand/80 border border-brand-border flex items-center justify-center font-bold text-forest-900 text-[11px] shrink-0">
                                {(inq.customerName || "C")
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-charcoal-900 truncate">
                                  {inq.customerName}
                                </p>
                                {inq.organization ? (
                                  <span className="text-[11px] text-forest-800 font-semibold flex items-center gap-1 mt-0.5 truncate">
                                    <Building2 className="w-3 h-3 shrink-0" />
                                    {inq.organization}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-charcoal-400 block mt-0.5">
                                    Individual Client
                                  </span>
                                )}
                                <span className="text-[10px] text-charcoal-400 block">
                                  {new Date(inq.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Contact Channels */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <a
                                  href={`tel:${inq.customerPhone}`}
                                  className="text-xs text-forest-900 font-mono font-bold hover:underline inline-flex items-center gap-1"
                                  title="Call customer"
                                >
                                  <Phone className="w-3 h-3 text-forest-700" />
                                  <span>{inq.customerPhone}</span>
                                </a>
                                <a
                                  href={formatWhatsAppUrl(
                                    inq.customerPhone,
                                    inq.customerName,
                                    inq.serviceType
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                                  title="Chat on WhatsApp"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                </a>
                              </div>
                              {inq.customerEmail && (
                                <a
                                  href={`mailto:${inq.customerEmail}`}
                                  className="text-[11px] text-charcoal-500 hover:underline flex items-center gap-1 truncate"
                                  title="Send email"
                                >
                                  <Mail className="w-2.5 h-2.5 text-charcoal-400" />
                                  <span>{inq.customerEmail}</span>
                                </a>
                              )}
                            </div>
                          </td>

                          {/* Service Type */}
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-sand text-charcoal-800 inline-block border border-brand-border">
                              {inq.serviceType}
                            </span>
                          </td>

                          {/* Requirements & Notes */}
                          <td className="py-3.5 px-4">
                            <p
                              onClick={() => {
                                setSelectedInquiry(inq);
                                setAdminNoteInput(inq.adminNotes || "");
                              }}
                              className="text-charcoal-700 line-clamp-2 cursor-pointer hover:text-forest-900 leading-relaxed"
                              title="Click to view full requirements"
                            >
                              {inq.requirements}
                            </p>
                            {inq.adminNotes && (
                              <div className="mt-1 flex items-center gap-1 text-[10px] text-forest-800 font-semibold bg-forest-50/50 px-2 py-0.5 rounded-md border border-forest-100 truncate">
                                <strong>Note:</strong> {inq.adminNotes}
                              </div>
                            )}
                          </td>

                          {/* Current Status Dropdown */}
                          <td className="py-3.5 px-4">
                            <select
                              value={inq.status}
                              disabled={actionLoading === inq.id}
                              onChange={(e) =>
                                handleUpdateStatus(inq.id, e.target.value as InquiryStatus)
                              }
                              className={`h-8 px-2.5 rounded-xl border text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-forest-800/20 cursor-pointer transition-all ${statusMeta.bg}`}
                            >
                              <option value="NEW">New Request</option>
                              <option value="IN_REVIEW">In Review</option>
                              <option value="CONTACTED">Contacted</option>
                              <option value="RESOLVED">Resolved</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* Open Details Drawer */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedInquiry(inq);
                                  setAdminNoteInput(inq.adminNotes || "");
                                }}
                                className="p-1.5 rounded-xl bg-forest-800/10 hover:bg-forest-800 hover:text-white text-forest-900 transition-colors cursor-pointer"
                                title="Open inquiry & notes"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* WhatsApp Direct */}
                              <a
                                href={formatWhatsAppUrl(
                                  inq.customerPhone,
                                  inq.customerName,
                                  inq.serviceType
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-xl text-emerald-700 hover:bg-emerald-50 transition-colors"
                                title="WhatsApp customer"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </a>

                              {/* Delete button */}
                              <button
                                type="button"
                                onClick={() => setDeleteTargetInquiry(inq)}
                                className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete inquiry"
                              >
                                <Trash2 className="w-4 h-4" />
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
        ) : (
          /* VIEW MODE: CARDS GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full py-16 text-center text-charcoal-400">
                <Loader2 className="h-7 w-7 animate-spin mx-auto mb-2 text-[#0D3B37]" />
                <p className="font-bold text-xs">Loading inquiries...</p>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="col-span-full py-16 text-center text-charcoal-400 bg-white rounded-3xl border border-brand-border">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="font-bold text-sm text-gray-600">No matching service inquiries</p>
              </div>
            ) : (
              filteredInquiries.map((inq) => {
                const isSelected = selectedIds.includes(inq.id);
                const statusMeta = getStatusBadge(inq.status);

                return (
                  <div
                    key={inq.id}
                    className={`p-5 rounded-3xl border bg-white shadow-xs space-y-3 transition-all relative ${
                      isSelected
                        ? "border-[#0D3B37] ring-2 ring-forest-800/20 bg-emerald-50/20"
                        : "border-brand-border hover:shadow-md"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-sand pb-3">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleToggleSelectItem(inq.id)}
                          className="p-1 rounded cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#0D3B37]" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        <div>
                          <h3 className="font-extrabold text-sm text-charcoal-900">
                            {inq.customerName}
                          </h3>
                          {inq.organization && (
                            <p className="text-xs text-forest-800 font-semibold flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3" />
                              {inq.organization}
                            </p>
                          )}
                        </div>
                      </div>

                      <select
                        value={inq.status}
                        disabled={actionLoading === inq.id}
                        onChange={(e) =>
                          handleUpdateStatus(inq.id, e.target.value as InquiryStatus)
                        }
                        className={`h-7 px-2 rounded-lg border text-[11px] font-bold focus:outline-hidden cursor-pointer ${statusMeta.bg}`}
                      >
                        <option value="NEW">New</option>
                        <option value="IN_REVIEW">In Review</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>
                    </div>

                    {/* Metadata Strip */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-charcoal-400 block font-bold">Category</span>
                        <strong className="text-charcoal-800 text-xs">{inq.serviceType}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-charcoal-400 block font-bold">Submitted</span>
                        <span className="text-charcoal-600 text-[11px]">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-sand">
                      <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider block mb-1">
                        Client Requirements
                      </span>
                      <p className="text-xs text-charcoal-800 line-clamp-3 leading-relaxed">
                        {inq.requirements}
                      </p>
                    </div>

                    {/* Follow-up Note */}
                    {inq.adminNotes && (
                      <div className="p-2.5 rounded-xl bg-forest-50/70 border border-forest-100 text-xs text-forest-900">
                        <span className="text-[10px] font-bold uppercase block text-forest-800">
                          Team Follow-up Note:
                        </span>
                        <p className="line-clamp-2 mt-0.5">{inq.adminNotes}</p>
                      </div>
                    )}

                    {/* Footer Channels */}
                    <div className="pt-2 border-t border-sand flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${inq.customerPhone}`}
                          className="p-2 rounded-xl bg-sand/60 hover:bg-sand text-charcoal-800 transition-colors"
                          title="Call phone"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={formatWhatsAppUrl(
                            inq.customerPhone,
                            inq.customerName,
                            inq.serviceType
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                        {inq.customerEmail && (
                          <a
                            href={`mailto:${inq.customerEmail}`}
                            className="p-2 rounded-xl bg-sand/60 hover:bg-sand text-charcoal-800 transition-colors"
                            title="Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedInquiry(inq);
                            setAdminNoteInput(inq.adminNotes || "");
                          }}
                          className="text-xs font-bold"
                        >
                          Details & Note
                        </Button>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetInquiry(inq)}
                          className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete inquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* INQUIRY DETAILS & NOTES MODAL / DRAWER */}
        <Modal
          isOpen={Boolean(selectedInquiry)}
          onClose={() => setSelectedInquiry(null)}
          title={`Service Inquiry Details: ${selectedInquiry?.customerName}`}
          description={`Submitted on ${
            selectedInquiry ? new Date(selectedInquiry.createdAt).toLocaleString() : ""
          }`}
          maxWidth="xl"
        >
          {selectedInquiry && (
            <div className="space-y-5 text-xs">
              {/* Header Card */}
              <div className="p-4 rounded-2xl bg-[#0D3B37] text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">
                    Service Scope
                  </span>
                  <h3 className="font-extrabold text-base">{selectedInquiry.serviceType}</h3>
                  {selectedInquiry.organization && (
                    <p className="text-xs text-emerald-200/90 mt-0.5 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {selectedInquiry.organization}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">
                    Status
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-white/20 text-white font-extrabold text-xs uppercase">
                    {selectedInquiry.status}
                  </span>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-sand space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block">
                    Customer Phone
                  </span>
                  <div className="flex items-center justify-between">
                    <a
                      href={`tel:${selectedInquiry.customerPhone}`}
                      className="text-sm font-mono font-bold text-forest-900 hover:underline"
                    >
                      {selectedInquiry.customerPhone}
                    </a>
                    <a
                      href={formatWhatsAppUrl(
                        selectedInquiry.customerPhone,
                        selectedInquiry.customerName,
                        selectedInquiry.serviceType
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" /> WhatsApp
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-sand space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block">
                    Customer Email
                  </span>
                  <p className="text-sm font-semibold text-charcoal-800">
                    {selectedInquiry.customerEmail || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Full Requirements */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block">
                  Customer Description & Specifications
                </span>
                <div className="p-4 rounded-2xl bg-white border border-brand-border text-charcoal-800 text-xs leading-relaxed whitespace-pre-line">
                  {selectedInquiry.requirements}
                </div>
              </div>

              {/* Internal Follow-up Notes Editor */}
              <div className="space-y-2 p-4 rounded-2xl bg-[#FAF8F5] border border-sand">
                <span className="text-xs font-bold text-charcoal-900 block">
                  Staff / Admin Follow-up Notes:
                </span>
                <textarea
                  rows={3}
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder="Record call logs, price quotations, artisan availability, or next steps..."
                  className="w-full p-3 rounded-xl border border-brand-border bg-white text-xs focus:ring-2 focus:ring-[#0D3B37] focus:outline-hidden"
                />
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[10px] text-charcoal-400">
                    Visible only to admin and operations team.
                  </span>
                  <Button
                    size="sm"
                    onClick={handleSaveAdminNote}
                    disabled={isSavingNote}
                    className="bg-[#0D3B37] hover:bg-forest-900 text-white font-bold text-xs"
                  >
                    {isSavingNote && <Loader2 className="w-3 h-3 animate-spin mr-1" />}
                    Save Note
                  </Button>
                </div>
              </div>

              {/* Change Status Fast Stepper */}
              <div className="pt-2 border-t border-sand flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-charcoal-500">Update Status:</span>
                  {(["NEW", "IN_REVIEW", "CONTACTED", "RESOLVED"] as InquiryStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedInquiry.id, st, adminNoteInput)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedInquiry.status === st
                          ? "bg-[#0D3B37] text-white"
                          : "bg-sand hover:bg-sand-dark text-charcoal-800"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInquiry(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* SINGLE DELETE CONFIRMATION MODAL */}
        <Modal
          isOpen={Boolean(deleteTargetInquiry)}
          onClose={() => !deleteLoading && setDeleteTargetInquiry(null)}
          title="Delete Inquiry Record"
          description="Are you sure you want to permanently remove this service inquiry?"
          maxWidth="sm"
        >
          {deleteTargetInquiry && (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                <p className="font-bold">{deleteTargetInquiry.customerName}</p>
                <p className="text-[11px] mt-0.5">
                  {deleteTargetInquiry.serviceType} • {deleteTargetInquiry.customerPhone}
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-sand">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={deleteLoading}
                  onClick={() => setDeleteTargetInquiry(null)}
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
                  Delete Inquiry
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* BATCH DELETE CONFIRMATION MODAL */}
        <Modal
          isOpen={showBatchDeleteModal}
          onClose={() => !deleteLoading && setShowBatchDeleteModal(false)}
          title="Delete Multiple Inquiries"
          description={`Are you sure you want to delete ${selectedIds.length} selected record(s)?`}
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
              <p className="font-bold">Permanent Deletion</p>
              <p className="text-[11px] mt-0.5">
                All {selectedIds.length} customer inquiry entries will be permanently removed.
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
