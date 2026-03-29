import Hero from "@/components/sections/Hero";
import TrendingBrands from "@/components/sections/TrendingBrands";
import TrendingMalls from "@/components/sections/TrendingMalls";
import TrendingProducts from "@/components/sections/TrendingProducts";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-primary/20 selection:text-primary pt-20">
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Trending Brands */}
      <TrendingBrands />

      {/* Trending Malls */}
      <TrendingMalls />

      {/* Trending Products */}
      <TrendingProducts />

      {/* Basic Footer Placeholder */}
      <footer className="bg-gray-900 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <span className="text-3xl font-black tracking-tighter text-white italic mb-6 block">Arohoo</span>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              The premier multi-tenant ecommerce platform bringing the mall experience to your fingertips.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Become a Merchant</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Search Malls</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Delivery Options</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-6">Get updates on trending malls and exclusive offers.</p>
            <div className="flex bg-white/10 rounded-full p-1 border border-white/20 focus-within:border-primary/50 transition-all">
              <input type="text" placeholder="Email address" className="bg-transparent border-none outline-none text-sm px-4 flex-1" />
              <button className="bg-primary hover:bg-primary-hover px-6 py-2 rounded-full text-xs font-bold transition-all">Join</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-white/10 text-center text-gray-500 text-xs">
          © 2026 Arohoo. All rights reserved. Built with passion for modern commerce.
        </div>
      </footer>
    </main>
  );
}
