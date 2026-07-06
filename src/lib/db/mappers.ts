import type { Category, Product, SiteContent, StoreData } from "@/lib/data/types";
import type { BrandRecord, CategoryRecord, MockDatabase, ProductRecord, SiteContentRecord } from "./schema";

const brandMap = new Map<string, BrandRecord>();

export function setBrandContext(brands: BrandRecord[]) {
  brandMap.clear();
  for (const b of brands) brandMap.set(b.id, b);
}

export function recordToProduct(r: ProductRecord): Product {
  const brand = brandMap.get(r.brandId)?.name ?? r.brandId;
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    nameHe: r.nameHe,
    price: r.price,
    salePrice: r.salePrice ?? undefined,
    brand,
    category: r.categoryId,
    flavor: r.flavor ?? undefined,
    strength: r.strength ?? undefined,
    inStock: r.inStock,
    onSale: r.onSale,
    featured: r.featured,
    descriptionHe: r.descriptionHe,
    specs: r.specs,
    gradient: r.gradient,
    image: r.imageUrl,
    images: r.images,
  };
}

export function recordToCategory(r: CategoryRecord): Category {
  return {
    id: r.id,
    label: r.label,
    color: r.color,
    order: r.sortOrder,
  };
}

export function recordToContent(r: SiteContentRecord): SiteContent {
  return {
    heroTagline: r.heroTagline,
    heroCta: r.heroCta,
    promoTitle: r.promoTitle,
    promoSubtitle: r.promoSubtitle,
    freeShippingThreshold: r.freeShippingThreshold,
    contactPhone: r.contactPhone,
    contactWhatsapp: r.contactWhatsapp,
    contactEmail: r.contactEmail,
    contactAddress: r.contactAddress,
    aboutText: r.aboutText,
    footerText: r.footerText,
  };
}

export function mockToStoreData(db: MockDatabase): StoreData {
  setBrandContext(db.brands);
  return {
    mockVersion: db.version,
    products: db.products.map(recordToProduct),
    categories: db.categories.map(recordToCategory),
    brands: db.brands.map((b) => b.name),
    content: recordToContent(db.content),
    updatedAt: new Date().toISOString(),
  };
}

export function productToRecord(p: Product, brandId: string, sortOrder = 0): ProductRecord {
  const now = new Date().toISOString();
  return {
    id: p.id,
    slug: p.slug,
    categoryId: p.category,
    brandId,
    name: p.name,
    nameHe: p.nameHe,
    descriptionHe: p.descriptionHe,
    price: p.price,
    salePrice: p.salePrice ?? null,
    imageUrl: p.image ?? `/products/mock/${p.category}/${p.slug}.svg`,
    images: [p.image ?? `/products/mock/${p.category}/${p.slug}.svg`],
    flavor: p.flavor ?? null,
    strength: p.strength ?? null,
    inStock: p.inStock,
    stockQty: p.inStock ? 50 : 0,
    onSale: p.onSale,
    featured: p.featured ?? false,
    specs: p.specs,
    gradient: p.gradient,
    sortOrder,
    createdAt: now,
    updatedAt: now,
  };
}
