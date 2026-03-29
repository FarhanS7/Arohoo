import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// 1. Mock Prisma
const mockPrisma = {
  $transaction: jest.fn((cb) => cb(mockPrisma)),
  order: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  orderItem: {
    update: jest.fn(),
    updateMany: jest.fn(),
  },
  orderStatusHistory: {
    create: jest.fn(),
  },
};

// 2. Mock Modules
jest.unstable_mockModule('../../infrastructure/database/prisma.js', () => ({
  default: mockPrisma,
}));

// 3. Dynamic Import
const { OrderService } = await import('./order.service.js');

describe('OrderService Status Updates', () => {
  let orderService;

  beforeEach(() => {
    jest.clearAllMocks();
    orderService = new OrderService(mockPrisma);
  });

  describe('updateOrderStatus', () => {
    const mockOrder = {
      id: 'ord-123',
      status: 'CONFIRMED',
      userId: 'user-1',
      orderItems: [
        { id: 'item-1', merchantId: 'm-1', status: 'CONFIRMED' },
        { id: 'item-2', merchantId: 'm-2', status: 'CONFIRMED' }
      ]
    };

    test('Merchant should successfully update their own item to SHIPPED', async () => {
      const user = { id: 'u-m1', role: 'MERCHANT', merchantId: 'm-1' };
      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);

      const result = await orderService.updateOrderStatus('ord-123', 'SHIPPED', user, 'item-1');

      expect(result.newStatus).toBe('SHIPPED');
      expect(mockPrisma.orderItem.update).toHaveBeenCalledWith({
        where: { id: 'item-1' },
        data: { status: 'SHIPPED' }
      });
      expect(mockPrisma.orderStatusHistory.create).toHaveBeenCalled();
    });

    test('Merchant should fail to update an item they do not own', async () => {
      const user = { id: 'u-m1', role: 'MERCHANT', merchantId: 'm-1' };
      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);

      await expect(orderService.updateOrderStatus('ord-123', 'SHIPPED', user, 'item-2'))
        .rejects.toThrow('Unauthorized: You can only update your own items');
    });

    test('Merchant should fail to update entire order status', async () => {
      const user = { id: 'u-m1', role: 'MERCHANT', merchantId: 'm-1' };
      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);

      await expect(orderService.updateOrderStatus('ord-123', 'SHIPPED', user))
        .rejects.toThrow('Merchants can only update specific item status, not entire order');
    });

    test('Merchant should fail to update item to PENDING (invalid transition/role restriction)', async () => {
        const user = { id: 'u-m1', role: 'MERCHANT', merchantId: 'm-1' };
        mockPrisma.order.findUnique.mockResolvedValue(mockOrder);
  
        await expect(orderService.updateOrderStatus('ord-123', 'PENDING', user, 'item-1'))
          .rejects.toThrow('Merchants can only update items to SHIPPED or DELIVERED');
    });

    test('Admin should successfully update whole order status', async () => {
      const user = { id: 'u-admin', role: 'ADMIN' };
      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);

      const result = await orderService.updateOrderStatus('ord-123', 'SHIPPED', user);

      expect(result.newStatus).toBe('SHIPPED');
      expect(mockPrisma.order.update).toHaveBeenCalledWith({
        where: { id: 'ord-123' },
        data: { status: 'SHIPPED' }
      });
    });

    test('Should fail if transition is invalid (e.g. DELIVERED to SHIPPED)', async () => {
      const user = { id: 'u-admin', role: 'ADMIN' };
      const deliveredOrder = { ...mockOrder, status: 'DELIVERED' };
      mockPrisma.order.findUnique.mockResolvedValue(deliveredOrder);

      await expect(orderService.updateOrderStatus('ord-123', 'SHIPPED', user))
        .rejects.toThrow('Invalid status transition');
    });

    test('Customer should fail to update any status', async () => {
      const user = { id: 'u-1', role: 'CUSTOMER' };
      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);

      await expect(orderService.updateOrderStatus('ord-123', 'CANCELLED', user))
        .rejects.toThrow('Customers cannot update order status');
    });
  });
});
