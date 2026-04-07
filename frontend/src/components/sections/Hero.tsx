"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full bg-white flex flex-col items-center justify-center">
      <h1 className="sr-only">Shop the Mall from your home - Discover leading brands in one place</h1>
      
      {/* Container aligned with Navbar (max-width: 1280px) to fix "odd" layout */}
      <div className="responsive-container w-full">
        <div className="relative w-full aspect-[16/10] sm:aspect-[2.5/1] xl:h-[calc(100vh-160px)] xl:max-h-[600px] flex items-center justify-center overflow-hidden bg-neutral-50 rounded-[2rem] sm:rounded-[3rem] mt-6 sm:mt-10 border border-neutral-100">
           <Image
            src="/images/new-hero-banner.png"
            alt="Arohoo Hero - Shop the Mall from your home"
            fill
            className="object-cover object-[25%_center] sm:object-center"
            priority
          />

          {/* Floating Search Bar - Styled to look plain and premium */}
          <div className="absolute bottom-6 sm:bottom-8 md:bottom-12 inset-x-0 z-10 px-4 sm:px-12">
            <div className="max-w-2xl mx-auto flex items-center bg-white rounded-2xl md:rounded-[2rem] shadow-2xl p-1.5 md:p-3 border border-neutral-100 w-full">
                <div className="pl-3 md:pl-4 pr-2 md:pr-3 py-1.5 md:py-2 text-neutral-400">
                   <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Find brands or products..." 
                  className="flex-1 bg-transparent border-none outline-none text-neutral-900 text-[clamp(0.7rem,1.8vw,0.95rem)] font-bold placeholder:text-neutral-300 py-1.5 md:py-2"
                />
                <div className="hidden md:block h-8 w-[1px] bg-neutral-100 mx-3" />
                <button className="pr-3 md:pr-4 pl-2 md:pl-3 py-1.5 md:py-2 text-neutral-900 flex items-center justify-center">
                   <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
