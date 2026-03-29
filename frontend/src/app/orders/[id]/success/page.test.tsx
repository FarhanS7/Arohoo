import { getOrderById } from '@/lib/api/orders';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { useParams } from 'next/navigation';
import React from 'react';
import OrderSuccessPage from './page';

// Mocks
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

jest.mock('@/lib/api/orders', () => ({
  getOrderById: jest.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const mockOrder = {
  id: 'order-123',
  shippingName: 'John Doe',
  shippingPhone: '01712345678',
  shippingAddress: 'Dhaka, Bangladesh',
  totalAmount: 5000,
  status: 'PENDING',
  createdAt: new Date().toISOString(),
  orderItems: [
    {
      id: 'item-1',
      productId: 'prod-1',
      productVariantId: 'var-1',
      quantity: 1,
      price: 5000,
      subtotal: 5000,
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
  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ id: 'order-123' });
  });

  it('renders loading state initially', () => {
    (getOrderById as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<OrderSuccessPage />, { wrapper });
    expect(screen.getByText(/Syncing your order details/i)).toBeInTheDocument();
  });

  it('renders order details upon successful fetch', async () => {
    (getOrderById as jest.Mock).mockResolvedValue(mockOrder);
    render(<OrderSuccessPage />, { wrapper });
    
    expect(await screen.findByText(/Order Confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/#order-123/i)).toBeInTheDocument();
    expect(screen.getByText(/Premium Leather Shoes/i)).toBeInTheDocument();
    expect(screen.getByText(/৳5,000/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });

  it('renders error state on fetch failure', async () => {
    (getOrderById as jest.Mock).mockRejectedValue(new Error('Order not found'));
    render(<OrderSuccessPage />, { wrapper });
    
    expect(await screen.findByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/Order not found/i)).toBeInTheDocument();
  });
});
