import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// 1. Mock Prisma
const mockPrisma = {
  $transaction: jest.fn((cb) => cb(mockPrisma)),
  order: {
    findMany: jest.fn(),
    count: jest.fn(),
  },
};

// 2. Mock Modules
jest.unstable_mockModule('../../infrastructure/database/prisma.js', () => ({
  default: mockPrisma,
}));

// 3. Dynamic Import
const { OrderService } = await import('./order.service.js');

describe('OrderService.getOrdersByUser', () => {
  let orderService;

  beforeEach(() => {
    jest.clearAllMocks();
    orderService = new OrderService(mockPrisma);
  });

  test('should return formatted orders and meta', async () => {
    const userId = 'user-1';
    const mockOrders = [
      {
        id: 'order-1',
        status: 'PENDING',
        totalAmount: 100.50,
        createdAt: new Date(),
        orderItems: [
          {
            quantity: 2,
            product: { id: 'p-1', name: 'Product A' },
            productVariant: { id: 'v-1', price: 50.25 },
            merchant: { id: 'm-1', storeName: 'Store A' }
          }
        ]
      }
    ];

    mockPrisma.order.findMany.mockResolvedValue(mockOrders);
    mockPrisma.order.count.mockResolvedValue(1);

    const result = await orderService.getOrdersByUser(userId, 1, 10);

    expect(result.orders).toHaveLength(1);
    const order = result.orders[0];
    expect(order.id).toBe('order-1');
    expect(order.totalAmount).toBe(100.50);
    expect(order.orderItems[0].productVariant.product.name).toBe('Product A');
    expect(order.orderItems[0].productVariant.merchant.storeName).toBe('Store A');
    expect(result.meta).toEqual({ page: 1, limit: 10, total: 1 });
  });

  test('should handle pagination correctly', async () => {
    mockPrisma.order.findMany.mockResolvedValue([]);
    mockPrisma.order.count.mockResolvedValue(25);

    const result = await orderService.getOrdersByUser('user-1', 3, 10);

    expect(mockPrisma.order.findMany).toHaveBeenCalledWith(expect.objectContaining({
      skip: 20,
      take: 10
    }));
    expect(result.meta.page).toBe(3);
  });

  test('should return empty orders when user has none', async () => {
    mockPrisma.order.findMany.mockResolvedValue([]);
    mockPrisma.order.count.mockResolvedValue(0);

    const result = await orderService.getOrdersByUser('user-none', 1, 10);

    expect(result.orders).toHaveLength(0);
    expect(result.meta.total).toBe(0);
  });
});
