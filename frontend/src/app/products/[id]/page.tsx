import ProductDetailClient from "@/features/products/components/ProductDetailClient";
import { productService } from "@/lib/api/products";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PageLayout from "@/components/layout/UX/PageLayout";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const metaStart = performance.now();
  const { id } = await params;
  
  try {
    const fetchStart = performance.now();
    const res = await productService.getPublicProductById(id);
    const fetchEnd = performance.now();
    
    console.log(`[PERF:FRONTEND] generateMetadata (ID: ${id}) - Total: ${(fetchEnd - metaStart).toFixed(2)}ms, Fetch: ${(fetchEnd - fetchStart).toFixed(2)}ms`);

    if (!res.success || !res.data) {
      return {
        title: "Product Not Found | Arohoo",
      };
    }

    const product = res.data;
    const description = product.description?.slice(0, 160) || "Premium sustainable essential from Arohoo.";
    const imageUrl = product.images.length > 0 
      ? product.images[0].url
      : "https://arohoo.com/placeholder-product.png";

    return {
      title: `${product.name} | Arohoo`,
      description,
      openGraph: {
        title: product.name,
        description,
        images: [{ url: imageUrl }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    return {
      title: "Product | Arohoo",
    };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const pageStart = performance.now();
  const { id } = await params;

  try {
    const fetchStart = performance.now();
    const res = await productService.getPublicProductById(id);
    const fetchEnd = performance.now();
    
    console.log(`[PERF:FRONTEND] ProductDetailPage (ID: ${id}) - Total: ${(fetchEnd - pageStart).toFixed(2)}ms, Fetch: ${(fetchEnd - fetchStart).toFixed(2)}ms`);

    if (!res.success || !res.data) {
      notFound();
    }

    const renderStart = performance.now();
    const result = (
      <PageLayout showBackButton={true}>
        <ProductDetailClient product={res.data} />
      </PageLayout>
    );
    const renderEnd = performance.now();
    
    console.log(`[PERF:FRONTEND] ProductDetailClient Init (ID: ${id}) - Duration: ${(renderEnd - renderStart).toFixed(2)}ms`);

    return result;
  } catch (error) {
    notFound();
  }
}
