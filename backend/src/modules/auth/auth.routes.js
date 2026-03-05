import express from 'express';
import { register } from './auth.controller.js';

const router = express.Router();

/**
 * Auth Routes
 * Prefix: /api/v1/auth
 */

router.post('/register', register);

export default router;
