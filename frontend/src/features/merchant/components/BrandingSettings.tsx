"use client";

import { useState } from "react";
import { Camera, Store, FileText, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { updateMerchantProfile, uploadMerchantLogo, uploadMerchantBanner } from "@/lib/api/merchant";
import { useToastContext } from "@/components/providers/ToastProvider";

interface BrandingSettingsProps {
  initialData: {
    storeName: string;
    description: string;
    logo?: string;
    bannerUrl?: string;
    address?: string;
  };
}

export default function BrandingSettings({ initialData }: BrandingSettingsProps) {
  const { addToast } = useToastContext();
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateMerchantProfile({
        storeName: formData.storeName,
        description: formData.description,
        address: formData.address
      });
      addToast("success", "Profile updated successfully");
    } catch (error: any) {
      addToast("error", error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const res = await uploadMerchantLogo(file);
      setFormData(prev => ({ ...prev, logo: res.logo }));
      addToast("success", "Logo updated successfully");
    } catch (error: any) {
      addToast("error", error.message || "Logo upload failed");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    try {
      const res = await uploadMerchantBanner(file);
      setFormData(prev => ({ ...prev, bannerUrl: res.bannerUrl }));
      addToast("success", "Banner updated successfully");
    } catch (error: any) {
      addToast("error", error.message || "Banner upload failed");
    } finally {
      setUploadingBanner(false);
    }
  };

  const getImageUrl = (url?: string) => {
    if (!url) return null;
    return url; // Cloudinary returns full secure URLs
  };

  return (
    <div className="space-y-12 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Branding Section */}
      <section className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-xl shadow-neutral-100 overflow-hidden">
        <div className="relative h-64 bg-neutral-50 group">
          {formData.bannerUrl ? (
            <Image 
              src={getImageUrl(formData.bannerUrl)!} 
              alt="Store Banner" 
              fill 
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-300">
              <Camera className="w-12 h-12 mb-2" />
              <span className="text-xs font-black uppercase tracking-widest">No Store Banner</span>
            </div>
          )}
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
            <input type="file" className="hidden" accept="image/*" onChange={handleBannerUpload} disabled={uploadingBanner} />
            <div className="bg-white text-black px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
              {uploadingBanner ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              {formData.bannerUrl ? "Change Banner" : "Upload Banner"}
            </div>
          </label>
        </div>

        <div className="px-10 pb-10 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="relative w-32 h-32 rounded-[2rem] bg-white border-4 border-white shadow-2xl overflow-hidden group">
              {formData.logo ? (
                <Image 
                  src={getImageUrl(formData.logo)!} 
                  alt="Store Logo" 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-white font-black text-3xl">
                  {formData.storeName.substring(0, 1).toUpperCase()}
                </div>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={uploadingLogo} />
                <Camera className="w-6 h-6 text-white" />
              </label>
              {uploadingLogo && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-black" />
                </div>
              )}
            </div>
            <div className="mb-4">
              <h2 className="text-3xl font-black text-neutral-900 tracking-tighter uppercase italic leading-none">{formData.storeName}</h2>
              <p className="text-neutral-500 font-bold text-sm mt-1 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Verified Merchant
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Form */}
      <section className="bg-neutral-50 rounded-[2.5rem] p-10 border border-neutral-100">
        <form onSubmit={handleUpdateProfile} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Store Name */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">
                <Store className="w-3 h-3" /> Store Name
              </label>
              <input 
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData(prev => ({ ...prev, storeName: e.target.value }))}
                className="w-full bg-white border border-neutral-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                placeholder="The House of Arohoo"
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">
                <MapPin className="w-3 h-3" /> Business Address
              </label>
              <input 
                type="text"
                value={formData.address || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full bg-white border border-neutral-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                placeholder="123 Fashion Ave, Dhaka"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">
              <FileText className="w-3 h-3" /> Brand Story / Description
            </label>
            <textarea 
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-white border border-neutral-200 rounded-3xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all resize-none"
              placeholder="Tell your customers about your brand..."
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-12 py-5 bg-black text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-200 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Save Profile Changes
          </button>
        </form>
      </section>
    </div>
  );
}
