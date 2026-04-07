"use client";

import { useAuth } from "@/features/auth/auth.context";
import { LogOut, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCart } from "@/features/cart/hooks/useCart";

import { useState, useEffect } from "react";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/merchant/signup";

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  if (isAuthPage) return null;

  const navLinks = [
    { href: "/products", label: "Shop" },
    { href: "/brands", label: "Brands" },
    { href: "/malls", label: "Malls" },
    { href: "/offers", label: "Offers" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-neutral-100 h-[var(--navbar-height)] flex items-center">
      <div className="responsive-container flex items-center justify-between h-full">
        <div className="flex items-center gap-4 lg:gap-8">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 -ml-2 lg:hidden text-neutral-900 z-50"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/" className="flex items-center z-50">
            <Image 
              src="/arohoo_logo_v7.svg" 
              alt="Arohoo" 
              width={160} 
              height={40} 
              className="h-10 sm:h-12 w-auto object-contain" 
              priority
            />
          </Link>

          <div className="hidden lg:flex gap-6 text-[10px] uppercase font-black tracking-widest text-neutral-400">
            {navLinks.map(link => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={pathname === link.href ? 'text-primary' : ''}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-6">
          <div className="hidden lg:flex items-center bg-neutral-50 rounded-full px-4 py-2 w-64 border border-transparent focus-within:border-primary/20 focus-within:bg-white transition-colors">
            <Search className="w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search brands, products..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 outline-none" 
            />
          </div>

          <button 
            onClick={() => {
               setIsSearchOpen(!isSearchOpen);
               if (isMenuOpen) setIsMenuOpen(false);
            }}
            className="lg:hidden p-2 text-neutral-900"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-1 sm:gap-4">
             <Link href="/cart" className="p-2 text-neutral-900 relative">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
             </Link>

            {user && (user.role === 'ADMIN' || user.role === 'MERCHANT') && (
              <Link 
                href={user.role === 'ADMIN' ? '/admin' : '/merchant'} 
                className="hidden md:flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Dashboard
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-1 sm:gap-4">
                <Link 
                   href={user.role === 'MERCHANT' ? '/merchant/dashboard' : '/profile'} 
                   className="p-2 text-neutral-900"
                >
                  <User className="w-5 h-5" />
                </Link>
                <button 
                  onClick={logoutUser}
                  className="p-2 text-neutral-900 tooltip"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="bg-primary text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay - Full Screen Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-0 bg-white z-[40] lg:hidden animate-in fade-in duration-200">
          <div className="pt-[var(--navbar-height)] px-6 h-full flex flex-col justify-between pb-10">
            <div className="flex flex-col gap-6 pt-10">
              {navLinks.map(link => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-4xl font-black uppercase tracking-tighter italic text-neutral-900"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="space-y-4">
               {user ? (
                 <button 
                   onClick={() => { setIsMenuOpen(false); logoutUser(); }}
                   className="block w-full py-5 text-center text-xs font-black uppercase tracking-widest text-red-500 border-2 border-red-100 rounded-2xl"
                 >
                   Logout From Device
                 </button>
               ) : (
                 <Link 
                    href="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full bg-primary text-white text-center py-5 rounded-2xl font-black uppercase tracking-widest text-xs"
                 >
                    Member Login
                 </Link>
               )}
               <Link 
                  href="/merchant/signup" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full bg-neutral-900 text-white text-center py-5 rounded-2xl font-black uppercase tracking-widest text-xs"
               >
                  Become a Merchant
               </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-x-0 top-[var(--navbar-height)] bg-white border-b border-neutral-100 z-40 p-4 lg:hidden">
          <div className="flex items-center bg-neutral-50 rounded-xl px-4 py-4 border border-primary/10">
            <Search className="w-5 h-5 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search brands, products..." 
              className="bg-transparent border-none focus:ring-0 text-base w-full ml-3 outline-none font-bold" 
              autoFocus
            />
            <button onClick={() => setIsSearchOpen(false)} className="text-neutral-400">
               <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
