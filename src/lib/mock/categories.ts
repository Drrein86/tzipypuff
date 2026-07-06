import type { CategoryRecord } from "@/lib/db/schema";

const TS = "2026-01-01T00:00:00.000Z";

export const MOCK_CATEGORIES: CategoryRecord[] = [
  { id: "tobacco", slug: "tobacco", label: "טבק לנרגילה", color: "blue", sortOrder: 1, imageUrl: "/products/mock/tobacco/_category.svg", createdAt: TS, updatedAt: TS },
  { id: "liquids", slug: "liquids", label: "נוזלים", color: "blue", sortOrder: 2, imageUrl: "/products/mock/liquids/_category.svg", createdAt: TS, updatedAt: TS },
  { id: "vapes", slug: "vapes", label: "סיגריות אלקטרוניות", color: "pink", sortOrder: 3, imageUrl: "/products/mock/vapes/_category.svg", createdAt: TS, updatedAt: TS },
  { id: "accessories", slug: "accessories", label: "אביזרים", color: "pink", sortOrder: 4, imageUrl: "/products/mock/accessories/_category.svg", createdAt: TS, updatedAt: TS },
  { id: "coals", slug: "coals", label: "פחמים", color: "blue", sortOrder: 5, imageUrl: "/products/mock/coals/_category.svg", createdAt: TS, updatedAt: TS },
  { id: "filters", slug: "filters", label: "פילטרים", color: "pink", sortOrder: 6, imageUrl: "/products/mock/filters/_category.svg", createdAt: TS, updatedAt: TS },
  { id: "rolling", slug: "rolling", label: "גלגול", color: "blue", sortOrder: 7, imageUrl: "/products/mock/rolling/_category.svg", createdAt: TS, updatedAt: TS },
  { id: "pipes", slug: "pipes", label: "מקטרות", color: "pink", sortOrder: 8, imageUrl: "/products/mock/pipes/_category.svg", createdAt: TS, updatedAt: TS },
  { id: "bongs", slug: "bongs", label: "באנגים", color: "blue", sortOrder: 9, imageUrl: "/products/mock/bongs/_category.svg", createdAt: TS, updatedAt: TS },
];
