"use client";

import { useAuth } from "@/features/auth/auth.context";
import { LayoutDashboard, Store, LogOut, User, Package, ShoppingBag, Settings, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
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

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-neutral-100 flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-8 pb-12">
          <Link href="/" className="flex items-center gap-2 group">
             <Image 
                src="/arohoo_logo_v7.svg" 
                alt="Arohoo" 
                width={120} 
                height={30} 
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105" 
                priority
              />
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-1">
          <div className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.2em] mb-4 px-4">Management</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${
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

        <div className="p-6 mt-auto">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-6 rounded-3xl bg-neutral-900 border border-neutral-800 text-white hover:bg-black transition-all mb-4 group shadow-2xl shadow-neutral-200"
          >
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 leading-none mb-1">Store Front</p>
              <p className="text-xs font-bold">View Website</p>
            </div>
          </Link>

          <div className="flex items-center justify-between px-4 py-2 bg-neutral-50 rounded-2xl border border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
                <User className="w-4 h-4 text-neutral-500" />
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
      <main className="flex-1 pl-72">
        <header className="h-[72px] bg-white/80 backdrop-blur-md border-b border-neutral-100 px-10 flex items-center sticky top-0 z-40">
           <h2 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-400">Dashboard / <span className="text-black italic">{title}</span></h2>
        </header>
        <div className="p-10 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
          {children}
        </div>
      </main>
    </div>
  );
}
