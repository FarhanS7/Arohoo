"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 py-20 text-white border-t border-white/5">
      <div className="responsive-container grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="mb-8 block">
            <span className="text-4xl font-black tracking-tighter text-white italic uppercase">Arohoo</span>
          </Link>
          <p className="text-neutral-500 text-xs font-medium leading-relaxed mb-8 italic">
            The premier multi-tenant ecommerce platform bringing the mall experience to your fingertips. Hand-curated for the modern lifestyle.
          </p>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-neutral-500">Quick Links</h4>
          <ul className="space-y-4 text-white/60 text-[10px] font-black uppercase tracking-widest">
            <li><Link href="/merchant/signup">Become a Merchant</Link></li>
            <li><Link href="/malls">Search Malls</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-neutral-500">Support</h4>
          <ul className="space-y-4 text-white/60 text-[10px] font-black uppercase tracking-widest">
            <li><Link href="/help">Help Center</Link></li>
            <li><Link href="/delivery">Delivery Options</Link></li>
            <li><Link href="/returns">Return Policy</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-neutral-500">Newsletter</h4>
          <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest leading-relaxed mb-6">Get updates on trending malls and exclusive offers.</p>
          <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10">
            <input type="text" placeholder="Email address" className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest px-4 flex-1 text-white placeholder:text-neutral-700" suppressHydrationWarning />
            <button className="bg-white text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Join</button>
          </div>
        </div>
      </div>
      <div className="responsive-container mt-24 pt-8 border-t border-white/5 text-center text-neutral-700 text-[9px] font-black uppercase tracking-[0.4em]">
        © 2026 Arohoo. All rights reserved. Built with passion for modern commerce.
      </div>
    </footer>
  );
}
