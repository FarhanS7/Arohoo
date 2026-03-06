import { z } from 'zod';

export const checkoutSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters'),
    phone: z.string({ required_error: 'Phone is required' }).min(10, 'Invalid phone number'),
    address: z.string({ required_error: 'Address is required' }).min(5, 'Address is too short'),
    cartItems: z.array(
      z.object({
        productVariantId: z.string({ required_error: 'Product variant ID is required' }).uuid('Invalid variant ID'),
        quantity: z.number({ required_error: 'Quantity is required' }).int().positive('Quantity must be a positive integer'),
      })
    ).nonempty('Cart cannot be empty'),
  }),
});
