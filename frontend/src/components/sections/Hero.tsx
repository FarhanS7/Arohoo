"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#1a0b2e] h-[calc(100vh-80px)] min-h-[500px] flex flex-col items-center justify-center">
      {/* Main Banner Image - Responsive Fit */}
      <div className="relative w-full h-full flex items-center justify-center group">
         <Image
          src="/images/hero_main.jpg"
          alt="Arohoo Hero"
          fill
          className="object-contain md:object-cover md:object-top transition-transform duration-[2000ms] ease-out group-hover:scale-[1.02]"
          priority
        />
        
        {/* Floating Search Bar - Positioned over the lower part of the content */}
        <div className="absolute bottom-12 md:bottom-20 inset-x-0 z-10 px-6 animate-slide-up">
          <div className="max-w-3xl mx-auto flex items-center bg-white/95 backdrop-blur-md rounded-2xl md:rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] p-2 border border-white/20 group/search">
              <div className="pl-5 pr-3 py-3 text-primary opacity-60">
                 <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <input 
                type="text" 
                placeholder="What can we deliver to you today?" 
                className="flex-1 bg-transparent border-none outline-none text-gray-900 text-base md:text-xl font-semibold placeholder:text-gray-400 py-2.5"
              />
              <div className="hidden md:block h-10 w-[1px] bg-gray-200/50 mx-3" />
              <button className="pr-5 pl-3 py-3 text-primary hover:scale-110 transition-transform">
                 <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
              </button>
          </div>
        </div>
      </div>
      
      {/* Bottom Transition - Fade to white to blend with next section */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white to-transparent z-5 pointer-events-none" />
    </section>
  );
}
