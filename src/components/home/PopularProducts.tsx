"use client";

import { ProductCard } from "@/components/catalog/ProductCard";
import type { Product } from "@/lib/data/types";

interface PopularProductsProps {
  products: Product[];
}

export function PopularProducts({ products }: PopularProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="relative z-10 px-4 py-6">
      <div className="mb-6 flex items-center justify-center gap-3 md:mb-8">
        <div className="h-px w-12 bg-gradient-to-l from-[#C8A96A]/70 to-transparent" />
        <span className="text-sm text-[#C8A96A]">◆</span>
        <div className="text-center">
          <h2 className="text-base font-medium tracking-wide text-white md:text-lg">מוצרים פופולריים</h2>
          <p className="mt-1 text-[11px] text-white/40 md:text-xs">הנבחרים של הלקוחות שלנו — איכות שלא מתפשרים עליה</p>
        </div>
        <span className="text-sm text-[#C8A96A]">◆</span>
        <div className="h-px w-12 bg-gradient-to-r from-[#C8A96A]/70 to-transparent" />
      </div>

      <div className="neon-border-blue rounded-2xl bg-black/35 p-3 backdrop-blur-md md:p-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
