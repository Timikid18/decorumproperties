"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mail, Phone, MessageCircle, Link2, StickyNote } from "lucide-react";
import { Enquiry, ENQUIRY_STATUSES } from "@/types";
import { getAdminEnquiry, updateEnquiryStatus, addEnquiryNote } from "@/services/admin";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Textarea, Label } from "@/components/ui/form";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Feedback";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime, toWhatsAppNumber, buildWhatsAppLink } from "@/lib/utils";

export default function AdminEnquiryDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [item, setItem] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const load = useCallback(() => {
    getAdminEnquiry(Number(params.id))
      .then(setItem)
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Spinner />;
  if (!item) {
    return (
      <div className="py-16 text-center">
        <p className="text-brand-500">Enquiry not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/enquiries")}>Back</Button>
      </div>
    );
  }
  const current = item;

  async function changeStatus(next: string) {
    try {
      await updateEnquiryStatus(current.id, next);
      toast(`Status updated to ${next}.`, "success");
      load();
    } catch {
      toast("Action failed.", "error");
    }
  }

  async function submitNote(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    setSavingNote(true);
    try {
      await addEnquiryNote(current.id, note);
      toast("Note added.", "success");
      setNote("");
      load();
    } catch {
      toast("Unable to add note.", "error");
    } finally {
      setSavingNote(false);
    }
  }

  const whatsappLink = item.phone
    ? buildWhatsAppLink(toWhatsAppNumber(item.phone), `Hello ${item.name}, thank you for contacting DECORUM. We received your enquiry.`)
    : null;

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" onClick={() => router.push("/admin/enquiries")}>← Back</Button>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">{item.name}</h2>
          <p className="text-sm text-brand-500">{formatDateTime(item.created_at)}</p>
        </div>
        <Select value={item.status} onChange={(e) => changeStatus(e.target.value)} className="w-44">
          {ENQUIRY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardContent>
            <h3 className="mb-4 font-bold text-ink">Contact & Message</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-500" /><span className="text-brand-600">Email:</span><a href={`mailto:${item.email}`} className="font-medium text-brand-700 hover:underline">{item.email}</a></div>
              {item.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand-500" /><span className="text-brand-600">Phone:</span><span className="font-medium text-ink">{item.phone}</span></div>}
              {item.listing && (
                <div className="flex items-center gap-2"><Link2 className="h-4 w-4 text-brand-500" /><span className="text-brand-600">Listing:</span>
                  <a href={`/listing/${item.listing.slug}`} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 hover:underline">{item.listing.title}</a>
                </div>
              )}
              <div><Badge tone="slate">Source: {item.source}</Badge></div>
            </dl>
            <div className="mt-4 rounded-md bg-brand-50/60 p-4">
              <p className="whitespace-pre-line text-sm text-ink">{item.message}</p>
            </div>
            {whatsappLink && (
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1fb457]">
                <MessageCircle className="h-4 w-4" /> Reply on WhatsApp
              </a>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="mb-4 flex items-center gap-2 font-bold text-ink">
              <StickyNote className="h-5 w-5 text-brand-500" /> Internal Notes
            </h3>
            <div className="mb-5 space-y-3">
              {item.notes && item.notes.length > 0 ? (
                item.notes.map((n) => (
                  <div key={n.id} className="rounded-md bg-brand-50/60 p-3">
                    <p className="text-sm text-ink">{n.body}</p>
                    <p className="mt-1 text-xs text-brand-400">{n.user ?? "Team"} · {formatDateTime(n.created_at)}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-brand-400">No internal notes yet.</p>
              )}
            </div>
            <form onSubmit={submitNote} className="space-y-3">
              <div>
                <Label htmlFor="note">Add a note</Label>
                <Textarea id="note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Internal notes…" />
              </div>
              <Button type="submit" size="sm" loading={savingNote}>Add Note</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}