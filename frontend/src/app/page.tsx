import { Suspense } from "react";
import Hero from "@/components/sections/Hero";
import TrendingBrands from "@/components/sections/TrendingBrands";
import TrendingMalls from "@/components/sections/TrendingMalls";
import TrendingProducts from "@/components/sections/TrendingProducts";
import MerchantCTA from "@/components/sections/MerchantCTA";
import PageLayout from "@/components/layout/UX/PageLayout";
import { 
  TrendingBrandsSkeleton, 
  TrendingMallsSkeleton, 
  TrendingProductsSkeleton 
} from "@/components/sections/skeletons/SectionSkeletons";

export default function Home() {
  return (
    <PageLayout>
      {/* Hero Section - Static/Pre-rendered */}
      <Hero />

      {/* Trending Brands - Streamed */}
      <Suspense fallback={<TrendingBrandsSkeleton />}>
        <TrendingBrands />
      </Suspense>

      {/* Trending Malls - Streamed */}
      <Suspense fallback={<TrendingMallsSkeleton />}>
        <TrendingMalls />
      </Suspense>

      {/* Trending Products - Streamed */}
      <Suspense fallback={<TrendingProductsSkeleton />}>
        <TrendingProducts />
      </Suspense>

      {/* Merchant CTA Section */}
      <MerchantCTA />
    </PageLayout>
  );
}
