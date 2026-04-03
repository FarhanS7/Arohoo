import { CreateProductInput, Product } from "@/lib/api/products";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useCategories } from "../hooks/useCategories";

const ImageUpload = dynamic(() => import("./ImageUpload"), {
  loading: () => <div className="h-40 w-full bg-gray-50 animate-pulse rounded-xl" />,
});

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: CreateProductInput, files: File[]) => Promise<void>;
  onUpload?: (files: File[]) => Promise<any>;
  onCancel: () => void;
  loading: boolean;
}

export default function ProductForm({ initialData, onSubmit, onUpload, onCancel, loading }: ProductFormProps) {
  const { categories } = useCategories();
  const [formData, setFormData] = useState<CreateProductInput>(
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
            attributes: v.attributes,
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
          stock: 0,
          attributes: { size: "", color: "" },
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
    if (field.includes("attributes.")) {
      const attrField = field.split(".")[1];
      newVariants[index] = {
        ...newVariants[index],
        attributes: {
          ...newVariants[index].attributes,
          [attrField]: value,
        },
      };
    } else {
      newVariants[index] = {
        ...newVariants[index],
        [field]: value,
      };
    }
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
      setFormError(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Basic Information</h3>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              placeholder="e.g. Premium Cotton T-Shirt"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none h-32"
              placeholder="Tell customers more about your product..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Base Price ($)</label>
              <input
                type="number"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none appearance-none"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-bold text-gray-900">Variants</h3>
            <button
              type="button"
              onClick={handleAddVariant}
              className="text-sm px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
            >
              + Add Variant
            </button>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {(formData.variants || []).length === 0 && (
              <p className="text-sm text-gray-500 italic text-center py-4 bg-gray-50 rounded-xl">No variants added yet.</p>
            )}
            {formData.variants?.map((variant, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(index)}
                  className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  &times;
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">SKU (Optional)</label>
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="SKU-..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Price ($)</label>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, "price", parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Stock</label>
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => handleVariantChange(index, "stock", parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Size</label>
                    <input
                      type="text"
                      value={variant.attributes.size || ""}
                      onChange={(e) => handleVariantChange(index, "attributes.size", e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="M, L, XL..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Color</label>
                    <input
                      type="text"
                      value={variant.attributes.color || ""}
                      onChange={(e) => handleVariantChange(index, "attributes.color", e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="Red, Blue..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-8 border-t">
        <ImageUpload 
          productId={initialData?.id}
          existingImages={initialData?.images}
          onUpload={onUpload || (async () => {})}
          onChange={setSelectedFiles}
          loading={loading}
        />
      </div>

      {formError && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm font-medium border border-red-100 animate-pulse">
          ⚠️ {formError}
        </div>
      )}

      <div className="flex justify-end gap-4 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
