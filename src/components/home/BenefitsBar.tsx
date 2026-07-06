"use client";

import { Truck, Shield, Headphones } from "lucide-react";

const ITEMS = [
  { icon: Truck, title: "משלוח מהיר", sub: "2-5 ימי עסקים" },
  { icon: Shield, title: "מוצרים מקוריים", sub: "100% איכות" },
  { icon: Headphones, title: "שירות לקוחות", sub: "24/7" },
];

export function BenefitsBar() {
  return (
    <section className="relative z-10 px-4 pb-2">
      <div className="neon-border-blue flex items-stretch justify-between gap-1 rounded-xl bg-[#05070B]/70 px-3 py-4 backdrop-blur-md sm:gap-4 sm:px-8 sm:py-5">
        {ITEMS.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex flex-1 flex-col items-center gap-1 text-center">
            <Icon
              size={20}
              className="text-[#27B8FF] sm:size-[22px]"
              strokeWidth={1.5}
              style={{ filter: "drop-shadow(0 0 8px #27B8FF)" }}
            />
            <span className="text-[11px] font-semibold text-white sm:text-sm">{title}</span>
            <span className="text-[9px] text-white/40 sm:text-[11px]">{sub}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
