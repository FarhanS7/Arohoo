import { describe, expect, jest, test } from '@jest/globals';

// 1. Mock express.Router
const mockRouter = {
  get: jest.fn().mockReturnThis(),
  post: jest.fn().mockReturnThis(),
  patch: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  use: jest.fn().mockReturnThis(),
  route: jest.fn().mockReturnThis(),
};

jest.unstable_mockModule('express', () => ({
  default: {
    Router: () => mockRouter,
  },
}));

// 2. Mock Controller and Middleware
jest.unstable_mockModule('./cart.controller.js', () => ({
  addItem: jest.fn(),
  clearCart: jest.fn(),
  getCart: jest.fn(),
  removeItem: jest.fn(),
  updateQuantity: jest.fn(),
}));

jest.unstable_mockModule('../../common/middleware/auth.middleware.js', () => ({
  protect: jest.fn(),
}));

// 3. Import router after mocks
await import('./cart.routes.js');

describe('Cart Routes', () => {
  test('should use auth middleware (protect) for all routes', async () => {
    const { protect } = await import('../../common/middleware/auth.middleware.js');
    expect(mockRouter.use).toHaveBeenCalledWith(protect);
  });

  test('should define / route with GET and DELETE', async () => {
    expect(mockRouter.route).toHaveBeenCalledWith('/');
    expect(mockRouter.get).toHaveBeenCalled();
    expect(mockRouter.delete).toHaveBeenCalled();
  });

  test('should define /items route with POST', async () => {
    expect(mockRouter.route).toHaveBeenCalledWith('/items');
    expect(mockRouter.post).toHaveBeenCalled();
  });

  test('should define /items/:id route with PATCH and DELETE', async () => {
    expect(mockRouter.route).toHaveBeenCalledWith('/items/:id');
    expect(mockRouter.patch).toHaveBeenCalled();
    expect(mockRouter.delete).toHaveBeenCalled();
  });
});
