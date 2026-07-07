import postgres from "postgres";
import { getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase/env";
import { normalizeDbPassword } from "@/lib/db/discover-pooler";

type Sql = ReturnType<typeof postgres>;

let sqlInstance: Sql | null = null;

const PLACEHOLDER_DATABASE_URL =
  /user:password@|@host\/|\[PASSWORD\]|\[YOUR-PASSWORD\]|\[ref\]|\[region\]|xxxxxxxx|\.{4,}|aws-0-\.\.\.\./i;

function getSupabaseProjectRef(): string | null {
  const url = getSupabaseUrl();
  if (!url) return null;
  try {
    const ref = new URL(url).hostname.split(".")[0];
    return ref || null;
  } catch {
    return null;
  }
}

function buildPasswordUrl(
  ref: string,
  password: string,
  user: string,
  host: string,
  port: string,
  database: string
): string {
  const normalized = normalizeDbPassword(password);
  return `postgresql://${user}:${encodeURIComponent(normalized)}@${host}:${port}/${database}`;
}

/** Builds a safe Postgres URI; encodes passwords with @ # % etc. automatically. */
export function resolveDatabaseUrl(): string | null {
  const url = process.env.DATABASE_URL?.trim();
  if (url && !PLACEHOLDER_DATABASE_URL.test(url)) {
    return url;
  }

  const password = process.env.SUPABASE_DB_PASSWORD?.trim();
  if (password) {
    const ref = getSupabaseProjectRef();
    if (!ref) return null;

    const database = process.env.SUPABASE_DB_NAME?.trim() || "postgres";
    const poolerHost = process.env.SUPABASE_DB_HOST?.trim();
    const port = process.env.SUPABASE_DB_PORT?.trim() || "5432";

    if (poolerHost) {
      const user = process.env.SUPABASE_DB_USER?.trim() || `postgres.${ref}`;
      return buildPasswordUrl(ref, password, user, poolerHost, port, database);
    }

    if (process.env.SUPABASE_DB_REGION?.trim()) {
      const region = process.env.SUPABASE_DB_REGION.trim();
      const prefix = process.env.SUPABASE_DB_POOLER?.trim() || "aws-0";
      const host = `${prefix}-${region}.pooler.supabase.com`;
      return buildPasswordUrl(ref, password, `postgres.${ref}`, host, port, database);
    }

    return null;
  }

  return null;
}

export function getDatabaseUrlValidationError(): string | null {
  if (resolveDatabaseUrl()) return null;

  if (process.env.SUPABASE_DB_PASSWORD?.trim() && !getSupabaseProjectRef()) {
    return "SUPABASE_DB_PASSWORD מוגדר אבל NEXT_PUBLIC_SUPABASE_URL / SUPABASE_URL חסר";
  }

  const url = process.env.DATABASE_URL?.trim();
  if (!url && !process.env.SUPABASE_DB_PASSWORD?.trim()) {
    return "חסר חיבור DB — הגדר SUPABASE_DB_PASSWORD או DATABASE_URL מ-Supabase Connect";
  }
  if (url && PLACEHOLDER_DATABASE_URL.test(url)) {
    return "DATABASE_URL עדיין placeholder — העתק URI מ-Supabase Connect";
  }

  if (process.env.SUPABASE_DB_PASSWORD?.trim()) {
    return "לא נמצא pooler — Supabase → Connect → Session pooler → DATABASE_URL";
  }

  return "לא ניתן לבנות חיבור DB";
}

export function isDatabaseEnabled(): boolean {
  if (resolveDatabaseUrl()) return true;
  const url = process.env.DATABASE_URL?.trim();
  if (url && !PLACEHOLDER_DATABASE_URL.test(url)) return true;
  if (process.env.SUPABASE_DB_PASSWORD?.trim() && getSupabaseProjectRef()) return true;
  return false;
}

export function getDatabaseProvider(): "supabase" | "postgres" | "file" {
  if (!isDatabaseEnabled()) return "file";
  if (isSupabaseConfigured()) return "supabase";
  return "postgres";
}

export function getSql(): Sql {
  const url = resolveDatabaseUrl();
  if (!url) {
    throw new Error(getDatabaseUrlValidationError() ?? "DATABASE_URL is not configured");
  }

  if (!sqlInstance) {
    const isPooler = url.includes(".pooler.supabase.com") || url.includes(":6543");
    sqlInstance = postgres(url, {
      ssl: url.includes("localhost") || url.includes("127.0.0.1") ? false : "require",
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
      // Required for Supabase transaction pooler (port 6543)
      prepare: isPooler ? false : undefined,
    });
  }

  return sqlInstance;
}
