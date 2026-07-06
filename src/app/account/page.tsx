"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { Crown, Package, Heart, LogOut } from "lucide-react";
import { useMounted } from "@/lib/hooks/use-mounted";
import { priceClass } from "@/lib/products";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import type { Order } from "@/lib/data/order-types";
import { calcClubPoints } from "@/lib/store/user";

const STATUS_LABEL: Record<Order["status"], string> = {
  pending: "ממתין",
  confirmed: "אושר",
  shipped: "נשלח",
  delivered: "נמסר",
};

export default function AccountPage() {
  const mounted = useMounted();
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      const res = await fetch("/api/orders/me");
      if (cancelled) return;
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders ?? []);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [status]);

  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  const points = calcClubPoints(totalSpent);

  if (!mounted || status === "loading") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-8 text-2xl font-bold text-white">החשבון שלי</h1>
        <p className="text-white/40">טוען...</p>
      </div>
    );
  }

  if (status !== "authenticated" || !session?.user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-8 text-2xl font-bold text-white">החשבון שלי</h1>
        <div className="neon-border-pink mx-auto max-w-sm rounded-xl bg-black/50 p-8 text-center">
          <p className="mb-6 text-sm text-white/55">התחבר עם Google לצפייה בהזמנות ומועדון VIP</p>
          <GoogleSignInButton callbackUrl="/account" />
          <p className="mt-4 text-xs text-white/35">
            הזמנות יוצגו לפי האימייל שבו ביצעת רכישה
          </p>
        </div>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-white">החשבון שלי</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="neon-border-pink rounded-xl bg-black/50 p-5 sm:col-span-1">
          <div className="flex items-center gap-3">
            {user.image ? (
              <Image
                src={user.image}
                alt=""
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : null}
            <div>
              <p className="text-xs text-white/40">שלום</p>
              <p className="font-semibold text-white">{user.name ?? user.email}</p>
            </div>
          </div>
        </div>
        <div className="neon-border-blue rounded-xl bg-black/50 p-5">
          <div className="flex items-center gap-2 text-[#27B8FF]">
            <Crown size={16} />
            <span className="text-xs">נקודות VIP</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-white">{points}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/50 p-5">
          <div className="flex items-center gap-2 text-white/50">
            <Package size={16} />
            <span className="text-xs">הזמנות</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-white">{orders.length}</p>
        </div>
      </div>

      {user.role === "admin" && (
        <Link
          href="/admin"
          className="mb-6 inline-flex rounded-lg border border-[#FF2EA6]/30 bg-[#FF2EA6]/10 px-4 py-2 text-sm text-[#FF2EA6] hover:bg-[#FF2EA6]/20"
        >
          לפאנל ניהול החנות ←
        </Link>
      )}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-white">היסטוריית הזמנות</h2>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-1 text-xs text-white/40 hover:text-red-400"
        >
          <LogOut size={14} />
          התנתק
        </button>
      </div>

      {loading ? (
        <p className="text-white/40">טוען...</p>
      ) : orders.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-black/40 p-8 text-center text-white/40">
          אין הזמנות עדיין. ודא/י שהזמנת עם אותו אימייל Google ({user.email})
        </p>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id} className="rounded-xl border border-white/10 bg-black/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-white">{o.id}</p>
                  <p className="text-xs text-white/40">{new Date(o.createdAt).toLocaleString("he-IL")}</p>
                </div>
                <div className="text-left">
                  <p className={priceClass}>₪{o.total}</p>
                  <p className="text-xs text-[#27B8FF]">{STATUS_LABEL[o.status]}</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-white/45">
                {o.items.length} פריטים ·{" "}
                {o.paymentMethod === "cod" ? "מזומן" : o.paymentMethod === "bit" ? "Bit" : "כרטיס"}
              </p>
            </li>
          ))}
        </ul>
      )}

      <Link href="/account/wishlist" className="mt-8 inline-flex items-center gap-2 text-sm text-white/50 hover:text-[#FF2EA6]">
        <Heart size={16} />
        המועדפים שלי
      </Link>
    </div>
  );
}
