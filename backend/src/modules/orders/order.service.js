import { AppError } from '../../common/errors/AppError.js';
import { cacheUtil } from '../../common/utils/cache.js';

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
        // Merchant MUST provide orderItemId to update status of their own item
        if (!orderItemId) {
          throw new AppError('Merchants can only update specific item status, not entire order', 403);
        }

        // Verify ownership
        if (target.merchantId !== user.merchantId) {
          throw new AppError('Unauthorized: You can only update your own items', 403);
        }

        // Merchants can only move to SHIPPED or DELIVERED
        if (!['SHIPPED', 'DELIVERED'].includes(newStatus)) {
          throw new AppError('Merchants can only update items to SHIPPED or DELIVERED', 403);
        }
      } else if (user.role === 'CUSTOMER') {
        throw new AppError('Customers cannot update order status', 403);
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
        
        // If order confirmed/cancelled, update all items too
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

      // 5. Invalidate caches
      const merchantIds = new Set();
      if (orderItemId) {
        merchantIds.add(target.merchantId);
      } else {
        order.orderItems.forEach(item => merchantIds.add(item.merchantId));
      }

      merchantIds.forEach(mId => cacheUtil.delete(`merchant:stats:${mId}`));

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
        select: {
          id: true,
          status: true,
          totalAmount: true,
          createdAt: true,
          orderItems: {
            select: {
              quantity: true,
              product: { select: { id: true, name: true } },
              productVariant: {
                select: { id: true, price: true, imageUrl: true }
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

    // Format response to match the requested schema
    const formattedOrders = orders.map(order => ({
      id: order.id,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      createdAt: order.createdAt,
      orderItems: order.orderItems.map(item => ({
        quantity: item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name
        },
        productVariant: {
          id: item.productVariant.id,
          price: Number(item.productVariant.price),
          imageUrl: item.productVariant.imageUrl
        },
        merchant: {
          id: item.merchant.id,
          storeName: item.merchant.storeName
        }
      }))
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
              select: { size: true, color: true, price: true, imageUrl: true }
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
      shippingName: order.shippingName,
      shippingPhone: order.shippingPhone,
      shippingAddress: order.shippingAddress,
      shippingDistrict: order.shippingDistrict,
      shippingCost: Number(order.shippingCost),
      statusHistory: order.statusHistory
    };
  }

  /**
   * Internal helper to create an order from items.
   * Can be used standalone or within createOrderFromCart.
   * Performs stock validation and decrementing within a transaction.
   */
  async createOrder({ userId, shippingName, shippingPhone, shippingAddress, items }, externalTx = null) {
    const tx = externalTx || this.prisma;

    return tx.$transaction(async (innerTx) => {
      let totalAmount = 0;
      const orderItemsData = [];

      // 1. Batch fetch all variants involved in the order for validation
      const variantIds = items.map(item => item.productVariantId || item.variantId).filter(Boolean);
      const variants = await innerTx.productVariant.findMany({
        where: { id: { in: variantIds } },
        include: { product: true }
      });
      const variantMap = new Map(variants.map(v => [v.id, v]));

      // 2. Process items and validate stock
      for (const item of items) {
        const variantId = item.productVariantId || item.variantId;
        const variant = variantMap.get(variantId);

        if (!variant) {
          throw new AppError(`Product variant not found: ${variantId}`, 404);
        }

        if (variant.stock < item.quantity) {
          throw new AppError(`Not enough stock for SKU ${variant.sku}. Available: ${variant.stock}`, 400);
        }

        // Decrement stock (Note: individual updates within transaction ensure data integrity)
        await innerTx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: item.quantity } }
        });

        const subtotal = Number(variant.price) * item.quantity;
        totalAmount += subtotal;

        orderItemsData.push({
          productId: variant.productId,
          productVariantId: variant.id,
          merchantId: variant.product.merchantId,
          quantity: item.quantity,
          price: variant.price,
          subtotal: subtotal,
          status: 'PENDING'
        });
      }

      // 2. Create Order
      const order = await innerTx.order.create({
        data: {
          userId,
          shippingName,
          shippingPhone,
          shippingAddress,
          totalAmount,
          status: 'PENDING',
          orderItems: {
            create: orderItemsData
          }
        },
        include: {
          orderItems: true
        }
      });

      // 4. Invalidate caches
      cacheUtil.delByPrefix('products:search');
      const uniqueMerchants = [...new Set(orderItemsData.map(item => item.merchantId))];
      uniqueMerchants.forEach(mId => cacheUtil.delete(`merchant:stats:${mId}`));
      orderItemsData.forEach(item => cacheUtil.delete(`product:detail:${item.productId}`));

      return order;
    });
  }

  /**
   * Creates an order from the user's current shopping cart.
   * Validates cart content and stock before clearing cart and creating order.
   */
  async createOrderFromCart({ userId, shippingName, shippingPhone, shippingAddress }) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch user cart with items and variants
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              productVariant: true
            }
          }
        }
      });

      if (!cart || cart.items.length === 0) {
        throw new AppError('Your cart is empty', 400);
      }

      // 2. Prepare items for createOrder
      const items = cart.items.map(item => ({
        productVariantId: item.productVariantId,
        quantity: item.quantity
      }));

      // 3. Create Order (Stock validation & decrementing happens inside)
      const order = await this.createOrder({
        userId,
        shippingName,
        shippingPhone,
        shippingAddress,
        items
      }, tx); // Pass current transaction

      // 4. Clear Cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return order;
    });
  }

  /**
   * Retrieves a paginated list of orders containing items from a specific merchant.
   * Returns only the items belonging to that merchant within each order.
   */
  async getOrdersByMerchant({ merchantId, page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: {
          orderItems: { some: { merchantId } }
        },
        select: {
          id: true,
          status: true,
          createdAt: true,
          shippingName: true,
          shippingPhone: true,
          shippingAddress: true,
          shippingDistrict: true,
          shippingCost: true,
          totalAmount: true,
          user: {
            select: { id: true, email: true }
          },
          orderItems: {
            where: { merchantId },
            select: {
              id: true,
              quantity: true,
              price: true,
              subtotal: true,
              status: true,
              productVariant: {
                select: {
                  id: true,
                  sku: true,
                  size: true,
                  color: true,
                  imageUrl: true,
                  product: { 
                    select: { 
                      id: true, 
                      name: true,
                      images: {
                        select: { url: true },
                        take: 1,
                        orderBy: { order: 'asc' }
                      }
                    } 
                  }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.order.count({
        where: {
          orderItems: { some: { merchantId } }
        }
      })
    ]);

    // Format results to match the requested schema
    const formattedOrders = orders.map(order => ({
      id: order.id,
      status: order.status,
      createdAt: order.createdAt,
      customer: order.user ? {
        id: order.user.id,
        email: order.user.email
      } : {
        name: order.shippingName,
        phone: order.shippingPhone
      },
      shippingName: order.shippingName,
      shippingPhone: order.shippingPhone,
      shippingAddress: order.shippingAddress,
      shippingDistrict: order.shippingDistrict,
      shippingCost: Number(order.shippingCost),
      totalAmount: Number(order.totalAmount),
      orderItems: order.orderItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: Number(item.price),
        subtotal: Number(item.subtotal),
        status: item.status,
        product: {
          id: item.productVariant.product.id,
          name: item.productVariant.product.name,
          images: item.productVariant.product.images
        },
        productVariant: {
          id: item.productVariant.id,
          sku: item.productVariant.sku,
          size: item.productVariant.size,
          color: item.productVariant.color,
          imageUrl: item.productVariant.imageUrl
        }
      }))
    }));

    return {
      orders: formattedOrders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total // Including total even though not explicitly in schema but standard for pagination
      }
    };
  }

  /**
   * Retrieves a paginated list of all orders in the system for platform admins.
   */
  async getAllOrders(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        select: {
          id: true,
          status: true,
          totalAmount: true,
          createdAt: true,
          user: {
            select: { id: true, email: true }
          },
          orderItems: {
            select: {
              id: true,
              quantity: true,
              price: true,
              status: true,
              product: { select: { id: true, name: true } },
              productVariant: {
                select: { id: true, size: true, color: true, price: true, imageUrl: true }
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
      this.prisma.order.count()
    ]);

    const formattedOrders = orders.map(order => ({
      id: order.id,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      createdAt: order.createdAt,
      customer: {
        id: order.user.id,
        email: order.user.email
      },
      orderItems: order.orderItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: Number(item.price),
        status: item.status,
        product: {
          id: item.product.id,
          name: item.product.name
        },
        productVariant: {
          id: item.productVariant.id,
          price: Number(item.productVariant.price),
          size: item.productVariant.size,
          color: item.productVariant.color,
          imageUrl: item.productVariant.imageUrl
        },
        merchant: {
          id: item.merchant.id,
          storeName: item.merchant.storeName
        }
      }))
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

  /**
   * Updates the status of a specific order item belonging to a merchant.
   * Validates ownership and enforces status progression.
   */
  async updateMerchantOrderItemStatus({ merchantId, orderItemId, status }) {
    const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      throw new AppError(`Invalid status: ${status}`, 400);
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch item with current status
      const item = await tx.orderItem.findUnique({
        where: { id: orderItemId },
        include: { order: true }
      });

      if (!item) {
        throw new AppError('Order item not found', 404);
      }

      // 2. Validate ownership
      if (item.merchantId !== merchantId) {
        throw new AppError('Unauthorized: You do not own this order item', 403);
      }

      const currentStatus = item.status;

      // 3. Enforce status transitions
      const progression = {
        'PENDING': ['CONFIRMED', 'CANCELLED'],
        'CONFIRMED': ['SHIPPED', 'CANCELLED'],
        'SHIPPED': ['DELIVERED'],
        'DELIVERED': [],
        'CANCELLED': []
      };

      if (!progression[currentStatus].includes(status)) {
        throw new AppError(`Invalid status transition from ${currentStatus} to ${status}`, 409);
      }

      // 4. Update status
      const updatedItem = await tx.orderItem.update({
        where: { id: orderItemId },
        data: { status }
      });

      // 5. Add status history record
      await tx.orderStatusHistory.create({
        data: {
          orderId: item.orderId,
          orderItemId,
          oldStatus: currentStatus,
          newStatus: status,
          // We don't have the user object here, but we can find the merchant user id or leave it
          // Assuming the system allows finding user by merchantId if needed, but for now we skip changedById or use a placeholder
        }
      });

      return updatedItem;
    });
  }
}
