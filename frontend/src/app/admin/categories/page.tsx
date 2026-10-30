"use client";

import * as React from "react";
import Image from "next/image";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  MoveUp,
  MoveDown,
  Loader2,
  RefreshCw,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Check,
  AlertTriangle,
  X,
  ShieldAlert,
  ArrowRight,
  Info,
  Search,
  CheckSquare,
  Square,
  MinusSquare,
  Tag,
  FolderTree,
} from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { categoriesApi } from "@/lib/api";
import { ImageUploader } from "@/components/admin/ImageUploader";

export const OFFICIAL_CATEGORY_PRESETS = [
  { slug: "handicraft", name: "Handicraft", image: "/images/client-mockup/cat-handicrafts.png" },
  { slug: "jute-items", name: "Jute Items", image: "/images/client-mockup/cat-jute.png" },
  { slug: "polymer", name: "Polymer", image: "/images/client-mockup/cat-polymer.png" },
  { slug: "baby-items", name: "Baby Items", image: "/images/client-mockup/cat-baby.png" },
  { slug: "corporate-gift-items", name: "Corporate Gift Items", image: "/images/client-mockup/cat-corporate.png" },
  { slug: "rudiment-garments", name: "Rudiment Garments", image: "/images/client-mockup/cat-garments.png" },
  { slug: "industrial-solutions", name: "Industrial Solutions", image: "/images/client-mockup/cat-industrial.png" },
  { slug: "health-and-beauty", name: "Health and Beauty", image: "/images/client-mockup/cat-beauty.png" },
  { slug: "agriculture", name: "Agriculture", image: "/images/client-mockup/cat-agriculture.png" },
  { slug: "e-sheba", name: "Special E-Sheba", image: "/images/client-mockup/cat-services.png" },
];

export const CATEGORY_ICON_MAP: Record<string, string> = {
  handicraft: "/images/client-mockup/cat-handicrafts.png",
  "jute-items": "/images/client-mockup/cat-jute.png",
  polymer: "/images/client-mockup/cat-polymer.png",
  "baby-items": "/images/client-mockup/cat-baby.png",
  "corporate-gift-items": "/images/client-mockup/cat-corporate.png",
  "rudiment-garments": "/images/client-mockup/cat-garments.png",
  "industrial-solutions": "/images/client-mockup/cat-industrial.png",
  "health-and-beauty": "/images/client-mockup/cat-beauty.png",
  agriculture: "/images/client-mockup/cat-agriculture.png",
  "e-sheba": "/images/client-mockup/cat-services.png",
};

