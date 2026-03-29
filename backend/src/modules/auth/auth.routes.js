import express from 'express';
import { protect } from '../../common/middleware/auth.middleware.js';
import { authLimiter } from '../../common/middleware/rate-limit.middleware.js';
import { getMe, login, register, registerMerchant } from './auth.controller.js';

const router = express.Router();

/**
 * Auth Routes
 * Prefix: /api/v1/auth
 */

router.post('/register', authLimiter, register);
router.post('/register-merchant', authLimiter, registerMerchant);
router.post('/login', authLimiter, login);

// Protected routes
router.get('/me', protect, getMe);

export default router;
