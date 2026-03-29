import { AppError } from '../errors/AppError.js';

/**
 * Middleware to validate request data against a Zod schema.
 * @param {import('zod').ZodSchema} schema - The Zod schema to validate against.
 */
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    const message = error.errors ? error.errors.map((i) => i.message).join(', ') : error.message;
    next(new AppError(message, 400));
  }
};
