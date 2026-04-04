import { getPagination } from '../../../common/types/pagination.types.js';
import prisma from '../../../infrastructure/database/prisma.js';

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
      include: this.includeDetails
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

  async searchProducts({ query, categoryId, minPrice, maxPrice, variants, isTrending }, { page, limit }) {
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

    const [total, data] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take,
        include: this.includeDetails,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return { data, meta: { ...meta, total } };
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
    const created = await Promise.all(
      images.map(img => 
        prisma.productImage.create({
          data: {
            ...img,
            productId
          }
        })
      )
    );
    return created;
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
