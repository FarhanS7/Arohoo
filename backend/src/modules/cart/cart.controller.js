import { asyncHandler } from '../../common/utils/async.handler.js';
import { cartService } from './cart.service.js';

/**
 * Get current user's cart.
 * Automatically creates a cart if it doesn't exist.
 */
export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const cart = await cartService.getCart(userId);
  
  res.status(200).json({
    success: true,
    data: cart
  });
});

/**
 * Add an item to the cart.
 * Returns the full updated cart for state synchronization.
 */
export const addItem = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { productVariantId, quantity } = req.body;

  if (!productVariantId) {
    return res.status(400).json({
      success: false,
      error: 'Product variant ID is required'
    });
  }

  await cartService.addItem({ 
    userId, 
    productVariantId, 
    quantity: parseInt(quantity) || 1 
  });
  
  const updatedCart = await cartService.getCart(userId);
  res.status(201).json({
    success: true,
    data: updatedCart
  });
});

/**
 * Update cart item quantity.
 * If quantity is 0, item is removed.
 */
export const updateItemQuantity = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const cartItemId = req.params.id;
  const { quantity } = req.body;

  if (quantity === undefined || quantity === null) {
    return res.status(400).json({
      success: false,
      error: 'Quantity is required'
    });
  }

  await cartService.updateQuantity({ 
    userId, 
    cartItemId, 
    quantity: parseInt(quantity) 
  });
  
  const updatedCart = await cartService.getCart(userId);
  res.status(200).json({
    success: true,
    data: updatedCart
  });
});

/**
 * Remove an item from the cart.
 */
export const removeItem = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const cartItemId = req.params.id;

  await cartService.removeItem({ userId, cartItemId });
  
  const updatedCart = await cartService.getCart(userId);
  res.status(200).json({
    success: true,
    data: updatedCart
  });
});

/**
 * Clear the entire cart.
 */
export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  await cartService.clearCart(userId);
  
  const updatedCart = await cartService.getCart(userId);
  res.status(200).json({
    success: true,
    data: updatedCart
  });
});
