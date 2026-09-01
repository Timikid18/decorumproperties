"use client";

import { ListingBrowser } from "@/components/listing/ListingBrowser";
import { getLands } from "@/services/listings";
import type { ListingFilters } from "@/types";

function fetchPage(filters: ListingFilters) {
  return getLands(filters);
}

export default function LandsPage() {
  return (
    <ListingBrowser
      key="/lands"
      config={{
        fetchPage,
        basePath: "/lands",
        title: "Lands for Sale",
        subtitle: "Prime plots and acreage for residential and commercial development.",
        showPropertyFilters: true,
      }}
    />
  );
}