import express from 'express';
import { protect } from '../../common/middleware/auth.middleware.js';
import { authorize } from '../../common/middleware/role.middleware.js';
import { approveMerchant, getAllMerchants, getPendingMerchants, rejectMerchant } from './admin.controller.js';

const router = express.Router();

/**
 * Admin Routes
 * Prefix: /api/v1/admin
 */

// Protect all routes in this router and restrict to ADMIN
router.use(protect);
router.use(authorize('ADMIN'));

router.get('/merchants', getAllMerchants);
router.get('/merchants/pending', getPendingMerchants);
router.patch('/merchants/:id/approve', approveMerchant);
router.patch('/merchants/:id/reject', rejectMerchant);

export default router;
