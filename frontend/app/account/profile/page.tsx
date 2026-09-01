"use client";

import { useState } from "react";
import { User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { updateProfile, updatePassword } from "@/services/auth";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input, Label, FieldError } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/Card";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState({ name: user?.name ?? "", phone: user?.phone ?? "", whatsapp: user?.whatsapp ?? "" });
  const [saving, setSaving] = useState(false);
  const [pwd, setPwd] = useState({ current_password: "", password: "", password_confirmation: "" });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdError, setPwdError] = useState("");

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateProfile(profile);
      updateUser(updated);
      toast("Profile updated.", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Unable to update profile.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwdError("");
    if (pwd.password !== pwd.password_confirmation) {
      setPwdError("New passwords do not match.");
      return;
    }
    setPwdSaving(true);
    try {
      await updatePassword(pwd.current_password, pwd.password, pwd.password_confirmation);
      toast("Password updated.", "success");
      setPwd({ current_password: "", password: "", password_confirmation: "" });
    } catch (err) {
      setPwdError(err instanceof Error ? err.message : "Unable to update password.");
    } finally {
      setPwdSaving(false);
    }
  }

  if (!user) return null;

  return (
    <div>
      <h1 className="mb-6 flex items-center gap-2 font-display text-2xl font-bold text-brand-950">
        <UserIcon className="h-6 w-6 text-brand-700" /> My Profile
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent>
            <h2 className="mb-4 text-lg font-bold text-brand-950">Personal Information</h2>
            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="p-phone">Phone</Label>
                <Input id="p-phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="p-whatsapp">WhatsApp</Label>
                <Input id="p-whatsapp" value={profile.whatsapp} onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="p-email">Email</Label>
                <Input id="p-email" value={user.email} disabled />
              </div>
              <Button type="submit" loading={saving}>Save Changes</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="mb-4 text-lg font-bold text-brand-950">Change Password</h2>
            <form onSubmit={savePassword} className="space-y-4">
              {pwdError && <FieldError message={pwdError} />}
              <div>
                <Label htmlFor="pw-current">Current Password</Label>
                <Input id="pw-current" type="password" value={pwd.current_password} onChange={(e) => setPwd({ ...pwd, current_password: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="pw-new">New Password</Label>
                <Input id="pw-new" type="password" value={pwd.password} onChange={(e) => setPwd({ ...pwd, password: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="pw-confirm">Confirm New Password</Label>
                <Input id="pw-confirm" type="password" value={pwd.password_confirmation} onChange={(e) => setPwd({ ...pwd, password_confirmation: e.target.value })} />
              </div>
              <Button type="submit" loading={pwdSaving}>Update Password</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}