import { useCategories } from '@/features/products/hooks/useCategories';
import { productService } from '@/lib/api/products';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import MerchantProductsPage from './page';

// Mock the API and hooks
jest.mock('@/lib/api/products');
jest.mock('@/features/products/hooks/useCategories');
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

const mockProducts = [
  {
    id: '1',
    name: 'Gems T-Shirt',
    description: 'Premium gems shirt',
    basePrice: 1200,
    categoryId: 'cat1',
    variants: [
      { sku: 'GEMS-M', price: 1200, stock: 15, attributes: { size: 'M', color: 'Black' } },
      { sku: 'GEMS-L', price: 1200, stock: 5, attributes: { size: 'L', color: 'Black' } },
    ],
    images: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

describe('MerchantProductsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (productService.getMerchantProducts as jest.Mock).mockResolvedValue({
      success: true,
      data: mockProducts,
      meta: { page: 1, limit: 10, total: 1 },
    });
    (useCategories as jest.Mock).mockReturnValue({
      categories: [{ id: 'cat1', name: 'Apparel' }],
      loading: false,
    });
  });

  it('renders progress and global inventory summary', async () => {
    renderWithClient(<MerchantProductsPage />);
    
    expect(await screen.findByText(/Inventory Manager/i)).toBeInTheDocument();
    
    // Check global metrics
    expect(await screen.findByText(/Total Products/i)).toBeInTheDocument();
    expect(await screen.findByText(/Global Units/i)).toBeInTheDocument();
    
    // Total stock: 15 + 5 = 20
    const globalStock = await screen.findByText('20');
    expect(globalStock).toBeInTheDocument();
  });

  it('opens create modal when clicking "Add New Product"', async () => {
    renderWithClient(<MerchantProductsPage />);
    
    const addButton = await screen.findByText(/\+ Add New Product/i);
    fireEvent.click(addButton);
    
    expect(screen.getByText(/Create New Product/i)).toBeInTheDocument();
  });

  it('opens edit modal with initial data', async () => {
    renderWithClient(<MerchantProductsPage />);
    
    const editButton = await screen.findByText(/Edit/i);
    fireEvent.click(editButton);
    
    expect(await screen.findByText(/Refining: Gems T-Shirt/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Gems T-Shirt')).toBeInTheDocument();
  });

  it('triggers delete confirmation modal', async () => {
    renderWithClient(<MerchantProductsPage />);
    
    const deleteButton = await screen.findByText(/Delete/i);
    fireEvent.click(deleteButton);
    
    expect(await screen.findByText(/Confirm Deletion/i)).toBeInTheDocument();
    expect(screen.getByText(/This action will permanently remove "Gems T-Shirt"/i)).toBeInTheDocument();
  });
});
