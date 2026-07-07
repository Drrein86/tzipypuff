/**
 * Run database migrations and seed from mock data.
 * Usage: npm run db:migrate
 */
import { resolve } from "path";
import { loadEnvFile } from "../src/lib/env/parse-dotenv";
import { ensureSupabasePoolerConfig } from "../src/lib/db/discover-pooler";
import { ensureDbReady } from "../src/lib/db/postgres";
import { pgReadStore } from "../src/lib/db/postgres";
import { getDatabaseProvider, getDatabaseUrlValidationError } from "../src/lib/db/sql";

async function main() {
  loadEnvFile(resolve(process.cwd(), ".env"));

  try {
    await ensureSupabasePoolerConfig();
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }

  const dbError = getDatabaseUrlValidationError();
  if (dbError) {
    console.error(dbError);
    console.error("");
    console.error("מומלץ — שים את סיסמת ה-DB הגולמית (לא מקודדת!) במרכאות:");
    console.error('SUPABASE_DB_PASSWORD="Eee-2026!@#"');
    process.exit(1);
  }

  const provider = getDatabaseProvider();
  console.log(`Database provider: ${provider}`);
  console.log("Running migrations and seed...");

  await ensureDbReady();
  const store = await pgReadStore();
  console.log(
    `Done: ${store.products.length} products, ${store.categories.length} categories`
  );
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("password authentication failed") || message.includes("28P01")) {
    console.error("");
    console.error("סיסמת DB שגויה.");
    console.error("1. Supabase → Settings → Database → Reset database password → Generate");
    console.error("2. Connect → Session pooler → העתק URI מלא ל-DATABASE_URL");
    console.error('   (או SUPABASE_DB_PASSWORD="סיסמה_חדשה" במרכאות)');
  } else if (message.includes("CONNECT_TIMEOUT") && message.includes("db.")) {
    console.error("");
    console.error("חיבור ישיר (db.xxx.supabase.co) דורש IPv6 — Windows לרוב לא תומך.");
    console.error("השתמש ב-Session pooler (IPv4):");
    console.error("Supabase → Connect → Session pooler → העתק URI → DATABASE_URL");
  } else if (message.includes("ENOTFOUND") || message.includes("tenant/user")) {
    console.error("שגיאת חיבור ל-Supabase Postgres.");
    console.error("העתק את DATABASE_URL במדויק מ-Supabase → Settings → Database → Connection string.");
    console.error("ודא שהסיסמה נכונה (Settings → Database → Database password).");
  }
  console.error(err);
  process.exit(1);
});
