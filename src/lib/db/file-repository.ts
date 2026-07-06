import type { IDataRepository } from "./repository";
import { mockToStoreData } from "./mappers";
import { MOCK_DATABASE } from "@/lib/mock";

/**
 * מימוש קובץ JSON — מחליף ב-Prisma/Drizzle בעת חיבור DB.
 * כרגע קורא מ-MOCK_DATABASE; store.json הוא cache runtime.
 */
export class FileDataRepository implements IDataRepository {
  getMockDatabase() {
    return MOCK_DATABASE;
  }

  toStoreData() {
    return mockToStoreData(MOCK_DATABASE);
  }
}

export const fileRepository = new FileDataRepository();
