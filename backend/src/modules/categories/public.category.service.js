import { cacheUtil } from '../../common/utils/cache.js';
import getPrisma from '../../infrastructure/database/prisma.js';

const CACHE_KEY = 'public:categories:list';
const CACHE_TTL = 600; // 10 minutes

export class PublicCategoryService {
  /**
   * Retrieves active categories with product counts.
   * Uses in-memory caching.
   */
  async getPublicCategories() {
    const prisma = getPrisma();
    // 1. Try to get from cache
    const cachedData = cacheUtil.get(CACHE_KEY);
    if (cachedData) {
      return cachedData;
    }

    // 2. Fetch from database
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        displayOrder: true,
        _count: {
          select: { products: true }
        }
      },
      orderBy: { displayOrder: 'asc' }
    });

    // 3. Transform data (flatten count)
    const result = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      imageUrl: cat.imageUrl,
      displayOrder: cat.displayOrder,
      productCount: cat._count.products
    }));

    // 4. Update cache
    cacheUtil.set(CACHE_KEY, result, CACHE_TTL);

    return result;
  }
}
