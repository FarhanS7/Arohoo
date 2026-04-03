"use client";

import { useAuth } from "@/features/auth/auth.context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, Search, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const pathname = usePathname();

  // Don't show navbar on login/register pages if they are separate full-screen experiences
  // But for now, let's keep it consistent.
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/merchant/signup";

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl sm:text-2xl font-black tracking-tighter text-primary italic">Arohoo</Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
            <Link href="/products" className="hover:text-primary transition-colors">Shop</Link>
            <Link href="/brands" className="hover:text-primary transition-colors">Brands</Link>
            <Link href="/malls" className="hover:text-primary transition-colors">Malls</Link>
            <Link href="/offers" className="hover:text-primary transition-colors">Offers</Link>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center bg-gray-50 rounded-full px-4 py-2 w-64 border border-transparent focus-within:border-primary/20 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search brands, products..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 outline-none" 
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/cart" className="p-2 text-gray-600 hover:text-primary transition-colors relative">
               <ShoppingCart className="w-5 h-5" />
               <span className="absolute top-1 right-1 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                   href={user.role === 'MERCHANT' ? '/merchant/dashboard' : '/profile'} 
                   className="p-2 text-gray-600 hover:text-primary transition-colors"
                >
                  <User className="w-5 h-5" />
                </Link>
                <button 
                  onClick={logoutUser}
                  className="p-2 text-gray-600 hover:text-red-500 transition-colors tooltip"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
