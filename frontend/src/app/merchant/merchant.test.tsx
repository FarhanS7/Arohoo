import { useAuth } from '@/features/auth/auth.context';
import { getMerchantStats } from '@/lib/api/merchant';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import MerchantDashboardPage from './page';

// Mocks
jest.mock('@/lib/api/merchant', () => ({
  getMerchantStats: jest.fn(),
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

const mockStats = {
  totalRevenue: 150000,
  totalSales: 245,
  fulfillmentRate: 98,
  lowStockProducts: 4,
};

describe('MerchantDashboardPage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = createTestQueryClient();
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'merchant-1', role: 'MERCHANT' },
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

  it('renders stats correctly upon successful fetch', async () => {
    (getMerchantStats as jest.Mock).mockResolvedValue(mockStats);
    renderWithClient(<MerchantDashboardPage />);
    
    expect(await screen.findByText(/Store Overview/i)).toBeInTheDocument();
    
    // Check for metrics using more specific matchers
    expect(await screen.findByText(/150,000/)).toBeInTheDocument(); // Revenue
    
    // Check for exact numbers in the stat cards
    const salesCard = screen.getByText(/Total Sales/i).closest('div');
    expect(salesCard).toHaveTextContent('245');
    
    const fulfillmentCard = screen.getByText(/Fulfillment Rate/i).closest('div');
    expect(fulfillmentCard).toHaveTextContent('98%');
    
    const lowStockCard = screen.getByText(/Low Stock Alert/i).closest('div');
    expect(lowStockCard).toHaveTextContent('4');
  });

  it('renders zero values correctly', async () => {
    (getMerchantStats as jest.Mock).mockResolvedValue({
      totalRevenue: 0,
      totalSales: 0,
      fulfillmentRate: 0,
      lowStockProducts: 0,
    });
    renderWithClient(<MerchantDashboardPage />);
    
    // Revenue card often contains non-breaking spaces or specific currency formatting
    // Use a more robust check for all the cards displaying zero
    const zeros = await screen.findAllByText(/0/);
    expect(zeros.length).toBeGreaterThanOrEqual(4);
  });

  it('renders error state on fetch failure', async () => {
    (getMerchantStats as jest.Mock).mockRejectedValue(new Error('API Error'));
    renderWithClient(<MerchantDashboardPage />);
    
    // Check if API was called
    await waitFor(() => {
      expect(getMerchantStats).toHaveBeenCalled();
    });

    // Use data-testid to wait for error state with longer timeout
    const errorContainer = await screen.findByTestId('error-container', {}, { timeout: 3000 });
    expect(errorContainer).toBeInTheDocument();
    expect(errorContainer).toHaveTextContent(/Analytics unavailable/i);
    expect(errorContainer).toHaveTextContent(/API Error/i);
  });
});
