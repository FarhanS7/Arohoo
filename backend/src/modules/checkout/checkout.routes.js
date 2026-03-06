import express from 'express';
import { protect } from '../../common/middleware/auth.middleware.js';
import { validate } from '../../common/middleware/validation.middleware.js';
import * as checkoutController from './checkout.controller.js';
import { checkoutSchema } from './checkout.validator.js';

const router = express.Router();

// Checkout usually requires authentication to bind to a user
router.post(
  '/',
  protect,
  validate(checkoutSchema),
  checkoutController.validateCheckout
);

export default router;
