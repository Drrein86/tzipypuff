import type { ProductRecord } from "@/lib/db/schema";
import type { Strength } from "@/lib/data/types";

const TS = "2026-01-01T00:00:00.000Z";

type ProductInput = {
  id: string;
  slug: string;
  categoryId: string;
  brandId: string;
  name: string;
  nameHe: string;
  price: number;
  salePrice?: number;
  flavor?: string;
  strength?: Strength;
  inStock?: boolean;
  stockQty?: number;
  onSale?: boolean;
  featured?: boolean;
  descriptionHe: string;
  specs: Record<string, string>;
  gradient: string;
  sortOrder: number;
};

function img(categoryId: string, slug: string) {
  return `/products/mock/${categoryId}/${slug}.jpg`;
}

function p(input: ProductInput): ProductRecord {
  const imageUrl = img(input.categoryId, input.slug);
  return {
    id: input.id,
    slug: input.slug,
    categoryId: input.categoryId,
    brandId: input.brandId,
    name: input.name,
    nameHe: input.nameHe,
    descriptionHe: input.descriptionHe,
    price: input.price,
    salePrice: input.salePrice ?? null,
    imageUrl,
    images: [imageUrl],
    flavor: input.flavor ?? null,
    strength: input.strength ?? null,
    inStock: input.inStock ?? true,
    stockQty: input.stockQty ?? (input.inStock === false ? 0 : 50),
    onSale: input.onSale ?? false,
    featured: input.featured ?? false,
    specs: input.specs,
    gradient: input.gradient,
    sortOrder: input.sortOrder,
    createdAt: TS,
    updatedAt: TS,
  };
}

