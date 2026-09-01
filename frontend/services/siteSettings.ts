import { apiRequest } from "@/lib/api";
import { SiteSettings, Testimonial } from "@/types";

export async function getSiteSettings(): Promise<SiteSettings> {
  const res = await apiRequest<{ data: SiteSettings }>(`/site-settings`);
  return res.data;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const res = await apiRequest<{ data: Testimonial[] }>(`/testimonials`);
  return res.data;
}