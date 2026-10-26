"use client";

import * as React from "react";
import Image from "next/image";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, Product } from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<Product[]>(MOCK_PRODUCTS);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const [newProduct, setNewProduct] = React.useState({
    name: "",
    categoryName: "Handicraft",
    price: "",
    salePrice: "",
    stock: "25",
    sku: "",
    description: "",
  });

  const filtered = products.filter((p) => {
    const matchCat =
      categoryFilter === "all" || p.categoryName === categoryFilter;
    const matchQuery =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQuery;
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Product = {
      id: `prod-${Date.now()}`,
      name: newProduct.name,
      slug: newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      categoryId: "cat-1",
      categoryName: newProduct.categoryName,
      price: Number(newProduct.price) || 1000,
      salePrice: newProduct.salePrice ? Number(newProduct.salePrice) : undefined,
      stock: Number(newProduct.stock) || 10,
      sku: newProduct.sku || `SK-${Math.floor(100 + Math.random() * 900)}`,
      rating: 5.0,
      reviewCount: 1,
      imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
      galleryUrls: [],
      description: newProduct.description,
      specifications: { Material: "Handcrafted Authentic" },
    };
    setProducts([created, ...products]);
    setIsAddModalOpen(false);
    setNewProduct({
      name: "",
      categoryName: "Handicraft",
      price: "",
      salePrice: "",
      stock: "25",
      sku: "",
      description: "",
    });
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
              Manage inventory, pricing, SKU codes, and product categories.
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            variant="primary"
            size="md"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add New Product
          </Button>
        </div>

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
              <option value="all">All Categories</option>
              {MOCK_CATEGORIES.filter((c) => !c.isService).map((cat) => (
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
                {filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-sand/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-sand shrink-0 border border-brand-border">
                          <Image
                            src={prod.imageUrl}
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
                            Rating: {prod.rating} ({prod.reviewCount} reviews)
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-charcoal-700">
                      {prod.categoryName}
                    </td>
                    <td className="py-3 px-4 font-mono text-charcoal-600">
                      {prod.sku}
                    </td>
                    <td className="py-3 px-4 font-black text-forest-900">
                      {formatPrice(prod.salePrice ?? prod.price)}
                      {prod.salePrice && (
                        <span className="block text-[10px] text-charcoal-400 line-through">
                          {formatPrice(prod.price)}
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
                        onClick={() =>
                          alert(`Edit modal for ${prod.name} will open.`)
                        }
                        className="p-1.5 rounded-lg text-charcoal-500 hover:text-forest-800 hover:bg-sand transition-colors cursor-pointer"
                        title="Edit product"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="p-1.5 rounded-lg text-charcoal-400 hover:text-rose-600 hover:bg-sand transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Product Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Catalog Product"
          description="Create a product listing under SHOILPIKKABBO categories."
          maxWidth="xl"
        >
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Product Title *
              </label>
              <Input
                required
                placeholder="e.g. Handmade Terracotta Lamp Holder"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Category *
                </label>
                <select
                  value={newProduct.categoryName}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, categoryName: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-brand-border bg-white text-xs text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-800/20"
                >
                  {MOCK_CATEGORIES.filter((c) => !c.isService).map((cat) => (
                    <option key={cat.id} value={cat.name}>
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
                  value={newProduct.sku}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, sku: e.target.value })
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
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
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
                  value={newProduct.salePrice}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, salePrice: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Initial Stock
                </label>
                <Input
                  type="number"
                  placeholder="25"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, stock: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Detailed Product Description
              </label>
              <Textarea
                rows={3}
                placeholder="Describe material origin, dimensions, care instructions..."
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
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
              <Button type="submit" variant="primary" size="md">
                Save Product
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayoutShell>
  );
}
