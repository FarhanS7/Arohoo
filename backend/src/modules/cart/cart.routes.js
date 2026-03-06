import express from 'express';
import { protect } from '../../common/middleware/auth.middleware.js';
import * as cartController from './cart.controller.js';

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router
  .route('/')
  .get(cartController.getCart)
  .delete(cartController.clearCart);

router
  .route('/items')
  .post(cartController.addItem);

router
  .route('/items/:id')
  .patch(cartController.updateItemQuantity)
  .delete(cartController.removeItem);

export default router;
