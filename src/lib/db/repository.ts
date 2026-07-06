import type { MockDatabase } from "./schema";
import type { StoreData } from "@/lib/data/types";

/** ממשק repository — מימוש עתידי: PrismaProductRepository */
export interface IDataRepository {
  toStoreData(): StoreData;
}

/** ממשק DB עתידי — טבלאות נפרדות */
export interface IDatabaseClient {
  brands: {
    findMany(): Promise<MockDatabase["brands"]>;
    findById(id: string): Promise<MockDatabase["brands"][0] | null>;
  };
  categories: {
    findMany(): Promise<MockDatabase["categories"]>;
    findById(id: string): Promise<MockDatabase["categories"][0] | null>;
  };
  products: {
    findMany(filters?: { categoryId?: string; featured?: boolean }): Promise<MockDatabase["products"]>;
    findById(id: string): Promise<MockDatabase["products"][0] | null>;
    findBySlug(slug: string): Promise<MockDatabase["products"][0] | null>;
  };
  content: {
    getSite(): Promise<MockDatabase["content"]>;
  };
}
