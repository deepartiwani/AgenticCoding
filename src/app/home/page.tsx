import { getProducts, getCategories } from "@/lib/commercetools";
import ShopByCategory from "./ShopByCategory";
import HeroSection from "./HeroSection";
import FeaturedProducts from "./FeaturedProducts";
import PromoBanner from "./PromoBanner";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(8),
    getCategories(),
  ]);
  return (
    <div className="min-h-screen bg-linear-to-b from-white to-violet-50/30 dark:from-zinc-950 dark:to-zinc-950">
      <HeroSection />
      <ShopByCategory categories={categories} />
      <FeaturedProducts products={products} />
      <PromoBanner />
    </div>
  );
}
