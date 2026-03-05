import { beforeAll, describe, expect, test } from '@jest/globals';
import getPrisma from '../../infrastructure/database/prisma.js';

const prisma = getPrisma();

describe('Product Schema Verification', () => {
  let testMerchant;
  let testCategory;

  beforeAll(async () => {
    // Setup: Create a merchant and category for FK testing
    const user = await prisma.user.create({
      data: {
        email: `schema-test-${Date.now()}@example.com`,
        role: 'MERCHANT'
      }
    });

    testMerchant = await prisma.merchant.create({
      data: {
        storeName: 'Schema Test Store',
        userId: user.id,
        status: 'APPROVED'
      }
    });

    testCategory = await prisma.category.create({
      data: {
        name: `Test Cat ${Date.now()}`,
        slug: `test-cat-${Date.now()}`
      }
    });
  });

  test('should create a valid product', async () => {
    const product = await prisma.product.create({
      data: {
        name: 'Cotton T-Shirt',
        description: 'Soft cotton t-shirt',
        merchantId: testMerchant.id,
        categoryId: testCategory.id
      }
    });

    expect(product.id).toBeDefined();
    expect(product.name).toBe('Cotton T-Shirt');
    expect(product.merchantId).toBe(testMerchant.id);
    expect(product.categoryId).toBe(testCategory.id);
  });

  test('should fail if name is missing', async () => {
    await expect(
      prisma.product.create({
        data: {
          description: 'No name',
          merchantId: testMerchant.id,
          categoryId: testCategory.id
        }
      })
    ).rejects.toThrow();
  });

  test('should enforce merchant foreign key', async () => {
    await expect(
      prisma.product.create({
        data: {
          name: 'Invalid Merchant',
          merchantId: 'non-existent-uuid',
          categoryId: testCategory.id
        }
      })
    ).rejects.toThrow();
  });

  test('should enforce category foreign key', async () => {
    await expect(
      prisma.product.create({
        data: {
          name: 'Invalid Category',
          merchantId: testMerchant.id,
          categoryId: 'non-existent-uuid'
        }
      })
    ).rejects.toThrow();
  });

  test('should cascade delete to variants', async () => {
    const product = await prisma.product.create({
      data: {
        name: 'Cascade Test',
        merchantId: testMerchant.id,
        categoryId: testCategory.id,
        variants: {
          create: {
            price: 10.0
          }
        }
      }
    });

    // Delete product
    await prisma.product.delete({ where: { id: product.id } });

    // Check if variant is gone
    const variant = await prisma.productVariant.findFirst({
      where: { productId: product.id }
    });
    expect(variant).toBeNull();
  });
});
