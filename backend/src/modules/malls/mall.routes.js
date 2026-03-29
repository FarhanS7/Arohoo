import express from 'express';
import { protect } from '../../common/middleware/auth.middleware.js';
import { authorize } from '../../common/middleware/role.middleware.js';
import * as mallController from './mall.controller.js';

const router = express.Router();

// Public routes
router.get('/', mallController.getAllMalls);
router.get('/:id', mallController.getMallById);

// Admin routes
router.post('/', protect, authorize('ADMIN'), mallController.createMall);
router.patch('/:id', protect, authorize('ADMIN'), mallController.updateMall);
router.delete('/:id', protect, authorize('ADMIN'), mallController.deleteMall);
router.post('/:id/merchants', protect, authorize('ADMIN'), mallController.addMerchantToMall);
router.delete('/:id/merchants', protect, authorize('ADMIN'), mallController.removeMerchantFromMall);

export default router;
