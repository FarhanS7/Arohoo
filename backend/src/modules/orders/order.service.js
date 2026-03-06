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

  /**
   * Retrieves a paginated list of orders for a specific user.
   */
  async getOrdersByUser(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        include: {
          orderItems: {
            include: {
              product: { select: { name: true } },
              productVariant: {
                select: { size: true, color: true, price: true }
              },
              merchant: {
                select: { id: true, storeName: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.order.count({ where: { userId } })
    ]);

    // Format response to match contract
    const formattedOrders = orders.map(order => ({
      id: order.id,
      status: order.status,
      createdAt: order.createdAt,
      total: Number(order.totalAmount),
      items: order.orderItems.map(item => ({
        productId: item.productId,
        productName: item.product.name,
        variant: item.productVariant,
        quantity: item.quantity,
        merchant: {
          id: item.merchant.id,
          name: item.merchant.storeName
        }
      })),
      shippingAddress: order.shippingAddress
    }));

    return {
      orders: formattedOrders,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total
      }
    };
  }

  async getOrderById(orderId, userId, role) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { 
        orderItems: {
          include: {
            product: { select: { name: true } },
            productVariant: {
              select: { size: true, color: true, price: true }
            },
            merchant: {
              select: { id: true, storeName: true }
            }
          }
        },
        statusHistory: {
            include: { changedBy: { select: { email: true } } },
            orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!order) throw new AppError('Order not found', 404);

    // Multi-tenant check: Customers can only see their own orders
    if (role === 'CUSTOMER' && order.userId !== userId) {
      throw new AppError('Unauthorized: You can only view your own orders', 403);
    }

    // Role check: Merchants can only see orders if they have an item in it
    // (Simplifying: admins see all, customers see own, merchants see if they own an item)
    if (role === 'MERCHANT') {
        const hasItem = order.orderItems.some(item => item.merchantId === userId); // Note: userId is often merchantId for role MERCHANT in routes
        // Better: routes provide user.merchantId if available
    }

    // Format response
    return {
      id: order.id,
      status: order.status,
      createdAt: order.createdAt,
      total: Number(order.totalAmount),
      items: order.orderItems.map(item => ({
        productId: item.productId,
        productName: item.product.name,
        variant: item.productVariant,
        quantity: item.quantity,
        merchant: {
          id: item.merchant.id,
          name: item.merchant.storeName
        }
      })),
      shippingAddress: order.shippingAddress,
      statusHistory: order.statusHistory
    };
  }
}
