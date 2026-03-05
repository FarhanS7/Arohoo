import express from 'express';
import { login, register, registerMerchant } from './auth.controller.js';

const router = express.Router();

/**
 * Auth Routes
 * Prefix: /api/v1/auth
 */

router.post('/register', register);
router.post('/register-merchant', registerMerchant);
router.post('/login', login);

export default router;
