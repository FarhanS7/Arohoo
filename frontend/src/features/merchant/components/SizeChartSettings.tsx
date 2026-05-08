"use client";

import { useState } from "react";
import { Camera, Loader2, Ruler, CheckCircle2, Trash2 } from "lucide-react";
import Image from "next/image";
import { updateMerchantProfile, uploadSizeChart } from "@/lib/api/merchant";
import { useToastContext } from "@/components/providers/ToastProvider";

interface SizeChartSettingsProps {
  initialData: {
    sizeChartUrl?: string;
    storeName: string;
  };
}

export default function SizeChartSettings({ initialData }: SizeChartSettingsProps) {
  const { addToast } = useToastContext();
  const [sizeChartUrl, setSizeChartUrl] = useState(initialData.sizeChartUrl);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadSizeChart(file);
      setSizeChartUrl(res.sizeChartUrl);
      addToast("success", "Size chart updated successfully");
    } catch (error: any) {
      addToast("error", error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await updateMerchantProfile({ sizeChartUrl: null });
      setSizeChartUrl(undefined);
      addToast("success", "Size chart removed");
    } catch (error: any) {
      addToast("error", error.message || "Failed to remove size chart");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="space-y-12 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-xl shadow-neutral-100 overflow-hidden p-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Ruler className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight uppercase italic">Size Guide Management</h2>
            <p className="text-neutral-500 font-medium text-sm">Upload a universal size chart for your store products.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <div className="bg-neutral-50 rounded-3xl p-6 border border-neutral-100">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-4">Guidelines</h3>
              <ul className="space-y-3">
                {[
                  "Use high-resolution clear images",
                  "Include both CM and Inches if possible",
                  "Ensure text is readable on mobile",
                  "Supported: JPG, PNG, WEBP (Max 5MB)"
                ].map((tip, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-bold text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <label className="block">
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleUpload} 
                disabled={uploading} 
              />
              <div className="w-full py-6 border-2 border-dashed border-neutral-200 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-neutral-50 hover:border-primary/30 transition-all cursor-pointer group">
                {uploading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                ) : (
                  <Camera className="w-8 h-8 text-neutral-300 group-hover:text-primary transition-colors" />
                )}
                <span className="text-xs font-black uppercase tracking-widest text-neutral-400 group-hover:text-neutral-600">
                  {sizeChartUrl ? "Replace Size Chart" : "Upload Size Chart"}
                </span>
              </div>
            </label>

            {sizeChartUrl && (
              <button
                onClick={handleRemove}
                disabled={removing}
                className="w-full py-4 rounded-2xl border-2 border-red-50 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2"
              >
                {removing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Remove Size Chart
              </button>
            )}
          </div>

          <div className="relative aspect-[3/4] bg-neutral-50 rounded-3xl overflow-hidden border border-neutral-100 shadow-inner group">
            {sizeChartUrl ? (
              <Image 
                src={sizeChartUrl} 
                alt="Size Chart Preview" 
                fill 
                className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-neutral-300">
                <Ruler className="w-16 h-16 mb-4 opacity-20" />
                <span className="text-xs font-black uppercase tracking-widest">No Preview Available</span>
              </div>
            )}
            
            {sizeChartUrl && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <span className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Preview Mode</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
