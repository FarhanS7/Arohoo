"use client";

import { useAuth } from "@/features/auth/auth.context";
import { LayoutDashboard, Store, LogOut, User, Package, ShoppingBag, Settings, ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
import Image from "next/image";

interface NavItem {
  href: string;
  label: string;
  icon: any;
}

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  title: string;
}

export default function DashboardLayout({ children, navItems, title }: DashboardLayoutProps) {
  const { user, logoutUser } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 lg:w-72 bg-white border-r border-neutral-100 flex flex-col fixed inset-y-0 left-0 z-50
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}>
        {/* Mobile close button */}
        <button 
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-5 right-4 p-2 text-neutral-400 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 lg:p-8 pb-8 lg:pb-12">
          <Link href="/" className="flex items-center gap-2 group">
             <Image 
                src="/arohoo_logo_v7.svg" 
                alt="Arohoo" 
                width={120} 
                height={30} 
                className="h-7 lg:h-8 w-auto object-contain transition-transform group-hover:scale-105" 
                priority
              />
          </Link>
        </div>

        <nav className="flex-1 px-4 lg:px-6 space-y-1">
          <div className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.2em] mb-4 px-4">Management</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 lg:py-3.5 rounded-2xl transition-all group ${
                  isActive 
                    ? "bg-black text-white shadow-xl shadow-black/10" 
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-black"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-4 h-4 ${isActive ? "text-white" : "text-neutral-400 group-hover:text-black"}`} />
                  <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3 h-3 text-white/50" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 lg:p-6 mt-auto">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-4 lg:py-6 rounded-2xl lg:rounded-3xl bg-neutral-900 border border-neutral-800 text-white hover:bg-black transition-all mb-4 group shadow-2xl shadow-neutral-200"
          >
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl lg:rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
              <Store className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 leading-none mb-1">Store Front</p>
              <p className="text-xs font-bold">View Website</p>
            </div>
          </Link>

          <div className="flex items-center justify-between px-3 lg:px-4 py-2 bg-neutral-50 rounded-xl lg:rounded-2xl border border-neutral-100">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-neutral-200 flex items-center justify-center">
                <User className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-neutral-500" />
              </div>
              <div className="max-w-[80px]">
                <p className="text-[10px] font-black truncate">{user?.id.slice(0, 8)}</p>
                <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">{user?.role}</p>
              </div>
            </div>
            <button 
              onClick={logoutUser}
              className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-72 min-w-0">
        <header className="h-14 lg:h-[72px] bg-white/80 backdrop-blur-md border-b border-neutral-100 px-4 lg:px-10 flex items-center sticky top-0 z-30">
          {/* Mobile hamburger */}
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 mr-3 text-neutral-600 hover:text-black"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-xs lg:text-sm font-black uppercase tracking-[0.15em] lg:tracking-[0.2em] text-neutral-400 truncate">
            Dashboard / <span className="text-black italic">{title}</span>
          </h2>
        </header>
        <div className="p-4 sm:p-6 lg:p-10 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
          {children}
        </div>
      </main>
    </div>
  );
}

