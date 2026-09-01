"use client";

import { AuthProvider } from "@/hooks/useAuth";
import { SiteSettingsProvider } from "@/hooks/useSiteSettings";
import { ToastProvider } from "@/components/ui/Toast";
import { WelcomePopup } from "@/components/ui/WelcomePopup";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SiteSettingsProvider>
      <AuthProvider>
        <ToastProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <WelcomePopup />
        </ToastProvider>
      </AuthProvider>
    </SiteSettingsProvider>
  );
}