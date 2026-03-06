import { PrismaClient } from '@prisma/client';
import getPrisma from '../../infrastructure/database/prisma.js';
import { ProductService } from './product.service.js';

const prisma = getPrisma() as PrismaClient;
const productService = new ProductService();

async function main() {
  console.log('[DEBUG] Starting setup...');

  let merchantId = '';
  let categoryId = '';

  try {
    console.log('[DEBUG] Creating User...');
    const userEmail = `srv-test-${Date.now()}@example.com`;
    const user = await prisma.user.create({
      data: { email: userEmail, role: 'MERCHANT' }
    });
    console.log('[DEBUG] User Created:', user.id);

    console.log('[DEBUG] Creating Merchant...');
    const merchant = await prisma.merchant.create({
      data: { storeName: 'Service Test Store', userId: user.id, status: 'APPROVED' }
    });
    merchantId = merchant.id;
    console.log('[DEBUG] Merchant Created:', merchant.id);

    console.log('[DEBUG] Creating Category...');
    const catName = `Srv Cat ${Date.now()}`;
    const catSlug = `srv-cat-${Date.now()}`;
    const category = await prisma.category.create({
      data: { name: catName, slug: catSlug }
    });
    categoryId = category.id;
    console.log('[DEBUG] Category Created:', category.id);

    // If we reached here, setup is good
    console.log('--- Setup Successful ---');

    console.log('[DEBUG] Calling ProductService.createProduct...');
    const p1 = await productService.createProduct({
      name: 'No Variant Product',
      categoryId: categoryId,
      basePrice: 10
    }, merchantId);
    console.log('[DEBUG] Product created:', p1.id);

    console.log('--- Verification Complete ---');

  } catch (error: any) {
    console.log('[DEBUG] ERROR CAUGHT');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    if (error.code) console.error('Error Code:', error.code);
    if (error.stack) console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

main();
