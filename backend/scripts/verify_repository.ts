import getPrisma from '../src/infrastructure/database/prisma.js';
import { PrismaProductRepository } from '../src/modules/products/repositories/prisma.product.repository';

const prisma = getPrisma();
const repository = new PrismaProductRepository();

async function main() {
  console.log('--- Verifying PrismaProductRepository (TypeScript) ---');

  try {
    // 1. Setup minimal data
    const user = await prisma.user.create({
      data: {
        email: `ts-repo-test-${Date.now()}@example.com`,
        role: 'MERCHANT'
      }
    });

    const merchant = await prisma.merchant.create({
      data: {
        storeName: 'TS Repo Test Store',
        userId: user.id,
        status: 'APPROVED'
      }
    });

    const category = await prisma.category.create({
      data: {
        name: `TS Repo Cat ${Date.now()}`,
        slug: `ts-repo-cat-${Date.now()}`
      }
    });

    // 2. Test Create
    console.log('Testing createProduct...');
    const product = await repository.createProduct({
      name: 'TS Managed Product',
      description: 'Built via repository',
      categoryId: category.id,
      variants: [
        { sku: `SKU-TS-${Date.now()}`, price: 50.5, stock: 20, size: 'L', color: 'White' }
      ],
      images: [
        { url: 'https://cdn.example.com/p1.jpg', order: 1 }
      ]
    }, merchant.id);

    console.log('✅ Product created with ID:', product.id);
    console.log('Variants count:', product.variants.length);

    // 3. Test Paginated Retrieval
    console.log('Testing findProductsByMerchant...');
    const result = await repository.findProductsByMerchant(merchant.id, { page: 1, limit: 10 });
    console.log('✅ Pagination result count:', result.data.length);
    console.log('Meta:', result.meta);

    // 4. Test Search
    console.log('Testing searchProducts...');
    const searchResult = await repository.searchProducts({ query: 'Managed' }, { page: 1, limit: 10 });
    console.log('✅ Search results found:', searchResult.data.length);

    // 5. Cleanup
    await prisma.product.delete({ where: { id: product.id } });
    console.log('✅ Cleanup successful.');

  } catch (error) {
    console.error('❌ Verification Failed:', error);
  } finally {
    process.exit();
  }
}

main();
