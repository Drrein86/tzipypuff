import { MOCK_DATA_VERSION, type MockDatabase } from "@/lib/db/schema";
import { mockToStoreData } from "@/lib/db/mappers";
import type { StoreData } from "@/lib/data/types";
import { MOCK_BRANDS, MOCK_BRAND_NAMES } from "./brands";
import { MOCK_CATEGORIES } from "./categories";
import { MOCK_CONTENT } from "./content";
import { MOCK_PRODUCTS } from "./products";

export const MOCK_DATABASE: MockDatabase = {
  version: MOCK_DATA_VERSION,
  brands: MOCK_BRANDS,
  categories: MOCK_CATEGORIES,
  products: MOCK_PRODUCTS,
  content: MOCK_CONTENT,
};

export function buildMockStore(): StoreData {
  return mockToStoreData(MOCK_DATABASE);
}

/** נתיבי JSON לייבוא DB — `data/mock/*.json` */
export const MOCK_JSON_PATHS = {
  database: "data/mock/database.json",
  brands: "data/mock/brands.json",
  categories: "data/mock/categories.json",
  products: "data/mock/products.json",
  content: "data/mock/content.json",
} as const;

export { MOCK_BRANDS, MOCK_BRAND_NAMES, MOCK_CATEGORIES, MOCK_CONTENT, MOCK_PRODUCTS };
