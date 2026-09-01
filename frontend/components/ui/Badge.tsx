import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "brand" | "red" | "green" | "amber" | "slate" | "blue";

const tones: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-800 border-brand-200",
  red: "bg-accent-50 text-accent-700 border-accent-200",
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  slate: "bg-brand-50 text-brand-600 border-brand-200",
  blue: "bg-sky-50 text-sky-700 border-sky-200",
};

export function Badge({
  children,
  tone = "brand",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone: Tone =
    status === "available" || status === "active" || status === "accepted" || status === "resolved" || status === "purchased"
      ? "green"
      : status === "reserved" || status === "contacted" || status === "reviewing" || status === "in_progress"
        ? "amber"
        : status === "sold" || status === "rejected"
          ? "red"
          : status === "new" || status === "pending"
            ? "blue"
            : "slate";

  return <Badge tone={tone}>{labelFor(status)}</Badge>;
}

export function ConditionBadge({ condition }: { condition?: string | null }) {
  if (!condition) return null;
  const low = condition.toLowerCase();
  const tone: Tone =
    low === "brand new" || low === "like new" || low === "excellent"
      ? "green"
      : low === "good"
        ? "blue"
        : "amber";
  return <Badge tone={tone}>{condition}</Badge>;
}

function labelFor(status: string): string {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}