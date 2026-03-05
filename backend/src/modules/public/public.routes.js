import express from 'express';
import { getPublicCategories } from './public.controller.js';

const router = express.Router();

/**
 * Public Routes
 * Prefix: /api/v1/public
 * NO AUTH REQUIRED
 */

router.get('/categories', getPublicCategories);

export default router;
