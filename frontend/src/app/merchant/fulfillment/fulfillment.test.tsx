import { getMerchantOrders, updateOrderStatus } from '@/lib/api/merchant';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import MerchantFulfillmentPage from './page';

// Mock the API
jest.mock('@/lib/api/merchant');
jest.mock('@/components/auth/protected-route', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

const mockOrders = [
  {
    id: 'order-1',
    shippingName: 'John Doe',
    totalAmount: 5000,
    status: 'PROCESSING',
    createdAt: new Date().toISOString(),
    orderItems: [
      { product: { name: 'Gems Shirt' }, quantity: 2 },
    ],
  },
];

describe('MerchantFulfillmentPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getMerchantOrders as jest.Mock).mockResolvedValue(mockOrders);
  });

  it('renders fulfillment center title and quick stats', async () => {
    renderWithClient(<MerchantFulfillmentPage />);
    
    expect(await screen.findByText(/Fulfillment Center/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Requests/i)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // 1 total request
    expect(screen.getByText(/Processing Now/i)).toBeInTheDocument();
  });

  it('renders order details in the table', async () => {
    renderWithClient(<MerchantFulfillmentPage />);
    
    expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Gems Shirt/i)).toBeInTheDocument();
    expect(screen.getByText('৳5,000')).toBeInTheDocument();
  });

  it('triggers status update on select change', async () => {
    (updateOrderStatus as jest.Mock).mockResolvedValue({
      ...mockOrders[0],
      status: 'SHIPPED',
    });

    renderWithClient(<MerchantFulfillmentPage />);
    
    const select = await screen.findByRole('combobox') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'SHIPPED' } });

    await waitFor(() => {
      expect(updateOrderStatus).toHaveBeenCalledWith('order-1', 'SHIPPED');
    }, { timeout: 3000 });

    // Wait for the select to be re-enabled (meaning the update finished)
    await waitFor(() => {
      expect(select).not.toBeDisabled();
    }, { timeout: 3000 });

    // Wait for the select to reflect the new state (from the hook's state update)
    await waitFor(() => {
      expect(select.value).toBe('SHIPPED');
    }, { timeout: 3000 });

    // Success message should also appear eventually
    expect(await screen.findByText(/updated to SHIPPED/i)).toBeInTheDocument();
  });
});
