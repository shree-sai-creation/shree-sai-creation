import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://shreesaicreation.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "placeholder_key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
];

export const ALLOWED_DOCUMENT_TYPES = ["application/pdf"];

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_DOCUMENT_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

export const BUCKET_MAPPING: Record<string, string> = {
  products: process.env.SUPABASE_STORAGE_BUCKET_PRODUCTS || "products",
  gallery: process.env.SUPABASE_STORAGE_BUCKET_GALLERY || "gallery",
  banners: process.env.SUPABASE_STORAGE_BUCKET_BANNERS || "banners",
  categories: "categories",
  brands: "brands",
  avatars: "avatars",
  documents: "documents",
};

export async function uploadFileToStorage({
  fileBuffer,
  fileName,
  contentType,
  bucket = "products",
}: {
  fileBuffer: Buffer;
  fileName: string;
  contentType: string;
  bucket?: string;
}): Promise<{ storageKey: string; publicUrl: string }> {
  const targetBucket = BUCKET_MAPPING[bucket] || bucket;
  const storagePath = `${Date.now()}_${fileName}`;

  try {
    const { error } = await supabase.storage
      .from(targetBucket)
      .upload(storagePath, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.warn("Supabase Storage Upload Warning:", error.message);
    }

    const { data } = supabase.storage.from(targetBucket).getPublicUrl(storagePath);
    const publicUrl = data?.publicUrl || `${SUPABASE_URL}/storage/v1/object/public/${targetBucket}/${storagePath}`;
    const storageKey = `${targetBucket}/${storagePath}`;

    return { storageKey, publicUrl };
  } catch (err) {
    console.error("Storage upload error:", err);
    const storageKey = `${targetBucket}/${storagePath}`;
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${targetBucket}/${storagePath}`;
    return { storageKey, publicUrl };
  }
}

export async function deleteFileFromStorage(bucket: string, path: string): Promise<boolean> {
  const targetBucket = BUCKET_MAPPING[bucket] || bucket;
  try {
    const { error } = await supabase.storage.from(targetBucket).remove([path]);
    if (error) {
      console.warn("Supabase Storage Delete Warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Storage delete error:", err);
    return false;
  }
}
