"use client";

import * as React from "react";
import {
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  Send,
  Upload,
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { MOCK_VACANCIES, CareerVacancy } from "@/data/mock-data";

export default function CareersPage() {
  const [selectedVacancy, setSelectedVacancy] = React.useState<CareerVacancy | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = React.useState(false);
  const [applicationSuccess, setApplicationSuccess] = React.useState(false);

  const [applicantData, setApplicantData] = React.useState({
    fullName: "",
    phone: "",
    email: "",
    portfolioUrl: "",
    coverNote: "",
  });

  const handleOpenApply = (vacancy: CareerVacancy) => {
    setSelectedVacancy(vacancy);
    setApplicationSuccess(false);
    setIsApplyModalOpen(true);
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantData.fullName || !applicantData.phone) {
      alert("Please provide your name and phone number.");
      return;
    }
    setApplicationSuccess(true);
  };

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="primary" className="text-xs px-3 py-1">
            Work With Us
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 font-heading">
            Join the SHOILPIKKABBO Team
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500">
            We are dedicated to building Bangladesh’s most reliable, ethical commerce platform. Discover career opportunities across artisan sourcing, quality assurance, fulfillment, and digital marketing.
          </p>
        </div>

        {/* Vacancies List */}
        <div className="space-y-6">
          <h2 className="font-heading font-extrabold text-xl text-charcoal-900">
            Open Job Vacancies ({MOCK_VACANCIES.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_VACANCIES.map((vacancy) => (
              <div
                key={vacancy.id}
                className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs flex flex-col justify-between space-y-4 hover:border-forest-700/50 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="primary">{vacancy.department}</Badge>
                    <span className="text-xs font-semibold text-charcoal-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {vacancy.type}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-charcoal-900">
                    {vacancy.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-forest-800" />
                      {vacancy.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-forest-800" />
                      Deadline: {vacancy.deadline}
                    </span>
                  </div>

                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    {vacancy.description}
                  </p>

                  <div className="space-y-1 pt-2">
                    <p className="text-[11px] font-bold text-charcoal-800 uppercase tracking-wider">
                      Key Qualifications:
                    </p>
                    <ul className="list-disc list-inside text-xs text-charcoal-600 space-y-0.5">
                      {vacancy.requirements.map((req, idx) => (
                        <li key={idx} className="line-clamp-1">
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-sand flex items-center justify-between">
                  <span className="text-xs text-charcoal-400">
                    Exp: {vacancy.experience}
                  </span>
                  <Button
                    onClick={() => handleOpenApply(vacancy)}
                    variant="primary"
                    size="sm"
                  >
                    Apply for Position
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Modal */}
        <Modal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          title={`Apply: ${selectedVacancy?.title}`}
          description={`Submit your credentials for ${selectedVacancy?.department}`}
        >
          {applicationSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h4 className="font-heading font-bold text-base text-charcoal-900">
                Application Received!
              </h4>
              <p className="text-xs text-charcoal-500">
                Thank you, {applicantData.fullName}. Our recruitment team will review your application and contact you at {applicantData.phone}.
              </p>
              <Button
                onClick={() => setIsApplyModalOpen(false)}
                variant="secondary"
                size="md"
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleApplicationSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Full Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  value={applicantData.fullName}
                  onChange={(e) =>
                    setApplicantData({ ...applicantData, fullName: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal-800">
                    Phone Number *
                  </label>
                  <Input
                    required
                    type="tel"
                    placeholder="e.g. 017XXXXXXXX"
                    value={applicantData.phone}
                    onChange={(e) =>
                      setApplicantData({ ...applicantData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal-800">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="e.g. tanvir@gmail.com"
                    value={applicantData.email}
                    onChange={(e) =>
                      setApplicantData({ ...applicantData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Resume / LinkedIn Profile URL
                </label>
                <Input
                  type="url"
                  placeholder="https://linkedin.com/in/... or Google Drive Link"
                  value={applicantData.portfolioUrl}
                  onChange={(e) =>
                    setApplicantData({
                      ...applicantData,
                      portfolioUrl: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Brief Cover Note
                </label>
                <Textarea
                  rows={3}
                  placeholder="Tell us briefly about your experience and why you are interested in this role."
                  value={applicantData.coverNote}
                  onChange={(e) =>
                    setApplicantData({ ...applicantData, coverNote: e.target.value })
                  }
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setIsApplyModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md">
                  <Send className="h-4 w-4 mr-1.5" />
                  Submit Application
                </Button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </StorefrontLayout>
  );
}
