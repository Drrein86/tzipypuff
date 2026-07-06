import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tzipypuff.co.il";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/catalog",
    "/promotions",
    "/about",
    "/contact",
    "/club",
    "/checkout",
    "/privacy",
    "/terms",
    "/shipping-returns",
    "/cookies",
  ];

  return routes.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
