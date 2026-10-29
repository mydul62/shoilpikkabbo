"use client";

import * as React from "react";
import Image from "next/image";
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
} from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { formatPrice } from "@/lib/utils";
import { productsApi, categoriesApi } from "@/lib/api";

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<any | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    name: "",
    categoryId: "",
    price: "",
    salePrice: "",
    stock: "25",
    sku: "",
    description: "",
    imageUrl: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [prodRes, catRes] = await Promise.all([
        productsApi.getAll({ limit: 100 }),
        categoriesApi.getAll(),
      ]);

      if (prodRes.success) {
        setProducts((prodRes.data as any)?.products || (prodRes.data as any) || []);
      }
      if (catRes.success) {
        const cats = (catRes.data as any[]) || [];
        setCategories(cats);
        if (cats.length > 0 && !formData.categoryId) {
          setFormData((prev) => ({ ...prev, categoryId: cats[0].id }));
        }
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

  const filtered = products.filter((p) => {
    const pCategoryName = p.category?.name || p.categoryName || "";
    const matchCat = categoryFilter === "all" || pCategoryName === categoryFilter;
    const matchQuery =
      !search.trim() ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQuery;
  });

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        setActionLoading(true);
        const res = await productsApi.delete(id);
        if (res.success) {
          setProducts((prev) => prev.filter((p) => p.id !== id));
        }
      } catch (err: any) {
        alert("Failed to delete product: " + (err?.message || "Server error"));
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      categoryId: categories[0]?.id || "",
      price: "",
      salePrice: "",
      stock: "25",
      sku: `SK-${Math.floor(100 + Math.random() * 900)}`,
      description: "",
      imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (prod: any) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || "",
      categoryId: prod.categoryId || prod.category?.id || categories[0]?.id || "",
      price: String(prod.price || ""),
      salePrice: prod.salePrice ? String(prod.salePrice) : "",
      stock: String(prod.stock ?? 25),
      sku: prod.sku || "",
      description: prod.description || "",
      imageUrl: prod.images?.[0]?.url || prod.imageUrl || "",
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const payload: any = {
        name: formData.name,
        categoryId: formData.categoryId,
        price: Number(formData.price) || 0,
        salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
        stock: Number(formData.stock) || 0,
        sku: formData.sku,
        description: formData.description,
        imageUrl: formData.imageUrl,
      };

      if (editingProduct) {
        const res = await productsApi.update(editingProduct.id, payload);
        if (res.success) {
          await fetchData();
          setIsAddModalOpen(false);
        }
      } else {
        const res = await productsApi.create(payload);
        if (res.success) {
          await fetchData();
          setIsAddModalOpen(false);
        }
      }
    } catch (err: any) {
      alert("Error saving product: " + (err?.message || "Validation failed"));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayoutShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-charcoal-900 font-heading">
              Product Catalog Management
            </h1>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Live inventory management connected directly to the store database.
            </p>
          </div>
          <div className="flex items-center gap-3">
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
            <Button
              onClick={handleOpenAdd}
              variant="primary"
              size="md"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add New Product
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            <Button size="sm" variant="outline" onClick={fetchData}>
              Retry
            </Button>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="p-4 rounded-2xl border border-brand-border bg-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Input
              placeholder="Search product name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
            <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-charcoal-400" />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 px-3 rounded-lg border border-brand-border bg-white text-xs text-charcoal-800 font-medium focus:outline-none focus:ring-2 focus:ring-forest-800/20"
            >
              <option value="all">All Categories ({products.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-2xl border border-brand-border bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand/40 text-[10px] font-bold uppercase tracking-wider text-charcoal-700 border-b border-brand-border">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <Loader2 className="h-6 w-6 text-forest-800 animate-spin mx-auto mb-2" />
                      <p className="text-charcoal-500 text-xs">Loading product records...</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-charcoal-500">
                      No products found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((prod) => {
                    const primaryImg =
                      prod.images?.[0]?.url ||
                      prod.imageUrl ||
                      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80";
                    const catName = prod.category?.name || prod.categoryName || "Artisanal";

                    return (
                      <tr key={prod.id} className="hover:bg-sand/20 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-sand shrink-0 border border-brand-border">
                              <Image
                                src={primaryImg}
                                alt={prod.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-charcoal-900 line-clamp-1">
                                {prod.name}
                              </p>
                              <p className="text-[10px] text-charcoal-400">
                                Slug: /{prod.slug}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-charcoal-700">
                          {catName}
                        </td>
                        <td className="py-3 px-4 font-mono text-charcoal-600">
                          {prod.sku || "—"}
                        </td>
                        <td className="py-3 px-4 font-black text-forest-900">
                          {formatPrice(Number(prod.salePrice ?? prod.price))}
                          {prod.salePrice && (
                            <span className="block text-[10px] text-charcoal-400 line-through">
                              {formatPrice(Number(prod.price))}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-bold ${
                              prod.stock <= 20 ? "text-amber-700" : "text-charcoal-800"
                            }`}
                          >
                            {prod.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {prod.stock > 0 ? (
                            <Badge variant="success">In Stock</Badge>
                          ) : (
                            <Badge variant="danger">Out of Stock</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="p-1.5 rounded-lg text-charcoal-500 hover:text-forest-800 hover:bg-sand transition-colors cursor-pointer"
                            title="Edit product"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            className="p-1.5 rounded-lg text-charcoal-400 hover:text-rose-600 hover:bg-sand transition-colors cursor-pointer"
                            title="Delete product"
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

        {/* Add / Edit Product Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={editingProduct ? "Edit Catalog Product" : "Add New Catalog Product"}
          description="Create or modify product listings in the SHOILPIKKABBO database."
          maxWidth="xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Product Title *
              </label>
              <Input
                required
                placeholder="e.g. Handmade Terracotta Lamp Holder"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Category *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-brand-border bg-white text-xs text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-800/20"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  SKU Identifier
                </label>
                <Input
                  placeholder="e.g. HC-LP-012"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Regular Price (৳) *
                </label>
                <Input
                  required
                  type="number"
                  placeholder="1500"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Sale Price (৳)
                </label>
                <Input
                  type="number"
                  placeholder="1250"
                  value={formData.salePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, salePrice: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Stock Quantity
                </label>
                <Input
                  type="number"
                  placeholder="25"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Primary Image URL
              </label>
              <Input
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Detailed Product Description
              </label>
              <Textarea
                rows={3}
                placeholder="Describe material origin, dimensions, care instructions..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-sand">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingProduct ? (
                  "Update Product"
                ) : (
                  "Save Product"
                )}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayoutShell>
  );
}
