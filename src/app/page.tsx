import { Hero } from "@/components/home/Hero";
import { HomeWelcome } from "@/components/home/HomeWelcome";
import { BenefitsBar } from "@/components/home/BenefitsBar";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { PopularProducts } from "@/components/home/PopularProducts";
import { PromoBanner } from "@/components/home/PromoBanner";
import { TrustBar } from "@/components/home/TrustBar";
import { BrandsSlider } from "@/components/home/BrandsSlider";
import { readStore } from "@/lib/data/store";

export default async function Home() {
  const store = await readStore();
  const featured = store.products.filter((p) => p.featured).slice(0, 5);
  const popular = featured.length >= 5 ? featured : store.products.filter((p) => p.inStock).slice(0, 5);

  return (
    <div className="relative mx-auto max-w-5xl">
      <Hero tagline={store.content.heroTagline} cta={store.content.heroCta} />
      <BenefitsBar />
      <HomeWelcome aboutText={store.content.aboutText} />
      <CategoryGrid categories={store.categories} />
      <PopularProducts products={popular} />
      <PromoBanner content={store.content} />
      <BrandsSlider brands={store.brands} />
      <TrustBar />
    </div>
  );
}
