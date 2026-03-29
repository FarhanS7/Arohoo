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

/**
 * Controller handling merchant registration.
 */
export const registerMerchant = asyncHandler(async (req, res, next) => {
  const { email, password, name, storeName, address, phone, categoryIds } = req.body;

  // 1. Validation
  if (!email || !password || !name || !storeName || !address || !phone) {
    return next(new AppError('Please provide all required fields (email, password, name, store name, address, phone)', 400));
  }

  if (password.length < 6) {
    return next(new AppError('Password must be at least 6 characters long', 400));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError('Please provide a valid email address', 400));
  }

  // 2. Call Service
  const token = await authService.registerMerchant({ 
    email, 
    password, 
    name,
    storeName, 
    address, 
    phone, 
    categoryIds 
  });

  // 3. Send Response
  res.status(201).json({
    status: 'success',
    message: 'Merchant registration submitted for approval',
    token, // We still return the token, but they won't be able to log in next time if not approved
  });
});

/**
 * Controller handling user login.
 */
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Validation
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2. Call Service
  const token = await authService.login({ email, password });

  // 3. Send Response
  res.status(200).json({
    status: 'success',
    token,
  });
});

/**
 * Controller to fetch current authenticated user profile.
 */
export const getMe = asyncHandler(async (req, res, next) => {
  // 1. Get user ID from the 'protect' middleware (req.user)
  const user = await authService.getUserById(req.user.userId);

  // 2. Send response
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
