import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import {
  readStore,
  saveProduct,
  deleteProduct,
  generateId,
  uniqueProductSlug,
} from "@/lib/data/store";
import type { Product } from "@/lib/data/types";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const store = await readStore();
  return NextResponse.json(store);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<Product>;
    const store = await readStore();
    const id = body.id ?? generateId();
    const existingSlugs = new Set(store.products.map((p) => p.slug));
    const slug =
      body.slug?.trim() ||
      uniqueProductSlug(body.nameHe ?? "", body.name ?? "", existingSlugs);

    const product: Product = {
      id,
      slug,
      name: body.name ?? "",
      nameHe: body.nameHe ?? "",
      price: Number(body.price) || 0,
      salePrice: body.salePrice ? Number(body.salePrice) : undefined,
      brand: body.brand ?? "",
      category: body.category ?? "accessories",
      flavor: body.flavor,
      strength: body.strength,
      inStock: body.inStock ?? true,
      onSale: body.onSale ?? false,
      featured: body.featured ?? false,
      descriptionHe: body.descriptionHe ?? "",
      specs: body.specs ?? {},
      image:
        body.image ??
        (slug && body.category
          ? `/products/mock/${body.category}/${slug}.jpg`
          : undefined),
      gradient: body.gradient ?? "from-zinc-800 to-black",
    };
    await saveProduct(product);
    return NextResponse.json(product);
  } catch (err) {
    console.error("POST /api/admin/products:", err);
    const message = err instanceof Error ? err.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Product;
    if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await saveProduct(body);
    return NextResponse.json(body);
  } catch (err) {
    console.error("PUT /api/admin/products:", err);
    const message = err instanceof Error ? err.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await request.json();
  const ok = await deleteProduct(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
