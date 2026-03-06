import { AppError } from '../../common/errors/AppError.js';
import getPrisma from '../../infrastructure/database/prisma.js';

export class CheckoutService {
  /**
   * Validates checkout data, calculates live prices, and checks stock.
   * @param {Object} data - Checkout data including cartItems.
   * @returns {Promise<Object>} Checkout summary with items and total.
   */
  async validateCheckout(data) {
    const { cartItems } = data;
    const prisma = getPrisma();

    const summaryItems = [];
    let total = 0;

    // 1. Process each item and fetch live data from DB
    for (const item of cartItems) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.productVariantId },
        select: {
          id: true,
          price: true,
          stock: true,
          product: {
            select: { name: true }
          }
        }
      });

      // 2. Validate variant existence
      if (!variant) {
        throw new AppError(`Product variant with ID ${item.productVariantId} not found`, 404);
      }

      // 3. Validate stock
      if (item.quantity > variant.stock) {
        throw new AppError(`Insufficient stock for ${variant.product.name}. Available: ${variant.stock}`, 409);
      }

      // 4. Calculate subtotal using live DB price
      const price = Number(variant.price);
      const subtotal = price * item.quantity;
      total += subtotal;

      summaryItems.push({
        variantId: variant.id,
        name: variant.product.name,
        price,
        quantity: item.quantity,
        subtotal
      });
    }

    // 5. Return the prepared checkout summary
    return {
      items: summaryItems,
      total,
      currency: 'BDT' // Defaulting to BDT per marketplace context
    };
  }
}
