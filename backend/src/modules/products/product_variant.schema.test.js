import { beforeAll, describe, expect, test } from '@jest/globals';
import getPrisma from '../../infrastructure/database/prisma.js';

const prisma = getPrisma();

describe('ProductVariant Schema Verification', () => {
  let testProduct;

  beforeAll(async () => {
    // Setup: Create a merchant, category, and product for FK testing
    const user = await prisma.user.create({
      data: {
        email: `variant-test-${Date.now()}@example.com`,
        role: 'MERCHANT'
      }
    });

    const merchant = await prisma.merchant.create({
      data: {
        storeName: 'Variant Test Store',
        userId: user.id,
        status: 'APPROVED'
      }
    });

    const category = await prisma.category.create({
      data: {
        name: `Var Cat ${Date.now()}`,
        slug: `var-cat-${Date.now()}`
      }
    });

    testProduct = await prisma.product.create({
      data: {
        name: 'Base Product',
        merchantId: merchant.id,
        categoryId: category.id
      }
    });
  });

  test('should create a valid product variant', async () => {
    const sku = `SKU-${Date.now()}`;
    const variant = await prisma.productVariant.create({
      data: {
        productId: testProduct.id,
        sku: sku,
        size: 'M',
        color: 'Red',
        price: 25.0,
        stock: 100
      }
    });

    expect(variant.id).toBeDefined();
    expect(variant.sku).toBe(sku);
    expect(variant.stock).toBe(100);
  });

  test('should fail with duplicate SKU', async () => {
    const sku = 'DUPLICATE-SKU';
    await prisma.productVariant.create({
      data: {
        productId: testProduct.id,
        sku: sku,
        price: 10.0,
        stock: 5
      }
    });

    await expect(
      prisma.productVariant.create({
        data: {
          productId: testProduct.id,
          sku: sku,
          price: 20.0,
          stock: 10
        }
      })
    ).rejects.toThrow();
  });

  test('should fail if productId is invalid', async () => {
    await expect(
      prisma.productVariant.create({
        data: {
          productId: 'non-existent-uuid',
          sku: `SKU-INVALID-${Date.now()}`,
          price: 10.0,
          stock: 5
        }
      })
    ).rejects.toThrow();
  });

  test('should fail if price is missing', async () => {
    await expect(
      prisma.productVariant.create({
        data: {
          productId: testProduct.id,
          sku: `SKU-NOPRICE-${Date.now()}`,
          stock: 5
        }
      })
    ).rejects.toThrow();
  });
});
