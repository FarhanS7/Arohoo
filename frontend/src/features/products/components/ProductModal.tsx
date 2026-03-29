'use client';

import React from 'react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl border border-neutral-100 max-w-5xl w-full max-h-[90vh] overflow-y-auto transform transition-all animate-in fade-in slide-in-from-bottom-8 duration-500">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-10 py-8 border-b border-neutral-50 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-neutral-900 tracking-tighter">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="h-12 w-12 rounded-2xl flex items-center justify-center text-neutral-400 hover:text-black hover:bg-neutral-50 transition-all"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="p-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
