import prisma from '../../infrastructure/database/prisma.js';
import { AppError } from '../../common/errors/AppError.js';
import { cacheUtil } from '../../common/utils/cache.js';

export class MallService {
  /**
   * Creates a new mall.
   */
  async createMall(data) {
    return await prisma.mall.create({
      data,
    });
  }

  /**
   * Retrieves all malls.
   */
  async getAllMalls() {
    const cached = cacheUtil.get('malls:all');
    if (cached) return cached;

    const malls = await prisma.mall.findMany({
      include: {
        _count: {
          select: { merchants: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    cacheUtil.set('malls:all', malls, 600); // 10 mins
    return malls;
  }

  /**
   * Retrieves a single mall by ID with its merchants.
   */
  async getMallById(id) {
    const mall = await prisma.mall.findUnique({
      where: { id },
      include: {
        merchants: {
          where: { isApproved: true },
          select: {
            id: true,
            storeName: true,
            logo: true,
            description: true,
          },
        },
      },
    });

    if (!mall) {
      throw new AppError('Mall not found', 404);
    }

    return mall;
  }

  /**
   * Updates a mall.
   */
  async updateMall(id, data) {
    return await prisma.mall.update({
      where: { id },
      data,
    });
  }

  /**
   * Deletes a mall.
   */
  async deleteMall(id) {
    return await prisma.mall.delete({
      where: { id },
    });
  }

  /**
   * Assigns a merchant to a mall.
   */
  async addMerchantToMall(mallId, merchantId) {
    return await prisma.mall.update({
      where: { id: mallId },
      data: {
        merchants: {
          connect: { id: merchantId },
        },
      },
    });
  }

  /**
   * Removes a merchant from a mall.
   */
  async removeMerchantFromMall(mallId, merchantId) {
    return await prisma.mall.update({
      where: { id: mallId },
      data: {
        merchants: {
          disconnect: { id: merchantId },
        },
      },
    });
  }
}

export default new MallService();
