"use client";

import Link from "next/link";
import { type Product, getDisplayPrice, priceClass } from "@/lib/products";
import { getProductImage } from "@/lib/products/images";
import { useCartStore } from "@/lib/store/cart";
import { ProductImage } from "@/components/ui/ProductImage";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const price = getDisplayPrice(product);
  const image = getProductImage(product);

  return (
    <div
      className="group flex flex-col overflow-hidden rounded-xl border border-[#27B8FF]/25 bg-black/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#27B8FF]/50 hover:shadow-[0_8px_32px_rgba(39,184,255,0.15)]"
    >
      <Link href={`/product/${product.id}`} className="relative block h-44 overflow-hidden bg-[#0a0c10]">
        {!product.inStock && (
          <span className="absolute top-2 left-2 z-10 rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
            אזל
          </span>
        )}
        {product.onSale && (
          <span className="absolute top-2 right-2 z-10 rounded bg-[#FF2EA6]/20 px-2 py-0.5 text-[10px] text-[#FF2EA6]">
            מבצע
          </span>
        )}
        <ProductImage product={product} className="object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
      </Link>

      <div className="flex flex-1 flex-col gap-2 px-3 pb-4 text-center">
        <Link href={`/product/${product.id}`} className="text-[11px] text-white/85 hover:text-white md:text-xs">
          {product.nameHe}
        </Link>
        <div className="flex items-center justify-center gap-2">
          <span className={`text-base ${priceClass}`}>₪{price}</span>
          {product.salePrice && (
            <span className="text-xs text-white/30 line-through">₪{product.price}</span>
          )}
        </div>
        <button
          type="button"
          disabled={!product.inStock}
          onClick={() =>
            addItem({
              id: product.id,
              name: product.name,
              nameHe: product.nameHe,
              price,
              image,
            })
          }
          className="neon-border-pink mt-auto rounded-lg bg-black/40 py-2 text-[11px] font-medium text-white transition-all hover:glow-pink disabled:cursor-not-allowed disabled:opacity-40 md:text-xs"
        >
          {product.inStock ? "הוסף לסל" : "לא במלאי"}
        </button>
      </div>
    </div>
  );
}
