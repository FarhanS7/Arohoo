import { cartApi } from "./cart";
import { api } from "./client";

// Mock the axios instance
jest.mock("./client", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("cartApi", () => {
  const mockCart = {
    id: "cart-1",
    userId: "user-1",
    items: [
      {
        id: "item-1",
        quantity: 2,
        productVariant: {
          id: "v-1",
          sku: "SKU-1",
          price: 100,
          product: { name: "Product 1" },
        },
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getCart should return cart data", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: { success: true, data: mockCart } });

    const result = await cartApi.getCart();

    expect(api.get).toHaveBeenCalledWith("/cart");
    expect(result).toEqual({ success: true, data: mockCart });
  });

  test("addItem should call post with correct data", async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { success: true, data: mockCart } });

    const result = await cartApi.addItem("v-1", 2);

    expect(api.post).toHaveBeenCalledWith("/cart/items", {
      productVariantId: "v-1",
      quantity: 2,
    });
    expect(result.data).toEqual(mockCart);
  });

  test("updateQuantity should call patch with correct data", async () => {
    (api.patch as jest.Mock).mockResolvedValueOnce({ data: { success: true, data: mockCart } });

    const result = await cartApi.updateQuantity("item-1", 5);

    expect(api.patch).toHaveBeenCalledWith("/cart/items/item-1", {
      quantity: 5,
    });
    expect(result.data).toEqual(mockCart);
  });

  test("removeItem should call delete with correct id", async () => {
    (api.delete as jest.Mock).mockResolvedValueOnce({ data: { success: true, data: mockCart } });

    const result = await cartApi.removeItem("item-1");

    expect(api.delete).toHaveBeenCalledWith("/cart/items/item-1");
    expect(result.data).toEqual(mockCart);
  });

  test("clearCart should call delete on /cart", async () => {
    (api.delete as jest.Mock).mockResolvedValueOnce({ data: { success: true, data: {} } });

    await cartApi.clearCart();

    expect(api.delete).toHaveBeenCalledWith("/cart");
  });
});
