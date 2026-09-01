// ---------------------------------------------------------------------------
// Shared domain types — mirrors the Laravel API Resources 1:1.
// ---------------------------------------------------------------------------

export type ListingType =
  | "property"
  | "land"
  | "automobile"
  | "gadget"
  | "appliance"
  | "furniture"
  | "electronics"
  | "other";

export type ListingStatus = "available" | "reserved" | "sold" | "unavailable";
export type ItemCondition =
  | "Brand New"
  | "Like New"
  | "Excellent"
  | "Good"
  | "Fairly Used"
  | "Used";

export type PropertyType = "land" | "house" | "apartment" | "commercial";
export type RatingRole = "super-admin" | "admin" | "staff" | "customer";

export interface CategoryGroup {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  description?: string | null;
  categories?: Category[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  image: string | null;
  type: ListingType | null;
  description?: string | null;
  is_featured?: boolean;
  group?: {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
  } | null;
  children?: Category[];
}

export interface ListingImage {
  id: number;
  url: string;
  is_main: boolean;
  sort_order: number;
}

export interface ListingFeature {
  id: number;
  name: string;
}

export interface ListingSpecification {
  id: number;
  label: string;
  value: string;
}

export interface PropertyDetails {
  id: number;
  property_type: PropertyType;
  land_size: number | null;
  land_size_unit: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parking_spaces: number | null;
  year_built: number | null;
  purpose: string | null;
  furnishing: string | null;
  documents: string[] | null;
}

export interface AutomobileDetails {
  id: number;
  make: string | null;
  model: string | null;
  year: number | null;
  mileage: number | null;
  transmission: string | null;
  fuel_type: string | null;
  body_type: string | null;
  color: string | null;
  doors: number | null;
  seats: number | null;
  engine_size: string | null;
  registration_number: string | null;
}

export interface Listing {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  description?: string | null;
  price: number | null;
  price_formatted: string | null;
  currency: string;
  is_price_negotiable: boolean;
  listing_type: ListingType;
  location: string | null;
  state: string | null;
  country: string | null;
  condition: ItemCondition | string | null;
  status: ListingStatus;
  is_featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  category: Category | null;
  main_image: string | null;
  // detail-only fields
  video_url?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  images?: ListingImage[];
  features?: ListingFeature[];
  specifications?: ListingSpecification[];
  property?: PropertyDetails | null;
  automobile?: AutomobileDetails | null;
  is_favorited?: boolean;
  favorites_count?: number;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

/** Alias used by the UI Pagination component. */
export type PaginationMeta = Pagination;

export interface ListingListResponse {
  listings: Listing[];
  pagination: Pagination;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  avatar: string | null;
  status: "active" | "disabled";
  email_verified_at: string | null;
  roles?: string[];
  created_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: "new" | "contacted" | "in_progress" | "resolved" | "closed";
  source: string;
  listing: { id: number; title: string; slug: string } | null;
  notes?: AdminNote[];
  created_at: string;
}

export interface SellRequestImage {
  id: number;
  url: string;
  is_main: boolean;
}

export interface SellRequest {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  category_name: string | null;
  category?: { id: number; name: string; slug: string } | null;
  item_title: string;
  description: string | null;
  condition: string | null;
  asking_price: number | null;
  asking_price_formatted: string | null;
  location: string | null;
  listing_type: ListingType;
  property_type: string | null;
  land_size: number | null;
  land_size_unit: string | null;
  documents: string[] | null;
  bedrooms: number | null;
  bathrooms: number | null;
  additional_info: string | null;
  status:
    | "pending"
    | "reviewing"
    | "contacted"
    | "accepted"
    | "rejected"
    | "purchased"
    | "closed";
  images?: SellRequestImage[];
  notes?: AdminNote[];
  created_at: string;
}

export interface AdminNote {
  id: number;
  body: string;
  user: string | null;
  created_at: string;
}

export interface CategoryWithMeta extends Category {}

export interface SiteSettings {
  business_name?: string;
  slogan?: string;
  address?: string;
  phone?: string[];
  whatsapp?: string[];
  email?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  logo?: string;
  favicon?: string;
  hero_headline?: string;
  hero_subheadline?: string;
  map_embed_url?: string;
  whatsapp_links?: string[];
  phone_links?: string[];
  [key: string]: unknown;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string | null;
  content: string;
  rating: number;
  photo: string | null;
}

export interface DashboardStats {
  total_listings: number;
  available_listings: number;
  sold_items: number;
  properties: number;
  vehicles: number;
  total_enquiries: number;
  new_enquiries: number;
  sell_requests: number;
  pending_sell_requests: number;
  users: number;
  featured_listings: number;
}

export interface DashboardCharts {
  listings_per_month: { month: string; listings: number }[];
  enquiries_by_status: Record<string, number>;
}

export interface DashboardResponse {
  stats: DashboardStats;
  charts: DashboardCharts;
}

export interface AdminNotification {
  id: string;
  data: {
    type: string;
    title: string;
    body: string;
    url: string;
    enquiry_id?: number;
    sell_request_id?: number;
  };
  read_at: string | null;
  created_at: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export type ApiResponse<T> = ApiSuccess<T>;

// ---------------------------------------------------------------------------
// Listing filters / query params
// ---------------------------------------------------------------------------

export interface ListingFilters {
  q?: string;
  category?: string;
  listing_type?: ListingType;
  location?: string;
  state?: string;
  min_price?: string | number;
  max_price?: string | number;
  condition?: string;
  status?: string;
  featured?: boolean;
  // property-specific
  property_type?: string;
  purpose?: string;
  bedrooms?: number;
  bathrooms?: number;
  min_land_size?: number;
  // vehicle-specific
  make?: string;
  model?: string;
  year?: number;
  transmission?: string;
  fuel_type?: string;
  body_type?: string;
  sort?: SortOption;
  page?: number;
  per_page?: number;
}

export type SortOption =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "featured";

export const CONDITION_OPTIONS: ItemCondition[] = [
  "Brand New",
  "Like New",
  "Excellent",
  "Good",
  "Fairly Used",
  "Used",
];

export const LISTING_STATUS_OPTIONS: ListingStatus[] = [
  "available",
  "reserved",
  "sold",
  "unavailable",
];

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "land", label: "Land" },
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "commercial", label: "Commercial" },
];

export const DOCUMENT_OPTIONS = [
  "Deed of Assignment",
  "Survey Plan",
  "Gazette",
  "Certificate of Occupancy",
  "Excision",
  "Other",
];

export const SELL_REQUEST_STATUSES = [
  "pending",
  "reviewing",
  "contacted",
  "accepted",
  "rejected",
  "purchased",
  "closed",
] as const;

export const ENQUIRY_STATUSES = [
  "new",
  "contacted",
  "in_progress",
  "resolved",
  "closed",
] as const;