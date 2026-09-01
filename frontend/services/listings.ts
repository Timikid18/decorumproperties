import { apiRequest } from "@/lib/api";
import {
  Category,
  CategoryGroup,
  Listing,
  ListingFilters,
  ListingListResponse,
} from "@/types";

function toQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

export async function getListings(filters: ListingFilters = {}): Promise<ListingListResponse> {
  const res = await apiRequest<{ data: ListingListResponse }>(`/listings${toQueryString(filters as Record<string, unknown>)}`);
  return res.data;
}

export async function getListingBySlug(slug: string): Promise<Listing> {
  const res = await apiRequest<{ data: Listing }>(`/listings/${slug}`);
  return res.data;
}

export async function getFeaturedListings(limit = 8): Promise<Listing[]> {
  const res = await apiRequest<{ data: Listing[] }>(`/listings/featured?limit=${limit}`);
  return res.data;
}

export async function getLatestListings(limit = 12): Promise<Listing[]> {
  const res = await apiRequest<{ data: Listing[] }>(`/listings/latest?limit=${limit}`);
  return res.data;
}

export async function searchListings(filters: ListingFilters): Promise<ListingListResponse> {
  const res = await apiRequest<{ data: ListingListResponse }>(`/listings/search${toQueryString(filters as Record<string, unknown>)}`);
  return res.data;
}

export async function getProperties(filters: ListingFilters = {}): Promise<ListingListResponse> {
  const res = await apiRequest<{ data: ListingListResponse }>(`/properties${toQueryString(filters as Record<string, unknown>)}`);
  return res.data;
}

export async function getLands(filters: ListingFilters = {}): Promise<ListingListResponse> {
  const res = await apiRequest<{ data: ListingListResponse }>(`/lands${toQueryString(filters as Record<string, unknown>)}`);
  return res.data;
}

export async function getVehicles(filters: ListingFilters = {}): Promise<ListingListResponse> {
  const res = await apiRequest<{ data: ListingListResponse }>(`/vehicles${toQueryString(filters as Record<string, unknown>)}`);
  return res.data;
}

export async function getShopItems(filters: ListingFilters = {}): Promise<ListingListResponse> {
  const res = await apiRequest<{ data: ListingListResponse }>(`/shop${toQueryString(filters as Record<string, unknown>)}`);
  return res.data;
}

export async function getCategories(): Promise<Category[]> {
  const res = await apiRequest<{ data: Category[] }>(`/categories`);
  return res.data;
}

export async function getCategoryGroups(): Promise<CategoryGroup[]> {
  const res = await apiRequest<{ data: CategoryGroup[] }>(`/category-groups`);
  return res.data;
}