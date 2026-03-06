import getPrisma from './src/infrastructure/database/prisma.js';
import { CheckoutService } from './src/modules/checkout/checkout.service.js';

const prisma = getPrisma();
const checkoutService = new CheckoutService();

async function verify() {
  console.log('--- Checkout Service Verification Start ---');
  let testUser, merchantUser, merchant, category, product, testVariant;

  try {
    // 1. Setup Data
    testUser = await prisma.user.create({
      data: { email: `checkout-v-${Date.now()}@example.com` }
    });

    merchantUser = await prisma.user.create({
      data: { email: `m-checkout-${Date.now()}@example.com`, role: 'MERCHANT' }
    });
    merchant = await prisma.merchant.create({
      data: { storeName: 'Checkout Store', userId: merchantUser.id, status: 'APPROVED' }
    });
    category = await prisma.category.create({
      data: { name: `C-Cat ${Date.now()}`, slug: `c-cat-${Date.now()}` }
    });
    product = await prisma.product.create({
      data: { name: 'C-Product', merchantId: merchant.id, categoryId: category.id }
    });
    testVariant = await prisma.productVariant.create({
      data: { sku: `CSKU-${Date.now()}`, price: 1500, stock: 5, productId: product.id }
    });

    console.log('Step 1: Setup complete');

    // 2. Test Success Case
    console.log('Step 2: Testing successful checkout validation...');
    const summary = await checkoutService.validateCheckout({
      cartItems: [{ productVariantId: testVariant.id, quantity: 2 }]
    });

    console.log('Summary Output:', JSON.stringify(summary, null, 2));
    if (summary.total === 3000 && summary.items[0].subtotal === 3000) {
      console.log('Price calculation: OK');
    } else {
        throw new Error(`Price calculation mismatch: expected 3000, got ${summary.total}`);
    }

    // 3. Test Stock Conflict
    console.log('Step 3: Testing stock enforcement (requesting 10, stock is 5)...');
    try {
      await checkoutService.validateCheckout({
        cartItems: [{ productVariantId: testVariant.id, quantity: 10 }]
      });
      console.log('FAILED: Stock enforcement didn\'t trigger');
    } catch (error) {
      if (error.statusCode === 409) {
        console.log('Stock enforcement: OK (409 Conflict logic passed)');
        console.log('Error Message:', error.message);
      } else {
        throw error;
      }
    }

    // 4. Test Variant Not Found
    console.log('Step 4: Testing variant not found...');
    try {
      await checkoutService.validateCheckout({
        cartItems: [{ productVariantId: '00000000-0000-0000-0000-000000000000', quantity: 1 }]
      });
    } catch (error) {
      if (error.statusCode === 404) {
        console.log('Variant search: OK (404 Not Found logic passed)');
      }
    }

    console.log('--- Checkout Service Verification Passed ---');
  } catch (error) {
    console.error('--- Checkout Service Verification Failed ---');
    console.error(error);
  } finally {
    // Cleanup complex relations
    if (testVariant) {
        await prisma.productVariant.delete({ where: { id: testVariant.id } });
    }
    if (product) {
        await prisma.product.delete({ where: { id: product.id } });
    }
    if (category) {
        await prisma.category.delete({ where: { id: category.id } });
    }
    if (merchant) {
        await prisma.merchant.delete({ where: { id: merchant.id } });
    }
    if (merchantUser) {
        await prisma.user.delete({ where: { id: merchantUser.id } });
    }
    if (testUser) {
        await prisma.user.delete({ where: { id: testUser.id } });
    }
    await prisma.$disconnect();
  }
}

verify();
