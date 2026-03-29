"use client";

import TableSkeleton from "@/components/ui/TableSkeleton";
import { Product } from "@/lib/api/products";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  loading: boolean;
}

export default function ProductTable({ products, onEdit, onDelete, loading }: ProductTableProps) {
  if (loading && products.length === 0) {
    return <TableSkeleton rows={5} cols={5} />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-neutral-50 rounded-[2rem] border-2 border-dashed border-neutral-200">
        <p className="text-neutral-500 font-medium">No products found. Start by creating one!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-[2rem] shadow-sm border border-neutral-100">
      <table className="min-w-full divide-y divide-neutral-100">
        <thead className="bg-neutral-50/50">
          <tr>
            <th className="px-8 py-5 text-left text-xs font-bold text-neutral-400 uppercase tracking-widest">Product Details</th>
            <th className="px-8 py-5 text-left text-xs font-bold text-neutral-400 uppercase tracking-widest">Pricing</th>
            <th className="px-8 py-5 text-left text-xs font-bold text-neutral-400 uppercase tracking-widest">Inventory</th>
            <th className="px-8 py-5 text-left text-xs font-bold text-neutral-400 uppercase tracking-widest">Status</th>
            <th className="px-8 py-5 text-right text-xs font-bold text-neutral-400 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {products.map((product) => {
            const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
            const isLowStock = totalStock < 10;
            
            return (
              <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors group">
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-14 w-14 flex-shrink-0 bg-neutral-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-neutral-200">
                      {product.name.charAt(0)}
                    </div>
                    <div className="ml-5">
                      <div className="text-sm font-black text-neutral-900 tracking-tight">{product.name}</div>
                      <div className="text-xs text-neutral-400 font-medium max-w-[200px] truncate">{product.description || 'Global essential'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="text-sm text-neutral-900 font-extrabold">৳{product.basePrice.toLocaleString()}</div>
                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">Starting At</div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-neutral-900">{totalStock} units</span>
                    <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-tighter">{product.variants.length} Variants</span>
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  {isLowStock ? (
                    <span className="px-3 py-1 inline-flex text-[10px] leading-5 font-black rounded-full bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-widest">
                      Low Stock
                    </span>
                  ) : (
                    <span className="px-3 py-1 inline-flex text-[10px] leading-5 font-black rounded-full bg-green-50 text-green-600 border border-green-100 uppercase tracking-widest">
                      Healthy
                    </span>
                  )}
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(product)}
                      className="inline-flex items-center px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
