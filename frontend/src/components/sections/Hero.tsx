"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-white md:bg-[#FCFBFF] flex flex-col items-center justify-center">
      <h1 className="sr-only">Shop the Mall from your home - Discover leading brands in one place</h1>
      
      {/* Main Banner Image Container - Wraps the image tightly with no gap */}
      <div className="relative w-full max-w-[1920px] mx-auto flex items-center justify-center group overflow-hidden">
         <Image
          src="/images/new-hero-banner.png"
          alt="Arohoo Hero - Shop the Mall from your home"
          width={1920}
          height={768}
          className="w-full h-auto min-h-[250px] sm:min-h-0 lg:max-h-[650px] object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-[1.02]"
          priority
        />
        
        {/* Floating Search Bar - Positioned dynamically on the banner */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-12 inset-x-0 z-10 px-4 sm:px-6 animate-slide-up">
          <div className="max-w-2xl mx-auto flex items-center bg-white/90 backdrop-blur-xl rounded-2xl md:rounded-[2rem] shadow-[0_15px_40px_-10px_rgba(110,40,180,0.25)] md:shadow-[0_20px_50px_-12px_rgba(110,40,180,0.35)] p-2 md:p-3 border border-purple-200/60 group/search transition-all duration-300 hover:shadow-[0_20px_50px_-12px_rgba(110,40,180,0.45)] hover:bg-white/95 hover:border-purple-300/80">
              <div className="pl-3 md:pl-4 pr-2 md:pr-3 py-2 text-purple-700/80 transition-colors group-hover/search:text-purple-700">
                 <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <input 
                type="text" 
                placeholder="What can we deliver to you today?" 
                className="flex-1 bg-transparent border-none outline-none text-purple-950 text-[13px] sm:text-sm md:text-[1.05rem] font-medium placeholder:text-purple-400/80 py-2"
              />
              <div className="hidden md:block h-8 w-[1px] bg-purple-200/60 mx-3" />
              <button className="pr-3 md:pr-4 pl-2 md:pl-3 py-2 text-purple-700 hover:text-purple-900 transition-all hover:scale-110 active:scale-95 flex items-center justify-center">
                 <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
              </button>
          </div>
        </div>
      </div>
      
      {/* Bottom Transition */}
      <div className="absolute bottom-0 inset-x-0 h-8 md:h-16 bg-gradient-to-t from-white to-transparent z-5 pointer-events-none" />
    </section>
  );
}
