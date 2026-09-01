"use client";

import { ListingForm } from "@/components/admin/ListingForm";

export default function NewListingPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-brand-950">Create Listing</h2>
        <p className="text-sm text-brand-500">Add a new listing to the marketplace.</p>
      </div>
      <ListingForm />
    </div>
  );
}