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
        className="relative w-full h-[45vh] min-h-[400px] max-h-[600px] sm:h-[55vh] lg:h-[65vh] overflow-hidden sm:rounded-b-[3rem] bg-purple-50"
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
        <div className="absolute inset-0 bg-primary mix-blend-color opacity-15 pointer-events-none" />

        {/* ── Hero content — Central Clean White Card ──────────────────── */}
        {/* This perfectly frames the empty center of the image without covering the side illustrations */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="bg-white/70 backdrop-blur-2xl p-8 sm:p-12 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.15)] max-w-2xl w-full text-center animate-[fadeSlideUp_0.8s_ease-out_both] border border-white/60">
            
            <div className="inline-block px-4 py-1.5 bg-neutral-100 rounded-full mb-6">
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-neutral-900">
                Welcome to Arohoo
              </p>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 leading-[1.15] mb-4">
              Your Premium <br />
              <span className="text-primary">Lifestyle</span> Destination
            </h2>
            
            <p className="text-xs sm:text-sm font-medium text-neutral-500 mb-8 max-w-sm mx-auto leading-relaxed">
              Shop curated brands, beauty essentials, and fashion statements seamlessly.
            </p>

            {/* ── Integrated Search Bar ─────────────────────────────── */}
            <div className="flex items-center rounded-2xl p-2 w-full bg-neutral-50 border border-neutral-200 transition-all duration-300 focus-within:border-primary/40 focus-within:bg-white focus-within:shadow-[0_8px_30px_rgba(83,0,183,0.08)] hover:border-primary/20">
              <div className="pl-3 pr-2 text-primary">
                <Search className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <input
                type="text"
                placeholder="Search brands, products..."
                className="flex-1 bg-transparent border-none outline-none text-neutral-900 text-sm font-bold placeholder:text-neutral-400 placeholder:font-medium"
                suppressHydrationWarning
              />
              <div className="h-6 w-px bg-neutral-200 mx-2" />
              <button
                className="p-2 text-primary transition-colors hover:scale-110"
                aria-label="Voice search"
              >
                <Mic className="w-5 h-5" fill="currentColor" />
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
