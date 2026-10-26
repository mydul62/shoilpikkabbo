"use client";

import * as React from "react";
import { Tag, Plus, Trash2, Calendar, CheckCircle2 } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { MOCK_COUPONS, Coupon } from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = React.useState<Coupon[]>(MOCK_COUPONS);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newCoupon, setNewCoupon] = React.useState({
    code: "",
    discountPercentage: "10",
    minOrderValue: "1000",
    description: "",
    expiresAt: "2026-12-31",
  });

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Coupon = {
      code: newCoupon.code.trim().toUpperCase(),
      discountPercentage: Number(newCoupon.discountPercentage) || 10,
      minOrderValue: Number(newCoupon.minOrderValue) || 1000,
      description: newCoupon.description || `${newCoupon.discountPercentage}% discount voucher`,
      expiresAt: newCoupon.expiresAt,
    };
    setCoupons([...coupons, created]);
    setIsModalOpen(false);
    setNewCoupon({
      code: "",
      discountPercentage: "10",
      minOrderValue: "1000",
      description: "",
      expiresAt: "2026-12-31",
    });
  };

  const handleDelete = (code: string) => {
    setCoupons(coupons.filter((c) => c.code !== code));
  };

  return (
    <AdminLayoutShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-charcoal-900 font-heading">
              Coupons & Promotional Offers
            </h1>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Create and manage customer discount vouchers, minimum order thresholds, and expiry dates.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} variant="primary" size="md">
            <Plus className="h-4 w-4 mr-1.5" />
            Create Promo Code
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div
              key={c.code}
              className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-4 relative"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono font-black text-lg text-forest-900 bg-sand/60 px-2.5 py-1 rounded-lg border border-brand-border">
                    {c.code}
                  </span>
                  <p className="font-heading font-black text-2xl text-charcoal-900 mt-3">
                    {c.discountPercentage}% OFF
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(c.code)}
                  className="p-1.5 text-charcoal-400 hover:text-rose-600 rounded-lg hover:bg-sand"
                  title="Delete Coupon"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-charcoal-600">{c.description}</p>

              <div className="pt-2 border-t border-sand flex items-center justify-between text-xs text-charcoal-500">
                <span>Min Order: {formatPrice(c.minOrderValue)}</span>
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="h-3 w-3" />
                  Expires: {c.expiresAt}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Coupon Voucher"
          description="Define voucher code and checkout eligibility rules."
        >
          <form onSubmit={handleAddCoupon} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Coupon Code (Uppercase) *
              </label>
              <Input
                required
                placeholder="e.g. SUMMER25"
                value={newCoupon.code}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Discount Percentage (%) *
                </label>
                <Input
                  required
                  type="number"
                  min="1"
                  max="90"
                  value={newCoupon.discountPercentage}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, discountPercentage: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Minimum Order (৳) *
                </label>
                <Input
                  required
                  type="number"
                  min="0"
                  value={newCoupon.minOrderValue}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, minOrderValue: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Expiration Date
              </label>
              <Input
                type="date"
                value={newCoupon.expiresAt}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, expiresAt: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Description / Terms
              </label>
              <Input
                placeholder="e.g. 15% discount on all artisan crafts"
                value={newCoupon.description}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, description: e.target.value })
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
                Publish Coupon
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayoutShell>
  );
}
