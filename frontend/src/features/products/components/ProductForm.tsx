"use client";

import { Product } from "@/lib/api/products";
import dynamic from "next/dynamic";
import { useState, useCallback, memo } from "react";
import { useCategories } from "../hooks/useCategories";
import { Trash2 } from "lucide-react";

const ImageUpload = dynamic(() => import("./ImageUpload"), {
  loading: () => <div className="h-40 w-full bg-gray-50 rounded-xl" />,
});

interface VariantRowProps {
  index: number;
  variant: any;
  onChange: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
  sizeLabel?: string;
  colorLabel?: string;
  showColor?: boolean;
}

// Memoized Variant Row to prevent re-rendering all rows when product name changes
const VariantRow = memo(({ index, variant, onChange, onRemove, sizeLabel = "Size", colorLabel = "Color", showColor = true }: VariantRowProps) => (
  <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 relative">
    <button
      type="button"
      onClick={() => onRemove(index)}
      className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full w-8 h-8 flex items-center justify-center shadow-lg border border-red-50 z-10"
    >
      <Trash2 className="w-4 h-4" />
    </button>
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 block">SKU</label>
        <input
          type="text"
          value={variant.sku}
          onChange={(e) => onChange(index, "sku", e.target.value)}
          className="w-full px-4 py-2 text-sm rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-purple-600 bg-white font-bold"
          placeholder="e.g. SNK-BLK-42"
        />
      </div>
      <div>
        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 block">Price (৳)</label>
        <input
          type="number"
          value={variant.price}
          onChange={(e) => onChange(index, "price", parseFloat(e.target.value) || 0)}
          className="w-full px-4 py-2 text-sm rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-purple-600 bg-white font-bold text-purple-600"
        />
      </div>
      <div>
        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 block">Stock</label>
        <input
          type="number"
          value={variant.stock}
          onChange={(e) => onChange(index, "stock", parseInt(e.target.value) || 0)}
          className="w-full px-4 py-2 text-sm rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-purple-600 bg-white font-bold"
        />
      </div>
      <div className={showColor ? "" : "col-span-2"}>
        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 block">{sizeLabel}</label>
        <input
          type="text"
          value={variant.size || ""}
          onChange={(e) => onChange(index, "size", e.target.value)}
          className="w-full px-4 py-2 text-sm rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-purple-600 bg-white font-bold"
          placeholder={sizeLabel === "Size" ? "M, 42, 10..." : "Value..."}
        />
      </div>
      {showColor && (
        <div>
          <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 block">{colorLabel}</label>
          <input
            type="text"
            value={variant.color || ""}
            onChange={(e) => onChange(index, "color", e.target.value)}
            className="w-full px-4 py-2 text-sm rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-purple-600 bg-white font-bold"
            placeholder="Matte Black..."
          />
        </div>
      )}
    </div>
  </div>
));

VariantRow.displayName = "VariantRow";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: any, files: File[]) => Promise<void>;
  onUpload?: (files: File[]) => Promise<any>;
  onCancel: () => void;
  loading: boolean;
}

