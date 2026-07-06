"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Save, GripVertical } from "lucide-react";
import type { Category } from "@/lib/data/types";

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const EMPTY: Category = { id: "", label: "", color: "blue", order: 0 };

export function AdminCategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    if (res.ok) setCategories(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/admin/categories");
      if (!cancelled && res.ok) setCategories(await res.json());
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openNew = () => {
    const maxOrder = categories.reduce((m, c) => Math.max(m, c.order), 0);
    setForm({ ...EMPTY, id: newId(), order: maxOrder + 1 });
  };

  const openEdit = (c: Category) => setForm({ ...c });

  const save = async () => {
    if (!form?.id || !form.label) return;
    setSaving(true);
    const slug = form.id.includes("-") ? form.id : form.label.toLowerCase().replace(/\s+/g, "-").slice(0, 30);
    const payload = { ...form, id: form.id || slug };
    const method = categories.some((c) => c.id === payload.id) ? "PUT" : "POST";
    await fetch("/api/admin/categories", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setForm(null);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("למחוק קטגוריה? מוצרים משויכים לא יימחקו.")) return;
    await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  };

  const inputCls =
    "w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-[#27B8FF]/40";

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">ניהול קטגוריות</h1>
        <button
          type="button"
          onClick={openNew}
          className="neon-border-blue flex items-center gap-2 rounded-lg bg-[#27B8FF]/10 px-4 py-2 text-sm font-medium text-white"
        >
          <Plus size={16} />
          קטגוריה חדשה
        </button>
      </div>

      {loading ? (
        <p className="text-white/40">טוען...</p>
      ) : (
        <div className="space-y-2">
          {[...categories]
            .sort((a, b) => a.order - b.order)
            .map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <GripVertical size={16} className="text-white/20" />
                  <span
                    className={`h-2 w-2 rounded-full ${c.color === "pink" ? "bg-[#FF2EA6]" : "bg-[#27B8FF]"}`}
                  />
                  <div>
                    <p className="font-medium text-white">{c.label}</p>
                    <p className="text-xs text-white/35">{c.id} · סדר {c.order}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => openEdit(c)} className="text-[#27B8FF] hover:text-white">
                    <Pencil size={16} />
                  </button>
                  <button type="button" onClick={() => remove(c.id)} className="text-red-400/70 hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="neon-border-blue w-full max-w-md rounded-2xl bg-[#0a0c10] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">קטגוריה</h2>
              <button type="button" onClick={() => setForm(null)} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs text-white/50">מזהה (slug)</span>
                <input
                  className={inputCls}
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-white/50">שם תצוגה *</span>
                <input className={inputCls} value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-white/50">צבע נאון</span>
                <select
                  className={inputCls}
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value as Category["color"] })}
                >
                  <option value="blue">כחול</option>
                  <option value="pink">ורוד</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-white/50">סדר תצוגה</span>
                <input
                  type="number"
                  className={inputCls}
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setForm(null)} className="text-sm text-white/50">
                ביטול
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving || !form.label}
                className="neon-border-blue flex items-center gap-2 rounded-lg bg-[#27B8FF]/10 px-5 py-2 text-sm text-white disabled:opacity-50"
              >
                <Save size={16} />
                שמור
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
