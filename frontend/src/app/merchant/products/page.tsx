"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import DeleteConfirmationModal from "@/features/products/components/DeleteConfirmationModal";
import ProductForm from "@/features/products/components/ProductForm";
import ProductModal from "@/features/products/components/ProductModal";
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (product: Product) => {
    setDeletingProduct(product);
  };

  const handleSubmit = async (data: any, files: File[]) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        if (files && files.length > 0) {
          await uploadImages(editingProduct.id, files);
        }
        setSuccessMessage("Product updated successfully!");
      } else {
        const newProduct = await createProduct(data);
        if (newProduct?.id && files && files.length > 0) {
          await uploadImages(newProduct.id, files);
        }
        setSuccessMessage("Product created successfully!");
      }
      setIsModalOpen(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      throw err;
    }
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProduct(deletingProduct.id);
      setSuccessMessage("Product deleted successfully!");
      setDeletingProduct(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err);
    }
  };

  const totalGlobalStock = products.reduce((acc, p) => acc + p.variants.reduce((vAcc, v) => vAcc + v.stock, 0), 0);
  const lowStockCount = products.filter(p => p.variants.reduce((acc, v) => acc + v.stock, 0) < 10).length;

  return (
    <ProtectedRoute allowedRoles={["MERCHANT", "ADMIN"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-neutral-100 pb-12">
          <div>
            <nav className="flex mb-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] gap-3">
              <span>Merchant Portal</span>
              <span className="text-neutral-200">/</span>
              <span className="text-blackCondensed">Inventory</span>
            </nav>
            <h1 className="text-5xl font-black text-neutral-900 tracking-tighter">Inventory Manager</h1>
            <p className="mt-4 text-lg text-neutral-500 font-medium max-w-xl">
              Control your product catalog, monitor stock levels, and manage global variants with precision.
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center px-8 py-4 bg-black text-white text-sm font-bold rounded-2xl hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-200"
          >
            + Add New Product
          </button>
        </div>

        {/* Global Stats - Bento Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-neutral-50 p-8 rounded-[2rem] border border-neutral-100 group hover:border-black transition-all">
            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Total Products</h3>
            <p className="text-3xl font-black text-neutral-900 leading-none">{meta.total}</p>
          </div>
          <div className="bg-neutral-50 p-8 rounded-[2rem] border border-neutral-100">
            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Global Units</h3>
            <p className="text-3xl font-black text-neutral-900 leading-none">{totalGlobalStock}</p>
          </div>
          <div className={`p-8 rounded-[2rem] border transition-all ${lowStockCount > 0 ? 'bg-amber-50 border-amber-100' : 'bg-neutral-50 border-neutral-100'}`}>
            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Low Stock Alerts</h3>
            <p className={`text-3xl font-black leading-none ${lowStockCount > 0 ? 'text-amber-600' : 'text-neutral-900'}`}>{lowStockCount}</p>
          </div>
          <div className="bg-black p-8 rounded-[2rem] border border-neutral-900 shadow-2xl shadow-neutral-300">
            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Stock Health</h3>
            <p className="text-3xl font-black text-white leading-none">94.2%</p>
          </div>
        </div>

        {successMessage && (
          <div className="mb-8 bg-green-50 border border-green-100 text-green-700 px-6 py-4 rounded-2xl text-sm font-black flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <span className="flex h-6 w-6 bg-green-100 rounded-full items-center justify-center text-xs">✓</span>
            {successMessage}
          </div>
        )}

        <div className="space-y-6">
          <ProductTable
            products={products}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
          />
          
          <div className="flex items-center justify-between bg-white px-10 py-6 rounded-[2rem] border border-neutral-100 shadow-sm">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Displaying <span className="text-black font-black">{products.length}</span> of <span className="text-black font-black">{meta.total}</span> entries
            </div>
            <div className="flex gap-3">
              <button
                disabled={meta.page <= 1 || loading}
                onClick={() => fetchProducts(meta.page - 1, meta.limit)}
                className="px-6 py-3 border-2 border-neutral-100 rounded-xl text-xs font-bold hover:bg-neutral-50 disabled:opacity-30 transition-all text-neutral-600"
              >
                Previous
              </button>
              <button
                disabled={meta.page * meta.limit >= meta.total || loading}
                onClick={() => fetchProducts(meta.page + 1, meta.limit)}
                className="px-6 py-3 border-2 border-neutral-100 rounded-xl text-xs font-bold hover:bg-neutral-50 disabled:opacity-30 transition-all text-neutral-600"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Create/Edit Modal */}
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProduct ? `Refining: ${editingProduct.name}` : "Create New Product"}
        >
          <ProductForm
            initialData={editingProduct || undefined}
            onSubmit={handleSubmit}
            onUpload={(files) => editingProduct ? uploadImages(editingProduct.id, files) : Promise.resolve()}
            onCancel={() => setIsModalOpen(false)}
            loading={loading}
          />
        </ProductModal>

        {/* Delete Confirmation */}
        <DeleteConfirmationModal
          isOpen={!!deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onConfirm={confirmDelete}
          title="Confirm Deletion"
          message={`This action will permanently remove "${deletingProduct?.name}" and all its associated variants and stock data from your catalog.`}
          loading={loading}
        />
      </div>
    </ProtectedRoute>
  );
}
