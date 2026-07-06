import type { NeonColor, Strength } from "@/lib/data/types";

/** שדות בסיס לכל entity — מוכן ל-Prisma/Drizzle */
export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

export interface BrandRecord extends Timestamps {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
}

export interface CategoryRecord extends Timestamps {
  id: string;
  slug: string;
  label: string;
  color: NeonColor;
  sortOrder: number;
  imageUrl: string;
}

export interface ProductRecord extends Timestamps {
  id: string;
  slug: string;
  categoryId: string;
  brandId: string;
  name: string;
  nameHe: string;
  descriptionHe: string;
  price: number;
  salePrice: number | null;
  imageUrl: string;
  images: string[];
  flavor: string | null;
  strength: Strength | null;
  inStock: boolean;
  stockQty: number;
  onSale: boolean;
  featured: boolean;
  specs: Record<string, string>;
  gradient: string;
  sortOrder: number;
}

export interface SiteContentRecord extends Timestamps {
  id: string;
  heroTagline: string;
  heroCta: string;
  promoTitle: string;
  promoSubtitle: string;
  freeShippingThreshold: number;
  contactPhone: string;
  contactWhatsapp: string;
  contactEmail: string;
  contactAddress: string;
  aboutText: string;
  footerText: string;
}

/** גרסת mock — העלה כדי לאלץ reseed */
export const MOCK_DATA_VERSION = 3;

export interface MockDatabase {
  version: number;
  brands: BrandRecord[];
  categories: CategoryRecord[];
  products: ProductRecord[];
  content: SiteContentRecord;
}
