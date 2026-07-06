export type Strength = "קל" | "בינוני" | "חזק";
export type NeonColor = "pink" | "blue";

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameHe: string;
  price: number;
  salePrice?: number;
  brand: string;
  category: string;
  flavor?: string;
  strength?: Strength;
  inStock: boolean;
  onSale: boolean;
  descriptionHe: string;
  specs: Record<string, string>;
  gradient: string;
  image?: string;
  images?: string[];
  featured?: boolean;
}

export interface Category {
  id: string;
  label: string;
  color: NeonColor;
  order: number;
}

export interface SiteContent {
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

export interface StoreData {
  products: Product[];
  categories: Category[];
  brands: string[];
  content: SiteContent;
  updatedAt: string;
  /** גרסת mock — לסנכרון עם DB seed */
  mockVersion?: number;
}
