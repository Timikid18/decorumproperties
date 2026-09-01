import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-8 flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-2 text-sm font-bold uppercase tracking-wide text-accent-600">{eyebrow}</p>}
        <h2 className="font-display text-2xl font-bold tracking-tight text-brand-950 sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 text-brand-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}