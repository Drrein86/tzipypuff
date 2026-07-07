import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  isSupabaseStorageEnabled,
} from "./env";

let adminClient: SupabaseClient | null = null;

/** Server-side Supabase client with service role (bypasses RLS). */
export function getSupabaseAdmin(): SupabaseClient {
  if (!isSupabaseStorageEnabled()) {
    throw new Error("Supabase admin is not configured (URL + service role key)");
  }

  if (!adminClient) {
    adminClient = createClient(getSupabaseUrl()!, getSupabaseServiceRoleKey()!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return adminClient;
}
