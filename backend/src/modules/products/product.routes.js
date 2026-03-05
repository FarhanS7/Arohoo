import express from 'express';
import { authorize, protect } from '../../common/middleware/auth.middleware.js';
import { validate } from '../../common/middleware/validator.middleware.js';
import { createProduct } from './product.controller.js';
import { createProductSchema } from './product.validator.js';

const router = express.Router();

/**
 * Merchant Product Routes
 * Prefix: /api/merchant/products
 */

router.post(
  '/',
  protect,
  authorize('MERCHANT', 'ADMIN'),
  validate(createProductSchema),
  createProduct
);

export default router;