/** 4 מוצרים לכל קטגוריה — 36 סה"כ */
export const MOCK_PRODUCTS: ProductRecord[] = [
  // ── טבק ──
  p({ id: "p-tob-01", slug: "al-fakher-two-apple", categoryId: "tobacco", brandId: "al-fakher", name: "Al Fakher Two Apple", nameHe: "Al Fakher — Two Apple", price: 85, flavor: "תפוח", strength: "בינוני", featured: true, sortOrder: 1, descriptionHe: "טבק נרגילה Al Fakher Two Apple — 250g, אריזה מקורית.", specs: { משקל: "250g", מקור: "UAE" }, gradient: "from-neutral-800 via-neutral-900 to-black" }),
  p({ id: "p-tob-02", slug: "starbuzz-blue-mist", categoryId: "tobacco", brandId: "starbuzz", name: "Starbuzz Blue Mist", nameHe: "Starbuzz — Blue Mist", price: 95, salePrice: 79, onSale: true, flavor: "פירות יער", strength: "קל", featured: true, sortOrder: 2, descriptionHe: "Starbuzz Blue Mist — bestseller עולמי.", specs: { משקל: "250g", מקור: "USA" }, gradient: "from-slate-500 via-slate-700 to-slate-900" }),
  p({ id: "p-tob-03", slug: "adalya-love-66", categoryId: "tobacco", brandId: "adalya", name: "Adalya Love 66", nameHe: "Adalya — Love 66", price: 75, flavor: "אבטיח", strength: "בינוני", featured: true, sortOrder: 3, descriptionHe: "Adalya Love 66 — אבטיח וענבים.", specs: { משקל: "250g", מקור: "Turkey" }, gradient: "from-fuchsia-800 via-purple-900 to-indigo-950" }),
  p({ id: "p-tob-04", slug: "tangiers-cane-mint", categoryId: "tobacco", brandId: "tangiers", name: "Tangiers Cane Mint", nameHe: "Tangiers — Cane Mint", price: 120, flavor: "מנטה", strength: "חזק", sortOrder: 4, descriptionHe: "Tangiers Cane Mint — טבק Dark Leaf פרימיום.", specs: { משקל: "250g", סוג: "Dark Leaf" }, gradient: "from-green-900 via-emerald-950 to-black" }),

  // ── נוזלים ──
  p({ id: "p-liq-01", slug: "ivg-rainbow-blast", categoryId: "liquids", brandId: "ivg", name: "IVG Rainbow Blast", nameHe: "IVG — Rainbow Blast", price: 60, flavor: "פירות", strength: "בינוני", featured: true, sortOrder: 1, descriptionHe: "נוזל IVG Rainbow Blast 50ml, 6mg.", specs: { נפח: "50ml", ניקוטין: "6mg" }, gradient: "from-cyan-700 via-blue-800 to-indigo-950" }),
  p({ id: "p-liq-02", slug: "ivg-blue-raspberry", categoryId: "liquids", brandId: "ivg", name: "IVG Blue Raspberry", nameHe: "IVG — Blue Raspberry", price: 60, salePrice: 49, onSale: true, flavor: "פטל", strength: "קל", sortOrder: 2, descriptionHe: "IVG Blue Raspberry 50ml.", specs: { נפח: "50ml", ניקוטין: "3mg" }, gradient: "from-blue-800 via-indigo-900 to-violet-950" }),
  p({ id: "p-liq-03", slug: "nasty-juice-cushman", categoryId: "liquids", brandId: "nasty-juice", name: "Nasty Juice Cushman", nameHe: "Nasty Juice — Cushman", price: 70, flavor: "מנגו", strength: "בינוני", sortOrder: 3, descriptionHe: "Nasty Juice Cushman Mango — 60ml.", specs: { נפח: "60ml", ניקוטין: "3mg" }, gradient: "from-yellow-700 via-orange-900 to-amber-950" }),
  p({ id: "p-liq-04", slug: "dinner-lady-lemon-tart", categoryId: "liquids", brandId: "dinner-lady", name: "Dinner Lady Lemon Tart", nameHe: "Dinner Lady — Lemon Tart", price: 65, flavor: "לימון", strength: "קל", sortOrder: 4, descriptionHe: "Dinner Lady Lemon Tart — 50ml Salt.", specs: { נפח: "50ml", ניקוטין: "20mg Salt" }, gradient: "from-amber-600 via-yellow-900 to-orange-950" }),

  // ── Vapes ──
  p({ id: "p-vap-01", slug: "vaporesso-xros-3", categoryId: "vapes", brandId: "vaporesso", name: "Vaporesso XROS 3", nameHe: "Vaporesso XROS 3", price: 189, featured: true, sortOrder: 1, descriptionHe: "Pod System פרימיום.", specs: { סוללה: "1000mAh", Pod: "2ml" }, gradient: "from-zinc-600 via-zinc-800 to-zinc-950" }),
  p({ id: "p-vap-02", slug: "geekvape-aegis", categoryId: "vapes", brandId: "geekvape", name: "GeekVape Aegis Boost", nameHe: "GeekVape Aegis Boost", price: 249, sortOrder: 2, descriptionHe: "עמיד למים IP67.", specs: { סוללה: "1500mAh" }, gradient: "from-emerald-900 via-teal-950 to-black" }),
  p({ id: "p-vap-03", slug: "smok-nord-5", categoryId: "vapes", brandId: "smok", name: "SMOK Nord 5", nameHe: "SMOK Nord 5", price: 159, salePrice: 129, onSale: true, sortOrder: 3, descriptionHe: "SMOK Nord 5 — 80W.", specs: { סוללה: "2000mAh" }, gradient: "from-red-900 via-rose-950 to-black" }),
  p({ id: "p-vap-04", slug: "elf-bar-bc5000", categoryId: "vapes", brandId: "elf-bar", name: "Elf Bar BC5000", nameHe: "Elf Bar BC5000", price: 89, salePrice: 69, onSale: true, featured: true, sortOrder: 4, descriptionHe: "Disposable 5000 puffs.", specs: { Puffs: "5000", ניקוטין: "5%" }, gradient: "from-pink-700 via-fuchsia-900 to-purple-950" }),

  // ── גלגול ──
  p({ id: "p-rol-01", slug: "raw-classic-papers", categoryId: "rolling", brandId: "raw", name: "RAW Classic Papers", nameHe: "RAW Classic — ניירות", price: 55, featured: true, sortOrder: 1, descriptionHe: "ניירות RAW Classic King Size.", specs: { כמות: "50 leaves" }, gradient: "from-amber-800 via-orange-900 to-stone-950" }),
  p({ id: "p-rol-02", slug: "raw-cones", categoryId: "rolling", brandId: "raw", name: "RAW Pre-Rolled Cones", nameHe: "RAW — קונוסים", price: 45, sortOrder: 2, descriptionHe: "6 קונוסים מוכנים.", specs: { כמות: "6" }, gradient: "from-amber-900 to-orange-950" }),
  p({ id: "p-rol-03", slug: "elements-king-size", categoryId: "rolling", brandId: "elements", name: "Elements King Size", nameHe: "Elements — King Size", price: 48, sortOrder: 3, descriptionHe: "ניירות Elements Ultra Thin.", specs: { כמות: "32 leaves" }, gradient: "from-red-900 via-orange-950 to-amber-950" }),
  p({ id: "p-rol-04", slug: "ocb-premium-black", categoryId: "rolling", brandId: "ocb", name: "OCB Premium Black", nameHe: "OCB Premium Black", price: 42, sortOrder: 4, descriptionHe: "OCB Premium Black King Size.", specs: { כמות: "32 leaves" }, gradient: "from-zinc-700 via-zinc-900 to-black" }),

  // ── פחמים ──
  p({ id: "p-coa-01", slug: "coconut-coals-1kg", categoryId: "coals", brandId: "coco", name: "Coconut Coals 1kg", nameHe: "פחמי קוקוס 1kg", price: 35, sortOrder: 1, descriptionHe: "72 cubes, בעירה ארוכה.", specs: { משקל: "1kg" }, gradient: "from-stone-700 via-stone-900 to-black" }),
  p({ id: "p-coa-02", slug: "quick-light-coals", categoryId: "coals", brandId: "coco", name: "Quick Light Coals", nameHe: "פחמים מהירים", price: 20, sortOrder: 2, descriptionHe: "10 tablets, הצתה מהירה.", specs: { כמות: "10" }, gradient: "from-gray-600 to-gray-900" }),
  p({ id: "p-coa-03", slug: "coco-cube-premium", categoryId: "coals", brandId: "coco", name: "Coco Cube Premium", nameHe: "Coco Cube Premium 500g", price: 28, sortOrder: 3, descriptionHe: "36 cubes קוקוס natural.", specs: { משקל: "500g" }, gradient: "from-stone-600 via-stone-800 to-stone-950" }),
  p({ id: "p-coa-04", slug: "three-kings-charcoal", categoryId: "coals", brandId: "three-kings", name: "Three Kings Charcoal", nameHe: "Three Kings — פחמים", price: 22, sortOrder: 4, descriptionHe: "33mm quick-light disks.", specs: { כמות: "10" }, gradient: "from-neutral-700 to-neutral-950" }),

  // ── אביזרים ──
  p({ id: "p-acc-01", slug: "silicone-bowl", categoryId: "accessories", brandId: "premium", name: "Silicone Hookah Bowl", nameHe: "קערת Silicone", price: 65, sortOrder: 1, descriptionHe: "קערה עמידה בחום.", specs: { קוטר: "7cm" }, gradient: "from-gray-700 via-gray-900 to-black" }),
  p({ id: "p-acc-02", slug: "kaloud-lotus", categoryId: "accessories", brandId: "kaloud", name: "Kaloud Lotus", nameHe: "Kaloud Lotus", price: 149, sortOrder: 2, descriptionHe: "מערכת חימום Kaloud.", specs: { חומר: "Aluminum" }, gradient: "from-zinc-700 to-zinc-950" }),
  p({ id: "p-acc-03", slug: "metal-grinder", categoryId: "accessories", brandId: "premium", name: "Metal Grinder 4pc", nameHe: "גריינדר מתכת", price: 75, sortOrder: 3, descriptionHe: "4 חלקים, 55mm.", specs: { קוטר: "55mm" }, gradient: "from-neutral-600 to-neutral-900" }),
  p({ id: "p-acc-04", slug: "premium-hose", categoryId: "accessories", brandId: "premium", name: "Premium Hookah Hose", nameHe: "צינור פרימיום", price: 85, sortOrder: 4, descriptionHe: "צינור Silicone washable.", specs: { אורך: "180cm" }, gradient: "from-slate-700 to-slate-950" }),

  // ── פילטרים ──
  p({ id: "p-fil-01", slug: "glass-filter-tips", categoryId: "filters", brandId: "premium", name: "Glass Filter Tips", nameHe: "פילטרים מזכוכית", price: 25, sortOrder: 1, descriptionHe: "5 פילטרים reusable.", specs: { כמות: "5" }, gradient: "from-sky-900 via-blue-950 to-black" }),
  p({ id: "p-fil-02", slug: "mouth-tips", categoryId: "filters", brandId: "premium", name: "Mouth Tips Pack", nameHe: "ראשיות חד פעמי", price: 15, sortOrder: 2, descriptionHe: "100 ראשיות individually wrapped.", specs: { כמות: "100" }, gradient: "from-blue-900 to-indigo-950" }),
  p({ id: "p-fil-03", slug: "charcoal-filters-pack", categoryId: "filters", brandId: "premium", name: "Charcoal Filters", nameHe: "פילטרים פחמיים", price: 18, sortOrder: 3, descriptionHe: "10 פילטרים activated charcoal.", specs: { כמות: "10" }, gradient: "from-gray-800 via-zinc-900 to-black" }),
  p({ id: "p-fil-04", slug: "mesh-screen-roll", categoryId: "filters", brandId: "premium", name: "Mesh Screen Roll", nameHe: "גליל רשת Stainless", price: 12, sortOrder: 4, descriptionHe: "רשת נירוסטה לנרגילה.", specs: { אורך: "1m" }, gradient: "from-slate-600 to-slate-900" }),

  // ── מקטרות ──
  p({ id: "p-pip-01", slug: "glass-pipe", categoryId: "pipes", brandId: "premium", name: "Glass Hand Pipe", nameHe: "מקטרת זכוכית", price: 120, sortOrder: 1, descriptionHe: "מקטרת borosilicate.", specs: { אורך: "12cm" }, gradient: "from-violet-800 via-purple-950 to-black" }),
  p({ id: "p-pip-02", slug: "spoon-pipe-spiral", categoryId: "pipes", brandId: "premium", name: "Spoon Pipe Spiral", nameHe: "Spoon Pipe — Spiral", price: 95, sortOrder: 2, descriptionHe: "Spoon pipe עם עיצוב spiral.", specs: { אורך: "10cm" }, gradient: "from-indigo-800 via-violet-950 to-black" }),
  p({ id: "p-pip-03", slug: "sherlock-glass-pipe", categoryId: "pipes", brandId: "premium", name: "Sherlock Glass Pipe", nameHe: "Sherlock Glass Pipe", price: 135, sortOrder: 3, descriptionHe: "Sherlock style borosilicate.", specs: { אורך: "14cm" }, gradient: "from-purple-800 via-fuchsia-950 to-black" }),
  p({ id: "p-pip-04", slug: "steamroller-clear", categoryId: "pipes", brandId: "premium", name: "Steamroller Clear", nameHe: "Steamroller — Clear", price: 110, sortOrder: 4, descriptionHe: "Steamroller זכוכית שקופה.", specs: { אורך: "15cm" }, gradient: "from-cyan-800 via-teal-950 to-black" }),

  // ── באנגים ──
  p({ id: "p-bng-01", slug: "beaker-bong-30", categoryId: "bongs", brandId: "premium", name: "Beaker Bong 30cm", nameHe: "Beaker Bong 30cm", price: 299, sortOrder: 1, descriptionHe: "זכוכית 5mm beaker.", specs: { גובה: "30cm" }, gradient: "from-teal-800 via-cyan-950 to-black" }),
  p({ id: "p-bng-02", slug: "straight-tube-bong", categoryId: "bongs", brandId: "premium", name: "Straight Tube 40cm", nameHe: "Straight Tube 40cm", price: 349, sortOrder: 2, descriptionHe: "Bong straight tube.", specs: { גובה: "40cm" }, gradient: "from-cyan-900 to-blue-950" }),
  p({ id: "p-bng-03", slug: "perc-bong-25", categoryId: "bongs", brandId: "premium", name: "Perc Bong 25cm", nameHe: "Perc Bong 25cm", price: 279, salePrice: 249, onSale: true, sortOrder: 3, descriptionHe: "Honeycomb perc 25cm.", specs: { גובה: "25cm", Perc: "Honeycomb" }, gradient: "from-blue-800 via-indigo-950 to-black" }),
  p({ id: "p-bng-04", slug: "mini-bong-18", categoryId: "bongs", brandId: "premium", name: "Mini Bong 18cm", nameHe: "Mini Bong 18cm", price: 189, sortOrder: 4, descriptionHe: "Mini bong קומפקטי.", specs: { גובה: "18cm" }, gradient: "from-emerald-800 via-teal-950 to-black" }),
];

/** מוצרים לפי קטגוריה — לבדיקות */
export function getMockProductsByCategory(categoryId: string): ProductRecord[] {
  return MOCK_PRODUCTS.filter((p) => p.categoryId === categoryId);
}
