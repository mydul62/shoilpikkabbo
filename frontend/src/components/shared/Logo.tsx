import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
  const isLight = variant === "light";
  const isAdmin = variant === "admin";

  if (variant === "storefront") {
    return (
      <Link
        href="/"
        className={cn("flex flex-col group select-none transition-opacity hover:opacity-95", className)}
      >
        <span className="font-serif font-normal text-[26px] sm:text-[28px] tracking-[0.04em] text-[#143527] leading-none">
          SHOILPIKKABBO
        </span>
        {showTagline && (
          <span className="text-[10.5px] text-[#6A736C] tracking-[0.06em] font-normal mt-1.5">
            Delivery • Quality • Reliability
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
      {/* Monogram Badge for Admin */}
      <div
        className={cn(
          "h-9 w-9 rounded-lg flex items-center justify-center font-heading font-black text-base transition-transform duration-200 group-hover:scale-105 shadow-sm",
          isLight
            ? "bg-white text-forest-900 border border-gold-500/40"
            : "bg-forest-800 text-gold-500 border border-gold-600/30"
        )}
      >
        <span>SK</span>
      </div>

      {/* Brand Text & Tagline */}
      <div className="flex flex-col">
        <span
          className={cn(
            "font-heading font-bold tracking-wider leading-none text-base",
            isLight ? "text-white" : "text-forest-950"
          )}
        >
          SHOILPIKKABBO
        </span>
        {showTagline && (
          <span
            className={cn(
              "text-[9px] uppercase font-medium tracking-widest mt-1",
              isLight ? "text-gold-100/80" : "text-charcoal-500"
            )}
          >
            Delivery • Quality • Reliability
          </span>
        )}
      </div>
    </Link>
  );
}
