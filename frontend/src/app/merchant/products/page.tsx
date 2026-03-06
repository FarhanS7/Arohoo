"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import ProductForm from "@/features/products/components/ProductForm";
import ProductTable from "@/features/products/components/ProductTable";
import { useProducts } from "@/features/products/hooks/useProducts";
import { Product } from "@/lib/api/products";
import { useState } from "react";

export default function MerchantProductsPage() {
  const { 
    products, 
    loading, 
    error, 
    meta, 
    fetchProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    uploadImages 
  } = useProducts();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        setSuccessMessage("Product updated successfully!");
      } else {
        await createProduct(data);
        setSuccessMessage("Product created successfully!");
      }
      setIsFormOpen(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      throw err;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["MERCHANT"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Product Management</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your inventory, pricing, and variants at scale.</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 border border-transparent rounded-xl shadow-lg shadow-indigo-200 text-sm font-bold text-white hover:bg-indigo-700 focus:outline-none transition-all"
          >
            + New Product
          </button>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold animate-bounce">
            ✅ {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
            ❌ {error}
          </div>
        )}

        {isFormOpen ? (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6 max-w-4xl mx-auto">
              <h2 className="text-xl font-bold text-gray-800">
                {editingProduct ? `Editing: ${editingProduct.name}` : "Create New Product"}
              </h2>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-medium"
              >
                Go back to list
              </button>
            </div>
            <ProductForm
              initialData={editingProduct || undefined}
              onSubmit={handleSubmit}
              onUpload={(files) => editingProduct ? uploadImages(editingProduct.id, files) : Promise.resolve()}
              onCancel={() => setIsFormOpen(false)}
              loading={loading}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <ProductTable
              products={products}
              loading={loading}
              onEdit={handleEdit}
              onDelete={deleteProduct}
            />
            
            <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-sm text-gray-500">
                Showing <span className="font-semibold">{products.length}</span> of <span className="font-semibold">{meta.total}</span> products
              </div>
              <div className="flex gap-2">
                <button
                  disabled={meta.page <= 1 || loading}
                  onClick={() => fetchProducts(meta.page - 1, meta.limit)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={meta.page * meta.limit >= meta.total || loading}
                  onClick={() => fetchProducts(meta.page + 1, meta.limit)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
