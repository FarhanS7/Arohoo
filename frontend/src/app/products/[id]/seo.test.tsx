import { generateMetadata } from "@/app/products/[id]/page";
import { productService } from "@/lib/api/products";

jest.mock("@/lib/api/products", () => ({
  productService: {
    getPublicProductById: jest.fn(),
  },
}));

describe("Product Page SEO", () => {
  const mockProduct = {
    id: "prod-123",
    name: "Sustainable Sandals",
    description: "Eco-friendly footwear for the conscious soul.",
    basePrice: 45,
    images: [{ url: "/sandals.jpg", order: 0 }],
    variants: [],
  };

  it("generates correct metadata for a valid product", async () => {
    (productService.getPublicProductById as jest.Mock).mockResolvedValue({
      success: true,
      data: mockProduct,
    });

    const params = Promise.resolve({ id: "prod-123" });
    const metadata = await generateMetadata({ params });

    expect(metadata.title).toBe("Sustainable Sandals | Arohoo");
    expect(metadata.description).toBe(mockProduct.description);
    expect(metadata.openGraph?.title).toBe(mockProduct.name);
    expect(metadata.openGraph?.images).toContainEqual(
      expect.objectContaining({ url: "http://localhost:8000/sandals.jpg" })
    );
  });

  it("returns fallback title for non-existent product", async () => {
    (productService.getPublicProductById as jest.Mock).mockResolvedValue({
      success: false,
    });

    const params = Promise.resolve({ id: "non-existent" });
    const metadata = await generateMetadata({ params });

    expect(metadata.title).toBe("Product Not Found | Arohoo");
  });
});
