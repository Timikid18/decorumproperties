import { apiRequest } from "@/lib/api";
import { Enquiry, Pagination } from "@/types";

export interface EnquiryPayload {
  listing_id?: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  source?: "listing" | "contact" | "general";
}

export async function submitEnquiry(payload: EnquiryPayload): Promise<{ id: number }> {
  const res = await apiRequest<{ data: { id: number } }>(`/enquiries`, {
    method: "POST",
    body: payload,
    auth: false,
  });
  return res.data;
}

export async function getMyEnquiries(): Promise<{
  enquiries: Enquiry[];
  pagination: Pagination;
}> {
  const res = await apiRequest<{ data: { enquiries: Enquiry[]; pagination: Pagination } }>(`/my/enquiries`);
  return res.data;
}