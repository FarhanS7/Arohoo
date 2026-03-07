import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// 1. Define mocks for the service
const mockCartService = {
  getCart: jest.fn(),
  addItem: jest.fn(),
  updateQuantity: jest.fn(),
  removeItem: jest.fn(),
  clearCart: jest.fn(),
};

// 2. Mock modules BEFORE importing controller
jest.unstable_mockModule('./cart.service.js', () => ({
  cartService: mockCartService,
}));

// 3. Dynamic import of controller
const cartController = await import('./cart.controller.js');

describe('CartController', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      user: { id: 'user-uuid-123' },
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  describe('getCart', () => {
    test('should return 200 and the cart', async () => {
      const mockCart = { id: 'cart-123', items: [] };
      mockCartService.getCart.mockResolvedValue(mockCart);

      await cartController.getCart(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCart,
        error: null
      });
    });
  });

  describe('addItem', () => {
    test('should return 201 and the added item', async () => {
      req.body = { productVariantId: 'v-123', quantity: 2 };
      const mockItem = { id: 'item-1', quantity: 2 };
      mockCartService.addItem.mockResolvedValue(mockItem);

      await cartController.addItem(req, res, next);

      expect(mockCartService.addItem).toHaveBeenCalledWith({
        userId: 'user-uuid-123',
        productVariantId: 'v-123',
        quantity: 2
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockItem,
        error: null
      });
    });

    test('should use default quantity 1 if not provided', async () => {
      req.body = { productVariantId: 'v-123' };
      await cartController.addItem(req, res, next);
      expect(mockCartService.addItem).toHaveBeenCalledWith(expect.objectContaining({ quantity: 1 }));
    });
  });

  describe('updateQuantity', () => {
    test('should return 200 and updated item', async () => {
      req.params.id = 'item-1';
      req.body = { quantity: 5 };
      const mockItem = { id: 'item-1', quantity: 5 };
      mockCartService.updateQuantity.mockResolvedValue(mockItem);

      await cartController.updateQuantity(req, res, next);

      expect(mockCartService.updateQuantity).toHaveBeenCalledWith({
        userId: 'user-uuid-123',
        cartItemId: 'item-1',
        quantity: 5
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('removeItem', () => {
    test('should return 200 after successful removal', async () => {
      req.params.id = 'item-1';
      await cartController.removeItem(req, res, next);

      expect(mockCartService.removeItem).toHaveBeenCalledWith({
        userId: 'user-uuid-123',
        cartItemId: 'item-1'
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('clearCart', () => {
    test('should return 200 after clearing cart', async () => {
      await cartController.clearCart(req, res, next);

      expect(mockCartService.clearCart).toHaveBeenCalledWith('user-uuid-123');
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
