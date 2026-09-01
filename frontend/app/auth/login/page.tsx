"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input, Label, FieldError } from "@/components/ui/form";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { settings } = useSiteSettings();
  const { toast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast("Welcome back!", "success");
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in. Please check your details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-lg border border-brand-100 bg-surface p-8 shadow-card">
        <h1 className="text-center font-display text-2xl font-bold text-ink">Sign In</h1>
        <p className="mt-2 text-center text-sm text-brand-500">
          Welcome back to {settings.business_name || "DECORUM"}.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && <FieldError message={error} />}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <Label className="mb-0">Password</Label>
              <Link href="/auth/forgot-password" className="text-xs font-medium text-brand-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input id="password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full" loading={loading}>
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-500">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-semibold text-brand-700 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}