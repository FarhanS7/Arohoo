import { AppError } from '../../common/errors/AppError.js';
import prisma from '../../infrastructure/database/prisma.js';
import { cacheUtil } from '../../common/utils/cache.js';

export class AdminService {
  constructor(prismaInstance) {
    this.prisma = prismaInstance || prisma;
  }
  /**
   * Retrieves all merchants from the database.
   * Includes associated user email.
   * @returns {Promise<Array>} - List of merchants.
   */
  async getAllMerchants() {
    const merchants = await this.prisma.merchant.findMany({
      select: {
        id: true,
        storeName: true,
        slug: true,
        isApproved: true,
        isTrending: true,
        createdAt: true,
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response to flatten the email structure
    return merchants.map((m) => ({
      id: m.id,
      businessName: m.storeName,
      slug: m.slug,
      ownerName: m.user.name,
      email: m.user.email,
      isApproved: m.isApproved,
      createdAt: m.createdAt,
      isTrending: m.isTrending
    }));
  }

  /**
   * Toggles the 'isTrending' status of a merchant.
   * @param {string} merchantId - ID of the merchant to update.
   * @returns {Promise<Object>} - The updated merchant.
   */
  async toggleMerchantTrending(merchantId) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
    });

    if (!merchant) {
      throw new AppError('Merchant not found', 404);
    }

    const updated = await this.prisma.merchant.update({
      where: { id: merchantId },
      data: { isTrending: !merchant.isTrending },
    });

    // Invalidate trending brands cache (covers public listing and specific trending key)
    cacheUtil.delByPrefix('merchants:public');
    cacheUtil.delByPrefix('merchants:trending');
    
    return updated;
  }

  /**
   * Toggles the 'isTrending' status of a product.
   * @param {string} productId - ID of the product to update.
   * @returns {Promise<Object>} - The updated product.
   */
  async toggleProductTrending(productId) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const updated = await this.prisma.product.update({
      where: { id: productId },
      data: { isTrending: !product.isTrending },
    });

    // Invalidate trending products cache (covers search and specific trending key)
    cacheUtil.delByPrefix('products:trending');
    cacheUtil.delByPrefix('products:search');
    
    return updated;
  }


  /**
   * Retrieves merchants waiting for approval.
   * @returns {Promise<Array>} - List of pending merchants.
   */
  async getPendingMerchants() {
    const merchants = await this.prisma.merchant.findMany({
      where: {
        isApproved: false,
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            phone: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

      return merchants.map((m) => ({
        id: m.id,
        businessName: m.storeName,
        slug: m.slug,
        ownerName: m.user.name,
        email: m.user.email,
        phone: m.user.phone,
        address: m.address,
        categories: m.categories,
        status: m.status,
        createdAt: m.createdAt,
      }));
  }

  /**
   * Approves a merchant.
   * @param {string} merchantId - ID of the merchant to approve.
   * @returns {Promise<Object>} - The updated merchant.
   * @throws {AppError} - If merchant not found.
   */
  async approveMerchant(merchantId) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
    });

    if (!merchant) {
      throw new AppError('Merchant not found', 404);
    }

    return await this.prisma.merchant.update({
      where: { id: merchantId },
      data: { 
        isApproved: true,
        status: 'APPROVED'
      },
    });
  }

  /**
   * Rejects a merchant application.
   * @param {string} merchantId - ID of the merchant to reject.
   * @returns {Promise<Object>} - The updated merchant.
   * @throws {AppError} - If merchant not found.
   */
  async rejectMerchant(merchantId) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
    });

    if (!merchant) {
      throw new AppError('Merchant not found', 404);
    }

    return await this.prisma.merchant.update({
      where: { id: merchantId },
      data: { 
        isApproved: false,
        status: 'REJECTED'
      },
    });
  }

  /**
   * Retrieves all users in the system.
   * @returns {Promise<Array>} - List of users with basic info.
   */
  async listUsers() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Updates a user's role.
   * @param {string} userId - ID of the user to update.
   * @param {string} role - New role (ADMIN, MERCHANT, CUSTOMER).
   * @returns {Promise<Object>} - The updated user.
   */
  async updateUserRole(userId, role) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return await this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true,
        status: true
      }
    });
  }

  /**
   * Updates a user's account status.
   * @param {string} userId - ID of the user to update.
   * @param {string} status - New status (ACTIVE, SUSPENDED).
   * @returns {Promise<Object>} - The updated user.
   */
  async updateUserStatus(userId, status) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return await this.prisma.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        email: true,
        role: true,
        status: true
      }
    });
  }

  /**
   * Retrieves high-level platform statistics.
   * @returns {Promise<Object>} - Stats including revenue, counts of users, merchants, etc.
   */
  async getPlatformStats() {
    const [totalRevenue, totalMerchants, totalUsers, totalCategories] = await Promise.all([
      this.prisma.order.aggregate({
        _sum: {
          totalAmount: true
        }
      }),
      this.prisma.merchant.count(),
      this.prisma.user.count(),
      this.prisma.category.count()
    ]);

    return {
      totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
      totalMerchants,
      totalUsers,
      totalCategories,
      updatedAt: new Date()
    };
  }

  /**
   * Retrieves all products for platform-wide management.
   * @returns {Promise<Array>} - List of all products.
   */
  async getAllProducts() {
    return await this.prisma.product.findMany({
      include: {
        merchant: {
          select: {
            id: true,
            storeName: true,
            slug: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        },
        images: {
          take: 1,
          select: { url: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Retrieves full details for a specific merchant including performance stats,
   * product catalog, and order history.
   * @param {string} merchantId - ID of the merchant to inspect.
   */
  async getMerchantFullDetails(merchantId) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            phone: true
          }
        },
        products: {
          include: {
            images: { take: 1 },
            variants: true,
            category: { select: { name: true } }
          }
        },
        _count: {
          select: { products: true }
        }
      }
    });

    if (!merchant) throw new AppError('Merchant not found', 404);

    // Fetch related orders (all orders containing items from this merchant)
    const orderItems = await this.prisma.orderItem.findMany({
      where: { merchantId },
      include: {
        order: {
          include: {
            user: { select: { name: true, email: true } }
          }
        },
        product: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Reuse MerchantService-like stat aggregation
    const statsAggregate = await this.prisma.orderItem.aggregate({
      where: {
        merchantId,
        status: { not: 'CANCELLED' }
      },
      _sum: {
        subtotal: true,
        quantity: true
      },
      _count: {
        id: true
      }
    });

    const deliveredCount = await this.prisma.orderItem.count({
      where: { merchantId, status: 'DELIVERED' }
    });

    const stats = {
      totalRevenue: Number(statsAggregate._sum.subtotal || 0),
      totalSales: Number(statsAggregate._sum.quantity || 0),
      totalItems: statsAggregate._count.id || 0,
      fulfillmentRate: statsAggregate._count.id > 0 
        ? Math.round((deliveredCount / statsAggregate._count.id) * 100) 
        : 0
    };

    return {
      profile: merchant,
      products: merchant.products,
      orders: orderItems,
      stats
    };
  }

  /**
   * Updates any product's details (Admin-level bypass).
   */
  async updateProductByAdmin(productId, data) {
    return await this.prisma.product.update({
      where: { id: productId },
      data,
      include: { variants: true }
    });
  }

  /**
   * Updates an order item's status (Admin-level bypass).
   */
  async updateOrderItemStatusByAdmin(orderItemId, status) {
    return await this.prisma.orderItem.update({
      where: { id: orderItemId },
      data: { status }
    });
  }
}
