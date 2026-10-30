"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Loader2,
  Package,
  Layers,
  Sparkles,
  DollarSign,
  Info,
  Check,
  AlertTriangle,
  AlertCircle,
  X,
  Plus,
  ExternalLink,
  Eye,
  RefreshCw,
  ShoppingBag,
  Star,
  CheckCircle2,
  FolderTree,
  Tag,
  Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { categoriesApi, productsApi } from "@/lib/api";

interface ProductFormProps {
  initialProduct?: any;
  isEdit?: boolean;
}

interface AlertToastState {
  type: "success" | "error" | "warning";
  title: string;
  message: string;
}

const PRESET_SPEC_KEYS = [
  "Material",
  "Origin",
  "Craft",
  "Dimensions",
  "Care",
  "Weight",
  "Technique",
  "Color",
];

export function ProductForm({ initialProduct, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [alertToast, setAlertToast] = React.useState<AlertToastState | null>(null);

  // Normalize initial images
  const initialImages: string[] = React.useMemo(() => {
    if (initialProduct?.images && Array.isArray(initialProduct.images)) {
      return initialProduct.images.map((img: any) => (typeof img === "string" ? img : img.url));
    }
    if (initialProduct?.imageUrl) {
      return [initialProduct.imageUrl];
    }
    return [];
  }, [initialProduct]);

  const [formData, setFormData] = React.useState({
    name: initialProduct?.name || "",
    slug: initialProduct?.slug || "",
    categoryId: initialProduct?.categoryId || initialProduct?.category?.id || "",
    price: initialProduct?.price ? String(initialProduct.price) : "",
    salePrice: initialProduct?.salePrice ? String(initialProduct.salePrice) : "",
    stock: initialProduct?.stock !== undefined ? String(initialProduct.stock) : "25",
    sku: initialProduct?.sku || `SK-${Math.floor(100 + Math.random() * 900)}`,
    isFeatured: Boolean(initialProduct?.isFeatured),
    isActive: initialProduct?.isActive !== false,
    description: initialProduct?.description || "",
    imageUrl: initialImages[0] || initialProduct?.imageUrl || "",
    images: initialImages,
    specifications: (initialProduct?.specifications || {
      Material: "100% Organic Local Sourced",
      Origin: "Bangladesh",
      Craft: "Artisan Handcrafted",
      Dimensions: "Standard",
      Care: "Handle with gentle care",
    }) as Record<string, string>,
  });

  const showAlert = (type: "success" | "error" | "warning", title: string, message: string) => {
    setAlertToast({ type, title, message });
    setTimeout(() => {
      setAlertToast((curr) => (curr?.message === message ? null : curr));
    }, 5000);
  };

  React.useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        const res = await categoriesApi.getAll();
        if (res.success && Array.isArray(res.data)) {
          const catList = res.data as any[];
          setCategories(catList);
          if (!formData.categoryId && catList.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: catList[0].id }));
          }
        }
      } catch (err: any) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  // Handle Specification Field Change
  const handleSpecChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value,
      },
    }));
  };

  // Add Custom Specification Key
  const [newSpecKey, setNewSpecKey] = React.useState("");
  const [newSpecValue, setNewSpecValue] = React.useState("");
  const handleAddSpec = () => {
    if (!newSpecKey.trim()) return;
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [newSpecKey.trim()]: newSpecValue.trim(),
      },
    }));
    setNewSpecKey("");
    setNewSpecValue("");
  };

  const handleAddPresetSpec = (presetKey: string) => {
    if (formData.specifications[presetKey] !== undefined) return;
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [presetKey]: "",
      },
    }));
  };

  const handleRemoveSpec = (keyToRemove: string) => {
    setFormData((prev) => {
      const updated = { ...prev.specifications };
      delete updated[keyToRemove];
      return { ...prev, specifications: updated };
    });
  };

  // Generate random SKU
  const handleGenerateSku = () => {
    const prefix = formData.name
      ? formData.name
          .slice(0, 3)
          .toUpperCase()
          .replace(/[^A-Z]/g, "SK")
      : "SK";
    const randNum = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({ ...prev, sku: `${prefix}-${randNum}` }));
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showAlert("warning", "Missing Name", "Please enter a product title.");
      return;
    }
    if (!formData.categoryId) {
      showAlert("warning", "Missing Category", "Please select a category.");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      showAlert("warning", "Invalid Price", "Please enter a valid regular price.");
      return;
    }

    try {
      setSaving(true);
      const generatedSlug =
        formData.slug ||
        formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      const primaryImage =
        formData.images[0] ||
        formData.imageUrl ||
        "/images/client-mockup/cat-handicrafts.png";

      const payload = {
        name: formData.name.trim(),
        slug: generatedSlug,
        categoryId: formData.categoryId,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
        stock: parseInt(formData.stock, 10) || 0,
        sku: formData.sku.trim() || undefined,
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
        description: formData.description || formData.name,
        imageUrl: primaryImage,
        images: formData.images.length > 0 ? formData.images : [primaryImage],
        specifications: formData.specifications,
      };

      if (isEdit && initialProduct?.id) {
        const res = await productsApi.update(initialProduct.id, payload);
        if (res.success) {
          showAlert("success", "Product Updated", `"${formData.name}" has been updated.`);
          setTimeout(() => {
            router.push("/admin/products");
          }, 1200);
        } else {
          showAlert("error", "Update Failed", res.message || "Failed to update product.");
        }
      } else {
        const res = await productsApi.create(payload);
        if (res.success) {
          showAlert("success", "Product Created", `"${formData.name}" added to catalog.`);
          setTimeout(() => {
            router.push("/admin/products");
          }, 1200);
        } else {
          showAlert("error", "Creation Failed", res.message || "Failed to create product.");
        }
      }
    } catch (err: any) {
      console.error("Failed to save product:", err);
      showAlert("error", "Server Error", err?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  // Selected Category Info
  const selectedCategory = categories.find((c) => c.id === formData.categoryId);

  // Discount Calculation
  const regularPriceNum = Number(formData.price) || 0;
  const salePriceNum = Number(formData.salePrice) || 0;
  const hasValidDiscount =
    salePriceNum > 0 && regularPriceNum > 0 && salePriceNum < regularPriceNum;
  const discountPercent = hasValidDiscount
    ? Math.round(((regularPriceNum - salePriceNum) / regularPriceNum) * 100)
    : 0;

  return (
    <div className="w-full max-w-[1720px] mx-auto pb-20 px-2 sm:px-4 lg:px-6">
      {/* Floating Modern Alert Toast */}
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

      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-brand-border pb-6 mb-8">
        <div className="flex items-center gap-3.5">
          <Link
            href="/admin/products"
            className="p-2.5 rounded-2xl bg-white border border-brand-border text-charcoal-700 hover:text-[#0D3B37] hover:bg-sand transition-all cursor-pointer shadow-2xs hover:scale-105"
            title="Back to products list"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-[#0D3B37] text-xs font-bold mb-1 border border-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-[#E0592A]" />
              <span>{isEdit ? "Catalog Management" : "New Studio Listing"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D3B37] tracking-tight">
              {isEdit ? `Edit: ${formData.name || "Product"}` : "Create New Product"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Configure product details, multi-image gallery, rich story description, and dynamic specifications.
            </p>
          </div>
        </div>

        {/* Top Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {isEdit && formData.slug && (
            <Link
              href={`/products/${formData.slug}`}
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-brand-border bg-white text-xs font-bold text-gray-700 hover:text-[#0D3B37] hover:bg-sand transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#E0592A]" />
              <span>Preview Storefront</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </Link>
          )}

          <Link href="/admin/products">
            <Button variant="ghost" size="md" className="font-semibold text-gray-600">
              Discard
            </Button>
          </Link>

          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={saving}
            onClick={handleSubmit}
            className="bg-[#0D3B37] hover:bg-[#082825] text-white font-bold shadow-sm px-5"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
            ) : (
              <Save className="h-4 w-4 mr-1.5 text-[#E0592A]" />
            )}
            <span>{isEdit ? "Update Product" : "Publish Product"}</span>
          </Button>
        </div>
      </div>

      {/* Main Studio Grid: 8 Cols (Content Workspace) + 4 Cols (Sidebar & Preview) */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Main Content & Media (lg:col-span-8) */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 space-y-7">
            {/* 1. General Details Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-brand-border shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-sand">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0D3B37] flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#0D3B37]">General Information</h3>
                    <p className="text-xs text-gray-400">Title, slug permalink, and storefront identification</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal-800 flex items-center justify-between">
                    <span>
                      Product Title <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[11px] text-gray-400 font-normal">
                      {formData.name.length} characters
                    </span>
                  </label>
                  <Input
                    required
                    placeholder="e.g. Handmade Terracotta Flower Vase"
                    value={formData.name}
                    className="text-sm font-medium py-2.5"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                        slug: isEdit
                          ? formData.slug
                          : e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")
                              .replace(/(^-|-$)/g, ""),
                      })
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal-800 flex items-center justify-between">
                    <span>Storefront URL Slug (Permalink)</span>
                    <span className="text-[11px] text-gray-400 font-normal">SEO friendly</span>
                  </label>
                  <div className="flex items-center rounded-xl border border-brand-border bg-gray-50/60 overflow-hidden focus-within:ring-2 focus-within:ring-[#0D3B37] focus-within:bg-white transition-all">
                    <span className="px-3.5 py-2.5 text-xs text-gray-500 font-mono select-none bg-gray-100/70 border-r border-brand-border shrink-0">
                      shoilpikkabbo.com/products/
                    </span>
                    <input
                      type="text"
                      placeholder="handmade-terracotta-flower-vase"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3 py-2 bg-transparent focus:outline-hidden font-mono text-gray-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Media Assets & Multi-Uploader Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-brand-border shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-sand">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0D3B37] flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#0D3B37]">
                      Product Photos & Multi-Image Gallery
                    </h3>
                    <p className="text-xs text-gray-400">
                      Upload multiple high-resolution photos to Cloudinary. Drag & drop or select all at once.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-100">
                    {formData.images.length} photo(s)
                  </span>
                </div>
              </div>

              {/* Multiple Uploader Component */}
              <ImageUploader
                multiple={true}
                maxFiles={12}
                folder="products"
                value={formData.images}
                onChange={(urls: string[]) => {
                  const cleaned = Array.isArray(urls) ? urls.filter(Boolean) : urls ? [urls] : [];
                  setFormData((prev) => ({
                    ...prev,
                    images: cleaned,
                    imageUrl: cleaned[0] || "",
                  }));
                }}
                label="Product Gallery (Upload multiple photos to Cloudinary)"
                helperText="Select or drag & drop multiple JPG, PNG, WEBP files. The first photo is automatically used as the main storefront Cover."
              />

              {formData.images.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-sand/60 border border-brand-border flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                    <span>
                      Hover any photo in the gallery and click <strong>&quot;Set Cover&quot;</strong> to choose your primary display image.
                    </span>
                  </div>
                  <span className="font-bold text-[#0D3B37]">Cover: Photo #1</span>
                </div>
              )}
            </div>

            {/* 3. Detailed Product Storytelling (WYSIWYG Rich Text Editor) */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-brand-border shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-sand">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#E0592A] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#0D3B37]">
                      Detailed Product Description & Story
                    </h3>
                    <p className="text-xs text-gray-400">
                      WYSIWYG editor supporting bold, headings, bullet lists, blockquotes & custom HTML
                    </p>
                  </div>
                </div>
              </div>

              <RichTextEditor
                value={formData.description}
                onChange={(html) => setFormData((prev) => ({ ...prev, description: html }))}
                placeholder="Write authentic product story, artisan background, dimensions, and craft details..."
                minHeight="320px"
                label="Product Storytelling & Craftsmanship"
                required
              />
            </div>

            {/* 4. Specifications & Artisan Attributes Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-brand-border shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-sand">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0D3B37] flex items-center justify-center">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#0D3B37]">
                      Specifications & Materials
                    </h3>
                    <p className="text-xs text-gray-400">
                      Rendered in the Specifications tab on the storefront product detail page
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  {Object.keys(formData.specifications).length} attributes
                </span>
              </div>

              {/* Quick Preset Tags to add */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-gray-500 mr-1 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Quick Add:
                </span>
                {PRESET_SPEC_KEYS.map((key) => {
                  const alreadyExists = formData.specifications[key] !== undefined;
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={alreadyExists}
                      onClick={() => handleAddPresetSpec(key)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        alreadyExists
                          ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white border-brand-border text-gray-700 hover:border-[#0D3B37] hover:text-[#0D3B37] hover:bg-emerald-50/40"
                      }`}
                    >
                      + {key}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {Object.entries(formData.specifications).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-brand-border flex items-center justify-between gap-3 group focus-within:border-[#0D3B37] focus-within:bg-white transition-all shadow-2xs"
                  >
                    <div className="flex-1 min-w-0">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        {key}
                      </label>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handleSpecChange(key, e.target.value)}
                        placeholder={`Enter ${key}...`}
                        className="w-full text-xs sm:text-sm font-semibold text-gray-900 bg-transparent focus:outline-hidden py-0.5"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(key)}
                      className="p-1 rounded-lg text-gray-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title={`Remove ${key}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Custom Attribute Row */}
              <div className="pt-3 border-t border-sand flex items-center gap-2.5 flex-wrap">
                <input
                  type="text"
                  placeholder="Custom Attribute (e.g. Weave Type)"
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  className="text-xs p-2.5 rounded-xl border border-brand-border bg-white flex-1 min-w-[150px] focus:outline-hidden focus:ring-2 focus:ring-[#0D3B37]"
                />
                <input
                  type="text"
                  placeholder="Attribute Value (e.g. Tight Double Knot)"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  className="text-xs p-2.5 rounded-xl border border-brand-border bg-white flex-1 min-w-[180px] focus:outline-hidden focus:ring-2 focus:ring-[#0D3B37]"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSpec}
                  className="border-brand-border text-charcoal-700 hover:bg-sand"
                >
                  <Plus className="w-3.5 h-3.5 mr-1 text-[#E0592A]" />
                  Add Specification
                </Button>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Sidebar, Publishing, Pricing, Live Preview (lg:col-span-4) */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Sticky Action Card */}
            <div className="p-5 rounded-3xl bg-white border border-brand-border shadow-xs space-y-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={saving}
                className="w-full bg-[#0D3B37] hover:bg-[#082825] text-white font-bold shadow-md py-3 text-sm h-12"
              >
                {saving ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Save className="h-5 w-5 mr-2 text-[#E0592A]" />
                )}
                <span>{isEdit ? "Update Catalog Listing" : "Save & Publish Product"}</span>
              </Button>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                <span>Status:</span>
                <span
                  className={`font-bold flex items-center gap-1 ${
                    formData.isActive ? "text-emerald-700" : "text-amber-600"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      formData.isActive ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  {formData.isActive ? "Active (Storefront Visible)" : "Draft (Hidden)"}
                </span>
              </div>
            </div>

            {/* Visibility & Publishing Status */}
            <div className="p-5 rounded-3xl bg-white border border-brand-border shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2.5 border-b border-sand">
                <Sparkles className="w-4 h-4 text-[#E0592A]" />
                <h4 className="font-extrabold text-sm text-[#0D3B37]">Visibility & Placement</h4>
              </div>

              <div className="space-y-3.5">
                <label className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/70 border border-brand-border cursor-pointer select-none hover:bg-emerald-50/30 transition-colors">
                  <div className="pr-2">
                    <span className="text-xs font-bold text-gray-800 block">Active Status</span>
                    <span className="text-[11px] text-gray-500">Show in catalog and search</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0D3B37] accent-[#0D3B37] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/70 border border-brand-border cursor-pointer select-none hover:bg-amber-50/30 transition-colors">
                  <div className="pr-2">
                    <span className="text-xs font-bold text-gray-800 block">Featured Showcase</span>
                    <span className="text-[11px] text-gray-500">Display on Homepage banner/featured</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0D3B37] accent-[#0D3B37] cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Category / Taxonomy Card */}
            <div className="p-5 rounded-3xl bg-white border border-brand-border shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2.5 border-b border-sand">
                <div className="flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-[#0D3B37]" />
                  <h4 className="font-extrabold text-sm text-[#0D3B37]">Category & Taxonomy</h4>
                </div>
                <Link
                  href="/admin/categories"
                  className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold hover:underline"
                >
                  Manage
                </Link>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal-800">
                  Select Category <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-brand-border bg-white font-semibold text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#0D3B37]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {selectedCategory && (
                  <p className="text-[11px] text-gray-500 mt-1">
                    Slug: <span className="font-mono">{selectedCategory.slug}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Pricing & Stock Card */}
            <div className="p-5 rounded-3xl bg-white border border-brand-border shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2.5 border-b border-sand">
                <DollarSign className="w-4 h-4 text-[#0D3B37]" />
                <h4 className="font-extrabold text-sm text-[#0D3B37]">Pricing & Inventory</h4>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal-800">
                    Regular Price (৳) <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="number"
                    required
                    min="0"
                    step="any"
                    placeholder="e.g. 1500"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-charcoal-800">
                      Sale / Discounted Price (৳)
                    </label>
                    {hasValidDiscount && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        -{discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="e.g. 1250 (Optional)"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-charcoal-800">
                      Stock Qty <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      type="number"
                      required
                      min="0"
                      placeholder="25"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-charcoal-800">SKU</label>
                      <button
                        type="button"
                        onClick={handleGenerateSku}
                        className="text-[10px] text-emerald-800 font-bold hover:underline cursor-pointer"
                        title="Auto generate SKU"
                      >
                        Gen
                      </button>
                    </div>
                    <Input
                      placeholder="SK-798"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Storefront Card Preview */}
            <div className="p-5 rounded-3xl bg-white border border-brand-border shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-sand">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#0D3B37]" />
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#0D3B37]">
                    Live Storefront Card
                  </h4>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  Real-time
                </span>
              </div>

              {/* Render Preview matching Home Page card design */}
              <div className="rounded-2xl border border-sand bg-[#FAF8F5] overflow-hidden p-3 space-y-3">
                <div className="relative aspect-square w-full rounded-xl bg-white overflow-hidden flex items-center justify-center border border-gray-100">
                  <Image
                    src={formData.images[0] || formData.imageUrl || "/images/client-mockup/cat-handicrafts.png"}
                    alt="Preview"
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                  {hasValidDiscount && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#E0592A] text-white text-[10px] font-bold shadow-xs">
                      -{discountPercent}%
                    </span>
                  )}
                  {formData.isFeatured && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#0D3B37] text-white text-[9px] font-bold shadow-xs flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      Featured
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#E0592A] tracking-wider block">
                    {selectedCategory?.name || "Artisanal"}
                  </span>
                  <h5 className="font-bold text-xs text-gray-900 truncate">
                    {formData.name || "Product Name Example"}
                  </h5>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="font-extrabold text-sm text-[#0D3B37]">
                      ৳{Number(formData.salePrice || formData.price || 1500).toLocaleString()}
                    </span>
                    {hasValidDiscount && (
                      <span className="text-xs text-gray-400 line-through">
                        ৳{Number(formData.price).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  disabled
                  className="w-full py-2 bg-[#0D3B37] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 opacity-90 cursor-not-allowed"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
