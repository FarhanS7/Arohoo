import express from 'express';
import * as merchantController from './merchant.controller.js';

const router = express.Router();

/**
 * @route   GET /api/v1/public/merchants
 * @desc    Get all public merchants with filtering
 * @access  Public
 */
router.get('/', merchantController.listPublic);

/**
 * @route   GET /api/v1/public/merchants/:id
 * @desc    Get public merchant profile
 * @access  Public
 */
router.get('/:id', merchantController.getPublicProfile);

export default router;
