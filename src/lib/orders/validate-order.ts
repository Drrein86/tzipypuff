import { getProducts, getContent } from "@/lib/data/store";
import { getDisplayPrice } from "@/lib/products";
import { getProductImage } from "@/lib/products/images";
import type { OrderItem } from "@/lib/data/order-types";
import { MAX_ITEM_QUANTITY, SHIPPING_COST } from "./constants";

export type CartLineInput = { id: string; quantity: number };

export class OrderValidationError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "OrderValidationError";
    this.status = status;
  }
}

export async function validateAndBuildOrderItems(inputs: CartLineInput[]): Promise<OrderItem[]> {
  if (!inputs?.length) {
    throw new OrderValidationError("העגלה ריקה");
  }

  const products = await getProducts();
  const byId = new Map(products.map((p) => [p.id, p]));
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  const items: OrderItem[] = [];
  const seen = new Set<string>();

  for (const input of inputs) {
    const qty = Math.floor(Number(input.quantity));
    if (!input.id || !Number.isFinite(qty) || qty < 1) {
      throw new OrderValidationError("פריט לא תקין בעגלה");
    }
    if (qty > MAX_ITEM_QUANTITY) {
      throw new OrderValidationError(`כמות מקסימלית לפריט: ${MAX_ITEM_QUANTITY}`);
    }

    const product = byId.get(input.id) ?? bySlug.get(input.id);
    if (!product) {
      throw new OrderValidationError("אחד המוצרים בעגלה לא נמצא");
    }
    if (!product.inStock) {
      throw new OrderValidationError(`${product.nameHe} — אזל מהמלאי`);
    }
    if (seen.has(product.id)) {
      throw new OrderValidationError("פריט כפול בעגלה");
    }
    seen.add(product.id);

    items.push({
      id: product.id,
      nameHe: product.nameHe,
      price: getDisplayPrice(product),
      quantity: qty,
      image: getProductImage(product),
    });
  }

  return items;
}

export async function calcOrderTotals(subtotal: number) {
  const content = await getContent();
  const shipping = subtotal >= content.freeShippingThreshold ? 0 : SHIPPING_COST;
  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
    freeShippingThreshold: content.freeShippingThreshold,
  };
}
