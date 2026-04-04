import { CreateProductInput, Product } from "@/lib/api/products";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useCategories } from "../hooks/useCategories";

const ImageUpload = dynamic(() => import("./ImageUpload"), {
  loading: () => <div className="h-40 w-full bg-gray-50 animate-pulse rounded-xl" />,
});

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

  const handleAddVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...(formData.variants || []),
        {
          sku: "",
          price: formData.basePrice,
          stock: 10,
          size: "",
          color: "",
        },
      ],
    });
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = [...(formData.variants || [])];
    newVariants.splice(index, 1);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const newVariants = [...(formData.variants || [])];
    newVariants[index] = {
      ...newVariants[index],
      [field]: value,
    };
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name) return setFormError("Product name is required");
    if (!formData.categoryId) return setFormError("Category is required");
    if (formData.basePrice <= 0) return setFormError("Base price must be greater than 0");
    if (!formData.variants || formData.variants.length === 0) return setFormError("Add at least one variant (Size/Color)");

    try {
      await onSubmit(formData, selectedFiles);
    } catch (err: any) {
      setFormError(err.message || String(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="font-sans space-y-8 bg-white p-8 rounded-3xl shadow-2xl shadow-purple-100 border border-purple-50 max-w-4xl mx-auto">
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
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all outline-none bg-gray-50/50 font-bold text-gray-900"
                placeholder="e.g. Premium Leather Boot"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all outline-none h-32 bg-gray-50/50 font-medium text-gray-600"
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
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all outline-none bg-gray-50/50 font-bold text-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                <div className="relative">
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all outline-none appearance-none bg-gray-50/50 font-bold text-gray-900"
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
              className="text-[10px] px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-black uppercase tracking-widest shadow-lg shadow-purple-100"
            >
              + Add Variant
            </button>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {(formData.variants || []).length === 0 && (
              <div className="text-center py-12 px-6 bg-purple-50/50 rounded-3xl border border-dashed border-purple-200">
                <p className="text-xs font-bold text-purple-400 uppercase tracking-widest">No variants added yet</p>
                <p className="text-[10px] text-purple-300 mt-1">Add at least one size/color combination</p>
              </div>
            )}
            {formData.variants?.map((variant: any, index: number) => (
              <div key={index} className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 relative group transition-all hover:bg-white hover:shadow-xl hover:shadow-purple-50">
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(index)}
                  className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full w-8 h-8 flex items-center justify-center shadow-lg border border-red-50 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 z-10"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 block">SKU</label>
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                      className="w-full px-4 py-2 text-sm rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-purple-600 bg-white font-bold"
                      placeholder="e.g. SNK-BLK-42"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 block">Price (৳)</label>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, "price", parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 text-sm rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-purple-600 bg-white font-bold text-purple-600"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 block">Stock</label>
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => handleVariantChange(index, "stock", parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 text-sm rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-purple-600 bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 block">Size</label>
                    <input
                      type="text"
                      value={variant.size || ""}
                      onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                      className="w-full px-4 py-2 text-sm rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-purple-600 bg-white font-bold"
                      placeholder="M, 42, 10..."
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 block">Color</label>
                    <input
                      type="text"
                      value={variant.color || ""}
                      onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                      className="w-full px-4 py-2 text-sm rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-purple-600 bg-white font-bold"
                      placeholder="Matte Black..."
                    />
                  </div>
                </div>
              </div>
            ))}
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
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border border-red-100 animate-bounce flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {formError}
        </div>
      )}

      <div className="flex justify-end gap-4 pt-8 border-t border-gray-50">
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
          disabled={loading}
        >
          Discard
        </button>
        <button
          type="submit"
          className="px-10 py-4 bg-purple-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-purple-700 shadow-2xl shadow-purple-200 transition-all active:scale-95 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Processing..." : initialData ? "Confirm Update" : "Launch Product"}
        </button>
      </div>
    </form>
  );
}
