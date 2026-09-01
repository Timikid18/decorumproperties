"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertTone = "success" | "error" | "info";

interface Alert {
  id: number;
  tone: AlertTone;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, tone?: AlertTone) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const remove = useCallback((id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, tone: AlertTone = "info") => {
      const id = Date.now() + Math.random();
      setAlerts((prev) => [...prev, { id, tone, message }]);
      window.setTimeout(() => remove(id), 5000);
    },
    [remove],
  );

  const success = useCallback((m: string) => toast(m, "success"), [toast]);
  const error = useCallback((m: string) => toast(m, "error"), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4">
        {alerts.map((a) => (
          <div
            key={a.id}
            role="status"
            className={cn(
              "pointer-events-auto flex max-w-md items-start gap-2.5 rounded-md border px-4 py-3 text-sm font-medium shadow-lg",
              a.tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
              a.tone === "error" && "border-accent-200 bg-accent-50 text-accent-800",
              a.tone === "info" && "border-sky-200 bg-sky-50 text-sky-800",
            )}
          >
            {a.tone === "success" && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />}
            {a.tone === "error" && <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />}
            {a.tone === "info" && <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />}
            <span>{a.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}