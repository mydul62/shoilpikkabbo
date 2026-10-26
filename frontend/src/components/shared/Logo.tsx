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

  return (
    <Link
      href={variant === "admin" ? "/admin" : "/"}
      className={cn("flex items-center gap-3 group select-none", className)}
    >
      {/* Monogram Badge */}
      <div
        className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center font-heading font-black text-lg transition-transform duration-200 group-hover:scale-105 shadow-sm",
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
            "font-heading font-extrabold tracking-wider leading-none text-base",
            isLight ? "text-white" : "text-forest-950"
          )}
        >
          SHOILPIKKABBO
        </span>
        {showTagline && (
          <span
            className={cn(
              "text-[10px] uppercase font-medium tracking-widest mt-1",
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
