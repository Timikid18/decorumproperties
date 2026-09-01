import { apiRequest } from "@/lib/api";
import {
  AdminNotification,
  Category,
  CategoryGroup,
  DashboardResponse,
  Enquiry,
  Listing,
  Pagination,
  SellRequest,
  User,
} from "@/types";

const ADMIN = "/admin";

function qs(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  const s = searchParams.toString();
  return s ? `?${s}` : "";
}

// ---------------------------------------------------------------- dashboard

export async function getDashboard(): Promise<DashboardResponse> {
  const res = await apiRequest<{ data: DashboardResponse }>(`${ADMIN}/dashboard`);
  return res.data;
}

// ---------------------------------------------------------------- notifications

export async function getNotifications(): Promise<{
  notifications: AdminNotification[];
  unread_count: number;
}> {
  const res = await apiRequest<{ data: { notifications: AdminNotification[]; unread_count: number } }>(
    `${ADMIN}/notifications`,
  );
  return res.data;
}

export async function getUnreadCount(): Promise<number> {
  const res = await apiRequest<{ data: { unread_count: number } }>(`${ADMIN}/notifications/unread-count`);
  return res.data.unread_count;
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiRequest(`/admin/notifications/${id}/read`, { method: "POST" });
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiRequest(`/admin/notifications/read-all`, { method: "POST" });
}

// ---------------------------------------------------------------- listings

export interface AdminListingQuery {
  q?: string;
  listing_type?: string;
  category_id?: number;
  status?: string;
  is_published?: boolean;
  is_featured?: boolean;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc";
  page?: number;
  per_page?: number;
}

export interface ListingPayload {
  title?: string;
  category_id?: number | null;
  listing_type: string;
  short_description?: string;
  description?: string;
  price?: number | string | null;
  currency?: string;
  is_price_negotiable?: boolean;
  location?: string;
  state?: string;
  country?: string;
  condition?: string;
  status: string;
  is_published?: boolean;
  is_featured?: boolean;
  video_url?: string;
  features?: string[];
  specifications?: { label: string; value: string }[];
  property?: Record<string, unknown>;
  automobile?: Record<string, unknown>;
  images?: FileList | File[];
}

export async function getAdminListings(query: AdminListingQuery = {}): Promise<{
  listings: Listing[];
  pagination: Pagination;
}> {
  const res = await apiRequest<{ data: { listings: Listing[]; pagination: Pagination } }>(
    `${ADMIN}/listings${qs(query as Record<string, unknown>)}`,
  );
  return res.data;
}

export async function getAdminListing(id: number): Promise<Listing> {
  const res = await apiRequest<{ data: Listing }>(`${ADMIN}/listings/${id}`);
  return res.data;
}

export async function createAdminListing(payload: ListingPayload): Promise<Listing> {
  const formData = buildListingForm(payload);
  const res = await apiRequest<{ data: Listing }>(`${ADMIN}/listings`, {
    method: "POST",
    body: formData,
  });
  return res.data;
}

export async function updateAdminListing(id: number, payload: ListingPayload): Promise<Listing> {
  const formData = buildListingForm(payload);
  formData.delete("images[]");
  const res = await apiRequest<{ data: Listing }>(`${ADMIN}/listings/${id}`, {
    method: "PUT",
    body: formData,
  });
  return res.data;
}

export async function deleteAdminListing(id: number): Promise<void> {
  await apiRequest<{ data: null }>(`${ADMIN}/listings/${id}`, { method: "DELETE" });
}

export async function publishListing(id: number): Promise<void> {
  await apiRequest(`/admin/listings/${id}/publish`, { method: "POST" });
}

export async function unpublishListing(id: number): Promise<void> {
  await apiRequest(`/admin/listings/${id}/unpublish`, { method: "POST" });
}

export async function toggleFeatured(id: number): Promise<boolean> {
  const res = await apiRequest<{ data: { is_featured: boolean } }>(`/admin/listings/${id}/feature`, { method: "POST" });
  return res.data.is_featured;
}

export async function markListingStatus(id: number, status: string): Promise<void> {
  await apiRequest(`/admin/listings/${id}/mark-status`, {
    method: "POST",
    body: { status },
  });
}

export async function deleteListingImage(listingId: number, imageId: number): Promise<void> {
  await apiRequest(`/admin/listings/${listingId}/images/${imageId}`, { method: "DELETE" });
}

export async function setMainImage(listingId: number, imageId: number): Promise<void> {
  await apiRequest(`/admin/listings/${listingId}/images/${imageId}/main`, { method: "POST" });
}

function buildListingForm(payload: ListingPayload): FormData {
  const formData = new FormData();
  const fields: Record<string, unknown> = {
    title: payload.title,
    category_id: payload.category_id ?? "",
    listing_type: payload.listing_type,
    short_description: payload.short_description ?? "",
    description: payload.description ?? "",
    price: payload.price ?? "",
    currency: payload.currency ?? "NGN",
    is_price_negotiable: payload.is_price_negotiable ? "1" : "0",
    location: payload.location ?? "",
    state: payload.state ?? "",
    country: payload.country ?? "Nigeria",
    condition: payload.condition ?? "",
    status: payload.status,
    is_published: payload.is_published ? "1" : "0",
    is_featured: payload.is_featured ? "1" : "0",
    video_url: payload.video_url ?? "",
  };
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") formData.append(key, String(value));
  });
  payload.features?.forEach((f, i) => formData.append("features[]", f));
  payload.specifications?.forEach((spec, i) => {
    formData.append(`specifications[${i}][label]`, spec.label);
    formData.append(`specifications[${i}][value]`, spec.value);
  });
  Object.entries(payload.property ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        (value as string[]).forEach((v) => formData.append(`property[documents][]`, String(v)));
      } else {
        formData.append(`property[${key}]`, String(value));
      }
    }
  });
  Object.entries(payload.automobile ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(`automobile[${key}]`, String(value));
    }
  });
  if (payload.images) {
    Array.from(payload.images).forEach((file) => formData.append("images[]", file));
  }
  return formData;
}

