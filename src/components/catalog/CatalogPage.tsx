"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import type { Category, Product } from "@/lib/data/types";
import { ProductCard } from "@/components/catalog/ProductCard";

const PRICE_RANGES = [
  { label: "עד ₪50", min: 0, max: 50 },
  { label: "₪50–100", min: 50, max: 100 },
  { label: "₪100–200", min: 100, max: 200 },
  { label: "₪200+", min: 200, max: 9999 },
];

export function CatalogPage() {
  const router = useRouter();
  const params = useSearchParams();
  const queryString = params.toString();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [snapshot, setSnapshot] = useState<{
    query: string;
    products: Product[];
    categories: Category[];
    brands: string[];
    flavors: string[];
    error: string;
  }>({ query: "", products: [], categories: [], brands: [], flavors: [], error: "" });

  const loading = snapshot.query !== queryString;
  const products = snapshot.query === queryString ? snapshot.products : [];
  const categories = snapshot.query === queryString ? snapshot.categories : [];
  const brands = snapshot.query === queryString ? snapshot.brands : [];
  const flavors = snapshot.query === queryString ? snapshot.flavors : [];
  const error = snapshot.query === queryString ? snapshot.error : "";

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/products?${queryString}`)
      .then((r) => {
        if (!r.ok) throw new Error(`API ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!cancelled) {
          setSnapshot({
            query: queryString,
            products: data.products ?? [],
            categories: data.categories ?? [],
            brands: data.brands ?? [],
            flavors: data.flavors ?? [],
            error: "",
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSnapshot({
            query: queryString,
            products: [],
            categories: [],
            brands: [],
            flavors: [],
            error: "שגיאה בטעינת מוצרים — נסה לרענן",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [queryString]);

  const filters = useMemo(
    () => ({
      category: params.get("cat") ?? undefined,
      brand: params.get("brand") ?? undefined,
      flavor: params.get("flavor") ?? undefined,
      strength: params.get("strength") ?? undefined,
      inStock: params.get("stock") === "1",
      onSale: params.get("sale") === "1",
    }),
    [params]
  );

  const flavorsList = flavors;

  const setFilter = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.push(`/catalog?${next.toString()}`);
    },
    [params, router]
  );

  const clearFilters = () => router.push("/catalog");
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white md:text-2xl">קטלוג מוצרים</h1>
          <p className="mt-1 text-sm text-white/45">
            {loading ? "טוען..." : `${products.length} מוצרים`}
          </p>
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-xs text-[#FF2EA6] hover:underline"
          >
            <X size={14} />
            נקה פילטרים
          </button>
        )}
      </div>

      <div className="mb-4 flex items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="neon-border-blue flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white"
        >
          <SlidersHorizontal size={16} className="text-[#27B8FF]" />
          פילטרים
          {activeCount > 0 && (
            <span className="rounded-full bg-[#FF2EA6] px-1.5 text-[10px]">{activeCount}</span>
          )}
        </button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className={`lg:w-56 lg:shrink-0 ${filtersOpen ? "block" : "hidden lg:block"}`}>
          <div className="neon-border-blue sticky top-[120px] rounded-xl bg-black/50 p-4 backdrop-blur-md">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
              <SlidersHorizontal size={16} className="text-[#27B8FF]" />
              פילטרים
            </div>

            <FilterGroup title="קטגוריה">
              {categories.map((cat) => (
                <FilterBtn
                  key={cat.id}
                  active={filters.category === cat.id}
                  onClick={() =>
                    setFilter("cat", filters.category === cat.id ? null : cat.id)
                  }
                >
                  {cat.label}
                </FilterBtn>
              ))}
            </FilterGroup>

            <FilterGroup title="מחיר">
              {PRICE_RANGES.map((r) => {
                const active =
                  params.get("min") === String(r.min) && params.get("max") === String(r.max);
                return (
                  <FilterBtn
                    key={r.label}
                    active={active}
                    onClick={() => {
                      const next = new URLSearchParams(params.toString());
                      if (active) {
                        next.delete("min");
                        next.delete("max");
                      } else {
                        next.set("min", String(r.min));
                        next.set("max", String(r.max));
                      }
                      router.push(`/catalog?${next.toString()}`);
                    }}
                  >
                    {r.label}
                  </FilterBtn>
                );
              })}
            </FilterGroup>

            <FilterGroup title="מותג">
              {brands.map((brand) => (
                <FilterBtn
                  key={brand}
                  active={filters.brand === brand}
                  onClick={() =>
                    setFilter("brand", filters.brand === brand ? null : brand)
                  }
                >
                  {brand}
                </FilterBtn>
              ))}
            </FilterGroup>

            {flavorsList.length > 0 && (
              <FilterGroup title="טעם">
                {flavorsList.map((f) => (
                  <FilterBtn
                    key={f}
                    active={filters.flavor === f}
                    onClick={() => setFilter("flavor", filters.flavor === f ? null : f)}
                  >
                    {f}
                  </FilterBtn>
                ))}
              </FilterGroup>
            )}

            <FilterGroup title="מלאי">
              <FilterBtn
                active={!!filters.inStock}
                onClick={() => setFilter("stock", filters.inStock ? null : "1")}
              >
                במלאי בלבד
              </FilterBtn>
              <FilterBtn
                active={!!filters.onSale}
                onClick={() => setFilter("sale", filters.onSale ? null : "1")}
              >
                מבצעים
              </FilterBtn>
            </FilterGroup>
          </div>
        </aside>

        <div className="flex-1">
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
          {loading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-xl bg-white/5" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-xl border border-white/5 py-20 text-center text-white/50">
              לא נמצאו מוצרים
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 border-b border-white/5 pb-4 last:mb-0 last:border-0 last:pb-0">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/35">
        {title}
      </p>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function FilterBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-2.5 py-1.5 text-right text-xs transition-all ${
        active
          ? "bg-[#FF2EA6]/15 text-[#FF2EA6]"
          : "text-white/55 hover:bg-white/5 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
