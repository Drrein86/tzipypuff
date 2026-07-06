import type { Product } from "@/lib/data/types";

export function getProductImage(product: Pick<Product, "slug" | "category" | "image">): string {
  if (product.image) return product.image;
  if (product.slug && product.category) {
    return `/products/mock/${product.category}/${product.slug}.jpg`;
  }
  return `/products/mock/${product.category}/_category.svg`;
}

/** מחיר — זהב נקי, בלי נאון */
export const priceClass = "text-[#C8A96A] font-bold tabular-nums";
