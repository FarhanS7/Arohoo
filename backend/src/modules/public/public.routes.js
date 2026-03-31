import { getPublicCategories, getPublicMerchants } from './public.controller.js';

const router = express.Router();

/**
 * Public Routes
 * Prefix: /api/v1/public
 * NO AUTH REQUIRED
 */

router.get('/categories', getPublicCategories);
router.get('/merchants', getPublicMerchants);

export default router;
