import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().optional(),
    categoryId: z.string().uuid('Invalid category ID'),
    basePrice: z.number().min(0, 'Base price cannot be negative').optional().default(0),
    variants: z.array(z.object({
      sku: z.string().optional(),
      price: z.number().min(0, 'Variant price cannot be negative').optional(),
      stock: z.number().int().min(0, 'Stock cannot be negative').optional(),
      size: z.string().optional().or(z.literal('')),
      color: z.string().optional().or(z.literal(''))
    })).optional()
  })
});

export const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial()
});
