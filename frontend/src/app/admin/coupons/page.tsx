"use client";

import * as React from "react";
import { Tag, Plus, Trash2, Calendar, CheckCircle2, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { formatPrice } from "@/lib/utils";
import { couponsApi } from "@/lib/api";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [newCoupon, setNewCoupon] = React.useState({
    code: "",
    discountValue: "10",
    minOrderAmount: "1000",
    endDate: "2026-12-31",
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await couponsApi.getAll();
      if (res.success) {
        setCoupons((res.data as any[]) || []);
      }
    } catch (err: any) {
      console.error("Failed to load coupons:", err);
      setError(err?.message || "Failed to load coupons.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const res = await couponsApi.create({
        code: newCoupon.code.trim().toUpperCase(),
        discountValue: Number(newCoupon.discountValue) || 10,
        minOrderAmount: Number(newCoupon.minOrderAmount) || 0,
        endDate: new Date(newCoupon.endDate).toISOString(),
      });

      if (res.success) {
        await fetchCoupons();
        setIsModalOpen(false);
        setNewCoupon({
          code: "",
          discountValue: "10",
          minOrderAmount: "1000",
          endDate: "2026-12-31",
        });
      }
    } catch (err: any) {
      alert("Error creating coupon: " + (err?.message || "Server error"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`Are you sure you want to delete coupon ${code}?`)) {
      try {
        setActionLoading(true);
        const res = await couponsApi.delete(id);
        if (res.success) {
          setCoupons((prev) => prev.filter((c) => c.id !== id));
        }
      } catch (err: any) {
        alert("Failed to delete coupon: " + (err?.message || "Server error"));
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
              Coupons & Promotional Offers
            </h1>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Create and manage customer discount vouchers, minimum order thresholds, and expiry dates.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={fetchCoupons}
              disabled={loading}
              className="border-brand-border text-charcoal-700 hover:bg-sand"
            >
              <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={() => setIsModalOpen(true)} variant="primary" size="md">
              <Plus className="h-4 w-4 mr-1.5" />
              Create Coupon
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            <Button size="sm" variant="outline" onClick={fetchCoupons}>
              Retry
            </Button>
          </div>
        )}

        {/* Coupons Table */}
        <div className="rounded-2xl border border-brand-border bg-white shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-sand/40 text-[10px] font-bold uppercase tracking-wider text-charcoal-700 border-b border-brand-border">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min Order Threshold</th>
                <th className="py-3 px-4">Expiration Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Loader2 className="h-6 w-6 text-forest-800 animate-spin mx-auto mb-2" />
                    <p className="text-charcoal-500 text-xs">Loading coupons...</p>
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-charcoal-500">
                    No active discount coupons found.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => {
                  const isExpired = new Date(c.endDate) < new Date();
                  return (
                    <tr key={c.id} className="hover:bg-sand/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-forest-800" />
                          <span className="font-mono font-black text-forest-900 bg-sand px-2 py-0.5 rounded border border-sand-dark">
                            {c.code}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-black text-forest-900 text-sm">
                        {c.discountValue}% OFF
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-charcoal-800">
                        {formatPrice(Number(c.minOrderAmount))}
                      </td>
                      <td className="py-3.5 px-4 text-charcoal-600 flex items-center gap-1.5 pt-4">
                        <Calendar className="h-3.5 w-3.5 text-charcoal-400" />
                        <span>{new Date(c.endDate).toLocaleDateString()}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {isExpired ? (
                          <Badge variant="danger">Expired</Badge>
                        ) : c.isActive ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="default">Inactive</Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDelete(c.id, c.code)}
                          className="p-1.5 rounded-lg text-charcoal-400 hover:text-rose-600 hover:bg-sand transition-colors cursor-pointer"
                          title="Delete coupon"
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

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Discount Coupon"
          description="Offer percent discounts to customer checkout carts."
          maxWidth="md"
        >
          <form onSubmit={handleAddCoupon} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Promo Code Identifier *
              </label>
              <Input
                required
                placeholder="e.g. BOISHAKHI20"
                value={newCoupon.code}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, code: e.target.value })
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
                  placeholder="15"
                  value={newCoupon.discountValue}
                  onChange={(e) =>
                    setNewCoupon({
                      ...newCoupon,
                      discountValue: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Min Order Subtotal (৳)
                </label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={newCoupon.minOrderAmount}
                  onChange={(e) =>
                    setNewCoupon({
                      ...newCoupon,
                      minOrderAmount: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Expiry Date *
              </label>
              <Input
                required
                type="date"
                value={newCoupon.endDate}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, endDate: e.target.value })
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
                  "Create Coupon"
                )}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayoutShell>
  );
}
