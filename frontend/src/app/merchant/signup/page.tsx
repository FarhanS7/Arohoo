"use client";

import Navbar from "@/components/layout/Navbar";
import { useToastContext } from "@/components/providers/ToastProvider";
import { Category, categoryService } from "@/lib/api/categories";
import { api } from "@/lib/api/client";
import { Check, ChevronRight, Lock, Mail, MapPin, Phone, Store, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Merchant Signup Page
 * Allows new merchants to register their account and shop details.
 * Features a multi-category selection and modern UI.
 */
export default function MerchantSignupPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToastContext();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    storeName: "",
    address: "",
    phone: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await categoryService.getPublicCategories();
        if (res.success) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories();
  }, []);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategories.length === 0) {
      addToast("error", "Please select at least one category");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register-merchant", {
        ...formData,
        categoryIds: selectedCategories,
      });

      addToast("success", "Registration submitted! Please wait for admin approval.");
      router.push("/login");
    } catch (error: any) {
      addToast("error", error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 selection:bg-primary/20">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col md:flex-row border border-gray-100">
          {/* Left Side Backdrop - Premium Info */}
          <div className="md:w-1/3 bg-[#1a0b2e] p-12 text-white flex flex-col justify-center relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-black mb-6 leading-tight">Empower Your Business</h1>
              <p className="opacity-70 mb-8 text-sm leading-relaxed">
                Join Arohoo's premium multi-tenant marketplace and reach millions of customers instantly.
              </p>
              <ul className="space-y-5">
                {[
                  "Rapid Store Launch",
                  "Advanced Analytics",
                  "Verified Badge",
                  "Priority Support"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-xs font-semibold opacity-90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Decors */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -ml-12 -mb-12" />
          </div>

          {/* Right Side - Form Container */}
          <div className="flex-1 p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-widest font-black text-gray-400 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Alex Johnson"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:border-primary/20 focus:bg-white rounded-xl transition-all outline-none text-sm font-medium"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-widest font-black text-gray-400 ml-1">Shop Name</label>
                  <div className="relative group">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Trendy Collections"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:border-primary/20 focus:bg-white rounded-xl transition-all outline-none text-sm font-medium"
                      value={formData.storeName}
                      onChange={e => setFormData({...formData, storeName: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-widest font-black text-gray-400 ml-1">Shop Address</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    required
                    placeholder="Physical location of your store"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:border-primary/20 focus:bg-white rounded-xl transition-all outline-none text-sm font-medium"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-widest font-black text-gray-400 ml-1">Mobile Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="tel" 
                      required
                      placeholder="+880 1XXX-XXXXXX"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:border-primary/20 focus:bg-white rounded-xl transition-all outline-none text-sm font-medium"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-widest font-black text-gray-400 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="email" 
                      required
                      placeholder="merchant@aroohoo.com"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:border-primary/20 focus:bg-white rounded-xl transition-all outline-none text-sm font-medium"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-widest font-black text-gray-400 ml-1">Secure Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="password" 
                    required
                    placeholder="Min. 8 characters"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:border-primary/20 focus:bg-white rounded-xl transition-all outline-none text-sm font-medium"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] uppercase tracking-widest font-black text-gray-400 ml-1 block">Business Categories</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryToggle(cat.id)}
                      className={`px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        selectedCategories.includes(cat.id)
                          ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 bg-gradient-to-br from-primary to-primary-hover"
                          : "bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Submit
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        
        <p className="text-center mt-8 text-gray-400 text-xs font-medium">
          Already a partner? <Link href="/login" className="text-primary font-bold hover:underline">Log in to your dashboard</Link>
        </p>
      </div>
    </div>
  );
}
