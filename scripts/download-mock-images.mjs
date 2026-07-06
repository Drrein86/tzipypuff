/**
 * מוריד תמונות mock מקומיות (Picsum) — הרצה: node scripts/download-mock-images.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const MOCK_TS = join(ROOT, "src", "lib", "mock", "products.ts");

function parseProducts() {
  const src = readFileSync(MOCK_TS, "utf-8");
  const products = [];
  const re = /slug:\s*"([^"]+)"[\s\S]*?categoryId:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    products.push({ slug: m[1], category: m[2] });
  }
  return products;
}

async function download(url, dest) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
}

const products = parseProducts();
let ok = 0;

for (const { slug, category } of products) {
  const dir = join(ROOT, "public", "products", "mock", category);
  mkdirSync(dir, { recursive: true });
  const dest = join(dir, `${slug}.jpg`);
  if (existsSync(dest) && statSync(dest).size > 5000) {
    ok++;
    continue;
  }
  const seed = `tzipypuff-${category}-${slug}`;
  const url = `https://picsum.photos/seed/${encodeURIComponent(seed)}/400/500`;
  try {
    await download(url, dest);
    ok++;
    process.stdout.write(".");
  } catch (e) {
    console.warn(`\nSkip ${slug}: ${e.message}`);
  }
}

console.log(`\n✓ ${ok}/${products.length} product photos in public/products/mock/`);
