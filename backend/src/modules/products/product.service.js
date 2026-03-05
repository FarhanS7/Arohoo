import { AppError } from '../../common/errors/AppError.js';
import getPrisma from '../../infrastructure/database/prisma.js';

const prisma = getPrisma();

export class ProductService {
  /**
   * Creates a new product with optional variants in a single transaction.
   * @param {Object} data - Product and variant data.
   * @param {string} merchantId - The owner merchant ID.
   */
  async createProduct(data, merchantId) {
    const { name, description, categoryId, basePrice, variants } = data;

    // 1. Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new AppError('Category not found', 400);
    }

    // 2. Prevent duplicate variants (simple check by serialized attributes)
    if (variants && variants.length > 0) {
      const variantSignatures = variants.map(v => 
        JSON.stringify(Object.entries(v.attributes).sort())
      );
      const uniqueSignatures = new Set(variantSignatures);
      if (uniqueSignatures.size !== variantSignatures.length) {
        throw new AppError('Duplicate variants detected', 400);
      }
    }

    // 3. Execute Transaction
    return await prisma.$transaction(async (tx) => {
      // Create Base Product
      const product = await tx.product.create({
        data: {
          name,
          description,
          basePrice,
          categoryId,
          merchantId,
          status: 'active',
        },
      });

      // Create Variants if provided
      if (variants && variants.length > 0) {
        for (const variantData of variants) {
          const variant = await tx.productVariant.create({
            data: {
              productId: product.id,
              price: variantData.price,
            },
          });

          // Create Attributes for each variant
          const attributeEntries = Object.entries(variantData.attributes).map(([name, value]) => ({
            variantId: variant.id,
            name,
            value,
          }));

          await tx.variantAttribute.createMany({
            data: attributeEntries,
          });
        }
      }

      // Return full product with variants and attributes
      return await tx.product.findUnique({
        where: { id: product.id },
        include: {
          variants: {
            include: {
              attributes: true,
            },
          },
        },
      });
    });
  }
}
