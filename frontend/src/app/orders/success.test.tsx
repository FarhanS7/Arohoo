import { getOrderById } from '@/lib/api/orders';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { useParams } from 'next/navigation';
import React from 'react';
import OrderSuccessPage from './[id]/success/page';

// Mocks
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

jest.mock('@/lib/api/orders', () => ({
  getOrderById: jest.fn(),
}));

// Utility to create a new QueryClient for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const mockOrder = {
  id: 'order-123',
  shippingName: 'John Doe',
  shippingPhone: '01712345678',
  shippingAddress: 'Dhaka, Bangladesh',
  totalAmount: 5200, // Distinct from item price
  status: 'PENDING',
  createdAt: new Date().toISOString(),
  orderItems: [
    {
      id: 'item-1',
      productId: 'prod-1',
      productVariantId: 'var-1',
      quantity: 1,
      price: 5200,
      subtotal: 5200,
      product: {
        name: 'Premium Leather Shoes',
        images: [{ url: 'http://example.com/image.jpg' }],
      },
      productVariant: {
        size: '42',
        color: 'Black',
      },
    },
  ],
};

describe('OrderSuccessPage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = createTestQueryClient();
    (useParams as jest.Mock).mockReturnValue({ id: 'order-123' });
  });

  const renderWithClient = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    );
  };

  it('renders loading state initially', () => {
    (getOrderById as jest.Mock).mockReturnValue(new Promise(() => {}));
    renderWithClient(<OrderSuccessPage />);
    expect(screen.getByText(/Syncing your order details/i)).toBeInTheDocument();
  });

  it('renders order details upon successful fetch', async () => {
    (getOrderById as jest.Mock).mockResolvedValue(mockOrder);
    renderWithClient(<OrderSuccessPage />);
    
    // Check if API was called
    await waitFor(() => {
      expect(getOrderById).toHaveBeenCalledWith('order-123');
    });

    // Check for success elements
    expect(await screen.findByText(/Order Confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/#order-123/i)).toBeInTheDocument();
    expect(screen.getByText(/Premium Leather Shoes/i)).toBeInTheDocument();
    // Total amount and item price both contain 5,200
    const priceElements = screen.getAllByText(/5,200/);
    expect(priceElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });

  it('renders error state on fetch failure', async () => {
    (getOrderById as jest.Mock).mockRejectedValue(new Error('Order not found'));
    renderWithClient(<OrderSuccessPage />);
    
    // Check if API was called
    await waitFor(() => {
      expect(getOrderById).toHaveBeenCalledWith('order-123');
    });

    // Wait for error state to render
    expect(await screen.findByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/Order not found/i)).toBeInTheDocument();
  });
});
