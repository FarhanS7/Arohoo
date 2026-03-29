import AdminDashboardPage from '@/app/admin/page';
import ProductForm from '@/features/products/components/ProductForm';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// Mock next/dynamic
jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => {
    const MockComponent = ({ children }: any) => <div>{children}</div>;
    return MockComponent;
  },
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || "mocked image"} />;
  },
}));

// Mock ProtectedRoute
jest.mock("@/components/auth/protected-route", () => ({
  __esModule: true,
  default: ({ children }: any) => <>{children}</>,
}));

// Mock high-level hooks
jest.mock("@/features/admin/hooks/useAdmin", () => ({
  useAdmin: () => ({
    stats: { totalRevenue: 100, totalMerchants: 5, totalUsers: 50 },
    merchants: [],
    categories: [],
    loading: false,
    approveMerchant: jest.fn(),
    rejectMerchant: jest.fn(),
    handleCategory: { create: jest.fn(), update: jest.fn(), delete: jest.fn() },
  }),
}));

jest.mock("@/features/products/hooks/useCategories", () => ({
  useCategories: () => ({ categories: [] }),
}));

describe("Performance Optimization", () => {
  it("renders Admin Dashboard correctly", () => {
    render(<AdminDashboardPage />);
    expect(screen.getByText(/Platform Ops/i)).toBeInTheDocument();
  });

  it("renders Product Form correctly", () => {
    render(
      <ProductForm 
        onSubmit={jest.fn()} 
        onCancel={jest.fn()} 
        loading={false} 
      />
    );
    expect(screen.getByText(/Basic Information/i)).toBeInTheDocument();
  });
});
