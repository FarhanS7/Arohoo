"use client";

import { Category } from "@/lib/api/categories";
import { useState } from "react";

interface CategoryManagerProps {
  categories: Category[];
  onCreate: (data: Partial<Category>) => Promise<any>;
  onUpdate: (id: string, data: Partial<Category>) => Promise<any>;
  onDelete: (id: string) => Promise<void>;
}

export default function CategoryManager({ categories, onCreate, onUpdate, onDelete }: CategoryManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({ name: "", slug: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await onUpdate(editingId, formData);
        setEditingId(null);
      } else {
        await onCreate(formData);
        setIsAdding(false);
      }
      setFormData({ name: "", slug: "" });
    } catch (err: any) {
      alert(err);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name, slug: cat.slug });
  };

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-400">Categories ({categories.length})</h2>
        <button
          onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: "", slug: "" }); }}
          className="h-12 px-8 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-200"
        >
          Add New Category
        </button>
      </div>

      {/* Editor Modal/Overlay */}
      {(isAdding || editingId) && (
        <div className="bg-neutral-50 p-10 rounded-[2.5rem] border border-neutral-100 animate-in fade-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest pl-1">Category Name</label>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="w-full h-14 bg-white px-6 rounded-2xl border border-neutral-100 focus:outline-none focus:ring-2 focus:ring-black text-sm font-bold"
                placeholder="e.g. Minimalist Gems"
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest pl-1">Slug</label>
              <input
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full h-14 bg-white px-6 rounded-2xl border border-neutral-100 focus:outline-none focus:ring-2 focus:ring-black text-sm font-bold text-neutral-400"
                placeholder="slug-path"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingId(null); }}
                className="h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-14 px-10 rounded-2xl bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all"
              >
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="group bg-white p-8 rounded-[2.5rem] border border-neutral-100 hover:border-black transition-all shadow-lg shadow-neutral-50 flex flex-col justify-between min-h-[180px]">
            <div>
              <span className="text-[10px] font-black text-neutral-300 tracking-widest uppercase mb-2 block">{cat.slug}</span>
              <h3 className="text-xl font-black text-neutral-900 tracking-tighter uppercase leading-tight italic">{cat.name}</h3>
            </div>
            <div className="flex justify-between items-center mt-6">
              <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(cat)}
                  className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirm("Delete this category?") && onDelete(cat.id)}
                  className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
              <div className="h-2 w-2 rounded-full bg-neutral-100 group-hover:bg-black transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
