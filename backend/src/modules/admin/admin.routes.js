import express from 'express';
import { protect } from '../../common/middleware/auth.middleware.js';
import { authorize } from '../../common/middleware/role.middleware.js';
import * as orderController from '../orders/order.controller.js';
import * as adminController from './admin.controller.js';

const router = express.Router();

/**
 * Admin Routes
 * Prefix: /api/v1/admin
 */

// Protect all routes in this router and restrict to ADMIN
router.use(protect);
router.use(authorize('ADMIN'));

router.get('/stats', adminController.getPlatformStats);
router.get('/merchants', adminController.getAllMerchants);
router.get('/merchants/pending', adminController.getPendingMerchants);
router.get('/merchants/:id', adminController.getMerchantDetails); // NEW: Merchant Inspection
router.patch('/merchants/:id/approve', adminController.approveMerchant);
router.patch('/merchants/:id/reject', adminController.rejectMerchant);
router.patch('/merchants/:id/trending', adminController.toggleMerchantTrending);
router.get('/products', adminController.getAllProducts);
router.patch('/products/:id/trending', adminController.toggleProductTrending);
router.patch('/products/:productId', adminController.updateMerchantProduct); // NEW: Admin product edit

// User Management
router.get('/users', adminController.listUsers);
router.patch('/users/:id/role', adminController.updateUserRole);
router.patch('/users/:id/status', adminController.updateUserStatus);

/**
 * @route   GET /api/v1/admin/orders
 * @desc    Get all platform orders with nested details
 * @access  Private (Admin)
 */
router.get('/orders', orderController.getAllOrders);

/**
 * @route   PATCH /api/v1/admin/orders/status
 * @desc    Admin update any order status
 * @access  Private (Admin)
 */
router.patch('/orders/status', orderController.adminUpdateOrderStatus);
router.patch('/orders/items/:orderItemId/status', adminController.updateMerchantOrderItemStatus); // NEW: Admin order status update

export default router;
