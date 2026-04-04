import { asyncHandler } from '../../common/utils/async.handler.js';
import { CheckoutService } from './checkout.service.js';

const checkoutService = new CheckoutService();

/**
 * Validates checkout request and creates an order.
 */
export const validateCheckout = asyncHandler(async (req, res, next) => {
  const orderSummary = await checkoutService.createOrder(req.user?.id, req.body);

  res.status(201).json({
    success: true,
    data: orderSummary,
    error: null
  });
});

/**
 * Returns a live checkout summary without creating an order.
 */
export const validateCheckoutSummary = asyncHandler(async (req, res, next) => {
  const summary = await checkoutService.validateCheckoutSummary(req.body);

  res.status(200).json({
    success: true,
    data: summary,
    error: null
  });
});
