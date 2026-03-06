import { AppError, ForbiddenError } from '../../common/errors/AppError.js';
import getPrisma from '../../infrastructure/database/prisma.js';

export class CartService {
  /**
   * Internal helper to get or create a cart for a user.
   * @param {string} userId - The unique identifier for the user.
   * @returns {Promise<Object>} The cart object.
   */
  async getOrCreateCart(userId) {
    const prisma = getPrisma();
    
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    return cart;
  }

  /**
   * Retrieves a user's cart with all items and product details.
   * @param {string} userId - The unique identifier for the user.
   * @returns {Promise<Object>} The cart object with nested items and products.
   */
  async getCart(userId) {
    const prisma = getPrisma();
    
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: {
                    select: {
                        id: true,
                        name: true
                    }
                }
              },
            },
          },
        },
      },
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
                    select: {
                        id: true,
                        name: true
                    }
                  }
                },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  /**
   * Adds an item to the user's cart or increments quantity if it exists.
   * @param {string} userId - The unique identifier for the user.
   * @param {string} productVariantId - The variant ID of the product.
   * @param {number} quantity - Number of items to add.
   */
  async addItem(userId, productVariantId, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new AppError('Quantity must be a positive integer', 400);
    }

    const prisma = getPrisma();

    // Validate variant exists
    const variant = await prisma.productVariant.findUnique({
      where: { id: productVariantId },
    });

    if (!variant) {
      throw new AppError('Product variant not found', 404);
    }

    const cart = await this.getOrCreateCart(userId);

    // Use upsert or find/update logic to prevent duplicates
    return await prisma.cartItem.upsert({
      where: {
        cartId_productVariantId: {
          cartId: cart.id,
          productVariantId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        cartId: cart.id,
        productVariantId,
        quantity,
      },
    });
  }

  /**
   * Updates the quantity of a specific cart item.
   * @param {string} userId - The user ID for ownership validation.
   * @param {string} cartItemId - The ID of the cart item to update.
   * @param {number} quantity - New quantity.
   */
  async updateItemQuantity(userId, cartItemId, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new AppError('Quantity must be a positive integer', 400);
    }

    const prisma = getPrisma();

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem) {
      throw new AppError('Cart item not found', 404);
    }

    if (cartItem.cart.userId !== userId) {
      throw new ForbiddenError('You do not own this cart item');
    }

    return await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  /**
   * Removes a specific item from the cart.
   * @param {string} userId - User ID for ownership validation.
   * @param {string} cartItemId - The ID of the cart item.
   */
  async removeItem(userId, cartItemId) {
    const prisma = getPrisma();

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem) {
      throw new AppError('Cart item not found', 404);
    }

    if (cartItem.cart.userId !== userId) {
      throw new ForbiddenError('You do not own this cart item');
    }

    return await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  /**
   * Clears all items from the user's cart.
   * @param {string} userId - User ID.
   */
  async clearCart(userId) {
    const prisma = getPrisma();

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return; // Nothing to clear
    }

    return await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }
}
