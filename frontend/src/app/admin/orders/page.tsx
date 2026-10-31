"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Filter,
  Loader2,
  RefreshCw,
  AlertCircle,
  Trash2,
  Printer,
  Download,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Phone,
  MapPin,
  Calendar,
  X,
  CreditCard,
  Send,
  FileText,
  Sparkles,
  AlertTriangle,
  CheckSquare,
  Square,
  MinusSquare,
  Package,
  ArrowRight,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { formatPrice } from "@/lib/utils";
import { ordersApi } from "@/lib/api";

interface AlertToastState {
  type: "success" | "error" | "warning";
  title: string;
  message: string;
}

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [batchActionLoading, setBatchActionLoading] = React.useState(false);
  const [stats, setStats] = React.useState<any>({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    paidOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0,
  });

  // Filter States
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [paymentStatusFilter, setPaymentStatusFilter] = React.useState<string>("ALL");
  const [paymentMethodFilter, setPaymentMethodFilter] = React.useState<string>("ALL");
  const [dateRangeFilter, setDateRangeFilter] = React.useState<string>("ALL");

  // Selection for Batch Actions
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Detailed Drawer & Modal States
  const [selectedOrder, setSelectedOrder] = React.useState<any | null>(null);
  const [printInvoiceOrder, setPrintInvoiceOrder] = React.useState<any | null>(null);
  const [printMultipleOrders, setPrintMultipleOrders] = React.useState<any[] | null>(null);

  // Tracking Event Form in Drawer
  const [trackingStatus, setTrackingStatus] = React.useState<OrderStatus>("PROCESSING");
  const [trackingNote, setTrackingNote] = React.useState("");
  const [trackingLocation, setTrackingLocation] = React.useState("");
  const [isAddingTracking, setIsAddingTracking] = React.useState(false);

  // Delete Modals
  const [deleteTargetOrder, setDeleteTargetOrder] = React.useState<any | null>(null);
  const [showBatchDeleteModal, setShowBatchDeleteModal] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  // Copy Feedback
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Modern Toast
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

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = { limit: 150 };
      if (statusFilter !== "ALL") params.status = statusFilter;
      if (paymentStatusFilter !== "ALL") params.paymentStatus = paymentStatusFilter;
      if (paymentMethodFilter !== "ALL") params.paymentMethod = paymentMethodFilter;
      if (dateRangeFilter !== "ALL") params.dateRange = dateRangeFilter;
      if (search.trim()) params.search = search.trim();

      const res = await ordersApi.getAll(params);
      if (res.success && res.data) {
        const orderList = (res.data as any).orders || (res.data as any) || [];
        setOrders(Array.isArray(orderList) ? orderList : []);
        if ((res.data as any).stats) {
          setStats((res.data as any).stats);
        }
      }
    } catch (err: any) {
      console.error("Failed to load orders:", err);
      showAlert("error", "Failed to Load", err?.message || "Could not retrieve orders from server.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, [statusFilter, paymentStatusFilter, paymentMethodFilter, dateRangeFilter]);

  // Client-side quick filter fallback if user types in search
  const filteredOrders = React.useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "ALL" && o.orderStatus !== statusFilter) return false;
      if (paymentStatusFilter !== "ALL" && o.paymentStatus !== paymentStatusFilter) return false;
      if (paymentMethodFilter !== "ALL" && o.paymentMethod !== paymentMethodFilter) return false;
      if (!search.trim()) return true;

      const q = search.toLowerCase();
      const matchNumber = o.orderNumber?.toLowerCase().includes(q);
      const matchName = o.customerName?.toLowerCase().includes(q);
      const matchPhone = o.customerPhone?.includes(q);
      const matchEmail = o.customerEmail?.toLowerCase().includes(q);
      const matchCity = o.city?.toLowerCase().includes(q);
      const matchTrx = o.transactionId?.toLowerCase().includes(q);

      return matchNumber || matchName || matchPhone || matchEmail || matchCity || matchTrx;
    });
  }, [orders, search, statusFilter, paymentStatusFilter, paymentMethodFilter]);

  // Multi-select helpers
  const allFilteredSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every((o) => selectedIds.includes(o.id));
  const someFilteredSelected =
    filteredOrders.some((o) => selectedIds.includes(o.id)) && !allFilteredSelected;

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map((o) => o.id));
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

  // Status and Payment updates
  const handleUpdateStatus = async (orderId: string, newStatus: string, note?: string) => {
    try {
      setActionLoading(orderId);
      const res = await ordersApi.updateStatus(orderId, newStatus, undefined, note);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((curr: any) => ({ ...curr, orderStatus: newStatus }));
        }
        showAlert("success", "Status Updated", `Order status changed to ${newStatus}.`);
      } else {
        showAlert("error", "Update Failed", res.message || "Failed to update order status.");
      }
    } catch (err: any) {
      showAlert("error", "Error", err?.message || "Server error updating status.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      setActionLoading(orderId);
      const res = await ordersApi.updatePayment(orderId, paymentStatus);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, paymentStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((curr: any) => ({ ...curr, paymentStatus }));
        }
        showAlert(
          "success",
          "Payment Updated",
          `Payment status marked as ${paymentStatus}.`
        );
      } else {
        showAlert("error", "Update Failed", res.message || "Failed to update payment.");
      }
    } catch (err: any) {
      showAlert("error", "Error", err?.message || "Server error updating payment status.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddTrackingEvent = async () => {
    if (!selectedOrder) return;
    if (!trackingNote.trim()) {
      showAlert("warning", "Note Required", "Please enter a tracking note or courier status.");
      return;
    }
    try {
      setIsAddingTracking(true);
      const res = await ordersApi.addTracking(selectedOrder.id, {
        status: trackingStatus,
        description: trackingNote.trim(),
        location: trackingLocation.trim() || undefined,
      });
      if (res.success) {
        // Refresh single order details
        const refreshed = await ordersApi.getById(selectedOrder.id);
        if (refreshed.success && refreshed.data) {
          setSelectedOrder(refreshed.data);
          setOrders((prev) =>
            prev.map((o) => (o.id === selectedOrder.id ? refreshed.data : o))
          );
        }
        setTrackingNote("");
        setTrackingLocation("");
        showAlert("success", "Event Logged", "New fulfillment event added to timeline.");
      } else {
        showAlert("error", "Event Failed", res.message || "Could not log tracking event.");
      }
    } catch (err: any) {
      showAlert("error", "Error", err?.message || "Failed to add tracking event.");
    } finally {
      setIsAddingTracking(false);
    }
  };

  // Batch actions
  const handleBatchStatus = async (status: OrderStatus) => {
    if (selectedIds.length === 0) return;
    try {
      setBatchActionLoading(true);
      const res = await ordersApi.batchStatus(selectedIds, status);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (selectedIds.includes(o.id) ? { ...o, orderStatus: status } : o))
        );
        showAlert(
          "success",
          "Batch Status Updated",
          `${selectedIds.length} orders updated to ${status}.`
        );
        setSelectedIds([]);
      } else {
        showAlert("error", "Batch Failed", res.message || "Failed to update selected orders.");
      }
    } catch (err: any) {
      showAlert("error", "Error", err?.message || "Batch status update error.");
    } finally {
      setBatchActionLoading(false);
    }
  };

  const handleBatchPaymentStatus = async (paymentStatus: PaymentStatus) => {
    if (selectedIds.length === 0) return;
    try {
      setBatchActionLoading(true);
      const res = await ordersApi.batchPaymentStatus(selectedIds, paymentStatus);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (selectedIds.includes(o.id) ? { ...o, paymentStatus } : o))
        );
        showAlert(
          "success",
          "Batch Payment Updated",
          `${selectedIds.length} orders marked as ${paymentStatus}.`
        );
        setSelectedIds([]);
      } else {
        showAlert("error", "Batch Failed", res.message || "Failed to update payment status.");
      }
    } catch (err: any) {
      showAlert("error", "Error", err?.message || "Batch payment update error.");
    } finally {
      setBatchActionLoading(false);
    }
  };

  // Delete actions
  const handleConfirmSingleDelete = async () => {
    if (!deleteTargetOrder) return;
    try {
      setDeleteLoading(true);
      const res = await ordersApi.delete(deleteTargetOrder.id);
      if (res.success) {
        setOrders((prev) => prev.filter((o) => o.id !== deleteTargetOrder.id));
        setSelectedIds((prev) => prev.filter((id) => id !== deleteTargetOrder.id));
        if (selectedOrder?.id === deleteTargetOrder.id) {
          setSelectedOrder(null);
        }
        showAlert("success", "Order Deleted", `Order ${deleteTargetOrder.orderNumber} removed.`);
        setDeleteTargetOrder(null);
      } else {
        showAlert("error", "Delete Failed", res.message || "Could not delete order.");
      }
    } catch (err: any) {
      showAlert("error", "Error", err?.message || "Server error while deleting order.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleConfirmBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      setDeleteLoading(true);
      const res = await ordersApi.batchDelete(selectedIds);
      if (res.success) {
        setOrders((prev) => prev.filter((o) => !selectedIds.includes(o.id)));
        showAlert(
          "success",
          "Orders Deleted",
          `Successfully removed ${selectedIds.length} orders.`
        );
        setSelectedIds([]);
        setShowBatchDeleteModal(false);
      } else {
        showAlert("error", "Batch Delete Failed", res.message || "Failed to delete orders.");
      }
    } catch (err: any) {
      showAlert("error", "Error", err?.message || "Server error during batch delete.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Utility helpers
  const formatWhatsAppUrl = (phone: string, orderNumber: string, customerName: string) => {
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) clean = "880" + clean.slice(1);
    else if (!clean.startsWith("880") && clean.length === 10) clean = "880" + clean;
    const msg = encodeURIComponent(
      `Hello ${customerName}, greeting from Shoilpikkabbo regarding your Order #${orderNumber}. We are preparing your artisanal package.`
    );
    return `https://wa.me/${clean}?text=${msg}`;
  };

  const copyCourierFormat = (ord: any) => {
    const isPaid = ord.paymentStatus === "PAID";
    const collectionAmount = isPaid ? "0 (Paid)" : `৳${Number(ord.totalAmount)}`;
    const text = `Customer: ${ord.customerName}\nPhone: ${ord.customerPhone}\nAddress: ${ord.shippingAddress}, ${ord.city}\nCollection: ${collectionAmount}\nNote: Order #${ord.orderNumber} - ${ord.deliveryNotes || "Handle with care"}`;
    copyToClipboard(text, `courier-${ord.id}`);
    showAlert("success", "Copied for Courier", "Formatted address copied for Steadfast / Pathao.");
  };

  const exportOrdersCSV = (itemsToExport: any[]) => {
    if (!itemsToExport || itemsToExport.length === 0) {
      showAlert("warning", "No Data", "There are no orders to export.");
      return;
    }
    const headers = [
      "Order Number",
      "Placed Date",
      "Customer Name",
      "Phone",
      "Email",
      "City",
      "Delivery Address",
      "Payment Method",
      "Payment Status",
      "Order Status",
      "Total Amount",
      "Subtotal",
      "Delivery Fee",
      "Discount",
      "Coupon",
      "Items Count",
      "Items Breakdown",
    ];

    const rows = itemsToExport.map((o) => [
      `"${o.orderNumber}"`,
      `"${new Date(o.createdAt).toLocaleString()}"`,
      `"${(o.customerName || "").replace(/"/g, '""')}"`,
      `"${(o.customerPhone || "").replace(/"/g, '""')}"`,
      `"${(o.customerEmail || "").replace(/"/g, '""')}"`,
      `"${(o.city || "").replace(/"/g, '""')}"`,
      `"${(o.shippingAddress || "").replace(/"/g, '""')}"`,
      `"${o.paymentMethod || ""}"`,
      `"${o.paymentStatus || ""}"`,
      `"${o.orderStatus || ""}"`,
      o.totalAmount,
      o.subtotal,
      o.deliveryCharge,
      o.discountAmount || 0,
      `"${o.couponCode || ""}"`,
      o.items?.length || 0,
      `"${(o.items || [])
        .map((i: any) => `${i.productName} (x${i.quantity})`)
        .join("; ")
        .replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `shoilpikkabbo-orders-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showAlert("success", "Export Ready", `Exported ${itemsToExport.length} orders to CSV.`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          bg: "bg-amber-50 text-amber-800 border-amber-200",
          dot: "bg-amber-500",
          label: "Pending",
        };
      case "PROCESSING":
        return {
          bg: "bg-sky-50 text-sky-800 border-sky-200",
          dot: "bg-sky-500",
          label: "Processing",
        };
      case "SHIPPED":
        return {
          bg: "bg-purple-50 text-purple-800 border-purple-200",
          dot: "bg-purple-500",
          label: "Shipped",
        };
      case "DELIVERED":
        return {
          bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
          dot: "bg-emerald-500",
          label: "Delivered",
        };
      case "CANCELLED":
        return {
          bg: "bg-rose-50 text-rose-800 border-rose-200",
          dot: "bg-rose-500",
          label: "Cancelled",
        };
      default:
        return {
          bg: "bg-gray-50 text-gray-800 border-gray-200",
          dot: "bg-gray-400",
          label: status,
        };
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "PENDING":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "FAILED":
        return "bg-rose-50 text-rose-800 border-rose-200";
      case "REFUNDED":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getOrderPaymentBadge = (ord: any) => {
    if (!ord) return { label: "N/A", badgeClass: "bg-gray-50 text-gray-700 border-gray-200" };
    const method = ord.paymentMethod || "";
    const payment = ord.payments && ord.payments.length > 0 ? ord.payments[0] : null;
    const notes = ((payment?.verificationNotes || "") + " " + (payment?.bankReference || "")).toLowerCase();

    if (method === "BKASH_MANUAL" || notes.includes("bkash")) {
      const isOnline = method === "ONLINE_GATEWAY" || notes.includes("sslcommerz");
      return {
        label: isOnline ? "bKash (Online)" : "bKash (Manual)",
        badgeClass: "bg-pink-50 text-[#e2136e] border-[#e2136e]/30 font-bold",
      };
    }
    if (method === "NAGAD_MANUAL" || notes.includes("nagad")) {
      const isOnline = method === "ONLINE_GATEWAY" || notes.includes("sslcommerz");
      return {
        label: isOnline ? "Nagad (Online)" : "Nagad (Manual)",
        badgeClass: "bg-orange-50 text-[#d85604] border-[#f7941d]/30 font-bold",
      };
    }
    if (method === "ROCKET_MANUAL" || notes.includes("rocket") || notes.includes("dbbl")) {
      const isOnline = method === "ONLINE_GATEWAY" || notes.includes("sslcommerz");
      return {
        label: isOnline ? "Rocket (Online)" : "Rocket (Manual)",
        badgeClass: "bg-purple-50 text-[#8c3494] border-[#8c3494]/30 font-bold",
      };
    }
    if (notes.includes("visa")) {
      return {
        label: "Visa Card (SSL)",
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200 font-bold",
      };
    }
    if (notes.includes("master")) {
      return {
        label: "Mastercard (SSL)",
        badgeClass: "bg-rose-50 text-rose-700 border-rose-200 font-bold",
      };
    }
    if (method === "ONLINE_GATEWAY") {
      return {
        label: "SSL Gateway (Online)",
        badgeClass: "bg-teal-50 text-teal-800 border-teal-200 font-bold",
      };
    }
    if (method === "CASH_ON_DELIVERY") {
      return {
        label: "COD (Cash)",
        badgeClass: "bg-forest-50 text-forest-800 border-forest-200 font-bold",
      };
    }
    if (method === "BANK_TRANSFER") {
      return {
        label: "Bank Wire",
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200 font-bold",
      };
    }
    return {
      label: method?.replace("_MANUAL", "") || "Online",
      badgeClass: "bg-gray-50 text-gray-700 border-gray-200 font-bold",
    };
  };

  const resetAllFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setPaymentStatusFilter("ALL");
    setPaymentMethodFilter("ALL");
    setDateRangeFilter("ALL");
  };

  const activeFilterCount =
    (statusFilter !== "ALL" ? 1 : 0) +
    (paymentStatusFilter !== "ALL" ? 1 : 0) +
    (paymentMethodFilter !== "ALL" ? 1 : 0) +
    (dateRangeFilter !== "ALL" ? 1 : 0) +
    (search ? 1 : 0);

  const selectedOrdersList = React.useMemo(() => {
    return orders.filter((o) => selectedIds.includes(o.id));
  }, [orders, selectedIds]);

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
                Live Fulfillment Studio
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-charcoal-500">Real-time sync</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 font-heading mt-1">
              Order Management & Dispatch
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-0.5">
              Fulfill customer orders, verify manual payments, assign couriers, and track nationwide deliveries.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="outline"
              size="md"
              onClick={() => exportOrdersCSV(filteredOrders)}
              disabled={loading || filteredOrders.length === 0}
              className="border-brand-border text-charcoal-700 hover:bg-sand rounded-2xl text-xs font-bold"
            >
              <Download className="h-3.5 w-3.5 mr-1.5 text-forest-800" />
              Export CSV ({filteredOrders.length})
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={fetchOrders}
              disabled={loading}
              className="border-brand-border text-charcoal-700 hover:bg-sand rounded-2xl text-xs font-bold"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin text-forest-800" : ""}`} />
              Refresh Studio
            </Button>
          </div>
        </div>

        {/* EXECUTIVE KPI STATS STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* 1. Total Volume */}
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
                Total Orders
              </span>
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  statusFilter === "ALL" ? "bg-white/10 text-emerald-300" : "bg-forest-800/10 text-forest-900"
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black">{stats.totalOrders || orders.length}</div>
            <div
              className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${
                statusFilter === "ALL" ? "text-emerald-300" : "text-forest-900"
              }`}
            >
              <span>Vol: {formatPrice(stats.totalRevenue || 0)}</span>
            </div>
          </div>

          {/* 2. Pending Fulfillment */}
          <div
            onClick={() => setStatusFilter("PENDING")}
            className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
              statusFilter === "PENDING"
                ? "bg-amber-500 text-gray-950 border-amber-600 shadow-md ring-2 ring-amber-500/20"
                : "bg-white text-charcoal-900 border-brand-border hover:border-amber-400 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  statusFilter === "PENDING" ? "text-amber-950" : "text-charcoal-500"
                }`}
              >
                Pending Review
              </span>
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  statusFilter === "PENDING" ? "bg-black/15 text-amber-950" : "bg-amber-100 text-amber-800"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-700">
              {stats.pendingOrders ?? orders.filter((o) => o.orderStatus === "PENDING").length}
            </div>
            <div
              className={`text-[11px] font-bold mt-1 ${
                statusFilter === "PENDING" ? "text-amber-950" : "text-amber-700"
              }`}
            >
              Action Required
            </div>
          </div>

          {/* 3. In Processing */}
          <div
            onClick={() => setStatusFilter("PROCESSING")}
            className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
              statusFilter === "PROCESSING"
                ? "bg-sky-600 text-white border-sky-700 shadow-md ring-2 ring-sky-500/20"
                : "bg-white text-charcoal-900 border-brand-border hover:border-sky-400 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  statusFilter === "PROCESSING" ? "text-sky-100" : "text-charcoal-500"
                }`}
              >
                Packaging
              </span>
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  statusFilter === "PROCESSING" ? "bg-white/15 text-white" : "bg-sky-100 text-sky-800"
                }`}
              >
                <Package className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black">
              {stats.processingOrders ?? orders.filter((o) => o.orderStatus === "PROCESSING").length}
            </div>
            <div
              className={`text-[11px] font-semibold mt-1 ${
                statusFilter === "PROCESSING" ? "text-sky-100" : "text-sky-700"
              }`}
            >
              In Warehouse
            </div>
          </div>

          {/* 4. Dispatched / Shipped */}
          <div
            onClick={() => setStatusFilter("SHIPPED")}
            className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
              statusFilter === "SHIPPED"
                ? "bg-purple-600 text-white border-purple-700 shadow-md ring-2 ring-purple-500/20"
                : "bg-white text-charcoal-900 border-brand-border hover:border-purple-400 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  statusFilter === "SHIPPED" ? "text-purple-100" : "text-charcoal-500"
                }`}
              >
                In Transit
              </span>
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  statusFilter === "SHIPPED" ? "bg-white/15 text-white" : "bg-purple-100 text-purple-800"
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black">
              {stats.shippedOrders ?? orders.filter((o) => o.orderStatus === "SHIPPED").length}
            </div>
            <div
              className={`text-[11px] font-semibold mt-1 ${
                statusFilter === "SHIPPED" ? "text-purple-100" : "text-purple-700"
              }`}
            >
              With Courier
            </div>
          </div>

          {/* 5. Delivered */}
          <div
            onClick={() => setStatusFilter("DELIVERED")}
            className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
              statusFilter === "DELIVERED"
                ? "bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/20"
                : "bg-white text-charcoal-900 border-brand-border hover:border-emerald-400 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  statusFilter === "DELIVERED" ? "text-emerald-100" : "text-charcoal-500"
                }`}
              >
                Delivered
              </span>
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  statusFilter === "DELIVERED" ? "bg-white/15 text-white" : "bg-emerald-100 text-emerald-800"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black">
              {stats.deliveredOrders ?? orders.filter((o) => o.orderStatus === "DELIVERED").length}
            </div>
            <div
              className={`text-[11px] font-semibold mt-1 ${
                statusFilter === "DELIVERED" ? "text-emerald-100" : "text-emerald-700"
              }`}
            >
              Fulfilled & Closed
            </div>
          </div>
        </div>

        {/* STATUS TABS NAVIGATION */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: "ALL", label: "All Orders", count: stats.totalOrders || orders.length },
            { id: "PENDING", label: "Pending", count: stats.pendingOrders, dot: "bg-amber-400" },
            { id: "PROCESSING", label: "Processing", count: stats.processingOrders, dot: "bg-sky-400" },
            { id: "SHIPPED", label: "Shipped", count: stats.shippedOrders, dot: "bg-purple-400" },
            { id: "DELIVERED", label: "Delivered", count: stats.deliveredOrders, dot: "bg-emerald-400" },
            { id: "CANCELLED", label: "Cancelled", count: stats.cancelledOrders, dot: "bg-rose-400" },
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

        {/* SEARCH & MULTI-FILTER CONTROL BAR */}
        <div className="p-4 rounded-3xl bg-white border border-brand-border shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Quick Search */}
          <div className="relative w-full lg:w-96">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <Input
              placeholder="Search by order #, customer, phone, city..."
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

          {/* Secondary Filters Dropdowns */}
          <div className="flex items-center gap-2.5 w-full lg:w-auto flex-wrap">
            {/* Payment Status */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-charcoal-500 font-bold whitespace-nowrap">Payment:</span>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-2xl border border-brand-border bg-white text-xs text-charcoal-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0D3B37]"
              >
                <option value="ALL">All Payments</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending Payment</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>

            {/* Payment Method */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-charcoal-500 font-bold whitespace-nowrap">Method:</span>
              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="h-10 px-3 rounded-2xl border border-brand-border bg-white text-xs text-charcoal-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0D3B37]"
              >
                <option value="ALL">All Methods</option>
                <option value="CASH_ON_DELIVERY">Cash on Delivery (COD)</option>
                <option value="BKASH_MANUAL">bKash Manual</option>
                <option value="NAGAD_MANUAL">Nagad Manual</option>
                <option value="ROCKET_MANUAL">Rocket Manual</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </select>
            </div>

            {/* Date Preset */}
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
              Showing {filteredOrders.length} of {orders.length}
            </span>
          </div>
        </div>

        {/* FLOATING / STICKY BATCH ACTION BAR (Rendered whenever 1+ items selected) */}
        {selectedIds.length > 0 && (
          <div className="sticky top-20 z-40 p-4 rounded-3xl bg-[#0D3B37] text-white shadow-2xl border border-emerald-900/40 flex flex-col md:flex-row items-center justify-between gap-3 animate-in slide-in-from-top-3 fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-sm text-[#E0592A]">
                {selectedIds.length}
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">
                  {selectedIds.length} order(s) selected
                </p>
                <p className="text-[11px] text-emerald-200/80">
                  Execute bulk fulfillment or status updates simultaneously
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Batch to Processing */}
              <button
                type="button"
                disabled={batchActionLoading}
                onClick={() => handleBatchStatus("PROCESSING")}
                className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {batchActionLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Package className="w-3.5 h-3.5" />
                )}
                <span>Mark Processing</span>
              </button>

              {/* Batch to Shipped */}
              <button
                type="button"
                disabled={batchActionLoading}
                onClick={() => handleBatchStatus("SHIPPED")}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {batchActionLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Truck className="w-3.5 h-3.5" />
                )}
                <span>Mark Shipped</span>
              </button>

              {/* Batch to Delivered */}
              <button
                type="button"
                disabled={batchActionLoading}
                onClick={() => handleBatchStatus("DELIVERED")}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {batchActionLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                <span>Mark Delivered</span>
              </button>

              {/* Batch Mark Paid */}
              <button
                type="button"
                disabled={batchActionLoading}
                onClick={() => handleBatchPaymentStatus("PAID")}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                <CreditCard className="w-3.5 h-3.5 text-gray-950" />
                <span>Mark as Paid</span>
              </button>

              {/* Batch Print Invoices */}
              <button
                type="button"
                onClick={() => setPrintMultipleOrders(selectedOrdersList)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-300" />
                <span>Print Invoices</span>
              </button>

              {/* Batch Export Selected */}
              <button
                type="button"
                onClick={() => exportOrdersCSV(selectedOrdersList)}
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

        {/* FULL-WIDTH ORDERS TABLE */}
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
                  <th className="py-3.5 px-4 min-w-[140px]">Order & Date</th>
                  <th className="py-3.5 px-4 min-w-[200px]">Customer & Contact</th>
                  <th className="py-3.5 px-4 min-w-[180px]">Delivery Address</th>
                  <th className="py-3.5 px-4 min-w-[140px]">Items</th>
                  <th className="py-3.5 px-4 min-w-[150px]">Payment</th>
                  <th className="py-3.5 px-4 min-w-[120px]">Total Amount</th>
                  <th className="py-3.5 px-4 min-w-[160px]">Fulfillment Status</th>
                  <th className="py-3.5 px-4 text-right min-w-[130px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center text-charcoal-400">
                      <Loader2 className="h-7 w-7 animate-spin mx-auto mb-2 text-[#0D3B37]" />
                      <p className="font-bold text-xs">Loading live orders from database...</p>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center text-charcoal-400">
                      <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="font-bold text-sm text-gray-600">No matching orders found</p>
                      <p className="text-xs text-gray-400 mt-1">Try resetting search filters or status</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => {
                    const isSelected = selectedIds.includes(ord.id);
                    const statusMeta = getStatusBadge(ord.orderStatus);

                    return (
                      <tr
                        key={ord.id}
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
                            onClick={() => handleToggleSelectItem(ord.id)}
                            className="p-1 rounded-md cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#0D3B37]" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                            )}
                          </button>
                        </td>

                        {/* Order & Date */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-charcoal-900 font-mono text-xs">
                              {ord.orderNumber}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(ord.orderNumber, ord.id)}
                              className="p-1 text-gray-400 hover:text-forest-900 rounded transition-colors cursor-pointer"
                              title="Copy order number"
                            >
                              {copiedId === ord.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <span className="text-[10px] text-charcoal-500 block mt-0.5">
                            {new Date(ord.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}{" "}
                            •{" "}
                            {new Date(ord.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {ord.deliveryNotes && (
                            <span
                              className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 text-[10px] font-bold mt-1"
                              title={ord.deliveryNotes}
                            >
                              Note from client
                            </span>
                          )}
                        </td>

                        {/* Customer & Direct Channels */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-sand/80 border border-brand-border flex items-center justify-center font-bold text-forest-900 text-[11px] shrink-0">
                              {(ord.customerName || "U")
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-charcoal-900 truncate">
                                {ord.customerName}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <a
                                  href={`tel:${ord.customerPhone}`}
                                  className="text-[11px] text-forest-800 hover:underline font-mono inline-flex items-center gap-0.5"
                                  title="Call customer"
                                >
                                  <Phone className="w-2.5 h-2.5" />
                                  <span>{ord.customerPhone}</span>
                                </a>

                                {/* WhatsApp Link */}
                                <a
                                  href={formatWhatsAppUrl(
                                    ord.customerPhone,
                                    ord.orderNumber,
                                    ord.customerName
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                                  title="Chat on WhatsApp"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Delivery Destination */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                ord.city?.toLowerCase().includes("dhaka")
                                  ? "bg-forest-800/10 text-forest-900"
                                  : "bg-sand text-charcoal-700"
                              }`}
                            >
                              {ord.city}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyCourierFormat(ord)}
                              className="text-gray-400 hover:text-forest-900 p-0.5 transition-colors cursor-pointer"
                              title="Copy full courier address"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-[11px] text-charcoal-500 line-clamp-1 mt-0.5">
                            {ord.shippingAddress}
                          </p>
                        </td>

                        {/* Ordered Items Preview */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <div className="flex -space-x-2 overflow-hidden py-0.5">
                              {(ord.items || []).slice(0, 3).map((item: any, idx: number) => {
                                const img =
                                  item.product?.images?.[0]?.url ||
                                  "/images/client-mockup/cat-handicrafts.png";
                                return (
                                  <div
                                    key={idx}
                                    className="relative w-7 h-7 rounded-lg bg-white border border-sand overflow-hidden shrink-0 shadow-2xs"
                                    title={`${item.productName} (x${item.quantity})`}
                                  >
                                    <Image
                                      src={img}
                                      alt=""
                                      fill
                                      className="object-contain p-0.5"
                                    />
                                  </div>
                                );
                              })}
                            </div>
                            <span className="text-[11px] font-bold text-charcoal-700">
                              {ord.items?.length || 0} item(s)
                            </span>
                          </div>
                        </td>

                        {/* Payment */}
                        <td className="py-3.5 px-4">
                          {(() => {
                            const pBadge = getOrderPaymentBadge(ord);
                            return (
                              <span
                                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold block text-center border ${pBadge.badgeClass}`}
                              >
                                {pBadge.label}
                              </span>
                            );
                          })()}
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdatePaymentStatus(
                                ord.id,
                                ord.paymentStatus === "PAID" ? "PENDING" : "PAID"
                              )
                            }
                            disabled={actionLoading === ord.id}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border mt-1 inline-flex items-center gap-1 cursor-pointer transition-colors ${getPaymentStatusBadge(
                              ord.paymentStatus
                            )}`}
                            title="Click to toggle payment status (Paid / Pending)"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                ord.paymentStatus === "PAID" ? "bg-emerald-500" : "bg-amber-500"
                              }`}
                            />
                            <span>{ord.paymentStatus}</span>
                          </button>
                        </td>

                        {/* Total Amount */}
                        <td className="py-3.5 px-4">
                          <span className="font-black text-[#0D3B37] text-sm block">
                            {formatPrice(Number(ord.totalAmount))}
                          </span>
                          <span className="text-[10px] text-charcoal-400 block">
                            {Number(ord.deliveryCharge) === 0
                              ? "Free Delivery"
                              : `+৳${ord.deliveryCharge} deliv.`}
                          </span>
                        </td>

                        {/* Fulfillment Status Dropdown */}
                        <td className="py-3.5 px-4">
                          <select
                            value={ord.orderStatus}
                            disabled={actionLoading === ord.id}
                            onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                            className={`h-8 px-2.5 rounded-xl border text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-forest-800/20 cursor-pointer transition-all ${statusMeta.bg}`}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* View / Fulfill Drawer */}
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(ord)}
                              className="p-1.5 rounded-xl bg-forest-800/10 hover:bg-forest-800 hover:text-white text-forest-900 transition-colors cursor-pointer inline-flex items-center"
                              title="Open order fulfillment drawer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Print Single Invoice */}
                            <button
                              type="button"
                              onClick={() => setPrintInvoiceOrder(ord)}
                              className="p-1.5 rounded-xl text-gray-500 hover:text-[#0D3B37] hover:bg-sand transition-colors cursor-pointer inline-flex items-center"
                              title="Print customer invoice"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => setDeleteTargetOrder(ord)}
                              className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer inline-flex items-center"
                              title="Delete order"
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

        {/* ORDER DETAILS & FULFILLMENT SLIDE-OUT DRAWER / MODAL */}
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Fulfillment Studio: ${selectedOrder?.orderNumber}`}
          description={`Placed on ${
            selectedOrder
              ? new Date(selectedOrder.createdAt).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""
          }`}
          maxWidth="2xl"
        >
          {selectedOrder && (
            <div className="space-y-6 text-xs max-h-[80vh] overflow-y-auto pr-1">
              {/* Top Quick Actions Bar */}
              <div className="p-3.5 rounded-2xl bg-[#0D3B37] text-white flex flex-wrap items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-200">Current Status:</span>
                  <span className="px-2.5 py-1 rounded-xl bg-white/20 text-white font-extrabold uppercase text-[11px]">
                    {selectedOrder.orderStatus}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => copyCourierFormat(selectedOrder)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <Copy className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copy for Courier</span>
                  </button>

                  <a
                    href={formatWhatsAppUrl(
                      selectedOrder.customerPhone,
                      selectedOrder.orderNumber,
                      selectedOrder.customerName
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setPrintInvoiceOrder(selectedOrder);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Invoice</span>
                  </button>
                </div>
              </div>

              {/* Status Stepper Progression */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-sand">
                <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider block mb-3">
                  Fulfillment Stepper
                </span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { key: "PENDING", label: "1. Placed" },
                    { key: "PROCESSING", label: "2. Packaging" },
                    { key: "SHIPPED", label: "3. Dispatched" },
                    { key: "DELIVERED", label: "4. Delivered" },
                  ].map((step, idx) => {
                    const statusOrder = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];
                    const currentIdx = statusOrder.indexOf(selectedOrder.orderStatus);
                    const isDone = currentIdx >= idx;
                    const isCurrent = selectedOrder.orderStatus === step.key;

                    return (
                      <button
                        key={step.key}
                        type="button"
                        onClick={() => handleUpdateStatus(selectedOrder.id, step.key)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isCurrent
                            ? "bg-[#0D3B37] text-white border-forest-900 shadow-xs"
                            : isDone
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-white text-charcoal-400 border-sand hover:bg-sand"
                        }`}
                      >
                        {step.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2-Column Details: Customer vs Delivery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Information */}
                <div className="p-4 rounded-2xl bg-white border border-brand-border space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                    Customer Profile
                  </span>
                  <p className="font-extrabold text-charcoal-900 text-sm">
                    {selectedOrder.customerName}
                  </p>
                  <p className="text-charcoal-600 font-mono text-xs flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-forest-800" />
                    <span>{selectedOrder.customerPhone}</span>
                  </p>
                  {selectedOrder.customerEmail && (
                    <p className="text-charcoal-500 text-xs">{selectedOrder.customerEmail}</p>
                  )}
                  {selectedOrder.user && (
                    <span className="inline-block px-2 py-0.5 rounded bg-forest-800/10 text-forest-900 text-[10px] font-bold">
                      Registered Member
                    </span>
                  )}
                </div>

                {/* Delivery Information */}
                <div className="p-4 rounded-2xl bg-white border border-brand-border space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                    Delivery Destination
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-charcoal-900 text-sm">{selectedOrder.city}</span>
                    {selectedOrder.postalCode && (
                      <span className="text-charcoal-500 font-mono text-[11px]">
                        (Postal: {selectedOrder.postalCode})
                      </span>
                    )}
                  </div>
                  <p className="text-charcoal-600 text-xs">{selectedOrder.shippingAddress}</p>
                  {selectedOrder.deliveryNotes && (
                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                      <strong>Customer Instruction:</strong> {selectedOrder.deliveryNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* Line Items Table */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                  Purchased Products ({selectedOrder.items?.length || 0})
                </span>
                <div className="border border-brand-border rounded-2xl overflow-hidden divide-y divide-sand bg-white">
                  {(selectedOrder.items || []).map((item: any) => {
                    const img =
                      item.product?.images?.[0]?.url ||
                      "/images/client-mockup/cat-handicrafts.png";
                    return (
                      <div
                        key={item.id}
                        className="p-3 flex items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-12 h-12 rounded-xl bg-white border border-sand overflow-hidden shrink-0 p-1">
                            <Image src={img} alt="" fill className="object-contain" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-charcoal-900 truncate">
                              {item.productName}
                            </p>
                            <p className="text-charcoal-500 text-[11px] font-mono">
                              Qty: {item.quantity} × {formatPrice(Number(item.unitPrice))}
                            </p>
                          </div>
                        </div>
                        <span className="font-black text-[#0D3B37] text-sm whitespace-nowrap">
                          {formatPrice(Number(item.totalPrice))}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-sand space-y-2 font-semibold">
                <div className="flex justify-between text-charcoal-600">
                  <span>Subtotal Amount</span>
                  <span>{formatPrice(Number(selectedOrder.subtotal))}</span>
                </div>
                <div className="flex justify-between text-charcoal-600">
                  <span>Delivery Charge</span>
                  <span>
                    {Number(selectedOrder.deliveryCharge) === 0
                      ? "Free"
                      : formatPrice(Number(selectedOrder.deliveryCharge))}
                  </span>
                </div>
                {Number(selectedOrder.discountAmount) > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount {selectedOrder.couponCode ? `(${selectedOrder.couponCode})` : ""}</span>
                    <span>-{formatPrice(Number(selectedOrder.discountAmount))}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-sand flex justify-between font-black text-sm text-charcoal-900">
                  <span>Grand Total</span>
                  <span className="text-[#0D3B37] text-base">
                    {formatPrice(Number(selectedOrder.totalAmount))}
                  </span>
                </div>
              </div>

              {/* Payment Verification Card */}
              <div className="p-4 rounded-2xl bg-white border border-brand-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                    Payment Status & Verification
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getPaymentStatusBadge(
                      selectedOrder.paymentStatus
                    )}`}
                  >
                    {selectedOrder.paymentStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-charcoal-400 block text-[10px]">Payment Method</span>
                    {(() => {
                      const pBadge = getOrderPaymentBadge(selectedOrder);
                      return (
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border inline-block mt-0.5 ${pBadge.badgeClass}`}>
                          {pBadge.label}
                        </span>
                      );
                    })()}
                  </div>
                  <div>
                    <span className="text-charcoal-400 block text-[10px]">Transaction ID</span>
                    <strong className="text-charcoal-800 font-mono">
                      {selectedOrder.transactionId || "N/A (Cash on Delivery)"}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-sand">
                  <Button
                    size="sm"
                    variant={selectedOrder.paymentStatus === "PAID" ? "outline" : "primary"}
                    onClick={() =>
                      handleUpdatePaymentStatus(
                        selectedOrder.id,
                        selectedOrder.paymentStatus === "PAID" ? "PENDING" : "PAID"
                      )
                    }
                    className="text-xs font-bold"
                  >
                    {selectedOrder.paymentStatus === "PAID"
                      ? "Mark as Unpaid (Pending)"
                      : "Confirm & Mark as Paid"}
                  </Button>
                </div>
              </div>

              {/* Tracking Events Timeline & Logger */}
              <div className="p-4 rounded-2xl bg-white border border-brand-border space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block">
                  Delivery Tracking & Event History
                </span>

                {/* Timeline display */}
                <div className="space-y-3 relative pl-4 border-l-2 border-sand">
                  {(selectedOrder.trackingEvents || []).map((ev: any, idx: number) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#0D3B37] ring-4 ring-white" />
                      <div className="text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-charcoal-900">{ev.status}</span>
                          <span className="text-[10px] text-charcoal-400">
                            {new Date(ev.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-charcoal-600 mt-0.5">{ev.description}</p>
                        {ev.location && (
                          <span className="text-[10px] text-forest-800 font-bold inline-flex items-center gap-0.5 mt-0.5">
                            <MapPin className="w-2.5 h-2.5" /> {ev.location}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new event log form */}
                <div className="pt-3 border-t border-sand space-y-2.5">
                  <span className="text-xs font-bold text-charcoal-800 block">
                    Record New Dispatch / Courier Milestone:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      value={trackingStatus}
                      onChange={(e) => setTrackingStatus(e.target.value as OrderStatus)}
                      className="h-9 px-3 rounded-xl border border-brand-border bg-white text-xs font-bold text-charcoal-800"
                    >
                      <option value="PROCESSING">Packaging / In Warehouse</option>
                      <option value="SHIPPED">Handed over to Courier</option>
                      <option value="DELIVERED">Delivered to Customer</option>
                      <option value="CANCELLED">Returned / Cancelled</option>
                    </select>

                    <Input
                      placeholder="Hub or City (e.g. Dhaka Hub)"
                      value={trackingLocation}
                      onChange={(e) => setTrackingLocation(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Milestone note (e.g. Dispatched via Steadfast Tracking #ST-8901)"
                      value={trackingNote}
                      onChange={(e) => setTrackingNote(e.target.value)}
                      className="h-9 text-xs"
                    />
                    <Button
                      size="sm"
                      onClick={handleAddTrackingEvent}
                      disabled={isAddingTracking || !trackingNote.trim()}
                      className="bg-[#0D3B37] hover:bg-forest-900 text-white shrink-0 font-bold text-xs"
                    >
                      {isAddingTracking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Log Event"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Close Drawer Footer */}
              <div className="pt-2 flex justify-end gap-2 border-t border-sand">
                <Button variant="outline" size="md" onClick={() => setSelectedOrder(null)}>
                  Close Studio
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* PRINTABLE INVOICE MODAL (Supports Single and Multi-Order Printing) */}
        {(printInvoiceOrder || printMultipleOrders) && (
          <Modal
            isOpen={Boolean(printInvoiceOrder || printMultipleOrders)}
            onClose={() => {
              setPrintInvoiceOrder(null);
              setPrintMultipleOrders(null);
            }}
            title="Print Invoices & Packing Slips"
            description="High-resolution, customer-ready printable documents."
            maxWidth="2xl"
          >
            <div className="space-y-6">
              {/* Action trigger */}
              <div className="flex items-center justify-between pb-3 border-b border-sand">
                <span className="text-xs text-charcoal-500">
                  Ready to print{" "}
                  <strong>{printMultipleOrders ? printMultipleOrders.length : 1}</strong> invoice(s).
                </span>
                <Button
                  size="sm"
                  onClick={() => window.print()}
                  className="bg-[#0D3B37] hover:bg-forest-900 text-white font-bold"
                >
                  <Printer className="w-4 h-4 mr-1.5" />
                  Print Now
                </Button>
              </div>

              {/* Printable Pages Container */}
              <div className="max-h-[70vh] overflow-y-auto space-y-8 pr-1 print:overflow-visible print:max-h-none">
                {(printMultipleOrders || (printInvoiceOrder ? [printInvoiceOrder] : [])).map(
                  (ord, idx) => (
                    <div
                      key={ord.id}
                      className="p-6 rounded-2xl bg-white border border-gray-300 text-charcoal-900 space-y-6 shadow-xs page-break-after"
                    >
                      {/* Invoice Brand Header */}
                      <div className="flex items-start justify-between border-b border-gray-200 pb-4">
                        <div>
                          <h2 className="text-2xl font-black font-bengali text-[#0D3B37]">
                            শিল্পকাব্য / Shoilpikkabbo
                          </h2>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Premium Artisanal Handicrafts & Traditional Lifestyle
                          </p>
                          <p className="text-xs text-gray-500">
                            Dhaka, Bangladesh • support@shoilpikkabbo.com
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-black font-mono block text-[#0D3B37]">
                            INVOICE
                          </span>
                          <span className="text-xs font-mono font-bold block">{ord.orderNumber}</span>
                          <span className="text-[11px] text-gray-500 block">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Customer & Shipping Summary */}
                      <div className="grid grid-cols-2 gap-6 text-xs">
                        <div>
                          <span className="text-gray-400 uppercase tracking-wider text-[10px] block font-bold">
                            Billed & Shipped To:
                          </span>
                          <h4 className="font-extrabold text-sm text-gray-900 mt-1">
                            {ord.customerName}
                          </h4>
                          <p className="text-gray-700">{ord.shippingAddress}</p>
                          <p className="text-gray-700">
                            {ord.city} {ord.postalCode ? `- ${ord.postalCode}` : ""}
                          </p>
                          <p className="text-gray-800 font-bold mt-1">Phone: {ord.customerPhone}</p>
                        </div>

                        <div className="text-right">
                          <span className="text-gray-400 uppercase tracking-wider text-[10px] block font-bold">
                            Payment Details:
                          </span>
                          <p className="font-bold text-gray-800 mt-1">
                            Method: {getOrderPaymentBadge(ord).label}
                          </p>
                          <p className="text-gray-700">
                            Payment Status:{" "}
                            <strong
                              className={
                                ord.paymentStatus === "PAID"
                                  ? "text-emerald-700"
                                  : "text-amber-700"
                              }
                            >
                              {ord.paymentStatus}
                            </strong>
                          </p>
                          {ord.transactionId && (
                            <p className="text-gray-600 font-mono text-[11px]">
                              Trx ID: {ord.transactionId}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Itemized Table */}
                      <table className="w-full text-left text-xs border border-gray-200">
                        <thead className="bg-gray-100 text-[10px] font-bold uppercase text-gray-600">
                          <tr>
                            <th className="py-2 px-3">Item Description</th>
                            <th className="py-2 px-3 text-center">Qty</th>
                            <th className="py-2 px-3 text-right">Unit Price</th>
                            <th className="py-2 px-3 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {(ord.items || []).map((it: any) => (
                            <tr key={it.id}>
                              <td className="py-2.5 px-3 font-semibold">{it.productName}</td>
                              <td className="py-2.5 px-3 text-center">{it.quantity}</td>
                              <td className="py-2.5 px-3 text-right">
                                {formatPrice(Number(it.unitPrice))}
                              </td>
                              <td className="py-2.5 px-3 text-right font-bold">
                                {formatPrice(Number(it.totalPrice))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Bottom Total Block */}
                      <div className="flex justify-end">
                        <div className="w-64 space-y-1.5 text-xs">
                          <div className="flex justify-between text-gray-600">
                            <span>Subtotal:</span>
                            <span>{formatPrice(Number(ord.subtotal))}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Delivery Fee:</span>
                            <span>{formatPrice(Number(ord.deliveryCharge))}</span>
                          </div>
                          {Number(ord.discountAmount) > 0 && (
                            <div className="flex justify-between text-emerald-700 font-bold">
                              <span>Discount:</span>
                              <span>-{formatPrice(Number(ord.discountAmount))}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-black text-sm text-[#0D3B37] pt-2 border-t border-gray-300">
                            <span>Amount to Collect:</span>
                            <span>
                              {ord.paymentStatus === "PAID"
                                ? "৳ 0 (Paid)"
                                : formatPrice(Number(ord.totalAmount))}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Note */}
                      <div className="pt-4 border-t border-gray-200 text-center text-[10px] text-gray-500">
                        <p>Thank you for shopping authentic Bangladeshi crafts from Shoilpikkabbo!</p>
                        <p className="mt-0.5">
                          Questions? WhatsApp: 01700-000000 • Facebook: fb.com/shoilpikkabbo
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </Modal>
        )}

        {/* SINGLE ORDER DELETE CONFIRMATION MODAL */}
        <Modal
          isOpen={Boolean(deleteTargetOrder)}
          onClose={() => !deleteLoading && setDeleteTargetOrder(null)}
          title="Delete Order"
          description="Are you sure you want to permanently remove this order?"
          maxWidth="sm"
        >
          {deleteTargetOrder && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-sand">
                <p className="font-extrabold text-charcoal-900 text-sm">
                  {deleteTargetOrder.orderNumber}
                </p>
                <p className="text-charcoal-600">
                  Customer: {deleteTargetOrder.customerName} ({deleteTargetOrder.customerPhone})
                </p>
                <p className="text-forest-900 font-bold mt-1">
                  Amount: {formatPrice(Number(deleteTargetOrder.totalAmount))}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>This action is permanent and will remove order records.</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={deleteLoading}
                  onClick={() => setDeleteTargetOrder(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  disabled={deleteLoading}
                  onClick={handleConfirmSingleDelete}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  {deleteLoading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
                  Delete Order
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* BATCH DELETE CONFIRMATION MODAL */}
        <Modal
          isOpen={showBatchDeleteModal}
          onClose={() => !deleteLoading && setShowBatchDeleteModal(false)}
          title="Delete Multiple Orders"
          description={`Are you sure you want to delete ${selectedIds.length} selected order(s)?`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {selectedOrdersList.map((ord) => (
                <div
                  key={ord.id}
                  className="p-2.5 rounded-xl bg-[#FAF8F5] border border-sand flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-charcoal-900 block font-mono">
                      {ord.orderNumber}
                    </span>
                    <span className="text-[11px] text-charcoal-500">
                      {ord.customerName} • {ord.customerPhone}
                    </span>
                  </div>
                  <span className="font-extrabold text-[#0D3B37]">
                    {formatPrice(Number(ord.totalAmount))}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                All {selectedIds.length} selected orders and their item line records will be permanently removed.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={deleteLoading}
                onClick={() => setShowBatchDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                disabled={deleteLoading}
                onClick={handleConfirmBatchDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                {deleteLoading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
                Delete {selectedIds.length} Orders
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayoutShell>
  );
}
