import { asyncHandler } from '../../common/utils/async.handler.js';
import { cartService } from './cart.service.js';

/**
 * Controller for managing shopping cart operations.
 * Exposes CartService functionality via REST endpoints.
 */
export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await cartService.getCart(userId);
  
  res.status(200).json({
    success: true,
    data: cart,
    error: null
  });
});

/**
 * Adds an item to the user's cart.
 * If the item already exists, increments the quantity.
 */
export const addItem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productVariantId, quantity } = req.body;

  const cartItem = await cartService.addItem({
    userId,
    productVariantId,
    quantity: quantity || 1
  });
  
  res.status(201).json({
    success: true,
    data: cartItem,
    error: null
  });
});

/**
 * Updates the quantity of a specific item in the cart.
 */
export const updateQuantity = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cartItemId = req.params.id;
  const { quantity } = req.body;

  const updatedItem = await cartService.updateQuantity({
    userId,
    cartItemId,
    quantity
  });
  
  res.status(200).json({
    success: true,
    data: updatedItem,
    error: null
  });
});

/**
 * Removes a specific item from the user's cart.
 */
export const removeItem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cartItemId = req.params.id;

  await cartService.removeItem({
    userId,
    cartItemId
  });
  
  res.status(200).json({
    success: true,
    data: null,
    error: null
  });
});

/**
 * Clears all items from the user's cart.
 */
export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await cartService.clearCart(userId);
  
  res.status(200).json({
    success: true,
    data: null,
    error: null
  });
});
