"use client";

import * as React from "react";
import {
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  Building,
  ArrowRight,
  ShieldCheck,
  Send,
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CLIENT_INFO } from "@/data/mock-data";

export default function EShebaPage() {
  const [formData, setFormData] = React.useState({
    fullName: "",
    phone: "",
    email: "",
    organization: "",
    serviceType: "Corporate Bulk Procurement & Gift Sets",
    requirements: "",
  });

  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.requirements) {
      alert("Please provide your name, contact phone, and requirements.");
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="rounded-3xl bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-sand p-8 sm:p-14 border border-forest-800 shadow-xl mb-12">
          <div className="max-w-3xl space-y-4">
            <Badge variant="gold" className="text-xs px-3 py-1">
              B2B Institutional Solutions
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              Special E-Sheba — Tailored Institutional Inquiries
            </h1>
            <p className="text-sand/80 text-sm sm:text-base leading-relaxed">
              Have unique requirements for corporate gifting, bespoke ceramic art for architectural interiors, specialized export packaging, or bulk agricultural inputs? Our specialized team works directly with artisan collectives and industrial manufacturers to fulfill your custom specs.
            </p>
          </div>
        </div>

        {/* Content & Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Service Pillars (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-heading font-bold text-xl text-charcoal-900">
              Our Specialized Capabilities
            </h2>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-brand-border bg-white shadow-xs">
                <h3 className="font-bold text-forest-900 text-sm mb-1">
                  1. Corporate Bulk Gifts & Event Bundles
                </h3>
                <p className="text-charcoal-600 leading-relaxed">
                  Tailored conference bags, executive leatherette folios, brass mementos, and custom branded packaging for corporate annual meetings and client appreciation.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-brand-border bg-white shadow-xs">
                <h3 className="font-bold text-forest-900 text-sm mb-1">
                  2. Architectural Artisanal Decor
                </h3>
                <p className="text-charcoal-600 leading-relaxed">
                  Large-scale handcrafted terracotta urns, bespoke clay tiles, jute room dividers, and traditional wall panels designed for hotels, restaurants, and corporate lobbies.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-brand-border bg-white shadow-xs">
                <h3 className="font-bold text-forest-900 text-sm mb-1">
                  3. Sustainable Industrial Polymer Sourcing
                </h3>
                <p className="text-charcoal-600 leading-relaxed">
                  Custom engineered high-density crates, food-safe plastic bins, and heavy-duty storage containers customized to factory dimensional requirements.
                </p>
              </div>
            </div>

            {/* Direct Contact Card */}
            <div className="p-6 rounded-2xl bg-sand/60 border border-brand-border space-y-3">
              <h4 className="font-heading font-bold text-xs text-charcoal-900 uppercase tracking-wider">
                Direct Corporate Desk
              </h4>
              <div className="space-y-2 text-xs text-charcoal-800">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-forest-800" />
                  <span>Call: {CLIENT_INFO.phonePrimary} / {CLIENT_INFO.phoneSecondary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-forest-800" />
                  <span>Email: {CLIENT_INFO.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl border border-brand-border bg-white shadow-xs">
              {isSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="h-16 w-16 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-charcoal-900">
                    Inquiry Submitted Successfully
                  </h3>
                  <p className="text-xs text-charcoal-600 max-w-md mx-auto leading-relaxed">
                    Thank you, {formData.fullName}. Our special corporate solutions representative will review your request and get in touch at <strong>{formData.phone}</strong> within 1 business day.
                  </p>
                  <Button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        fullName: "",
                        phone: "",
                        email: "",
                        organization: "",
                        serviceType: "Corporate Bulk Procurement & Gift Sets",
                        requirements: "",
                      });
                    }}
                    variant="outline"
                    size="md"
                  >
                    Submit Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-sand pb-4">
                    <h2 className="font-heading font-bold text-lg text-charcoal-900">
                      Submit Your Requirement Specs
                    </h2>
                    <p className="text-xs text-charcoal-500 mt-1">
                      Fill out the form below and specify your target quantities, delivery deadlines, and custom specs.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-charcoal-800">
                        Your Full Name *
                      </label>
                      <Input
                        required
                        placeholder="e.g. Navid Hossain"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-charcoal-800">
                        Contact Phone Number *
                      </label>
                      <Input
                        required
                        type="tel"
                        placeholder="e.g. 017XXXXXXXX"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-charcoal-800">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="e.g. navid@company.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-charcoal-800">
                        Company / Organization (Optional)
                      </label>
                      <Input
                        placeholder="e.g. TexGroup Ltd."
                        value={formData.organization}
                        onChange={(e) =>
                          setFormData({ ...formData, organization: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-charcoal-800">
                      Service Category *
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) =>
                        setFormData({ ...formData, serviceType: e.target.value })
                      }
                      className="w-full h-10 px-3 rounded-lg border border-brand-border bg-white text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-800/20"
                    >
                      <option value="Corporate Bulk Procurement & Gift Sets">
                        Corporate Bulk Procurement & Gift Sets
                      </option>
                      <option value="Artisanal Decor & Terracotta Interior Fitments">
                        Artisanal Decor & Terracotta Interior Fitments
                      </option>
                      <option value="Custom Jute Manufacturing & Export Orders">
                        Custom Jute Manufacturing & Export Orders
                      </option>
                      <option value="Industrial Polymer Containers & Engineering Crates">
                        Industrial Polymer Containers & Engineering Crates
                      </option>
                      <option value="Agricultural Inputs & Farm Consignment">
                        Agricultural Inputs & Farm Consignment
                      </option>
                      <option value="Other Bespoke Commerce Sourcing">
                        Other Bespoke Commerce Sourcing
                      </option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-charcoal-800">
                      Detailed Requirement Description & Quantities *
                    </label>
                    <Textarea
                      required
                      rows={5}
                      placeholder="Please specify estimated quantity, required completion date, target dimensions, logo branding requirements, etc."
                      value={formData.requirements}
                      onChange={(e) =>
                        setFormData({ ...formData, requirements: e.target.value })
                      }
                    />
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Special E-Sheba Inquiry
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
