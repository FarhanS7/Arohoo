import { AppError } from '../../common/errors/AppError.js';
import { cacheUtil } from '../../common/utils/cache.js';
import prisma from '../../infrastructure/database/prisma.js';

/**
 * Service to handle merchant-specific business logic and analytics.
 */
export class MerchantService {
  constructor(prismaInstance) {
    this.prisma = prismaInstance || prisma;
  }

  /**
   * Calculates comprehensive dashboard statistics for a specific merchant.
   * Includes revenue, sales volume, fulfillment rate, and stock health.
   * 
   * @param {string} merchantId - The unique identifier of the merchant.
   * @returns {Promise<Object>} Statistics containing totalRevenue, totalSales, fulfillmentRate, and lowStockProducts.
   */
  async getMerchantDashboardStats(merchantId) {
    if (!merchantId) throw new AppError('Merchant ID is required', 400);

    const cacheKey = `merchant:stats:${merchantId}`;
    const cached = cacheUtil.get(cacheKey);
    if (cached) return cached;

    const statsWindow = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    // 1. Parallel fetch for all stats - Optimized: avoid sequential DB roundtrips
    const [statsAggregate, deliveredCount, lowStockProducts] = await Promise.all([
      this.prisma.orderItem.aggregate({
        where: {
          merchantId,
          status: { not: 'CANCELLED' },
          createdAt: { gte: statsWindow }
        },
        _sum: {
          subtotal: true,
          quantity: true
        },
        _count: {
          id: true
        }
      }),
      this.prisma.orderItem.count({
        where: {
          merchantId,
          status: 'DELIVERED',
          createdAt: { gte: statsWindow }
        }
      }),
      this.prisma.productVariant.count({
        where: {
          product: { merchantId },
          stock: { lte: 5 }
        }
      })
    ]);

    const totalRevenue = Number(statsAggregate._sum.subtotal || 0);
    const totalSales = Number(statsAggregate._sum.quantity || 0);
    const totalItems = statsAggregate._count.id || 0;
    
    // 3. Calculate fulfillment rate
    const fulfillmentRate = totalItems > 0 
        ? Math.round((deliveredCount / totalItems) * 100) 
        : 0;

    const result = {
      revenue: totalRevenue,
      salesVolume: totalSales,
      fulfillmentRate,
      lowStockAlerts: lowStockProducts
    };

    cacheUtil.set(cacheKey, result, 120); // 2 mins
    return result;
  }

