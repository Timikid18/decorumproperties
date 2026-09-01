"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { submitEnquiry } from "@/services/enquiries";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label, FieldError } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/Card";
import { buildTelLink, buildWhatsAppLink } from "@/lib/utils";
import { BUSINESS } from "@/lib/constants";

export default function ContactPage() {
  const { settings } = useSiteSettings();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const phone = settings.phone_links?.[0];
  const whatsapp = settings.whatsapp_links?.[0];
  const waMsg = encodeURIComponent(`Hello ${settings.business_name || BUSINESS.name}, I would like to make an enquiry.`);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      await submitEnquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        source: "contact",
      });
      toast("Your message has been sent. We'll be in touch soon.", "success");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setError("Something went wrong sending your message. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-center font-display text-4xl font-bold tracking-tight text-brand-950">Contact Us</h1>
      <p className="mx-auto mt-3 max-w-2xl text-center text-brand-600">
        Have a question, or want to buy or sell? We&apos;d love to hear from you.
      </p>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        {/* Contact info */}
        <div className="space-y-4">
          {settings.address && (
            <Card><CardContent className="flex items-start gap-4">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
              <div>
                <h3 className="font-bold text-brand-950">Visit Us</h3>
                <p className="mt-1 text-sm text-brand-600">{settings.address}</p>
              </div>
            </CardContent></Card>
          )}
          {phone && (
            <Card><CardContent className="flex items-start gap-4">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
              <div>
                <h3 className="font-bold text-brand-950">Call Us</h3>
                <a href={buildTelLink(phone)} className="mt-1 block text-sm text-brand-600 hover:underline">{phone}</a>
              </div>
            </CardContent></Card>
          )}
          {whatsapp && (
            <Card><CardContent className="flex items-start gap-4">
              <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#25D366]" />
              <div>
                <h3 className="font-bold text-brand-950">WhatsApp</h3>
                <a href={buildWhatsAppLink(whatsapp, waMsg)} target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm text-brand-600 hover:underline">
                  Chat with us
                </a>
              </div>
            </CardContent></Card>
          )}
          {settings.email && (
            <Card><CardContent className="flex items-start gap-4">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
              <div>
                <h3 className="font-bold text-brand-950">Email</h3>
                <a href={`mailto:${settings.email}`} className="mt-1 block text-sm text-brand-600 hover:underline">{settings.email}</a>
              </div>
            </CardContent></Card>
          )}
        </div>

        {/* Form */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-brand-950">Send a Message</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && <FieldError message={error} />}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea id="message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <Button type="submit" loading={sending}>Send Message</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}