"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import type { SiteContent } from "@/lib/data/types";

export function AdminContentManager() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then(setContent)
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!content) return;
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    if (res.ok) {
      setContent(await res.json());
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const inputCls =
    "w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-[#FF2EA6]/40";

  const field = (key: keyof SiteContent, label: string, multiline = false) => {
    if (!content) return null;
    const val = content[key];
    return (
      <label key={key} className="block">
        <span className="mb-1 block text-xs text-white/50">{label}</span>
        {multiline ? (
          <textarea
            rows={3}
            className={inputCls}
            value={String(val)}
            onChange={(e) => setContent({ ...content, [key]: e.target.value })}
          />
        ) : typeof val === "number" ? (
          <input
            type="number"
            className={inputCls}
            value={val}
            onChange={(e) => setContent({ ...content, [key]: Number(e.target.value) })}
          />
        ) : (
          <input
            className={inputCls}
            value={String(val)}
            onChange={(e) => setContent({ ...content, [key]: e.target.value })}
          />
        )}
      </label>
    );
  };

  if (loading || !content) {
    return <p className="text-white/40">טוען...</p>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">תוכן ומלל</h1>
          <p className="mt-1 text-sm text-white/40">עריכת טקסטים, מחירי משלוח ופרטי קשר</p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="neon-border-pink flex items-center gap-2 rounded-lg bg-[#FF2EA6]/10 px-5 py-2 text-sm font-medium text-white hover:glow-pink disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "שומר..." : saved ? "נשמר ✓" : "שמור שינויים"}
        </button>
      </div>

      <div className="space-y-8">
        <section className="neon-border-pink rounded-xl bg-black/40 p-5">
          <h2 className="mb-4 text-sm font-semibold text-[#FF2EA6]">דף הבית — Hero</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {field("heroTagline", "כותרת משנה (tagline)")}
            {field("heroCta", "טקסט כפתור CTA")}
          </div>
        </section>

        <section className="neon-border-blue rounded-xl bg-black/40 p-5">
          <h2 className="mb-4 text-sm font-semibold text-[#27B8FF]">באנר משלוח</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {field("promoTitle", "כותרת באנר")}
            {field("promoSubtitle", "תת-כותרת")}
            {field("freeShippingThreshold", "סף משלוח חינם (₪)")}
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-black/40 p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">פרטי קשר</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {field("contactPhone", "טלפון")}
            {field("contactWhatsapp", "WhatsApp (מספר בינלאומי)")}
            {field("contactEmail", "אימייל")}
            {field("contactAddress", "כתובת")}
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-black/40 p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">טקסטים כלליים</h2>
          <div className="grid gap-4">
            {field("aboutText", "אודות", true)}
            {field("footerText", "פוטר", true)}
          </div>
        </section>
      </div>
    </div>
  );
}
