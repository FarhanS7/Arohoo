import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// 1. Mock Prisma
const mockPrisma = {
  $transaction: jest.fn((cb) => cb(mockPrisma)),
  order: {
    create: jest.fn(),
  },
  orderItem: {
    create: jest.fn(),
    deleteMany: jest.fn(),
  },
  cart: {
    findUnique: jest.fn(),
  },
  cartItem: {
    deleteMany: jest.fn(),
  },
  productVariant: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
};

// 2. Mock Modules
jest.unstable_mockModule('../../infrastructure/database/prisma.js', () => ({
  default: mockPrisma,
}));

// 3. Dynamic Import
const { OrderService } = await import('./order.service.js');

describe('OrderService Checkout', () => {
  let orderService;

  beforeEach(() => {
    jest.clearAllMocks();
    orderService = new OrderService(mockPrisma);
  });

  describe('createOrder', () => {
    test('should create order and update stock successfully', async () => {
      const orderData = {
        userId: 'user-1',
        shippingName: 'John Doe',
        shippingPhone: '123456789',
        shippingAddress: { city: 'Dhaka' },
        items: [{ productVariantId: 'v-1', quantity: 2 }]
      };

      const mockVariant = {
        id: 'v-1',
        sku: 'SKU-001',
        price: 100,
        stock: 10,
        productId: 'p-1',
        product: { merchantId: 'm-1' }
      };

      mockPrisma.productVariant.findMany.mockResolvedValue([mockVariant]);
      mockPrisma.order.create.mockResolvedValue({ id: 'order-1', totalAmount: 200 });

      const result = await orderService.createOrder(orderData);

      expect(result.id).toBe('order-1');
      expect(mockPrisma.productVariant.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 'v-1' },
        data: { stock: { decrement: 2 } }
      }));
      expect(mockPrisma.order.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          totalAmount: 200,
          userId: 'user-1'
        })
      }));
    });

    test('should throw error if variant not found', async () => {
      mockPrisma.productVariant.findMany.mockResolvedValue([]);
      
      await expect(orderService.createOrder({ items: [{ productVariantId: 'v-none', quantity: 1 }] }))
        .rejects.toThrow('Product variant not found');
    });

    test('should throw error if stock is insufficient', async () => {
      mockPrisma.productVariant.findMany.mockResolvedValue([{ id: 'v-1', sku: 'SKU-1', stock: 5 }]);
      
      await expect(orderService.createOrder({ items: [{ productVariantId: 'v-1', quantity: 10 }] }))
        .rejects.toThrow('Not enough stock');
    });
  });

  describe('createOrderFromCart', () => {
    test('should create order from cart and clear cart items', async () => {
      const userId = 'user-1';
      const mockCart = {
        id: 'cart-1',
        items: [
          {
            productVariantId: 'v-1',
            quantity: 2,
            productVariant: { id: 'v-1', price: 100, stock: 10, product: { merchantId: 'm-1' } }
          }
        ]
      };

      mockPrisma.cart.findUnique.mockResolvedValue(mockCart);
      mockPrisma.productVariant.findMany.mockResolvedValue(mockCart.items.map(i => i.productVariant));
      mockPrisma.order.create.mockResolvedValue({ id: 'order-1' });

      const result = await orderService.createOrderFromCart({
        userId,
        shippingName: 'John',
        shippingPhone: '123',
        shippingAddress: {}
      });

      expect(result.id).toBe('order-1');
      expect(mockPrisma.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { cartId: 'cart-1' }
      });
    });

    test('should throw error if cart is empty', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({ items: [] });
      
      await expect(orderService.createOrderFromCart({ userId: 'u1' }))
        .rejects.toThrow('Your cart is empty');
    });
  });
});
