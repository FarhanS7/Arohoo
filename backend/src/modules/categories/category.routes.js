import express from 'express';
import { protect } from '../../common/middleware/auth.middleware.js';
import { authorize } from '../../common/middleware/role.middleware.js';
import { validate } from '../../common/middleware/validation.middleware.js';
import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategoryById,
    updateCategory
} from './category.controller.js';
import { createCategorySchema, updateCategorySchema } from './category.validation.js';

const router = express.Router();

/**
 * Category Routes
 * Prefix: /api/v1/categories
 */

// Public / Customer routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Protected routes (Admin & Merchant)
router.use(protect);

router.post(
  '/', 
  authorize('ADMIN', 'MERCHANT'), 
  validate(createCategorySchema), 
  createCategory
);

router.patch(
  '/:id', 
  authorize('ADMIN', 'MERCHANT'), 
  validate(updateCategorySchema), 
  updateCategory
);

router.delete(
  '/:id', 
  authorize('ADMIN', 'MERCHANT'), 
  deleteCategory
);

export default router;
