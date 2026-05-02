"use client";
import { Mic, Search } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full mb-8 sm:mb-12" id="hero-section">
      <h1 className="sr-only">
        Discover curated brands & seamless delivery — all from one place.
      </h1>

      {/* ── Banner Container ─────────────────── */}
      <div 
        className="relative w-full h-[32vh] min-h-[280px] max-h-[450px] sm:h-[45vh] lg:h-[50vh] overflow-hidden sm:rounded-b-[2.5rem] bg-purple-50"
      >
        <Image
          src="/images/new-hero-banner-2.png"
          alt="Arohoo Hero"
          fill
          className="object-cover object-center opacity-85"
          priority
          sizes="100vw"
        />

        {/* Theme color overlay to subtly tint the image to Arohoo primary purple */}
        <div className="absolute inset-0 bg-primary mix-blend-color opacity-10 pointer-events-none" />

        {/* ── Hero content — Central Clean White Card ──────────────────── */}
        {/* This perfectly frames the empty center of the image without covering the side illustrations */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="bg-white/75 backdrop-blur-3xl py-5 px-6 sm:py-6 sm:px-8 rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.12)] max-w-3xl w-[95%] sm:w-full text-center animate-[fadeSlideUp_0.8s_ease-out_both] border border-white/70">
            
            <div className="inline-block px-3 py-1 bg-neutral-100 rounded-full mb-2">
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-neutral-900">
                Welcome to Arohoo
              </p>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 leading-[1.1] mb-2">
              Your Premium <br />
              <span className="text-primary">Lifestyle</span> Destination
            </h2>
            
            <p className="text-xs sm:text-sm font-semibold text-neutral-500 mb-4 max-w-md mx-auto leading-relaxed">
              Shop curated brands, beauty essentials, and fashion statements seamlessly.
            </p>

            {/* ── Integrated Search Bar ─────────────────────────────── */}
            <div className="flex items-center rounded-full p-1.5 h-12 max-w-2xl mx-auto w-full bg-white/90 border border-neutral-200 shadow-sm transition-all duration-300 focus-within:border-primary/40 focus-within:bg-white focus-within:shadow-[0_8px_30px_rgba(83,0,183,0.12)] hover:border-primary/30">
              <div className="pl-4 pr-3 text-primary">
                <Search className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <input
                type="text"
                placeholder="Search brands, products..."
                className="flex-1 bg-transparent border-none outline-none text-neutral-900 text-sm font-bold placeholder:text-neutral-400 placeholder:font-medium h-full w-full"
                suppressHydrationWarning
              />
              <div className="h-5 w-[2px] bg-neutral-100 mx-2" />
              <button
                className="p-1.5 mr-1 rounded-full bg-neutral-50 text-primary transition-all hover:bg-primary/10 hover:scale-105"
                aria-label="Voice search"
              >
                <Mic className="w-4 h-4" fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
