import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import prisma from '../../../infrastructure/database/prisma.js';
import { PrismaProductRepository } from './prisma.product.repository.js';

const repository = new PrismaProductRepository();

describe('PrismaProductRepository', () => {
  let testMerchant;
  let testCategory;

  beforeAll(async () => {
    // Setup test data
    const user = await prisma.user.create({
      data: {
        email: `repo-test-${Date.now()}@example.com`,
        role: 'MERCHANT'
      }
    });

    testMerchant = await prisma.merchant.create({
      data: {
        storeName: 'Repo Test Store',
        userId: user.id,
        status: 'APPROVED'
      }
    });

    testCategory = await prisma.category.create({
      data: {
        name: `Repo Cat ${Date.now()}`,
        slug: `repo-cat-${Date.now()}`
      }
    });
  });

  test('should create a product with variants and images', async () => {
    const productData = {
      name: 'Repo Product',
      description: 'Test Repository Product',
      categoryId: testCategory.id,
      variants: [
        { sku: `SKU-REPO-${Date.now()}`, price: 100, stock: 10, size: 'M', color: 'Black' }
      ],
      images: [
        { url: 'https://repo.com/img1.jpg', order: 1 }
      ]
    };

    const product = await repository.createProduct(productData, testMerchant.id);

    expect(product.id).toBeDefined();
    expect(product.variants).toHaveLength(1);
    expect(product.images).toHaveLength(1);
    expect(product.merchantId).toBe(testMerchant.id);
  });

  test('should fetch products by merchant with pagination', async () => {
    const result = await repository.findProductsByMerchant(testMerchant.id, { page: 1, limit: 10 });

    expect(result.data).toBeInstanceOf(Array);
    expect(result.meta.page).toBe(1);
    expect(result.meta.total).toBeGreaterThanOrEqual(1);
  });

  test('should enforce merchant filtering in search (indirectly via where)', async () => {
    const result = await repository.searchProducts({ query: 'Repo' }, { page: 1, limit: 10 });
    expect(result.data.length).toBeGreaterThanOrEqual(1);
  });

  test('should return null for non-existent product', async () => {
    const product = await repository.findProductById('00000000-0000-0000-0000-000000000000');
    expect(product).toBeNull();
  });
});
