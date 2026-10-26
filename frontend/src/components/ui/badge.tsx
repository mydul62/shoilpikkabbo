import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "primary"
    | "gold"
    | "success"
    | "warning"
    | "danger"
    | "outline";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-sand text-charcoal-800",
    primary: "bg-forest-100 text-forest-800 font-medium",
    gold: "bg-gold-100 text-gold-700 border border-gold-600/30 font-semibold",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium",
    warning: "bg-amber-50 text-amber-800 border border-amber-200 font-medium",
    danger: "bg-rose-50 text-rose-800 border border-rose-200 font-medium",
    outline: "border border-sand-dark text-charcoal-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
