"use client";

import * as React from "react";
import { MessageSquare, Phone, Mail, Building, CheckCircle2, Clock, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { inquiriesApi } from "@/lib/api";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await inquiriesApi.getAll();
      if (res.success) {
        setInquiries((res.data as any[]) || []);
      }
    } catch (err: any) {
      console.error("Failed to load inquiries:", err);
      setError(err?.message || "Failed to load inquiries.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, status: any) => {
    try {
      setActionLoading(id);
      const res = await inquiriesApi.updateStatus(id, status);
      if (res.success) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status } : i))
        );
      }
    } catch (err: any) {
      alert("Failed to update status: " + (err?.message || "Server error"));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <AdminLayoutShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-charcoal-900 font-heading">
              Special E-Sheba Service Inquiries
            </h1>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Review and follow up on institutional, corporate, and custom procurement requests.
            </p>
          </div>
          <Button
            variant="outline"
            size="md"
            onClick={fetchInquiries}
            disabled={loading}
            className="border-brand-border text-charcoal-700 hover:bg-sand"
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            <Button size="sm" variant="outline" onClick={fetchInquiries}>
              Retry
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-brand-border">
              <Loader2 className="h-6 w-6 text-forest-800 animate-spin mx-auto mb-2" />
              <p className="text-charcoal-500 text-xs">Loading customer inquiries...</p>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-brand-border">
              <p className="text-charcoal-500 text-xs">No service inquiries found in database.</p>
            </div>
          ) : (
            inquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-extrabold text-base text-charcoal-900">
                        {inq.customerName}
                      </h3>
                      <Badge
                        variant={
                          inq.status === "NEW"
                            ? "gold"
                            : inq.status === "RESOLVED"
                            ? "success"
                            : "primary"
                        }
                      >
                        {inq.status}
                      </Badge>
                    </div>
                    {inq.organization && (
                      <p className="text-xs font-semibold text-forest-800 flex items-center gap-1 mt-0.5">
                        <Building className="h-3 w-3" />
                        {inq.organization}
                      </p>
                    )}
                    <p className="text-[10px] text-charcoal-400 mt-0.5">
                      Submitted on: {new Date(inq.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-charcoal-700">
                      Status:
                    </span>
                    <select
                      value={inq.status}
                      disabled={actionLoading === inq.id}
                      onChange={(e) =>
                        handleUpdateStatus(inq.id, e.target.value)
                      }
                      className="h-8 px-2.5 rounded-lg border border-brand-border bg-white text-xs font-bold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-800/20 cursor-pointer"
                    >
                      <option value="NEW">New</option>
                      <option value="IN_REVIEW">In Review</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-sand/30 border border-brand-border">
                    <span className="text-charcoal-500 block">Category</span>
                    <p className="font-bold text-charcoal-900 mt-0.5">
                      {inq.serviceType}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-sand/30 border border-brand-border">
                    <span className="text-charcoal-500 block">Phone</span>
                    <p className="font-bold text-charcoal-900 mt-0.5 flex items-center gap-1">
                      <Phone className="h-3 w-3 text-forest-800" />
                      <a
                        href={`tel:${inq.customerPhone}`}
                        className="hover:underline font-semibold"
                      >
                        {inq.customerPhone}
                      </a>
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-sand/30 border border-brand-border">
                    <span className="text-charcoal-500 block">Email</span>
                    <p className="font-bold text-charcoal-900 mt-0.5 flex items-center gap-1">
                      <Mail className="h-3 w-3 text-forest-800" />
                      <span>{inq.customerEmail || "Not provided"}</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-brand-border">
                  <h4 className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">
                    Customer Specifications & Notes
                  </h4>
                  <p className="text-xs text-charcoal-800 leading-relaxed">
                    {inq.requirements}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayoutShell>
  );
}
