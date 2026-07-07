import { getSql } from "./sql";
import { ensureSupabasePoolerConfig } from "./discover-pooler";
import { buildMockStore } from "@/lib/mock";
import { MOCK_DATA_VERSION } from "./schema";
import type { Category, Product, SiteContent, StoreData } from "@/lib/data/types";
import type { Order } from "@/lib/data/order-types";

let readyPromise: Promise<void> | null = null;

function rowsOf<T>(rows: unknown): T[] {
  return rows as T[];
}

function rowOf<T>(row: unknown): T {
  return row as T;
}

export function ensureDbReady(): Promise<void> {
  if (!readyPromise) {
    readyPromise = migrateAndSeed();
  }
  return readyPromise;
}

async function migrateAndSeed(): Promise<void> {
  await ensureSupabasePoolerConfig();
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS store_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      color TEXT NOT NULL CHECK (color IN ('pink', 'blue')),
      sort_order INT NOT NULL DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS brands (
      name TEXT PRIMARY KEY
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      name_he TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      sale_price NUMERIC(10,2),
      brand TEXT NOT NULL DEFAULT '',
      category_id TEXT NOT NULL REFERENCES categories(id) ON UPDATE CASCADE,
      flavor TEXT,
      strength TEXT,
      in_stock BOOLEAN NOT NULL DEFAULT true,
      on_sale BOOLEAN NOT NULL DEFAULT false,
      featured BOOLEAN NOT NULL DEFAULT false,
      description_he TEXT NOT NULL DEFAULT '',
      specs JSONB NOT NULL DEFAULT '{}',
      gradient TEXT NOT NULL DEFAULT 'from-zinc-800 to-black',
      image TEXT,
      images JSONB NOT NULL DEFAULT '[]',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS site_content (
      id TEXT PRIMARY KEY DEFAULT 'main',
      hero_tagline TEXT NOT NULL DEFAULT '',
      hero_cta TEXT NOT NULL DEFAULT '',
      promo_title TEXT NOT NULL DEFAULT '',
      promo_subtitle TEXT NOT NULL DEFAULT '',
      free_shipping_threshold INT NOT NULL DEFAULT 200,
      contact_phone TEXT NOT NULL DEFAULT '',
      contact_whatsapp TEXT NOT NULL DEFAULT '',
      contact_email TEXT NOT NULL DEFAULT '',
      contact_address TEXT NOT NULL DEFAULT '',
      about_text TEXT NOT NULL DEFAULT '',
      footer_text TEXT NOT NULL DEFAULT ''
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL,
      customer JSONB NOT NULL,
      items JSONB NOT NULL,
      subtotal NUMERIC(10,2) NOT NULL,
      shipping NUMERIC(10,2) NOT NULL,
      total NUMERIC(10,2) NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      payment_method TEXT NOT NULL DEFAULT 'cod'
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_emails (
      email TEXT PRIMARY KEY,
      subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  const countRows = await sql`SELECT COUNT(*)::int AS count FROM products`;
  const productCount = countRows[0]?.count ?? 0;

  const versionRows = await sql`
    SELECT value FROM store_meta WHERE key = 'mock_version' LIMIT 1
  `;
  const storedVersion = versionRows[0]?.value ? Number(versionRows[0].value) : 0;

  if (productCount === 0 || storedVersion !== MOCK_DATA_VERSION) {
    await seedFromMock();
  }
}

async function seedFromMock(): Promise<void> {
  const sql = getSql();
  const store = buildMockStore();

  await sql`DELETE FROM products`;
  await sql`DELETE FROM categories`;
  await sql`DELETE FROM brands`;

  for (const cat of store.categories) {
    await sql`
      INSERT INTO categories (id, label, color, sort_order)
      VALUES (${cat.id}, ${cat.label}, ${cat.color}, ${cat.order})
    `;
  }

  for (const brand of store.brands) {
    await sql`INSERT INTO brands (name) VALUES (${brand}) ON CONFLICT DO NOTHING`;
  }

  for (const p of store.products) {
    await upsertProductRow(p);
  }

  await upsertContentRow(store.content);

  await sql`
    INSERT INTO store_meta (key, value)
    VALUES ('mock_version', ${String(MOCK_DATA_VERSION)})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `;

  await sql`
    INSERT INTO store_meta (key, value)
    VALUES ('updated_at', ${new Date().toISOString()})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `;
}

function normalizeProduct(p: Product): Product {
  const image =
    p.image ??
    (p.slug && p.category
      ? `/products/mock/${p.category}/${p.slug}.svg`
      : `/products/mock/${p.category}/_category.svg`);
  return { ...p, image, images: p.images ?? [image] };
}

async function upsertProductRow(p: Product): Promise<void> {
  const sql = getSql();
  const product = normalizeProduct(p);
  const images = product.images ?? [product.image ?? ""];

  await sql`
    INSERT INTO products (
      id, slug, name, name_he, price, sale_price, brand, category_id,
      flavor, strength, in_stock, on_sale, featured, description_he,
      specs, gradient, image, images, updated_at
    ) VALUES (
      ${product.id},
      ${product.slug},
      ${product.name},
      ${product.nameHe},
      ${product.price},
      ${product.salePrice ?? null},
      ${product.brand},
      ${product.category},
      ${product.flavor ?? null},
      ${product.strength ?? null},
      ${product.inStock},
      ${product.onSale},
      ${product.featured ?? false},
      ${product.descriptionHe},
      ${JSON.stringify(product.specs)}::jsonb,
      ${product.gradient},
      ${product.image ?? null},
      ${JSON.stringify(images)}::jsonb,
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      slug = EXCLUDED.slug,
      name = EXCLUDED.name,
      name_he = EXCLUDED.name_he,
      price = EXCLUDED.price,
      sale_price = EXCLUDED.sale_price,
      brand = EXCLUDED.brand,
      category_id = EXCLUDED.category_id,
      flavor = EXCLUDED.flavor,
      strength = EXCLUDED.strength,
      in_stock = EXCLUDED.in_stock,
      on_sale = EXCLUDED.on_sale,
      featured = EXCLUDED.featured,
      description_he = EXCLUDED.description_he,
      specs = EXCLUDED.specs,
      gradient = EXCLUDED.gradient,
      image = EXCLUDED.image,
      images = EXCLUDED.images,
      updated_at = NOW()
  `;

  if (product.brand) {
    await sql`INSERT INTO brands (name) VALUES (${product.brand}) ON CONFLICT DO NOTHING`;
  }
}

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  name_he: string;
  price: string;
  sale_price: string | null;
  brand: string;
  category_id: string;
  flavor: string | null;
  strength: string | null;
  in_stock: boolean;
  on_sale: boolean;
  featured: boolean;
  description_he: string;
  specs: Record<string, string>;
  gradient: string;
  image: string | null;
  images: string[];
};

function rowToProduct(row: ProductRow): Product {
  return normalizeProduct({
    id: row.id,
    slug: row.slug,
    name: row.name,
    nameHe: row.name_he,
    price: Number(row.price),
    salePrice: row.sale_price ? Number(row.sale_price) : undefined,
    brand: row.brand,
    category: row.category_id,
    flavor: row.flavor ?? undefined,
    strength: (row.strength as Product["strength"]) ?? undefined,
    inStock: row.in_stock,
    onSale: row.on_sale,
    featured: row.featured,
    descriptionHe: row.description_he,
    specs: row.specs ?? {},
    gradient: row.gradient,
    image: row.image ?? undefined,
    images: row.images ?? [],
  });
}

type ContentRow = {
  hero_tagline: string;
  hero_cta: string;
  promo_title: string;
  promo_subtitle: string;
  free_shipping_threshold: number;
  contact_phone: string;
  contact_whatsapp: string;
  contact_email: string;
  contact_address: string;
  about_text: string;
  footer_text: string;
};

function rowToContent(row: ContentRow): SiteContent {
  return {
    heroTagline: row.hero_tagline,
    heroCta: row.hero_cta,
    promoTitle: row.promo_title,
    promoSubtitle: row.promo_subtitle,
    freeShippingThreshold: row.free_shipping_threshold,
    contactPhone: row.contact_phone,
    contactWhatsapp: row.contact_whatsapp,
    contactEmail: row.contact_email,
    contactAddress: row.contact_address,
    aboutText: row.about_text,
    footerText: row.footer_text,
  };
}

async function upsertContentRow(content: SiteContent): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO site_content (
      id, hero_tagline, hero_cta, promo_title, promo_subtitle,
      free_shipping_threshold, contact_phone, contact_whatsapp,
      contact_email, contact_address, about_text, footer_text
    ) VALUES (
      'main',
      ${content.heroTagline},
      ${content.heroCta},
      ${content.promoTitle},
      ${content.promoSubtitle},
      ${content.freeShippingThreshold},
      ${content.contactPhone},
      ${content.contactWhatsapp},
      ${content.contactEmail},
      ${content.contactAddress},
      ${content.aboutText},
      ${content.footerText}
    )
    ON CONFLICT (id) DO UPDATE SET
      hero_tagline = EXCLUDED.hero_tagline,
      hero_cta = EXCLUDED.hero_cta,
      promo_title = EXCLUDED.promo_title,
      promo_subtitle = EXCLUDED.promo_subtitle,
      free_shipping_threshold = EXCLUDED.free_shipping_threshold,
      contact_phone = EXCLUDED.contact_phone,
      contact_whatsapp = EXCLUDED.contact_whatsapp,
      contact_email = EXCLUDED.contact_email,
      contact_address = EXCLUDED.contact_address,
      about_text = EXCLUDED.about_text,
      footer_text = EXCLUDED.footer_text
  `;
}

async function touchUpdatedAt(): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO store_meta (key, value)
    VALUES ('updated_at', ${new Date().toISOString()})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `;
}

export async function pgReadStore(): Promise<StoreData> {
  await ensureDbReady();
  const sql = getSql();

  const productRows = await sql`
    SELECT * FROM products ORDER BY featured DESC, name_he ASC
  `;
  const categoryRows = await sql`
    SELECT id, label, color, sort_order FROM categories ORDER BY sort_order ASC
  `;
  const brandRows = await sql`SELECT name FROM brands ORDER BY name ASC`;
  const contentRows = await sql`SELECT * FROM site_content WHERE id = 'main' LIMIT 1`;
  const metaRows = await sql`SELECT value FROM store_meta WHERE key = 'updated_at' LIMIT 1`;

  const content = contentRows[0]
    ? rowToContent(rowOf<ContentRow>(contentRows[0]))
    : buildMockStore().content;

  return {
    mockVersion: MOCK_DATA_VERSION,
    products: rowsOf<ProductRow>(productRows).map(rowToProduct),
    categories: rowsOf<{ id: string; label: string; color: Category["color"]; sort_order: number }>(
      categoryRows
    ).map((c) => ({ id: c.id, label: c.label, color: c.color, order: c.sort_order })),
    brands: rowsOf<{ name: string }>(brandRows).map((b) => b.name),
    content,
    updatedAt: metaRows[0]?.value ?? new Date().toISOString(),
  };
}

export async function pgSaveProduct(product: Product): Promise<Product> {
  await ensureDbReady();
  await upsertProductRow(product);
  await touchUpdatedAt();
  return normalizeProduct(product);
}

export async function pgDeleteProduct(id: string): Promise<boolean> {
  await ensureDbReady();
  const sql = getSql();
  const rows = await sql`DELETE FROM products WHERE id = ${id} RETURNING id`;
  if (rows.length === 0) return false;
  await touchUpdatedAt();
  return true;
}

export async function pgSaveCategory(category: Category): Promise<Category> {
  await ensureDbReady();
  const sql = getSql();
  await sql`
    INSERT INTO categories (id, label, color, sort_order)
    VALUES (${category.id}, ${category.label}, ${category.color}, ${category.order})
    ON CONFLICT (id) DO UPDATE SET
      label = EXCLUDED.label,
      color = EXCLUDED.color,
      sort_order = EXCLUDED.sort_order
  `;
  await touchUpdatedAt();
  return category;
}

export async function pgDeleteCategory(id: string): Promise<boolean> {
  await ensureDbReady();
  const sql = getSql();
  const rows = await sql`DELETE FROM categories WHERE id = ${id} RETURNING id`;
  if (rows.length === 0) return false;
  await touchUpdatedAt();
  return true;
}

export async function pgUpdateContent(content: Partial<SiteContent>): Promise<SiteContent> {
  await ensureDbReady();
  const store = await pgReadStore();
  const merged = { ...store.content, ...content };
  await upsertContentRow(merged);
  await touchUpdatedAt();
  return merged;
}

export async function pgUpdateBrands(brands: string[]): Promise<string[]> {
  await ensureDbReady();
  const sql = getSql();
  await sql`DELETE FROM brands`;
  for (const name of brands) {
    await sql`INSERT INTO brands (name) VALUES (${name}) ON CONFLICT DO NOTHING`;
  }
  await touchUpdatedAt();
  return brands;
}

export async function pgReseedFromMock(): Promise<StoreData> {
  readyPromise = null;
  await migrateAndSeed();
  return pgReadStore();
}

type OrderRow = {
  id: string;
  created_at: string;
  customer: Order["customer"];
  items: Order["items"];
  subtotal: string;
  shipping: string;
  total: string;
  status: Order["status"];
  payment_method: Order["paymentMethod"];
};

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    createdAt: new Date(row.created_at).toISOString(),
    customer: row.customer,
    items: row.items,
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    total: Number(row.total),
    status: row.status,
    paymentMethod: row.payment_method,
  };
}

