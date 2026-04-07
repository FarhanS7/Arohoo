"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "./Footer";
import BackButton from "./BackButton";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  showBackButton?: boolean;
  className?: string;
}

export default function PageLayout({ 
  children, 
  showFooter = true,
  showBackButton = false,
  className = ""
}: PageLayoutProps) {
  return (
    <main className={`min-h-screen bg-white selection:bg-primary/20 selection:text-primary flex flex-col ${className}`} style={{ paddingTop: 'var(--navbar-height)' }}>
      <Navbar />
      
      <div className="flex-1 w-full overflow-x-hidden">
        {showBackButton && (
          <div className="responsive-container pt-8 pb-2">
            <BackButton />
          </div>
        )}
        {children}
      </div>

      {showFooter && <Footer />}
    </main>
  );
}
