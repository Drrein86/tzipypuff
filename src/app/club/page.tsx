import Link from "next/link";
import { Crown, Gift, Star, Zap } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import { readStore } from "@/lib/data/store";

const TIERS = [
  { name: "Bronze", points: 0, perk: "5% הנחה על מבצעים" },
  { name: "Silver", points: 500, perk: "משלוח חינם מ-₪150" },
  { name: "Gold", points: 1500, perk: "גישה מוקדמת למוצרים חדשים" },
  { name: "VIP", points: 5000, perk: "מתנות יום הולדת + שירות VIP" },
];

export default async function ClubPage() {
  const store = await readStore();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-10 text-center">
        <Crown size={48} className="mx-auto text-[#C8A96A]" style={{ filter: "drop-shadow(0 0 12px rgba(200,169,106,0.4))" }} />
        <h1 className="mt-4 text-3xl font-bold text-white">מועדון VIP</h1>
        <p className="mt-3 text-sm text-white/50">צבור נקודות בכל קנייה והתקדם בדרגות</p>
      </div>

      <div className="neon-border-pink mb-10 rounded-2xl bg-black/40 p-6 text-center">
        <p className="text-sm text-white/60">כל ₪10 קנייה = נקודה אחת</p>
        <p className="mt-2 text-2xl font-bold text-[#C8A96A]">הצטרף בחינם</p>
        <NeonButton href="/account" className="mt-5">
          כניסה לחשבון
        </NeonButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {TIERS.map((tier, i) => {
          const icons = [Star, Zap, Gift, Crown];
          const Icon = icons[i];
          return (
            <div key={tier.name} className="rounded-xl border border-white/10 bg-black/40 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Icon size={18} className="text-[#27B8FF]" />
                <span className="font-semibold text-white">{tier.name}</span>
                <span className="mr-auto text-xs text-white/35">{tier.points}+ נק&apos;</span>
              </div>
              <p className="text-sm text-white/55">{tier.perk}</p>
            </div>
          );
        })}
      </div>

      <p className="mt-10 text-center text-xs text-white/30">
        משלוח חינם מ-₪{store.content.freeShippingThreshold} · {store.content.contactPhone}
      </p>

      <p className="mt-4 text-center">
        <Link href="/catalog" className="text-sm text-[#27B8FF] hover:underline">
          התחל לצבור נקודות
        </Link>
      </p>
    </div>
  );
}
