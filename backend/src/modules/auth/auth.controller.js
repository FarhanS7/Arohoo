import { AppError } from '../../common/errors/AppError.js';
import { asyncHandler } from '../../common/utils/async.handler.js';
import { AuthService } from './auth.service.js';

const authService = new AuthService();

/**
 * Controller handling authentication requests.
 */
export const register = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Basic Validation
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  if (password.length < 6) {
    return next(new AppError('Password must be at least 6 characters long', 400));
  }

  // Email format validation (simple regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError('Please provide a valid email address', 400));
  }

  // 2. Call Service
  const token = await authService.register({ email, password });

  // 3. Send Response
  res.status(201).json({
    status: 'success',
    token,
  });
});
