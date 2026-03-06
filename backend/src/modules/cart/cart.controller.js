import { asyncHandler } from '../../common/utils/async.handler.js';
import { CartService } from './cart.service.js';

const cartService = new CartService();

/**
 * Standardized response helper for the Cart module.
 */
const sendStandardResponse = (res, statusCode, data, error = null, meta = {}) => {
  res.status(statusCode).json({
    success: statusCode < 400,
    data,
    error,
    meta
  });
};

/**
 * Get current user's cart.
 */
export const getCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const cart = await cartService.getCart(userId);
  
  sendStandardResponse(res, 200, cart);
});

/**
 * Add an item to the cart.
 */
export const addItem = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { productVariantId, quantity } = req.body;

  if (!productVariantId) {
    return res.status(400).json({
      success: false,
      data: null,
      error: 'Product variant ID is required',
      meta: {}
    });
  }

  const cartItem = await cartService.addItem(userId, productVariantId, quantity || 1);
  
  // Return the updated cart for frontend convenience
  const updatedCart = await cartService.getCart(userId);
  sendStandardResponse(res, 201, updatedCart);
});

/**
 * Update cart item quantity.
 */
export const updateItemQuantity = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const cartItemId = req.params.id;
  const { quantity } = req.body;

  if (quantity === undefined || quantity === null) {
     return res.status(400).json({
      success: false,
      data: null,
      error: 'Quantity is required',
      meta: {}
    });
  }

  await cartService.updateItemQuantity(userId, cartItemId, quantity);
  
  const updatedCart = await cartService.getCart(userId);
  sendStandardResponse(res, 200, updatedCart);
});

/**
 * Remove an item from the cart.
 */
export const removeItem = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const cartItemId = req.params.id;

  await cartService.removeItem(userId, cartItemId);
  
  const updatedCart = await cartService.getCart(userId);
  sendStandardResponse(res, 200, updatedCart);
});

/**
 * Clear the entire cart.
 */
export const clearCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  await cartService.clearCart(userId);
  
  const updatedCart = await cartService.getCart(userId);
  sendStandardResponse(res, 200, updatedCart);
});
