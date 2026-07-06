import Image from "next/image";
import { getProductImage } from "@/lib/products/images";
import type { Product } from "@/lib/data/types";

interface ProductImageProps {
  product: Pick<Product, "slug" | "category" | "image" | "nameHe" | "brand">;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
}

export function ProductImage({
  product,
  className = "object-contain p-3",
  sizes = "(max-width:768px) 50vw, 20vw",
  priority = false,
  fill = true,
}: ProductImageProps) {
  const src = getProductImage(product);
  const alt = product.nameHe || product.brand;

  // Next.js Image optimizer לא תומך ב-SVG — משתמשים ב-unoptimized
  if (src.endsWith(".svg")) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className={`absolute inset-0 h-full w-full ${className}`} />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={className} />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
