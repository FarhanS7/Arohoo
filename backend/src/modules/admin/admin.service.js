import { AppError } from '../../common/errors/AppError.js';
import prisma from '../../infrastructure/database/prisma.js';

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
      include: {
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
      ownerName: m.user.name,
      email: m.user.email,
      isApproved: m.isApproved,
      createdAt: m.createdAt,
    }));
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
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return merchants.map((m) => ({
      id: m.id,
      businessName: m.storeName,
      ownerName: m.user.name,
      email: m.user.email,
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
}
