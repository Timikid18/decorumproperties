"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Mail, Phone, MessageCircle, MapPin, StickyNote } from "lucide-react";
import { SellRequest, SELL_REQUEST_STATUSES } from "@/types";
import { getAdminSellRequest, updateSellRequestStatus, addSellRequestNote } from "@/services/admin";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Textarea, Label } from "@/components/ui/form";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Feedback";
import { Card, CardContent } from "@/components/ui/Card";
import { formatDateTime, formatPrice, toWhatsAppNumber, buildWhatsAppLink } from "@/lib/utils";

export default function AdminSellRequestDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [item, setItem] = useState<SellRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const load = useCallback(() => {
    getAdminSellRequest(Number(params.id))
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
        <p className="text-brand-500">Sell request not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/sell-requests")}>Back</Button>
      </div>
    );
  }
  const current = item;

  async function changeStatus(next: string) {
    try {
      await updateSellRequestStatus(current.id, next);
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
      await addSellRequestNote(current.id, note);
      toast("Note added.", "success");
      setNote("");
      load();
    } catch {
      toast("Unable to add note.", "error");
    } finally {
      setSavingNote(false);
    }
  }

  const whatsappLink = item.whatsapp || item.phone
    ? buildWhatsAppLink(toWhatsAppNumber(item.whatsapp || item.phone || ""), `Hello ${item.name}, regarding your DECORUM sell request for "${item.item_title}".`)
    : null;

  const details: [string, string][] = [
    ["Item Type", item.listing_type],
    ["Category", item.category_name ?? item.category?.name ?? "—"],
    ["Property Type", item.property_type ?? "—"],
    ["Condition", item.condition ?? "—"],
    ["Location", item.location ?? "—"],
    ["Land Size", item.land_size ? `${item.land_size} ${item.land_size_unit ?? ""}`.trim() : "—"],
    ["Bedrooms", item.bedrooms ? String(item.bedrooms) : "—"],
    ["Bathrooms", item.bathrooms ? String(item.bathrooms) : "—"],
    ["Documents", item.documents?.length ? item.documents.join(", ") : "—"],
  ];

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" onClick={() => router.push("/admin/sell-requests")}>← Back</Button>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">{item.item_title}</h2>
          <p className="text-sm text-brand-500">Submitted {formatDateTime(item.created_at)}</p>
        </div>
        <Select value={item.status} onChange={(e) => changeStatus(e.target.value)} className="w-44">
          {SELL_REQUEST_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </div>

      {item.images && item.images.length > 0 && (
        <div className="flex gap-3 overflow-x-auto">
          {item.images.map((img) => (
            <Image key={img.id} src={img.url} alt={item.item_title} width={208} height={160} className="h-40 w-52 rounded-lg object-cover" />
          ))}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Contact */}
        <Card>
          <CardContent>
            <h3 className="mb-4 font-bold text-ink">Contact & Pricing</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand-500" /><span className="text-brand-600">Phone:</span><span className="font-medium text-ink">{item.phone || "—"}</span></div>
              <div className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-[#25D366]" /><span className="text-brand-600">WhatsApp:</span><span className="font-medium text-ink">{item.whatsapp || "—"}</span></div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-500" /><span className="text-brand-600">Email:</span><span className="font-medium text-ink">{item.email || "—"}</span></div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-500" /><span className="text-brand-600">Location:</span><span className="font-medium text-ink">{item.location || "—"}</span></div>
              <div className="border-t border-brand-100 pt-3">
                <span className="text-brand-600">Asking Price: </span>
                <span className="text-lg font-bold text-ink">{formatPrice(item.asking_price)}</span>
              </div>
            </dl>
            {whatsappLink && (
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1fb457]">
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            )}
          </CardContent>
        </Card>

        {/* Item details */}
        <Card>
          <CardContent>
            <h3 className="mb-4 font-bold text-ink">Item Details</h3>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {details.map(([label, value]) => (
                <div key={label} className="border-b border-brand-100 pb-2">
                  <dt className="text-xs uppercase tracking-wide text-brand-400">{label}</dt>
                  <dd className="font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
            {item.description && (
              <div className="mt-4">
                <h4 className="text-xs uppercase tracking-wide text-brand-400">Description</h4>
                <p className="mt-1 whitespace-pre-line text-sm text-brand-700">{item.description}</p>
              </div>
            )}
            {item.additional_info && (
              <div className="mt-4">
                <h4 className="text-xs uppercase tracking-wide text-brand-400">Additional Info</h4>
                <p className="mt-1 whitespace-pre-line text-sm text-brand-700">{item.additional_info}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
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
              <Textarea id="note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Internal notes visible only to your team…" />
            </div>
            <Button type="submit" size="sm" loading={savingNote}>Add Note</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}