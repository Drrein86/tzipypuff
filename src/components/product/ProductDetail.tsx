"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Heart, Truck, Shield } from "lucide-react";
import { type Product, getDisplayPrice, getCategoryLabel, priceClass } from "@/lib/products";
import { getProductImage } from "@/lib/products/images";
import { useCartStore } from "@/lib/store/cart";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductImage } from "@/components/ui/ProductImage";
import { NeonButton } from "@/components/ui/NeonButton";

interface ProductDetailProps {
  product: Product;
  related: Product[];
}

export function ProductDetail({ product, related }: ProductDetailProps) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const price = getDisplayPrice(product);
  const image = getProductImage(product);

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, nameHe: product.nameHe, price, image }, qty);
    setCartOpen(true);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <nav className="mb-6 flex items-center gap-2 text-xs text-white/40">
        <Link href="/" className="hover:text-white/70">
          דף הבית
        </Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-white/70">
          מוצרים
        </Link>
        <span>/</span>
        <span className="text-white/60">{product.nameHe}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="neon-border-blue relative aspect-square overflow-hidden rounded-2xl bg-[#0a0c10] backdrop-blur-md">
          {product.onSale && (
            <span className="absolute top-4 right-4 z-10 rounded-lg bg-[#FF2EA6]/20 px-3 py-1 text-xs font-semibold text-[#FF2EA6]">
              מבצע
            </span>
          )}
          <ProductImage product={product} priority className="object-contain p-6" sizes="(max-width:1024px) 100vw, 50vw" />
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#27B8FF]">{product.brand}</p>
            <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">{product.nameHe}</h1>
            <p className="mt-1 text-sm text-white/40">{getCategoryLabel(product.category)}</p>
          </div>

          <div className="flex items-baseline gap-3">
            <span className={`text-3xl ${priceClass}`}>₪{price}</span>
            {product.salePrice && (
              <span className="text-lg text-white/30 line-through">₪{product.price}</span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-white/65">{product.descriptionHe}</p>

          <div className="neon-border-blue rounded-xl bg-black/40 p-4">
            <p className="mb-3 text-xs font-semibold text-white/50">מאפיינים</p>
            <dl className="grid grid-cols-2 gap-2">
              {Object.entries(product.specs).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[10px] text-white/35">{k}</dt>
                  <dd className="text-sm text-white/80">{v}</dd>
                </div>
              ))}
              {product.strength && (
                <div>
                  <dt className="text-[10px] text-white/35">עוצמה</dt>
                  <dd className="text-sm text-white/80">{product.strength}</dd>
                </div>
              )}
              <div>
                <dt className="text-[10px] text-white/35">מלאי</dt>
                <dd className={`text-sm ${product.inStock ? "text-green-400" : "text-red-400"}`}>
                  {product.inStock ? "במלאי" : "אזל מהמלאי"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-xl border border-white/10 bg-black/40">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-3 text-white/50 hover:text-white"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center text-sm font-semibold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="p-3 text-white/50 hover:text-white"
              >
                <Plus size={16} />
              </button>
            </div>

            <NeonButton className="min-w-[160px] flex-1" disabled={!product.inStock} onClick={handleAdd}>
              {product.inStock ? "הוסף לסל" : "לא במלאי"}
            </NeonButton>

            <button
              type="button"
              className="rounded-xl border border-white/10 p-3 text-white/50 transition-all hover:border-[#FF2EA6]/50 hover:text-[#FF2EA6]"
              aria-label="הוסף למועדפים"
            >
              <Heart size={20} />
            </button>
          </div>

          <div className="flex gap-6 text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <Truck size={14} className="text-[#27B8FF]" />
              משלוח 2-5 ימים
            </span>
            <span className="flex items-center gap-1.5">
              <Shield size={14} className="text-[#27B8FF]" />
              מוצר מקורי
            </span>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-center text-base font-medium text-white md:text-lg">מוצרים קשורים</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
