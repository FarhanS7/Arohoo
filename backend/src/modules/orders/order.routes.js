import express from 'express';
import { protect, optionalProtect } from '../../common/middleware/auth.middleware.js';
import * as orderController from './order.controller.js';

const router = express.Router();

/**
 * @route   GET /api/v1/orders/me
 * @desc    Get personal order history for the authenticated user
 * @access  Private
 */
router.get('/me', protect, orderController.getMyOrders);

/**
 * @route   GET /api/v1/orders/:id
 * @desc    Get detailed information for a specific order
 * @access  Private / Public (for guest orders)
 */
router.get('/:id', optionalProtect, orderController.getOrder);

export default router;
