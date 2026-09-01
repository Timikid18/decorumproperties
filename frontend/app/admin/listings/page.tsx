"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Search, Plus } from "lucide-react";
import { Listing, PaginationMeta } from "@/types";
import {
  getAdminListings,
  toggleFeatured,
  markListingStatus,
} from "@/services/admin";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/form";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState, Skeleton } from "@/components/ui/Feedback";
import { Card, CardContent } from "@/components/ui/Card";
import { formatDate, formatPrice } from "@/lib/utils";
import { LISTING_STATUS_OPTIONS } from "@/types";

const TYPE_LABEL: Record<string, string> = {
  property: "Property",
  land: "Land",
  automobile: "Vehicle",
  gadget: "Gadget",
  appliance: "Appliance",
  furniture: "Furniture",
  electronics: "Electronics",
  other: "Other",
};

export default function AdminListingsPage() {
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    setLoading(true);
    getAdminListings({ q: q || undefined, status: status || undefined, page, per_page: 15 })
      .then((res) => {
        setListings(res.listings);
        setMeta(res.pagination);
      })
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, [q, status, page]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleFeature(item: Listing) {
    try {
      const isFeatured = await toggleFeatured(item.id);
      toast(isFeatured ? "Featured." : "Unfeatured.", "success");
      load();
    } catch {
      toast("Action failed. Check your permissions.", "error");
    }
  }

  async function changeStatus(item: Listing, next: string) {
    try {
      await markListingStatus(item.id, next);
      toast(`Status updated to ${next}.`, "success");
      load();
    } catch {
      toast("Action failed.", "error");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Listings</h2>
          <p className="text-sm text-brand-500">{meta ? `${meta.total} listings` : "Manage your listings"}</p>
        </div>
        <Link href="/admin/listings/new">
          <Button><Plus className="h-4 w-4" /> New Listing</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-52 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-300" />
              <Input
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
                placeholder="Search listings…"
                className="pl-9"
              />
            </div>
            <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-44">
              <option value="">All statuses</option>
              {LISTING_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : listings.length === 0 ? (
        <EmptyState title="No listings found" description="Adjust your search or create a new listing." />
      ) : (
        <>
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-brand-100 text-sm">
                <thead className="bg-brand-50/60">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-brand-400">
                    <th className="px-5 py-3">Listing</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Price</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Featured</th>
                    <th className="px-5 py-3">Created</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100">
                  {listings.map((item) => (
                    <tr key={item.id} className="hover:bg-brand-50/40">
                      <td className="px-5 py-3">
                        <Link href={`/admin/listings/${item.id}`} className="font-semibold text-ink hover:text-brand-700">
                          {item.title}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-brand-600">{TYPE_LABEL[item.listing_type] ?? item.listing_type}</td>
                      <td className="px-5 py-3 font-medium text-ink">{formatPrice(item.price, item.currency)}</td>
                      <td className="px-5 py-3">
                        <Select
                          value={item.status}
                          onChange={(e) => changeStatus(item, e.target.value)}
                          className="w-36"
                        >
                          {LISTING_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </Select>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => toggleFeature(item)}
                          className={item.is_featured ? "text-amber-500" : "text-brand-200 hover:text-amber-400"}
                          aria-label="Toggle featured"
                        >
                          ★
                        </button>
                      </td>
                      <td className="px-5 py-3 text-brand-500">{formatDate(item.created_at)}</td>
                      <td className="px-5 py-3 text-right">
                        <Link href={`/admin/listings/${item.id}`} className="inline-flex items-center gap-1 font-medium text-brand-700 hover:underline">
                          View <ChevronRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {meta && meta.last_page > 1 && (
              <div className="border-t border-brand-100 p-4">
                <Pagination meta={meta} onPageChange={setPage} />
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}