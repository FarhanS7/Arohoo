import getPrisma from '../src/infrastructure/database/prisma.js';
import { ProductService } from '../src/modules/products/product.service.js';

const prisma = getPrisma();
const productService = new ProductService();

async function main() {
  console.log('--- Verifying Product Creation (Aggregate Root) ---');

  try {
    // 1. Get or create a merchant
    let merchant = await prisma.merchant.findFirst({
      where: { status: 'APPROVED' }
    });

    if (!merchant) {
      console.log('--- Creating Test Merchant ---');
      const user = await prisma.user.create({
        data: {
          email: `test-merchant-${Date.now()}@example.com`,
          role: 'MERCHANT'
        }
      });
      merchant = await prisma.merchant.create({
        data: {
          storeName: 'Test Store',
          status: 'APPROVED',
          isApproved: true,
          userId: user.id
        }
      });
    }

    // 2. Get or create a category
    let category = await prisma.category.findFirst({
      where: { isActive: true }
    });

    if (!category) {
      console.log('--- Creating Test Category ---');
      category = await prisma.category.create({
        data: {
          name: 'Test Category',
          slug: `test-cat-${Date.now()}`
        }
      });
    }

    console.log(`Using Merchant: ${merchant.storeName} (${merchant.id})`);
    console.log(`Using Category: ${category.name} (${category.id})`);

    // 3. Create Product with Variants
    const productData = {
      name: `Test T-Shirt ${Date.now()}`,
      description: 'A premium verification t-shirt',
      categoryId: category.id,
      basePrice: 25.0,
      variants: [
        {
          price: 25.0,
          attributes: {
            size: 'M',
            color: 'Blue'
          }
        },
        {
          price: 27.5,
          attributes: {
            size: 'L',
            color: 'Blue'
          }
        }
      ]
    };

    const newProduct = await productService.createProduct(productData, merchant.id);

    console.log('✅ Product Created successfully!');
    console.log('Product ID:', newProduct.id);
    console.log('Variants Count:', newProduct.variants.length);
    
    newProduct.variants.forEach((v, i) => {
      console.log(`Variant ${i + 1}: Price=${v.price}, Attributes=`, v.attributes.map(a => `${a.name}:${a.value}`).join(', '));
    });

    // 4. Verify in DB
    const dbProduct = await prisma.product.findUnique({
      where: { id: newProduct.id },
      include: {
        variants: {
          include: { attributes: true }
        }
      }
    });

    if (dbProduct && dbProduct.variants.length === 2) {
      console.log('✅ DB Verification Passed!');
    } else {
      console.log('❌ DB Verification Failed!');
    }

  } catch (error) {
    console.error('❌ Verification Error:', error);
  } finally {
    process.exit();
  }
}

main();
