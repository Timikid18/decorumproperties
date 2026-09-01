"use client";

import { useCallback, useEffect, useState } from "react";
import { Category } from "@/types";
import { getAdminCategories, createAdminCategory, updateAdminCategory, deleteAdminCategory } from "@/services/admin";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/form";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Skeleton, EmptyState } from "@/components/ui/Feedback";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const TYPES = ["property", "land", "automobile", "gadget", "appliance", "furniture", "electronics", "other"];

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", type: "", is_featured: false });

  const load = useCallback(() => {
    getAdminCategories()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm({ name: "", type: "", is_featured: false });
    setModalOpen(true);
  }
  function openEdit(cat: Category) {
    setEditing(cat);
    setForm({ name: cat.name, type: cat.type ?? "", is_featured: cat.is_featured ?? false });
    setModalOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editing) {
        await updateAdminCategory(editing.id, { name: form.name, type: form.type || undefined, is_featured: form.is_featured });
        toast("Category updated.", "success");
      } else {
        await createAdminCategory({ name: form.name, type: form.type || undefined, is_featured: form.is_featured });
        toast("Category created.", "success");
      }
      setModalOpen(false);
      load();
    } catch {
      toast("Unable to save category.", "error");
    }
  }

  async function remove(cat: Category) {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await deleteAdminCategory(cat.id);
      toast("Category deleted.", "success");
      load();
    } catch {
      toast("Unable to delete category.", "error");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Categories</h2>
          <p className="text-sm text-brand-500">Organise listings into browsable categories.</p>
        </div>
        <Button onClick={openCreate}>New Category</Button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState title="No categories" description="Create your first category to organise listings." action={<Button onClick={openCreate}>New Category</Button>} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((cat) => (
            <Card key={cat.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-ink">{cat.name}</h3>
                    {cat.group && <p className="text-xs text-brand-400">{cat.group.name}</p>}
                  </div>
                  {cat.is_featured && <Badge tone="amber">Featured</Badge>}
                </div>
                {cat.type && <Badge tone="slate" className="mt-2">{cat.type}</Badge>}
                <div className="mt-3 flex gap-2 border-t border-brand-100 pt-3">
                  <Button variant="outline" size="sm" onClick={() => openEdit(cat)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => remove(cat)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Category" : "New Category"}>
        <form onSubmit={save} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="type">Listing Type</Label>
            <Select id="type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="">None</option>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="h-4 w-4 accent-brand-700" />
            Featured category
          </label>
          <div className="flex justify-end gap-2 border-t border-brand-100 pt-4">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}