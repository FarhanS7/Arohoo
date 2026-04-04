"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "./Footer";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  className?: string;
}

export default function PageLayout({ 
  children, 
  showFooter = true,
  className = ""
}: PageLayoutProps) {
  return (
    <main className={`min-h-screen bg-white selection:bg-primary/20 selection:text-primary pt-20 flex flex-col ${className}`}>
      <Navbar />
      
      <div className="flex-1">
        {children}
      </div>

      {showFooter && <Footer />}
    </main>
  );
}
