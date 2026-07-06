import { readStore } from "@/lib/data/store";
import { ProductCard } from "@/components/catalog/ProductCard";

export default async function PromotionsPage() {
  const store = await readStore();
  const saleProducts = store.products.filter((p) => p.onSale && p.inStock);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-2 text-center text-2xl font-bold text-white">מבצעים</h1>
      <p className="mb-8 text-center text-sm text-white/45">מוצרים במחיר מיוחד — לזמן מוגבל</p>

      {saleProducts.length === 0 ? (
        <p className="text-center text-white/40">אין מבצעים פעילים כרגע</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {saleProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
