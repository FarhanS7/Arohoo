import { ArrowRight, Store } from "lucide-react";
import Link from "next/link";

export default function MerchantCTA() {
  return (
    <section className="fluid-py relative overflow-hidden bg-neutral-50 border-t border-neutral-100">
      <div className="absolute inset-0 bg-grid-slate-900/[0.02] bg-[bottom_1px_center] pointer-events-none" />
      
      <div className="responsive-container relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Store className="w-4 h-4" />
            <span>Partner With Arohoo</span>
          </div>
          <h2 className="text-3xl md:text-6xl font-black tracking-tighter text-neutral-900 uppercase italic leading-none">
            Take Your Business <br className="hidden md:block" />
            <span className="text-primary">
              To The Next Level
            </span>
          </h2>
          <p className="text-base md:text-lg text-neutral-500 max-w-xl mx-auto md:mx-0 font-medium italic">
            Open your digital storefront in our premier multi-tenant mall. Connect with thousands of daily shoppers and grow your sales effortlessly.
          </p>
        </div>
        
        <div className="md:w-auto w-full flex flex-col sm:flex-row items-center gap-4 justify-center">
          <Link 
            href="/merchant/signup"
            className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-primary/20"
          >
            Become a Merchant
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/merchant/login"
            className="w-full sm:w-auto px-10 py-5 bg-white text-neutral-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border-2 border-neutral-100 flex items-center justify-center"
          >
          Merchant Login 
          </Link>
        </div>
      </div>
    </section>
  );
}
