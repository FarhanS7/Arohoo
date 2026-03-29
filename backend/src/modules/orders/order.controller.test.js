import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// 1. Define mocks for the service
const mockOrderService = {
  getOrdersByUser: jest.fn(),
  updateOrderStatus: jest.fn(),
  getOrderById: jest.fn(),
  getOrdersByMerchant: jest.fn(),
  getAllOrders: jest.fn(),
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

  describe('getMerchantOrders', () => {
    test('should return 200 and merchant orders', async () => {
      req.user = { id: 'u-1', role: 'MERCHANT', merchantId: 'm-123' };
      req.query = { page: '1', limit: '10' };
      const mockResult = {
        orders: [{ id: 'order-1', status: 'PENDING' }],
        pagination: { page: 1, limit: 10, total: 1 }
      };
      mockOrderService.getOrdersByMerchant.mockResolvedValue(mockResult);

      await orderController.getMerchantOrders(req, res, next);

      expect(mockOrderService.getOrdersByMerchant).toHaveBeenCalledWith({
        merchantId: 'm-123',
        page: 1,
        limit: 10
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
        error: null
      });
    });

    test('should fail if user is not a merchant', async () => {
      req.user.role = 'CUSTOMER';
      
      await orderController.getMerchantOrders(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(403);
      expect(error.message).toContain('Only merchants can access');
    });

    test('should fail if merchantId is missing', async () => {
      req.user = { id: 'u-1', role: 'MERCHANT' }; // missing merchantId
      
      await orderController.getMerchantOrders(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(404);
    });
  });

  describe('getAllOrders', () => {
    test('should return 200 and all orders for admin', async () => {
      req.user = { id: 'admin-1', role: 'ADMIN' };
      req.query = { page: '1', limit: '20' };
      const mockResult = {
        orders: [{ id: 'order-1', status: 'PENDING' }],
        meta: { page: 1, limit: 20, total: 1 }
      };
      mockOrderService.getAllOrders.mockResolvedValue(mockResult);

      await orderController.getAllOrders(req, res, next);

      expect(mockOrderService.getAllOrders).toHaveBeenCalledWith(1, 20);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
        error: null
      });
    });

    test('should fail if user is not an admin', async () => {
      req.user = { id: 'u-1', role: 'CUSTOMER' };
      
      await orderController.getAllOrders(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(403);
    });
  });

  describe('adminUpdateOrderStatus', () => {
    test('should return 200 and updated status for admin', async () => {
      req.user = { id: 'admin-1', role: 'ADMIN' };
      req.body = { orderId: 'order-1', status: 'CANCELLED' };
      const mockResult = { orderId: 'order-1', newStatus: 'CANCELLED' };
      mockOrderService.updateOrderStatus.mockResolvedValue(mockResult);

      await orderController.adminUpdateOrderStatus(req, res, next);

      expect(mockOrderService.updateOrderStatus).toHaveBeenCalledWith('order-1', 'CANCELLED', req.user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
        error: null
      });
    });

    test('should fail if user is not an admin', async () => {
      req.user = { id: 'u-1', role: 'CUSTOMER' };
      req.body = { orderId: 'order-1', status: 'CANCELLED' };
      
      await orderController.adminUpdateOrderStatus(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(403);
    });
  });
});
