"use client";

import { Product } from "@/lib/api/products";
import dynamic from "next/dynamic";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useCategories } from "../hooks/useCategories";
import { Trash2, Plus, Package, Palette, LayoutGrid, Layers } from "lucide-react";

const ImageUpload = dynamic(() => import("./ImageUpload"), {
  loading: () => <div className="h-40 w-full bg-gray-50 rounded-xl animate-pulse" />,
});

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: any, files: File[]) => Promise<void>;
  onUpload?: (files: File[]) => Promise<any>;
  onCancel: () => void;
  loading: boolean;
}

type ProductMode = "simple" | "multi-color";

// Types for our internal simplified state
interface SimpleVariant {
  id?: string;
  sku?: string;
  size: string;
  stock: number | string;
}

interface ColorVariation {
  colorName: string;
  sizes: { id?: string; sku?: string; sizeLabel: string; stock: number }[];
}

export default function ProductForm({ initialData, onSubmit, onUpload, onCancel, loading }: ProductFormProps) {
  const { categories } = useCategories();
  const [productMode, setProductMode] = useState<ProductMode>("simple");
  
  // Base product fields
  const [baseData, setBaseData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    basePrice: Number(initialData?.basePrice || 0),
    categoryId: initialData?.categoryId || "",
  });

  // Simple Inventory state
  const [simpleColor, setSimpleColor] = useState(initialData?.variants?.[0]?.color || "");
  const [simpleVariants, setSimpleVariants] = useState<SimpleVariant[]>(() => {
    if (!initialData || initialData.variants.length === 0) return [{ size: "", stock: "", price: "" }];
    return initialData.variants.map(v => ({
      id: v.id,
      sku: v.sku,
      size: v.size || "",
      price: v.price || "",
      stock: v.stock === -1 ? "" : (v.stock !== undefined && v.stock !== null ? v.stock : "")
    }));
  });

  const selectedCategoryName = useMemo(() => categories.find(c => c.id === baseData.categoryId)?.name, [categories, baseData.categoryId]);
  const isPerfume = selectedCategoryName?.toLowerCase().includes("perfume") || false;

  // Multi-color state: Group existing variants by color if editing
  const initialVariations = useMemo(() => {
    if (!initialData || initialData.variants.length === 0) return [];
    
    const colorGroups: Record<string, { id?: string; sku?: string; sizeLabel: string; stock: number }[]> = {};
    initialData.variants.forEach(v => {
      const color = v.color || "Default";
      if (!colorGroups[color]) colorGroups[color] = [];
      colorGroups[color].push({ id: v.id, sku: v.sku, sizeLabel: v.size || "", stock: v.stock });
    });

    return Object.entries(colorGroups).map(([colorName, sizes]) => ({
      colorName,
      sizes
    }));
  }, [initialData]);

  const [colorVariations, setColorVariations] = useState<ColorVariation[]>(
    initialVariations.length > 0 ? initialVariations : []
  );

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  // Set initial mode based on variants
  useEffect(() => {
    if (initialData && initialData.variants.length > 1) {
      // Check if they have different colors
      const colors = new Set(initialData.variants.map(v => v.color).filter(Boolean));
      if (colors.size > 1) {
        setProductMode("multi-color");
      }
    }
  }, [initialData]);

  // Simple Variants Handlers
  const addSimpleVariant = () => setSimpleVariants(prev => [...prev, { size: "", stock: "" }]);
  const removeSimpleVariant = (idx: number) => setSimpleVariants(prev => prev.filter((_, i) => i !== idx));
  const updateSimpleVariant = (idx: number, field: keyof SimpleVariant, value: any) => {
    setSimpleVariants(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value } as any;
      return next;
    });
  };

  // Color management
  const addColor = () => {
    setColorVariations(prev => [...prev, { colorName: "", sizes: [{ sizeLabel: "", stock: 10 }] }]);
  };

  const removeColor = (idx: number) => {
    setColorVariations(prev => prev.filter((_, i) => i !== idx));
  };

  const updateColorName = (idx: number, name: string) => {
    setColorVariations(prev => {
      const next = [...prev];
      next[idx].colorName = name;
      return next;
    });
  };

  // Size management
  const addSizeToColor = (colorIdx: number) => {
    setColorVariations(prev => {
      const next = [...prev];
      next[colorIdx].sizes.push({ sizeLabel: "", stock: 10 });
      return next;
    });
  };

  const removeSizeFromColor = (colorIdx: number, sizeIdx: number) => {
    setColorVariations(prev => {
      const next = [...prev];
      next[colorIdx].sizes = next[colorIdx].sizes.filter((_, i) => i !== sizeIdx);
      if (next[colorIdx].sizes.length === 0) {
          // If no sizes left, maybe remove the color or leave it empty? 
          // For now let's just leave it empty so they can add another size.
      }
      return next;
    });
  };

  const updateSizeField = (colorIdx: number, sizeIdx: number, field: "sizeLabel" | "stock", value: any) => {
     setColorVariations(prev => {
        const next = [...prev];
        next[colorIdx].sizes[sizeIdx] = { ...next[colorIdx].sizes[sizeIdx], [field]: value };
        return next;
     });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Only mandatory fields as per user request
    if (!baseData.name) return setFormError("Product name is required");
    if (!baseData.categoryId) return setFormError("Category is required");

    // Map UI state to API payload
    let variants: any[] = [];

    if (productMode === "simple") {
       simpleVariants.forEach((sv, idx) => {
         variants.push({
            id: sv.id,
            sku: sv.sku || `SKU-${Date.now()}-0-${idx}`,
            price: sv.price !== undefined && sv.price !== "" ? Number(sv.price) : baseData.basePrice,
            stock: sv.stock === "" ? -1 : Number(sv.stock),
            size: sv.size,
            color: simpleColor
         });
       });
    } else {
       // Multi-color mapping
       colorVariations.forEach((cv, cIdx) => {
          cv.sizes.forEach((s, sIdx) => {
             variants.push({
                id: s.id,
                sku: s.sku || `SKU-${Date.now()}-${cIdx}-${sIdx}`,
                price: baseData.basePrice, // Using base price for simplicity per "plain" request
                stock: s.stock === undefined || String(s.stock) === "" ? -1 : Number(s.stock),
                size: s.sizeLabel,
                color: cv.colorName
             });
          });
       });
       
       if (variants.length === 0) {
          // If they chose multi-color but didn't add anything, maybe fallback to simple?
          // Or just allow it (it might fail at backend if strict, let's allow it as "nothing required").
       }
    }

    const payload = {
      ...baseData,
      variants
    };

    try {
      await onSubmit(payload, selectedFiles);
    } catch (err: any) {
      setFormError(err.message || String(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="font-sans space-y-12 bg-white pb-12 rounded-[2.5rem] max-w-5xl mx-auto overflow-hidden">
      {/* 1. HEADER SECTION (Always Modern & Clean) */}
      <div className="bg-neutral-50 px-10 py-12 rounded-b-[3rem] border-b border-neutral-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <span className="px-3 py-1 bg-black text-white text-[10px] font-black rounded-full uppercase tracking-widest">Editor</span>
             <span className="text-neutral-300">/</span>
             <span className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">Inventory Management</span>
           </div>
           <h2 className="text-4xl font-black text-neutral-900 tracking-tighter">Product Refiner</h2>
           <p className="text-neutral-500 font-medium mt-1">Refining the edges of your digital storefront.</p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-neutral-200/50 p-1.5 rounded-2xl border border-neutral-200">
           <button
             type="button"
             onClick={() => setProductMode("simple")}
             className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${productMode === "simple" ? "bg-white text-black shadow-lg shadow-neutral-200/50" : "text-neutral-400 hover:text-neutral-600"}`}
           >
             <Package className="w-4 h-4" />
             Simple
           </button>
           <button
             type="button"
             onClick={() => setProductMode("multi-color")}
             className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${productMode === "multi-color" ? "bg-white text-black shadow-lg shadow-neutral-200/50" : "text-neutral-400 hover:text-neutral-600"}`}
           >
             <Layers className="w-4 h-4" />
             Variations
           </button>
        </div>
      </div>

      <div className="px-10 space-y-12">
        {/* 2. CORE DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-12">
                <div className="flex items-center gap-3 mb-8 border-b border-neutral-100 pb-4">
                  <LayoutGrid className="w-5 h-5 text-neutral-400" />
                  <h3 className="text-xs font-black text-neutral-900 uppercase tracking-[0.2em]">Core Identity</h3>
                </div>
            </div>

            <div className="md:col-span-8 space-y-6">
                <div className="relative group">
                  <label className="absolute left-6 -top-2.5 px-2 bg-white text-[10px] font-black text-neutral-400 uppercase tracking-widest">Product Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={baseData.name}
                    onChange={(e) => setBaseData({ ...baseData, name: e.target.value })}
                    className="w-full px-8 py-5 rounded-3xl border border-neutral-200 focus:border-black focus:ring-0 outline-none font-bold text-neutral-900 text-lg transition-all placeholder:text-neutral-200"
                    placeholder="e.g. Ethereal Silk Scarf"
                  />
                </div>

                <div className="relative group">
                   <label className="absolute left-6 -top-2.5 px-2 bg-white text-[10px] font-black text-neutral-400 uppercase tracking-widest">Aura / Description</label>
                   <textarea
                     value={baseData.description}
                     onChange={(e) => setBaseData({ ...baseData, description: e.target.value })}
                     className="w-full px-8 py-5 rounded-3xl border border-neutral-200 focus:border-black focus:ring-0 outline-none font-medium text-neutral-600 text-sm h-40 transition-all placeholder:text-neutral-200"
                     placeholder="Describe the essence of this creation..."
                   />
                </div>
            </div>

            <div className="md:col-span-4 space-y-6">
                <div className="relative group">
                   <label className="absolute left-6 -top-2.5 px-2 bg-white text-[10px] font-black text-neutral-400 uppercase tracking-widest">Base Price (৳)</label>
                   <input
                     type="number"
                     value={baseData.basePrice}
                     onChange={(e) => setBaseData({ ...baseData, basePrice: parseFloat(e.target.value) || 0 })}
                     className="w-full px-8 py-5 rounded-3xl border border-neutral-200 focus:border-black focus:ring-0 outline-none font-black text-neutral-900 text-2xl transition-all"
                   />
                </div>

                <div className="relative group">
                  <label className="absolute left-6 -top-2.5 px-2 bg-white text-[10px] font-black text-neutral-400 uppercase tracking-widest">Category <span className="text-rose-500">*</span></label>
                  <select
                    value={baseData.categoryId}
                    onChange={(e) => setBaseData({ ...baseData, categoryId: e.target.value })}
                    className="w-full px-8 py-5 rounded-3xl border border-neutral-200 focus:border-black focus:ring-0 outline-none appearance-none font-bold text-neutral-900 text-sm bg-neutral-50/50 transition-all"
                  >
                    <option value="">Choose Path</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
            </div>
        </div>

        {/* 3. INVENTORY & VARIANTS */}
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
               <div className="flex items-center gap-3">
                 <Package className="w-5 h-5 text-neutral-400" />
                 <h3 className="text-xs font-black text-neutral-900 uppercase tracking-[0.2em]">Inventory Logistics</h3>
               </div>
               
               {productMode === "multi-color" && (
                 <button
                   type="button"
                   onClick={addColor}
                   className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all"
                 >
                   <Plus className="w-3 h-3" />
                   Add Color
                 </button>
               )}
            </div>

            {productMode === "simple" ? (
               /* SIMPLE MODE UI */
               <div className="bg-neutral-50 p-10 rounded-[3rem] border border-neutral-100 space-y-6">
                  <div className="space-y-2 max-w-sm">
                     <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest px-4 block">Color (Optional)</label>
                     <input
                       type="text"
                       value={simpleColor}
                       onChange={(e) => setSimpleColor(e.target.value)}
                       className="w-full px-6 py-4 rounded-2xl border border-neutral-200 focus:border-black focus:ring-0 outline-none font-bold text-neutral-900 bg-white"
                       placeholder="Obsidian, Ruby, etc."
                     />
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-neutral-900 uppercase tracking-widest">
                           {isPerfume ? "Volumes & Pricing" : "Sizes & Inventory (Optional)"}
                        </label>
                        <button
                          type="button"
                          onClick={addSimpleVariant}
                          className="text-[9px] font-black text-neutral-400 hover:text-black uppercase tracking-widest flex items-center gap-1 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          {isPerfume ? "Add Volume" : "Add Size"}
                        </button>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {simpleVariants.map((sv, idx) => (
                           <div key={idx} className="bg-white p-4 rounded-2xl border border-neutral-200 flex items-center gap-4 group/size">
                              <div className="flex-1 space-y-2">
                                 <input
                                    type="text"
                                    value={sv.size}
                                    onChange={(e) => updateSimpleVariant(idx, "size", e.target.value)}
                                    className="w-full border-none focus:ring-0 p-0 text-xs font-black text-neutral-900 placeholder:text-neutral-200 uppercase"
                                    placeholder={isPerfume ? "Volume (e.g. 3ml)" : "SIZE (e.g. 42, L)"}
                                 />
                                 {isPerfume && (
                                   <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-medium text-neutral-300 uppercase tracking-widest">Price Override:</span>
                                      <input
                                        type="number"
                                        value={sv.price}
                                        onChange={(e) => updateSimpleVariant(idx, "price", e.target.value === "" ? "" : parseFloat(e.target.value))}
                                        placeholder={baseData.basePrice.toString()}
                                        className="w-full border-none focus:ring-0 p-0 text-[10px] font-black text-neutral-900 placeholder:text-neutral-200"
                                      />
                                   </div>
                                 )}
                                 <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-medium text-neutral-300 uppercase tracking-widest">Stock:</span>
                                    <input
                                      type="number"
                                      value={sv.stock}
                                      onChange={(e) => updateSimpleVariant(idx, "stock", e.target.value === "" ? "" : parseInt(e.target.value))}
                                      placeholder="Unlimited"
                                      className="w-full border-none focus:ring-0 p-0 text-[10px] font-black text-neutral-900 placeholder:text-neutral-200"
                                    />
                                 </div>
                              </div>
                              {simpleVariants.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeSimpleVariant(idx)}
                                  className="text-neutral-300 hover:text-rose-500 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            ) : (
               /* MULTI-COLOR MODE UI */
               <div className="space-y-10">
                  {colorVariations.length === 0 && (
                    <div className="py-20 text-center border-2 border-dashed border-neutral-200 rounded-[3rem] bg-neutral-50/50">
                       <Palette className="w-10 h-10 text-neutral-200 mx-auto mb-4" />
                       <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">No variations mapped</p>
                       <button onClick={addColor} className="mt-4 text-[10px] text-black font-black uppercase tracking-widest border-b border-black">Initialize First Color</button>
                    </div>
                  )}
                  {colorVariations.map((cv, cIdx) => (
                    <div key={cIdx} className="bg-neutral-50 p-8 rounded-[3rem] border border-neutral-100 relative group animate-in fade-in slide-in-from-bottom-4">
                       <button
                         type="button"
                         onClick={() => removeColor(cIdx)}
                         className="absolute -top-3 -right-3 w-10 h-10 bg-white border border-neutral-100 flex items-center justify-center text-rose-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>

                       <div className="flex flex-col lg:flex-row gap-10">
                          {/* Color Sidebar */}
                          <div className="lg:w-48 flex flex-col gap-4">
                             <div className="space-y-2">
                                <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest px-2 block text-center lg:text-left">Color Identity</label>
                                <input
                                  type="text"
                                  value={cv.colorName}
                                  onChange={(e) => updateColorName(cIdx, e.target.value)}
                                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-black outline-none font-black text-xs text-neutral-900 bg-white uppercase text-center lg:text-left"
                                  placeholder="e.g. Cobalt"
                                />
                             </div>
                             <div className="aspect-square w-full rounded-2xl bg-neutral-200 flex items-center justify-center overflow-hidden border border-neutral-100">
                                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Color Photo</span>
                             </div>
                          </div>

                          {/* Sizes Repeater */}
                          <div className="flex-1 space-y-4">
                             <div className="flex items-center justify-between mb-2">
                                <label className="text-[10px] font-black text-neutral-900 uppercase tracking-widest">Inventory Matrix (Sizes)</label>
                                <button
                                  type="button"
                                  onClick={() => addSizeToColor(cIdx)}
                                  className="text-[9px] font-black text-neutral-400 hover:text-black uppercase tracking-widest flex items-center gap-1 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                  Link Size
                                </button>
                             </div>
                             
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {cv.sizes.map((s, sIdx) => (
                                   <div key={sIdx} className="bg-white p-4 rounded-2xl border border-neutral-200 flex items-center gap-4 group/size">
                                      <div className="flex-1 space-y-1">
                                         <input
                                            type="text"
                                            value={s.sizeLabel}
                                            onChange={(e) => updateSizeField(cIdx, sIdx, "sizeLabel", e.target.value)}
                                            className="w-full border-none focus:ring-0 p-0 text-xs font-black text-neutral-900 placeholder:text-neutral-200 uppercase"
                                            placeholder="SIZE (e.g. XL)"
                                         />
                                         <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-medium text-neutral-300 uppercase tracking-widest">Stock:</span>
                                            <input
                                              type="number"
                                              value={s.stock}
                                              onChange={(e) => updateSizeField(cIdx, sIdx, "stock", parseInt(e.target.value) || 0)}
                                              className="w-16 border-none focus:ring-0 p-0 text-[10px] font-black text-neutral-900"
                                            />
                                         </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => removeSizeFromColor(cIdx, sIdx)}
                                        className="text-neutral-300 hover:text-rose-500 transition-colors"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            )}
        </div>

        {/* 4. VISUALS SECTION */}
        <div className="">
            <div className="flex items-center gap-3 mb-8 border-b border-neutral-100 pb-4">
              <span className="w-5 h-5 flex items-center justify-center bg-black text-white text-[8px] font-black rounded-full">PV</span>
              <h3 className="text-xs font-black text-neutral-900 uppercase tracking-[0.2em]">Visual Gallery</h3>
            </div>
            
            <div className="bg-neutral-50 p-8 rounded-[3rem] border border-neutral-100">
               <ImageUpload 
                 productId={initialData?.id}
                 existingImages={initialData?.images}
                 onUpload={onUpload || (async () => {})}
                 onChange={setSelectedFiles}
                 loading={loading}
               />
            </div>
        </div>

        {/* ERRORS */}
        {formError && (
          <div className="mx-auto max-w-lg bg-red-50 text-red-500 px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest border border-red-100 flex items-center justify-center gap-3 animate-bounce">
            <Trash2 className="w-4 h-4" />
            {formError}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-6 pt-12 border-t border-neutral-50">
           <button
             type="button"
             onClick={onCancel}
             className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300 hover:text-black transition-colors"
             disabled={loading}
           >
             Abandon Changes
           </button>
           <button
             type="submit"
             className="w-full sm:w-auto px-16 py-6 bg-black text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-full shadow-2xl shadow-neutral-400 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
             disabled={loading}
           >
             {loading ? "Processing..." : initialData ? "Synchronize" : "Project to Marketplace"}
           </button>
        </div>
      </div>
    </form>
  );
}
