'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const shippingSchema = z.object({
  name: z.string().min(2, 'Name is required (min 2 characters)'),
  phone: z.string().min(11, 'Valid phone number is required (min 11 digits)').max(15),
  addressLine1: z.string().min(5, 'Specific address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(4, 'Postal code is required (min 4 digits)'),
});

export type ShippingFormData = z.infer<typeof shippingSchema>;

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData) => void;
  isLoading?: boolean;
}

const ShippingForm: React.FC<ShippingFormProps> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      name: '',
      phone: '',
      addressLine1: '',
      city: '',
      postalCode: '',
    },
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
      <h2 className="text-xl font-semibold mb-6 text-neutral-900">Shipping Information</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
          <input
            {...register('name')}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.name ? 'border-red-500' : 'border-neutral-200'
            } focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all`}
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Phone Number</label>
          <input
            {...register('phone')}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.phone ? 'border-red-500' : 'border-neutral-200'
            } focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all`}
            placeholder="017XXXXXXXX"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Shipping Address</label>
          <input
            {...register('addressLine1')}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.addressLine1 ? 'border-red-500' : 'border-neutral-200'
            } focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all`}
            placeholder="House #00, Road #00, Area"
          />
          {errors.addressLine1 && (
            <p className="text-red-500 text-xs mt-1">{errors.addressLine1.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
            <input
              {...register('city')}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.city ? 'border-red-500' : 'border-neutral-200'
              } focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all`}
              placeholder="Dhaka"
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Postal Code</label>
            <input
              {...register('postalCode')}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.postalCode ? 'border-red-500' : 'border-neutral-200'
              } focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all`}
              placeholder="1200"
            />
            {errors.postalCode && (
              <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>
            )}
          </div>
        </div>

        <button
          id="checkout-submit-btn"
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 bg-neutral-900 text-white py-4 rounded-xl font-semibold hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-neutral-200"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing Order...
            </div>
          ) : (
            'Complete Purchase (Cash on Delivery)'
          )}
        </button>
      </form>
    </div>
  );
};

export default ShippingForm;
