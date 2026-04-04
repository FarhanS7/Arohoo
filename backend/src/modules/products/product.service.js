import prisma from '../../infrastructure/database/prisma.js';
import { PrismaProductRepository } from './repositories/prisma.product.repository.js';

export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ProductService {
  constructor(repository) {
    this.repository = repository || new PrismaProductRepository();
  }

  async createProduct(data, merchantId) {
    if (!merchantId) throw new AppError('Only registered merchants can create products', 403);

    const { name, categoryId, basePrice, variants } = data;

    if (!name || name.trim() === '') throw new AppError('Product name is required');
    if (basePrice <= 0) throw new AppError('Base price must be positive');
    if (!categoryId) throw new AppError('Category ID is required');

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new AppError('Invalid category', 400);

    if (variants && variants.length > 0) {
      const signatures = new Set();
      data.variants = variants.map(v => {
        if (v.price <= 0) throw new AppError('Variant price must be positive');
        if (v.stock !== undefined && v.stock < 0) throw new AppError('Stock cannot be negative');
        if (!v.size || !v.color) throw new AppError('Variant must include size and color');

        const sig = JSON.stringify({ size: v.size, color: v.color });
        if (signatures.has(sig)) throw new AppError('Duplicate variant detected');
        signatures.add(sig);

        return {
          ...v,
          sku: v.sku || `SKU-${Date.now()}-${Math.floor(Math.random() * 10000)}`
        };
      });
    }

    try {
      return await this.repository.createProduct(data, merchantId);
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('sku')) {
        throw new AppError('SKU already exists', 409);
      }
      throw error;
    }
  }

  async updateProduct(id, merchantId, data) {
    const existing = await this.repository.findProductById(id);
    if (!existing) throw new AppError('Product not found', 404);
    if (existing.merchantId !== merchantId) throw new AppError('Unauthorized access to product', 403);

    if (data.categoryId) {
      const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
      if (!category) throw new AppError('Invalid category');
    }

    try {
      return await this.repository.updateProduct(id, merchantId, data);
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('sku')) {
        throw new AppError('SKU conflict in update', 409);
      }
      throw error;
    }
  }

  async deleteProduct(id, merchantId) {
    const existing = await this.repository.findProductById(id);
    if (!existing) throw new AppError('Product not found', 404);
    if (existing.merchantId !== merchantId) throw new AppError('Unauthorized access', 403);

    await this.repository.deleteProduct(id, merchantId);
    return true;
  }

  async getProductById(id, merchantId) {
    const product = await this.repository.findProductById(id);
    if (!product) throw new AppError('Product not found', 404);
    if (merchantId && product.merchantId !== merchantId) throw new AppError('Unauthorized', 403);
    return product;
  }

  async getMerchantProducts(merchantId, page = 1, limit = 20) {
    return await this.repository.findProductsByMerchant(merchantId, { page, limit });
  }

  async uploadProductImages(productId, merchantId, images) {
    // 1. Verify ownership
    const product = await this.getProductById(productId, merchantId);
    if (!product) throw new AppError('Product not found', 404);

    // 2. Check total images limit (5)
    const existingCount = product.images.length;
    if (existingCount + images.length > 5) {
      throw new AppError('Maximum 5 images allowed per product', 400);
    }

    // 3. Save images
    return await this.repository.addProductImages(productId, images);
  }

  async getPublicProducts(filters, page = 1, limit = 20) {
    return await this.repository.searchProducts(filters, { page, limit });
  }

  async getVariantById(id) {
    const variant = await this.repository.findVariantById(id);
    if (!variant) throw new AppError('Product variant not found', 404);
    return variant;
  }
}
