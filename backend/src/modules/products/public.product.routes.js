import express from 'express';
import { getProductDetail, listProducts, searchProducts } from './public.product.controller.js';

const router = express.Router();

/**
 * Public Product Routes
 * Prefix: /api/public/products
 */

router.get('/', listProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductDetail);

export default router;
