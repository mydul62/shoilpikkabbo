"use client";

import * as React from "react";
import Image from "next/image";
import { Image as ImageIcon, Plus, Trash2, Eye } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

interface BannerRecord {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  placement: "Homepage Hero" | "Special E-Sheba Banner" | "Category Promo";
  isActive: boolean;
}

const INITIAL_BANNERS: BannerRecord[] = [
  {
    id: "ban-1",
    title: "Artisanal Craftsmanship & Modern Reliability",
    subtitle: "Dhamrai Terracotta, Jute Rugs & Executive Gifts",
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    linkUrl: "/shop",
    placement: "Homepage Hero",
    isActive: true,
  },
  {
    id: "ban-2",
    title: "Special E-Sheba B2B Corporate Procurement",
    subtitle: "Custom Brand Logo Embossing on Jute & Leatherette",
    imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
    linkUrl: "/e-sheba",
    placement: "Special E-Sheba Banner",
    isActive: true,
  },
];

export default function AdminBannersPage() {
  const [banners, setBanners] = React.useState<BannerRecord[]>(INITIAL_BANNERS);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newBanner, setNewBanner] = React.useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    linkUrl: "/shop",
    placement: "Homepage Hero" as BannerRecord["placement"],
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const created: BannerRecord = {
      id: `ban-${Date.now()}`,
      title: newBanner.title,
      subtitle: newBanner.subtitle,
      imageUrl:
        newBanner.imageUrl ||
        "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80",
      linkUrl: newBanner.linkUrl,
      placement: newBanner.placement,
      isActive: true,
    };
    setBanners([...banners, created]);
    setIsModalOpen(false);
  };

  const handleToggleActive = (id: string) => {
    setBanners(
      banners.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  const handleDelete = (id: string) => {
    setBanners(banners.filter((b) => b.id !== id));
  };

  return (
    <AdminLayoutShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-charcoal-900 font-heading">
              Banner & Promotional Graphics
            </h1>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Manage promotional hero carousels and seasonal storefront banners.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} variant="primary" size="md">
            <Plus className="h-4 w-4 mr-1.5" />
            Add New Banner
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="rounded-2xl border border-brand-border bg-white shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div className="relative aspect-16/7 w-full bg-sand/40">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="primary">{banner.placement}</Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant={banner.isActive ? "success" : "danger"}>
                    {banner.isActive ? "Active" : "Hidden"}
                  </Badge>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-heading font-bold text-base text-charcoal-900">
                  {banner.title}
                </h3>
                <p className="text-xs text-charcoal-600">{banner.subtitle}</p>
                <p className="text-[10px] text-charcoal-400 font-mono">
                  Target Link: {banner.linkUrl}
                </p>
              </div>

              <div className="p-4 bg-sand/30 border-t border-sand flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(banner.id)}
                >
                  {banner.isActive ? "Deactivate" : "Activate"}
                </Button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="p-1.5 text-charcoal-400 hover:text-rose-600 rounded"
                  title="Delete Banner"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Storefront Banner"
          description="Create a banner placement for homepage or promo sections."
        >
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Headline Title *
              </label>
              <Input
                required
                placeholder="e.g. Pohela Boishakh Artisanal Fair"
                value={newBanner.title}
                onChange={(e) =>
                  setNewBanner({ ...newBanner, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Subtitle Description
              </label>
              <Input
                placeholder="e.g. Up to 20% off on handmade pottery"
                value={newBanner.subtitle}
                onChange={(e) =>
                  setNewBanner({ ...newBanner, subtitle: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Image URL
              </label>
              <Input
                placeholder="https://images.unsplash.com/..."
                value={newBanner.imageUrl}
                onChange={(e) =>
                  setNewBanner({ ...newBanner, imageUrl: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Target Link
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
                  Placement
                </label>
                <select
                  value={newBanner.placement}
                  onChange={(e) =>
                    setNewBanner({ ...newBanner, placement: e.target.value as any })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-brand-border bg-white text-xs text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-800/20"
                >
                  <option value="Homepage Hero">Homepage Hero</option>
                  <option value="Special E-Sheba Banner">Special E-Sheba Banner</option>
                  <option value="Category Promo">Category Promo</option>
                </select>
              </div>
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
                Add Banner
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayoutShell>
  );
}
