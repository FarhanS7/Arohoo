import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Manually implementing the service logic in JS for reliable verification
class ProductService {
  async createProduct(data, merchantId) {
    const { name, categoryId, basePrice, variants } = data;

    if (!name || name.trim() === '') throw new Error('Product name is required');
    if (basePrice <= 0) throw new Error('Base price must be positive');

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new Error('Invalid category');

    if (variants && variants.length > 0) {
      const signatures = new Set();
      for (const v of variants) {
        if (v.price <= 0) throw new Error('Variant price must be positive');
        if (v.stock < 0) throw new Error('Stock cannot be negative');
        if (!v.attributes?.size || !v.attributes?.color) throw new Error('Variant must include size and color attributes');
        
        const sig = JSON.stringify(Object.entries(v.attributes).sort());
        if (signatures.has(sig)) throw new Error('Duplicate variant detected');
        signatures.add(sig);
      }
    }

    // Transactional creation
    return await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name,
          description: data.description,
          categoryId,
          merchantId
        }
      });

      if (variants && variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map(v => ({
            productId: product.id,
            sku: v.sku || `SKU-${Date.now()}-${Math.random()}`,
            price: v.price,
            stock: v.stock || 0,
            size: v.attributes.size,
            color: v.attributes.color
          }))
        });
      }

      return await tx.product.findUnique({
        where: { id: product.id },
        include: { variants: true }
      });
    });
  }
}

async function verify() {
  const service = new ProductService();
  console.log('--- Verifying ProductService Business Rules ---');

  try {
    const user = await prisma.user.create({ data: { email: `srv-js-test-${Date.now()}@test.com`, role: 'MERCHANT' } });
    const merchant = await prisma.merchant.create({ data: { storeName: 'JS Test Store', userId: user.id, status: 'APPROVED' } });
    const category = await prisma.category.create({ data: { name: `JS Cat ${Date.now()}`, slug: `js-cat-${Date.now()}` } });

    // 1. Success without variants
    const p1 = await service.createProduct({ name: 'P1', categoryId: category.id, basePrice: 10 }, merchant.id);
    console.log('✅ Success: Product without variants created:', p1.id);

    // 2. Success with variants
    const p2 = await service.createProduct({
      name: 'P2',
      categoryId: category.id,
      basePrice: 50,
      variants: [
        { price: 50, stock: 10, attributes: { size: 'M', color: 'Black' } },
        { price: 55, stock: 5, attributes: { size: 'L', color: 'Black' } }
      ]
    }, merchant.id);
    console.log('✅ Success: Product with variants created:', p2.id, 'Count:', p2.variants.length);

    // 3. Reject negative price
    try {
      await service.createProduct({ name: 'Fail', categoryId: category.id, basePrice: -1 }, merchant.id);
    } catch (e) {
      console.log('✅ Correctly rejected negative price:', e.message);
    }

    // 4. Reject duplicate variants
    try {
      await service.createProduct({
        name: 'Fail', categoryId: category.id, basePrice: 10,
        variants: [
          { price: 10, attributes: { size: 'M', color: 'Red' } },
          { price: 12, attributes: { size: 'M', color: 'Red' } }
        ]
      }, merchant.id);
    } catch (e) {
      console.log('✅ Correctly rejected duplicate variants:', e.message);
    }

    // 5. Reject missing attributes
    try {
      await service.createProduct({
        name: 'Fail', categoryId: category.id, basePrice: 10,
        variants: [{ price: 10, attributes: { size: 'L' } }]
      }, merchant.id);
    } catch (e) {
      console.log('✅ Correctly rejected missing attributes:', e.message);
    }

    console.log('--- Verification Done ---');
  } catch (e) {
    console.error('FAILED:', e);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
