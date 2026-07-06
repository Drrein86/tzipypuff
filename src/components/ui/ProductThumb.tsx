/** תמונה בטוחה — SVG דרך img, שאר הפורמats דרך next/image */
export function ProductThumb({
  src,
  alt,
  className = "object-contain p-1",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  if (src.endsWith(".svg")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={`h-full w-full ${className}`} />
    );
  }

  // dynamic import avoided — use img as fallback for cart thumbs
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={`h-full w-full ${className}`} />
  );
}
