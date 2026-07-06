"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import type { Product, Category } from "@/lib/data/types";
import { STRENGTHS } from "@/lib/products";

const EMPTY: Product = {
  id: "",
  slug: "",
  name: "",
  nameHe: "",
  price: 0,
  brand: "",
  category: "accessories",
  inStock: true,
  onSale: false,
  featured: false,
  descriptionHe: "",
  specs: {},
  gradient: "from-zinc-800 to-black",
};

function specsToText(specs: Record<string, string>): string {
  return Object.entries(specs)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

function textToSpecs(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const idx = line.indexOf(":");
    if (idx > 0) out[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return out;
}

export function AdminProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [form, setForm] = useState<Product | null>(null);
  const [specsText, setSpecsText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    if (res.ok) {
      const data = await res.json();
      setProducts(data.products ?? []);
      setCategories(data.categories ?? []);
      setBrands(data.brands ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/admin/products");
      if (!cancelled && res.ok) {
        const data = await res.json();
        setProducts(data.products ?? []);
        setCategories(data.categories ?? []);
        setBrands(data.brands ?? []);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openNew = () => {
    setForm({ ...EMPTY, id: "" });
    setSpecsText("");
  };

  const openEdit = (p: Product) => {
    setForm({ ...p });
    setSpecsText(specsToText(p.specs));
  };

  const save = async () => {
    if (!form) return;
    setSaving(true);
    const payload = { ...form, specs: textToSpecs(specsText) };
    const method = form.id && products.some((p) => p.id === form.id) ? "PUT" : "POST";
    const res = await fetch("/api/admin/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setForm(null);
      await load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm("למחוק מוצר זה?")) return;
    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    if (res.ok) {
      const { url } = await res.json();
      setForm((f) => (f ? { ...f, image: url } : f));
    }
  };

  const filtered = products.filter(
    (p) =>
      !search ||
      p.nameHe.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const field = (label: string, el: React.ReactNode) => (
    <label className="block">
      <span className="mb-1 block text-xs text-white/50">{label}</span>
      {el}
    </label>
  );

  const inputCls =
    "w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-[#FF2EA6]/40";

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">ניהול מוצרים</h1>
        <button
          type="button"
          onClick={openNew}
          className="neon-border-pink flex items-center gap-2 rounded-lg bg-[#FF2EA6]/10 px-4 py-2 text-sm font-medium text-white hover:glow-pink"
        >
          <Plus size={16} />
          מוצר חדש
        </button>
      </div>

      <input
        type="search"
        placeholder="חיפוש מוצר..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`${inputCls} mb-4 max-w-md`}
      />

      {loading ? (
        <p className="text-white/40">טוען...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-black/60 text-right text-white/50">
                <th className="px-4 py-3 font-medium">שם</th>
                <th className="px-4 py-3 font-medium">מחיר</th>
                <th className="px-4 py-3 font-medium">קטגוריה</th>
                <th className="px-4 py-3 font-medium">מלאי</th>
                <th className="px-4 py-3 font-medium">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-white">{p.nameHe}</td>
                  <td className="px-4 py-3 text-[#C8A96A]">
                    ₪{p.salePrice ?? p.price}
                    {p.salePrice && (
                      <span className="mr-2 text-xs text-white/30 line-through">₪{p.price}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white/60">
                    {categories.find((c) => c.id === p.category)?.label ?? p.category}
                  </td>
                  <td className="px-4 py-3">
                    <span className={p.inStock ? "text-green-400" : "text-red-400"}>
                      {p.inStock ? "✓" : "אזל"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => openEdit(p)} className="text-[#27B8FF] hover:text-white">
                        <Pencil size={16} />
                      </button>
                      <button type="button" onClick={() => remove(p.id)} className="text-red-400/70 hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {form && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 pt-12">
          <div className="neon-border-pink w-full max-w-2xl rounded-2xl bg-[#0a0c10] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {form.id && products.some((p) => p.id === form.id) ? "עריכת מוצר" : "מוצר חדש"}
              </h2>
              <button type="button" onClick={() => setForm(null)} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {field(
                "שם בעברית *",
                <input className={inputCls} value={form.nameHe} onChange={(e) => setForm({ ...form, nameHe: e.target.value })} />
              )}
              {field(
                "שם באנגלית",
                <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              )}
              {field(
                "מחיר (₪) *",
                <input
                  type="number"
                  className={inputCls}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                />
              )}
              {field(
                "מחיר מבצע",
                <input
                  type="number"
                  className={inputCls}
                  value={form.salePrice ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, salePrice: e.target.value ? Number(e.target.value) : undefined, onSale: !!e.target.value })
                  }
                />
              )}
              {field(
                "מותג",
                <input
                  list="brands-list"
                  className={inputCls}
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                />
              )}
              {field(
                "קטגוריה",
                <select
                  className={inputCls}
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              )}
              {field(
                "טעם",
                <input className={inputCls} value={form.flavor ?? ""} onChange={(e) => setForm({ ...form, flavor: e.target.value })} />
              )}
              {field(
                "עוצמה",
                <select
                  className={inputCls}
                  value={form.strength ?? ""}
                  onChange={(e) => setForm({ ...form, strength: (e.target.value || undefined) as Product["strength"] })}
                >
                  <option value="">—</option>
                  {STRENGTHS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              )}
              {field(
                "Gradient (Tailwind)",
                <input className={inputCls} value={form.gradient} onChange={(e) => setForm({ ...form, gradient: e.target.value })} />
              )}
              {field(
                "תמונה",
                <div className="space-y-2">
                  <input
                    className={inputCls}
                    placeholder="/uploads/image.jpg"
                    value={form.image ?? ""}
                    onChange={(e) => setForm({ ...form, image: e.target.value || undefined })}
                  />
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-[#27B8FF] hover:text-white">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadImage(f);
                      }}
                    />
                    {uploading ? "מעלה..." : "העלה תמונה מהמחשב"}
                  </label>
                  {form.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.image} alt="" className="h-20 w-20 rounded-lg object-cover" />
                  )}
                </div>
              )}
            </div>

            <datalist id="brands-list">
              {brands.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>

            <div className="mt-4 flex flex-wrap gap-4">
              {(["inStock", "onSale", "featured"] as const).map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                    className="accent-[#FF2EA6]"
                  />
                  {key === "inStock" ? "במלאי" : key === "onSale" ? "מבצע" : "מומלץ"}
                </label>
              ))}
            </div>

            {field(
              "תיאור",
              <textarea
                rows={3}
                className={inputCls}
                value={form.descriptionHe}
                onChange={(e) => setForm({ ...form, descriptionHe: e.target.value })}
              />
            )}

            {field(
              "מפרט (שורה לכל שדה: מפתח: ערך)",
              <textarea rows={4} className={inputCls} value={specsText} onChange={(e) => setSpecsText(e.target.value)} />
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setForm(null)} className="rounded-lg px-4 py-2 text-sm text-white/50 hover:text-white">
                ביטול
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving || !form.nameHe}
                className="neon-border-pink flex items-center gap-2 rounded-lg bg-[#FF2EA6]/10 px-5 py-2 text-sm font-medium text-white hover:glow-pink disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "שומר..." : "שמור"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
