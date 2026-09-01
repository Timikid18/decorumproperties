import type { ReactNode } from "react";
import type { PaginationMeta } from "@/types";
import { cn } from "@/lib/utils";

function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}

export function Pagination({
  meta,
  onPageChange,
  className,
}: {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  if (!meta || meta.last_page <= 1) return null;
  const currentPage = meta.current_page;
  const totalPages = meta.last_page;

  const link = (page: number, content: ReactNode, isCurrent: boolean, disabled?: boolean) => (
    <button
      key={page}
      type="button"
      disabled={disabled}
      onClick={() => onPageChange(page)}
      className={cn(
        "min-w-9 h-9 px-2 text-sm font-medium rounded-md border transition-colors",
        isCurrent
          ? "bg-brand-800 border-brand-800 text-white"
          : "bg-white border-brand-200 text-brand-800 hover:border-brand-400",
        disabled && "pointer-events-none opacity-40",
      )}
    >
      {content}
    </button>
  );

  return (
    <nav className={cn("flex flex-wrap items-center justify-center gap-1.5", className)} aria-label="Pagination">
      {link(currentPage - 1, "‹", false, currentPage === 1)}
      {pageList(currentPage, totalPages).map((p) =>
        p === "…" ? (
          <span key={p} className="px-1 text-brand-400">
            …
          </span>
        ) : (
          link(p, p, p === currentPage)
        ),
      )}
      {link(currentPage + 1, "›", false, currentPage === totalPages)}
    </nav>
  );
}