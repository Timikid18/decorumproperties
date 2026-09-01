"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Heart, ClipboardList, MessagesSquare, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/Feedback";
import { cn } from "@/lib/utils";

const ACCOUNT_LINKS = [
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "My Sell Requests", href: "/account/sell-requests", icon: ClipboardList },
  { label: "My Enquiries", href: "/account/enquiries", icon: MessagesSquare },
  { label: "Profile", href: "/account/profile", icon: User },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return <Spinner label="Checking your account…" className="py-24" />;
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[240px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <nav className="flex gap-1 overflow-x-auto rounded-lg border border-brand-100 bg-white p-2 lg:flex-col">
          {ACCOUNT_LINKS.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-brand-50 text-brand-800" : "text-brand-600 hover:bg-brand-50",
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}