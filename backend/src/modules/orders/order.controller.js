import { asyncHandler } from '../../common/utils/async.handler.js';
import getPrisma from '../../infrastructure/database/prisma.js';
import { OrderService } from './order.service.js';

const prisma = getPrisma();
const orderService = new OrderService(prisma);

/**
 * Update order or order item status.
 */
export const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newStatus, orderItemId } = req.body;

  const result = await orderService.updateOrderStatus(id, newStatus, req.user, orderItemId);

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
