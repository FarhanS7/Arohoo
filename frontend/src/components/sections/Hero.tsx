"use client";
import { Mic, Search } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full mb-8 sm:mb-10" id="hero-section">
      <h1 className="sr-only">
        Shop the Mall from your home – Discover leading brands in one place
      </h1>

      {/* ── Banner Container (Half-height) ─────────────────── */}
      <div 
        className="relative w-full h-[35vh] min-h-[260px] max-h-[420px] sm:h-[40vh] lg:h-[45vh] overflow-hidden"
      >
        {/* Background image */}
        <Image
          src="/images/new-hero-banner.png"
          alt="Arohoo Hero – Shop the Mall from your home"
          fill
          className="object-cover object-right-top sm:object-center"
          priority
          sizes="100vw"
        />

        {/* Left-side gradient so text is readable over the bright area */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 35%, rgba(255,255,255,0.1) 60%, transparent 100%)",
          }}
        />
        {/* Bottom fade for search bar overlap */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(255,255,255,0.9) 0%, transparent 30%)",
          }}
        />

        {/* ── Hero content — left-aligned ──────────────────── */}
        <div className="absolute inset-0 flex items-center">
          <div className="responsive-container w-full">
            <div className="max-w-xl animate-[fadeSlideUp_0.8s_ease-out_both] space-y-3 sm:space-y-4">
              {/* Tagline */}
              <p className="text-[9px] sm:text-xs font-black uppercase tracking-[0.3em] text-primary/70">
                Your favourite mall, now online
              </p>
              
              {/* Main Heading */}
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-neutral-900 leading-[1.05]">
                Shop <span className="italic text-primary">Smarter</span>,
                <br />
                Live <span className="italic text-primary">Better</span>
              </h2>
              
              {/* Subtext */}
              <p className="text-xs sm:text-sm font-medium text-neutral-500 max-w-sm leading-relaxed">
                Discover curated brands &amp; seamless delivery — all from one place.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating search bar ─────────────────────────────── */}
      <div className="relative -mt-6 sm:-mt-7 px-4 sm:px-8 z-30 flex justify-center">
        <div
          className="flex items-center rounded-full p-2 sm:p-3 w-full max-w-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-2 border-neutral-200 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_12px_40px_rgba(83,0,183,0.12)]"
        >
          <div className="pl-3 pr-3 text-primary">
            <Search className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <input
            type="text"
            placeholder="Search for brands & products..."
            className="flex-1 bg-transparent border-none outline-none text-neutral-900 text-sm sm:text-base font-medium placeholder:text-neutral-400"
            suppressHydrationWarning
          />
          <div className="h-6 w-px bg-neutral-200 mx-2 sm:mx-4" />
          <button
            className="p-2 text-primary transition-colors hover:scale-110"
            aria-label="Voice search"
          >
            <Mic className="w-5 h-5" fill="currentColor" />
          </button>
        </div>
      </div>

      {/* ── Keyframe animations (scoped) ─────────────────── */}
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
