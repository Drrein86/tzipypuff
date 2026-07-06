"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { Product } from "@/lib/data/types";
import { getDisplayPrice, priceClass } from "@/lib/products";
import { ProductImage } from "@/components/ui/ProductImage";

export function LiveSearch({ className = "" }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const trimmedQuery = query.trim();
  const [fetchedResults, setFetchedResults] = useState<Product[]>([]);
  const results = trimmedQuery.length >= 2 ? fetchedResults : [];

  useEffect(() => {
    if (trimmedQuery.length < 2) return;
    const t = setTimeout(() => {
      fetch(`/api/products?q=${encodeURIComponent(trimmedQuery)}`)
        .then((r) => r.json())
        .then((d) => setFetchedResults((d.products ?? []).slice(0, 6)));
    }, 200);
    return () => clearTimeout(t);
  }, [trimmedQuery]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const goToCatalog = () => {
    router.push(`/catalog?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <Search
        size={15}
        className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-white/35"
      />
      <input
        type="search"
        value={query}
        placeholder="חיפוש מוצרים..."
        className={`w-full rounded-full border bg-black/60 py-2 pr-10 pl-4 text-sm text-white outline-none transition-all ${
          focused
            ? "border-[#FF2EA6]/60 shadow-[0_0_16px_rgba(255,46,166,0.25)]"
            : "border-white/10"
        }`}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setFocused(true);
          setOpen(true);
        }}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && query.trim()) goToCatalog();
          if (e.key === "Escape") setOpen(false);
        }}
      />

      {open && trimmedQuery.length >= 2 && (
        <div className="neon-border-pink absolute top-full z-[60] mt-2 w-full overflow-hidden rounded-xl bg-[#05070B]/95 shadow-2xl backdrop-blur-xl">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-white/40">לא נמצאו תוצאות</p>
          ) : (
            <ul>
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/product/${p.id}`}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#FF2EA6]/10"
                  >
                    <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-md bg-[#0a0c10]">
                      <ProductImage product={p} sizes="40px" className="object-contain p-0.5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{p.nameHe}</p>
                      <p className="text-[11px] text-white/40">{p.brand}</p>
                    </div>
                    <span className={`text-sm ${priceClass}`}>₪{getDisplayPrice(p)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {results.length > 0 && (
            <button
              type="button"
              onClick={goToCatalog}
              className="w-full border-t border-white/5 py-2.5 text-xs text-[#27B8FF] hover:bg-white/5"
            >
              הצג את כל התוצאות
            </button>
          )}
        </div>
      )}
    </div>
  );
}
