"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Home,
  Car,
  MessagesSquare,
  ClipboardList,
  Users,
  Star,
  PackageCheck,
} from "lucide-react";
import { DashboardResponse } from "@/types";
import { getDashboard } from "@/services/admin";
import { Spinner } from "@/components/ui/Feedback";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) return <Spinner label="Loading dashboard…" />;

  const s = data.stats;

  const stats: { label: string; value: number; icon: React.ReactNode; href: string; tone: string }[] = [
    { label: "Total Listings", value: s.total_listings, icon: <FolderKanban className="h-5 w-5" />, href: "/admin/listings", tone: "bg-brand-50 text-brand-700" },
    { label: "Available", value: s.available_listings, icon: <PackageCheck className="h-5 w-5" />, href: "/admin/listings", tone: "bg-emerald-50 text-emerald-700" },
    { label: "Properties", value: s.properties, icon: <Home className="h-5 w-5" />, href: "/admin/listings", tone: "bg-sky-50 text-sky-700" },
    { label: "Vehicles", value: s.vehicles, icon: <Car className="h-5 w-5" />, href: "/admin/listings", tone: "bg-amber-50 text-amber-700" },
    { label: "Total Enquiries", value: s.total_enquiries, icon: <MessagesSquare className="h-5 w-5" />, href: "/admin/enquiries", tone: "bg-accent-50 text-accent-700" },
    { label: "Sell Requests", value: s.sell_requests, icon: <ClipboardList className="h-5 w-5" />, href: "/admin/sell-requests", tone: "bg-violet-50 text-violet-700" },
    { label: "Users", value: s.users, icon: <Users className="h-5 w-5" />, href: "/admin/users", tone: "bg-brand-50 text-brand-700" },
    { label: "Featured", value: s.featured_listings, icon: <Star className="h-5 w-5" />, href: "/admin/listings", tone: "bg-amber-50 text-amber-700" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink">Dashboard</h2>
        <p className="text-sm text-brand-500">Overview of your marketplace.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-shadow hover:shadow-card-hover">
              <CardContent className="p-5">
                <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-md", stat.tone)}>
                  {stat.icon}
                </div>
                <p className="font-display text-2xl font-bold text-ink">{stat.value}</p>
                <p className="text-sm text-brand-500">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pending items */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent>
            <h3 className="font-bold text-ink">Needs Attention</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center justify-between gap-2">
                <span>New enquiries</span>
                <Link href="/admin/enquiries" className="font-semibold text-accent-600 hover:underline">
                  {s.new_enquiries}
                </Link>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span>Pending sell requests</span>
                <Link href="/admin/sell-requests" className="font-semibold text-accent-600 hover:underline">
                  {s.pending_sell_requests}
                </Link>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span>Sold items</span>
                <span className="font-semibold text-ink">{s.sold_items}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="font-bold text-ink">Listings Per Month</h3>
            {data.charts.listings_per_month.length === 0 ? (
              <p className="mt-3 text-sm text-brand-400">No data yet.</p>
            ) : (
              <div className="mt-4 flex h-40 items-end gap-2">
                {data.charts.listings_per_month.map((m) => (
                  <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-brand-700"
                      style={{ height: `${Math.max((m.listings / (Math.max(...data.charts.listings_per_month.map((x) => x.listings), 1))) * 100, 4)}%` }}
                    />
                    <span className="text-[10px] text-brand-400">{m.month}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}