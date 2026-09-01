"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input, Label, FieldError } from "@/components/ui/form";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    if (form.password !== form.password_confirmation) {
      setErrors({ password_confirmation: "Passwords do not match." });
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast("Account created. Welcome to DECORUM!", "success");
      router.push("/");
      router.refresh();
    } catch (err) {
      if (err instanceof Error && "errors" in err && (err as { errors: Record<string, string[]> }).errors) {
        const fieldErrors = (err as { errors: Record<string, string[]> }).errors;
        setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k, v[0]])));
      } else {
        setErrors({ form: err instanceof Error ? err.message : "Unable to create your account." });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-lg border border-brand-100 bg-white p-8 shadow-card">
        <h1 className="text-center font-display text-2xl font-bold text-brand-950">Create Account</h1>
        <p className="mt-2 text-center text-sm text-brand-500">
          Join DECORUM to save favorites and track your enquiries.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {errors.form && <FieldError message={errors.form} />}
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
            <FieldError message={errors.name} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            <FieldError message={errors.email} />
          </div>
          <div>
            <Label htmlFor="phone">Phone / WhatsApp</Label>
            <Input id="phone" value={form.phone} onChange={(e) => { setForm({ ...form, phone: e.target.value, whatsapp: e.target.value }); }} placeholder="0706 652 7982" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Minimum 8 characters" />
            <FieldError message={errors.password} />
          </div>
          <div>
            <Label htmlFor="password_confirmation">Confirm Password</Label>
            <Input id="password_confirmation" type="password" required value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} placeholder="Re-enter password" />
            <FieldError message={errors.password_confirmation} />
          </div>
          <Button type="submit" className="w-full" loading={loading}>
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-brand-700 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}