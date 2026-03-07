import { describe, expect, jest, test } from '@jest/globals';

// 1. Mock express.Router
const mockRouter = {
  get: jest.fn().mockReturnThis(),
  patch: jest.fn().mockReturnThis(),
  use: jest.fn().mockReturnThis(),
};

jest.unstable_mockModule('express', () => ({
  default: {
    Router: () => mockRouter,
  },
}));

// 2. Mock Controller and Middleware
jest.unstable_mockModule('./order.controller.js', () => ({
  getMyOrders: jest.fn(),
  getOrder: jest.fn(),
  updateStatus: jest.fn(),
}));

jest.unstable_mockModule('../../common/middleware/auth.middleware.js', () => ({
  protect: jest.fn(),
}));

// 3. Import router after mocks
await import('./order.routes.js');

describe('Order Routes Registration', () => {
  test('should apply auth protection for all routes', async () => {
    const { protect } = await import('../../common/middleware/auth.middleware.js');
    expect(mockRouter.use).toHaveBeenCalledWith(protect);
  });

  test('should register GET /me for personal orders', async () => {
    const { getMyOrders } = await import('./order.controller.js');
    expect(mockRouter.get).toHaveBeenCalledWith('/me', getMyOrders);
  });

  test('should register GET /:id for order details', async () => {
    const { getOrder } = await import('./order.controller.js');
    expect(mockRouter.get).toHaveBeenCalledWith('/:id', getOrder);
  });
});
