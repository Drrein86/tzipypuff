"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";

export default function CheckoutSuccessClient() {
  const params = useSearchParams();
  const orderId = params.get("id") ?? "";
  const paid = params.get("paid") === "1";

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <CheckCircle
        size={64}
        className="mx-auto text-green-400"
        style={{ filter: "drop-shadow(0 0 12px rgba(74,222,128,0.4))" }}
      />
      <h1 className="mt-6 text-2xl font-bold text-white">
        {paid ? "התשלום התקבל!" : "ההזמנה התקבלה!"}
      </h1>
      {orderId && (
        <p className="mt-2 text-sm text-white/50">
          מספר הזמנה: <span className="text-[#C8A96A]">{orderId}</span>
        </p>
      )}
      <p className="mt-4 text-sm leading-relaxed text-white/60">
        {paid
          ? "קיבלנו את התשלום ונתחיל לטפל בהזמנה. אישור נשלח לאימייל שלך."
          : "ניצור איתך קשר בקרוב לאישור ומשלוח. נקודות מועדון VIP נוספו לחשבונך."}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <NeonButton href="/account">
          <Package size={16} className="ml-2 inline" />
          לחשבון שלי
        </NeonButton>
        <Link href="/catalog" className="rounded-xl border border-white/10 px-6 py-3 text-sm text-white/70 hover:text-white">
          המשך קניות
        </Link>
      </div>
    </div>
  );
}
