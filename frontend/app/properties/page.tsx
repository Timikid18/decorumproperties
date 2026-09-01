"use client";

import { ListingBrowser } from "@/components/listing/ListingBrowser";
import { getListings } from "@/services/listings";
import type { ListingFilters } from "@/types";

function fetchPage(filters: ListingFilters) {
  return getListings(filters);
}

export default function PropertiesPage() {
  return (
    <ListingBrowser
      key="/properties"
      config={{
        fetchPage,
        basePath: "/properties",
        title: "Properties",
        subtitle: "Vehicles, generators, lands, houses, apartments and more — everything available across the DECORUM marketplace.",
        showCondition: true,
      }}
    />
  );
}