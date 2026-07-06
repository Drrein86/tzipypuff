"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

type Variant = "pink" | "blue" | "ghost";

interface NeonButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: Variant;
  href?: string;
}

const variants: Record<Variant, string> = {
  pink: "neon-border-pink bg-black/30 hover:glow-pink hover:bg-[#FF2EA6]/10",
  blue: "neon-border-blue bg-black/30 hover:glow-blue hover:bg-[#27B8FF]/10",
  ghost: "border border-white/20 text-white/80 hover:border-white/40",
};

export function NeonButton({
  children,
  variant = "pink",
  className = "",
  href,
  onClick,
  ...props
}: NeonButtonProps) {
  const classes = `
    relative inline-flex items-center justify-center overflow-hidden rounded-xl
    px-8 py-3 text-sm font-semibold tracking-wide text-white
    transition-all duration-300 ${variants[variant]} ${className}
  `;

  const inner = <span className="relative z-10">{children}</span>;

  if (href) {
    return (
      <motion.a
        href={href}
        onClick={onClick}
        className={classes}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={classes}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      {...props}
    >
      {inner}
    </motion.button>
  );
}
