import logger from '../utils/logger.js';

/**
 * Global error handling middleware for Express.
 */
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle Zod Validation Errors
  if (err.name === 'ZodError') {
    err.statusCode = 400;
    err.status = 'fail';
    err.message = 'Validation Error: ' + err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
  }

  // Handle Prisma Connection/Timeout Errors
  const prismaConnectionCodes = ['P1001', 'P1002', 'P1003', 'P1008', 'P1011', 'P1017'];
  if (prismaConnectionCodes.includes(err.code)) {
    err.statusCode = 503;
    err.status = 'error';
    err.isOperational = true;
    err.message = 'Database is currently unreachable. Please try again in a few minutes.';
  }

  // Handle other Prisma Known Request Errors
  if (err.name === 'PrismaClientKnownRequestError') {
    err.isOperational = true;
    // P2002: Unique constraint failed
    if (err.code === 'P2002') {
      err.statusCode = 400;
      err.message = `Duplicate value for field: ${err.meta?.target || 'unknown'}`;
    }
  }

  // Handle Multer Errors
  if (err.name === 'MulterError') {
    err.statusCode = 400;
    err.status = 'fail';
    err.isOperational = true;
    if (err.code === 'LIMIT_FILE_SIZE') {
      err.message = 'File too large. Maximum size allowed is 10MB.';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      err.message = 'Too many files. Maximum allowed is 5.';
    } else {
      err.message = `Upload error: ${err.message}`;
    }
  }

  // Handle JWT Errors
  if (err.name === 'JsonWebTokenError') {
    err.statusCode = 401;
    err.message = 'Invalid token. Please log in again.';
    err.isOperational = true;
  }
  if (err.name === 'TokenExpiredError') {
    err.statusCode = 401;
    err.message = 'Your token has expired! Please log in again.';
    err.isOperational = true;
  }

  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // Log non-operational errors
  if (!err.isOperational) {
    logger.error(err);
  }

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
};
