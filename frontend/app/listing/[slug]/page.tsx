"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  MapPin,
  Eye,
  CalendarDays,
  MessageCircle,
  Upload,
  Check,
  ChevronLeft,
  ChevronRight,
  Share2,
} from "lucide-react";
import { Listing } from "@/types";
import { getListingBySlug } from "@/services/listings";
import { submitEnquiry } from "@/services/enquiries";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { ListingImage, WishlistButton } from "@/components/listing/ListingCard";
import { Button } from "@/components/ui/Button";
import { Badge, ConditionBadge, StatusBadge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Feedback";
import { Input, Textarea, Label } from "@/components/ui/form";
import { buildWhatsAppLink, formatDate, formatPrice, titleCase } from "@/lib/utils";

const TYPE_LABEL: Record<string, string> = {
  property: "Property",
  land: "Land",
  automobile: "Vehicle",
  gadget: "Gadget",
  appliance: "Appliance",
  furniture: "Furniture",
  electronics: "Electronics",
  other: "Item",
};

export default function ListingDetailPage() {
  const params = useParams<{ slug: string }>();
  const { settings } = useSiteSettings();
  const { user } = useAuth();
  const { toast } = useToast();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [sending, setSending] = useState(false);
  const [enquiry, setEnquiry] = useState({ name: "", email: "", phone: "", message: "" });

  const images = listing?.images && listing.images.length > 0 ? listing.images : [];

  useEffect(() => {
    getListingBySlug(params.slug)
      .then((l) => {
        setListing(l);
        setEnquiry((prev) => ({
          ...prev,
          name: user?.name ?? "",
          email: user?.email ?? "",
        }));
      })
      .catch(() => setListing(null))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

  if (loading) return <Spinner label="Loading listing…" className="py-24" />;

  if (!listing) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-brand-950">Listing not found</h1>
        <p className="mt-2 text-brand-500">This listing may have been removed or is no longer available.</p>
        <Link href="/listings">
          <Button className="mt-6">Browse all listings</Button>
        </Link>
      </div>
    );
  }

  const wa = settings.whatsapp_links?.[0] ?? settings.whatsapp?.[0] ?? "";
  const waMessage = encodeURIComponent(
    `Hello, I am interested in "${listing.title}". Please provide more details.`,
  );

  const current = listing;

  async function handleEnquiry(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await submitEnquiry({
        listing_id: current.id,
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        message: enquiry.message,
        source: "listing",
      });
      toast("Your enquiry has been sent. We'll get back to you shortly.", "success");
      setEnquiry((prev) => ({ ...prev, message: "" }));
    } catch {
      toast("Something went wrong sending your enquiry.", "error");
    } finally {
      setSending(false);
    }
  }

  async function share() {
    try {
      await navigator.share({ title: current.title, url: window.location.href });
    } catch {
      toast("Link copied to clipboard.", "info");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <nav className="mb-6 flex items-center gap-1 text-sm text-brand-400" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-700">Home</Link>
        <span>/</span>
        <span className="text-brand-700">{TYPE_LABEL[listing.listing_type] ?? "Listing"}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        {/* Left: gallery */}
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-brand-50">
            <ListingImage
              url={images[activeImage]?.url ?? listing.main_image}
              alt={listing.title}
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
            {listing.is_featured && (
              <span className="absolute left-4 top-4 rounded-md bg-accent-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                Featured
              </span>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage((activeImage - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5 text-brand-800" />
                </button>
                <button
                  onClick={() => setActiveImage((activeImage + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5 text-brand-800" />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={i === activeImage ? "ring-2 ring-brand-600 rounded" : "opacity-70 hover:opacity-100 rounded"}
                >
                  <Image src={img.url} alt="" width={80} height={64} className="h-16 w-20 rounded object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="mt-8">
            <h2 className="mb-3 font-display text-xl font-bold text-brand-950">Description</h2>
            <div className="prose prose-brand max-w-none text-brand-700">
              <p className="whitespace-pre-line leading-relaxed">
                {listing.description || listing.short_description || "No description provided."}
              </p>
            </div>
          </div>

          {/* Features */}
          {listing.features && listing.features.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 font-display text-xl font-bold text-brand-950">Features</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {listing.features.map((f) => (
                  <li key={f.id} className="flex items-center gap-2 text-sm text-brand-700">
                    <Check className="h-4 w-4 text-emerald-500" /> {f.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications */}
          {listing.specifications && listing.specifications.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 font-display text-xl font-bold text-brand-950">Specifications</h2>
              <dl className="grid overflow-hidden rounded-lg border border-brand-100 sm:grid-cols-2">
                {listing.specifications.map((s) => (
                  <div key={s.id} className="border-b border-brand-100 bg-white px-4 py-3">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-brand-400">{s.label}</dt>
                    <dd className="mt-1 text-sm font-medium text-brand-900">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Property details */}
          {listing.property && (
            <div className="mt-8">
              <h2 className="mb-3 font-display text-xl font-bold text-brand-950">Property Details</h2>
              <dl className="grid overflow-hidden rounded-lg border border-brand-100 sm:grid-cols-3">
                {[
                  ["Type", titleCase(listing.property.property_type)],
                  ["Land Size", listing.property.land_size ? `${listing.property.land_size} ${listing.property.land_size_unit ?? "sqm"}` : "—"],
                  ["Bedrooms", listing.property.bedrooms ? String(listing.property.bedrooms) : "—"],
                  ["Bathrooms", listing.property.bathrooms ? String(listing.property.bathrooms) : "—"],
                  ["Purpose", listing.property.purpose ? titleCase(listing.property.purpose) : "—"],
                  ["Furnishing", listing.property.furnishing ? titleCase(listing.property.furnishing) : "—"],
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-brand-100 bg-white px-4 py-3">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-brand-400">{label}</dt>
                    <dd className="mt-1 text-sm font-medium text-brand-900">{value}</dd>
                  </div>
                ))}
              </dl>
              {listing.property.documents && listing.property.documents.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-brand-900">Available documents:</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {listing.property.documents.map((d, i) => (
                      <Badge key={i} tone="green">{d}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Automobile details */}
          {listing.automobile && (
            <div className="mt-8">
              <h2 className="mb-3 font-display text-xl font-bold text-brand-950">Vehicle Details</h2>
              <dl className="grid overflow-hidden rounded-lg border border-brand-100 sm:grid-cols-3">
                {[
                  ["Make", listing.automobile.make],
                  ["Model", listing.automobile.model],
                  ["Year", listing.automobile.year ? String(listing.automobile.year) : "—"],
                  ["Mileage", listing.automobile.mileage ? `${listing.automobile.mileage.toLocaleString()} km` : "—"],
                  ["Transmission", listing.automobile.transmission],
                  ["Fuel Type", listing.automobile.fuel_type],
                  ["Body Type", listing.automobile.body_type],
                  ["Colour", listing.automobile.color],
                  ["Engine", listing.automobile.engine_size],
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-brand-100 bg-white px-4 py-3">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-brand-400">{label}</dt>
                    <dd className="mt-1 text-sm font-medium text-brand-900">{value || "—"}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {/* Right: sidebar */}
        <aside className="space-y-6">
          <div className="rounded-lg border border-brand-100 bg-white p-6 shadow-card sticky top-24">
            <div className="flex items-center justify-between">
              <StatusBadge status={listing.status} />
              <div className="flex gap-2">
                <WishlistButton listing={listing} />
                <button
                  onClick={share}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-colors hover:bg-brand-100"
                  aria-label="Share"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <h1 className="mt-3 font-display text-2xl font-bold leading-tight text-brand-950">
              {listing.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-brand-500">
              <ConditionBadge condition={listing.condition} />
              <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{listing.location || listing.state || "Nigeria"}</span>
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs text-brand-400">
              <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{listing.views} views</span>
              <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{formatDate(listing.created_at)}</span>
            </div>

            <div className="mt-5 border-t border-brand-100 pt-5">
              <p className="font-display text-3xl font-bold text-brand-800">
                {formatPrice(listing.price, listing.currency)}
              </p>
              {listing.is_price_negotiable && (
                <p className="mt-1 text-xs font-semibold text-emerald-600">Price is negotiable</p>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-2.5">
              {wa && (
                <a
                  href={buildWhatsAppLink(wa, waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1fb457]"
                >
                  <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                </a>
              )}
              <Button variant="outline" onClick={() => document.getElementById("enquiry-form")?.scrollIntoView({ behavior: "smooth" })}>
                <Upload className="h-4 w-4" /> Send an Enquiry
              </Button>
            </div>
          </div>

          {/* Enquiry form */}
          <div id="enquiry-form" className="rounded-lg border border-brand-100 bg-white p-6">
            <h2 className="mb-4 font-display text-lg font-bold text-brand-950">Send an Enquiry</h2>
            <form onSubmit={handleEnquiry} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" required value={enquiry.name} onChange={(e) => setEnquiry({ ...enquiry, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" required value={enquiry.email} onChange={(e) => setEnquiry({ ...enquiry, email: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={enquiry.phone} onChange={(e) => setEnquiry({ ...enquiry, phone: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea id="message" required rows={4} value={enquiry.message} onChange={(e) => setEnquiry({ ...enquiry, message: e.target.value })} placeholder="I'm interested in this listing…" />
              </div>
              <Button type="submit" className="w-full" loading={sending}>
                Submit Enquiry
              </Button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}