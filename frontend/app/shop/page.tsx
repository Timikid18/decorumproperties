"use client";

import { ListingBrowser } from "@/components/listing/ListingBrowser";
import { getShopItems } from "@/services/listings";
import type { ListingFilters } from "@/types";

function fetchPage(filters: ListingFilters) {
  return getShopItems(filters);
}

export default function ShopPage() {
  return (
    <ListingBrowser
      key="/shop"
      config={{
        fetchPage,
        basePath: "/shop",
        title: "Shop",
        subtitle: "Gadgets, appliances, furniture and more from the DECORUM store.",
        showCondition: true,
      }}
    />
  );
}