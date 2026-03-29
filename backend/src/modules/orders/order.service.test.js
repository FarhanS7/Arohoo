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

  describe('getOrdersByMerchant', () => {
    test('should return orders containing only merchant items with correct schema', async () => {
      const merchantId = 'm-1';
      const mockOrders = [
        {
          id: 'ord-1',
          status: 'PENDING',
          totalAmount: 150.00,
          createdAt: new Date(),
          user: { id: 'cust-1', email: 'cust@ex.com' },
          orderItems: [
            {
              id: 'oi-1',
              quantity: 2,
              price: 75.00,
              productVariant: {
                id: 'v-1',
                sku: 'SKU123',
                product: { id: 'p-1', name: 'My Product' }
              }
            }
          ]
        }
      ];

      mockPrisma.order.findMany.mockResolvedValue(mockOrders);
      mockPrisma.order.count.mockResolvedValue(1);

      const result = await orderService.getOrdersByMerchant({ merchantId, page: 1, limit: 10 });

      expect(result.orders).toHaveLength(1);
      const order = result.orders[0];
      expect(order.user.email).toBe('cust@ex.com');
      expect(order.items).toHaveLength(1);
      const item = order.items[0];
      expect(item.id).toBe('oi-1');
      expect(item.quantity).toBe(2);
      expect(item.price).toBe(75.00);
      expect(item.productVariant.sku).toBe('SKU123');
      expect(item.productVariant.product.name).toBe('My Product');
      expect(result.pagination).toEqual({ page: 1, limit: 10, total: 1 });
    });

    test('should handle pagination for merchant orders', async () => {
      mockPrisma.order.findMany.mockResolvedValue([]);
      mockPrisma.order.count.mockResolvedValue(15);

      const result = await orderService.getOrdersByMerchant({ merchantId: 'm-1', page: 2, limit: 5 });

      expect(mockPrisma.order.findMany).toHaveBeenCalledWith(expect.objectContaining({
        skip: 5,
        take: 5,
        where: { orderItems: { some: { merchantId: 'm-1' } } }
      }));
      expect(result.pagination.total).toBe(15);
    });

    test('should return empty list if merchant has no orders', async () => {
      mockPrisma.order.findMany.mockResolvedValue([]);
      mockPrisma.order.count.mockResolvedValue(0);

      const result = await orderService.getOrdersByMerchant({ merchantId: 'm-none' });

      expect(result.orders).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
    });
  });

  describe('updateMerchantOrderItemStatus', () => {
    test('should successfully update status and record history', async () => {
      const merchantId = 'm-1';
      const orderItemId = 'oi-1';
      const mockItem = { 
        id: orderItemId, 
        merchantId: 'm-1', 
        status: 'PENDING', 
        orderId: 'ord-1' 
      };

      mockPrisma.orderItem.findUnique.mockResolvedValue(mockItem);
      mockPrisma.orderItem.update.mockResolvedValue({ ...mockItem, status: 'CONFIRMED' });

      const result = await orderService.updateMerchantOrderItemStatus({ 
        merchantId, 
        orderItemId, 
        status: 'CONFIRMED' 
      });

      expect(result.status).toBe('CONFIRMED');
      expect(mockPrisma.orderItem.update).toHaveBeenCalledWith({
        where: { id: orderItemId },
        data: { status: 'CONFIRMED' }
      });
      expect(mockPrisma.orderStatusHistory.create).toHaveBeenCalled();
    });

    test('should fail if merchant does not own the item', async () => {
      const mockItem = { id: 'oi-1', merchantId: 'm-other', status: 'PENDING' };
      mockPrisma.orderItem.findUnique.mockResolvedValue(mockItem);

      await expect(orderService.updateMerchantOrderItemStatus({ 
        merchantId: 'm-1', 
        orderItemId: 'oi-1', 
        status: 'CONFIRMED' 
      })).rejects.toThrow('Unauthorized: You do not own this order item');
    });

    test('should fail for invalid status transition', async () => {
      const mockItem = { id: 'oi-1', merchantId: 'm-1', status: 'DELIVERED' };
      mockPrisma.orderItem.findUnique.mockResolvedValue(mockItem);

      await expect(orderService.updateMerchantOrderItemStatus({ 
        merchantId: 'm-1', 
        orderItemId: 'oi-1', 
        status: 'SHIPPED' 
      })).rejects.toThrow('Invalid status transition from DELIVERED to SHIPPED');
    });
  });
});
