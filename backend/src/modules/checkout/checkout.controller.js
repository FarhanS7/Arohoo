import { asyncHandler } from '../../common/utils/async.handler.js';
import { CheckoutService } from './checkout.service.js';

const checkoutService = new CheckoutService();

/**
 * Validates checkout request and returns summary.
 */
export const validateCheckout = asyncHandler(async (req, res, next) => {
  const checkoutSummary = await checkoutService.validateCheckout(req.body);

  res.status(200).json({
    success: true,
    data: checkoutSummary,
    error: null
  });
});
