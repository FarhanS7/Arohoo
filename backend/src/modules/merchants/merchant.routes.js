import express from 'express';
import { protect } from '../../common/middleware/auth.middleware.js';
import { authorize } from '../../common/middleware/role.middleware.js';
import { upload } from '../../common/middleware/upload.middleware.js';
import * as orderController from '../orders/order.controller.js';
import * as merchantController from './merchant.controller.js';

const router = express.Router();

// All routes below require the user to be a logged-in MERCHANT
router.use(protect);
router.use(authorize('MERCHANT'));

/**
 * @route   GET /api/v1/merchants/profile
 * @desc    Get merchant store profile
 * @access  Private (Merchant)
 */
router.get('/profile', merchantController.getProfile);

/**
 * @route   PATCH /api/v1/merchants/profile
 * @desc    Update merchant store profile
 * @access  Private (Merchant)
 */
router.patch('/profile', merchantController.updateProfile);

/**
 * @route   POST /api/v1/merchants/profile/logo/:type
 * @desc    Upload merchant logo
 * @access  Private (Merchant)
 */
router.post('/profile/logo/:type', upload.single('logo'), merchantController.uploadLogo);

/**
 * @route   POST /api/v1/merchants/profile/banner/:type
 * @desc    Upload merchant banner
 * @access  Private (Merchant)
 */
router.post('/profile/banner/:type', upload.single('banner'), merchantController.uploadBanner);

/**
 * @route   GET /api/v1/merchants/stats
 * @desc    Get merchant revenue and order analytics
 * @access  Private (Merchant)
 */
router.get('/stats', merchantController.getStats);

/**
 * @route   GET /api/v1/merchant/orders
 * @desc    Get orders belonging to the merchant
 * @access  Private (Merchant)
 */
router.get('/orders', orderController.getMerchantOrders);

/**
 * @route   PATCH /api/v1/merchant/orders/:id/status
 * @desc    Update status of an order item
 * @access  Private (Merchant)
 */
router.patch('/orders/:id/status', orderController.updateStatus);

export default router;
