'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const shippingSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(11, 'Valid phone number required').max(15),
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
    <div className="space-y-6 font-body">
      <header className="flex items-center justify-between">
        <h3 className="text-2xl font-bold font-headline tracking-tight text-on-surface">Shipping Address</h3>
        <span className="text-xs font-bold tracking-widest uppercase text-primary">Step 2 of 4</span>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-surface-container-high space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Full Name</label>
            <input
              {...register('name')}
              className={`w-full bg-surface-container-low border-b-2 ${errors.name ? 'border-error' : 'border-transparent'} focus:border-primary-container focus:ring-0 transition-all px-4 py-3 rounded-t-lg text-sm text-on-surface`}
              placeholder="Your Name"
            />
            {errors.name && <p className="text-error text-xs">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Mobile Number</label>
            <input
              {...register('phone')}
              className={`w-full bg-surface-container-low border-b-2 ${errors.phone ? 'border-error' : 'border-transparent'} focus:border-primary-container focus:ring-0 transition-all px-4 py-3 rounded-t-lg text-sm text-on-surface`}
              placeholder="017XXXXXXXX"
            />
            {errors.phone && <p className="text-error text-xs">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Street Address</label>
          <input
            {...register('addressLine1')}
            className={`w-full bg-surface-container-low border-b-2 ${errors.addressLine1 ? 'border-error' : 'border-transparent'} focus:border-primary-container focus:ring-0 transition-all px-4 py-3 rounded-t-lg text-sm text-on-surface`}
            placeholder="House #, Road #, Area Details"
          />
          {errors.addressLine1 && <p className="text-error text-xs">{errors.addressLine1.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">City / Upazilla</label>
            <input
              {...register('city')}
              className={`w-full bg-surface-container-low border-b-2 ${errors.city ? 'border-error' : 'border-transparent'} focus:border-primary-container focus:ring-0 transition-all px-4 py-3 rounded-t-lg text-sm text-on-surface`}
              placeholder="Agrabad"
            />
            {errors.city && <p className="text-error text-xs">{errors.city.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Delivery Area</label>
            <select
              {...register('shippingDistrict')}
              className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary-container focus:ring-0 transition-all px-4 py-3 rounded-t-lg text-sm text-on-surface"
            >
              <option value="Chattogram">Inside CTG (৳70)</option>
              <option value="Other">Outside CTG (৳130)</option>
            </select>
            {errors.shippingDistrict && <p className="text-error text-xs">{errors.shippingDistrict.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Postal Code</label>
            <input
              {...register('postalCode')}
              className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary-container focus:ring-0 transition-all px-4 py-3 rounded-t-lg text-sm text-on-surface"
              placeholder="Optional"
            />
          </div>
        </div>

        {/* Temporary Payment Method visualization (COD only for now but matching template) */}
        <div className="pt-6 mt-6 border-t border-surface-container-high space-y-6">
          <h3 className="text-xl font-bold font-headline tracking-tight text-on-surface">Payment Method</h3>
          <div className="flex gap-4">
            <button type="button" className="flex-1 border-2 border-primary-container bg-primary/5 p-4 rounded-xl flex items-center justify-center gap-3 transition-all">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>money</span>
              <span className="font-bold text-sm text-primary">Cash on Delivery</span>
            </button>
            <button type="button" disabled className="flex-1 border-2 border-transparent bg-surface-container-low p-4 rounded-xl flex items-center justify-center gap-3 opacity-50 cursor-not-allowed">
              <span className="material-symbols-outlined text-on-surface-variant">credit_card</span>
              <span className="font-medium text-sm text-on-surface-variant">Online (Soon)</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-8 bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-hover disabled:bg-surface-container-highest disabled:text-on-surface-variant disabled:cursor-not-allowed transition-all shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined animate-spin">refresh</span>
              Processing...
            </div>
          ) : (
            'Confirm Order'
          )}
        </button>
      </form>
    </div>
  );
});

export default ShippingForm;
