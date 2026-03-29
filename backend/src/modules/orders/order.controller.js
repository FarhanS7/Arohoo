import { AppError } from '../../common/errors/AppError.js';
import { asyncHandler } from '../../common/utils/async.handler.js';
import prisma from '../../infrastructure/database/prisma.js';
import { OrderService } from './order.service.js';

const orderService = new OrderService(prisma);

/**
 * Update order or order item status.
 */
export const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newStatus, status, orderItemId: providedOrderItemId } = req.body;

  // 1. Handle status alias and mapping
  let targetStatus = status || newStatus;
  if (targetStatus === 'PROCESSING') targetStatus = 'CONFIRMED';

  let orderItemId = providedOrderItemId;

  // 2. Proactive Merchant Item Detection
  // If a merchant is updating status without an orderItemId, find the first item in that order belonging to them
  if (req.user.role === 'MERCHANT' && !orderItemId) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { orderItems: true }
    });
    
    const merchantItem = order?.orderItems.find(item => item.merchantId === req.user.merchantId);
    if (merchantItem) {
      orderItemId = merchantItem.id;
    }
  }

  const result = await orderService.updateOrderStatus(id, targetStatus, req.user, orderItemId);

  res.status(200).json({
    success: true,
    data: result,
    error: null
  });
});

/**
 * List orders for the current user.
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const result = await orderService.getOrdersByUser(req.user.id, page, limit);

  res.status(200).json({
    success: true,
    data: result,
    error: null
  });
});

/**
 * Get order details.
 */
export const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await orderService.getOrderById(id, req.user.id, req.user.role);

  res.status(200).json({
    success: true,
    data: order,
    error: null
  });
});
/**
 * Get orders for the current merchant.
 */
export const getMerchantOrders = asyncHandler(async (req, res) => {
  // 1. Validate role and merchant identity
  if (req.user.role !== 'MERCHANT') {
    throw new AppError('Unauthorized: Only merchants can access this resource', 403);
  }

  const merchantId = req.user.merchantId;
  if (!merchantId) {
    throw new AppError('Merchant profile not found', 404);
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // 2. Fetch results from service
  const result = await orderService.getOrdersByMerchant({ merchantId, page, limit });

  // 3. Return response
  res.status(200).json({
    success: true,
    data: result,
    error: null
  });
});
/**
 * Get all platform orders (Admin only).
 */
export const getAllOrders = asyncHandler(async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    throw new AppError('Unauthorized: Only admins can access this resource', 403);
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const result = await orderService.getAllOrders(page, limit);

  res.status(200).json({
    success: true,
    data: result,
    error: null
  });
});

/**
 * Update order status (Admin only).
 */
export const adminUpdateOrderStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    throw new AppError('Unauthorized: Only admins can access this resource', 403);
  }

  const { orderId, status } = req.body;

  if (!orderId || !status) {
    throw new AppError('Order ID and status are required', 400);
  }

  const result = await orderService.updateOrderStatus(orderId, status, req.user);

  res.status(200).json({
    success: true,
    data: result,
    error: null
  });
});
