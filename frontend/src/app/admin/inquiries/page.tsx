"use client";

import * as React from "react";
import { MessageSquare, Phone, Mail, Building, CheckCircle2, Clock } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_INQUIRIES, ServiceInquiry } from "@/data/mock-data";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = React.useState<ServiceInquiry[]>(MOCK_INQUIRIES);

  const handleUpdateStatus = (
    id: string,
    status: ServiceInquiry["status"]
  ) => {
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i))
    );
  };

  return (
    <AdminLayoutShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-charcoal-900 font-heading">
            Special E-Sheba Service Inquiries
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Review and follow up on institutional, corporate, and custom procurement requests.
          </p>
        </div>

        <div className="space-y-4">
          {inquiries.map((inq) => (
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
                    Submitted on: {inq.submittedAt}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-charcoal-700">
                    Status:
                  </span>
                  <select
                    value={inq.status}
                    onChange={(e) =>
                      handleUpdateStatus(inq.id, e.target.value as any)
                    }
                    className="h-8 px-2.5 rounded-lg border border-brand-border bg-white text-xs font-bold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-800/20"
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
                      className="hover:underline"
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
          ))}
        </div>
      </div>
    </AdminLayoutShell>
  );
}
