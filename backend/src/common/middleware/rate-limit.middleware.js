import rateLimit from 'express-rate-limit';

/**
 * Factory to create rate limiters with a standardized 429 response.
 * 
 * @param {number} windowMs - Time window in milliseconds.
 * @param {number} limit - Max quantity of requests per window.
 * @param {string} message - Optional error message.
 * @returns {Function} Express middleware.
 */
const createLimiter = (windowMs, limit, message = 'Too many requests') => {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: message },
    skip: () => process.env.NODE_ENV === 'test',
    // Use default keyGenerator which is safer for IPv6
  });
};

// Strict limiter for authentication (5 requests per 15 minutes)
export const authLimiter = createLimiter(15 * 60 * 1000, 5, 'Too many login attempts. Please try again in 15 minutes.');

// Limiter for checkout/payment (10 requests per 15 minutes)
export const checkoutLimiter = createLimiter(15 * 60 * 1000, 10, 'Too many checkout attempts. Please try again in 15 minutes.');

// Limiter for public search and listing (prevent scraping/DoS)
export const publicSearchLimiter = createLimiter(15 * 60 * 1000, 100, 'Search rate limit exceeded. Please try again later.');

// Limiter for resource creation (products, images) to prevent spam
export const resourceCreationLimiter = createLimiter(60 * 1000, 20, 'Resource creation rate limit exceeded. Please wait a minute.');
