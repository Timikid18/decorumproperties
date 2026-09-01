"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessagesSquare } from "lucide-react";
import { Enquiry } from "@/types";
import { getMyEnquiries } from "@/services/enquiries";
import { EmptyState, Spinner } from "@/components/ui/Feedback";
import { StatusBadge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/utils";

export default function MyEnquiriesPage() {
  const [data, setData] = useState<{ enquiries: Enquiry[] } | null>(null);

  useEffect(() => {
    getMyEnquiries()
      .then(setData)
      .catch(() => setData({ enquiries: [] }));
  }, []);

  return (
    <div>
      <h1 className="mb-6 flex items-center gap-2 font-display text-2xl font-bold text-ink">
        <MessagesSquare className="h-6 w-6 text-brand-700" /> My Enquiries
      </h1>

      {!data ? (
        <Spinner />
      ) : data.enquiries.length === 0 ? (
        <EmptyState
          title="No enquiries yet"
          description="Enquiries you send about listings will appear here with their status."
          action={
            <Link href="/listings" className="rounded-md bg-brand-800 px-4 py-2 text-sm font-semibold text-white">
              Browse listings
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {data.enquiries.map((enq) => (
            <Card key={enq.id}>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-ink">
                      {enq.listing ? enq.listing.title : "General Enquiry"}
                    </h3>
                    <p className="mt-0.5 text-sm text-brand-500">{formatDateTime(enq.created_at)}</p>
                  </div>
                  <StatusBadge status={enq.status} />
                </div>
                {enq.message && (
                  <p className="mt-3 line-clamp-2 text-sm text-brand-600">{enq.message}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}