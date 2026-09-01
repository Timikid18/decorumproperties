"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getAdminSettings, updateAdminSettings } from "@/services/admin";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/Feedback";
import { Card, CardContent } from "@/components/ui/Card";

type Row = { key: string; value: unknown; group: string; is_public?: boolean };

const GROUP_ORDER = ["brand", "contact", "social", "homepage"];
const ARRAY_KEYS = new Set(["phone", "whatsapp"]);
const TEXTAREA_KEYS = new Set(["address", "hero_subheadline", "map_embed_url"]);

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    getAdminSettings()
      .then(setRows)
      .catch(() => setRows([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const groups = useMemo(() => {
    if (!rows) return [];
    const map = new Map<string, Row[]>();
    for (const row of rows) {
      const group = row.group || "general";
      if (!map.has(group)) map.set(group, []);
      map.get(group)!.push(row);
    }
    return [...map.entries()].sort(
      (a, b) => (GROUP_ORDER.indexOf(a[0]) + 1 || 99) - (GROUP_ORDER.indexOf(b[0]) + 1 || 99),
    );
  }, [rows]);

  function update(key: string, value: unknown) {
    setRows((prev) => prev?.map((r) => (r.key === key ? { ...r, value } : r)) ?? prev);
  }

  async function save() {
    if (!rows) return;
    setSaving(true);
    try {
      const settings: Record<string, unknown> = {};
      for (const row of rows) {
        if (row.key === "logo" || row.key === "favicon") continue;
        settings[row.key] = row.value;
      }
      await updateAdminSettings(settings);
      toast("Settings saved.", "success");
    } catch {
      toast("Unable to save settings.", "error");
    } finally {
      setSaving(false);
    }
  }

  const groupLabel = (g: string) => g.charAt(0).toUpperCase() + g.slice(1);

  if (!rows) return <Skeleton className="h-96" />;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Site Settings</h2>
          <p className="text-sm text-brand-500">Update business information shown across the site.</p>
        </div>
        <Button onClick={save} loading={saving}>Save Changes</Button>
      </div>

      {groups.map(([group, groupRows]) => (
        <Card key={group}>
          <CardContent>
            <h3 className="mb-4 font-bold text-ink">{groupLabel(group)}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {groupRows.map((row) => {
                if (ARRAY_KEYS.has(row.key)) {
                  const arr = Array.isArray(row.value) ? row.value : [];
                  return (
                    <div key={row.key} className="sm:col-span-2">
                      <Label htmlFor={row.key}>{row.key.replace(/_/g, " ")}</Label>
                      <Input
                        id={row.key}
                        value={arr.join(", ")}
                        onChange={(e) => update(row.key, e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                      />
                    </div>
                  );
                }
                if (TEXTAREA_KEYS.has(row.key) || (typeof row.value === "string" && row.value.length > 80)) {
                  return (
                    <div key={row.key} className="sm:col-span-2">
                      <Label htmlFor={row.key}>{row.key.replace(/_/g, " ")}</Label>
                      <Textarea id={row.key} rows={3} value={String(row.value ?? "")} onChange={(e) => update(row.key, e.target.value)} />
                    </div>
                  );
                }
                return (
                  <div key={row.key}>
                    <Label htmlFor={row.key}>{row.key.replace(/_/g, " ")}</Label>
                    <Input id={row.key} value={String(row.value ?? "")} onChange={(e) => update(row.key, e.target.value)} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}