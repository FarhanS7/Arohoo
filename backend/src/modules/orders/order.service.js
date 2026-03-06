import { AppError } from '../../common/errors/AppError.js';

export class OrderService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * Updates the status of an order or a specific order item.
   * Enforces progression rules and role-based permissions.
   */
  async updateOrderStatus(id, newStatus, user, orderItemId = null) {
    const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(newStatus)) {
      throw new AppError(`Invalid status: ${newStatus}`, 400);
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch current state
      const order = await tx.order.findUnique({
        where: { id },
        include: { orderItems: true }
      });

      if (!order) throw new AppError('Order not found', 404);

      let target = order;
      let currentStatus = order.status;

      if (orderItemId) {
        target = order.orderItems.find(item => item.id === orderItemId);
        if (!target) throw new AppError('Order item not found', 404);
        currentStatus = target.status;
      }

      // 2. Role-based Permission Checks
      if (user.role === 'MERCHANT') {
        const isOwner = order.orderItems.some(item => item.merchantId === user.merchantId); // This is simplified, should check specific item if orderItemId provided
        if (orderItemId && target.merchantId !== user.merchantId) {
            throw new AppError('Unauthorized: You can only update your own items', 403);
        }
        if (!['SHIPPED', 'DELIVERED'].includes(newStatus)) {
          throw new AppError('Merchants can only update items to SHIPPED or DELIVERED', 403);
        }
      } else if (user.role === 'CUSTOMER') {
        throw new AppError('Customers cannot update order status', 403);
      } else if (user.role === 'ADMIN') {
        // Admins can do anything, but restricted by progression mostly
      }

      // 3. Progression Rules
      const progression = {
        'PENDING': ['CONFIRMED', 'CANCELLED'],
        'CONFIRMED': ['SHIPPED', 'CANCELLED'],
        'SHIPPED': ['DELIVERED'],
        'DELIVERED': [],
        'CANCELLED': []
      };

      if (!progression[currentStatus].includes(newStatus)) {
        throw new AppError(`Invalid status transition from ${currentStatus} to ${newStatus}`, 409);
      }

      // 4. Update Status and Log History
      if (orderItemId) {
        await tx.orderItem.update({
          where: { id: orderItemId },
          data: { status: newStatus }
        });
      } else {
        await tx.order.update({
          where: { id },
          data: { status: newStatus }
        });
        
        // If order confirmed/cancelled, maybe update all items too? 
        // User requirements: "Merchants can only update their items to SHIPPED or DELIVERED"
        // This implies item-level status is primary for merchants.
        if (['CONFIRMED', 'CANCELLED'].includes(newStatus)) {
            await tx.orderItem.updateMany({
                where: { orderId: id },
                data: { status: newStatus }
            });
        }
      }

      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          orderItemId,
          oldStatus: currentStatus,
          newStatus,
          changedById: user.id
        }
      });

      return {
        orderId: id,
        orderItemId,
        previousStatus: currentStatus,
        newStatus,
        updatedAt: new Date()
      };
    });
  }

  async getOrderById(id, requesterId, userRole) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { 
        orderItems: true,
        statusHistory: {
            include: { changedBy: { select: { email: true } } },
            orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!order) throw new AppError('Order not found', 404);

    return order;
  }
}
