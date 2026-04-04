import express from 'express';
import { protect } from '../../common/middleware/auth.middleware.js';
import { authorize } from '../../common/middleware/role.middleware.js';
import { upload } from '../../common/middleware/upload.middleware.js';
import { validate } from '../../common/middleware/validation.middleware.js';
import { resourceCreationLimiter } from '../../common/middleware/rate-limit.middleware.js';
import {
    createProduct,
    deleteProduct,
    getMerchantProducts,
    getProductById,
    updateProduct,
    uploadProductImages
} from './product.controller.js';
import { createProductSchema, updateProductSchema } from './product.validator.js';

const router = express.Router();

router.use(protect);
router.use(authorize('MERCHANT', 'ADMIN'));

router.post('/', resourceCreationLimiter, validate(createProductSchema), createProduct);
router.get('/', getMerchantProducts);
router.get('/:id', getProductById);
router.post('/:productId/images', resourceCreationLimiter, upload.array('images', 5), uploadProductImages);
router.put('/:id', validate(updateProductSchema), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
