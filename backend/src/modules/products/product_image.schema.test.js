import { beforeAll, describe, expect, test } from '@jest/globals';
import getPrisma from '../../infrastructure/database/prisma.js';

const prisma = getPrisma();

describe('ProductImage Schema Verification', () => {
  let testProduct;

  beforeAll(async () => {
    // Setup: Create a merchant, category, and product
    const user = await prisma.user.create({
      data: {
        email: `image-test-${Date.now()}@example.com`,
        role: 'MERCHANT'
      }
    });

    const merchant = await prisma.merchant.create({
      data: {
        storeName: 'Image Test Store',
        userId: user.id,
        status: 'APPROVED'
      }
    });

    const category = await prisma.category.create({
      data: {
        name: `Img Cat ${Date.now()}`,
        slug: `img-cat-${Date.now()}`
      }
    });

    testProduct = await prisma.product.create({
      data: {
        name: 'Image Base Product',
        merchantId: merchant.id,
        categoryId: category.id
      }
    });
  });

  test('should add an image to a product', async () => {
    const image = await prisma.productImage.create({
      data: {
        productId: testProduct.id,
        url: 'https://cdn.arohhoo.com/products/img1.jpg',
        order: 1
      }
    });

    expect(image.id).toBeDefined();
    expect(image.order).toBe(1);
    expect(image.productId).toBe(testProduct.id);
  });

  test('should preserve image ordering', async () => {
    await prisma.productImage.createMany({
      data: [
        { productId: testProduct.id, url: 'img3.jpg', order: 3 },
        { productId: testProduct.id, url: 'img2.jpg', order: 2 }
      ]
    });

    const images = await prisma.productImage.findMany({
      where: { productId: testProduct.id },
      orderBy: { order: 'asc' }
    });

    expect(images[0].order).toBe(1); // from previous test
    expect(images[1].order).toBe(2);
    expect(images[2].order).toBe(3);
  });

  test('should cascade delete images when product is deleted', async () => {
    const localProduct = await prisma.product.create({
      data: {
        name: 'Delete Me',
        merchantId: testProduct.merchantId,
        categoryId: testProduct.categoryId,
        images: {
          create: { url: 'temp.jpg', order: 1 }
        }
      }
    });

    await prisma.product.delete({ where: { id: localProduct.id } });

    const image = await prisma.productImage.findFirst({
      where: { productId: localProduct.id }
    });
    expect(image).toBeNull();
  });

  /**
   * Note: The "max 5 images" rule is a business constraint enforced in the service layer.
   * Here we verify the schema permits multiple images which is a prerequisite.
   */
  test('should allow multiple images (business limit 5 enforced in service)', async () => {
    const imagesCount = await prisma.productImage.count({
      where: { productId: testProduct.id }
    });
    expect(imagesCount).toBeGreaterThan(1);
  });
});
