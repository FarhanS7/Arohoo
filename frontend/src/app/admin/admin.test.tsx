import { adminService } from '@/lib/api/admin';
import { categoryService } from '@/lib/api/categories';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import AdminDashboardPage from './page';

// Mock everything
jest.mock('@/lib/api/admin');
jest.mock('@/lib/api/categories');
jest.mock('@/components/auth/protected-route', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

const mockStats = {
  totalRevenue: 1000000,
  totalMerchants: 50,
  totalUsers: 5000,
  pendingApprovals: 5,
};

const mockMerchants = [
  { id: 'm1', businessName: 'Aria Jewelers', ownerName: 'Aria', email: 'aria@example.com', status: 'PENDING', createdAt: new Date().toISOString() }
];

const mockCategories = [
  { id: 'c1', name: 'Necklaces', slug: 'necklaces' }
];

describe('AdminDashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (adminService.getPlatformStats as jest.Mock).mockResolvedValue({ success: true, data: mockStats });
    (adminService.getPendingMerchants as jest.Mock).mockResolvedValue({ success: true, data: mockMerchants });
    (categoryService.getPublicCategories as jest.Mock).mockResolvedValue({ success: true, data: mockCategories });
  });

  it('renders platform stats correctly', async () => {
    renderWithClient(<AdminDashboardPage />);
    
    expect(await screen.findByText(/Platform Ops/i)).toBeDefined();
    
    // Check stats
    const revenue = await screen.findByText(/৳1,000,000/);
    expect(revenue).toBeDefined();
    expect(screen.getByText('50')).toBeDefined();
  });

  it('switches tabs and renders content', async () => {
    renderWithClient(<AdminDashboardPage />);
    
    // Default tab (Approvals)
    expect(await screen.findByText(/Aria Jewelers/i)).toBeDefined();
    
    // Switch to Categories
    const catTab = await screen.findByRole('button', { name: /Category Manager/i });
    fireEvent.click(catTab);
    
    // Wait for the Category Manager content to appear
    await waitFor(async () => {
      expect(await screen.findByText(/Necklaces/i)).toBeDefined();
    }, { timeout: 5000 });
    
    // Merchant should be gone from view
    await waitFor(() => {
      expect(screen.queryByText(/Aria Jewelers/i)).toBeNull();
    });
  });

  it('triggers merchant approval', async () => {
    (adminService.approveMerchant as jest.Mock).mockResolvedValue({ success: true });
    
    renderWithClient(<AdminDashboardPage />);
    
    const approveBtn = await screen.findByRole('button', { name: /Approve/i });
    fireEvent.click(approveBtn);
    
    await waitFor(() => {
      expect(adminService.approveMerchant).toHaveBeenCalledWith('m1');
    });
    
    // The merchant should be removed from the list after approval
    await waitFor(() => {
      expect(screen.queryByText(/Aria Jewelers/i)).toBeNull();
    });
  });
});
