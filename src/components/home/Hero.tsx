"use client";

import Link from "next/link";
import { NeonLogo } from "@/components/ui/NeonLogo";

interface HeroProps {
  tagline?: string;
  cta?: string;
}

export function Hero({ tagline = "PREMIUM SMOKE BOUTIQUE", cta = "לקנייה עכשיו" }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="relative z-10 flex flex-col items-center px-4 pt-6 pb-12 text-center md:pt-10 md:pb-16">
        <NeonLogo size="hero" showTagline tagline={tagline} />
        <Link
          href="/catalog"
          className="neon-border-pink mt-8 inline-flex rounded-xl bg-black/40 px-10 py-3.5 text-base font-semibold text-white transition-all hover:glow-pink hover:bg-[#FF2EA6]/10 md:mt-10 md:px-12"
        >
          {cta}
        </Link>
      </div>
    </section>
  );
}
