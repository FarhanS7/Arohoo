import Hero from "@/components/sections/Hero";
import TrendingBrands from "@/components/sections/TrendingBrands";
import TrendingMalls from "@/components/sections/TrendingMalls";
import TrendingProducts from "@/components/sections/TrendingProducts";
import MerchantCTA from "@/components/sections/MerchantCTA";
import PageLayout from "@/components/layout/UX/PageLayout";

export default function Home() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <Hero />

      {/* Trending Brands */}
      <TrendingBrands />

      {/* Trending Malls */}
      <TrendingMalls />

      {/* Trending Products */}
      <TrendingProducts />

      {/* Merchant CTA Section */}
      <MerchantCTA />
    </PageLayout>
  );
}
