import { NextResponse } from "next/server";
import { readStore } from "@/lib/data/store";
import type { CatalogFilters } from "@/lib/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const store = await readStore();

  const filters: CatalogFilters = {
    category: searchParams.get("cat") ?? undefined,
    brand: searchParams.get("brand") ?? undefined,
    flavor: searchParams.get("flavor") ?? undefined,
    strength: searchParams.get("strength") ?? undefined,
    inStock: searchParams.get("stock") === "1",
    onSale: searchParams.get("sale") === "1",
    q: searchParams.get("q") ?? undefined,
    minPrice: searchParams.get("min") ? Number(searchParams.get("min")) : undefined,
    maxPrice: searchParams.get("max") ? Number(searchParams.get("max")) : undefined,
  };

  const q = filters.q?.trim().toLowerCase();
  let products = store.products;

  products = products.filter((p) => {
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

  return NextResponse.json({
    products,
    categories: store.categories,
    brands: store.brands,
    content: store.content,
    flavors: [...new Set(store.products.map((p) => p.flavor).filter(Boolean))],
  });
}
