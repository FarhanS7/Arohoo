import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// 1. Define mocks for the service
const mockOrderService = {
  getOrdersByUser: jest.fn(),
  updateOrderStatus: jest.fn(),
  getOrderById: jest.fn(),
};

// 2. Mock modules BEFORE importing controller
jest.unstable_mockModule('./order.service.js', () => ({
  OrderService: jest.fn().mockImplementation(() => mockOrderService),
}));

// Mock prisma to avoid actual database calls
jest.unstable_mockModule('../../infrastructure/database/prisma.js', () => ({
  default: jest.fn(),
}));

// 3. Dynamic import of controller
const orderController = await import('./order.controller.js');

describe('OrderController', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      user: { id: 'user-123', role: 'CUSTOMER' },
      query: {},
      params: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  describe('getMyOrders', () => {
    test('should return 200 and formatted orders', async () => {
      req.query = { page: '2', limit: '5' };
      const mockResult = {
        orders: [{ id: 'order-1', status: 'PENDING' }],
        meta: { page: 2, limit: 5, total: 1 }
      };
      mockOrderService.getOrdersByUser.mockResolvedValue(mockResult);

      await orderController.getMyOrders(req, res, next);

      expect(mockOrderService.getOrdersByUser).toHaveBeenCalledWith('user-123', 2, 5);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
        error: null
      });
    });

    test('should use default pagination values', async () => {
      await orderController.getMyOrders(req, res, next);
      expect(mockOrderService.getOrdersByUser).toHaveBeenCalledWith('user-123', 1, 10);
    });
  });

  describe('getOrder', () => {
    test('should return 200 and order details', async () => {
      req.params.id = 'ord-123';
      const mockOrder = { id: 'ord-123', status: 'CONFIRMED' };
      mockOrderService.getOrderById.mockResolvedValue(mockOrder);

      await orderController.getOrder(req, res, next);

      expect(mockOrderService.getOrderById).toHaveBeenCalledWith('ord-123', 'user-123', 'CUSTOMER');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockOrder,
        error: null
      });
    });
  });

  describe('updateStatus', () => {
    test('should update order status and return 200', async () => {
      req.params.id = 'ord-123';
      req.body = { newStatus: 'SHIPPED', orderItemId: 'item-456' };
      const mockResult = { orderId: 'ord-123', newStatus: 'SHIPPED' };
      mockOrderService.updateOrderStatus.mockResolvedValue(mockResult);

      await orderController.updateStatus(req, res, next);

      expect(mockOrderService.updateOrderStatus).toHaveBeenCalledWith('ord-123', 'SHIPPED', req.user, 'item-456');
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
