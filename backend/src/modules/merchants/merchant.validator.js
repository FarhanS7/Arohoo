import { z } from 'zod';

/**
 * Schema for updating merchant profile information.
 * All fields are optional to allow partial updates.
 */
export const updateMerchantProfileSchema = z.object({
  storeName: z.string().min(1, 'Store name cannot be empty').optional(),
  description: z.string().max(500, 'Description is too long').optional(),
  bannerUrl: z.string().url('Invalid banner URL').optional().or(z.literal('')),
  logo: z.string().url('Invalid logo URL').optional().or(z.literal(''))
});
