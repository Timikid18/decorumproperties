"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getSiteSettings } from "@/services/siteSettings";
import { SiteSettings } from "@/types";
import { BUSINESS } from "@/lib/constants";

interface SiteSettingsContextValue {
  settings: SiteSettings;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

const FALLBACK: SiteSettings = {
  business_name: BUSINESS.name,
  slogan: BUSINESS.slogan,
  address: BUSINESS.address,
  phone: [...BUSINESS.phones],
  whatsapp: [...BUSINESS.whatsappNumbers],
  email: BUSINESS.email,
  phone_links: BUSINESS.phones.map(toWa),
  whatsapp_links: BUSINESS.whatsappNumbers.map(toWa),
  hero_headline: "Buy. Sell. Own. Declutter.",
  hero_subheadline:
    "From lands and homes to cars, gadgets, appliances and fairly used items — DECORUM makes buying and selling simple.",
};

function toWa(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("234") ? digits : "234" + digits.slice(1);
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(FALLBACK);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await getSiteSettings();
      setSettings({ ...FALLBACK, ...data });
    } catch {
      setSettings(FALLBACK);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const value = useMemo(
    () => ({ settings, loading, refresh }),
    [settings, loading, refresh],
  );

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings(): SiteSettingsContextValue {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  return ctx;
}