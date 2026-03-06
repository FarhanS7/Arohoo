import getPrisma from '../src/infrastructure/database/prisma.js';

const prisma = getPrisma();

async function main() {
  console.log('--- Verifying Product System Migration (Safe) ---');

  try {
    // 1. Check Table Connectivity & Schema via Count
    const productCount = await prisma.product.count();
    const variantCount = await prisma.productVariant.count();
    const imageCount = await prisma.productImage.count();
    
    console.log('✅ Connectivity confirmed.');
    console.log(`- Product count: ${productCount}`);
    console.log(`- Variant count: ${variantCount}`);
    console.log(`- Image count: ${imageCount}`);

    // 2. Cascade Insertion & Deletion Test
    console.log('--- Testing Cascade & FKs ---');
    const user = await prisma.user.create({ data: { email: `mig-test-${Date.now()}@example.com`, role: 'MERCHANT' } });
    const merchant = await prisma.merchant.create({ data: { storeName: 'Migration Test Store', userId: user.id, status: 'APPROVED' } });
    const category = await prisma.category.create({ data: { name: `Migration Cat ${Date.now()}`, slug: `mig-cat-${Date.now()}` } });

    const product = await prisma.product.create({
      data: {
        name: 'Migration Test Product',
        merchantId: merchant.id,
        categoryId: category.id,
        variants: { create: { sku: `SKU-PROD-${Date.now()}`, price: 19.99, stock: 10 } },
        images: { create: { url: 'https://test.com/image.jpg', order: 1 } }
      }
    });

    console.log(`✅ Product created with ID: ${product.id}`);

    // Verify relations exist
    const checkProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: { variants: true, images: true }
    });

    if (checkProduct.variants.length === 1 && checkProduct.images.length === 1) {
      console.log('✅ Foreign keys and relations confirmed.');
    } else {
      console.log('❌ Relations failed.');
    }

    // Test Cascade Delete
    await prisma.product.delete({ where: { id: product.id } });
    console.log('✅ Product deleted.');

    const variant = await prisma.productVariant.findFirst({ where: { productId: product.id } });
    const image = await prisma.productImage.findFirst({ where: { productId: product.id } });

    if (!variant && !image) {
      console.log('✅ Cascade delete verified (Variant & Image removed).');
    } else {
      console.log('❌ Cascade delete failed.');
    }

  } catch (error) {
    console.error('❌ Verification Error:', error);
  } finally {
    process.exit();
  }
}

main();