// ---------------------------------------------------------------- categories

export async function getAdminCategories(): Promise<Category[]> {
  const res = await apiRequest<{ data: Category[] }>(`${ADMIN}/categories`);
  return res.data;
}

export async function getAdminCategoryGroups(): Promise<CategoryGroup[]> {
  const res = await apiRequest<{ data: CategoryGroup[] }>(`${ADMIN}/category-groups`);
  return res.data;
}

export async function createAdminCategory(payload: {
  name: string;
  group_id?: number;
  icon?: string;
  type?: string;
  is_active?: boolean;
  is_featured?: boolean;
  sort_order?: number;
}): Promise<Category> {
  const res = await apiRequest<{ data: Category }>(`${ADMIN}/categories`, { method: "POST", body: payload });
  return res.data;
}

export async function updateAdminCategory(id: number, payload: Partial<{
  name: string;
  group_id?: number;
  icon?: string;
  type?: string;
  is_active?: boolean;
  is_featured?: boolean;
  sort_order?: number;
}>): Promise<Category> {
  const res = await apiRequest<{ data: Category }>(`${ADMIN}/categories/${id}`, { method: "PUT", body: payload });
  return res.data;
}

export async function deleteAdminCategory(id: number): Promise<void> {
  await apiRequest(`/admin/categories/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------- enquiries

export async function getAdminEnquiries(query: { q?: string; status?: string; page?: number } = {}): Promise<{
  enquiries: Enquiry[];
  pagination: Pagination;
}> {
  const res = await apiRequest<{ data: { enquiries: Enquiry[]; pagination: Pagination } }>(
    `${ADMIN}/enquiries${qs(query)}`,
  );
  return res.data;
}

export async function getAdminEnquiry(id: number): Promise<Enquiry> {
  const res = await apiRequest<{ data: Enquiry }>(`${ADMIN}/enquiries/${id}`);
  return res.data;
}

export async function updateEnquiryStatus(id: number, status: string): Promise<void> {
  await apiRequest(`/admin/enquiries/${id}/status`, { method: "PATCH", body: { status } });
}

export async function addEnquiryNote(id: number, body: string): Promise<void> {
  await apiRequest(`/admin/enquiries/${id}/notes`, { method: "POST", body: { body } });
}

export async function deleteEnquiry(id: number): Promise<void> {
  await apiRequest(`/admin/enquiries/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------- sell requests

export async function getAdminSellRequests(query: { q?: string; status?: string; listing_type?: string; page?: number; per_page?: number } = {}): Promise<{
  submissions: SellRequest[];
  pagination: Pagination;
}> {
  const res = await apiRequest<{ data: { submissions: SellRequest[]; pagination: Pagination } }>(
    `${ADMIN}/sell-requests${qs(query)}`,
  );
  return res.data;
}

export async function getAdminSellRequest(id: number): Promise<SellRequest> {
  const res = await apiRequest<{ data: SellRequest }>(`${ADMIN}/sell-requests/${id}`);
  return res.data;
}

export async function updateSellRequestStatus(id: number, status: string): Promise<void> {
  await apiRequest(`/admin/sell-requests/${id}/status`, { method: "PATCH", body: { status } });
}

export async function addSellRequestNote(id: number, body: string): Promise<void> {
  await apiRequest(`/admin/sell-requests/${id}/notes`, { method: "POST", body: { body } });
}

export async function deleteSellRequest(id: number): Promise<void> {
  await apiRequest(`/admin/sell-requests/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------- users

export async function getAdminUsers(query: { q?: string; role?: string; page?: number } = {}): Promise<{
  users: User[];
  pagination: Pagination;
}> {
  const res = await apiRequest<{ data: { users: User[]; pagination: Pagination } }>(
    `${ADMIN}/users${qs(query)}`,
  );
  return res.data;
}

export async function getAdminUser(id: number): Promise<User> {
  const res = await apiRequest<{ data: User }>(`${ADMIN}/users/${id}`);
  return res.data;
}

export async function updateAdminUser(
  id: number,
  payload: { name?: string; email?: string; phone?: string; whatsapp?: string; status?: string; roles?: string[] },
): Promise<User> {
  const res = await apiRequest<{ data: User }>(`${ADMIN}/users/${id}`, { method: "PUT", body: payload });
  return res.data;
}

export async function toggleUserStatus(id: number): Promise<void> {
  await apiRequest(`/admin/users/${id}/toggle-status`, { method: "POST" });
}

// ---------------------------------------------------------------- settings

export interface SettingRow {
  key: string;
  value: unknown;
  group: string;
  is_public?: boolean;
}

export async function getAdminSettings(): Promise<SettingRow[]> {
  const res = await apiRequest<{ data: SettingRow[] }>(`${ADMIN}/settings`);
  return res.data;
}

export async function updateAdminSettings(settings: Record<string, unknown>): Promise<void> {
  const rows = Object.entries(settings).map(([key, value]) => ({ key, value, group: "general" }));
  await apiRequest(`/admin/settings`, { method: "PUT", body: { settings: rows } });
}

export async function uploadBrandImage(kind: "logo" | "favicon", file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);
  await apiRequest(`/admin/settings/${kind}`, { method: "POST", body: formData });
}