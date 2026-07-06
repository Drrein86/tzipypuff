"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductThumb } from "@/components/ui/ProductThumb";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, Truck, CreditCard, Banknote, Smartphone } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useUserStore } from "@/lib/store/user";
import { NeonButton } from "@/components/ui/NeonButton";
import { priceClass } from "@/lib/products";
import type { PaymentMethod } from "@/lib/data/order-types";
import { SHIPPING_COST } from "@/lib/orders/constants";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, total, clearCart } = useCartStore();
  const setProfile = useUserStore((s) => s.setProfile);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentCancelled] = useState(
    () =>
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("cancelled") === "1"
  );
  const [freeThreshold, setFreeThreshold] = useState(200);
  const [stripeEnabled, setStripeEnabled] = useState(false);

  useEffect(() => {
    fetch("/api/checkout/config")
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.freeShippingThreshold === "number") {
          setFreeThreshold(data.freeShippingThreshold);
        }
        if (data.stripeEnabled) {
          setStripeEnabled(true);
        }
      })
      .catch(() => {});
  }, []);

  const subtotal = total();
  const shipping = subtotal >= freeThreshold ? 0 : SHIPPING_COST;
  const grandTotal = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white">העגלה ריקה</h1>
        <p className="mt-3 text-white/50">הוסף מוצרים לפני התשלום</p>
        <NeonButton href="/catalog" className="mt-8">
          למוצרים
        </NeonButton>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError("יש לאשר את התקנון לפני ביצוע ההזמנה");
      return;
    }
    setLoading(true);
    setError("");

    const payload = {
      customer: { name, phone, email, city, address, notes },
      items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
      paymentMethod: payment,
    };

    if (payment === "card" && stripeEnabled) {
      if (!email.trim()) {
        setError("אימייל נדרש לתשלום בכרטיס");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      setLoading(false);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "שגיאה ביצירת תשלום");
        return;
      }
      const { url } = await res.json();
      if (url) {
        setProfile(phone, name);
        clearCart();
        window.location.href = url;
      }
      return;
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "שגיאה בשליחת ההזמנה. נסה שוב.");
      return;
    }

    const order = await res.json();
    setProfile(phone, name);
    clearCart();
    router.push(`/checkout/success?id=${order.id}`);
  };

  const inputCls =
    "w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-[#27B8FF]/40";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-white">תשלום והזמנה</h1>

      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <section className="neon-border-blue rounded-xl bg-black/40 p-5">
            <h2 className="mb-4 text-sm font-semibold text-[#27B8FF]">פרטי משלוח</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-1 block text-xs text-white/45">שם מלא *</span>
                <input required className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label>
                <span className="mb-1 block text-xs text-white/45">טלפון *</span>
                <input required type="tel" className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>
              <label>
                <span className="mb-1 block text-xs text-white/45">
                  אימייל{payment === "card" && stripeEnabled ? " *" : ""}
                </span>
                <input
                  type="email"
                  required={payment === "card" && stripeEnabled}
                  className={inputCls}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label>
                <span className="mb-1 block text-xs text-white/45">עיר *</span>
                <input required className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} />
              </label>
              <label>
                <span className="mb-1 block text-xs text-white/45">כתובת *</span>
                <input required className={inputCls} value={address} onChange={(e) => setAddress(e.target.value)} />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1 block text-xs text-white/45">הערות</span>
                <textarea rows={2} className={inputCls} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-black/40 p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">אמצעי תשלום</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { id: "cod" as const, label: "מזומן", icon: Banknote, desc: "תשלום בעת המסירה" },
                { id: "bit" as const, label: "Bit", icon: Smartphone, desc: "קישור תשלום ב-SMS" },
                { id: "card" as const, label: "כרטיס אשראי", icon: CreditCard, desc: stripeEnabled ? "תשלום מאובטח ב-Stripe" : "אישור טלפוני" },
              ].map(({ id, label, icon: Icon, desc }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPayment(id)}
                  className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-sm transition-all ${
                    payment === id
                      ? "border-[#FF2EA6]/50 bg-[#FF2EA6]/10 text-white"
                      : "border-white/10 text-white/55 hover:border-white/20"
                  }`}
                >
                  <span className="flex items-center gap-2 font-medium">
                    <Icon size={18} />
                    {label}
                  </span>
                  <span className="text-[10px] text-white/40">{desc}</span>
                </button>
              ))}
            </div>
            {payment === "bit" && (
              <p className="mt-3 text-xs text-[#27B8FF]/80">
                לאחר אישור ההזמנה נשלח אליך קישור Bit לתשלום.
              </p>
            )}
            {payment === "card" && (
              <p className="mt-3 text-xs text-[#27B8FF]/80">
                {stripeEnabled
                  ? "תועבר/י לדף תשלום מאובטח. נדרש אימייל."
                  : "ניצור איתך קשר טלפוני לאישור תשלום מאובטח."}
              </p>
            )}
          </section>
        </div>

        <aside className="lg:col-span-2">
          <div className="neon-border-pink sticky top-28 rounded-xl bg-black/50 p-5">
            <h2 className="mb-4 font-semibold text-white">סיכום הזמנה</h2>
            <ul className="mb-4 max-h-64 space-y-3 overflow-y-auto">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 border-b border-white/5 pb-3">
                  <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-md bg-[#0a0c10]">
                    <ProductThumb src={item.image} alt={item.nameHe} className="object-contain p-0.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-white/85">{item.nameHe}</p>
                    <p className={`text-xs ${priceClass}`}>₪{item.price}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-white/40">
                        <Minus size={12} />
                      </button>
                      <span className="text-xs">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-white/40">
                        <Plus size={12} />
                      </button>
                      <button type="button" onClick={() => removeItem(item.id)} className="mr-auto text-white/30 hover:text-red-400">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-2 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between text-white/60">
                <span>סכום ביניים</span>
                <span>₪{subtotal}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span className="flex items-center gap-1">
                  <Truck size={14} />
                  משלוח
                </span>
                <span>{shipping === 0 ? "חינם" : `₪${shipping}`}</span>
              </div>
              <div className="flex justify-between pt-2 text-base">
                <span className="text-white">סה״כ</span>
                <span className={priceClass}>₪{grandTotal}</span>
              </div>
            </div>

            {(error || paymentCancelled) && (
              <p className="mt-3 text-center text-sm text-red-400">
                {error ||
                  "התשלום בוטל. העגלה שלך שמורה — ניתן לנסות שוב."}
              </p>
            )}

            <label className="mt-4 flex cursor-pointer items-start gap-2 text-[11px] leading-relaxed text-white/45">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 accent-[#FF2EA6]"
              />
              <span>
                קראתי ואני מסכים/ה ל
                <Link href="/terms" className="mx-0.5 text-[#27B8FF] hover:underline">
                  תקנון
                </Link>
                ול
                <Link href="/privacy" className="mx-0.5 text-[#27B8FF] hover:underline">
                  מדיניות הפרטיות
                </Link>
                . אני מצהיר/ה כי גילי 18+.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !acceptedTerms}
              className="neon-border-pink mt-5 w-full rounded-xl bg-[#FF2EA6]/10 py-3.5 text-sm font-semibold text-white hover:glow-pink disabled:opacity-50"
            >
              {loading
                ? payment === "card" && stripeEnabled
                  ? "מעביר לתשלום..."
                  : "שולח הזמנה..."
                : payment === "card" && stripeEnabled
                  ? "המשך לתשלום"
                  : "אשר הזמנה"}
            </button>

            <p className="mt-3 text-center text-[10px] text-white/30">
              {subtotal >= freeThreshold ? "🎉 זכאי למשלוח חינם!" : `משלוח חינם מ-₪${freeThreshold}`}
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
