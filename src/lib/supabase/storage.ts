import { getSupabaseAdmin } from "./admin";
import { isSupabaseStorageEnabled } from "./env";

export const PRODUCT_IMAGES_BUCKET = "product-images";

let bucketReady: Promise<void> | null = null;

async function ensureProductImagesBucket(): Promise<void> {
  if (!bucketReady) {
    bucketReady = (async () => {
      const supabase = getSupabaseAdmin();
      const { data: buckets } = await supabase.storage.listBuckets();
      const exists = buckets?.some((b) => b.name === PRODUCT_IMAGES_BUCKET);

      if (!exists) {
        const { error } = await supabase.storage.createBucket(PRODUCT_IMAGES_BUCKET, {
          public: true,
          fileSizeLimit: 5 * 1024 * 1024,
          allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
        });
        if (error && !error.message.toLowerCase().includes("already exists")) {
          throw error;
        }
      }
    })();
  }

  return bucketReady;
}

export async function uploadProductImage(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  if (!isSupabaseStorageEnabled()) {
    throw new Error("Supabase Storage is not configured");
  }

  await ensureProductImagesBucket();

  const supabase = getSupabaseAdmin();
  const path = `uploads/${fileName}`;

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, buffer, { contentType, upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
