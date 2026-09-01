import Link from "next/link";
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { BUSINESS, NAV_LINKS } from "@/lib/constants";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { buildWhatsAppLink, buildTelLink } from "@/lib/utils";

export function Footer() {
  const { settings } = useSiteSettings();
  const year = new Date().getFullYear();

  const phone = settings.phone_links?.[0];
  const whatsapp = settings.whatsapp_links?.[0];
  const whatsappMsg = encodeURIComponent(
    `Hello ${settings.business_name || BUSINESS.name}, I would like to make an enquiry.`,
  );

  return (
    <footer className="border-t border-brand-100 bg-brand-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white font-display text-sm font-bold text-brand-800">
                D
              </div>
              <span className="font-display text-lg font-bold tracking-tight">
                {settings.business_name || BUSINESS.shortName}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-brand-300">
              {settings.slogan || BUSINESS.slogan}
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-brand-300">
              {settings.address && (
                <span className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  {settings.address}
                </span>
              )}
              {phone && (
                <a href={buildTelLink(phone)} className="flex items-center gap-2 hover:text-white">
                  <Phone className="h-4 w-4" /> {phone}
                </a>
              )}
              {whatsapp && (
                <a
                  href={buildWhatsAppLink(whatsapp, whatsappMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              )}
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-white">
                  <Mail className="h-4 w-4" /> {settings.email}
                </a>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-white">Quick Links</h4>
            <ul className="mt-3 space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-brand-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-white">Account</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/auth/login" className="text-sm text-brand-300 hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-sm text-brand-300 hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/sell-to-us" className="text-sm text-brand-300 hover:text-white transition-colors">
                  Sell To Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-brand-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-white">Legal</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-brand-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-brand-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-brand-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-xs text-brand-400">
          <p>&copy; {year} {settings.business_name || BUSINESS.name}. All rights reserved.</p>
          <p>Built with care in Nigeria.</p>
        </div>
      </div>
    </footer>
  );
}