"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "whatsapp";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-800 text-white hover:bg-brand-900 focus-visible:outline-brand-800 border border-transparent shadow-sm",
  secondary:
    "bg-brand-50 text-ink hover:bg-brand-100 border border-brand-200 focus-visible:outline-brand-500",
  outline:
    "bg-surface text-ink border border-brand-200 hover:border-brand-300 hover:bg-brand-50 focus-visible:outline-brand-500",
  ghost:
    "bg-transparent text-ink hover:bg-brand-50 border border-transparent focus-visible:outline-brand-500",
  danger:
    "bg-accent-600 text-white hover:bg-accent-700 border border-transparent focus-visible:outline-accent-600 shadow-sm",
  whatsapp:
    "bg-[#25D366] text-white hover:bg-[#1fb457] border border-transparent focus-visible:outline-[#25D366] shadow-sm",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2.5 py-3.5",
  icon: "h-10 w-10",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-semibold transition-colors",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          "disabled:pointer-events-none disabled:opacity-55",
          variants[variant],
          sizes[size],
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";