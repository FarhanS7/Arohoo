import { AppError } from '../../common/errors/AppError.js';
import prisma from '../../infrastructure/database/prisma.js';

/**
 * Service to manage shopping carts for authenticated users.
 * Supports persistent DB-based carts with multi-merchant variant items.
 */
export class CartService {
  /**
   * Retrieves or creates a cart for the user.
   * Includes nested items, variants, and product info for the frontend.
   * @param {string} userId - UUID of the user.
   * @returns {Promise<Object>} The cart object.
   */
  async getOrCreateCart(userId) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: {
                  select: { id: true, name: true }
                }
              }
            }
          }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              productVariant: {
                include: {
                  product: {
                    select: { id: true, name: true }
                  }
                }
              }
            }
          }
        }
      });
    }

    return cart;
  }

  /**
   * Adds a product variant to the user's cart.
   * Increments quantity if variant already exists.
   * @param {Object} params - { userId, productVariantId, quantity }
   * @returns {Promise<Object>} The added/updated cart item.
   */
  async addItem({ userId, productVariantId, quantity }) {
    if (!quantity || quantity <= 0) {
      throw new AppError('Quantity must be a positive integer', 400);
    }

    const cart = await this.getOrCreateCart(userId);

    // 1. Fetch variant and validate stock
    const variant = await prisma.productVariant.findUnique({
      where: { id: productVariantId }
    });

    if (!variant) throw new AppError('Product variant not found', 404);
    if (variant.stock <= 0) throw new AppError('Variant is out of stock', 400);

    // 2. Check for existing item to aggregate quantity
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productVariantId: {
          cartId: cart.id,
          productVariantId
        }
      }
    });

    const totalQuantity = (existingItem?.quantity || 0) + quantity;

    // 3. Final stock validation
    if (totalQuantity > variant.stock) {
      throw new AppError(`Cannot add more. Stock limit: ${variant.stock}`, 400);
    }

    // 4. Atomic upsert
    return await prisma.cartItem.upsert({
      where: {
        cartId_productVariantId: {
          cartId: cart.id,
          productVariantId
        }
      },
      update: { quantity: totalQuantity },
      create: {
        cartId: cart.id,
        productVariantId,
        quantity
      },
      include: {
        productVariant: {
          include: {
            product: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });
  }

  /**
   * Updates the exact quantity of a cart item.
   * If quantity is 0, removes the item.
   * @param {Object} params - { userId, cartItemId, quantity }
   */
  async updateQuantity({ userId, cartItemId, quantity }) {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
        productVariant: true
      }
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      throw new AppError('Cart item not found or unauthorized', 404);
    }

    if (quantity <= 0) {
      return await this.removeItem({ userId, cartItemId });
    }

    if (quantity > cartItem.productVariant.stock) {
      throw new AppError(`Stock limit reached: ${cartItem.productVariant.stock}`, 400);
    }

    return await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        productVariant: {
          include: {
            product: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });
  }

  /**
   * Removes an item from the cart.
   */
  async removeItem({ userId, cartItemId }) {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true }
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      throw new AppError('Cart item not found or unauthorized', 404);
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId }
    });

    return { success: true };
  }

  /**
   * Empties the entire cart for a user.
   */
  async clearCart(userId) {
    const cart = await prisma.cart.findUnique({
      where: { userId }
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }

    return { success: true };
  }

  /**
   * Retrieves the current state of a user's cart.
   */
  async getCart(userId) {
    return await this.getOrCreateCart(userId);
  }
}

// Export singleton instance for standard use
export const cartService = new CartService();
