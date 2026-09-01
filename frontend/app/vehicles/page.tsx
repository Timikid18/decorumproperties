"use client";

import { ListingBrowser } from "@/components/listing/ListingBrowser";
import { getVehicles } from "@/services/listings";
import type { ListingFilters } from "@/types";

function fetchPage(filters: ListingFilters) {
  return getVehicles(filters);
}

export default function VehiclesPage() {
  return (
    <ListingBrowser
      key="/vehicles"
      config={{
        fetchPage,
        basePath: "/vehicles",
        title: "Vehicles",
        subtitle: "Cars, trucks and motorbikes available now.",
        showVehicleFilters: true,
      }}
    />
  );
}