interface AlertToastState {
  type: "success" | "error" | "warning";
  title: string;
  message: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCat, setEditingCat] = React.useState<any | null>(null);
  const [search, setSearch] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  // Modern Toast Alert State
  const [alertToast, setAlertToast] = React.useState<AlertToastState | null>(null);

  // Multi-Selection State
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Single Delete Modal State
  const [deleteTargetCat, setDeleteTargetCat] = React.useState<any | null>(null);
  const [deleteMode, setDeleteMode] = React.useState<"reassign" | "force">("reassign");
  const [targetReassignCatId, setTargetReassignCatId] = React.useState<string>("");
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  // Batch Delete Modal State
  const [showBatchDeleteModal, setShowBatchDeleteModal] = React.useState(false);
  const [batchDeleteMode, setBatchDeleteMode] = React.useState<"reassign" | "force">("force");
  const [batchTargetReassignCatId, setBatchTargetReassignCatId] = React.useState<string>("");

  const [formData, setFormData] = React.useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
  });

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
      const res = await categoriesApi.getAll();
      if (res.success) {
        setCategories((res.data as any[]) || []);
      }
    } catch (err: any) {
      console.error("Failed to load categories:", err);
      setError(err?.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  // Filtered categories by search
  const filteredCategories = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.slug?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
  }, [categories, search]);

  // Multiple selection helpers
  const allFilteredSelected =
    filteredCategories.length > 0 &&
    filteredCategories.every((c) => selectedIds.includes(c.id));

  const someFilteredSelected =
    filteredCategories.some((c) => selectedIds.includes(c.id)) && !allFilteredSelected;

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      const visibleIds = new Set(filteredCategories.map((c) => c.id));
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.has(id)));
    } else {
      const combined = new Set([...selectedIds, ...filteredCategories.map((c) => c.id)]);
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

  // Selected categories preview list for batch modal
  const selectedCategoriesList = React.useMemo(() => {
    return categories.filter((c) => selectedIds.includes(c.id));
  }, [categories, selectedIds]);

  // Total products affected across selected categories
  const batchTotalProducts = React.useMemo(() => {
    return selectedCategoriesList.reduce((sum, c) => {
      const count = c._count?.products ?? c.itemCount ?? 0;
      return sum + count;
    }, 0);
  }, [selectedCategoriesList]);

  // Categories eligible for reassigning (not in selected list)
  const eligibleBatchReassignCats = React.useMemo(() => {
    return categories.filter((c) => !selectedIds.includes(c.id));
  }, [categories, selectedIds]);

  // Batch Delete Execution
  const handleConfirmBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      setDeleteLoading(true);
      const options: { force?: boolean; reassignTo?: string } = {};
      if (batchTotalProducts > 0) {
        if (batchDeleteMode === "reassign" && batchTargetReassignCatId) {
          options.reassignTo = batchTargetReassignCatId;
        } else {
          options.force = true;
        }
      }

      const res = await categoriesApi.batchDelete(selectedIds, options);
      if (res.success) {
        showAlert(
          "success",
          "Categories Deleted",
          `${selectedIds.length} category(s) deleted successfully.${
            batchTotalProducts > 0 ? ` ${batchTotalProducts} product(s) safely retained.` : ""
          }`
        );
        setSelectedIds([]);
        setShowBatchDeleteModal(false);
        await fetchData();
      } else {
        showAlert("error", "Batch Delete Failed", res.message || "Failed to delete categories.");
      }
    } catch (err: any) {
      showAlert("error", "Server Error", err?.message || "Failed to delete categories.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCat(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      imageUrl: "/images/client-mockup/cat-handicrafts.png",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: any) => {
    setEditingCat(cat);
    const resolvedImg =
      cat.imageUrl ||
      CATEGORY_ICON_MAP[cat.slug] ||
      "/images/client-mockup/cat-handicrafts.png";
    setFormData({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      imageUrl: resolvedImg,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const payload = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: formData.description,
        imageUrl: formData.imageUrl,
      };

      if (editingCat) {
        const res = await categoriesApi.update(editingCat.id, payload);
        if (res.success) {
          showAlert("success", "Category Updated", `Category "${formData.name}" has been updated.`);
          await fetchData();
          setIsModalOpen(false);
        } else {
          showAlert("error", "Update Failed", res.message || "Failed to update category.");
        }
      } else {
        const res = await categoriesApi.create(payload);
        if (res.success) {
          showAlert("success", "Category Created", `Category "${formData.name}" created successfully.`);
          await fetchData();
          setIsModalOpen(false);
        } else {
          showAlert("error", "Creation Failed", res.message || "Failed to create category.");
        }
      }
    } catch (err: any) {
      showAlert("error", "Action Failed", err?.message || "Validation failed");
    } finally {
      setActionLoading(false);
    }
  };

  // Open Single Delete Modal
  const handleOpenDelete = (cat: any) => {
    setDeleteTargetCat(cat);
    setDeleteMode("reassign");
    const otherCat = categories.find((c) => c.id !== cat.id);
    setTargetReassignCatId(otherCat?.id || "");
  };

  // Perform Single Delete Execution
  const handleConfirmSingleDelete = async () => {
    if (!deleteTargetCat) return;

    try {
      setDeleteLoading(true);
      const count = deleteTargetCat._count?.products ?? deleteTargetCat.itemCount ?? 0;
      let options: { force?: boolean; reassignTo?: string } | undefined;

      if (count > 0) {
        if (deleteMode === "reassign" && targetReassignCatId) {
          options = { reassignTo: targetReassignCatId };
        } else {
          options = { force: true };
        }
      }

      const res = await categoriesApi.delete(deleteTargetCat.id, options);
      if (res.success) {
        showAlert(
          "success",
          "Category Deleted",
          res.message || `Category "${deleteTargetCat.name}" deleted successfully.`
        );
        setSelectedIds((prev) => prev.filter((id) => id !== deleteTargetCat.id));
        setDeleteTargetCat(null);
        await fetchData();
      } else {
        showAlert("error", "Delete Failed", res.message || "Failed to delete category.");
      }
    } catch (err: any) {
      showAlert("error", "Server Error", err?.message || "Server error while deleting category.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newCats = [...categories];
    const [moved] = newCats.splice(index, 1);
    newCats.splice(targetIndex, 0, moved);
    setCategories(newCats);

    try {
      await Promise.all([
        categoriesApi.update(newCats[index].id, { displayOrder: index + 1 }),
        categoriesApi.update(newCats[targetIndex].id, { displayOrder: targetIndex + 1 }),
      ]);
    } catch (err) {
      console.error("Failed to reorder categories:", err);
      fetchData();
    }
  };

  const deleteProductCount = deleteTargetCat
    ? deleteTargetCat._count?.products ?? deleteTargetCat.itemCount ?? 0
    : 0;

  const eligibleReassignCategories = categories.filter((c) => c.id !== deleteTargetCat?.id);

  return (
    <AdminLayoutShell>
      {/* Modern Floating Toast Notification */}
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
              className="p-1 rounded-lg hover:bg-black/5 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FULL-WIDTH Main Container */}
      <div className="space-y-6 w-full max-w-[1720px] mx-auto pb-24 px-2 sm:px-4 lg:px-6">
        {/* Header with Title and Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-border pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0D3B37] text-xs font-bold mb-1.5 border border-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-[#E0592A]" />
              <span>Catalog Taxonomy Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D3B37] tracking-tight">
              Product Categories & Icon Assets
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Curate categories, reorder storefront display hierarchy, multiple selection, and bulk deletion.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              size="md"
              variant="outline"
              onClick={fetchData}
              disabled={loading}
              className="border-brand-border text-charcoal-700 hover:bg-sand/60"
            >
              <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              size="md"
              variant="primary"
              onClick={handleOpenAdd}
              className="bg-[#0D3B37] hover:bg-[#072421] text-white shadow-sm font-bold px-4"
            >
              <Plus className="h-4 w-4 mr-1.5 text-[#E0592A]" />
              Add Category
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            <Button size="sm" variant="outline" onClick={fetchData}>
              Retry
            </Button>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-3xl bg-white border border-brand-border shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <Input
              placeholder="Search category name or slug..."
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

          <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
            <span className="font-bold text-[#0D3B37] bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
              Total: {categories.length} Categories
            </span>
            <span>
              Showing {filteredCategories.length} of {categories.length}
            </span>
          </div>
        </div>

        {/* FLOATING / STICKY BATCH ACTION BAR (Rendered whenever 1+ categories are selected) */}
        {selectedIds.length > 0 && (
          <div className="sticky top-20 z-40 p-4 rounded-3xl bg-[#0D3B37] text-white shadow-2xl border border-emerald-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-top-3 fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-sm text-[#E0592A]">
                {selectedIds.length}
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">
                  {selectedIds.length} category(s) selected
                </p>
                <p className="text-[11px] text-emerald-200/80">
                  {batchTotalProducts > 0
                    ? `Contains ${batchTotalProducts} product(s) across selected categories`
                    : "No products attached to selected categories"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Batch Delete Button */}
              <button
                type="button"
                onClick={() => setShowBatchDeleteModal(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                title="Delete selected categories"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected ({selectedIds.length})</span>
              </button>

              {/* Clear Selection */}
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

        {/* FULL-WIDTH Categories Table */}
        <div className="rounded-3xl border border-brand-border bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-charcoal-700 border-b border-brand-border">
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
                  <th className="py-3.5 px-4 w-20 text-center">Order</th>
                  <th className="py-3.5 px-4 min-w-[280px]">Category & Visual Asset</th>
                  <th className="py-3.5 px-4">Slug Identifier</th>
                  <th className="py-3.5 px-4">Active Items</th>
                  <th className="py-3.5 px-4">Asset Type</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <Loader2 className="h-7 w-7 text-[#0D3B37] animate-spin mx-auto mb-2" />
                      <p className="text-charcoal-500 text-xs font-bold">Loading verified categories from database...</p>
                    </td>
                  </tr>
                ) : filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-charcoal-500">
                      <FolderTree className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="font-bold text-sm text-gray-600">No categories found</p>
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat, idx) => {
                    const isSelected = selectedIds.includes(cat.id);
                    const fallbackImg =
                      cat.imageUrl ||
                      CATEGORY_ICON_MAP[cat.slug] ||
                      "/images/client-mockup/cat-handicrafts.png";
                    const count = cat._count?.products ?? cat.itemCount ?? 0;
                    const isOfficialPreset = Boolean(
                      CATEGORY_ICON_MAP[cat.slug] && cat.imageUrl?.includes("cat-")
                    );

                    return (
                      <tr
                        key={cat.id}
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
                            onClick={() => handleToggleSelectItem(cat.id)}
                            className="p-1 rounded-md cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#0D3B37]" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                            )}
                          </button>
                        </td>

                        {/* Order Reordering */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleMove(idx, "up")}
                              disabled={idx === 0}
                              className="p-1 text-charcoal-400 hover:text-[#0D3B37] disabled:opacity-20 cursor-pointer"
                              title="Move up"
                            >
                              <MoveUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleMove(idx, "down")}
                              disabled={idx === categories.length - 1}
                              className="p-1 text-charcoal-400 hover:text-[#0D3B37] disabled:opacity-20 cursor-pointer"
                              title="Move down"
                            >
                              <MoveDown className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>

                        {/* Category & Visual Asset */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3.5">
                            <div className="relative h-12 w-12 rounded-2xl overflow-hidden bg-white shrink-0 border border-gray-100 flex items-center justify-center shadow-2xs">
                              <Image
                                src={fallbackImg}
                                alt={cat.name}
                                fill
                                className="object-contain p-1.5"
                                sizes="48px"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-sm text-gray-900">{cat.name}</p>
                                {isOfficialPreset && (
                                  <Badge variant="success" className="text-[9px] py-0 px-1.5">
                                    Official
                                  </Badge>
                                )}
                              </div>
                              {cat.description && (
                                <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                                  {cat.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Slug Identifier */}
                        <td className="py-3.5 px-4 font-mono text-gray-600">
                          /{cat.slug}
                        </td>

                        {/* Active Items */}
                        <td className="py-3.5 px-4 font-bold text-[#0D3B37]">
                          <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-xl border border-emerald-100">
                            {count} Products
                          </span>
                        </td>

                        {/* Asset Type */}
                        <td className="py-3.5 px-4">
                          {cat.slug?.includes("sheba") || cat.slug?.includes("service") ? (
                            <Badge variant="gold">Service Hub</Badge>
                          ) : (
                            <Badge variant="primary">Physical Product</Badge>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            className="p-1.5 rounded-xl text-charcoal-600 hover:text-[#0D3B37] hover:bg-sand transition-colors cursor-pointer inline-flex items-center"
                            title="Edit Category"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(cat)}
                            className="p-1.5 rounded-xl text-charcoal-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer inline-flex items-center"
                            title="Delete Category"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Add / Edit Category */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingCat ? "Edit Category Details" : "Create New Product Category"}
          description="Curate category identity, URL slug permalink, and visual asset icon."
          maxWidth="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Category Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Handicraft"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: editingCat
                        ? formData.slug
                        : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  URL Slug *
                </label>
                <Input
                  required
                  placeholder="e.g. handicraft"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Quick Preset Selector for Meaningful Category Icons */}
            <div className="space-y-2 pt-2 border-t border-sand">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#0D3B37] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E0592A]" />
                  <span>Official Storefront Category Icon Presets</span>
                </label>
                <span className="text-[10px] text-gray-500">Click to select curated asset</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 bg-[#FAF8F5] rounded-xl border border-gray-100 max-h-40 overflow-y-auto">
                {OFFICIAL_CATEGORY_PRESETS.map((preset) => {
                  const isSelected = formData.imageUrl === preset.image;
                  return (
                    <button
                      key={preset.slug}
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: preset.image })}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#0D3B37] text-white border-[#0D3B37] shadow-xs"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#0D3B37]/40"
                      }`}
                    >
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={preset.image}
                          alt={preset.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-[10px] font-semibold truncate w-full">
                        {preset.name}
                      </span>
                      {isSelected && <Check className="w-3 h-3 text-[#E0592A]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cloudinary Image Uploader for Custom Images */}
            <div className="space-y-2 pt-2 border-t border-sand">
              <ImageUploader
                label="Custom Category Image / Icon (Cloudinary Upload)"
                helperText="Upload any high-res custom icon or photo to Cloudinary"
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                folder="categories"
                aspectRatio="square"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Description
              </label>
              <Input
                placeholder="Brief summary for shop navigation..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-sand">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={actionLoading}
                className="bg-[#0D3B37] text-white font-bold"
              >
                {actionLoading && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
                {editingCat ? "Save Category Changes" : "Create Category"}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal: Single Delete Confirmation */}
        <Modal
          isOpen={Boolean(deleteTargetCat)}
          onClose={() => !deleteLoading && setDeleteTargetCat(null)}
          title="Delete Category"
          description="Confirm permanent category removal and manage affected products."
          maxWidth="md"
        >
          {deleteTargetCat && (
            <div className="space-y-4">
              {/* Category Info Header */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-gray-100 flex items-center gap-3.5">
                <div className="relative w-12 h-12 rounded-xl bg-white border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-2xs">
                  <Image
                    src={
                      deleteTargetCat.imageUrl ||
                      CATEGORY_ICON_MAP[deleteTargetCat.slug] ||
                      "/images/client-mockup/cat-handicrafts.png"
                    }
                    alt={deleteTargetCat.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900">
                    {deleteTargetCat.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-mono">
                    /{deleteTargetCat.slug} • {deleteProductCount} Active Products
                  </p>
                </div>
              </div>

              {/* Warning Card if products are attached */}
              {deleteProductCount > 0 ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                      <p className="font-bold mb-1">
                        This category contains {deleteProductCount} product(s)!
                      </p>
                      <p>
                        To ensure your customers&apos; carts and order histories stay intact, please select how you wish to handle these products:
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* Option 1: Reassign to another category */}
                    <label
                      className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                        deleteMode === "reassign"
                          ? "bg-emerald-50/60 border-[#0D3B37] shadow-xs"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="deleteMode"
                        checked={deleteMode === "reassign"}
                        onChange={() => setDeleteMode("reassign")}
                        className="mt-1"
                      />
                      <div className="flex-1 text-xs">
                        <span className="font-bold text-gray-900 block">
                          Reassign Products to Another Category (Recommended)
                        </span>
                        <span className="text-gray-500 text-[11px] block mb-2">
                          Move all {deleteProductCount} items into another active category.
                        </span>

                        {deleteMode === "reassign" && (
                          <div className="mt-2">
                            <select
                              value={targetReassignCatId}
                              onChange={(e) => setTargetReassignCatId(e.target.value)}
                              className="w-full text-xs p-2 rounded-lg border border-brand-border bg-white font-medium text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#0D3B37]"
                            >
                              {eligibleReassignCategories.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name} (/{c.slug})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </label>

                    {/* Option 2: Force Move to Uncategorized */}
                    <label
                      className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                        deleteMode === "force"
                          ? "bg-amber-50/60 border-amber-600 shadow-xs"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="deleteMode"
                        checked={deleteMode === "force"}
                        onChange={() => setDeleteMode("force")}
                        className="mt-1"
                      />
                      <div className="flex-1 text-xs">
                        <span className="font-bold text-gray-900 block">
                          Move Products to &apos;Uncategorized&apos; & Delete
                        </span>
                        <span className="text-gray-500 text-[11px] block">
                          Products will be safely retained in the catalog under &apos;Uncategorized&apos;.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 flex items-center gap-2.5">
                  <Info className="w-5 h-5 text-gray-500 shrink-0" />
                  <span>
                    This category is currently empty. Deleting it will permanently remove it from the catalog.
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-sand flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  disabled={deleteLoading}
                  onClick={() => setDeleteTargetCat(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="md"
                  disabled={deleteLoading}
                  onClick={handleConfirmSingleDelete}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  {deleteLoading && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
                  {deleteProductCount > 0 ? "Safely Reassign & Delete" : "Delete Category"}
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal: Batch Delete Confirmation */}
        <Modal
          isOpen={showBatchDeleteModal}
          onClose={() => !deleteLoading && setShowBatchDeleteModal(false)}
          title="Delete Multiple Categories"
          description={`Confirm deletion of ${selectedIds.length} selected category(s).`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {selectedCategoriesList.map((c) => {
                const count = c._count?.products ?? c.itemCount ?? 0;
                return (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-2xl bg-[#FAF8F5] border border-sand flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-8 h-8 rounded-lg bg-white border border-gray-200 overflow-hidden shrink-0">
                        <Image
                          src={c.imageUrl || CATEGORY_ICON_MAP[c.slug] || "/images/client-mockup/cat-handicrafts.png"}
                          alt=""
                          fill
                          className="object-contain p-0.5"
                        />
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-gray-900 block truncate">
                          {c.name}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          /{c.slug}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-[#0D3B37] bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 text-[11px]">
                      {count} Products
                    </span>
                  </div>
                );
              })}
            </div>

            {batchTotalProducts > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <p className="font-bold mb-1">
                    {batchTotalProducts} product(s) exist across these categories!
                  </p>
                  <p className="mb-2">
                    To keep all customer orders safe, all {batchTotalProducts} products will be safely moved to a category or &apos;Uncategorized&apos;.
                  </p>

                  {eligibleBatchReassignCats.length > 0 && (
                    <div className="space-y-2 pt-1 border-t border-amber-200/60">
                      <label className="text-[11px] font-bold text-gray-700 block">
                        Move products to this remaining category:
                      </label>
                      <select
                        value={batchTargetReassignCatId}
                        onChange={(e) => setBatchTargetReassignCatId(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-brand-border bg-white font-medium text-gray-800"
                      >
                        <option value="">Move to &apos;Uncategorized&apos; (Default)</option>
                        {eligibleBatchReassignCats.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} (/{cat.slug})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2.5">
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
                {deleteLoading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
                Yes, Delete {selectedIds.length} Category(s)
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayoutShell>
  );
}
