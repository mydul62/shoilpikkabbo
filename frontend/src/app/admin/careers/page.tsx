"use client";

import * as React from "react";
import { Briefcase, Plus, MapPin, Calendar, Trash2, Loader2, RefreshCw, AlertCircle, Users } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { careersApi } from "@/lib/api";

export default function AdminCareersPage() {
  const [vacancies, setVacancies] = React.useState<any[]>([]);
  const [applications, setApplications] = React.useState<any[]>([]);
  const [activeTab, setActiveTab] = React.useState<"vacancies" | "applications">("vacancies");
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [newVac, setNewVac] = React.useState({
    title: "",
    department: "Logistics & Fulfillment",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    experience: "1-3 years",
    deadline: "2026-12-31",
    description: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [vacRes, appRes] = await Promise.all([
        careersApi.getAll(),
        careersApi.getApplications().catch(() => ({ success: true, data: [] })),
      ]);

      if (vacRes.success) setVacancies((vacRes.data as any[]) || []);
      if (appRes.success) setApplications((appRes.data as any[]) || []);
    } catch (err: any) {
      console.error("Failed to load career data:", err);
      setError(err?.message || "Failed to load career listings.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const res = await careersApi.create({
        title: newVac.title,
        department: newVac.department,
        location: newVac.location,
        type: newVac.type,
        experience: newVac.experience,
        deadline: new Date(newVac.deadline).toISOString(),
        description: newVac.description,
        requirements: ["Strong dedication to artisan craft", "Relevant operational experience"],
      });

      if (res.success) {
        await fetchData();
        setIsModalOpen(false);
        setNewVac({
          title: "",
          department: "Logistics & Fulfillment",
          location: "Dhaka, Bangladesh",
          type: "Full-time",
          experience: "1-3 years",
          deadline: "2026-12-31",
          description: "",
        });
      }
    } catch (err: any) {
      alert("Error creating vacancy: " + (err?.message || "Server error"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete opening "${title}"?`)) {
      try {
        setActionLoading(true);
        const res = await careersApi.delete(id);
        if (res.success) {
          setVacancies((prev) => prev.filter((v) => v.id !== id));
        }
      } catch (err: any) {
        alert("Failed to delete vacancy: " + (err?.message || "Server error"));
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
              Recruitment & Career Vacancies
            </h1>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Publish job openings, manage department requirements, and review applicant submissions.
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
            <Button onClick={() => setIsModalOpen(true)} variant="primary" size="md">
              <Plus className="h-4 w-4 mr-1.5" />
              Post New Opening
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

        {/* Tab Switcher */}
        <div className="flex border-b border-brand-border">
          <button
            onClick={() => setActiveTab("vacancies")}
            className={`px-4 py-2 text-xs font-bold border-b-2 -mb-px transition-colors cursor-pointer ${
              activeTab === "vacancies"
                ? "border-forest-800 text-forest-900"
                : "border-transparent text-charcoal-500 hover:text-charcoal-800"
            }`}
          >
            Active Openings ({vacancies.length})
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`px-4 py-2 text-xs font-bold border-b-2 -mb-px transition-colors cursor-pointer ${
              activeTab === "applications"
                ? "border-forest-800 text-forest-900"
                : "border-transparent text-charcoal-500 hover:text-charcoal-800"
            }`}
          >
            Applicant Submissions ({applications.length})
          </button>
        </div>

        {activeTab === "vacancies" ? (
          <div className="space-y-4">
            {loading ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-brand-border">
                <Loader2 className="h-6 w-6 text-forest-800 animate-spin mx-auto mb-2" />
                <p className="text-charcoal-500 text-xs">Loading career listings...</p>
              </div>
            ) : vacancies.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-brand-border">
                <p className="text-charcoal-500 text-xs">No active job vacancies found in database.</p>
              </div>
            ) : (
              vacancies.map((vac) => (
                <div
                  key={vac.id}
                  className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-sand pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-extrabold text-base text-charcoal-900">
                          {vac.title}
                        </h3>
                        <Badge variant="primary">{vac.type}</Badge>
                      </div>
                      <p className="text-xs font-semibold text-forest-800 mt-1">
                        {vac.department} • Experience: {vac.experience}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(vac.id, vac.title)}
                        className="p-2 rounded-lg text-charcoal-400 hover:text-rose-600 hover:bg-sand transition-colors cursor-pointer"
                        title="Delete vacancy"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-charcoal-700 leading-relaxed">
                    {vac.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-charcoal-500 border-t border-sand">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-forest-800" />
                      {vac.location}
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold text-charcoal-700">
                      <Calendar className="h-3.5 w-3.5 text-forest-800" />
                      Deadline: {new Date(vac.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-brand-border bg-white shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand/40 text-[10px] font-bold uppercase tracking-wider text-charcoal-700 border-b border-brand-border">
                <tr>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Position</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">Resume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-charcoal-500">
                      No applications submitted yet.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-sand/20">
                      <td className="py-3 px-4 font-bold text-charcoal-900">
                        {app.applicantName}
                        <span className="block text-[10px] text-charcoal-400 font-normal">
                          {app.email}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-forest-900">
                        {app.vacancy?.title || "General Application"}
                      </td>
                      <td className="py-3 px-4 font-mono text-charcoal-700">
                        {app.phone}
                      </td>
                      <td className="py-3 px-4 text-charcoal-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {app.resumeUrl ? (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-forest-800 underline font-semibold"
                          >
                            View CV
                          </a>
                        ) : (
                          <span className="text-charcoal-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Post Career Vacancy"
          description="Create public job posting for artisans, logistics, and craft specialists."
          maxWidth="lg"
        >
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Job Title *
              </label>
              <Input
                required
                placeholder="e.g. Master Woodcarver & Product Designer"
                value={newVac.title}
                onChange={(e) =>
                  setNewVac({ ...newVac, title: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Department *
                </label>
                <Input
                  required
                  value={newVac.department}
                  onChange={(e) =>
                    setNewVac({ ...newVac, department: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Employment Type
                </label>
                <select
                  value={newVac.type}
                  onChange={(e) =>
                    setNewVac({ ...newVac, type: e.target.value as any })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-brand-border bg-white text-xs font-medium text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-800/20"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Apprenticeship">Apprenticeship</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Location
                </label>
                <Input
                  value={newVac.location}
                  onChange={(e) =>
                    setNewVac({ ...newVac, location: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Application Deadline *
                </label>
                <Input
                  required
                  type="date"
                  value={newVac.deadline}
                  onChange={(e) =>
                    setNewVac({ ...newVac, deadline: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Job Responsibilities & Overview
              </label>
              <Textarea
                rows={3}
                placeholder="Detail the craft requirements, materials handled, and workshop expectations..."
                value={newVac.description}
                onChange={(e) =>
                  setNewVac({ ...newVac, description: e.target.value })
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
                  "Post Opening"
                )}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayoutShell>
  );
}
