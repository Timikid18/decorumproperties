"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight } from "lucide-react";
import { SellRequest, PaginationMeta, SELL_REQUEST_STATUSES } from "@/types";
import { getAdminSellRequests, updateSellRequestStatus } from "@/services/admin";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/form";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState, Skeleton } from "@/components/ui/Feedback";
import { ConditionBadge, Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { formatDate, formatPrice } from "@/lib/utils";

export default function AdminSellRequestsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState<SellRequest[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    setLoading(true);
    getAdminSellRequests({ q: q || undefined, status: status || undefined, page, per_page: 15 })
      .then((res) => {
        setItems(res.submissions);
        setMeta(res.pagination);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [q, status, page]);

  useEffect(() => {
    load();
  }, [load]);

  async function changeStatus(item: SellRequest, next: string) {
    try {
      await updateSellRequestStatus(item.id, next);
      toast(`Status updated to ${next}.`, "success");
      load();
    } catch {
      toast("Action failed.", "error");
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink">Sell Requests</h2>
        <p className="text-sm text-brand-500">Items customers want to sell to DECORUM.</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-52 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-300" />
              <Input
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
                placeholder="Search sell requests…"
                className="pl-9"
              />
            </div>
            <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-44">
              <option value="">All statuses</option>
              {SELL_REQUEST_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="No sell requests" description="Customer sell submissions will appear here." />
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => router.push(`/admin/sell-requests/${item.id}`)}
                          className="text-left font-bold text-ink hover:text-brand-700"
                        >
                          {item.item_title}
                        </button>
                        <Badge tone="slate">{item.category_name ?? item.listing_type}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-brand-500">
                        {item.name} · {item.phone || item.whatsapp || item.email || "No contact"} · {formatDate(item.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-ink">{formatPrice(item.asking_price)}</span>
                      <Select
                        value={item.status}
                        onChange={(e) => changeStatus(item, e.target.value)}
                        className="w-36"
                      >
                        {SELL_REQUEST_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </Select>
                    </div>
                  </div>
                  {item.description && (
                    <p className="mt-3 line-clamp-2 text-sm text-brand-600">{item.description}</p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-brand-100 pt-3">
                    <ConditionBadge condition={item.condition} />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/sell-requests/${item.id}`)}
                    >
                      View details <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {meta && meta.last_page > 1 && (
            <Pagination meta={meta} onPageChange={setPage} className="mt-6" />
          )}
        </>
      )}
    </div>
  );
}