"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, MapPin, MessageCircle } from "lucide-react";
import type { Listing } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useToast } from "@/components/ui/Toast";
import { Card } from "@/components/ui/Card";
import { Badge, ConditionBadge } from "@/components/ui/Badge";
import { addFavorite, removeFavorite } from "@/services/favorites";
import { apiErrorMessage } from "@/lib/api";
import { cn, buildWhatsAppLink, formatPrice } from "@/lib/utils";

const typeLabel: Record<string, string> = {
  property: "Property",
  land: "Land",
  automobile: "Vehicle",
  gadget: "Gadget",
  appliance: "Appliance",
  furniture: "Furniture",
  electronics: "Electronics",
  other: "Item",
};

function PlaceholderImage({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-brand-50 text-4xl font-bold text-brand-200",
        className,
      )}
    >
      D
    </div>
  );
}

export function ListingImage({
  url,
  alt,
  sizes,
  priority,
}: {
  url: string | null;
  alt: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!url) return <PlaceholderImage />;
  return (
    <Image
      src={url}
      alt={alt}
      fill
      sizes={sizes ?? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
      className="object-cover"
      priority={priority}
    />
  );
}

export function WishlistButton({ listing }: { listing: Listing }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const isFav = listing.is_favorited;

  async function toggle() {
    if (!isAuthenticated || !user) {
      toast("Please sign in to save items to your wishlist.", "info");
      router.push("/auth/login");
      return;
    }
    try {
      if (isFav) {
        await removeFavorite(listing.id);
        toast("Removed from wishlist.", "success");
      } else {
        await addFavorite(listing.id);
        toast("Saved to your wishlist.", "success");
      }
      router.refresh();
    } catch (err) {
      toast(apiErrorMessage(err), "error");
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 shadow-sm transition-all hover:scale-105"
    >
      <Heart
        className={cn(
          "h-5 w-5",
          isFav ? "fill-accent-500 text-accent-500" : "text-brand-700",
        )}
      />
    </button>
  );
}

export function ListingCard({ listing }: { listing: Listing }) {
  const { settings } = useSiteSettings();
  const wa = settings.whatsapp_links?.[0] ?? settings.whatsapp?.[0] ?? "";
  const waMessage = encodeURIComponent(
    `Hello, I am interested in "${listing.title}" listed on ${settings.business_name ?? "DECORUM"}. Please provide more details.`,
  );

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-card-hover">
      <Link href={`/listing/${listing.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-brand-50">
        <ListingImage url={listing.main_image} alt={listing.title} />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          <Badge tone="brand" className="bg-brand-800 text-white">
            {typeLabel[listing.listing_type] ?? "Item"}
          </Badge>
        </div>
        {listing.is_featured && (
          <span className="absolute right-3 top-3 rounded-md bg-accent-600 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
            Featured
          </span>
        )}
        <div className="absolute bottom-3 right-3">
          <WishlistButton listing={listing} />
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/listing/${listing.slug}`} className="block">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-ink transition-colors group-hover:text-brand-700">
            {listing.title}
          </h3>
        </Link>
        <div className="mt-2 flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-ink">
              {formatPrice(listing.price, listing.currency)}
            </p>
            {listing.is_price_negotiable && (
              <p className="text-xs font-medium text-brand-400">Negotiable</p>
            )}
          </div>
          <ConditionBadge condition={listing.condition ?? listing.category?.name} />
        </div>
        <div className="mt-3 flex items-center gap-1 text-sm text-brand-400">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">{listing.location || listing.state || "Nigeria"}</span>
        </div>

        <div className="mt-3 flex items-center gap-2 border-t border-brand-100 pt-3">
          <Link
            href={`/listing/${listing.slug}`}
            className="flex-1 rounded-md bg-brand-50 py-2 text-center text-sm font-semibold text-ink transition-colors hover:bg-brand-100"
          >
            View Details
          </Link>
          {wa && (
            <a
              href={buildWhatsAppLink(wa, waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[#25D366]/10 px-3 py-2 text-sm font-semibold text-[#128C4A] transition-colors hover:bg-[#25D366]/20"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}