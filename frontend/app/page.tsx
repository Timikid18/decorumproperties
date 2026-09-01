"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Home as HomeIcon,
  Landmark,
  Car,
  Smartphone,
  Armchair,
  Wrench,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Handshake,
} from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Category, Listing } from "@/types";
import { getCategories, getFeaturedListings, getLatestListings } from "@/services/listings";
import { ListingCard } from "@/components/listing/ListingCard";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Feedback";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  property: <Landmark className="h-6 w-6" />,
  land: <Landmark className="h-6 w-6" />,
  automobile: <Car className="h-6 w-6" />,
  gadget: <Smartphone className="h-6 w-6" />,
  appliance: <Wrench className="h-6 w-6" />,
  furniture: <Armchair className="h-6 w-6" />,
};

export default function HomePage() {
  const { settings } = useSiteSettings();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [listingType, setListingType] = useState("");

  const [featured, setFeatured] = useState<Listing[] | null>(null);
  const [latest, setLatest] = useState<Listing[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getFeaturedListings(8)
      .then(setFeatured)
      .catch(() => setFeatured([]));
    getLatestListings(8)
      .then(setLatest)
      .catch(() => setLatest([]));
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const search = query.trim();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (listingType) params.set("listing_type", listingType);
    const qs = params.toString();
    router.push(`/listings${qs ? `?${qs}` : ""}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-950 text-white">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src="/hero.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-brand-950/90" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.15]">
            <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-brand-500 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-accent-500 blur-3xl" />
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <Sparkles className="h-3.5 w-3.5 text-accent-400" />
              {settings.slogan || "Buy. Sell. Own."}
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {settings.hero_headline || "Buy. Sell. Own. Declutter."}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-brand-200">
              {settings.hero_subheadline ||
                "From lands and homes to cars, gadgets, appliances and fairly used items — DECORUM makes buying and selling simple."}
            </p>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="mt-8 flex w-full max-w-2xl flex-col gap-3 rounded-xl bg-white p-3 shadow-xl sm:flex-row"
            >
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-brand-100 px-3">
                <Search className="h-5 w-5 text-brand-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search lands, homes, cars, gadgets…"
                  className="w-full bg-transparent py-3 text-sm text-brand-950 placeholder:text-brand-300 focus:outline-none"
                />
              </div>
              <select
                value={listingType}
                onChange={(e) => setListingType(e.target.value)}
                className="rounded-lg border border-brand-100 bg-white px-3 py-3 text-sm font-medium text-brand-800 focus:outline-none"
              >
                <option value="">All categories</option>
                <option value="property">Properties</option>
                <option value="land">Lands</option>
                <option value="automobile">Vehicles</option>
                <option value="gadget">Gadgets</option>
                <option value="appliance">Appliances</option>
                <option value="furniture">Furniture</option>
              </select>
              <Button type="submit" className="shrink-0">
                Search
              </Button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-brand-200">
              <Link href="/properties" className="font-semibold text-white hover:underline">Properties</Link>
              <span className="opacity-40">·</span>
              <Link href="/lands" className="font-semibold text-white hover:underline">Lands</Link>
              <span className="opacity-40">·</span>
              <Link href="/vehicles" className="font-semibold text-white hover:underline">Vehicles</Link>
              <span className="opacity-40">·</span>
              <Link href="/shop" className="font-semibold text-white hover:underline">Shop</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category strip */}
      {categories.length > 0 && (
        <section className="border-b border-brand-100 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/listings?category=${cat.slug}`}
                  className="flex flex-col items-center gap-2 rounded-lg border border-brand-100 p-4 text-center transition-colors hover:border-brand-300 hover:bg-brand-50"
                >
                  <span className="text-brand-700">
                    {CATEGORY_ICONS[cat.type ?? ""] ?? <HomeIcon className="h-6 w-6" />}
                  </span>
                  <span className="text-sm font-semibold text-brand-900">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured listings */}
      <section className="bg-brand-50/50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Handpicked"
            title="Featured Listings"
            subtitle="A curated selection of standout properties and items."
            action={
              <Link href="/listings" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-800 hover:underline">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          {!featured ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-80" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <p className="text-brand-500">Featured listings will appear here soon.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          )}
        </div>
      </section>

      {/* Latest listings */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Just Listed"
            title="Latest Arrivals"
            subtitle="Fresh listings added recently across the marketplace."
            action={
              <Link href="/listings" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-800 hover:underline">
                Browse all <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          {!latest ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-80" />
              ))}
            </div>
          ) : latest.length === 0 ? (
            <p className="text-brand-500">No listings yet.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {latest.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          )}
        </div>
      </section>

      {/* Value props */}
      <section className="border-t border-brand-100 bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:grid-cols-3">
          {[
            {
              icon: <HomeIcon className="h-6 w-6" />,
              title: "Verified Listings",
              text: "Every listing is checked by our team to ensure accuracy, so you can buy with confidence.",
            },
            {
              icon: <ShieldCheck className="h-6 w-6" />,
              title: "Trusted Process",
              text: "From first enquiry to final handover, we guide you through a safe and transparent deal.",
            },
            {
              icon: <Handshake className="h-6 w-6" />,
              title: "Sell With Ease",
              text: "Tell us what you have and our team helps you reach serious buyers quickly.",
            },
          ].map((v) => (
            <div key={v.title} className="rounded-lg border border-brand-100 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                {v.icon}
              </div>
              <h3 className="text-base font-bold text-brand-950">{v.title}</h3>
              <p className="mt-2 text-sm text-brand-500">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-800 py-14 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-display text-3xl font-bold tracking-tight">
            Have something to sell?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-200">
            Turn your property, vehicle, or items into cash. Submit your item and our team will help you sell it fast.
          </p>
          <Link href="/sell-to-us">
            <Button variant="secondary" size="lg" className="mt-6">
              Sell To Us <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}