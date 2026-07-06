export type { Product, Category, SiteContent, Strength } from "@/lib/data/types";
export { getProductImage, priceClass } from "@/lib/products/images";

import type { Product } from "@/lib/data/types";

export const STRENGTHS = ["קל", "בינוני", "חזק"] as const;

export interface CatalogFilters {
  category?: string;
  brand?: string;
  flavor?: string;
  strength?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  onSale?: boolean;
  q?: string;
}

export function filterProducts(products: Product[], filters: CatalogFilters): Product[] {
  const q = filters.q?.trim().toLowerCase();
  return products.filter((p) => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.brand && p.brand !== filters.brand) return false;
    if (filters.flavor && p.flavor !== filters.flavor) return false;
    if (filters.strength && p.strength !== filters.strength) return false;
    if (filters.inStock && !p.inStock) return false;
    if (filters.onSale && !p.onSale) return false;
    if (filters.minPrice !== undefined && p.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && p.price > filters.maxPrice) return false;
    if (q) {
      const hay = `${p.name} ${p.nameHe} ${p.brand} ${p.flavor ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function searchProducts(products: Product[], query: string, limit = 8): Product[] {
  if (!query.trim()) return [];
  return filterProducts(products, { q: query }).slice(0, limit);
}

export function getRelatedProducts(products: Product[], product: Product, limit = 4): Product[] {
  return products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, limit);
}

export function getDisplayPrice(p: Product): number {
  return p.salePrice ?? p.price;
}

export function getCategoryLabel(id: string, categories?: { id: string; label: string }[]): string {
  const fromList = categories?.find((c) => c.id === id)?.label;
  if (fromList) return fromList;
  const fallback: Record<string, string> = {
    tobacco: "טבק",
    liquids: "נוזלים",
    vapes: "סיגריות אלקטרוניות",
    accessories: "אביזרים",
    coals: "פחמים",
    filters: "פילטרים",
    rolling: "גלגול",
    pipes: "מקטרות",
    bongs: "באנגים",
  };
  return fallback[id] ?? id;
}

export function getFlavors(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.flavor).filter(Boolean))] as string[];
}
