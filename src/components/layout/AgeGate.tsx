"use client";

import { NeonLogo } from "@/components/ui/NeonLogo";

interface AgeGateProps {
  onVerified: () => void;
}

export function AgeGate({ onVerified }: AgeGateProps) {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#05070B]/95 backdrop-blur-md">
      <div className="glass mx-4 max-w-md rounded-2xl border border-[#FF2EA6]/30 p-8 text-center shadow-[0_0_40px_rgba(255,46,166,0.2)]">
        <NeonLogo size="md" flicker className="mb-4" />
        <p className="gold-heading mb-6 text-sm">PREMIUM SMOKE BOUTIQUE</p>
        <p className="mb-8 text-sm leading-relaxed text-white/70">
          האתר מיועד לבגירים בלבד (18+).
          <br />
          על ידי כניסה לאתר את/ה מאשר/ת שגילך 18 ומעלה.
        </p>
        <button
          type="button"
          onClick={onVerified}
          className="neon-border-pink w-full rounded-xl bg-[#FF2EA6]/10 px-8 py-4 text-base font-semibold text-white transition-all hover:glow-pink hover:bg-[#FF2EA6]/20"
        >
          אני מעל גיל 18 — כניסה לאתר
        </button>
      </div>
    </div>
  );
}
