'use client';

import { Order } from '@/lib/api/orders';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface OrderSuccessDetailsProps {
  order: Order;
}

const OrderSuccessDetails: React.FC<OrderSuccessDetailsProps> = ({ order }) => {
  const shippingAddress = typeof order.shippingAddress === 'string' 
    ? order.shippingAddress 
    : JSON.stringify(order.shippingAddress);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-8">
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">Order Confirmed</h1>
        <p className="mt-4 text-base text-neutral-500">
          Thank you for your order. We've received your request and are processing it.
        </p>
        <p className="mt-2 text-sm font-medium text-neutral-600">
          Order ID: <span className="text-neutral-950">#{order.id}</span>
        </p>
      </div>

      <div className="mt-16 border-t border-neutral-100 pt-16 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
        {/* Order Items */}
        <section aria-labelledby="order-heading">
          <h2 id="order-heading" className="text-lg font-bold text-neutral-900 mb-8">Order Items</h2>
          <ul role="list" className="divide-y divide-neutral-100 border-b border-t border-neutral-100">
            {order.orderItems.map((item) => (
              <li key={item.id} className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 relative">
                  {item.product.images?.[0]?.url ? (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      fill
                      className="object-cover object-center"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-neutral-300">
                      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="ml-6 flex flex-1 flex-col justify-between">
                  <div className="flex justify-between text-base font-semibold text-neutral-900">
                    <h3>{item.product.name}</h3>
                    <p className="ml-4">৳{Number(item.price).toLocaleString()}</p>
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">
                    {item.productVariant.size && `Size: ${item.productVariant.size}`}
                    {item.productVariant.color && `${item.productVariant.size ? ' • ' : ''}Color: ${item.productVariant.color}`}
                  </p>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <p className="text-neutral-500">Qty {item.quantity}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-8 space-y-4">
            <div className="flex items-center justify-between text-base font-bold text-neutral-900 pt-4 border-t border-neutral-100">
              <dt>Total Amount</dt>
              <dd>৳{Number(order.totalAmount).toLocaleString()}</dd>
            </div>
          </dl>
        </section>

        {/* Shipping Information */}
        <section aria-labelledby="shipping-heading">
          <h2 id="shipping-heading" className="text-lg font-bold text-neutral-900 mb-8">Shipping Information</h2>
          <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-100">
            <dl className="space-y-6 text-sm">
              <div>
                <dt className="font-bold text-neutral-900 mb-1">Recipient</dt>
                <dd className="text-neutral-600">{order.shippingName}</dd>
              </div>
              <div>
                <dt className="font-bold text-neutral-900 mb-1">Phone Number</dt>
                <dd className="text-neutral-600">{order.shippingPhone}</dd>
              </div>
              <div>
                <dt className="font-bold text-neutral-900 mb-1">Delivery Address</dt>
                <dd className="text-neutral-600 leading-relaxed italic">
                  {shippingAddress}
                </dd>
              </div>
              <div className="pt-6 border-t border-neutral-200">
                <dt className="font-bold text-neutral-900 mb-1">Order Status</dt>
                <dd className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-200 text-neutral-800 uppercase tracking-wider">
                  {order.status}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-12 flex flex-col gap-4">
            <Link 
              href="/products" 
              className="flex items-center justify-center w-full px-8 py-4 text-base font-bold text-white bg-black rounded-full hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrderSuccessDetails;
