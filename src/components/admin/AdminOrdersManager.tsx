"use client";

import { useEffect, useState } from "react";
import type { Order, OrderStatus } from "@/lib/data/order-types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "ממתין",
  confirmed: "אושר",
  shipped: "נשלח",
  delivered: "נמסר",
};

const PAYMENT_LABELS: Record<string, string> = {
  cod: "מזומן",
  bit: "Bit",
  card: "כרטיס",
};

export function AdminOrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/admin/orders");
      if (!cancelled && res.ok) {
        const data = await res.json();
        setOrders(data.orders ?? []);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateStatus = async (id: string, status: OrderStatus) => {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await load();
  };

  if (loading) return <p className="text-white/40">טוען הזמנות...</p>;

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 py-16 text-center text-white/40">
        אין הזמנות עדיין
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="neon-border-blue rounded-xl bg-black/50 p-5">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-bold text-white">#{order.id}</p>
              <p className="text-xs text-white/40">
                {new Date(order.createdAt).toLocaleString("he-IL")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-[#C8A96A]">₪{order.total}</span>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                className="rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-sm text-white outline-none"
              >
                {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3 grid gap-2 text-sm sm:grid-cols-2">
            <p className="text-white/70">
              <span className="text-white/40">לקוח: </span>
              {order.customer.name} — {order.customer.phone}
            </p>
            <p className="text-white/70">
              <span className="text-white/40">כתובת: </span>
              {order.customer.city}, {order.customer.address}
            </p>
            {order.customer.email && (
              <p className="text-white/70">
                <span className="text-white/40">אימייל: </span>
                {order.customer.email}
              </p>
            )}
            <p className="text-white/70">
              <span className="text-white/40">תשלום: </span>
              {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
            </p>
          </div>

          <ul className="border-t border-white/5 pt-3 text-xs text-white/55">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between py-1">
                <span>
                  {item.nameHe} × {item.quantity}
                </span>
                <span>₪{item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
