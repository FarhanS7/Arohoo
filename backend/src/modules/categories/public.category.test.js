import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// Define mocks
const mockPrisma = {
  category: {
    findMany: jest.fn(),
  },
};

const mockCache = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
};

// Mock modules
jest.unstable_mockModule('../../common/utils/cache.js', () => ({
  cacheUtil: mockCache,
}));

jest.unstable_mockModule('../../infrastructure/database/prisma.js', () => ({
  __esModule: true,
  default: () => mockPrisma,
}));

// Dynamic imports
const { PublicCategoryService } = await import('./public.category.service.js');

describe('PublicCategoryService (In-Memory)', () => {
  let publicCategoryService;

  beforeEach(() => {
    jest.clearAllMocks();
    publicCategoryService = new PublicCategoryService();
  });

  test('should return cached data if available', async () => {
    const mockCachedData = [{ id: '1', name: 'Shoes', productCount: 5 }];
    mockCache.get.mockReturnValue(mockCachedData);

    const result = await publicCategoryService.getPublicCategories();

    expect(mockCache.get).toHaveBeenCalledWith('public:categories:list');
    expect(mockPrisma.category.findMany).not.toHaveBeenCalled();
    expect(result).toEqual(mockCachedData);
  });

  test('should fetch from database and cache result if not in cache', async () => {
    mockCache.get.mockReturnValue(null);
    const mockDbData = [
      {
        id: '1',
        name: 'Shoes',
        slug: 'shoes',
        imageUrl: 'url',
        displayOrder: 1,
        _count: { products: 5 }
      }
    ];
    mockPrisma.category.findMany.mockResolvedValue(mockDbData);

    const result = await publicCategoryService.getPublicCategories();

    expect(mockPrisma.category.findMany).toHaveBeenCalled();
    expect(mockCache.set).toHaveBeenCalledWith(
      'public:categories:list',
      expect.any(Array),
      600
    );
    expect(result[0].productCount).toBe(5);
  });

  test('should filter only active categories', async () => {
    mockCache.get.mockReturnValue(null);
    mockPrisma.category.findMany.mockResolvedValue([]);

    await publicCategoryService.getPublicCategories();

    expect(mockPrisma.category.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isActive: true }
      })
    );
  });
});
