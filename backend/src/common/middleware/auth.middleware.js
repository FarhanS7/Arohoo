import { AppError } from '../errors/AppError.js';
import { verifyToken } from '../utils/jwt.js';

/**
 * Middleware to protect routes and ensure the user is authenticated.
 * Extracts the JWT from the Authorization header and verifies it.
 */
export const protect = (req, res, next) => {
  let token;

  // 1. Get token and check if it exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  try {
    // 2. Verification token
    const decoded = verifyToken(token);

    // 3. Attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError('Invalid token. Please log in again!', 401));
  }
};
