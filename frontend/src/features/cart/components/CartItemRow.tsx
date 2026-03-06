'use client';

import Image from 'next/image';
import React from 'react';

interface VariantData {
  id: string;
  price: number;
  stock: number;
  product: {
    name: string;
    images: { url: string }[];
  };
  size?: string;
  color?: string;
}

interface CartItemRowProps {
  item: {
    productVariantId: string;
    quantity: number;
  };
  variant: VariantData;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item, variant, onUpdateQuantity, onRemove }) => {
  const imageUrl = variant.product.images[0]?.url || '/placeholder-product.png';

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.productVariantId, item.quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (item.quantity < variant.stock) {
      onUpdateQuantity(item.productVariantId, item.quantity + 1);
    }
  };

  return (
    <div className="flex items-center justify-between py-6 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-4 rounded-xl">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
          <Image
            src={imageUrl}
            alt={variant.product.name}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-gray-900 text-lg">{variant.product.name}</h3>
          <div className="flex gap-3 text-sm text-gray-500">
            {variant.size && <span>Size: <span className="text-gray-900 font-medium">{variant.size}</span></span>}
            {variant.color && <span>Color: <span className="text-gray-900 font-medium">{variant.color}</span></span>}
          </div>
          <span className="text-sm text-gray-500">Stock: {variant.stock} units</span>
        </div>
      </div>

      <div className="flex items-center gap-12">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-wider text-[10px]">Price</span>
          <span className="font-bold text-gray-900 underline decoration-indigo-500/30 underline-offset-4 decoration-2">
            ${variant.price.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col items-center gap-2">
           <span className="text-sm font-medium text-gray-400 uppercase tracking-wider text-[10px]">Quantity</span>
           <div className="flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm">
            <button
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              -
            </button>
            <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
            <button
              onClick={handleIncrement}
              disabled={item.quantity >= variant.stock}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 min-w-[100px]">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-wider text-[10px]">Total</span>
          <span className="font-extrabold text-indigo-600 text-xl tracking-tight">
            ${(variant.price * item.quantity).toLocaleString()}
          </span>
        </div>

        <button
          onClick={() => onRemove(item.productVariantId)}
          className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
          title="Remove Item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;
