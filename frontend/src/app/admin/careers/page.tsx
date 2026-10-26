"use client";

import * as React from "react";
import { Briefcase, Plus, MapPin, Calendar, Trash2 } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { MOCK_VACANCIES, CareerVacancy } from "@/data/mock-data";

export default function AdminCareersPage() {
  const [vacancies, setVacancies] = React.useState<CareerVacancy[]>(MOCK_VACANCIES);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newVac, setNewVac] = React.useState({
    title: "",
    department: "Logistics & Fulfillment",
    location: "Dhaka, Bangladesh",
    type: "Full-time" as CareerVacancy["type"],
    experience: "1-3 years",
    deadline: "30 November 2026",
    description: "",
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const created: CareerVacancy = {
      id: `vac-${Date.now()}`,
      title: newVac.title,
      department: newVac.department,
      location: newVac.location,
      type: newVac.type,
      experience: newVac.experience,
      deadline: newVac.deadline,
      description: newVac.description,
      requirements: ["Relevant discipline experience", "Strong communication"],
    };
    setVacancies([...vacancies, created]);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setVacancies(vacancies.filter((v) => v.id !== id));
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
              Publish job openings, manage department requirements, and review hiring deadlines.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} variant="primary" size="md">
            <Plus className="h-4 w-4 mr-1.5" />
            Post New Opening
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vacancies.map((vac) => (
            <div
              key={vac.id}
              className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <Badge variant="primary">{vac.department}</Badge>
                  <button
                    onClick={() => handleDelete(vac.id)}
                    className="p-1 text-charcoal-400 hover:text-rose-600 rounded"
                    title="Delete Opening"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="font-heading font-bold text-lg text-charcoal-900">
                  {vac.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-xs text-charcoal-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-forest-800" />
                    {vac.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-forest-800" />
                    Deadline: {vac.deadline}
                  </span>
                </div>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  {vac.description}
                </p>
              </div>

              <div className="pt-3 border-t border-sand flex items-center justify-between text-xs text-charcoal-500">
                <span>Experience: {vac.experience}</span>
                <span className="font-bold text-forest-800">{vac.type}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Post Career Vacancy"
          description="Create a public job vacancy on the SHOILPIKKABBO Careers page."
        >
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Job Title *
              </label>
              <Input
                required
                placeholder="e.g. Senior Inventory & Packaging Supervisor"
                value={newVac.title}
                onChange={(e) => setNewVac({ ...newVac, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Department
                </label>
                <Input
                  value={newVac.department}
                  onChange={(e) =>
                    setNewVac({ ...newVac, department: e.target.value })
                  }
                />
              </div>
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
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Required Experience
                </label>
                <Input
                  value={newVac.experience}
                  onChange={(e) =>
                    setNewVac({ ...newVac, experience: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Application Deadline
                </label>
                <Input
                  value={newVac.deadline}
                  onChange={(e) =>
                    setNewVac({ ...newVac, deadline: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Role Description
              </label>
              <Textarea
                rows={3}
                placeholder="Job responsibilities and requirements..."
                value={newVac.description}
                onChange={(e) =>
                  setNewVac({ ...newVac, description: e.target.value })
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
                Publish Opening
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayoutShell>
  );
}
