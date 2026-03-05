import { AppError } from '../../common/errors/AppError.js';
import prisma from '../../infrastructure/database/prisma.js';

export class AdminService {
  /**
   * Retrieves all merchants from the database.
   * Includes associated user email.
   * @returns {Promise<Array>} - List of merchants.
   */
  async getAllMerchants() {
    const merchants = await prisma.merchant.findMany({
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

    // Format the response to flatten the email structure
    return merchants.map((m) => ({
      id: m.id,
      storeName: m.storeName,
      isApproved: m.isApproved,
      email: m.user.email,
      createdAt: m.createdAt,
    }));
  }

  /**
   * Retrieves merchants waiting for approval.
   * @returns {Promise<Array>} - List of pending merchants.
   */
  async getPendingMerchants() {
    const merchants = await prisma.merchant.findMany({
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
      storeName: m.storeName,
      email: m.user.email,
    }));
  }

  /**
   * Approves a merchant.
   * @param {string} merchantId - ID of the merchant to approve.
   * @returns {Promise<Object>} - The updated merchant.
   * @throws {AppError} - If merchant not found.
   */
  async approveMerchant(merchantId) {
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
    });

    if (!merchant) {
      throw new AppError('Merchant not found', 404);
    }

    return await prisma.merchant.update({
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
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
    });

    if (!merchant) {
      throw new AppError('Merchant not found', 404);
    }

    return await prisma.merchant.update({
      where: { id: merchantId },
      data: { 
        isApproved: false,
        status: 'REJECTED'
      },
    });
  }
}
