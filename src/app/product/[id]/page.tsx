import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/lib/data/store";
import { getRelatedProducts } from "@/lib/products";
import { ProductDetail } from "@/components/product/ProductDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "מוצר לא נמצא" };
  return {
    title: `${product.nameHe} | ציפי Puff`,
    description: product.descriptionHe,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const all = await getProducts();
  const related = getRelatedProducts(all, product);

  return <ProductDetail product={product} related={related} />;
}
