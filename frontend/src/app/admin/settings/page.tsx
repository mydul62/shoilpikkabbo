"use client";

import * as React from "react";
import { Settings, Save, CheckCircle2, ShieldCheck, Truck, Phone, RefreshCw } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CLIENT_INFO } from "@/data/mock-data";

export default function AdminSettingsPage() {
  const [settings, setSettings] = React.useState({
    storeName: CLIENT_INFO.name,
    tagline: CLIENT_INFO.tagline,
    email: CLIENT_INFO.email,
    phonePrimary: CLIENT_INFO.phonePrimary,
    phoneSecondary: CLIENT_INFO.phoneSecondary,
    phonePayment: CLIENT_INFO.phonePayment,
    bankName: CLIENT_INFO.bankName,
    deliveryDhaka: String(CLIENT_INFO.deliveryChargeDhaka),
    deliveryOutside: String(CLIENT_INFO.deliveryChargeOutside),
    freeThreshold: String(CLIENT_INFO.freeDeliveryThreshold),
  });

  const [isSaved, setIsSaved] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("shoilpikkabbo_settings");
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("shoilpikkabbo_settings", JSON.stringify(settings));
    } catch (e) {
      // ignore
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <AdminLayoutShell>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-black text-charcoal-900 font-heading">
            Store & Operations Settings
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Manage verified client phone lines, manual payment targets, and delivery charges.
          </p>
        </div>

        {isSaved && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Settings successfully saved and persisted across storefront configurations.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* 1. Brand Identity */}
          <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-base text-charcoal-900 border-b border-sand pb-3">
              1. Brand Identity & General Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Business Name
                </label>
                <Input
                  value={settings.storeName}
                  onChange={(e) =>
                    setSettings({ ...settings, storeName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Brand Tagline
                </label>
                <Input
                  value={settings.tagline}
                  onChange={(e) =>
                    setSettings({ ...settings, tagline: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal-800">
                Official Support Email
              </label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* 2. Contact Lines */}
          <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-base text-charcoal-900 border-b border-sand pb-3 flex items-center gap-2">
              <Phone className="h-4 w-4 text-forest-800" />
              <span>2. Official Contact & Support Phone Lines</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Primary Customer Support Number
                </label>
                <Input
                  value={settings.phonePrimary}
                  onChange={(e) =>
                    setSettings({ ...settings, phonePrimary: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Secondary Customer Support Number
                </label>
                <Input
                  value={settings.phoneSecondary}
                  onChange={(e) =>
                    setSettings({ ...settings, phoneSecondary: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Verification */}
          <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-base text-charcoal-900 border-b border-sand pb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-forest-800" />
              <span>3. Payment Verification Accounts</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Manual bKash & Nagad Verification Recipient
                </label>
                <Input
                  value={settings.phonePayment}
                  onChange={(e) =>
                    setSettings({ ...settings, phonePayment: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Primary Banking Partner
                </label>
                <Input
                  value={settings.bankName}
                  onChange={(e) =>
                    setSettings({ ...settings, bankName: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* 4. Shipping Fees */}
          <div className="p-6 rounded-2xl border border-brand-border bg-white shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-base text-charcoal-900 border-b border-sand pb-3 flex items-center gap-2">
              <Truck className="h-4 w-4 text-forest-800" />
              <span>4. Nationwide Shipping Charges</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Inside Dhaka (৳)
                </label>
                <Input
                  type="number"
                  value={settings.deliveryDhaka}
                  onChange={(e) =>
                    setSettings({ ...settings, deliveryDhaka: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Outside Dhaka (৳)
                </label>
                <Input
                  type="number"
                  value={settings.deliveryOutside}
                  onChange={(e) =>
                    setSettings({ ...settings, deliveryOutside: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal-800">
                  Free Delivery Threshold (৳)
                </label>
                <Input
                  type="number"
                  value={settings.freeThreshold}
                  onChange={(e) =>
                    setSettings({ ...settings, freeThreshold: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="lg" className="shadow-md cursor-pointer">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </AdminLayoutShell>
  );
}
