'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const shippingSchema = z.object({
  name: z.string().min(2, 'Name is required (min 2 characters)'),
  phone: z.string().min(11, 'Valid phone number is required (min 11 digits)').max(15),
  addressLine1: z.string().min(5, 'Specific address is required'),
  shippingDistrict: z.enum(['Chattogram', 'Other']),
  city: z.string().min(2, 'City/Area is required'),
  postalCode: z.string().optional(),
});

export type ShippingFormData = z.infer<typeof shippingSchema>;

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData) => void;
  onDistrictChange: (district: 'Chattogram' | 'Other') => void;
  isLoading?: boolean;
}

const ShippingForm: React.FC<ShippingFormProps> = React.memo(({ onSubmit, onDistrictChange, isLoading }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      name: '',
      phone: '',
      addressLine1: '',
      shippingDistrict: 'Chattogram',
      city: '',
      postalCode: '',
    },
  });

  const selectedDistrict = watch('shippingDistrict');

  React.useEffect(() => {
    onDistrictChange(selectedDistrict);
  }, [selectedDistrict, onDistrictChange]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 font-sans">
      <h2 className="text-xl font-bold mb-6 text-neutral-900">Shipping Information</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">Full Name</label>
            <input
              {...register('name')}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.name ? 'border-red-500' : 'border-neutral-200'
              } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
              placeholder="Your Name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">Mobile Number</label>
            <input
              {...register('phone')}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.phone ? 'border-red-500' : 'border-neutral-200'
              } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
              placeholder="017XXXXXXXX"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-3">Delivery Area</label>
          <div className="grid grid-cols-2 gap-4">
            <label 
              className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedDistrict === 'Chattogram' 
                ? 'border-purple-600 bg-purple-50 text-purple-900' 
                : 'border-neutral-100 text-neutral-500 hover:border-neutral-200'
              }`}
            >
              <input 
                type="radio" 
                value="Chattogram" 
                {...register('shippingDistrict')} 
                className="hidden" 
              />
              <div className="text-center">
                <p className="font-bold">Inside CTG</p>
                <p className="text-xs opacity-70">৳70 Shipping</p>
              </div>
            </label>

            <label 
              className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedDistrict === 'Other' 
                ? 'border-purple-600 bg-purple-50 text-purple-900' 
                : 'border-neutral-100 text-neutral-500 hover:border-neutral-200'
              }`}
            >
              <input 
                type="radio" 
                value="Other" 
                {...register('shippingDistrict')} 
                className="hidden" 
              />
              <div className="text-center">
                <p className="font-bold">Outside CTG</p>
                <p className="text-xs opacity-70">৳130 Shipping</p>
              </div>
            </label>
          </div>
          {errors.shippingDistrict && <p className="text-red-500 text-xs mt-1">{errors.shippingDistrict.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">Full Shipping Address</label>
          <textarea
            {...register('addressLine1')}
            rows={3}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.addressLine1 ? 'border-red-500' : 'border-neutral-200'
            } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
            placeholder="House #, Road #, Area Details"
          />
          {errors.addressLine1 && (
            <p className="text-red-500 text-xs mt-1">{errors.addressLine1.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">City / Upazilla</label>
            <input
              {...register('city')}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.city ? 'border-red-500' : 'border-neutral-200'
              } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
              placeholder="e.g. Agrabad"
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">Postal Code (Opt.)</label>
            <input
              {...register('postalCode')}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="1200"
            />
          </div>
        </div>

        <button
          id="checkout-submit-btn"
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-200"
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
            'Confirm Order (Cash on Delivery)'
          )}
        </button>
      </form>
    </div>
  );
});

export default ShippingForm;
