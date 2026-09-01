"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, Mail } from "lucide-react";
import { Enquiry, PaginationMeta, ENQUIRY_STATUSES } from "@/types";
import { getAdminEnquiries, updateEnquiryStatus } from "@/services/admin";
import { useToast } from "@/components/ui/Toast";
import { Input, Select } from "@/components/ui/form";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState, Skeleton } from "@/components/ui/Feedback";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/utils";

export default function AdminEnquiriesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState<Enquiry[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    setLoading(true);
    getAdminEnquiries({ q: q || undefined, status: status || undefined, page })
      .then((res) => {
        setItems(res.enquiries);
        setMeta(res.pagination);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [q, status, page]);

  useEffect(() => {
    load();
  }, [load]);

  async function changeStatus(item: Enquiry, next: string) {
    try {
      await updateEnquiryStatus(item.id, next);
      toast(`Status updated to ${next}.`, "success");
      load();
    } catch {
      toast("Action failed.", "error");
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-brand-950">Enquiries</h2>
        <p className="text-sm text-brand-500">Messages from visitors about listings and the business.</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-52 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-300" />
              <Input
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
                placeholder="Search enquiries…"
                className="pl-9"
              />
            </div>
            <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-44">
              <option value="">All statuses</option>
              {ENQUIRY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState title="No enquiries" description="Enquiries from visitors will appear here." />
      ) : (
        <>
          <div className="space-y-3">
            {items.map((enq) => (
              <Card key={enq.id}>
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <button onClick={() => router.push(`/admin/enquiries/${enq.id}`)} className="min-w-0 text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-brand-950 hover:text-brand-700">{enq.name}</span>
                        {enq.listing && <Badge tone="slate">{enq.listing.title}</Badge>}
                        <Badge tone="blue">{enq.source}</Badge>
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-brand-500">
                        <Mail className="h-3.5 w-3.5" /> {enq.email} · {formatDateTime(enq.created_at)}
                      </p>
                    </button>
                    <Select value={enq.status} onChange={(e) => changeStatus(enq, e.target.value)} className="w-36">
                      {ENQUIRY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </Select>
                  </div>
                  {enq.message && <p className="mt-3 line-clamp-2 text-sm text-brand-600">{enq.message}</p>}
                  <button
                    onClick={() => router.push(`/admin/enquiries/${enq.id}`)}
                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline"
                  >
                    View <ChevronRight className="h-4 w-4" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
          {meta && meta.last_page > 1 && <Pagination meta={meta} onPageChange={setPage} className="mt-6" />}
        </>
      )}
    </div>
  );
}