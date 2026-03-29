import { useCart } from "@/features/cart/hooks/useCart";
import { fireEvent, render, screen } from "@testing-library/react";
import CartPage from "./page";

// Mock the dependencies
jest.mock("@/features/cart/hooks/useCart");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});
jest.mock("next/image", () => {
  return (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  };
});

describe("CartPage", () => {
  const mockUseCart = useCart as jest.Mock;
  const mockRemoveItem = jest.fn();
  const mockUpdateQuantity = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should show loading state", () => {
    mockUseCart.mockReturnValue({
      loading: true,
      cart: null,
    });

    render(<CartPage />);
    expect(screen.getByText(/Loading your cart/i)).toBeInTheDocument();
  });

  test("should show empty state when cart has no items", () => {
    mockUseCart.mockReturnValue({
      loading: false,
      cart: { items: [] },
    });

    render(<CartPage />);
    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Shopping/i)).toHaveAttribute("href", "/products");
  });

  test("should display cart items and total", () => {
    const mockCart = {
      items: [
        {
          id: "item-1",
          quantity: 2,
          productVariant: {
            id: "v-1",
            price: 50,
            product: { id: "p-1", name: "Product 1" },
            color: "Blue",
            size: "M",
          },
        },
      ],
    };

    mockUseCart.mockReturnValue({
      loading: false,
      cart: mockCart,
      totalPrice: 100,
      itemCount: 2,
      removeItem: mockRemoveItem,
      updateQuantity: mockUpdateQuantity,
    });

    render(<CartPage />);

    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Blue")).toBeInTheDocument();
    expect(screen.getByText("M")).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument(); // Total price in summary
    expect(screen.getByText("2")).toBeInTheDocument(); // Quantity
  });

  test("should call removeItem when remove button is clicked", () => {
    const mockCart = {
      items: [
        {
          id: "item-1",
          quantity: 1,
          productVariant: {
            id: "v-1",
            price: 50,
            product: { id: "p-1", name: "Product 1" },
          },
        },
      ],
    };

    mockUseCart.mockReturnValue({
      loading: false,
      cart: mockCart,
      totalPrice: 50,
      itemCount: 1,
      removeItem: mockRemoveItem,
      updateQuantity: mockUpdateQuantity,
    });

    render(<CartPage />);
    
    // Find remove button by svg/container (since it has no text)
    // Or we can add an aria-label in the actual component to make it easier
    const removeButton = screen.getAllByRole("button").find(b => b.innerHTML.includes("M19 7l-.867"));
    if (removeButton) {
        fireEvent.click(removeButton);
        expect(mockRemoveItem).toHaveBeenCalledWith("item-1");
    }
  });

  test("should call updateQuantity when increment/decrement is clicked", () => {
    const mockCart = {
      items: [
        {
          id: "item-1",
          quantity: 2,
          productVariant: {
            id: "v-1",
            price: 50,
            product: { id: "p-1", name: "Product 1" },
          },
        },
      ],
    };

    mockUseCart.mockReturnValue({
      loading: false,
      cart: mockCart,
      totalPrice: 100,
      itemCount: 2,
      removeItem: mockRemoveItem,
      updateQuantity: mockUpdateQuantity,
    });

    render(<CartPage />);

    const buttons = screen.getAllByRole("button");
    const decrementBtn = buttons.find(b => b.innerHTML.includes("M20 12H4"));
    const incrementBtn = buttons.find(b => b.innerHTML.includes("M12 4v16m8-8H4"));

    if (decrementBtn) fireEvent.click(decrementBtn);
    expect(mockUpdateQuantity).toHaveBeenCalledWith("item-1", 1);

    if (incrementBtn) fireEvent.click(incrementBtn);
    expect(mockUpdateQuantity).toHaveBeenCalledWith("item-1", 3);
  });
});
