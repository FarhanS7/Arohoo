import express from 'express';
import { protect } from '../../common/middleware/auth.middleware.js';
import {
    addItem,
    clearCart,
    getCart,
    removeItem,
    updateQuantity
} from './cart.controller.js';

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router
  .route('/')
  .get(getCart)
  .delete(clearCart);

router
  .route('/items')
  .post(addItem);

router
  .route('/items/:id')
  .patch(updateQuantity)
  .delete(removeItem);

export default router;
