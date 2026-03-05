import express from 'express';
import { getPublicCategories } from './public.category.controller.js';

const router = express.Router();

/**
 * Public Category Routes
 * Prefix: /api/public/categories
 */

router.get('/', getPublicCategories);

export default router;
