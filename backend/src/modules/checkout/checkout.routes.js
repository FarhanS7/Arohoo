import express from 'express';
import { optionalProtect } from '../../common/middleware/auth.middleware.js';
import { checkoutLimiter } from '../../common/middleware/rate-limit.middleware.js';
import { validate } from '../../common/middleware/validation.middleware.js';
import * as checkoutController from './checkout.controller.js';
import { checkoutSchema } from './checkout.validator.js';

const router = express.Router();

// Validate checkout summary (Live prices/stock)
router.post(
  '/validate',
  checkoutLimiter,
  checkoutController.validateCheckoutSummary
);

// Checkout usually requires authentication to bind to a user
router.post(
  '/',
  optionalProtect,
  checkoutLimiter,
  validate(checkoutSchema),
  checkoutController.validateCheckout
);

export default router;
