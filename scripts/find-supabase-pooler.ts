/**
 * Find working Supabase IPv4 pooler host for this project.
 * Usage: npm run db:find-pooler
 */
import { resolve } from "path";
import { loadEnvFile } from "../src/lib/env/parse-dotenv";
import { discoverSupabasePoolerHost } from "../src/lib/db/discover-pooler";
import { getSupabaseUrl } from "../src/lib/supabase/env";

async function main() {
  loadEnvFile(resolve(process.cwd(), ".env"));

  const password = process.env.SUPABASE_DB_PASSWORD?.trim();
  if (!password) {
    console.error("SUPABASE_DB_PASSWORD is required");
    process.exit(1);
  }

  const url = getSupabaseUrl();
  if (!url) {
    console.error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_URL is required");
    process.exit(1);
  }

  const ref = new URL(url).hostname.split(".")[0];
  console.log(`Probing pooler for project ${ref}...`);

  const found = await discoverSupabasePoolerHost(ref, password);
  if (!found) {
    console.error("");
    console.error("No pooler found. Copy URI from Supabase → Connect → Session pooler.");
    process.exit(1);
  }

  console.log("");
  console.log("Add to .env:");
  console.log(`SUPABASE_DB_HOST=${found.host}`);
  console.log(`SUPABASE_DB_PORT=${found.port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