export default function ProductForm({ initialData, onSubmit, onUpload, onCancel, loading }: ProductFormProps) {
  const { categories } = useCategories();
  const [formData, setFormData] = useState<any>(
    initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          basePrice: Number(initialData.basePrice),
          categoryId: initialData.categoryId,
          variants: initialData.variants.map((v) => ({
            sku: v.sku,
            price: Number(v.price),
            stock: v.stock,
            size: v.size,
            color: v.color,
          })),
        }
      : {
          name: "",
          description: "",
          basePrice: 0,
          categoryId: "",
          variants: [],
        }
  );

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const handleAddVariant = useCallback(() => {
    setFormData((prev: any) => ({
      ...prev,
      variants: [
        ...(prev.variants || []),
        {
          sku: "",
          price: prev.basePrice,
          stock: 10,
          size: "",
          color: "",
        },
      ],
    }));
  }, []);

  const handleRemoveVariant = useCallback((index: number) => {
    setFormData((prev: any) => {
      const newVariants = [...(prev.variants || [])];
      newVariants.splice(index, 1);
      return { ...prev, variants: newVariants };
    });
  }, []);

  const handleVariantChange = useCallback((index: number, field: string, value: any) => {
    setFormData((prev: any) => {
      const newVariants = [...(prev.variants || [])];
      newVariants[index] = {
        ...newVariants[index],
        [field]: value,
      };
      return { ...prev, variants: newVariants };
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name) return setFormError("Product name is required");
    if (!formData.categoryId) return setFormError("Category is required");
    if (formData.basePrice <= 0) return setFormError("Base price must be greater than 0");
    if (!formData.variants || formData.variants.length === 0) return setFormError("Add at least one variant");

    try {
      await onSubmit(formData, selectedFiles);
    } catch (err: any) {
      setFormError(err.message || String(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="font-sans space-y-8 bg-white p-8 rounded-3xl border border-purple-50 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-purple-50 pb-4">
             <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">1</div>
             <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Basic Info</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none bg-gray-50/50 font-bold text-gray-900"
                placeholder="e.g. Premium Leather Boot"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none h-32 bg-gray-50/50 font-medium text-gray-600"
                placeholder="Describe the premium craftsmanship..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Base Price (৳)</label>
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none bg-gray-50/50 font-bold text-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                <div className="relative">
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none appearance-none bg-gray-50/50 font-bold text-gray-900"
                  >
                    <option value="">Select</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-purple-50 pb-4">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">2</div>
               <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Inventory</h3>
            </div>
            <button
              type="button"
              onClick={handleAddVariant}
              className="text-[10px] px-4 py-2 bg-purple-600 text-white rounded-xl font-black uppercase tracking-widest"
            >
              + Add Variant
            </button>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {(formData.variants || []).length === 0 && (
              <div className="text-center py-12 px-6 bg-purple-50/50 rounded-3xl border border-dashed border-purple-200">
                <p className="text-xs font-bold text-purple-400 uppercase tracking-widest">No variants added yet</p>
                <p className="text-[10px] text-purple-300 mt-1">Add at least one variant combination</p>
              </div>
            )}
            {formData.variants?.map((variant: any, index: number) => {
              const selectedCategory = categories.find(c => c.id === formData.categoryId);
              const categorySlug = selectedCategory?.slug || "";
              
              let sizeLabel = "Variant/Size";
              let colorLabel = "Color/Type";
              let showColor = true;

              switch (categorySlug.toLowerCase()) {
                 case "skincare":
                   sizeLabel = "Volume/Weight (e.g. 50ml, 100g)";
                   showColor = false;
                   break;
                 case "shoes":
                   sizeLabel = "Shoe Size (US/UK/EU)";
                   break;
                 case "fashion":
                 case "mens":
                 case "female":
                 case "kids":
                   sizeLabel = "Clothing Size (S/M/L/XL)";
                   break;
              }

              return (
                <VariantRow 
                  key={index}
                  index={index}
                  variant={variant}
                  onChange={handleVariantChange}
                  onRemove={handleRemoveVariant}
                  sizeLabel={sizeLabel}
                  colorLabel={colorLabel}
                  showColor={showColor}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-50">
        <div className="flex items-center gap-3 mb-6">
           <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">3</div>
           <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Product Visuals</h3>
        </div>
        <ImageUpload 
          productId={initialData?.id}
          existingImages={initialData?.images}
          onUpload={onUpload || (async () => {})}
          onChange={setSelectedFiles}
          loading={loading}
        />
      </div>

      {formError && (
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border border-red-100 flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {formError}
        </div>
      )}

      <div className="flex justify-end gap-4 pt-8 border-t border-gray-50">
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-3 text-xs font-black uppercase tracking-widest text-gray-400"
          disabled={loading}
        >
          Discard
        </button>
        <button
          type="submit"
          className="px-10 py-4 bg-purple-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Processing..." : initialData ? "Confirm Update" : "Launch Product"}
        </button>
      </div>
    </form>
  );
}
