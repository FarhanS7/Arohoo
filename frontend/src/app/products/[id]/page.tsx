import ProductDetailClient from "@/features/products/components/ProductDetailClient";
import { productService } from "@/lib/api/products";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const res = await productService.getPublicProductById(id);
    if (!res.success || !res.data) {
      return {
        title: "Product Not Found | Arohoo",
      };
    }

    const product = res.data;
    const description = product.description?.slice(0, 160) || "Premium sustainable essential from Arohoo.";
    const imageUrl = product.images.length > 0 
      ? (product.images[0].url.startsWith('http') ? product.images[0].url : `http://localhost:8000${product.images[0].url}`)
      : "http://localhost:3000/placeholder-product.png";

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
  const { id } = await params;

  try {
    const res = await productService.getPublicProductById(id);
    
    if (!res.success || !res.data) {
      notFound();
    }

    return <ProductDetailClient product={res.data} />;
  } catch (error) {
    notFound();
  }
}
