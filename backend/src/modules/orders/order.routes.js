import express from 'express';
import { protect } from '../../common/middleware/auth.middleware.js';
import * as orderController from './order.controller.js';

const router = express.Router();

/**
 * All order routes are protected.
 */
router.use(protect);

/**
 * @route   GET /api/v1/orders/me
 * @desc    Get personal order history for the authenticated user
 * @access  Private
 */
router.get('/me', orderController.getMyOrders);

/**
 * @route   GET /api/v1/orders/:id
 * @desc    Get detailed information for a specific order
 * @access  Private
 */
router.get('/:id', orderController.getOrder);

export default router;
