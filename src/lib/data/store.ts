import { promises as fs } from "fs";
import path from "path";
import type { Category, Product, SiteContent, StoreData } from "./types";
import { buildMockStore } from "@/lib/mock";
import { MOCK_DATA_VERSION } from "@/lib/db/schema";
import { isDatabaseEnabled } from "@/lib/db/sql";
import * as pg from "@/lib/db/postgres";

const STORE_PATH = path.join(process.cwd(), "data", "store.json");

function normalizeProduct(p: Product): Product {
  const image =
    p.image ??
    (p.slug && p.category
      ? `/products/mock/${p.category}/${p.slug}.jpg`
      : `/products/mock/${p.category}/_category.svg`);
  return { ...p, image, images: p.images ?? [image] };
}

function normalizeStore(data: StoreData): StoreData {
  return {
    ...data,
    products: data.products.map(normalizeProduct),
  };
}

export async function reseedFromMock(): Promise<StoreData> {
  if (isDatabaseEnabled()) return pg.pgReseedFromMock();
  const fresh = buildMockStore();
  await writeStore(fresh);
  return fresh;
}

export async function readStore(): Promise<StoreData> {
  if (isDatabaseEnabled()) return pg.pgReadStore();
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    const data = normalizeStore(JSON.parse(raw) as StoreData);
    if (data.mockVersion !== MOCK_DATA_VERSION) {
      return reseedFromMock();
    }
    return data;
  } catch {
    return reseedFromMock();
  }
}

export async function writeStore(data: StoreData): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  const payload: StoreData = { ...data, updatedAt: new Date().toISOString() };
  await fs.writeFile(STORE_PATH, JSON.stringify(payload, null, 2), "utf-8");
}

export async function getProducts(): Promise<Product[]> {
  const store = await readStore();
  return store.products;
}

export async function getCategories(): Promise<Category[]> {
  const store = await readStore();
  return [...store.categories].sort((a, b) => a.order - b.order);
}

export async function getBrands(): Promise<string[]> {
  const store = await readStore();
  return store.brands;
}

export async function getContent(): Promise<SiteContent> {
  const store = await readStore();
  return store.content;
}

const LEGACY_SLUGS: Record<string, string> = {
  "1": "al-fakher-two-apple",
  "2": "starbuzz-blue-mist",
  "3": "adalya-love-66",
  "4": "tangiers-cane-mint",
  "5": "al-fakher-two-apple",
  "6": "tangiers-cane-mint",
  "7": "ivg-rainbow-blast",
  "8": "ivg-blue-raspberry",
  "9": "nasty-juice-cushman",
  "10": "vaporesso-xros-3",
  "11": "geekvape-aegis",
  "12": "smok-nord-5",
  "13": "elf-bar-bc5000",
  "14": "raw-classic-papers",
  "15": "raw-cones",
  "16": "coconut-coals-1kg",
  "17": "quick-light-coals",
  "18": "silicone-bowl",
  "19": "kaloud-lotus",
  "20": "premium-hose",
  "21": "metal-grinder",
  "22": "raw-cones",
  "23": "glass-filter-tips",
  "24": "mouth-tips",
  "25": "glass-pipe",
  "26": "beaker-bong-30",
  "27": "straight-tube-bong",
  "28": "silicone-bowl",
  "29": "silicone-bowl",
  "30": "metal-grinder",
};

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  const direct = products.find((p) => p.id === id || p.slug === id);
  if (direct) return direct;
  const legacySlug = LEGACY_SLUGS[id];
  if (legacySlug) return products.find((p) => p.slug === legacySlug);
  return undefined;
}

export async function saveProduct(product: Product): Promise<Product> {
  if (isDatabaseEnabled()) return pg.pgSaveProduct(product);
  const store = await readStore();
  const idx = store.products.findIndex((p) => p.id === product.id);
  if (idx >= 0) store.products[idx] = product;
  else store.products.push(product);
  await writeStore(store);
  return product;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isDatabaseEnabled()) return pg.pgDeleteProduct(id);
  const store = await readStore();
  const before = store.products.length;
  store.products = store.products.filter((p) => p.id !== id);
  if (store.products.length === before) return false;
  await writeStore(store);
  return true;
}

export async function saveCategory(category: Category): Promise<Category> {
  if (isDatabaseEnabled()) return pg.pgSaveCategory(category);
  const store = await readStore();
  const idx = store.categories.findIndex((c) => c.id === category.id);
  if (idx >= 0) store.categories[idx] = category;
  else store.categories.push(category);
  await writeStore(store);
  return category;
}

export async function deleteCategory(id: string): Promise<boolean> {
  if (isDatabaseEnabled()) return pg.pgDeleteCategory(id);
  const store = await readStore();
  const before = store.categories.length;
  store.categories = store.categories.filter((c) => c.id !== id);
  if (store.categories.length === before) return false;
  await writeStore(store);
  return true;
}

export async function updateContent(content: Partial<SiteContent>): Promise<SiteContent> {
  if (isDatabaseEnabled()) return pg.pgUpdateContent(content);
  const store = await readStore();
  store.content = { ...store.content, ...content };
  await writeStore(store);
  return store.content;
}

export async function updateBrands(brands: string[]): Promise<string[]> {
  if (isDatabaseEnabled()) return pg.pgUpdateBrands(brands);
  const store = await readStore();
  store.brands = brands;
  await writeStore(store);
  return store.brands;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}
