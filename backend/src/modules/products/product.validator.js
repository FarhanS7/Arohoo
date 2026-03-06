import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  categoryId: z.string().uuid('Invalid category ID'),
  basePrice: z.number().positive('Base price must be positive'),
  variants: z.array(z.object({
    sku: z.string().optional(),
    price: z.number().positive('Variant price must be positive'),
    stock: z.number().int().min(0, 'Stock cannot be negative').optional(),
    attributes: z.object({
      size: z.string().min(1, 'Size is required'),
      color: z.string().min(1, 'Color is required')
    }).catchall(z.string())
  })).optional()
});

export const updateProductSchema = createProductSchema.partial();
