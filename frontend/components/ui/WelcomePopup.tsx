"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, Sparkles, X } from "lucide-react";

const AUTO_DISMISS_MS = 9000;
const FADE_MS = 400;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// The flyer is a monthly campaign — remember dismissal per month so a returning
// visitor still sees the next month's flyer, and new visitors see this month's.
function flyerStorageKey(): string {
  try {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `decorum-flyer-seen-${now.getFullYear()}${month}`;
  } catch {
    return "decorum-flyer-seen";
  }
}

export function WelcomePopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [imgError, setImgError] = useState(false);
  const shown = useRef(false);

  const monthLabel = useMemo(() => MONTH_NAMES[new Date().getMonth()], []);

  // StrictMode-safe mount check — ref prevents double-fire.
  useEffect(() => {
    if (shown.current) return;
    shown.current = true;
    try {
      if (localStorage.getItem(flyerStorageKey())) return;
      localStorage.setItem(flyerStorageKey(), "1");
    } catch {
      // storage unavailable — still show once per session via state only
    }
    setVisible(true);
  }, []);

  // Auto-dismiss timer (separate effect so it survives StrictMode cleanup).
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setClosing(true), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [visible]);

  // Close animation completion.
  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(() => setVisible(false), FADE_MS);
    return () => clearTimeout(t);
  }, [closing]);

  const dismiss = () => setClosing(true);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-[400ms] ease-out ${closing ? "opacity-0" : "opacity-100"}`}
      aria-modal="true"
      role="dialog"
      aria-label="This month's flyer"
    >
      {/* backdrop */}
      <div
        className={`absolute inset-0 bg-brand-950/70 backdrop-blur-sm transition-opacity duration-[400ms] ${closing ? "opacity-0" : "opacity-100"}`}
        onClick={dismiss}
      />

      {/* square flyer card */}
      <div
        className={`relative z-10 aspect-square w-full max-w-sm overflow-hidden rounded-2xl bg-surface shadow-2xl ring-1 ring-brand-100/60 transition-all duration-[400ms] ease-out ${closing ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
      >
        {imgError ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-brand-50 p-6 text-center">
            <CalendarDays className="h-8 w-8 text-brand-400" />
            <p className="text-sm font-semibold text-brand-800">
              {monthLabel} offers are here
            </p>
            <p className="text-xs text-brand-500">
              The flyer could not be previewed. Visit the listings to see this
              month&apos;s offers.
            </p>
            <Link
              href="/listings"
              onClick={dismiss}
              className="mt-1 rounded-lg bg-brand-800 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-900"
            >
              Browse Offers
            </Link>
          </div>
        ) : (
          <div className="relative h-full w-full">
            <Image
              src="/monthly-flyer.jpg"
              alt={`${monthLabel} new month flyer — DECORUM HOMES & PROPERTIES`}
              width={1080}
              height={1080}
              priority
              onError={() => setImgError(true)}
              className="h-full w-full object-cover"
            />

            {/* month chip */}
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-brand-950/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur">
              <CalendarDays className="h-3.5 w-3.5 text-accent-300" />
              {monthLabel} New Month
            </span>

            {/* browse CTA */}
            <Link
              href="/listings"
              onClick={dismiss}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-surface/95 px-4 py-2 text-sm font-semibold text-brand-800 shadow-md backdrop-blur transition-colors hover:bg-surface"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent-500" />
              Browse this month&apos;s offers
            </Link>
          </div>
        )}

        {/* close button */}
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand-950/70 text-white backdrop-blur transition-colors hover:bg-brand-950/90"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}