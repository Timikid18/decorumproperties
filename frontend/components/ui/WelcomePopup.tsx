"use client";

import { useEffect, useRef, useState } from "react";
import { X, Sparkles } from "lucide-react";

const KEY = "decorum-welcome-seen";
const AUTO_DISMISS_MS = 5000;
const FADE_MS = 400;

export function WelcomePopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const shown = useRef(false);

  // StrictMode-safe mount check — ref prevents double-fire
  useEffect(() => {
    if (shown.current) return;
    shown.current = true;
    if (sessionStorage.getItem(KEY)) return;
    setVisible(true);
  }, []);

  // Auto-dismiss timer (separate effect so it survives StrictMode cleanup)
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setClosing(true), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [visible]);

  // Close animation completion
  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(KEY, "1");
    }, FADE_MS);
    return () => clearTimeout(t);
  }, [closing]);

  const dismiss = () => setClosing(true);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-[400ms] ease-out ${closing ? "opacity-0" : "opacity-100"}`}
      aria-modal="true"
    >
      {/* backdrop */}
      <div
        className={`absolute inset-0 bg-brand-950/60 backdrop-blur-sm transition-opacity duration-[400ms] ${closing ? "opacity-0" : "opacity-100"}`}
        onClick={dismiss}
      />

      {/* card */}
      <div
        className={`relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-[400ms] ease-out ${closing ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
      >
        {/* decorative header */}
        <div className="relative bg-brand-800 px-6 pt-8 pb-14 text-center text-white">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <Sparkles className="h-3.5 w-3.5 text-accent-400" />
            Welcome
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight">
            Discover DECORUM
          </h2>
          <p className="mt-1 text-sm text-brand-200">
            Buy. Sell. Own — effortlessly.
          </p>
          <div className="absolute -bottom-6 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-md ring-4 ring-white">
            <Sparkles className="h-5 w-5 text-brand-700" />
          </div>
        </div>

        {/* body */}
        <div className="px-6 pb-6 pt-8 text-center">
          <p className="text-sm leading-relaxed text-brand-600">
            Browse verified listings for properties, vehicles, gadgets and more
            — or submit your own and reach serious buyers today.
          </p>
          <button
            onClick={dismiss}
            className="mt-5 rounded-lg bg-brand-800 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-900 active:scale-[0.98]"
          >
            Start Exploring
          </button>
          <p className="mt-3 text-xs text-brand-400">
            Auto-closing in a few seconds…
          </p>
        </div>

        {/* close button */}
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
