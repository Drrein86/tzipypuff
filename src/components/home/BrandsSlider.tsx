"use client";

import { motion } from "framer-motion";

interface BrandsSliderProps {
  brands: string[];
}

export function BrandsSlider({ brands }: BrandsSliderProps) {
  if (brands.length === 0) return null;
  const doubled = [...brands, ...brands];

  return (
    <section className="relative z-10 overflow-hidden py-8">
      <h2 className="gold-heading mb-6 text-center text-sm md:text-base">מותגים מובילים</h2>
      <div className="relative">
        <div className="absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#05070B] to-transparent md:w-24" />
        <div className="absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#05070B] to-transparent md:w-24" />
        <motion.div
          className="flex gap-10 whitespace-nowrap md:gap-14"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {doubled.map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="text-sm font-semibold tracking-widest text-white/25 transition-colors hover:text-[#C8A96A] md:text-base"
            >
              {brand}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
