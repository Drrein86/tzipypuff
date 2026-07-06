/**
 * מייצא mock data ל-JSON לייבוא DB
 * הרצה: npx tsx scripts/export-mock-json.ts
 */
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { MOCK_DATABASE, buildMockStore } from "../src/lib/mock/index";

const OUT = join(process.cwd(), "data", "mock");
mkdirSync(OUT, { recursive: true });

const store = buildMockStore();

writeFileSync(join(OUT, "database.json"), JSON.stringify(MOCK_DATABASE, null, 2));
writeFileSync(join(OUT, "brands.json"), JSON.stringify(MOCK_DATABASE.brands, null, 2));
writeFileSync(join(OUT, "categories.json"), JSON.stringify(MOCK_DATABASE.categories, null, 2));
writeFileSync(join(OUT, "products.json"), JSON.stringify(MOCK_DATABASE.products, null, 2));
writeFileSync(join(OUT, "content.json"), JSON.stringify(MOCK_DATABASE.content, null, 2));
writeFileSync(join(OUT, "store.json"), JSON.stringify(store, null, 2));

console.log(
  `✓ Exported ${MOCK_DATABASE.products.length} products, ${MOCK_DATABASE.categories.length} categories → data/mock/`
);
