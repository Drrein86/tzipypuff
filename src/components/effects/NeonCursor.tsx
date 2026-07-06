"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function NeonCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const hide = () => setVisible(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", hide);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-[9998] hidden md:block"
        style={{ left: pos.x, top: pos.y }}
        animate={{ x: -16, y: -16 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        <div
          className="h-8 w-8 rounded-full border border-[#FF2EA6]"
          style={{
            boxShadow:
              "0 0 10px rgba(255,46,166,0.6), 0 0 20px rgba(255,46,166,0.3), inset 0 0 10px rgba(255,46,166,0.2)",
          }}
        />
      </motion.div>
      <motion.div
        className="pointer-events-none fixed z-[9997] hidden md:block"
        style={{ left: pos.x, top: pos.y }}
        animate={{ x: -6, y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div
          className="h-3 w-3 rounded-full bg-[#27B8FF]"
          style={{ boxShadow: "0 0 8px rgba(39,184,255,0.8)" }}
        />
      </motion.div>
    </>
  );
}
