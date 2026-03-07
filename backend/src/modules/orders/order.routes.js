import express from 'express';
import { protect, restrictTo } from '../../common/middleware/auth.middleware.js';
import * as orderController from './order.controller.js';

const router = express.Router();

router.use(protect);

// Status updates - restricted to ADMIN and MERCHANT
router.patch(
  '/:id/status',
  restrictTo('ADMIN', 'MERCHANT'),
  orderController.updateStatus
);

// List orders for the current user
router.get(
  '/me',
  orderController.getMyOrders
);

// Order details
router.get(
  '/:id',
  orderController.getOrder
);

export default router;
