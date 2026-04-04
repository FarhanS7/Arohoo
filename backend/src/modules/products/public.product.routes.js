import express from 'express';
import { publicSearchLimiter } from '../../common/middleware/rate-limit.middleware.js';
import { getProductDetail, getVariantDetail, listProducts, searchProducts } from './public.product.controller.js';

const router = express.Router();

/**
 * Public Product Routes
 * Prefix: /api/public/products
 */

router.get('/', publicSearchLimiter, listProducts);
router.get('/search', publicSearchLimiter, searchProducts);
router.get('/:id', getProductDetail);
router.get('/variants/:id', getVariantDetail);

export default router;
