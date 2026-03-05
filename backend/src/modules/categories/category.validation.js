import { z } from 'zod';

/**
 * Zod schema for creating a category.
 */
export const createCategorySchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }).min(2, 'Name must be at least 2 characters'),
    slug: z.string({
      required_error: 'Slug is required',
    }).min(2, 'Slug must be at least 2 characters')
      .regex(/^[a-z0-h0-9-]+$/, 'Slug must be lowercase and only contain letters, numbers, and hyphens'),
    imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
    displayOrder: z.number().int().optional().default(0),
    isActive: z.boolean().optional().default(true),
  }),
});

/**
 * Zod schema for updating a category.
 * All fields are optional.
 */
export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    slug: z.string().min(2).regex(/^[a-z0-h0-9-]+$/).optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
    displayOrder: z.number().int().optional(),
    isActive: z.boolean().optional(),
  }),
});
