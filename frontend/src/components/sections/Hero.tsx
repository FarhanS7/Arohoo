"use client";

import Image from "next/image";
import { Search, Mic } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full mb-8 sm:mb-10" id="hero-section">
      <h1 className="sr-only">
        Shop the Mall from your home – Discover leading brands in one place
      </h1>

      {/* ── Full-bleed banner ───────────────────────────────── */}
      <div 
        className="relative w-full aspect-[2.5/1] sm:aspect-auto sm:h-[35vh] md:h-[40vh] lg:h-[45vh] xl:max-h-[420px] overflow-hidden"
        style={{ 
          background: "transparent" 
        }}
      >
        {/* Background image */}
        <Image
          src="/images/new-hero-banner - Copy.png"
          alt="Arohoo Hero – Shop the Mall from your home"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />

        {/* Gradient overlays for depth & text readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(83,0,183,0.15) 0%, transparent 40%, transparent 60%, rgba(83,0,183,0.25) 100%)",
          }}
        />

        {/* ── Hero content overlay ──────────────────────────── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8">
          {/* Tagline */}
          <div className="text-center animate-[fadeSlideUp_0.8s_ease-out_both]">
            <p className="text-[8px] sm:text-xs font-black uppercase tracking-[0.25em] text-neutral-500 mb-0.5 sm:mb-3">
              Your favourite mall, now online
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 leading-[1.1]">
              Shop <span className="italic">Smarter</span>,{" "}
              <br className="hidden sm:block" />
              Live <span className="italic">Better</span>
            </h2>
          </div>
        </div>
      </div>

      {/* ── Floating search bar (sits below hero edge) ─────────── */}
      <div className="relative -mt-6 sm:-mt-8 px-4 sm:px-8 z-30 flex justify-center">
        <div
          className="flex items-center rounded-2xl sm:rounded-full p-3 md:p-4 w-full max-w-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)]"
        >
          <div className="pl-2 pr-3 text-neutral-900">
            <Search className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
          </div>
          <input
            type="text"
            placeholder="Search for brands & products..."
            className="flex-1 bg-transparent border-none outline-none text-neutral-900 text-sm sm:text-base font-medium placeholder:text-neutral-400"
            suppressHydrationWarning
          />
          <div className="h-6 w-px bg-neutral-200 mx-3 sm:mx-5" />
          <button
            className="p-1 text-primary transition-colors hover:scale-110"
            aria-label="Voice search"
          >
            <Mic className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" />
          </button>
        </div>
      </div>

      {/* ── Keyframe animations (scoped) ─────────────────── */}
      <style jsx>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(24px);
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
