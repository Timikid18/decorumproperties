"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  FolderKanban,
  ListOrdered,
  MessagesSquare,
  ClipboardList,
  Users,
  Settings as SettingsIcon,
  Menu,
  X,
  Bell,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/Feedback";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Listings", href: "/admin/listings", icon: FolderKanban },
  { label: "Enquiries", href: "/admin/enquiries", icon: MessagesSquare },
  { label: "Sell Requests", href: "/admin/sell-requests", icon: ClipboardList },
];

// Settings & users are gated by role (staff lack these permissions).
function roleFull(roles?: string[]): boolean {
  return Boolean(roles?.some((r) => r === "super-admin" || r === "admin"));
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isFull = roleFull(user?.roles);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth/login");
    } else if (!loading && isAuthenticated && !isAdmin) {
      router.replace("/");
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  if (loading || !isAuthenticated || !isAdmin) {
    return <Spinner label="Loading admin…" className="py-24" />;
  }

  const sections = [
    ...NAV,
    ...(isFull
      ? [
          { label: "Categories", href: "/admin/categories", icon: ListOrdered },
          { label: "Users", href: "/admin/users", icon: Users },
          { label: "Settings", href: "/admin/settings", icon: SettingsIcon },
        ]
      : []),
  ];

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-brand-800 px-5">
        <Image src="/logo.png" alt="DECORUM Admin" width={40} height={40} className="h-10 w-10 object-contain" />
        <span className="font-display font-bold text-white">DECORUM Admin</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {sections.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-brand-800 text-white" : "text-brand-300 hover:bg-brand-900 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-brand-800 p-4">
        <Link href="/" className="mb-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-brand-300 hover:bg-brand-900 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>
        <button
          onClick={() => { logout(); router.push("/"); }}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-brand-300 hover:bg-brand-900 hover:text-white"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-brand-50/50">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 bg-brand-950 lg:block">{sidebar}</aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-brand-950/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-brand-950 shadow-xl">{sidebar}</aside>
          <button className="absolute right-4 top-4 rounded-md bg-surface p-2" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5 text-ink" />
          </button>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-brand-100 bg-surface px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button className="rounded-md p-2 text-brand-700 hover:bg-brand-50 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-display text-lg font-bold text-ink">Administration</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-md p-2 text-brand-700 hover:bg-brand-50" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-800 text-sm font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <span className="hidden text-sm font-medium text-ink sm:block">{user?.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}