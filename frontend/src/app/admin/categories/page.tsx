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
} from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { categoriesApi } from "@/lib/api";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCat, setEditingCat] = React.useState<any | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
  });

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

  const handleOpenAdd = () => {
    setEditingCat(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: any) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      imageUrl: cat.imageUrl || "",
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
          await fetchData();
          setIsModalOpen(false);
        }
      } else {
        const res = await categoriesApi.create(payload);
        if (res.success) {
          await fetchData();
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      alert("Error saving category: " + (err?.message || "Validation failed"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      try {
        setActionLoading(true);
        const res = await categoriesApi.delete(id);
        if (res.success) {
          setCategories((prev) => prev.filter((c) => c.id !== id));
        }
      } catch (err: any) {
        alert("Failed to delete category: " + (err?.message || "Cannot delete category with active products"));
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= categories.length) return;

    const currentItem = categories[index];
    const targetItem = categories[target];

    // Optimistic reorder
    const updated = [...categories];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    setCategories(updated);

    try {
      await Promise.all([
        categoriesApi.update(currentItem.id, { displayOrder: target }),
        categoriesApi.update(targetItem.id, { displayOrder: index }),
      ]);
    } catch (err) {
      console.error("Failed to persist order:", err);
    }
  };

  return (
    <AdminLayoutShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-charcoal-900 font-heading">
              Category Architecture
            </h1>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Live store categories, slugs, display hierarchy, and catalog counts.
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
            <Button onClick={handleOpenAdd} variant="primary" size="md">
              <Plus className="h-4 w-4 mr-1.5" />
              Add New Category
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

        <div className="rounded-2xl border border-brand-border bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand/40 text-[10px] font-bold uppercase tracking-wider text-charcoal-700 border-b border-brand-border">
                <tr>
                  <th className="py-3 px-4 w-16 text-center">Order</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Slug Identifier</th>
                  <th className="py-3 px-4">Active Items</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <Loader2 className="h-6 w-6 text-forest-800 animate-spin mx-auto mb-2" />
                      <p className="text-charcoal-500 text-xs">Loading categories...</p>
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-charcoal-500">
                      No categories found in database.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat, idx) => {
                    const fallbackImg =
                      cat.imageUrl ||
                      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80";
                    const count = cat._count?.products ?? cat.itemCount ?? 0;

                    return (
                      <tr key={cat.id} className="hover:bg-sand/20 transition-colors">
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleMove(idx, "up")}
                              disabled={idx === 0}
                              className="p-1 text-charcoal-400 hover:text-forest-800 disabled:opacity-20 cursor-pointer"
                              title="Move up"
                            >
                              <MoveUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleMove(idx, "down")}
                              disabled={idx === categories.length - 1}
                              className="p-1 text-charcoal-400 hover:text-forest-800 disabled:opacity-20 cursor-pointer"
                              title="Move down"
                            >
                              <MoveDown className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-sand shrink-0 border border-brand-border">
                              <Image
                                src={fallbackImg}
                                alt={cat.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-charcoal-900">{cat.name}</p>
                              {cat.description && (
                                <p className="text-[10px] text-charcoal-400 line-clamp-1">
                                  {cat.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-charcoal-600">
                          /{cat.slug}
                        </td>
                        <td className="py-3 px-4 font-bold text-forest-900">
                          {count} Products
                        </td>
                        <td className="py-3 px-4">
                          {cat.slug?.includes("sheba") || cat.slug?.includes("service") ? (
                            <Badge variant="gold">Service Offering</Badge>
                          ) : (
                            <Badge variant="primary">Physical Craft</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            className="p-1.5 rounded-lg text-charcoal-500 hover:text-forest-800 hover:bg-sand transition-colors cursor-pointer"
                            title="Edit category"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id, cat.name)}
                            className="p-1.5 rounded-lg text-charcoal-400 hover:text-rose-600 hover:bg-sand transition-colors cursor-pointer"
                            title="Delete category"
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

        {/* Category Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingCat ? "Edit Category" : "Add New Category"}
          description="Define category properties, slugs, and cover aesthetics."
          maxWidth="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Category Name *
              </label>
              <Input
                required
                placeholder="e.g. Terracotta & Clay Crafts"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
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
                placeholder="e.g. terracotta-crafts"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Cover Image URL
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
            <div className="pt-2 flex justify-end gap-2 border-t border-sand">
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
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingCat ? (
                  "Update Category"
                ) : (
                  "Create Category"
                )}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayoutShell>
  );
}
