"use client";

import { useAuth } from "@/features/auth/auth.context";
import { LogOut, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCart } from "@/features/cart/hooks/useCart";

import { useState } from "react";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/merchant/signup";

  if (isAuthPage) return null;

  const navLinks = [
    { href: "/products", label: "Shop" },
    { href: "/brands", label: "Brands" },
    { href: "/malls", label: "Malls" },
    { href: "/offers", label: "Offers" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-[var(--navbar-height)] flex items-center">
      <div className="responsive-container flex items-center justify-between h-full">
        <div className="flex items-center gap-4 lg:gap-8">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 -ml-2 lg:hidden text-gray-600 hover:text-primary transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/" className="flex items-center">
            <Image 
              src="/arohoo_logo_v7.svg" 
              alt="Arohoo" 
              width={160} 
              height={40} 
              className="h-10 sm:h-12 w-auto object-contain" 
              priority
            />
          </Link>

          <div className="hidden lg:flex gap-6 text-[10px] uppercase font-black tracking-widest text-gray-500">
            {navLinks.map(link => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`hover:text-primary transition-colors ${pathname === link.href ? 'text-primary' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-6">
          <div className="hidden lg:flex items-center bg-gray-50 rounded-full px-4 py-2 w-64 border border-transparent focus-within:border-primary/20 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search brands, products..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 outline-none" 
            />
          </div>

          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-primary transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-1 sm:gap-4">
             <Link href="/cart" className="p-2 text-gray-600 hover:text-primary transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                    {itemCount}
                  </span>
                )}
             </Link>

            {user && (user.role === 'ADMIN' || user.role === 'MERCHANT') && (
              <Link 
                href={user.role === 'ADMIN' ? '/admin' : '/merchant'} 
                className="hidden md:flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 group"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform animate-pulse" />
                Dashboard
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-1 sm:gap-4">
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
                className="bg-primary text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 top-[var(--navbar-height)] bg-white z-40 transition-transform duration-300 transform lg:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col gap-8">
          <div className="flex flex-col gap-6 text-xl font-black uppercase tracking-tighter italic">
            {navLinks.map(link => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-primary transition-all active:scale-95"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-8 border-t border-gray-100">
             <Link 
                href="/merchant/signup" 
                onClick={() => setIsMenuOpen(false)}
                className="block w-full bg-zinc-900 text-white text-center py-4 rounded-2xl font-black uppercase tracking-widest text-xs"
             >
                Become a Merchant
             </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <div className={`fixed inset-x-0 top-[var(--navbar-height)] bg-white/95 backdrop-blur-xl border-b border-gray-100 z-40 p-4 transition-all duration-300 lg:hidden ${isSearchOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-primary/10">
          <Search className="w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search brands, products..." 
            className="bg-transparent border-none focus:ring-0 text-base w-full ml-3 outline-none" 
            autoFocus={isSearchOpen}
          />
        </div>
      </div>
    </nav>
  );
}

