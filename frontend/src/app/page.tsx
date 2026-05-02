import { Suspense } from "react";
import Hero from "@/components/sections/Hero";
import CategoryShowcase from "@/components/sections/CategoryShowcase";
import TrendingBrands from "@/components/sections/TrendingBrands";
import SkincareBento from "@/components/sections/SkincareBento";
import FashionBento from "@/components/sections/FashionBento";
import TrendingProducts from "@/components/sections/TrendingProducts";
import MerchantCTA from "@/components/sections/MerchantCTA";
import PageLayout from "@/components/layout/UX/PageLayout";
import { 
  TrendingBrandsSkeleton, 
  TrendingProductsSkeleton 
} from "@/components/sections/skeletons/SectionSkeletons";
import { getCachedTrendingBrands } from "@/components/sections/TrendingBrands";
import { getCachedTrendingProducts } from "@/components/sections/TrendingProducts";

export default function Home() {
  // Parallel pre-fetch (Starts fetches immediately to prevent sequential waterfalls)
  getCachedTrendingBrands();
  getCachedTrendingProducts();

  return (
    <PageLayout>
      {/* Hero Section - Static/Pre-rendered */}
      <Hero />

      {/* Category Grid - Added per user request */}
      <CategoryShowcase />

      {/* Skincare Bento Grid */}
      <SkincareBento />

      {/* Trending Products - Streamed */}
      <Suspense fallback={<TrendingProductsSkeleton />}>
        <TrendingProducts />
      </Suspense>

      {/* Fashion Bento Grid */}
      <FashionBento />

      {/* Trending Brands - Streamed */}
      <Suspense fallback={<TrendingBrandsSkeleton />}>
        <TrendingBrands />
      </Suspense>

      {/* Merchant CTA Section */}
      <MerchantCTA />
    </PageLayout>
  );
}
