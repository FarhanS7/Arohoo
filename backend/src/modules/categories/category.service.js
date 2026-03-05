import { AppError } from '../../common/errors/AppError.js';
import { cacheUtil } from '../../common/utils/cache.js';
import prisma from '../../infrastructure/database/prisma.js';

export class CategoryService {
  /**
   * Creates a new category.
   * @param {Object} data - Category data including name, slug, etc.
   * @param {Object} user - Authenticated user info.
   */
  async createCategory(data, user) {
    const { name, slug, imageUrl, displayOrder, isActive } = data;

    // 1. Check if slug exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      throw new AppError('Category with this slug already exists', 409);
    }

    // 2. Prepare data (attach merchantId if merchant)
    const categoryData = {
      name,
      slug,
      imageUrl,
      displayOrder,
      isActive,
    };

    if (user.role === 'MERCHANT') {
      categoryData.merchantId = user.merchantId;
    }

    // 3. Create
    return await prisma.category.create({
      data: categoryData,
    });
  }

  /**
   * Retrieves all active/visible categories.
   */
  async getCategories() {
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  /**
   * Retrieves a single category by ID.
   */
  async getCategoryById(id) {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  }

  /**
   * Updates a category.
   * Enforces ownership for merchants.
   */
  async updateCategory(id, data, user) {
    const category = await this.getCategoryById(id);

    // Ownership check for Merchants
    if (user.role === 'MERCHANT' && category.merchantId !== user.merchantId) {
      throw new AppError('Forbidden: You do not own this category', 403);
    }

    // Slug conflict check if slug is being updated
    if (data.slug && data.slug !== category.slug) {
      const existing = await prisma.category.findUnique({
        where: { slug: data.slug },
      });
      if (existing) {
        throw new AppError('Category with this slug already exists', 409);
      }
    }

    return await prisma.category.update({
      where: { id },
      data,
    });
  }

  /**
   * Deletes a category.
   * Enforces ownership for merchants.
   */
  async deleteCategory(id, user) {
    const category = await this.getCategoryById(id);

    // Ownership check
    if (user.role === 'MERCHANT' && category.merchantId !== user.merchantId) {
      throw new AppError('Forbidden: You do not own this category', 403);
    }

    return await prisma.category.delete({
      where: { id },
    });
  }

  /**
   * Retrieves public category list with product counts.
   * Uses caching for performance.
   */
  async getPublicCategories() {
    const cacheKey = 'public_categories';
    const cachedData = cacheUtil.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        displayOrder: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });

    // Map to flatten product count
    const result = categories.map((cat) => ({
      ...cat,
      productCount: cat._count.products,
      _count: undefined,
    }));

    cacheUtil.set(cacheKey, result);
    return result;
  }
}
