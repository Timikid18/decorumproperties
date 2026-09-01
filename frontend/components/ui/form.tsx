"use client";

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export { Select } from "@/components/ui/Select";

const baseField =
  "w-full rounded-md border border-brand-100 bg-surface px-3.5 py-2.5 text-sm text-ink shadow-none transition-colors placeholder:text-brand-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(baseField, className)} {...props} />
  ),
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(baseField, "min-h-28 resize-y", className)} {...props} />
  ),
);
Textarea.displayName = "Textarea";

export function Label({
  className,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1.5 block text-sm font-semibold text-ink", className)}
      {...props}
    >
      {children}
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs font-medium text-accent-600" role="alert">
      {message}
    </p>
  );
}

export function FormHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs text-brand-400">{children}</p>;
}