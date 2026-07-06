"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeonLogo } from "@/components/ui/NeonLogo";

interface SiteLoaderProps {
  onComplete: () => void;
}

export function SiteLoader({ onComplete }: SiteLoaderProps) {
  const [phase, setPhase] = useState<"smoke" | "logo" | "puff" | "exit">("smoke");
  const [visible, setVisible] = useState(true);
  const [visibleLetters, setVisibleLetters] = useState(0);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setVisible(false);
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const safety = setTimeout(finish, 4000);
    return () => clearTimeout(safety);
  }, [finish]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("logo"), 400);
    const t2 = setTimeout(() => setPhase("puff"), 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (phase !== "puff") return;

    if (visibleLetters < 4) {
      const t = setTimeout(() => setVisibleLetters((v) => v + 1), 150);
      return () => clearTimeout(t);
    }

    const exitTimer = setTimeout(() => setPhase("exit"), 300);
    const completeTimer = setTimeout(finish, 800);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [phase, visibleLetters, finish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#05070B]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: phase === "exit" ? 0 : 1 }}
            transition={{ duration: 0.6 }}
          >
            <LoaderSmoke />
          </motion.div>

          <motion.div
            className="relative z-10"
            animate={{
              opacity: phase === "smoke" || phase === "exit" ? 0 : 1,
              scale: phase === "exit" ? 1.08 : 1,
            }}
            transition={{ duration: 0.4 }}
          >
            <NeonLogo
              size="lg"
              flicker
              showTagline
              puffReveal={phase === "puff" ? visibleLetters : 0}
            />
          </motion.div>

          <button
            type="button"
            onClick={finish}
            className="absolute bottom-8 text-xs text-white/30 underline hover:text-white/60"
          >
            דלג ←
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LoaderSmoke() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute -left-1/4 top-1/4 h-[80%] w-[70%] animate-pulse rounded-full opacity-60 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(255,0,255,0.4) 0%, transparent 65%)",
          animationDuration: "3s",
        }}
      />
      <div
        className="absolute -right-1/4 top-1/4 h-[80%] w-[70%] animate-pulse rounded-full opacity-60 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(0,255,255,0.4) 0%, transparent 65%)",
          animationDuration: "3.5s",
        }}
      />
    </div>
  );
}
