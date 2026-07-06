/**
 * Run database migrations and seed from mock data.
 * Usage: DATABASE_URL=postgres://... npx tsx scripts/db-migrate.ts
 */
import { ensureDbReady } from "../src/lib/db/postgres";
import { pgReadStore } from "../src/lib/db/postgres";

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  console.log("Running migrations and seed...");
  await ensureDbReady();
  const store = await pgReadStore();
  console.log(
    `Done: ${store.products.length} products, ${store.categories.length} categories`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
