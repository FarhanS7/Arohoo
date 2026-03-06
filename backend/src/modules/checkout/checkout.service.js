import { AppError } from '../../common/errors/AppError.js';
import getPrisma from '../../infrastructure/database/prisma.js';

export class CheckoutService {
  /**
   * Validates checkout data, calculates live prices, and checks stock.
   * @param {Object} data - Checkout data including cartItems.
   * @returns {Promise<Object>} Checkout summary with items and total.
   */
  /**
   * Validates checkout data, calculates live prices, and checks stock.
   * Can be used for a "dry-run" validation or as part of order creation.
   * @param {Object} tx - Prisma transaction or client.
   * @param {Array} cartItems - List of items in the cart.
   * @returns {Promise<Object>} Object containing summary items and total amount.
   */
  async _validateAndPrepareItems(tx, cartItems) {
    const summaryItems = [];
    let total = 0;

    for (const item of cartItems) {
      const variant = await tx.productVariant.findUnique({
        where: { id: item.productVariantId },
        select: {
          id: true,
          price: true,
          stock: true,
          productId: true,
          product: {
            select: { 
              name: true,
              merchantId: true
            }
          }
        }
      });

      if (!variant) {
        throw new AppError(`Product variant with ID ${item.productVariantId} not found`, 404);
      }

      if (item.quantity > variant.stock) {
        throw new AppError(`Insufficient stock for ${variant.product.name}. Available: ${variant.stock}`, 409);
      }

      const price = Number(variant.price);
      const subtotal = price * item.quantity;
      total += subtotal;

      summaryItems.push({
        productVariantId: variant.id,
        productId: variant.productId,
        merchantId: variant.product.merchantId,
        name: variant.product.name,
        price,
        quantity: item.quantity,
        subtotal
      });
    }

    return { summaryItems, total };
  }

  /**
   * Public validation endpoint for dry-run (Step 4.1).
   */
  async validateCheckout(data) {
    const prisma = getPrisma();
    const { summaryItems, total } = await this._validateAndPrepareItems(prisma, data.cartItems);
    
    return {
      items: summaryItems,
      total,
      currency: 'BDT'
    };
  }

  /**
   * Atomic Order Creation (Step 4.2).
   */
  async createOrder(userId, checkoutData) {
    const prisma = getPrisma();
    const { name, phone, address, cartItems } = checkoutData;

    return await prisma.$transaction(async (tx) => {
      // 1. Validate items and stock within the transaction
      const { summaryItems, total } = await this._validateAndPrepareItems(tx, cartItems);

      // 2. Create the Order
      const order = await tx.order.create({
        data: {
          userId,
          shippingName: name,
          shippingPhone: phone,
          shippingAddress: address,
          totalAmount: total,
          status: 'NEW_ORDER'
        }
      });

      // 3. Create OrderItems and Reduce Stock
      for (const item of summaryItems) {
        // Create OrderItem
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productVariantId: item.productVariantId,
            productId: item.productId,
            merchantId: item.merchantId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
            status: 'NEW_ORDER'
          }
        });

        // Reduce stock with concurrent update check
        const updatedVariant = await tx.productVariant.update({
          where: { id: item.productVariantId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });

        // Double safeguard: ensure stock hasn't dropped below zero
        if (updatedVariant.stock < 0) {
          throw new AppError(`Stock changed during checkout for ${item.name}. Insufficient inventory.`, 409);
        }
      }

      return {
        orderId: order.id,
        status: order.status,
        totalAmount: total
      };
    });
  }
}
