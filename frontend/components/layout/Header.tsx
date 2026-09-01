"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  Phone,
  MessageCircle,
  ChevronDown,
  User,
  LogOut,
  Heart,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { BUSINESS, NAV_LINKS } from "@/lib/constants";
import { cn, buildWhatsAppLink, buildTelLink } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { settings } = useSiteSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const phone = settings.phone_links?.[0];
  const whatsapp = settings.whatsapp_links?.[0];
  const whatsappMsg = encodeURIComponent(
    `Hello ${settings.business_name || BUSINESS.name}, I would like to make an enquiry.`,
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      {/* Top bar */}
      <div className="hidden bg-brand-800 text-white lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs">
          <p className="font-medium opacity-90">{settings.slogan || BUSINESS.slogan}</p>
          <div className="flex items-center gap-4">
            {phone && (
              <a href={buildTelLink(phone)} className="flex items-center gap-1 hover:underline">
                <Phone className="h-3 w-3" />
                {phone}
              </a>
            )}
            {whatsapp && (
              <a
                href={buildWhatsAppLink(whatsapp, whatsappMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline"
              >
                <MessageCircle className="h-3 w-3" />
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt={settings.business_name || BUSINESS.shortName} width={48} height={48} className="h-12 w-12 object-contain" />
          <span className="hidden font-display text-lg font-bold tracking-tight text-brand-900 sm:block">
            {settings.business_name || BUSINESS.shortName}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-50 text-brand-800"
                    : "text-brand-600 hover:bg-brand-50 hover:text-brand-800",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-md border border-brand-100 px-3 py-2 text-sm font-medium text-brand-800 transition-colors hover:bg-brand-50"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user?.name}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-brand-100 bg-white py-1 shadow-lg">
                    <Link
                      href="/account/wishlist"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-brand-700 hover:bg-brand-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Heart className="h-4 w-4" /> Wishlist
                    </Link>
                    <Link
                      href="/account/sell-requests"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-brand-700 hover:bg-brand-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Sell Requests
                    </Link>
                    <Link
                      href="/account/enquiries"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-brand-700 hover:bg-brand-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Enquiries
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-brand-700 hover:bg-brand-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" /> Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-brand-100" />
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-accent-600 hover:bg-accent-50"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          )}

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-brand-900 transition-colors hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-brand-100 bg-white lg:hidden">
          <nav className="flex flex-col gap-1 px-6 py-4" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand-50 text-brand-800"
                      : "text-brand-600 hover:bg-brand-50 hover:text-brand-800",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}