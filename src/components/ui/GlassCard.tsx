"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: "pink" | "blue" | "none";
  hover?: boolean;
}

export function GlassCard({
  children,
  className = "",
  glow = "none",
  hover = true,
}: GlassCardProps) {
  const glowClass =
    glow === "pink" ? "hover:glow-pink" : glow === "blue" ? "hover:glow-blue" : "";

  return (
    <motion.div
      className={`glass rounded-2xl transition-all duration-500 ${glowClass} ${className}`}
      whileHover={hover ? { y: -6, scale: 1.02 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