export async function pgSaveOrder(order: Order): Promise<Order> {
  await ensureDbReady();
  const sql = getSql();
  await sql`
    INSERT INTO orders (
      id, created_at, customer, items, subtotal, shipping, total, status, payment_method
    ) VALUES (
      ${order.id},
      ${order.createdAt},
      ${JSON.stringify(order.customer)}::jsonb,
      ${JSON.stringify(order.items)}::jsonb,
      ${order.subtotal},
      ${order.shipping},
      ${order.total},
      ${order.status},
      ${order.paymentMethod}
    )
  `;
  return order;
}

export async function pgGetOrdersByPhone(phone: string): Promise<Order[]> {
  await ensureDbReady();
  const sql = getSql();
  const normalized = phone.replace(/\D/g, "");
  const rows = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
  return rowsOf<OrderRow>(rows)
    .map(rowToOrder)
    .filter((o) => o.customer.phone.replace(/\D/g, "") === normalized);
}

export async function pgGetOrdersByEmail(email: string): Promise<Order[]> {
  await ensureDbReady();
  const sql = getSql();
  const normalized = email.trim().toLowerCase();
  const rows = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
  return rowsOf<OrderRow>(rows)
    .map(rowToOrder)
    .filter((o) => o.customer.email.trim().toLowerCase() === normalized);
}

export async function pgGetAllOrders(): Promise<Order[]> {
  await ensureDbReady();
  const sql = getSql();
  const rows = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
  return rowsOf<OrderRow>(rows).map(rowToOrder);
}

export async function pgGetOrderById(id: string): Promise<Order | undefined> {
  await ensureDbReady();
  const sql = getSql();
  const rows = await sql`SELECT * FROM orders WHERE id = ${id} LIMIT 1`;
  return rows[0] ? rowToOrder(rowOf<OrderRow>(rows[0])) : undefined;
}

export async function pgUpdateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<Order | undefined> {
  await ensureDbReady();
  const sql = getSql();
  const rows = await sql`
    UPDATE orders SET status = ${status} WHERE id = ${id} RETURNING *
  `;
  return rows[0] ? rowToOrder(rowOf<OrderRow>(rows[0])) : undefined;
}

export async function pgSubscribeEmail(email: string): Promise<boolean> {
  await ensureDbReady();
  const normalized = email.trim().toLowerCase();
  if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return false;

  const sql = getSql();
  await sql`
    INSERT INTO newsletter_emails (email, subscribed_at)
    VALUES (${normalized}, NOW())
    ON CONFLICT (email) DO NOTHING
  `;
  return true;
}
