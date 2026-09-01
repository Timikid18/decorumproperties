import { apiRequest } from "@/lib/api";
import { Pagination, SellRequest } from "@/types";

export interface SellRequestPayload {
  name: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  category_name?: string;
  category_id?: number;
  item_title: string;
  description?: string;
  condition?: string;
  asking_price?: number | string;
  location?: string;
  listing_type?: string;
  property_type?: string;
  land_size?: number | string;
  land_size_unit?: string;
  documents?: string[];
  bedrooms?: number;
  bathrooms?: number;
  additional_info?: string;
  images?: FileList | File[];
}

export async function submitSellRequest(payload: SellRequestPayload): Promise<{ id: number }> {
  const formData = new FormData();

  const fields: Record<string, unknown> = {
    name: payload.name,
    email: payload.email ?? "",
    phone: payload.phone ?? "",
    whatsapp: payload.whatsapp ?? "",
    category_name: payload.category_name ?? "",
    category_id: payload.category_id ?? "",
    item_title: payload.item_title,
    description: payload.description ?? "",
    condition: payload.condition ?? "",
    asking_price: payload.asking_price ?? "",
    location: payload.location ?? "",
    listing_type: payload.listing_type ?? "other",
    property_type: payload.property_type ?? "",
    land_size: payload.land_size ?? "",
    land_size_unit: payload.land_size_unit ?? "",
    bedrooms: payload.bedrooms ?? "",
    bathrooms: payload.bathrooms ?? "",
    additional_info: payload.additional_info ?? "",
  };

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, String(value));
    }
  });

  if (Array.isArray(payload.documents)) {
    payload.documents.forEach((doc) => formData.append("documents[]", doc));
  }

  if (payload.images) {
    Array.from(payload.images).forEach((file) => formData.append("images[]", file));
  }

  const res = await apiRequest<{ data: { id: number } }>(`/sell-requests`, {
    method: "POST",
    body: formData,
    auth: false,
  });
  return res.data;
}

export async function getMySellRequests(): Promise<{
  submissions: SellRequest[];
  pagination: Pagination;
}> {
  const res = await apiRequest<{ data: { submissions: SellRequest[]; pagination: Pagination } }>(`/my/sell-requests`);
  return res.data;
}