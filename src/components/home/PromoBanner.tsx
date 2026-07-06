"use client";

import { Truck } from "lucide-react";
import type { SiteContent } from "@/lib/data/types";

interface PromoBannerProps {
  content: Pick<SiteContent, "promoTitle" | "promoSubtitle" | "freeShippingThreshold">;
}

export function PromoBanner({ content }: PromoBannerProps) {
  const subtitle =
    content.promoSubtitle.includes("₪") || content.promoSubtitle.includes(String(content.freeShippingThreshold))
      ? content.promoSubtitle
      : `${content.promoSubtitle} ₪${content.freeShippingThreshold}`;

  return (
    <section className="relative z-10 px-4 py-8">
      <div className="relative overflow-hidden rounded-2xl border border-[#27B8FF]/30 bg-black/40 py-10 backdrop-blur-md md:py-12">
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-32 w-40 opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(255,46,166,0.4) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-32 w-40 opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(39,184,255,0.4) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />

        <Truck
          size={90}
          className="absolute top-1/2 right-4 -translate-y-1/2 text-[#27B8FF] md:right-10"
          strokeWidth={1}
          style={{ filter: "drop-shadow(0 0 16px #27B8FF) drop-shadow(0 0 32px rgba(39,184,255,0.5))" }}
        />

        <div className="relative z-10 text-center">
          <p className="neon-text-pink text-2xl font-bold md:text-4xl">{content.promoTitle}</p>
          <p className="mt-2 text-base text-white/80 md:text-xl">
            {subtitle.includes("₪") ? (
              subtitle.split(/(₪\d+)/).map((part, i) =>
                part.startsWith("₪") ? (
                  <span key={i} className="neon-text-blue font-bold">
                    {part}
                  </span>
                ) : (
                  part
                )
              )
            ) : (
              <>
                {subtitle}{" "}
                <span className="neon-text-blue font-bold">₪{content.freeShippingThreshold}</span>
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
