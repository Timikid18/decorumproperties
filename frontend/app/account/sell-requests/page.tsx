"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { SellRequest } from "@/types";
import { getMySellRequests } from "@/services/sellRequests";
import { EmptyState, Spinner } from "@/components/ui/Feedback";
import { StatusBadge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { formatDate, formatPrice } from "@/lib/utils";

export default function MySellRequestsPage() {
  const [data, setData] = useState<{ submissions: SellRequest[] } | null>(null);

  useEffect(() => {
    getMySellRequests()
      .then(setData)
      .catch(() => setData({ submissions: [] }));
  }, []);

  return (
    <div>
      <h1 className="mb-6 flex items-center gap-2 font-display text-2xl font-bold text-ink">
        <ClipboardList className="h-6 w-6 text-brand-700" /> My Sell Requests
      </h1>

      {!data ? (
        <Spinner />
      ) : data.submissions.length === 0 ? (
        <EmptyState
          title="No sell requests yet"
          description="When you submit an item to sell, you can track its status here."
          action={
            <Link href="/sell-to-us" className="rounded-md bg-brand-800 px-4 py-2 text-sm font-semibold text-white">
              Sell To Us
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {data.submissions.map((req) => (
            <Card key={req.id}>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-ink">{req.item_title}</h3>
                    <p className="mt-0.5 text-sm text-brand-500">
                      {req.category_name ?? "Item"} · Submitted {formatDate(req.created_at)}
                    </p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-brand-100 pt-4 text-sm">
                  <span className="font-semibold text-ink">
                    {req.asking_price ? formatPrice(req.asking_price) : "Price on request"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-brand-400">
                    {req.status === "accepted" || req.status === "purchased" ? (
                      <span className="text-emerald-600 font-medium">We&apos;ll be in touch to finalise.</span>
                    ) : (
                      <span>Awaiting review</span>
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}