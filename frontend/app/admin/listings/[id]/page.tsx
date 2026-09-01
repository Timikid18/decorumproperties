"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Listing } from "@/types";
import { getAdminListing, deleteAdminListing } from "@/services/admin";
import { ListingForm } from "@/components/admin/ListingForm";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Feedback";
import { Card, CardContent } from "@/components/ui/Card";
import { formatDate, formatPrice } from "@/lib/utils";
import { ConditionBadge, StatusBadge } from "@/components/ui/Badge";

export default function AdminListingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    getAdminListing(Number(params.id))
      .then(setListing)
      .catch(() => setListing(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function remove() {
    if (!listing) return;
    if (!window.confirm(`Delete "${listing.title}"? This can be undone.`)) return;
    try {
      await deleteAdminListing(listing.id);
      toast("Listing deleted.", "success");
      router.push("/admin/listings");
    } catch {
      toast("Unable to delete listing.", "error");
    }
  }

  if (loading) return <Spinner />;
  if (!listing) {
    return (
      <div className="py-16 text-center">
        <p className="text-brand-500">Listing not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/listings")}>Back</Button>
      </div>
    );
  }

  if (editMode) {
    return (
      <div className="mx-auto max-w-3xl">
        <Button variant="ghost" size="sm" onClick={() => setEditMode(false)}>← Cancel editing</Button>
        <ListingForm existing={listing} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/listings")}>← Back</Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditMode(true)}>Edit</Button>
          <Button variant="danger" onClick={remove}>Delete</Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-display text-2xl font-bold text-brand-950">{listing.title}</h2>
        <StatusBadge status={listing.status} />
        <ConditionBadge condition={listing.condition} />
      </div>

      <Card>
        <CardContent>
          <dl className="grid gap-3 text-sm sm:grid-cols-3">
            {[
              ["Price", formatPrice(listing.price, listing.currency)],
              ["Type", listing.listing_type],
              ["Category", listing.category?.name ?? "—"],
              ["Location", listing.location || listing.state || "—"],
              ["Featured", listing.is_featured ? "Yes" : "No"],
              ["Views", String(listing.views)],
              ["Created", formatDate(listing.created_at)],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-brand-100 pb-2">
                <dt className="text-xs uppercase tracking-wide text-brand-400">{label}</dt>
                <dd className="font-medium text-brand-900">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {listing.description && (
        <Card>
          <CardContent>
            <h3 className="mb-2 font-bold text-brand-950">Description</h3>
            <p className="whitespace-pre-line text-sm text-brand-700">{listing.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}