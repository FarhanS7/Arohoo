import { z } from 'zod';

/**
 * Schema for creating a product variant attribute.
 */
const variantAttributeSchema = z.object({
  name: z.string().min(1, 'Attribute name is required'),
  value: z.string().min(1, 'Attribute value is required'),
});

/**
 * Schema for creating a product variant.
 */
const productVariantSchema = z.object({
  price: z.number().positive('Variant price must be positive'),
  attributes: z.record(z.string(), z.string()).refine(
    (attrs) => Object.keys(attrs).length > 0,
    { message: 'Variant must have at least one attribute' }
  ),
});

/**
 * Schema for creating a product.
 */
export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  categoryId: z.string().uuid('Invalid category ID'),
  basePrice: z.number().positive('Base price must be positive'),
  variants: z.array(productVariantSchema).optional(),
});
