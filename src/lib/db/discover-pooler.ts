import postgres from "postgres";

const REGIONS = [
  "eu-central-1",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "us-east-1",
  "us-west-1",
  "us-west-2",
  "ap-southeast-1",
  "ap-northeast-1",
  "ap-south-1",
  "sa-east-1",
  "ca-central-1",
];

const PREFIXES = ["aws-0", "aws-1"];

export function normalizeDbPassword(password: string): string {
  if (/%40|%23|%25/i.test(password) && !/[@#%]/.test(password.replace(/%40|%23|%25/gi, ""))) {
    try {
      return decodeURIComponent(password);
    } catch {
      return password;
    }
  }
  return password;
}

async function tryPooler(
  ref: string,
  password: string,
  host: string,
  port: string
): Promise<boolean> {
  const user = `postgres.${ref}`;
  const url = `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/postgres`;
  const sql = postgres(url, {
    ssl: "require",
    max: 1,
    connect_timeout: 4,
    prepare: port === "6543",
  });

  try {
    await sql`SELECT 1 AS ok`;
    await sql.end({ timeout: 2 });
    return true;
  } catch {
    await sql.end({ timeout: 1 }).catch(() => {});
    return false;
  }
}

export async function discoverSupabasePoolerHost(
  ref: string,
  password: string
): Promise<{ host: string; port: string } | null> {
  const normalized = normalizeDbPassword(password);

  for (const prefix of PREFIXES) {
    for (const region of REGIONS) {
      const host = `${prefix}-${region}.pooler.supabase.com`;
      if (await tryPooler(ref, normalized, host, "5432")) {
        return { host, port: "5432" };
      }
      if (await tryPooler(ref, normalized, host, "6543")) {
        return { host, port: "6543" };
      }
    }
  }

  return null;
}

export async function ensureSupabasePoolerConfig(): Promise<void> {
  const password = process.env.SUPABASE_DB_PASSWORD?.trim();
  if (!password) return;
  if (process.env.SUPABASE_DB_HOST?.trim()) return;
  if (process.env.SUPABASE_DB_REGION?.trim()) return;

  const url = process.env.DATABASE_URL?.trim();
  if (url?.includes(".pooler.supabase.com")) return;

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || process.env.SUPABASE_URL?.trim();
  if (!supabaseUrl) return;

  const ref = new URL(supabaseUrl).hostname.split(".")[0];
  if (!ref) return;

  console.log("מחפש Session pooler (IPv4)...");
  const found = await discoverSupabasePoolerHost(ref, password);
  if (!found) {
    throw new Error(
      "לא נמצא pooler. Supabase → Connect → Session pooler → העתק URI ל-DATABASE_URL"
    );
  }

  process.env.SUPABASE_DB_HOST = found.host;
  process.env.SUPABASE_DB_PORT = found.port;
  console.log(`נמצא pooler: ${found.host}:${found.port}`);
}
