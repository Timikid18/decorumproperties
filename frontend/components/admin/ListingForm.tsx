"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Listing, CONDITION_OPTIONS, LISTING_STATUS_OPTIONS } from "@/types";
import { ListingPayload, createAdminListing, updateAdminListing } from "@/services/admin";
import { getCategories } from "@/services/listings";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label, FormHint } from "@/components/ui/form";
import { Select } from "@/components/ui/Select";

const TYPES = [
  { value: "property", label: "Property" },
  { value: "land", label: "Land" },
  { value: "automobile", label: "Vehicle" },
  { value: "gadget", label: "Gadget" },
  { value: "appliance", label: "Appliance" },
  { value: "furniture", label: "Furniture" },
  { value: "electronics", label: "Electronics" },
  { value: "other", label: "Other" },
];

interface FormState {
  title: string;
  listing_type: string;
  category_id: string;
  short_description: string;
  description: string;
  price: string;
  currency: string;
  is_price_negotiable: boolean;
  location: string;
  state: string;
  condition: string;
  status: string;
  is_published: boolean;
  is_featured: boolean;
  video_url: string;
  features: string[];
  property: Record<string, string>;
  automobile: Record<string, string>;
}

export function ListingForm({ existing }: { existing?: Listing }) {
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Awaited<ReturnType<typeof getCategories>>>([]);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const [form, setForm] = useState<FormState>({
    title: existing?.title ?? "",
    listing_type: existing?.listing_type ?? "property",
    category_id: existing?.category?.id ? String(existing.category.id) : "",
    short_description: existing?.short_description ?? "",
    description: existing?.description ?? "",
    price: existing?.price != null ? String(existing.price) : "",
    currency: existing?.currency ?? "NGN",
    is_price_negotiable: existing?.is_price_negotiable ?? false,
    location: existing?.location ?? "",
    state: existing?.state ?? "",
    condition: existing?.condition ?? "Good",
    status: existing?.status ?? "available",
    is_published: true,
    is_featured: existing?.is_featured ?? false,
    video_url: existing?.video_url ?? "",
    features: existing?.features?.map((f) => f.name) ?? [],
    property: {},
    automobile: {},
  });

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const set = (key: keyof FormState, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload: ListingPayload = {
      title: form.title,
      listing_type: form.listing_type,
      category_id: form.category_id ? Number(form.category_id) : null,
      short_description: form.short_description,
      description: form.description,
      price: form.price || null,
      currency: form.currency,
      is_price_negotiable: form.is_price_negotiable,
      location: form.location,
      state: form.state,
      condition: form.condition,
      status: form.status,
      is_published: form.is_published,
      is_featured: form.is_featured,
      video_url: form.video_url || undefined,
      features: form.features.filter(Boolean),
    };
    if (form.listing_type === "property" || form.listing_type === "land") {
      payload.property = Object.fromEntries(
        Object.entries(form.property).filter(([, v]) => v !== ""),
      );
    }
    if (form.listing_type === "automobile") {
      payload.automobile = Object.fromEntries(
        Object.entries(form.automobile).filter(([, v]) => v !== ""),
      );
    }
    if (images.length > 0) payload.images = images;

    try {
      if (existing) {
        await updateAdminListing(existing.id, payload);
        toast("Listing updated.", "success");
      } else {
        await createAdminListing(payload);
        toast("Listing created.", "success");
      }
      router.push("/admin/listings");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Something went wrong saving the listing.", "error");
    } finally {
      setSaving(false);
    }
  }

  const isProperty = form.listing_type === "property" || form.listing_type === "land";
  const isVehicle = form.listing_type === "automobile";

  const propField = (key: string, label: string) => (
    <div>
      <Label htmlFor={key}>{label}</Label>
      <Input id={key} value={form.property[key] ?? ""} onChange={(e) => set("property", { ...form.property, [key]: e.target.value })} />
    </div>
  );
  const autoField = (key: string, label: string) => (
    <div>
      <Label htmlFor={key}>{label}</Label>
      <Input id={key} value={form.automobile[key] ?? ""} onChange={(e) => set("automobile", { ...form.automobile, [key]: e.target.value })} />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-lg border border-brand-100 bg-surface p-6 shadow-card sm:p-8">
      {/* Basics */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-bold text-ink">Basic Information</h2>
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input id="title" required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. 3-bedroom house in Abeokuta" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="listing_type">Listing Type *</Label>
            <Select id="listing_type" value={form.listing_type} onChange={(e) => set("listing_type", e.target.value)}>
              {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="category_id">Category</Label>
            <Select id="category_id" value={form.category_id} onChange={(e) => set("category_id", e.target.value)}>
              <option value="">None</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="condition">Condition</Label>
            <Select id="condition" value={form.condition} onChange={(e) => set("condition", e.target.value)}>
              {CONDITION_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="short_description">Short Description</Label>
          <Textarea id="short_description" rows={2} value={form.short_description} onChange={(e) => set("short_description", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="description">Full Description</Label>
          <Textarea id="description" rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>
      </section>

      {/* Pricing & location */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-bold text-ink">Pricing & Location</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="price">Price (₦)</Label>
            <Input id="price" type="number" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select id="status" value={form.status} onChange={(e) => set("status", e.target.value)}>
              {LISTING_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
          <div className="flex items-end gap-2 pb-1">
            <input
              type="checkbox"
              id="negotiable"
              checked={form.is_price_negotiable}
              onChange={(e) => set("is_price_negotiable", e.target.checked)}
              className="h-4 w-4 accent-brand-700"
            />
            <Label htmlFor="negotiable" className="mb-0">Price negotiable</Label>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="location">Location / Address</Label>
            <Input id="location" value={form.location} onChange={(e) => set("location", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input id="state" value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="e.g. Ogun" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-bold text-ink">Features</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Add a feature and press Enter…"
            className="max-w-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const value = (e.target as HTMLInputElement).value.trim();
                if (value) set("features", [...form.features, value]);
                (e.target as HTMLInputElement).value = "";
              }
            }}
          />
          {form.features.length > 0 && (
            <button type="button" onClick={() => set("features", [])} className="text-xs font-medium text-accent-600 hover:underline">
              Clear all ({form.features.length})
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {form.features.map((f, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 rounded-md bg-brand-50 px-2.5 py-1 text-sm text-ink">
              {f}
              <button type="button" onClick={() => set("features", form.features.filter((_, idx) => idx !== i))} className="text-brand-400 hover:text-accent-600">×</button>
            </span>
          ))}
        </div>
      </section>

      {/* Property details */}
      {isProperty && (
        <section className="space-y-4">
          <h2 className="font-display text-lg font-bold text-ink">Property Details</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {propField("property_type", "Property Type")}
            {propField("land_size", "Land Size")}
            {propField("land_size_unit", "Land Size Unit")}
            {propField("bedrooms", "Bedrooms")}
            {propField("bathrooms", "Bathrooms")}
            {propField("parking_spaces", "Parking Spaces")}
            {propField("purpose", "Purpose")}
            {propField("furnishing", "Furnishing")}
            {propField("year_built", "Year Built")}
          </div>
        </section>
      )}

      {/* Vehicle details */}
      {isVehicle && (
        <section className="space-y-4">
          <h2 className="font-display text-lg font-bold text-ink">Vehicle Details</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {autoField("make", "Make")}
            {autoField("model", "Model")}
            {autoField("year", "Year")}
            {autoField("mileage", "Mileage")}
            {autoField("transmission", "Transmission")}
            {autoField("fuel_type", "Fuel Type")}
            {autoField("body_type", "Body Type")}
            {autoField("color", "Colour")}
            {autoField("doors", "Doors")}
            {autoField("seats", "Seats")}
            {autoField("engine_size", "Engine Size")}
            {autoField("registration_number", "Registration Number")}
          </div>
        </section>
      )}

      {/* Media */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-bold text-ink">Media</h2>
        <div>
          <Label htmlFor="images">Images</Label>
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files ?? []))}
            className="block w-full text-sm text-brand-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
          />
          <FormHint>{images.length ? `${images.length} selected` : "Upload listing photos."}</FormHint>
        </div>
        <div>
          <Label htmlFor="video_url">Video URL</Label>
          <Input id="video_url" value={form.video_url} onChange={(e) => set("video_url", e.target.value)} placeholder="https://youtube.com/…" />
        </div>
      </section>

      {/* Publishing */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-bold text-ink">Publishing</h2>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} className="h-4 w-4 accent-brand-700" />
            Publish immediately
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => set("is_featured", e.target.checked)} className="h-4 w-4 accent-brand-700" />
            Mark as featured
          </label>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3 border-t border-brand-100 pt-5">
        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" loading={saving}>{existing ? "Update Listing" : "Create Listing"}</Button>
      </div>
    </form>
  );
}