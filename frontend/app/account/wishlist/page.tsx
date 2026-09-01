"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { FavoriteItem } from "@/services/favorites";
import { getFavorites } from "@/services/favorites";
import { ListingCard } from "@/components/listing/ListingCard";
import { EmptyState, Spinner } from "@/components/ui/Feedback";

export default function WishlistPage() {
  const [items, setItems] = useState<FavoriteItem[] | null>(null);

  useEffect(() => {
    getFavorites()
      .then((res) => setItems(res.favorites))
      .catch(() => setItems([]));
  }, []);

  const listings = (items ?? []).filter(Boolean).map((f) => f.listing).filter(Boolean);

  return (
    <div>
      <h1 className="mb-6 flex items-center gap-2 font-display text-2xl font-bold text-brand-950">
        <Heart className="h-6 w-6 text-accent-500" /> My Wishlist
      </h1>
      {!items ? (
        <Spinner />
      ) : listings.length === 0 ? (
        <EmptyState
          title="Your wishlist is empty"
          description="Save listings you're interested in by tapping the heart icon on any item."
          action={
            <Link href="/listings" className="rounded-md bg-brand-800 px-4 py-2 text-sm font-semibold text-white">
              Browse listings
            </Link>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {listings.map((l) => <ListingCard key={l!.id} listing={l!} />)}
        </div>
      )}
    </div>
  );
}