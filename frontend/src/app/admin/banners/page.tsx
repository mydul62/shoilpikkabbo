"use client";

import * as React from "react";
import Image from "next/image";
import { Image as ImageIcon, Plus, Trash2, Eye, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { bannersApi } from "@/lib/api";

export default function AdminBannersPage() {
  const [banners, setBanners] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [newBanner, setNewBanner] = React.useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    linkUrl: "/shop",
    placement: "Homepage Hero",
  });

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await bannersApi.getAll();
      if (res.success) {
        setBanners((res.data as any[]) || []);
      }
    } catch (err: any) {
      console.error("Failed to load banners:", err);
      setError(err?.message || "Failed to load banners.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBanners();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const res = await bannersApi.create({
        title: newBanner.title,
        subtitle: newBanner.subtitle,
        imageUrl:
          newBanner.imageUrl ||
          "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
        linkUrl: newBanner.linkUrl,
        placement: newBanner.placement,
      });

      if (res.success) {
        await fetchBanners();
        setIsModalOpen(false);
        setNewBanner({
          title: "",
          subtitle: "",
          imageUrl: "",
          linkUrl: "/shop",
          placement: "Homepage Hero",
        });
      }
    } catch (err: any) {
      alert("Error creating banner: " + (err?.message || "Server error"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete banner "${title}"?`)) {
      try {
        setActionLoading(true);
        const res = await bannersApi.delete(id);
        if (res.success) {
          setBanners((prev) => prev.filter((b) => b.id !== id));
        }
      } catch (err: any) {
        alert("Failed to delete banner: " + (err?.message || "Server error"));
      } finally {
        setActionLoading(false);
      }
    }
  };

  return (
    <AdminLayoutShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-charcoal-900 font-heading">
              Hero Banners & Visual Promos
            </h1>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Control promotional banners, hero callouts, and seasonal campaigns across the storefront.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={fetchBanners}
              disabled={loading}
              className="border-brand-border text-charcoal-700 hover:bg-sand"
            >
              <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={() => setIsModalOpen(true)} variant="primary" size="md">
              <Plus className="h-4 w-4 mr-1.5" />
              Upload New Banner
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            <Button size="sm" variant="outline" onClick={fetchBanners}>
              Retry
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 p-12 text-center bg-white rounded-2xl border border-brand-border">
              <Loader2 className="h-6 w-6 text-forest-800 animate-spin mx-auto mb-2" />
              <p className="text-charcoal-500 text-xs">Loading banners...</p>
            </div>
          ) : banners.length === 0 ? (
            <div className="col-span-2 p-12 text-center bg-white rounded-2xl border border-brand-border">
              <p className="text-charcoal-500 text-xs">No banners created yet.</p>
            </div>
          ) : (
            banners.map((ban) => (
              <div
                key={ban.id}
                className="rounded-2xl border border-brand-border bg-white shadow-xs overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-48 w-full bg-sand">
                  <Image
                    src={ban.imageUrl}
                    alt={ban.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="primary">{ban.placement}</Badge>
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-charcoal-900 line-clamp-1">
                      {ban.title}
                    </h3>
                    {ban.subtitle && (
                      <p className="text-xs text-charcoal-500 mt-1 line-clamp-2">
                        {ban.subtitle}
                      </p>
                    )}
                    <p className="text-[11px] font-mono text-forest-800 font-semibold mt-2">
                      Destination: {ban.linkUrl}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-sand text-xs">
                    <Badge variant={ban.isActive ? "success" : "default"}>
                      {ban.isActive ? "Live on Storefront" : "Draft"}
                    </Badge>
                    <button
                      onClick={() => handleDelete(ban.id, ban.title)}
                      className="p-1.5 rounded-lg text-charcoal-400 hover:text-rose-600 hover:bg-sand transition-colors cursor-pointer"
                      title="Delete banner"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Upload New Hero Banner"
          description="Place promotional banners on the homepage hero slider or special offers section."
          maxWidth="lg"
        >
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Banner Headline *
              </label>
              <Input
                required
                placeholder="e.g. Traditional Brassware Heritage Exhibition"
                value={newBanner.title}
                onChange={(e) =>
                  setNewBanner({ ...newBanner, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Subheading / Tagline
              </label>
              <Input
                placeholder="e.g. Master-crafted brass lamps & handmade utensils"
                value={newBanner.subtitle}
                onChange={(e) =>
                  setNewBanner({ ...newBanner, subtitle: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Target Link Destination
                </label>
                <Input
                  value={newBanner.linkUrl}
                  onChange={(e) =>
                    setNewBanner({ ...newBanner, linkUrl: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Placement Area
                </label>
                <select
                  value={newBanner.placement}
                  onChange={(e) =>
                    setNewBanner({
                      ...newBanner,
                      placement: e.target.value,
                    })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-brand-border bg-white text-xs font-medium text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-800/20"
                >
                  <option value="Homepage Hero">Homepage Hero</option>
                  <option value="Special E-Sheba Banner">
                    Special E-Sheba Banner
                  </option>
                  <option value="Category Promo">Category Promo</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Banner Image URL
              </label>
              <Input
                placeholder="https://images.unsplash.com/..."
                value={newBanner.imageUrl}
                onChange={(e) =>
                  setNewBanner({ ...newBanner, imageUrl: e.target.value })
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
                ) : (
                  "Publish Banner"
                )}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayoutShell>
  );
}
