import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "accent" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-800/20 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-forest-800 text-white hover:bg-forest-700 shadow-sm shadow-forest-950/10",
      secondary:
        "bg-forest-100 text-forest-800 hover:bg-forest-200 font-semibold",
      outline:
        "border border-forest-800 text-forest-800 hover:bg-forest-50 hover:border-forest-700",
      accent:
        "bg-gold-600 text-white hover:bg-gold-700 shadow-sm shadow-gold-700/20 font-semibold",
      ghost:
        "text-charcoal-700 hover:bg-sand hover:text-charcoal-900",
      danger:
        "bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-950/10",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
      icon: "h-10 w-10 p-0 shrink-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
