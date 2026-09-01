"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { submitSellRequest } from "@/services/sellRequests";
import { DOCUMENT_OPTIONS } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label, FormHint, FieldError } from "@/components/ui/form";
import { Select } from "@/components/ui/Select";
import { SectionHeading } from "@/components/layout/SectionHeading";

const LISTING_TYPES = [
  { value: "property", label: "Property (House/Commercial)" },
  { value: "land", label: "Land" },
  { value: "automobile", label: "Vehicle" },
  { value: "gadget", label: "Gadget" },
  { value: "appliance", label: "Appliance" },
  { value: "furniture", label: "Furniture" },
  { value: "electronics", label: "Electronics" },
  { value: "other", label: "Other" },
] as const;

const CONDITIONS = ["Brand New", "Like New", "Excellent", "Good", "Fairly Used", "Used"];

export default function SellToUsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    listing_type: "other" as string,
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    whatsapp: user?.whatsapp ?? "",
    category_name: "",
    item_title: "",
    description: "",
    condition: "Good",
    asking_price: "",
    location: "",
    property_type: "",
    land_size: "",
    land_size_unit: "sqm",
    bedrooms: "",
    bathrooms: "",
    additional_info: "",
    documents: [] as string[],
  });

  const set = (key: string, value: unknown) => setForm((prev) => ({ ...prev, [key]: value }));

  const isProperty = form.listing_type === "property" || form.listing_type === "land";

  function validateStep(stepIndex: number): boolean {
    const next: Record<string, string> = {};
    if (stepIndex === 0) {
      if (!form.item_title.trim()) next.item_title = "Please enter a title for your item.";
      if (!form.name.trim()) next.name = "Your name is required.";
      if (!form.email.trim()) next.email = "Your email is required.";
    }
    if (stepIndex === 1 && isProperty) {
      if (form.listing_type === "property" && !form.property_type) next.property_type = "Select a property type.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function next() {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep(0)) {
      setStep(0);
      return;
    }
    setSending(true);
    try {
      await submitSellRequest({
        name: form.name,
        email: form.email,
        phone: form.phone,
        whatsapp: form.whatsapp,
        category_name: form.category_name,
        item_title: form.item_title,
        description: form.description,
        condition: form.condition,
        asking_price: form.asking_price || undefined,
        location: form.location,
        listing_type: form.listing_type,
        property_type: form.property_type || undefined,
        land_size: form.land_size || undefined,
        land_size_unit: form.land_size ? form.land_size_unit : undefined,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        additional_info: form.additional_info,
        documents: form.documents,
      });
      setSubmitted(true);
      toast("Your submission has been received. We'll review it and get back to you.", "success");
    } catch {
      toast("Something went wrong submitting your item. Please try again.", "error");
    } finally {
      setSending(false);
    }
  }

  const steps = ["Item Details", ...(isProperty ? ["Property Details"] : []), "Review"];

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
        <h1 className="mt-4 font-display text-3xl font-bold text-brand-950">Submission Received!</h1>
        <p className="mt-3 text-brand-600">
          Thank you for choosing to sell with DECORUM. Our team will review your item and contact you shortly.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
          <Link href="/listings">
            <Button>Browse Listings</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <SectionHeading
        eyebrow="Sell With Us"
        title="Sell To Us"
        subtitle="Tell us what you have — property, land, vehicle, or items — and our team will get it in front of serious buyers."
      />

      {/* Stepper */}
      <div className="mb-8 flex items-center gap-2">
        {steps.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className={`flex h-8 w-full items-center justify-center rounded-md text-xs font-semibold ${
                i <= step ? "bg-brand-800 text-white" : i < step ? "bg-emerald-500 text-white" : "bg-brand-100 text-brand-400"
              }`}
            >
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span className="hidden text-xs font-medium text-brand-600 sm:block">{label}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-brand-100 bg-white p-6 shadow-card sm:p-8">
        {step === 0 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="listing_type">Item Type *</Label>
                <Select id="listing_type" value={form.listing_type} onChange={(e) => set("listing_type", e.target.value)}>
                  {LISTING_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </Select>
              </div>
              <div>
                <Label htmlFor="category_name">Category (optional)</Label>
                <Input id="category_name" value={form.category_name} onChange={(e) => set("category_name", e.target.value)} placeholder="e.g. Cars, Clothes, Phones" />
              </div>
            </div>

            <div>
              <Label htmlFor="item_title">Item Title *</Label>
              <Input id="item_title" value={form.item_title} onChange={(e) => set("item_title", e.target.value)} placeholder="e.g. 3-bedroom house in Abeokuta, 2018 Toyota Camry" />
              <FieldError message={errors.item_title} />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Tell us about the item, its condition, and why you're selling." />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="condition">Condition</Label>
                <Select id="condition" value={form.condition} onChange={(e) => set("condition", e.target.value)}>
                  {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>
              <div>
                <Label htmlFor="asking_price">Asking Price (₦)</Label>
                <Input id="asking_price" type="number" min="0" value={form.asking_price} onChange={(e) => set("asking_price", e.target.value)} placeholder="e.g. 25000000" />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Abeokuta, Ogun" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="name">Your Name *</Label>
                <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} />
                <FieldError message={errors.name} />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
                <FieldError message={errors.email} />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp / Phone</Label>
                <Input id="whatsapp" value={form.phone || form.whatsapp} onChange={(e) => { set("whatsapp", e.target.value); set("phone", e.target.value); }} placeholder="e.g. 0706 652 7982" />
              </div>
            </div>

            <div>
              <Label htmlFor="additional_info">Additional Info (negotiable, urgent sale, etc.)</Label>
              <Textarea id="additional_info" rows={3} value={form.additional_info} onChange={(e) => set("additional_info", e.target.value)} />
            </div>
          </>
        )}

        {step === 1 && isProperty && (
          <>
            {form.listing_type === "property" && (
              <div>
                <Label htmlFor="property_type">Property Type *</Label>
                <Select id="property_type" value={form.property_type} onChange={(e) => set("property_type", e.target.value)}>
                  <option value="">Select type</option>
                  <option value="land">Land</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="commercial">Commercial</option>
                </Select>
                <FieldError message={errors.property_type} />
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="land_size">Land Size</Label>
                <Input id="land_size" type="number" min="0" value={form.land_size} onChange={(e) => set("land_size", e.target.value)} placeholder="e.g. 500" />
              </div>
              <div>
                <Label htmlFor="land_size_unit">Unit</Label>
                <Select id="land_size_unit" value={form.land_size_unit} onChange={(e) => set("land_size_unit", e.target.value)}>
                  <option value="sqm">Sqm</option>
                  <option value="plots">Plots</option>
                  <option value="acres">Acres</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="location2">Location</Label>
                <Input id="location2" value={form.location} onChange={(e) => set("location", e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input id="bedrooms" type="number" min="0" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input id="bathrooms" type="number" min="0" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} />
              </div>
            </div>

            <div>
              <Label>Available Documents</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {DOCUMENT_OPTIONS.map((doc) => (
                  <label key={doc} className="flex items-center gap-2 rounded-md border border-brand-100 px-3 py-2 text-sm text-brand-700">
                    <input
                      type="checkbox"
                      checked={form.documents.includes(doc)}
                      onChange={(e) =>
                        set("documents", e.target.checked ? [...form.documents, doc] : form.documents.filter((d) => d !== doc))
                      }
                      className="h-4 w-4 accent-brand-700"
                    />
                    {doc}
                  </label>
                ))}
              </div>
              <FormHint>You&apos;ll have a chance to confirm documents with our team.</FormHint>
            </div>
          </>
        )}

        {step === steps.length - 1 && (
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-brand-950">Review Your Submission</h3>
            <dl className="grid gap-3 rounded-lg border border-brand-100 p-4 text-sm sm:grid-cols-2">
              {[
                ["Item Type", LISTING_TYPES.find((t) => t.value === form.listing_type)?.label],
                ["Title", form.item_title],
                ["Description", form.description || "—"],
                ["Condition", form.condition],
                ["Asking Price", form.asking_price ? `₦${Number(form.asking_price).toLocaleString()}` : "—"],
                ["Location", form.location || "—"],
                ["Name", form.name],
                ["Email", form.email],
                ["WhatsApp", form.phone || form.whatsapp || "—"],
                ...(isProperty ? [["Property Type", form.property_type || "—"], ["Land Size", form.land_size ? `${form.land_size} ${form.land_size_unit}` : "—"]] as const : []),
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-brand-400">{label}</dt>
                  <dd className="mt-1 font-medium text-brand-900">{value || "—"}</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm text-brand-500">
              Our team will review your item and contact you to arrange sale or listing. You don&apos;t need to upload photos now &mdash; we&apos;ll request them when we reach out.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-brand-100 pt-5">
          <Button type="button" variant="ghost" onClick={back} disabled={step === 0}>
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button type="button" onClick={next}>
              Continue
            </Button>
          ) : (
            <Button type="submit" loading={sending}>
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}