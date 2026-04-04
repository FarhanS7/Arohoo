import { AppError } from '../../common/errors/AppError.js';
import prisma from '../../infrastructure/database/prisma.js';

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
    let subtotal = 0;

    // 1. Batch fetch all variants involved in the checkout
    const variantIds = cartItems.map(item => item.productVariantId);
    const variants = await tx.productVariant.findMany({
      where: { id: { in: variantIds } },
      select: {
        id: true,
        price: true,
        stock: true,
        productId: true,
        size: true,
        color: true,
        sku: true,
        product: {
          select: { 
            name: true,
            merchantId: true,
            images: {
              take: 1,
              orderBy: { order: 'asc' },
              select: { url: true }
            },
            merchant: {
              select: { storeName: true }
            }
          }
        }
      }
    });

    // 2. Map variants for efficient lookup
    const variantMap = new Map(variants.map(v => [v.id, v]));

    // 3. Validate and calculate subtotal
    for (const item of cartItems) {
      const variant = variantMap.get(item.productVariantId);

      if (!variant) {
        throw new AppError(`Product variant with ID ${item.productVariantId} not found`, 404);
      }

      if (item.quantity > variant.stock) {
        throw new AppError(`Insufficient stock for ${variant.product.name}. Available: ${variant.stock}`, 409);
      }

      const price = Number(variant.price);
      const itemSubtotal = price * item.quantity;
      subtotal += itemSubtotal;

      summaryItems.push({
        productVariantId: variant.id,
        productId: variant.productId,
        merchantId: variant.product.merchantId,
        name: variant.product.name,
        image: variant.product.images?.[0]?.url,
        variantName: `${variant.size || ''} ${variant.color || ''} ${variant.sku || ''}`.trim(),
        merchantName: variant.product.merchant.storeName,
        price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
        stock: variant.stock
      });
    }

    return { summaryItems, subtotal };
  }

  async validateCheckoutSummary(data) {
    if (!data.cartItems || !Array.isArray(data.cartItems) || data.cartItems.length === 0) {
      return { items: [], subtotal: 0, total: 0 };
    }

    const { summaryItems, subtotal } = await this._validateAndPrepareItems(prisma, data.cartItems);
    
    return {
      items: summaryItems,
      subtotal,
      currency: 'BDT'
    };
  }

  /**
   * Atomic Order Creation (Step 4.2).
   */
  async createOrder(userId, checkoutData) {
    const { name, phone, address, cartItems, shippingDistrict, shippingCost } = checkoutData;

    return await prisma.$transaction(async (tx) => {
      // 1. Validate items and stock within the transaction
      const { summaryItems, subtotal } = await this._validateAndPrepareItems(tx, cartItems);
      
      const total = subtotal + Number(shippingCost || 0);

      // 2. Create the Order
      const order = await tx.order.create({
        data: {
          userId: userId || null,
          shippingName: name,
          shippingPhone: phone,
          shippingAddress: address,
          shippingDistrict: shippingDistrict || 'Chattogram',
          shippingCost: Number(shippingCost || 0),
          totalAmount: total,
          status: 'PENDING'
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
            status: 'PENDING'
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
