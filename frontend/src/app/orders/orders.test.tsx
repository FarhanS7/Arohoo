import { useAuth } from '@/features/auth/auth.context';
import { getMyOrders } from '@/lib/api/orders';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import OrderHistoryPage from './page';

// Mocks
jest.mock('@/lib/api/orders', () => ({
  getMyOrders: jest.fn(),
}));

jest.mock('@/features/auth/auth.context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const mockOrders = [
  {
    id: 'order-1',
    totalAmount: 5000,
    status: 'DELIVERED',
    createdAt: '2026-03-01T10:00:00Z',
    orderItems: [],
  },
  {
    id: 'order-2',
    totalAmount: 1200,
    status: 'PENDING',
    createdAt: '2026-03-05T12:00:00Z',
    orderItems: [],
  },
];

describe('OrderHistoryPage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = createTestQueryClient();
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'user-1', role: 'CUSTOMER' },
      loading: false,
    });
  });

  const renderWithClient = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    );
  };

  it('renders order list upon successful fetch', async () => {
    (getMyOrders as jest.Mock).mockResolvedValue(mockOrders);
    renderWithClient(<OrderHistoryPage />);
    
    // Check if API was called
    await waitFor(() => {
      expect(getMyOrders).toHaveBeenCalled();
    });

    expect(await screen.findByText(/Order History/i)).toBeInTheDocument();
    
    // Check for order IDs (truncated) using findByText
    expect(await screen.findByText(/#order-1/i)).toBeInTheDocument();
    expect(await screen.findByText(/#order-2/i)).toBeInTheDocument();
    
    // Check for statuses
    expect(screen.getByText(/DELIVERED/i)).toBeInTheDocument();
    expect(screen.getByText(/PENDING/i)).toBeInTheDocument();
  });

  it('renders empty state when no orders exist', async () => {
    (getMyOrders as jest.Mock).mockResolvedValue([]);
    renderWithClient(<OrderHistoryPage />);
    
    await waitFor(() => {
      expect(getMyOrders).toHaveBeenCalled();
    });

    expect(await screen.findByText(/No orders yet/i)).toBeInTheDocument();
  });

  it('renders error state on fetch failure', async () => {
    (getMyOrders as jest.Mock).mockRejectedValue(new Error('Failed to fetch orders'));
    renderWithClient(<OrderHistoryPage />);
    
    await waitFor(() => {
      expect(getMyOrders).toHaveBeenCalled();
    });

    expect(await screen.findByText(/Unable to load orders/i)).toBeInTheDocument();
    expect(screen.getByText(/Failed to fetch orders/i)).toBeInTheDocument();
  });
});
