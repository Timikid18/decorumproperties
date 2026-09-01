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

      {/* card */}
      <div
        className={`relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-surface shadow-2xl ring-1 ring-brand-100/60 transition-all duration-[400ms] ease-out ${closing ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
      >
        {/* header strip */}
        <div className="flex items-center justify-between gap-2 bg-brand-800 px-5 py-3 text-white">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-100">
            <CalendarDays className="h-4 w-4 text-accent-400" />
            {monthLabel} New Month Flyer
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            <Sparkles className="h-3 w-3" /> New
          </span>
        </div>

        {/* flyer */}
        {imgError ? (
          <div className="flex aspect-square w-full flex-col items-center justify-center gap-3 bg-brand-50 p-6 text-center">
            <CalendarDays className="h-8 w-8 text-brand-400" />
            <p className="text-sm font-semibold text-brand-800">
              {monthLabel} offers are here
            </p>
            <p className="text-xs text-brand-500">
              The flyer could not be previewed. Visit the listings to see this
              month&apos;s offers.
            </p>
          </div>
        ) : (
          <Image
            src="/monthly-flyer.jpg"
            alt={`${monthLabel} new month flyer — DECORUM HOMES & PROPERTIES`}
            width={1080}
            height={1080}
            priority
            onError={() => setImgError(true)}
            className="h-auto w-full"
          />
        )}

        {/* body */}
        <div className="px-5 pb-5 pt-4 text-center">
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">
            This month, own something new
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-brand-600">
            Browse verified properties, vehicles, gadgets and more — or submit
            your own and reach serious buyers today.
          </p>
          <Link
            href="/listings"
            onClick={dismiss}
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-brand-800 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-900 active:scale-[0.98]"
          >
            Browse Offers
          </Link>
          <p className="mt-3 text-xs text-brand-400">
            Auto-closing in a few seconds… tap anywhere to close.
          </p>
        </div>

        {/* close button */}
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-surface/15 text-white backdrop-blur transition-colors hover:bg-surface/30"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}