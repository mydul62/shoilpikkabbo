"use client";

import * as React from "react";
import { settingsApi } from "@/lib/api";

export interface SiteSettings {
  storeName: string;
  tagline: string;
  storeNameBn: string;
  taglineBn: string;
  contactPrimary: string;
  contactSecondary: string;
  contactEmail: string;
  contactPayment: string;
  paymentBkashNumber: string;
  paymentNagadNumber: string;
  paymentRocketNumber: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankBranch: string;
  deliveryDhaka: number;
  deliveryOutside: number;
  freeDeliveryThreshold: number;
  deliveryTimeDhaka: string;
  deliveryTimeOutside: string;
  socialWhatsapp: string;
  socialFacebook: string;
  socialMessenger: string;
  socialYoutube: string;
  socialInstagram: string;
  officeAddress: string;
  officeHours: string;
  headerAnnouncement: string;
  headerAnnouncementEnabled: boolean;
  logoUrl: string;
  paymentInstructionsNote: string;
  raw: Record<string, string>;
}

const DEFAULT_SETTINGS: SiteSettings = {
  storeName: "SHOILPIKKABBO",
  tagline: "Delivery • Quality • Reliability",
  storeNameBn: "শিল্পকাব্য",
  taglineBn: "ঐতিহ্য ও আধুনিকতার অনন্য কারুশিল্প",
  contactPrimary: "01731214379",
  contactSecondary: "01811909068",
  contactEmail: "shoilpikkabbo@gmail.com",
  contactPayment: "01977765999",
  paymentBkashNumber: "01977765999",
  paymentNagadNumber: "01977765999",
  paymentRocketNumber: "",
  bankName: "BRAC Bank PLC",
  bankAccountName: "SHOILPIKKABBO",
  bankAccountNumber: "1501204892001",
  bankBranch: "Gulshan Corporate Branch, Dhaka",
  deliveryDhaka: 70,
  deliveryOutside: 130,
  freeDeliveryThreshold: 3000,
  deliveryTimeDhaka: "24 - 48 Hours",
  deliveryTimeOutside: "3 - 5 Business Days",
  socialWhatsapp: "https://wa.me/8801731214379",
  socialFacebook: "https://facebook.com/shoilpikkabbo",
  socialMessenger: "https://m.me/shoilpikkabbo",
  socialYoutube: "https://youtube.com/@shoilpikkabbo",
  socialInstagram: "https://instagram.com/shoilpikkabbo",
  officeAddress: "House 12, Road 4, Sector 3, Uttara, Dhaka - 1230, Bangladesh",
  officeHours: "Saturday - Thursday: 9:00 AM - 8:00 PM",
  headerAnnouncement: "Free delivery nationwide on orders above ৳3,000 | Authentic Bengali Craftsmanship",
  headerAnnouncementEnabled: true,
  logoUrl: "",
  paymentInstructionsNote: "Send payment via Send Money or Make Payment. Paste your TrxID in the box below to authorize fulfillment.",
  raw: {},
};

interface SettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (updates: Record<string, string>) => Promise<{ success: boolean; message?: string }>;
}

const SettingsContext = React.createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const parseSettings = (data: Record<string, string>): SiteSettings => {
    return {
      storeName: data["store_name"] || DEFAULT_SETTINGS.storeName,
      tagline: data["tagline"] || DEFAULT_SETTINGS.tagline,
      storeNameBn: data["store_name_bn"] || DEFAULT_SETTINGS.storeNameBn,
      taglineBn: data["tagline_bn"] || DEFAULT_SETTINGS.taglineBn,
      contactPrimary: data["contact_primary"] || DEFAULT_SETTINGS.contactPrimary,
      contactSecondary: data["contact_secondary"] || DEFAULT_SETTINGS.contactSecondary,
      contactEmail: data["contact_email"] || DEFAULT_SETTINGS.contactEmail,
      contactPayment: data["contact_payment"] || data["payment_bkash_number"] || DEFAULT_SETTINGS.contactPayment,
      paymentBkashNumber: data["payment_bkash_number"] || DEFAULT_SETTINGS.paymentBkashNumber,
      paymentNagadNumber: data["payment_nagad_number"] || DEFAULT_SETTINGS.paymentNagadNumber,
      paymentRocketNumber: data["payment_rocket_number"] || DEFAULT_SETTINGS.paymentRocketNumber,
      bankName: data["bank_name"] || DEFAULT_SETTINGS.bankName,
      bankAccountName: data["bank_account_name"] || DEFAULT_SETTINGS.bankAccountName,
      bankAccountNumber: data["bank_account_number"] || DEFAULT_SETTINGS.bankAccountNumber,
      bankBranch: data["bank_branch"] || DEFAULT_SETTINGS.bankBranch,
      deliveryDhaka: Number(data["delivery_dhaka"]) || DEFAULT_SETTINGS.deliveryDhaka,
      deliveryOutside: Number(data["delivery_outside"]) || DEFAULT_SETTINGS.deliveryOutside,
      freeDeliveryThreshold: Number(data["free_delivery_threshold"]) || DEFAULT_SETTINGS.freeDeliveryThreshold,
      deliveryTimeDhaka: data["delivery_time_dhaka"] || DEFAULT_SETTINGS.deliveryTimeDhaka,
      deliveryTimeOutside: data["delivery_time_outside"] || DEFAULT_SETTINGS.deliveryTimeOutside,
      socialWhatsapp: data["social_whatsapp"] || DEFAULT_SETTINGS.socialWhatsapp,
      socialFacebook: data["social_facebook"] || DEFAULT_SETTINGS.socialFacebook,
      socialMessenger: data["social_messenger"] || DEFAULT_SETTINGS.socialMessenger,
      socialYoutube: data["social_youtube"] || DEFAULT_SETTINGS.socialYoutube,
      socialInstagram: data["social_instagram"] || DEFAULT_SETTINGS.socialInstagram,
      officeAddress: data["office_address"] || DEFAULT_SETTINGS.officeAddress,
      officeHours: data["office_hours"] || DEFAULT_SETTINGS.officeHours,
      headerAnnouncement: data["header_announcement"] || DEFAULT_SETTINGS.headerAnnouncement,
      headerAnnouncementEnabled: data["header_announcement_enabled"] !== "false",
      logoUrl: data["store_logo_url"] || "",
      paymentInstructionsNote: data["payment_instructions_note"] || DEFAULT_SETTINGS.paymentInstructionsNote,
      raw: data,
    };
  };

  const refreshSettings = React.useCallback(async () => {
    try {
      const res = await settingsApi.getAll();
      if (res.success && res.data) {
        setSettings(parseSettings(res.data as Record<string, string>));
      }
    } catch (err) {
      console.warn("Failed to fetch live settings, using current defaults:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  const updateSettings = async (updates: Record<string, string>) => {
    try {
      const res = await settingsApi.update(updates);
      if (res.success && res.data) {
        setSettings(parseSettings(res.data as Record<string, string>));
        return { success: true, message: "Settings updated successfully." };
      }
      return { success: false, message: res.message || "Failed to update settings." };
    } catch (err: any) {
      return { success: false, message: err?.message || "Network error while saving settings." };
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, isLoading, refreshSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
