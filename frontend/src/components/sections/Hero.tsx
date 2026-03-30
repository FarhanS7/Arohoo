"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FCFBFF] flex flex-col items-center justify-center">
      <h1 className="sr-only">Shop the Mall from your home - Discover leading brands in one place</h1>
      
      {/* Main Banner Image Container - Adjusted Height */}
      <div className="relative w-full max-w-[1920px] mx-auto min-h-[350px] md:min-h-[500px] lg:min-h-[600px] lg:h-[calc(100vh-120px)] max-h-[650px] flex items-center justify-center group overflow-hidden">
         <Image
          src="/images/new-hero-banner.png"
          alt="Arohoo Hero - Shop the Mall from your home"
          fill
          className="object-cover object-center transition-transform duration-[2000ms] ease-out group-hover:scale-[1.02]"
          priority
        />
        
        {/* Floating Search Bar - Styled to match the premium purple theme */}
        <div className="absolute bottom-6 md:bottom-12 inset-x-0 z-10 px-4 sm:px-6 animate-slide-up">
          <div className="max-w-2xl mx-auto flex items-center bg-white/85 backdrop-blur-xl rounded-2xl md:rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(110,40,180,0.35)] p-2 md:p-3 border border-purple-200/60 group/search transition-all duration-300 hover:shadow-[0_20px_50px_-12px_rgba(110,40,180,0.5)] hover:bg-white/95 hover:border-purple-300/80">
              <div className="pl-4 pr-3 py-2 text-purple-700/80 transition-colors group-hover/search:text-purple-700">
                 <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <input 
                type="text" 
                placeholder="What can we deliver to you today?" 
                className="flex-1 bg-transparent border-none outline-none text-purple-950 text-sm md:text-[1.05rem] font-medium placeholder:text-purple-400/80 py-2"
              />
              <div className="hidden md:block h-8 w-[1px] bg-purple-200/60 mx-3" />
              <button className="pr-4 pl-3 py-2 text-purple-700 hover:text-purple-900 transition-all hover:scale-110 active:scale-95 flex items-center justify-center">
                 <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
              </button>
          </div>
        </div>
      </div>
      
      {/* Bottom Transition - Fade to blend with next section (white background below) */}
      <div className="absolute bottom-0 inset-x-0 h-16 md:h-24 bg-gradient-to-t from-white via-white/80 to-transparent z-5 pointer-events-none" />
    </section>
  );
}
