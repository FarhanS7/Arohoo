import { getProductDetail, getVariantDetail, listProducts, searchProducts } from './public.product.controller.js';

const router = express.Router();

/**
 * Public Product Routes
 * Prefix: /api/public/products
 */

router.get('/', listProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductDetail);
router.get('/variants/:id', getVariantDetail);

export default router;
