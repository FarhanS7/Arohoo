import Link from "next/link";
import { ArrowRight, Store } from "lucide-react";

export default function MerchantCTA() {
  return (
    <section className="py-20 relative overflow-hidden bg-primary/5">
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] opacity-20 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
            <Store className="w-4 h-4" />
            <span>Partner With Arohoo</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
            Take Your Business <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
              To The Next Level
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto md:mx-0">
            Open your digital storefront in our premier multi-tenant mall. Connect with thousands of daily shoppers and grow your sales effortlessly.
          </p>
        </div>
        
        <div className="md:w-auto w-full flex flex-col sm:flex-row items-center gap-4 justify-center">
          <Link 
            href="/merchant/signup"
            className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-hover hover:scale-105 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 group"
          >
            Become a Merchant
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/merchant/login"
            className="w-full sm:w-auto px-8 py-4 bg-white text-primary rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all border border-primary/20 flex items-center justify-center"
          >
            Login to Dashboard
          </Link>
        </div>
      </div>
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
}
