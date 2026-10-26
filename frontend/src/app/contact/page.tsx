"use client";

import * as React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  CheckCircle2,
  Send,
  Building,
} from "lucide-react";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CLIENT_INFO } from "@/data/mock-data";

export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSent, setIsSent] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      alert("Please provide your name, phone, and message.");
      return;
    }
    setIsSent(true);
  };

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="primary" className="text-xs px-3 py-1">
            Get In Touch
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 font-heading">
            We’re Here to Help You
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500">
            Have questions regarding an order, payment verification, product specifications, or wholesale terms? Reach out directly to our support desk.
          </p>
        </div>

        {/* Contact Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-3">
            <div className="h-10 w-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center">
              <Phone className="h-5 w-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-charcoal-900">
              Customer Support Lines
            </h3>
            <p className="text-xs text-charcoal-600">
              Direct assistance for order inquiries, delivery coordination, and product queries.
            </p>
            <div className="pt-1 space-y-1 text-xs font-bold text-forest-900">
              <p>Primary: {CLIENT_INFO.phonePrimary}</p>
              <p>Secondary: {CLIENT_INFO.phoneSecondary}</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-3">
            <div className="h-10 w-10 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-charcoal-900">
              WhatsApp & Verification
            </h3>
            <p className="text-xs text-charcoal-600">
              Chat instantly on WhatsApp or verify your bKash/Nagad manual payment transaction.
            </p>
            <div className="pt-1 space-y-2">
              <p className="text-xs font-bold text-forest-900">
                Payment Verification: {CLIENT_INFO.phonePayment}
              </p>
              <a
                href={`https://wa.me/88${CLIENT_INFO.phonePrimary}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                <span>Chat on WhatsApp</span>
                <Send className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-3">
            <div className="h-10 w-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-charcoal-900">
              Email & Corporate Desk
            </h3>
            <p className="text-xs text-charcoal-600">
              Send formal business inquiries, vendor proposals, or resume submissions.
            </p>
            <div className="pt-1 text-xs font-bold text-forest-900">
              <p>{CLIENT_INFO.email}</p>
              <p className="text-[11px] text-charcoal-400 font-normal mt-1">
                Dhaka Operations Center, Bangladesh
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto p-8 rounded-2xl border border-brand-border bg-white shadow-xs">
          {isSent ? (
            <div className="text-center py-10 space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="font-heading font-bold text-xl text-charcoal-900">
                Message Sent Successfully
              </h3>
              <p className="text-xs text-charcoal-600 max-w-sm mx-auto">
                Thank you for contacting SHOILPIKKABBO. A support agent will respond to {formData.email || formData.phone} promptly.
              </p>
              <Button
                onClick={() => {
                  setIsSent(false);
                  setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
                }}
                variant="outline"
                size="md"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-sand pb-3">
                <h2 className="font-heading font-bold text-lg text-charcoal-900">
                  Send Us a Direct Message
                </h2>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  We usually respond within 2-4 business hours.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal-800">
                    Your Name *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Sabrina Rahman"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal-800">
                    Phone Number *
                  </label>
                  <Input
                    required
                    type="tel"
                    placeholder="e.g. 018XXXXXXXX"
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
                    placeholder="e.g. sabrina@gmail.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal-800">
                    Inquiry Subject
                  </label>
                  <Input
                    placeholder="e.g. Order Delivery Status or Wholesale"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Message *
                </label>
                <Textarea
                  required
                  rows={4}
                  placeholder="How can we assist you today?"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Submit Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </StorefrontLayout>
  );
}
