"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full bg-white flex flex-col items-center justify-center">
      <h1 className="sr-only">Shop the Mall from your home - Discover leading brands in one place</h1>
      
      {/* Responsive aspect-ratio container to ensure banner is shown fully without extreme cropping */}
      <div className="relative w-full max-w-[1920px] mx-auto aspect-[16/10] sm:aspect-[2.5/1] xl:h-[calc(100vh-120px)] xl:max-h-[700px] flex items-center justify-center group overflow-hidden bg-[#fdfcfa]">
         <Image
          src="/images/new-hero-banner.png"
          alt="Arohoo Hero - Shop the Mall from your home"
          fill
          className="object-cover object-[25%_center] sm:object-center transition-transform duration-[2000ms] ease-out group-hover:scale-[1.02]"
          priority
        />

        {/* Floating Search Bar - Positioned closely to the bottom of the visible banner */}
        <div className="absolute bottom-6 sm:bottom-8 md:bottom-12 inset-x-0 z-10 px-4 sm:px-6 animate-slide-up">
          <div className="max-w-2xl mx-auto flex items-center bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-[2rem] shadow-[0_15px_40px_-10px_rgba(110,40,180,0.3)] md:shadow-[0_20px_50px_-12px_rgba(110,40,180,0.35)] p-1.5 md:p-3 border border-purple-200/60 group/search transition-all duration-300 hover:shadow-[0_20px_50px_-12px_rgba(110,40,180,0.45)] hover:border-purple-300/80 w-full">
              <div className="pl-3 md:pl-4 pr-2 md:pr-3 py-1.5 md:py-2 text-purple-700/80 transition-colors group-hover/search:text-purple-700">
                 <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <input 
                type="text" 
                placeholder="Find brands or products..." 
                className="flex-1 bg-transparent border-none outline-none text-purple-950 text-[clamp(0.75rem,2vw,1.05rem)] font-bold placeholder:text-purple-400/80 py-1.5 md:py-2"
              />
              <div className="hidden md:block h-8 w-[1px] bg-purple-200/60 mx-3" />
              <button className="pr-3 md:pr-4 pl-2 md:pl-3 py-1.5 md:py-2 text-purple-700 hover:text-purple-900 transition-all hover:scale-110 active:scale-95 flex items-center justify-center">
                 <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
              </button>
          </div>
        </div>
      </div>
    </section>
  );
}
