"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  Loader2,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Check,
  AlertTriangle,
  X,
  Eye,
  EyeOff,
  CheckSquare,
  Square,
  MinusSquare,
  Filter,
  ArrowUpDown,
  ShoppingBag,
  Star,
} from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { formatPrice } from "@/lib/utils";
import { productsApi, categoriesApi } from "@/lib/api";

interface AlertToastState {
  type: "success" | "error" | "warning";
  title: string;
  message: string;
}

type TabFilter = "all" | "active" | "draft" | "low_stock" | "featured";

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [activeTab, setActiveTab] = React.useState<TabFilter>("all");
  const [error, setError] = React.useState<string | null>(null);

  // Multiple selection state
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [batchActionLoading, setBatchActionLoading] = React.useState(false);

  // Modern Toast Alert
  const [alertToast, setAlertToast] = React.useState<AlertToastState | null>(null);

  // Single & Batch Delete Modals
  const [deleteTargetProduct, setDeleteTargetProduct] = React.useState<any | null>(null);
  const [showBatchDeleteModal, setShowBatchDeleteModal] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const showAlert = (type: "success" | "error" | "warning", title: string, message: string) => {
    setAlertToast({ type, title, message });
    setTimeout(() => {
      setAlertToast((curr) => (curr?.message === message ? null : curr));
    }, 5000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [prodRes, catRes] = await Promise.all([
        productsApi.getAll({ limit: 150 }),
        categoriesApi.getAll(),
      ]);

      if (prodRes.success) {
        const prodList = (prodRes.data as any)?.products || (prodRes.data as any) || [];
        setProducts(Array.isArray(prodList) ? prodList : []);
      }
      if (catRes.success) {
        setCategories((catRes.data as any[]) || []);
      }
    } catch (err: any) {
      console.error("Failed to load products:", err);
      setError(err?.message || "Failed to load product catalog.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  // Filtered products calculation
  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      // Category filter
      const pCatName = p.category?.name || p.categoryName || "";
      const pCatId = p.categoryId || p.category?.id || "";
      const matchCat =
        categoryFilter === "all" || pCatName === categoryFilter || pCatId === categoryFilter;

      // Tab filter
      let matchTab = true;
      if (activeTab === "active") matchTab = p.isActive !== false;
      if (activeTab === "draft") matchTab = p.isActive === false;
      if (activeTab === "low_stock") matchTab = (p.stock ?? 0) <= 5;
      if (activeTab === "featured") matchTab = Boolean(p.isFeatured);

      // Search query
      const q = search.trim().toLowerCase();
      const matchQuery =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q);

      return matchCat && matchTab && matchQuery;
    });
  }, [products, categoryFilter, activeTab, search]);

  // Statistics counts
  const stats = React.useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.isActive !== false).length;
    const draft = products.filter((p) => p.isActive === false).length;
    const lowStock = products.filter((p) => (p.stock ?? 0) <= 5).length;
    const featured = products.filter((p) => Boolean(p.isFeatured)).length;
    return { total, active, draft, lowStock, featured };
  }, [products]);

  // Multiple selection helpers
  const allFilteredSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((p) => selectedIds.includes(p.id));

  const someFilteredSelected =
    filteredProducts.some((p) => selectedIds.includes(p.id)) && !allFilteredSelected;

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      // Deselect visible
      const visibleIds = new Set(filteredProducts.map((p) => p.id));
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.has(id)));
    } else {
      // Select all visible
      const combined = new Set([...selectedIds, ...filteredProducts.map((p) => p.id)]);
      setSelectedIds(Array.from(combined));
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

  // Batch Status Change (Move to Draft or Remove from Draft / Publish)
  const handleBatchStatus = async (targetActive: boolean) => {
    if (selectedIds.length === 0) return;
    try {
      setBatchActionLoading(true);
      const res = await productsApi.batchStatus(selectedIds, targetActive);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) =>
            selectedIds.includes(p.id) ? { ...p, isActive: targetActive } : p
          )
        );
        showAlert(
          "success",
          targetActive ? "Products Published" : "Moved to Draft",
          `${selectedIds.length} product(s) marked as ${
            targetActive ? "active & visible in storefront" : "draft / hidden"
          }.`
        );
        setSelectedIds([]);
      } else {
        showAlert("error", "Update Failed", res.message || "Failed to update status.");
      }
    } catch (err: any) {
      showAlert("error", "Server Error", err?.message || "Failed to update product status.");
    } finally {
      setBatchActionLoading(false);
    }
  };

  // Single Item Status Quick Toggle
  const handleToggleSingleStatus = async (prod: any) => {
    const nextStatus = prod.isActive === false;
    try {
      const res = await productsApi.update(prod.id, { isActive: nextStatus });
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === prod.id ? { ...p, isActive: nextStatus } : p))
        );
        showAlert(
          "success",
          nextStatus ? "Product Published" : "Moved to Draft",
          `"${prod.name}" is now ${nextStatus ? "active" : "draft"}.`
        );
      } else {
        showAlert("error", "Action Failed", res.message || "Failed to update status.");
      }
    } catch (err: any) {
      showAlert("error", "Error", err?.message || "Failed to update status.");
    }
  };

  // Batch Featured Status Change
  const handleBatchFeatured = async (targetFeatured: boolean) => {
    if (selectedIds.length === 0) return;
    try {
      setBatchActionLoading(true);
      const res = await productsApi.batchFeatured(selectedIds, targetFeatured);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) =>
            selectedIds.includes(p.id) ? { ...p, isFeatured: targetFeatured } : p
          )
        );
        showAlert(
          "success",
          targetFeatured ? "Set as Featured" : "Removed from Featured",
          `${selectedIds.length} product(s) ${
            targetFeatured
              ? "featured on the homepage showcase."
              : "removed from featured showcase."
          }`
        );
        setSelectedIds([]);
      } else {
        showAlert("error", "Update Failed", res.message || "Failed to update featured status.");
      }
    } catch (err: any) {
      showAlert("error", "Server Error", err?.message || "Failed to update featured status.");
    } finally {
      setBatchActionLoading(false);
    }
  };

  // Single Item Featured Toggle
  const handleToggleSingleFeatured = async (prod: any) => {
    const nextFeatured = !prod.isFeatured;
    try {
      const res = await productsApi.update(prod.id, { isFeatured: nextFeatured });
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === prod.id ? { ...p, isFeatured: nextFeatured } : p))
        );
        showAlert(
          "success",
          nextFeatured ? "Product Featured" : "Unfeatured",
          `"${prod.name}" is ${nextFeatured ? "now featured on homepage" : "removed from featured"}.`
        );
      } else {
        showAlert("error", "Action Failed", res.message || "Failed to update featured status.");
      }
    } catch (err: any) {
      showAlert("error", "Error", err?.message || "Failed to update featured status.");
    }
  };

  // Batch Delete Execution
  const handleConfirmBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      setDeleteLoading(true);
      const res = await productsApi.batchDelete(selectedIds);
      if (res.success) {
        const affectedIds = new Set(selectedIds);
        setProducts((prev) => prev.filter((p) => !affectedIds.has(p.id)));
        showAlert(
          "success",
          "Products Deleted",
          `${selectedIds.length} product(s) deleted from catalog.`
        );
        setSelectedIds([]);
        setShowBatchDeleteModal(false);
      } else {
        showAlert("error", "Batch Delete Failed", res.message || "Failed to delete products.");
      }
    } catch (err: any) {
      showAlert("error", "Server Error", err?.message || "Failed to delete products.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Single Item Delete Execution
  const handleConfirmSingleDelete = async () => {
    if (!deleteTargetProduct) return;
    try {
      setDeleteLoading(true);
      const res = await productsApi.delete(deleteTargetProduct.id);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteTargetProduct.id));
        setSelectedIds((prev) => prev.filter((id) => id !== deleteTargetProduct.id));
        showAlert(
          "success",
          "Product Deleted",
          `"${deleteTargetProduct.name}" has been removed.`
        );
        setDeleteTargetProduct(null);
      } else {
        showAlert("error", "Delete Failed", res.message || "Failed to delete product.");
      }
    } catch (err: any) {
      showAlert("error", "Server Error", err?.message || "Failed to delete product.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Products selected for batch modal preview
  const selectedProductsList = React.useMemo(() => {
    return products.filter((p) => selectedIds.includes(p.id));
  }, [products, selectedIds]);

  return (
    <AdminLayoutShell>
      {/* Modern Floating Toast Alert */}
      {alertToast && (
        <div className="fixed top-5 right-5 z-50 max-w-md w-full animate-in slide-in-from-top-4 fade-in duration-300">
          <div
            className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 backdrop-blur-md ${
              alertToast.type === "success"
                ? "bg-emerald-50/95 border-emerald-200 text-emerald-950"
                : alertToast.type === "warning"
                ? "bg-amber-50/95 border-amber-200 text-amber-950"
                : "bg-rose-50/95 border-rose-200 text-rose-950"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {alertToast.type === "success" && (
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
              {alertToast.type === "warning" && (
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                  <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}
              {alertToast.type === "error" && (
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700">
                  <AlertCircle className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}
            </div>

            <div className="flex-1 pr-2">
              <h4 className="font-bold text-xs uppercase tracking-wider mb-0.5">
                {alertToast.title}
              </h4>
              <p className="text-xs leading-relaxed opacity-90">{alertToast.message}</p>
            </div>

            <button
              onClick={() => setAlertToast(null)}
              className="p-1 rounded-lg hover:bg-black/5 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FULL-WIDTH Main Workspace Container */}
      <div className="space-y-6 w-full max-w-[1720px] mx-auto pb-24 px-2 sm:px-4 lg:px-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0D3B37] text-xs font-bold mb-1.5 border border-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-[#E0592A]" />
              <span>Catalog & Inventory Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D3B37] tracking-tight">
              Product Catalog Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage complete catalog items, multiple selection, publishing to storefront, draft toggling, and bulk deletion.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={fetchData}
              disabled={loading}
              className="border-brand-border text-charcoal-700 hover:bg-sand"
            >
              <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <Link href="/admin/products/new">
              <Button
                variant="primary"
                size="md"
                className="bg-[#0D3B37] hover:bg-[#072421] text-white font-bold shadow-sm px-4"
              >
                <Plus className="h-4 w-4 mr-1.5 text-[#E0592A]" />
                Add New Product
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Filter Tabs Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
              activeTab === "all"
                ? "bg-[#0D3B37] text-white border-[#0D3B37] shadow-xs"
                : "bg-white text-gray-700 border-brand-border hover:bg-sand"
            }`}
          >
            <span>All Products</span>
            <span
              className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                activeTab === "all" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {stats.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
              activeTab === "active"
                ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                : "bg-white text-gray-700 border-brand-border hover:bg-emerald-50/50"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Active (Visible)</span>
            <span
              className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                activeTab === "active" ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-800"
              }`}
            >
              {stats.active}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("draft")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
              activeTab === "draft"
                ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                : "bg-white text-gray-700 border-brand-border hover:bg-amber-50/50"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Drafts (Hidden)</span>
            <span
              className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                activeTab === "draft" ? "bg-white/20 text-white" : "bg-amber-50 text-amber-800"
              }`}
            >
              {stats.draft}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("low_stock")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
              activeTab === "low_stock"
                ? "bg-rose-700 text-white border-rose-700 shadow-xs"
                : "bg-white text-gray-700 border-brand-border hover:bg-rose-50/50"
            }`}
          >
            <span>Low Stock</span>
            <span
              className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                activeTab === "low_stock" ? "bg-white/20 text-white" : "bg-rose-50 text-rose-800"
              }`}
            >
              {stats.lowStock}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("featured")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
              activeTab === "featured"
                ? "bg-[#E0592A] text-white border-[#E0592A] shadow-xs"
                : "bg-white text-gray-700 border-brand-border hover:bg-orange-50/50"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Featured</span>
            <span
              className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                activeTab === "featured" ? "bg-white/20 text-white" : "bg-orange-50 text-orange-800"
              }`}
            >
              {stats.featured}
            </span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-3xl bg-white border border-brand-border shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <Input
              placeholder="Search by product name, SKU, or slug..."
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

          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-charcoal-500 whitespace-nowrap font-bold">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 px-3.5 rounded-2xl border border-brand-border bg-white text-xs text-charcoal-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0D3B37]"
              >
                <option value="all">All Categories ({categories.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-xs text-gray-400 font-medium">
              Showing {filteredProducts.length} of {products.length} products
            </span>
          </div>
        </div>

        {/* FLOATING / STICKY BATCH ACTION BAR (Rendered whenever 1+ items selected) */}
        {selectedIds.length > 0 && (
          <div className="sticky top-20 z-40 p-4 rounded-3xl bg-[#0D3B37] text-white shadow-2xl border border-emerald-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-top-3 fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-sm text-[#E0592A]">
                {selectedIds.length}
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">
                  {selectedIds.length} product(s) selected
                </p>
                <p className="text-[11px] text-emerald-200/80">
                  Select a bulk action below to apply across all chosen products
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Send to Draft */}
              <button
                type="button"
                disabled={batchActionLoading}
                onClick={() => handleBatchStatus(false)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-gray-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                title="Hide from storefront"
              >
                {batchActionLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5" />
                )}
                <span>Send to Draft</span>
              </button>

              {/* Remove from Draft / Publish */}
              <button
                type="button"
                disabled={batchActionLoading}
                onClick={() => handleBatchStatus(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                title="Publish and make visible in storefront"
              >
                {batchActionLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                <span>Publish (Remove Draft)</span>
              </button>

              {/* Set as Featured */}
              <button
                type="button"
                disabled={batchActionLoading}
                onClick={() => handleBatchFeatured(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                title="Feature selected products on homepage showcase"
              >
                {batchActionLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-gray-900" />
                )}
                <span>Set Featured</span>
              </button>

              {/* Remove Featured */}
              <button
                type="button"
                disabled={batchActionLoading}
                onClick={() => handleBatchFeatured(false)}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                title="Remove from homepage featured showcase"
              >
                <Star className="w-3.5 h-3.5 text-gray-300" />
                <span>Unfeature</span>
              </button>

              {/* Delete Multiple */}
              <button
                type="button"
                disabled={batchActionLoading}
                onClick={() => setShowBatchDeleteModal(true)}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                title="Delete selected products"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected</span>
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

        {/* FULL-WIDTH Products Table Card */}
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
                  <th className="py-3.5 px-4 min-w-[280px]">Product Info & SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Pricing</th>
                  <th className="py-3.5 px-4">Inventory</th>
                  <th className="py-3.5 px-4">Status & Visibility</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-charcoal-400">
                      <Loader2 className="h-7 w-7 animate-spin mx-auto mb-2 text-[#0D3B37]" />
                      <p className="font-bold text-xs">Loading live catalog from database...</p>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-charcoal-400">
                      <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="font-bold text-sm text-gray-600">No matching products found</p>
                      <p className="text-xs text-gray-400 mt-1">Try resetting search filters or category</p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((prod) => {
                    const isSelected = selectedIds.includes(prod.id);
                    const primaryImg =
                      prod.images?.[0]?.url ||
                      prod.imageUrl ||
                      "/images/client-mockup/cat-handicrafts.png";

                    const categoryName =
                      prod.category?.name || prod.categoryName || "Artisanal";

                    const isDraft = prod.isActive === false;

                    return (
                      <tr
                        key={prod.id}
                        className={`transition-colors group ${
                          isSelected
                            ? "bg-emerald-50/60 hover:bg-emerald-50/80"
                            : "hover:bg-[#FAF8F5]/80"
                        }`}
                      >
                        {/* Row Selection Checkbox */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleSelectItem(prod.id)}
                            className="p-1 rounded-md cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#0D3B37]" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                            )}
                          </button>
                        </td>

                        {/* Product Info */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-14 w-14 rounded-2xl bg-white border border-sand overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-2xs">
                              <Image
                                src={primaryImg}
                                alt={prod.name}
                                fill
                                className="object-contain p-1"
                              />
                              {prod.images && prod.images.length > 1 && (
                                <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] font-bold px-1 rounded">
                                  +{prod.images.length - 1}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <Link
                                href={`/products/${prod.slug}`}
                                target="_blank"
                                className="font-bold text-gray-900 hover:text-[#E0592A] transition-colors line-clamp-1 inline-flex items-center gap-1 group/title text-xs sm:text-sm"
                              >
                                <span>{prod.name}</span>
                                <ExternalLink className="w-3 h-3 opacity-0 group-hover/title:opacity-100 transition-opacity text-gray-400" />
                              </Link>
                              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400 font-mono">
                                <span>SKU: {prod.sku || "N/A"}</span>
                                {prod.isFeatured && (
                                  <button
                                    type="button"
                                    onClick={() => handleToggleSingleFeatured(prod)}
                                    className="px-1.5 py-0.2 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[10px] flex items-center gap-0.5 cursor-pointer transition-colors"
                                    title="Click to remove from featured"
                                  >
                                    <Sparkles className="w-2.5 h-2.5 text-amber-500" /> Featured
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-gray-700 bg-gray-100/70 px-2.5 py-1 rounded-xl text-xs">
                            {categoryName}
                          </span>
                        </td>

                        {/* Pricing */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-[#0D3B37] text-sm">
                              {formatPrice(prod.salePrice || prod.price)}
                            </span>
                            {prod.salePrice && prod.salePrice < prod.price && (
                              <span className="text-[11px] text-gray-400 line-through">
                                {formatPrice(prod.price)}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Inventory */}
                        <td className="py-3.5 px-4">
                          {prod.stock <= 5 ? (
                            <span className="text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-xl text-[11px] border border-amber-200">
                              Low Stock ({prod.stock})
                            </span>
                          ) : (
                            <span className="text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-xl text-[11px] border border-emerald-100">
                              In Stock ({prod.stock})
                            </span>
                          )}
                        </td>

                        {/* Status (Clickable to quickly toggle) */}
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleSingleStatus(prod)}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all border ${
                              isDraft
                                ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                                : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                            }`}
                            title={isDraft ? "Click to Publish" : "Click to Move to Draft"}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isDraft ? "bg-amber-500" : "bg-emerald-500"
                              }`}
                            />
                            <span>{isDraft ? "Draft (Hidden)" : "Active"}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Toggle Draft/Active */}
                            <button
                              type="button"
                              onClick={() => handleToggleSingleStatus(prod)}
                              className="p-1.5 rounded-xl text-gray-500 hover:text-[#0D3B37] hover:bg-sand transition-colors cursor-pointer"
                              title={isDraft ? "Publish to storefront" : "Send to draft"}
                            >
                              {isDraft ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <EyeOff className="w-4 h-4 text-amber-600" />
                              )}
                            </button>

                            {/* Toggle Featured */}
                            <button
                              type="button"
                              onClick={() => handleToggleSingleFeatured(prod)}
                              className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                                prod.isFeatured
                                  ? "text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                                  : "text-gray-300 hover:text-amber-500 hover:bg-sand"
                              }`}
                              title={
                                prod.isFeatured
                                  ? "Featured on Homepage (Click to Unfeature)"
                                  : "Click to Feature on Homepage"
                              }
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  prod.isFeatured ? "fill-amber-400 text-amber-500" : ""
                                }`}
                              />
                            </button>

                            {/* Edit Link */}
                            <Link
                              href={`/admin/products/${prod.id}/edit`}
                              className="p-1.5 rounded-xl text-gray-600 hover:text-[#0D3B37] hover:bg-sand transition-colors cursor-pointer inline-flex items-center"
                              title="Edit product"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Link>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => setDeleteTargetProduct(prod)}
                              className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer inline-flex items-center"
                              title="Delete product"
                            >
                              <Trash2 className="h-4 w-4" />
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

        {/* Modal: Single Item Delete Confirmation */}
        <Modal
          isOpen={Boolean(deleteTargetProduct)}
          onClose={() => !deleteLoading && setDeleteTargetProduct(null)}
          title="Delete Product"
          description="Are you sure you want to permanently remove this product from the catalog?"
          maxWidth="sm"
        >
          {deleteTargetProduct && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-sand flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl bg-white border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
                  <Image
                    src={
                      deleteTargetProduct.images?.[0]?.url ||
                      deleteTargetProduct.imageUrl ||
                      "/images/client-mockup/cat-handicrafts.png"
                    }
                    alt={deleteTargetProduct.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs text-gray-900 line-clamp-1">
                    {deleteTargetProduct.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-mono">
                    SKU: {deleteTargetProduct.sku || "N/A"} • ৳ {deleteTargetProduct.price}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>This action cannot be undone.</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={deleteLoading}
                  onClick={() => setDeleteTargetProduct(null)}
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
                  Delete Product
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal: Batch Delete Confirmation */}
        <Modal
          isOpen={showBatchDeleteModal}
          onClose={() => !deleteLoading && setShowBatchDeleteModal(false)}
          title="Delete Multiple Products"
          description={`Are you sure you want to delete ${selectedIds.length} selected product(s)?`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {selectedProductsList.map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-xl bg-[#FAF8F5] border border-sand flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-8 h-8 rounded-lg bg-white border border-gray-200 overflow-hidden shrink-0">
                      <Image
                        src={p.images?.[0]?.url || p.imageUrl || "/images/client-mockup/cat-handicrafts.png"}
                        alt=""
                        fill
                        className="object-contain p-0.5"
                      />
                    </div>
                    <span className="font-bold text-gray-900 truncate max-w-[240px]">
                      {p.name}
                    </span>
                  </div>
                  <span className="font-extrabold text-[#0D3B37]">৳{p.price}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                All {selectedIds.length} selected product(s) will be permanently deleted from the database.
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
                Yes, Delete {selectedIds.length} Product(s)
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayoutShell>
  );
}
