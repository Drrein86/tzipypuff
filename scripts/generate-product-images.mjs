import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUT = join(process.cwd(), "public", "products");

const CATEGORY_STYLE = {
  tobacco: { accent: "#FF2EA6", label: "TOBACCO" },
  liquids: { accent: "#27B8FF", label: "E-LIQUID" },
  vapes: { accent: "#7B3EFF", label: "VAPE" },
  accessories: { accent: "#C8A96A", label: "GEAR" },
  coals: { accent: "#78716c", label: "COALS" },
  filters: { accent: "#27B8FF", label: "FILTER" },
  rolling: { accent: "#C8A96A", label: "RAW" },
  pipes: { accent: "#a78bfa", label: "PIPE" },
  bongs: { accent: "#22d3ee", label: "BONG" },
};

const products = [
  { slug: "al-fakher-two-apple", brand: "Al Fakher", sub: "Two Apple", category: "tobacco" },
  { slug: "starbuzz-blue-mist", brand: "Starbuzz", sub: "Blue Mist", category: "tobacco" },
  { slug: "adalya-love-66", brand: "Adalya", sub: "Love 66", category: "tobacco" },
  { slug: "fumari-white-gummy", brand: "Fumari", sub: "White Gummy", category: "tobacco" },
  { slug: "al-fakher-grape-mint", brand: "Al Fakher", sub: "Grape Mint", category: "tobacco" },
  { slug: "tangiers-cane-mint", brand: "Tangiers", sub: "Cane Mint", category: "tobacco" },
  { slug: "ivg-rainbow-blast", brand: "IVG", sub: "Rainbow Blast", category: "liquids" },
  { slug: "ivg-blue-raspberry", brand: "IVG", sub: "Blue Raspberry", category: "liquids" },
  { slug: "nasty-juice-cushman", brand: "Nasty Juice", sub: "Cushman", category: "liquids" },
  { slug: "vaporesso-xros-3", brand: "Vaporesso", sub: "XROS 3", category: "vapes" },
  { slug: "geekvape-aegis", brand: "GeekVape", sub: "Aegis Boost", category: "vapes" },
  { slug: "smok-nord-5", brand: "SMOK", sub: "Nord 5", category: "vapes" },
  { slug: "elf-bar-bc5000", brand: "Elf Bar", sub: "BC5000", category: "vapes" },
  { slug: "raw-classic-papers", brand: "RAW", sub: "Classic", category: "rolling" },
  { slug: "raw-cones", brand: "RAW", sub: "Cones", category: "rolling" },
  { slug: "coconut-coals-1kg", brand: "Coco", sub: "1kg", category: "coals" },
  { slug: "quick-light-coals", brand: "Coco", sub: "Quick Light", category: "coals" },
  { slug: "silicone-bowl", brand: "Premium", sub: "Silicone Bowl", category: "accessories" },
  { slug: "kaloud-lotus", brand: "Kaloud", sub: "Lotus", category: "accessories" },
  { slug: "premium-hose", brand: "Premium", sub: "Hose", category: "accessories" },
  { slug: "metal-grinder", brand: "Premium", sub: "Grinder", category: "accessories" },
  { slug: "rolling-tray", brand: "RAW", sub: "Tray", category: "accessories" },
  { slug: "glass-filter-tips", brand: "Premium", sub: "Glass Tips", category: "filters" },
  { slug: "mouth-tips", brand: "Premium", sub: "Mouth Tips", category: "filters" },
  { slug: "glass-pipe", brand: "Premium", sub: "Hand Pipe", category: "pipes" },
  { slug: "beaker-bong-30", brand: "Premium", sub: "Beaker 30cm", category: "bongs" },
  { slug: "straight-tube-bong", brand: "Premium", sub: "Straight 40cm", category: "bongs" },
  { slug: "cleaning-brush-set", brand: "Premium", sub: "Brushes", category: "accessories" },
  { slug: "perforated-foil", brand: "Premium", sub: "Foil", category: "accessories" },
  { slug: "coal-tongs", brand: "Premium", sub: "Tongs", category: "accessories" },
];

function svg({ brand, sub, category }) {
  const s = CATEGORY_STYLE[category] ?? CATEGORY_STYLE.accessories;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#141820"/>
      <stop offset="100%" stop-color="#05070B"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="35%" r="55%">
      <stop offset="0%" stop-color="${s.accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${s.accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="pack" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1f28"/>
      <stop offset="100%" stop-color="#0d1016"/>
    </linearGradient>
  </defs>
  <rect width="400" height="500" fill="url(#bg)"/>
  <rect width="400" height="500" fill="url(#glow)"/>
  <rect x="95" y="70" width="210" height="320" rx="14" fill="url(#pack)" stroke="${s.accent}" stroke-opacity="0.45" stroke-width="2"/>
  <rect x="110" y="95" width="180" height="120" rx="8" fill="${s.accent}" fill-opacity="0.12"/>
  <text x="200" y="165" text-anchor="middle" fill="${s.accent}" font-family="Arial,sans-serif" font-size="11" font-weight="700" letter-spacing="3">${s.label}</text>
  <text x="200" y="260" text-anchor="middle" fill="#ffffff" font-family="Georgia,serif" font-size="22" font-weight="700">${brand}</text>
  <text x="200" y="295" text-anchor="middle" fill="#ffffff" fill-opacity="0.55" font-family="Arial,sans-serif" font-size="14">${sub}</text>
  <rect x="130" y="340" width="140" height="3" rx="1.5" fill="${s.accent}" fill-opacity="0.6"/>
  <text x="200" y="420" text-anchor="middle" fill="#C8A96A" font-family="Arial,sans-serif" font-size="10" letter-spacing="2">TZIPY PUFF</text>
  <text x="200" y="445" text-anchor="middle" fill="#ffffff" fill-opacity="0.25" font-family="Arial,sans-serif" font-size="9">PREMIUM SMOKE BOUTIQUE</text>
</svg>`;
}

mkdirSync(OUT, { recursive: true });

for (const p of products) {
  writeFileSync(join(OUT, `${p.slug}.svg`), svg(p));
}

for (const [cat, s] of Object.entries(CATEGORY_STYLE)) {
  writeFileSync(
    join(OUT, `${cat}.svg`),
    svg({ brand: "Premium", sub: s.label, category: cat })
  );
}

console.log(`Generated ${products.length + Object.keys(CATEGORY_STYLE).length} product images`);
