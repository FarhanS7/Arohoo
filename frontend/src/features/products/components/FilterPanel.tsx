"use client";

import { useCategories } from "../hooks/useCategories";

interface FilterPanelProps {
  currentParams: any;
  onFilterChange: (newParams: any) => void;
}

export default function FilterPanel({ currentParams, onFilterChange }: FilterPanelProps) {
  const { categories } = useCategories();

  const handleCategoryChange = (id: string) => {
    onFilterChange({ categoryId: id === currentParams.categoryId ? undefined : id });
  };

  const handlePriceChange = (min?: number, max?: number) => {
    onFilterChange({ minPrice: min, maxPrice: max });
  };

  return (
    <div className="space-y-10">
      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 border-b pb-2">Collections</h4>
        <div className="space-y-3">
          <button
            onClick={() => handleCategoryChange("")}
            className={`block text-sm font-medium transition-colors ${!currentParams.categoryId ? 'text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
          >
            All Collections
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCategoryChange(c.id)}
              className={`block text-sm font-medium transition-colors ${currentParams.categoryId === c.id ? 'text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 border-b pb-2">Price Range</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handlePriceChange(0, 50)}
            className={`px-3 py-2 rounded-lg text-xs font-bold border ${currentParams.maxPrice === 50 ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-100 text-gray-600 hover:bg-gray-50'}`}
          >
            Under $50
          </button>
          <button
            onClick={() => handlePriceChange(50, 150)}
            className={`px-3 py-2 rounded-lg text-xs font-bold border ${currentParams.minPrice === 50 ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-100 text-gray-600 hover:bg-gray-50'}`}
          >
            $50 - $150
          </button>
          <button
            onClick={() => handlePriceChange(150, undefined)}
            className={`px-3 py-2 rounded-lg text-xs font-bold border ${currentParams.minPrice === 150 ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-100 text-gray-600 hover:bg-gray-50'}`}
          >
            $150 +
          </button>
          <button
            onClick={() => handlePriceChange(undefined, undefined)}
            className="px-3 py-2 rounded-lg text-xs font-bold border border-gray-100 text-gray-400 hover:text-gray-900"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Attributes (Simplified) */}
      <div>
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 border-b pb-2">Attributes</h4>
        <div className="space-y-4">
           <div>
             <span className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Quick Size</span>
             <div className="flex flex-wrap gap-2">
               {['S', 'M', 'L', 'XL'].map(size => (
                 <button 
                   key={size}
                   onClick={() => onFilterChange({ size: currentParams.size === size ? undefined : size })}
                   className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${currentParams.size === size ? 'bg-black text-white' : 'bg-gray-50 text-gray-900 hover:bg-gray-200'}`}
                 >
                   {size}
                 </button>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
