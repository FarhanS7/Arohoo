import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// 1. Define common mocks
const mockPrisma = {
  cart: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  cartItem: {
    findUnique: jest.fn(),
    upsert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  productVariant: {
    findUnique: jest.fn(),
  },
};

// 2. Mock modules BEFORE importing service
jest.unstable_mockModule('../../infrastructure/database/prisma.js', () => ({
  __esModule: true,
  default: mockPrisma,
}));

// 3. Dynamic import of service
const { cartService } = await import('./cart.service.js');

describe('CartService', () => {
  const userId = 'user-uuid-123';
  const cartId = 'cart-uuid-456';
  const productVariantId = 'variant-uuid-789';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrCreateCart', () => {
    test('should return existing cart if it exists', async () => {
      const mockCart = { id: cartId, userId, items: [] };
      mockPrisma.cart.findUnique.mockResolvedValue(mockCart);

      const result = await cartService.getOrCreateCart(userId);

      expect(mockPrisma.cart.findUnique).toHaveBeenCalledWith(expect.objectContaining({
        where: { userId }
      }));
      expect(result).toEqual(mockCart);
      expect(mockPrisma.cart.create).not.toHaveBeenCalled();
    });

    test('should create a new cart if one does not exist', async () => {
      const mockCart = { id: cartId, userId, items: [] };
      mockPrisma.cart.findUnique.mockResolvedValue(null);
      mockPrisma.cart.create.mockResolvedValue(mockCart);

      const result = await cartService.getOrCreateCart(userId);

      expect(mockPrisma.cart.create).toHaveBeenCalledWith(expect.objectContaining({
        data: { userId }
      }));
      expect(result).toEqual(mockCart);
    });
  });

  describe('addItem', () => {
    test('should add a new item and validate stock', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({ id: cartId });
      mockPrisma.productVariant.findUnique.mockResolvedValue({ id: productVariantId, stock: 10 });
      mockPrisma.cartItem.findUnique.mockResolvedValue(null);
      mockPrisma.cartItem.upsert.mockResolvedValue({ id: 'item-1', quantity: 2 });

      const result = await cartService.addItem({ userId, productVariantId, quantity: 2 });

      expect(mockPrisma.cartItem.upsert).toHaveBeenCalledWith(expect.objectContaining({
        create: expect.objectContaining({ quantity: 2 })
      }));
      expect(result.quantity).toBe(2);
    });

    test('should increment quantity if variant already in cart', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({ id: cartId });
      mockPrisma.productVariant.findUnique.mockResolvedValue({ id: productVariantId, stock: 10 });
      mockPrisma.cartItem.findUnique.mockResolvedValue({ id: 'item-1', quantity: 3 });
      mockPrisma.cartItem.upsert.mockResolvedValue({ id: 'item-1', quantity: 5 });

      await cartService.addItem({ userId, productVariantId, quantity: 2 });

      expect(mockPrisma.cartItem.upsert).toHaveBeenCalledWith(expect.objectContaining({
        update: { quantity: 5 }
      }));
    });

    test('should throw error if quantity exceeds stock', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({ id: cartId });
      mockPrisma.productVariant.findUnique.mockResolvedValue({ id: productVariantId, stock: 5 });
      mockPrisma.cartItem.findUnique.mockResolvedValue({ id: 'item-1', quantity: 4 });

      await expect(cartService.addItem({ userId, productVariantId, quantity: 2 }))
        .rejects.toThrow('Cannot add more. Stock limit: 5');
    });

    test('should throw error if variant is out of stock', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({ id: cartId });
      mockPrisma.productVariant.findUnique.mockResolvedValue({ id: productVariantId, stock: 0 });

      await expect(cartService.addItem({ userId, productVariantId, quantity: 1 }))
        .rejects.toThrow('Variant is out of stock');
    });
  });

  describe('updateQuantity', () => {
    test('should update quantity correctly', async () => {
      mockPrisma.cartItem.findUnique.mockResolvedValue({
        id: 'item-1',
        cart: { userId },
        productVariant: { stock: 10 }
      });

      await cartService.updateQuantity({ userId, cartItemId: 'item-1', quantity: 7 });

      expect(mockPrisma.cartItem.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 'item-1' },
        data: { quantity: 7 }
      }));
    });

    test('should remove item if quantity is set to 0', async () => {
      mockPrisma.cartItem.findUnique.mockResolvedValue({
        id: 'item-1',
        cart: { userId }
      });

      await cartService.updateQuantity({ userId, cartItemId: 'item-1', quantity: 0 });

      expect(mockPrisma.cartItem.delete).toHaveBeenCalledWith({
        where: { id: 'item-1' }
      });
    });

    test('should throw error if update exceeds stock', async () => {
      mockPrisma.cartItem.findUnique.mockResolvedValue({
        id: 'item-1',
        cart: { userId },
        productVariant: { stock: 5 }
      });

      await expect(cartService.updateQuantity({ userId, cartItemId: 'item-1', quantity: 10 }))
        .rejects.toThrow('Stock limit reached: 5');
    });
  });

  describe('removeItem', () => {
    test('should successfully remove an item', async () => {
      mockPrisma.cartItem.findUnique.mockResolvedValue({
        id: 'item-1',
        cart: { userId }
      });

      const result = await cartService.removeItem({ userId, cartItemId: 'item-1' });

      expect(mockPrisma.cartItem.delete).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    test('should throw error if item does not belong to user', async () => {
      mockPrisma.cartItem.findUnique.mockResolvedValue({
        id: 'item-1',
        cart: { userId: 'other-user' }
      });

      await expect(cartService.removeItem({ userId, cartItemId: 'item-1' }))
        .rejects.toThrow('Cart item not found or unauthorized');
    });
  });

  describe('clearCart', () => {
    test('should clear all items from the cart', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({ id: cartId });

      await cartService.clearCart(userId);

      expect(mockPrisma.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { cartId }
      });
    });
  });
});
