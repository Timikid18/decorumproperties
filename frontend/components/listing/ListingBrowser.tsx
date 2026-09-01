"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Listing, ListingFilters, PaginationMeta, SortOption } from "@/types";
import { ListingCard } from "@/components/listing/ListingCard";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState, Skeleton } from "@/components/ui/Feedback";
import { Input, Select, Label } from "@/components/ui/form";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface BrowseConfig {
  fetchPage: (filters: ListingFilters) => Promise<{ listings: Listing[]; pagination: PaginationMeta }>;
  basePath: string;
  title: string;
  subtitle?: string;
  showCondition?: boolean;
  showVehicleFilters?: boolean;
  showPropertyFilters?: boolean;
}

const initialFilters: ListingFilters = {
  q: "",
  category: "",
  location: "",
  condition: "",
  min_price: "",
  max_price: "",
  sort: "newest",
  page: 1,
};

export function ListingBrowser({ config }: { config: BrowseConfig }) {
  const [filters, setFilters] = useState<ListingFilters>(initialFilters);
  const [data, setData] = useState<Listing[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFilters = Object.fromEntries(params.entries());
    setFilters((prev) => ({ ...prev, ...urlFilters, page: Number(urlFilters.page) || 1 }));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    config
      .fetchPage(filters)
      .then((res) => {
        if (cancelled) return;
        setData(res.listings);
        setMeta(res.pagination);
      })
      .catch(() => {
        if (!cancelled) {
          setData([]);
          setMeta(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [config, filters]);

  const update = (patch: Partial<ListingFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch, page: 1 }));
  };

  const goToPage = (page: number) => setFilters((prev) => ({ ...prev, page }));

  const clearAll = () => setFilters(initialFilters);

  const selectedCount = useMemo(
    () =>
      Object.entries(filters).filter(
        ([k, v]) => v !== "" && v !== undefined && !["q", "page", "sort"].includes(k),
      ).length,
    [filters],
  );

  const filterPanel = (
    <div className="space-y-5">
      <div>
        <Label>Search</Label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-300" />
          <Input
            value={filters.q ?? ""}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Search by keyword…"
            className="pl-9"
          />
        </div>
      </div>

      <div>
        <Label>Location</Label>
        <Input
          value={filters.location ?? ""}
          onChange={(e) => update({ location: e.target.value })}
          placeholder="e.g. Abeokuta, Lagos"
        />
      </div>

      {config.showPropertyFilters && (
        <>
          <div>
            <Label>Property Type</Label>
            <Select value={filters.property_type ?? ""} onChange={(e) => update({ property_type: e.target.value })}>
              <option value="">Any</option>
              <option value="land">Land</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="commercial">Commercial</option>
            </Select>
          </div>
          <div>
            <Label>Bedrooms (min)</Label>
            <Select value={String(filters.bedrooms ?? "")} onChange={(e) => update({ bedrooms: e.target.value ? Number(e.target.value) : undefined })}>
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </Select>
          </div>
        </>
      )}

      {config.showVehicleFilters && (
        <div>
          <Label>Transmission</Label>
          <Select value={filters.transmission ?? ""} onChange={(e) => update({ transmission: e.target.value })}>
            <option value="">Any</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </Select>
        </div>
      )}

      {config.showCondition && (
        <div>
          <Label>Condition</Label>
          <Select value={filters.condition ?? ""} onChange={(e) => update({ condition: e.target.value })}>
            <option value="">Any</option>
            <option value="Brand New">Brand New</option>
            <option value="Like New">Like New</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fairly Used">Fairly Used</option>
            <option value="Used">Used</option>
          </Select>
        </div>
      )}

      <div>
        <Label>Price Range</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={filters.min_price ?? ""}
            onChange={(e) => update({ min_price: e.target.value })}
            placeholder="Min"
          />
          <span className="text-brand-400">–</span>
          <Input
            type="number"
            value={filters.max_price ?? ""}
            onChange={(e) => update({ max_price: e.target.value })}
            placeholder="Max"
          />
        </div>
      </div>

      <Button variant="outline" size="sm" className="w-full" onClick={clearAll}>
        <X className="h-4 w-4" /> Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">{config.title}</h1>
        {config.subtitle && <p className="mt-2 text-brand-500">{config.subtitle}</p>}
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Desktop filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-lg border border-brand-100 bg-surface p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </h2>
            {filterPanel}
          </div>
        </aside>

        {/* Results */}
        <div>
          {/* Toolbar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-brand-500">
              {meta ? `${meta.total} ${meta.total === 1 ? "result" : "results"}` : "Loading…"}
            </p>
            <div className="flex items-center gap-2">
              <button
                className="lg:hidden inline-flex items-center gap-1.5 rounded-md border border-brand-200 px-3 py-2 text-sm font-medium text-ink"
                onClick={() => setMobileFilters(true)}
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
              <Select
                value={filters.sort}
                onChange={(e) => update({ sort: e.target.value as SortOption })}
                className="w-44"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="featured">Featured</option>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <EmptyState
              title="No listings found"
              description="Try adjusting your filters or search terms to find what you're looking for."
              action={<Button onClick={clearAll}>Clear Filters</Button>}
            />
          ) : (
            <>
              <div className={cn("grid gap-5 sm:grid-cols-2 xl:grid-cols-3")}>
                {data.map((l) => <ListingCard key={l.id} listing={l} />)}
              </div>
              {meta && meta.last_page > 1 && (
                <Pagination meta={meta} onPageChange={goToPage} className="mt-10" />
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filters drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-brand-950/50" onClick={() => setMobileFilters(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-surface p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-ink">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setMobileFilters(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            {filterPanel}
            <Button className="mt-5 w-full" onClick={() => setMobileFilters(false)}>
              Show {selectedCount > 0 ? `${selectedCount} ` : ""}Results
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}