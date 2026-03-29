import { z } from 'zod';

/**
 * Validation schema for updating user role.
 */
export const updateRoleSchema = z.object({
  role: z.enum(['ADMIN', 'MERCHANT', 'CUSTOMER'], {
    errorMap: () => ({ message: 'Invalid role. Must be ADMIN, MERCHANT, or CUSTOMER' })
  })
});

/**
 * Validation schema for updating user account status.
 */
export const updateStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED'], {
    errorMap: () => ({ message: 'Invalid status. Must be ACTIVE or SUSPENDED' })
  })
});