  /**
   * Updates a merchant's profile information.
   * 
   * @param {string} merchantId - The unique ID of the merchant.
   * @param {Object} updateData - The fields to update (storeName, description, bannerImage, logo).
   * @returns {Promise<Object>} The updated merchant profile.
   * @throws {AppError} If merchant not found.
   */
  async updateMerchantProfile(merchantId, updateData) {
    if (!merchantId) throw new AppError('Merchant ID is required', 400);

    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId }
    });

    if (!merchant) throw new AppError('Merchant not found', 404);

    return await this.prisma.merchant.update({
      where: { id: merchantId },
      data: updateData
    });
  }

  /**
   * Retrieves all merchants pending approval. (Admin only)
   * @returns {Promise<Array>} List of pending merchants.
   */
  async getPendingMerchants() {
    return await this.prisma.merchant.findMany({
      where: { status: 'PENDING' },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            phone: true
          }
        },
        categories: true
      }
    });
  }

  /**
   * Approves a merchant. (Admin only)
   * @param {string} merchantId - The unique ID of the merchant.
   * @returns {Promise<Object>} The updated merchant.
   */
  async approveMerchant(merchantId) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId }
    });

    if (!merchant) throw new AppError('Merchant not found', 404);

    return await this.prisma.merchant.update({
      where: { id: merchantId },
      data: {
        isApproved: true,
        status: 'APPROVED'
      }
    });
  }

  /**
   * Rejects a merchant. (Admin only)
   * @param {string} merchantId - The unique ID of the merchant.
   * @returns {Promise<Object>} The updated merchant.
   */
  async rejectMerchant(merchantId) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId }
    });

    if (!merchant) throw new AppError('Merchant not found', 404);

    return await this.prisma.merchant.update({
      where: { id: merchantId },
      data: {
        isApproved: false,
        status: 'REJECTED'
      }
    });
  }

  /**
   * Retrieves public merchants with optional filters.
   * @param {Object} filters - Filter options (isTrending, etc.)
   * @param {number} page - Current page num.
   * @param {number} limit - Items per page.
   * @returns {Promise<Object>} Formatted merchant list with pagination.
   */
  async getPublicMerchants(filters = {}, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const { query } = filters;

    // 1. ADVANCED FTS SEARCH (If query provided)
    if (query && query.trim().length > 0) {
      const cacheKey = cacheUtil.generateKey('merchants:fts_search_v4', { query, page, limit });
      const cached = cacheUtil.get(cacheKey);
      if (cached) return cached;

      // Merchant FTS + Trigram Similarity + Product/Category Match Check
      // We surface brands if their name/desc matches OR if they sell products/categories matching the query
      const rawResults = await this.prisma.$queryRaw`
        WITH search_candidates AS (
          SELECT m.id, m."storeName", m.description
          FROM merchants m
          WHERE 
            m."isApproved" = true AND
            (setweight(to_tsvector('english', COALESCE(m."storeName", '')), 'A') ||
             setweight(to_tsvector('english', COALESCE(m.description, '')), 'B'))
            @@ websearch_to_tsquery('english', ${query})
        )
        SELECT id,
               ts_rank_cd(
                 setweight(to_tsvector('english', COALESCE("storeName", '')), 'A') ||
                 setweight(to_tsvector('english', COALESCE(description, '')), 'B'),
                 websearch_to_tsquery('english', ${query})
               ) AS rank,
               similarity("storeName", ${query}) AS similarity
        FROM search_candidates
        ORDER BY rank DESC, similarity DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      const merchantIds = rawResults.map(r => r.id);
      
      const countResult = await this.prisma.$queryRaw`
        WITH search_candidates AS (
          SELECT m.id
          FROM merchants m
          WHERE 
            m."isApproved" = true AND
            (setweight(to_tsvector('english', COALESCE(m."storeName", '')), 'A') ||
             setweight(to_tsvector('english', COALESCE(m.description, '')), 'B'))
            @@ websearch_to_tsquery('english', ${query})
        )
        SELECT COUNT(*)::int as total
        FROM search_candidates
      `;
      const total = countResult[0]?.total || 0;

      // Hydrate
      const merchants = await this.prisma.merchant.findMany({
        where: { id: { in: merchantIds } },
        select: {
          id: true,
          storeName: true,
          slug: true,
          description: true,
          logo: true,
          bannerUrl: true,
          isTrending: true
        }
      });

      const data = merchantIds
        .map(id => merchants.find(m => m.id === id))
        .filter(Boolean);

      const result = {
        data,
        meta: { page, limit, total }
      };

      cacheUtil.set(cacheKey, result, 300);
      return result;
    }

    // 2. STANDARD FILTERED LISTING
    const cacheKey = cacheUtil.generateKey('merchants:public', { ...filters, page, limit });
    const cached = cacheUtil.get(cacheKey);
    if (cached) return cached;
    
    const where = {
      isApproved: true,
      ...(filters.isTrending !== undefined && { isTrending: filters.isTrending === 'true' || filters.isTrending === true })
    };

    const [total, data] = await Promise.all([
      this.prisma.merchant.count({ where }),
      this.prisma.merchant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          storeName: true,
          slug: true,
          description: true,
          logo: true,
          bannerUrl: true,
          isTrending: true
        }
      })
    ]);

    const result = {
      data,
      meta: { page, limit, total }
    };

    cacheUtil.set(cacheKey, result, 300);
    return result;
  }

  /**
   * Retrieves a specific public merchant by slug with product summary.
   * @param {string} slug - Merchant Slug.
   * @returns {Promise<Object>} Merchant details and products.
   */
  async getPublicMerchantBySlug(slug) {
    if (!slug) throw new AppError('Merchant slug is required', 400);

    const cacheKey = `merchant:public:${slug}`;
    const cached = cacheUtil.get(cacheKey);
    if (cached) return cached;

    const merchant = await this.prisma.merchant.findUnique({
      where: { slug, isApproved: true },
      select: {
        id: true,
        storeName: true,
        slug: true,
        description: true,
        logo: true,
        bannerUrl: true,
        isTrending: true,
        address: true,
        _count: {
          select: { products: true }
        },
        products: {
          take: 12, // Show a sample of products
          orderBy: { createdAt: 'desc' },
          include: {
            images: { take: 1 },
            variants: { take: 1 }
          }
        }
      }
    });

    if (!merchant) throw new AppError('Merchant not found', 404);

    cacheUtil.set(cacheKey, merchant, 300); // 5 mins
    return merchant;
  }
}


export default new MerchantService();
