"use client";

import { Truck, ShieldCheck, Headphones, Share2, Globe, Mail } from "lucide-react";

const TRUST = [
  { icon: Truck, label: "משלוח מאובטח" },
  { icon: ShieldCheck, label: "קנייה בטוחה" },
  { icon: Headphones, label: "שירות 24/7" },
];

export function TrustBar() {
  return (
    <section className="relative z-10 px-4 pb-10 pt-4">
      <div className="flex items-center justify-center gap-12 md:gap-20">
        {TRUST.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <Icon
              size={22}
              className="text-[#27B8FF]/80"
              strokeWidth={1.5}
              style={{ filter: "drop-shadow(0 0 6px rgba(39,184,255,0.5))" }}
            />
            <span className="text-[10px] text-white/45 md:text-xs">{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-5">
        {[Share2, Globe, Mail].map((Icon, i) => (
          <a
            key={i}
            href="#"
            className="rounded-full border border-white/10 p-2 text-white/30 transition-all hover:border-[#FF2EA6]/50 hover:text-[#FF2EA6] hover:shadow-[0_0_12px_rgba(255,46,166,0.3)]"
          >
            <Icon size={14} />
          </a>
        ))}
      </div>
    </section>
  );
}
