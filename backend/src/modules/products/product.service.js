import prisma from '../../infrastructure/database/prisma.js';
import { PrismaProductRepository } from './repositories/prisma.product.repository.js';
import { cacheUtil } from '../../common/utils/cache.js';

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

    const { name, categoryId, basePrice = 0, variants } = data;

    if (!name || name.trim() === '') throw new AppError('Product name is required');
    if (basePrice < 0) throw new AppError('Base price cannot be negative');
    if (!categoryId) throw new AppError('Category ID is required');

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new AppError('Invalid category', 400);

    if (variants && variants.length > 0) {
      const signatures = new Set();
      data.variants = variants.map(v => {
        // If variant price is missing or 0, use the base price
        const finalPrice = v.price !== undefined && v.price !== null ? v.price : basePrice;
        if (finalPrice < 0) throw new AppError('Variant price cannot be negative');
        if (v.stock !== undefined && v.stock < 0) throw new AppError('Stock cannot be negative');
        
        const sizeVal = v.size || '';
        const colorVal = v.color || '';
        
        const sig = JSON.stringify({ size: sizeVal, color: colorVal });
        if (signatures.has(sig)) throw new AppError('Duplicate variant detected (same size and color)');
        signatures.add(sig);

        return {
          ...v,
          price: finalPrice,
          sku: v.sku || `SKU-${Date.now()}-${Math.floor(Math.random() * 10000)}`
        };
      });
    }

    try {
      const product = await this.repository.createProduct(data, merchantId);
      // Invalidate search results
      cacheUtil.delByPrefix('products:search');
      return product;
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
      const updated = await this.repository.updateProduct(id, merchantId, data);
      
      // Invalidate caches
      cacheUtil.delete(`product:detail:${id}`);
      cacheUtil.delByPrefix('products:search');
      
      return updated;
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
    
    // Invalidate caches
    cacheUtil.delete(`product:detail:${id}`);
    cacheUtil.delByPrefix('products:search');
    
    return true;
  }

  async getProductById(id, merchantId) {
    const start = performance.now();
    const cacheKey = `product:detail:${id}`;
    
    // Only use cache for public views (no merchantId restriction check needed)
    const cached = cacheUtil.get(cacheKey);
    if (cached && (!merchantId || cached.merchantId === merchantId)) {
      const duration = performance.now() - start;
      console.log(`[PERF:BACKEND] getProductById Service (ID: ${id}) - CACHE HIT - Duration: ${duration.toFixed(2)}ms`);
      return cached;
    }

    const repoStart = performance.now();
    const product = await this.repository.findProductById(id);
    const repoEnd = performance.now();
    
    if (!product) throw new AppError('Product not found', 404);
    if (merchantId && product.merchantId !== merchantId) throw new AppError('Unauthorized', 403);
    
    cacheUtil.set(cacheKey, product, 600); // 10 mins
    
    const totalDuration = performance.now() - start;
    console.log(`[PERF:BACKEND] getProductById Service (ID: ${id}) - CACHE MISS - Total: ${totalDuration.toFixed(2)}ms, Repo: ${(repoEnd - repoStart).toFixed(2)}ms`);
    
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
    const result = await this.repository.addProductImages(productId, images);

    // 4. Invalidate specific product detail cache to prevent "placeholder-only" stale views
    cacheUtil.delete(`product:detail:${productId}`);
    cacheUtil.delByPrefix('products:search'); // Also invalidate search results for catalog uniformity

    return result;
  }

  async getPublicProducts(filters, page = 1, limit = 20) {
    return await this.repository.searchProducts(filters, { page, limit });
  }

  async getTrendingProducts(limit = 4) {
    return await this.repository.findTrendingProducts(limit);
  }

  async getVariantById(id) {
    const variant = await this.repository.findVariantById(id);
    if (!variant) throw new AppError('Product variant not found', 404);
    return variant;
  }
}
