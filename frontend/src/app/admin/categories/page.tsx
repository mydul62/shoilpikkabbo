"use client";

import * as React from "react";
import Image from "next/image";
import { Layers, Plus, Edit2, Trash2, CheckCircle2, MoveUp, MoveDown } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { MOCK_CATEGORIES, Category } from "@/data/mock-data";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState<Category[]>(MOCK_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newCat, setNewCat] = React.useState({ name: "", slug: "", description: "" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Category = {
      id: `cat-${Date.now()}`,
      name: newCat.name,
      slug: newCat.slug || newCat.name.toLowerCase().replace(/ /g, "-"),
      description: newCat.description,
      itemCount: 0,
      imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
    };
    setCategories([...categories, created]);
    setIsModalOpen(false);
    setNewCat({ name: "", slug: "", description: "" });
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= categories.length) return;
    const updated = [...categories];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    setCategories(updated);
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
              Configure store categories, slugs, display hierarchy, and service classifications.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} variant="primary" size="md">
            <Plus className="h-4 w-4 mr-1.5" />
            Add New Category
          </Button>
        </div>

        <div className="rounded-2xl border border-brand-border bg-white shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-sand/40 text-[10px] font-bold uppercase tracking-wider text-charcoal-700 border-b border-brand-border">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Order</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Slug Identifier</th>
                <th className="py-3 px-4">Catalog Scope</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-sand/20 transition-colors">
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => handleMove(idx, "up")}
                        disabled={idx === 0}
                        className="text-charcoal-400 hover:text-forest-800 disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <MoveUp className="h-3 w-3" />
                      </button>
                      <span className="font-mono font-bold text-charcoal-600 text-[10px]">
                        {idx + 1}
                      </span>
                      <button
                        onClick={() => handleMove(idx, "down")}
                        disabled={idx === categories.length - 1}
                        className="text-charcoal-400 hover:text-forest-800 disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <MoveDown className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-sand shrink-0 border border-brand-border">
                        <Image
                          src={cat.imageUrl}
                          alt={cat.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-charcoal-900">{cat.name}</p>
                        <p className="text-[10px] text-charcoal-500 line-clamp-1">
                          {cat.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-charcoal-600">
                    /{cat.slug}
                  </td>
                  <td className="py-3 px-4 font-semibold text-charcoal-800">
                    {cat.isService ? "Service Desk" : `${cat.itemCount} items`}
                  </td>
                  <td className="py-3 px-4">
                    {cat.isService ? (
                      <Badge variant="gold">Service Section</Badge>
                    ) : (
                      <Badge variant="primary">Retail Catalog</Badge>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => alert(`Edit ${cat.name}`)}
                      className="p-1.5 text-charcoal-500 hover:text-forest-800 rounded hover:bg-sand"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setCategories(categories.filter((c) => c.id !== cat.id))
                      }
                      className="p-1.5 text-charcoal-400 hover:text-rose-600 rounded hover:bg-sand"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Category"
          description="Add a top-level category or sub-category to SHOILPIKKABBO."
        >
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Category Name *
              </label>
              <Input
                required
                placeholder="e.g. Traditional Brassware"
                value={newCat.name}
                onChange={(e) =>
                  setNewCat({
                    ...newCat,
                    name: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/ /g, "-"),
                  })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Slug (URL Path)
              </label>
              <Input
                placeholder="traditional-brassware"
                value={newCat.slug}
                onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Short Description
              </label>
              <Input
                placeholder="Handcrafted brass plates, lamps and decor..."
                value={newCat.description}
                onChange={(e) =>
                  setNewCat({ ...newCat, description: e.target.value })
                }
              />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Create Category
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayoutShell>
  );
}
