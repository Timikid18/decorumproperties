import { apiRequest } from "@/lib/api";
import { Listing, Pagination } from "@/types";

export interface FavoriteItem {
  id: number;
  created_at: string;
  listing: Listing | null;
}

export async function getFavorites(): Promise<{ favorites: FavoriteItem[]; pagination: Pagination }> {
  const res = await apiRequest<{ data: { favorites: FavoriteItem[]; pagination: Pagination } }>(`/favorites`);
  return res.data;
}

export async function addFavorite(listing_id: number): Promise<{ id: number }> {
  const res = await apiRequest<{ data: { id: number } }>(`/favorites`, {
    method: "POST",
    body: { listing_id },
  });
  return res.data;
}

export async function removeFavorite(listingId: number): Promise<void> {
  await apiRequest<{ data: null }>(`/favorites/${listingId}`, { method: "DELETE" });
}