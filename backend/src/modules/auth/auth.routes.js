import { protect } from '../../common/middleware/auth.middleware.js';
import { getMe, login, register, registerMerchant } from './auth.controller.js';

const router = express.Router();

/**
 * Auth Routes
 * Prefix: /api/v1/auth
 */

router.post('/register', register);
router.post('/register-merchant', registerMerchant);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

export default router;
