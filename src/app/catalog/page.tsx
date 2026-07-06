import { Suspense } from "react";
import { CatalogPage } from "@/components/catalog/CatalogPage";

export const metadata = {
  title: "קטלוג מוצרים | ציפי Puff",
  description: "טבק, נוזלים, סיגריות אלקטרוניות ואביזרים — קטלוג מלא",
};

export default function Catalog() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogPage />
    </Suspense>
  );
}

function CatalogSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-6">
      <div className="mb-6 h-8 w-48 rounded bg-white/5" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-64 rounded-xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}
