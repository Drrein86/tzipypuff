import type { BrandRecord } from "@/lib/db/schema";

const TS = "2026-01-01T00:00:00.000Z";

export const MOCK_BRANDS: BrandRecord[] = [
  { id: "al-fakher", slug: "al-fakher", name: "Al Fakher", logoUrl: null, createdAt: TS, updatedAt: TS },
  { id: "starbuzz", slug: "starbuzz", name: "Starbuzz", logoUrl: null, createdAt: TS, updatedAt: TS },
  { id: "adalya", slug: "adalya", name: "Adalya", logoUrl: null, createdAt: TS, updatedAt: TS },
  { id: "tangiers", slug: "tangiers", name: "Tangiers", logoUrl: null, createdAt: TS, updatedAt: TS },
  { id: "fumari", slug: "fumari", name: "Fumari", logoUrl: null, createdAt: TS, updatedAt: TS },
  { id: "ivg", slug: "ivg", name: "IVG", logoUrl: null, createdAt: TS, updatedAt: TS },
  { id: "nasty-juice", slug: "nasty-juice", name: "Nasty Juice", logoUrl: null, createdAt: TS, updatedAt: TS },
  { id: "dinner-lady", slug: "dinner-lady", name: "Dinner Lady", logoUrl: null, createdAt: TS, updatedAt: TS },
  { id: "vaporesso", slug: "vaporesso", name: "Vaporesso", logoUrl: null, createdAt: TS, updatedAt: TS },
  { id: "geekvape", slug: "geekvape", name: "GeekVape", logoUrl: null, createdAt: TS, updatedAt: TS },
  { id: "smok", slug: "smok", name: "SMOK", logoUrl: null, createdAt: TS, updatedAt: TS },
  { id: "elf-bar", slug: "elf-bar", name: "Elf Bar", logoUrl: null, createdAt: TS, updatedAt: TS },
  { id: "raw", slug: "raw", name: "RAW", logoUrl: null, createdAt: TS, updatedAt: TS },
  { id: "elements", slug: "elements", name: "Elements", logoUrl: null, createdAt: TS, updatedAt: TS },
  { id: "ocb", slug: "ocb", name: "OCB", logoUrl: null, createdAt: TS, updatedAt: TS },
  { id: "coco", slug: "coco", name: "Coco", logoUrl: null, createdAt: TS, updatedAt: TS },
  { id: "three-kings", slug: "three-kings", name: "Three Kings", logoUrl: null, createdAt: TS, updatedAt: TS },
  { id: "premium", slug: "premium", name: "Premium", logoUrl: null, createdAt: TS, updatedAt: TS },
  { id: "kaloud", slug: "kaloud", name: "Kaloud", logoUrl: null, createdAt: TS, updatedAt: TS },
];

export const MOCK_BRAND_NAMES = MOCK_BRANDS.map((b) => b.name);
