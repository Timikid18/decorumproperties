"use client";

import { ListingBrowser } from "@/components/listing/ListingBrowser";
import { getListings } from "@/services/listings";
import type { ListingFilters } from "@/types";

function fetchPage(filters: ListingFilters) {
  return getListings(filters);
}

export default function ListingsPage() {
  return (
    <ListingBrowser
      key="/listings"
      config={{
        fetchPage,
        basePath: "/listings",
        title: "Browse Everything",
        subtitle: "Explore properties, lands, vehicles and products across the marketplace.",
        showCondition: true,
      }}
    />
  );
}