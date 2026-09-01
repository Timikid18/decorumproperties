import type { ReactNode } from "react";
import { Loader2, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ className, label }: { className?: string; label?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-16 text-brand-400", className)}>
      <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
      {label && <p className="text-sm font-medium">{label}</p>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-brand-100", className)} />;
}

export function EmptyState({
  title,
  description,
  action,
  icon = <SearchX className="h-10 w-10 text-brand-300" aria-hidden />,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-brand-200 bg-brand-50/50 px-6 py-16 text-center">
      {icon}
      <h3 className="text-base font-bold text-brand-900">{title}</h3>
      {description && <p className="max-w-sm text-sm text-brand-500">{description}</p>}
      {action}
    </div>
  );
}