"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Search, UserRound } from "lucide-react";
import { User, PaginationMeta } from "@/types";
import { getAdminUsers, toggleUserStatus } from "@/services/admin";
import { useToast } from "@/components/ui/Toast";
import { Input } from "@/components/ui/form";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState, Skeleton } from "@/components/ui/Feedback";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { formatDate, initials } from "@/lib/utils";

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    setLoading(true);
    getAdminUsers({ q: q || undefined, page })
      .then((res) => {
        setItems(res.users);
        setMeta(res.pagination);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [q, page]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggle(item: User) {
    try {
      await toggleUserStatus(item.id);
      toast(`User ${item.status === "active" ? "disabled" : "enabled"}.`, "success");
      load();
    } catch {
      toast("Unable to change user status.", "error");
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink">Users</h2>
        <p className="text-sm text-brand-500">Manage marketplace accounts.</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative min-w-52 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-300" />
            <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search by name or email…" className="pl-9" />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <>
          <div className="space-y-3">
            {items.map((u) => (
              <Card key={u.id}>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-ink">
                        {u.avatar ? <Image src={u.avatar} alt={u.name} width={40} height={40} className="h-10 w-10 rounded-full object-cover" /> : u.name ? initials(u.name) : <UserRound className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-ink">{u.name}</p>
                        <p className="text-sm text-brand-500">{u.email} · Joined {formatDate(u.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        {u.roles?.map((r) => <Badge key={r} tone={r === "super-admin" ? "red" : r === "admin" ? "brand" : "slate"}>{r}</Badge>)}
                      </div>
                      <button
                        onClick={() => toggle(u)}
                        className={`rounded-md px-2.5 py-1 text-xs font-semibold ${u.status === "active" ? "text-accent-600 hover:bg-accent-50" : "text-emerald-600 hover:bg-emerald-50"}`}
                      >
                        {u.status === "active" ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </div>
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