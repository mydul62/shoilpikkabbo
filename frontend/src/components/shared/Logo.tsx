"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContext";

interface LogoProps {
  variant?: "storefront" | "admin" | "light";
  className?: string;
  showTagline?: boolean;
}

export function Logo({
  variant = "storefront",
  className,
  showTagline = true,
}: LogoProps) {
  const { settings } = useSettings();
  const isLight = variant === "light";
  const isAdmin = variant === "admin";

  const storeName = settings.storeName || "SHOILPIKKABBO";
  const tagline = settings.tagline || "Delivery • Quality • Reliability";
  const initials = storeName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "SK";

  if (variant === "storefront") {
    return (
      <Link
        href="/"
        className={cn("flex flex-col group select-none transition-opacity hover:opacity-95", className)}
      >
        {settings.logoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={settings.logoUrl}
            alt={storeName}
            className="h-10 sm:h-12 w-auto max-w-[240px] object-contain"
          />
        ) : (
          <span className="font-serif font-normal text-[26px] sm:text-[28px] tracking-[0.04em] text-[#143527] leading-none">
            {storeName}
          </span>
        )}
        {showTagline && (
          <span className="text-[10.5px] text-[#6A736C] tracking-[0.06em] font-normal mt-1.5">
            {tagline}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href={isAdmin ? "/admin" : "/"}
      className={cn("flex items-center gap-3 group select-none", className)}
    >
      {/* Monogram Badge or Mini Logo */}
      {settings.logoUrl ? (
        <div className="h-9 w-9 rounded-lg flex items-center justify-center p-0.5 bg-white shadow-xs overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={settings.logoUrl}
            alt={storeName}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ) : (
        <div
          className={cn(
            "h-9 w-9 rounded-lg flex items-center justify-center font-heading font-black text-base transition-transform duration-200 group-hover:scale-105 shadow-xs shrink-0",
            isLight
              ? "bg-white text-forest-900 border border-gold-500/40"
              : "bg-forest-800 text-gold-500 border border-gold-600/30"
          )}
        >
          <span>{initials}</span>
        </div>
      )}

      {/* Brand Text & Tagline */}
      <div className="flex flex-col">
        <span
          className={cn(
            "font-heading font-bold tracking-wider leading-none text-base",
            isLight ? "text-white" : "text-forest-950"
          )}
        >
          {storeName}
        </span>
        {showTagline && (
          <span
            className={cn(
              "text-[9px] uppercase font-medium tracking-widest mt-1",
              isLight ? "text-gold-100/80" : "text-charcoal-500"
            )}
          >
            {tagline}
          </span>
        )}
      </div>
    </Link>
  );
}
