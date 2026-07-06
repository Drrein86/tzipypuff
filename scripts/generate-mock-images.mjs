import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const MOCK_DIR = join(ROOT, "src", "lib", "mock");

// Read products from compiled mock - use dynamic import of TS not available, parse products.ts slugs
// Instead: read MOCK_PRODUCTS from a generated list or parse products.ts

const CATEGORY_STYLE = {
  tobacco: { accent: "#FF2EA6", label: "TOBACCO" },
  liquids: { accent: "#27B8FF", label: "E-LIQUID" },
  vapes: { accent: "#7B3EFF", label: "VAPE" },
  accessories: { accent: "#C8A96A", label: "GEAR" },
  coals: { accent: "#78716c", label: "COALS" },
  filters: { accent: "#27B8FF", label: "FILTER" },
  rolling: { accent: "#C8A96A", label: "ROLLING" },
  pipes: { accent: "#a78bfa", label: "PIPE" },
  bongs: { accent: "#22d3ee", label: "BONG" },
};

function parseProductsFromMock() {
  const src = readFileSync(join(MOCK_DIR, "products.ts"), "utf-8");
  const products = [];
  const re = /slug:\s*"([^"]+)"[\s\S]*?categoryId:\s*"([^"]+)"[\s\S]*?brandId:\s*"([^"]+)"[\s\S]*?nameHe:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    products.push({ slug: m[1], category: m[2], brandId: m[3], nameHe: m[4] });
  }
  return products;
}

function brandName(id) {
  return id.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function svg({ brand, sub, accent, label }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#141820"/><stop offset="100%" stop-color="#05070B"/></linearGradient>
    <radialGradient id="glow" cx="50%" cy="35%" r="55%"><stop offset="0%" stop-color="${accent}" stop-opacity="0.4"/><stop offset="100%" stop-color="${accent}" stop-opacity="0"/></radialGradient>
    <linearGradient id="pack" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1a1f28"/><stop offset="100%" stop-color="#0d1016"/></linearGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.5"/></filter>
  </defs>
  <rect width="400" height="500" fill="url(#bg)"/>
  <rect width="400" height="500" fill="url(#glow)"/>
  <rect x="85" y="55" width="230" height="340" rx="16" fill="url(#pack)" stroke="${accent}" stroke-opacity="0.5" stroke-width="2" filter="url(#shadow)"/>
  <rect x="105" y="80" width="190" height="130" rx="10" fill="${accent}" fill-opacity="0.15"/>
  <text x="200" y="155" text-anchor="middle" fill="${accent}" font-family="Arial,sans-serif" font-size="10" font-weight="700" letter-spacing="4">${label}</text>
  <text x="200" y="250" text-anchor="middle" fill="#fff" font-family="Georgia,serif" font-size="20" font-weight="700">${brand}</text>
  <text x="200" y="285" text-anchor="middle" fill="#fff" fill-opacity="0.55" font-family="Arial,sans-serif" font-size="13">${sub}</text>
  <rect x="125" y="330" width="150" height="4" rx="2" fill="${accent}" fill-opacity="0.65"/>
  <text x="200" y="420" text-anchor="middle" fill="#C8A96A" font-family="Arial,sans-serif" font-size="10" letter-spacing="2">TZIPY PUFF</text>
</svg>`;
}

const products = parseProductsFromMock();
const OUT = join(ROOT, "public", "products", "mock");
let count = 0;

for (const p of products) {
  const style = CATEGORY_STYLE[p.category] ?? CATEGORY_STYLE.accessories;
  const sub = p.nameHe.includes("—") ? p.nameHe.split("—")[1].trim() : p.nameHe;
  const brand = p.nameHe.includes("—") ? p.nameHe.split("—")[0].trim() : brandName(p.brandId);
  const dir = join(OUT, p.category);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, `${p.slug}.svg`),
    svg({ brand, sub, accent: style.accent, label: style.label })
  );
  count++;
}

for (const [cat, style] of Object.entries(CATEGORY_STYLE)) {
  const dir = join(OUT, cat);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "_category.svg"),
    svg({ brand: "Premium", sub: style.label, accent: style.accent, label: style.label })
  );
  count++;
}

console.log(`Generated ${count} mock product images in public/products/mock/`);
