import { Suspense } from "react";
import Hero from "@/components/sections/Hero";
import CategoryShowcase from "@/components/sections/CategoryShowcase";
import TrendingBrands from "@/components/sections/TrendingBrands";
import SkincareBento from "@/components/sections/SkincareBento";
import TrendingMalls from "@/components/sections/TrendingMalls";
import FashionBento from "@/components/sections/FashionBento";
import TrendingProducts from "@/components/sections/TrendingProducts";
import MerchantCTA from "@/components/sections/MerchantCTA";
import PageLayout from "@/components/layout/UX/PageLayout";
import { 
  TrendingBrandsSkeleton, 
  TrendingMallsSkeleton, 
  TrendingProductsSkeleton 
} from "@/components/sections/skeletons/SectionSkeletons";
import { getCachedTrendingBrands } from "@/components/sections/TrendingBrands";
import { getCachedMalls } from "@/components/sections/TrendingMalls";
import { getCachedTrendingProducts } from "@/components/sections/TrendingProducts";

export default function Home() {
  // Parallel pre-fetch (Starts fetches immediately to prevent sequential waterfalls)
  getCachedTrendingBrands();
  getCachedMalls();
  getCachedTrendingProducts();

  return (
    <PageLayout>
      {/* Hero Section - Static/Pre-rendered */}
      <Hero />

      {/* Category Grid - Added per user request */}
      <CategoryShowcase />

      {/* Trending Brands - Streamed */}
      <Suspense fallback={<TrendingBrandsSkeleton />}>
        <TrendingBrands />
      </Suspense>

      {/* Skincare Bento Grid */}
      <SkincareBento />

      {/* Trending Malls - Streamed */}
      <Suspense fallback={<TrendingMallsSkeleton />}>
        <TrendingMalls />
      </Suspense>

      {/* Fashion Bento Grid */}
      <FashionBento />

      {/* Trending Products - Streamed */}
      <Suspense fallback={<TrendingProductsSkeleton />}>
        <TrendingProducts />
      </Suspense>

      {/* Merchant CTA Section */}
      <MerchantCTA />
    </PageLayout>
  );
}
