import { getPagination } from '../../../common/types/pagination.types.js';
import prisma from '../../../infrastructure/database/prisma.js';
import { cacheUtil } from '../../../common/utils/cache.js';

export class PrismaProductRepository {
  /**
   * Helper to include full details in queries
   */
  get includeDetails() {
    return {
      variants: true,
      merchant: true,
      images: {
        orderBy: { order: 'asc' }
      }
    };
  }

  /**
   * Lighter include for list views to reduce payload size
   */
  get summaryInclude() {
    return {
      images: {
        take: 1,
        orderBy: { order: 'asc' },
        select: { 
          id: true, 
          url: true, 
          order: true 
        }
      },
      merchant: {
        select: {
          id: true,
          storeName: true,
          logo: true
        }
      },
      variants: {
        take: 1,
        select: {
          id: true,
          sku: true,
          price: true,
          stock: true,
          size: true,
          color: true
        }
      }
    };
  }

  /**
   * Selection object for listing views to prevent over-fetching
   */
  get summarySelect() {
    return {
      id: true,
      name: true,
      basePrice: true,
      categoryId: true,
      description: true, // Needed for the 'essential' line clamp in UI
      isTrending: true,
      createdAt: true,
      ...this.summaryInclude
    };
  }

  /**
   * Selection object for full product details
   */
  get detailSelect() {
    return {
      id: true,
      name: true,
      description: true,
      basePrice: true,
      categoryId: true,
      merchantId: true,
      isTrending: true,
      createdAt: true,
      updatedAt: true,
      images: {
        orderBy: { order: 'asc' },
        select: { id: true, url: true, order: true }
      },
      variants: {
        select: { id: true, sku: true, size: true, color: true, price: true, stock: true }
      },
      merchant: {
        select: { id: true, storeName: true, logo: true, description: true, bannerUrl: true }
      }
    };
  }

  /**
   * Create product with nested variants and images
   */
  async createProduct(data, merchantId) {
    const { variants, images, ...rest } = data;

    return await prisma.product.create({
      data: {
        ...rest,
        merchantId,
        variants: variants ? { create: variants } : undefined,
        images: images ? { create: images } : undefined,
      },
      include: this.includeDetails
    });
  }

  async findProductById(id) {
    return await prisma.product.findUnique({
      where: { id },
      select: this.detailSelect
    });
  }

  async findProductsByMerchant(merchantId, { page, limit }) {
    const { skip, take, meta } = getPagination(page, limit);

    const [total, data] = await Promise.all([
      prisma.product.count({ where: { merchantId } }),
      prisma.product.findMany({
        where: { merchantId },
        skip,
        take,
        include: this.includeDetails,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return { data, meta: { ...meta, total } };
  }

  async searchProducts({ query, categoryId, minPrice, maxPrice, variants, isTrending, cursor }, { page, limit }) {
    const { skip, take, meta } = getPagination(page, limit);

    const where = {
      ...(categoryId && { categoryId }),
      ...(isTrending !== undefined && { isTrending: isTrending === 'true' || isTrending === true }),
      ...(query && {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      }),
      // Ensure products have variants and apply variant-level filters
      variants: {
        some: {
          ...(minPrice !== undefined && { price: { gte: parseFloat(minPrice) } }),
          ...(maxPrice !== undefined && { price: { lte: parseFloat(maxPrice) } }),
          ...(variants?.size && { size: variants.size }),
          ...(variants?.color && { color: variants.color })
        }
      }
    };

    const cacheKey = cacheUtil.generateKey('products:search', { ...arguments[0], ...arguments[1] });
    const countCacheKey = cacheUtil.generateKey('products:count', { where });
    
    const cachedResult = cacheUtil.get(cacheKey);
    if (cachedResult) return cachedResult;

    // Optimization: Cursor-based pagination is more stable for large datasets
    const sort = arguments[0].sort || 'newest';
    let orderBy = { createdAt: 'desc' };
    
    if (sort === 'price_asc') {
      orderBy = { basePrice: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { basePrice: 'desc' };
    }

    // Optimization: Cursor-based pagination is more stable for large datasets
    const queryOptions = {
      where,
      take,
      select: this.summarySelect,
      orderBy
    };

    if (cursor) {
      queryOptions.cursor = { id: cursor };
      queryOptions.skip = 1; // Skip the item identified by the cursor
    } else {
      queryOptions.skip = skip;
    }

    // Try to get total count from cache
    let total = cacheUtil.get(countCacheKey);
    let data;

    if (total !== null && total !== undefined) {
      data = await prisma.product.findMany(queryOptions);
    } else {
      [total, data] = await Promise.all([
        prisma.product.count({ where }),
        prisma.product.findMany(queryOptions)
      ]);
      // Cache total count for 5 minutes (reduced DB load for repeat filter queries)
      cacheUtil.set(countCacheKey, total, 300);
    }

    const nextCursor = data.length === take ? data[data.length - 1].id : null;

    const result = { 
      data, 
      meta: { 
        ...meta, 
        total,
        nextCursor 
      } 
    };

    cacheUtil.set(cacheKey, result, 300); // 5 mins
    return result;
  }

  async updateProduct(id, merchantId, data) {
    const { variants, images, ...rest } = data;

    return await prisma.product.update({
      where: { id },
      data: rest,
      include: this.includeDetails
    });
  }

  async deleteProduct(id, merchantId) {
    await prisma.product.delete({
      where: { id }
    });
    return true;
  }

  async addProductImages(productId, images) {
    const data = images.map(img => ({
      ...img,
      productId
    }));

    const result = await prisma.productImage.createMany({
      data
    });

    return result;
  }

  async findVariantById(id) {
    return await prisma.productVariant.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: {
              take: 1,
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });
  }
}
