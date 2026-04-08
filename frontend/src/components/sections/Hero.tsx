"use client";

import Image from "next/image";
import { Search, Mic } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden" id="hero-section">
      <h1 className="sr-only">
        Shop the Mall from your home – Discover leading brands in one place
      </h1>

      {/* ── Full-bleed banner ───────────────────────────────── */}
      <div 
        className="relative w-full aspect-[2.8/1] sm:aspect-auto sm:h-[40vh] md:h-[45vh] lg:h-[50vh] xl:h-[55vh] xl:max-h-[480px] overflow-hidden"
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
          <div className="text-center mb-4 sm:mb-10 animate-[fadeSlideUp_0.8s_ease-out_both]">
            <p className="text-[8px] sm:text-xs font-black uppercase tracking-[0.25em] text-neutral-500 mb-0.5 sm:mb-3">
              Your favourite mall, now online
            </p>
            <h2 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 leading-[1.1]">
              Shop <span className="italic">Smarter</span>,{" "}
              <br className="hidden sm:block" />
              Live <span className="italic">Better</span>
            </h2>
          </div>

          {/* ── Floating search bar ─────────────────────────── */}
          <div className="w-full max-w-xl md:max-w-2xl animate-[fadeSlideUp_0.8s_ease-out_0.15s_both]">
            <div
              className="flex items-center rounded-lg md:rounded-full p-0.5 md:p-2 w-full max-w-[240px] sm:max-w-xl md:max-w-2xl border border-white/20 shadow-2xl backdrop-blur-xl mx-auto"
              style={{
                background: "rgba(255,255,255,0.82)",
                boxShadow:
                  "0 8px 32px rgba(83,0,183,0.12), 0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <div className="pl-2 md:pl-5 pr-1 md:pr-2 text-neutral-400">
                <Search className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <input
                type="text"
                placeholder="Find brands or products..."
                className="flex-1 bg-transparent border-none outline-none text-neutral-900 text-[10px] md:text-base font-semibold placeholder:text-neutral-400 py-1 md:py-3"
                suppressHydrationWarning
              />
              <div className="hidden md:block h-7 w-px bg-neutral-200 mx-2" />
              <button
                className="hidden sm:block p-2.5 md:p-3 text-neutral-500 hover:text-primary transition-colors"
                aria-label="Voice search"
              >
                <Mic className="w-[18px] h-[18px] md:w-5 md:h-5" />
              </button>
              <button className="bg-primary hover:bg-primary-hover text-white px-2 md:px-7 py-1 md:py-3 rounded-md md:rounded-full text-[9px] md:text-sm font-bold tracking-wide transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 mr-0.5">
                Search
              </button>
            </div>
          </div>

          {/* Quick-links */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 mt-3 sm:mt-6 animate-[fadeSlideUp_0.8s_ease-out_0.3s_both]">
            {["Trending", "Fashion", "Watches"].map((tag) => (
              <span
                key={tag}
                className="px-1.5 sm:px-4 py-0.5 sm:py-2 rounded-full text-[8px] sm:text-xs font-bold uppercase tracking-wider text-neutral-500 border border-neutral-200/60 shadow-sm cursor-pointer transition-all duration-200 hover:bg-neutral-50 hover:border-neutral-300 hover:scale-105"
                style={{ background: "rgba(255,255,255,0.7)" }}
              >
                {tag}
              </span>
            ))}
          </div>
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
