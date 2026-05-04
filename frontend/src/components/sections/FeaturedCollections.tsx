'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, MoveRight } from 'lucide-react';

const SLIDES = [
  {
    src: '/images/1775707614680.png',
    mobileWidth: 92,
    desktopWidth: 65,
  },
  {
    src: '/images/1775816238922~2.png',
    mobileWidth: 92,
    desktopWidth: 55,
  },
  {
    src: '/images/1775815792807~2.png',
    mobileWidth: 92,
    desktopWidth: 55,
  },
  {
    src: '/images/3_20260424_013432_0002.png',
    mobileWidth: 92,
    desktopWidth: 55,
  },
  {
    src: '/images/Gemini_Generated_Image_gzhv09gzhv09gzhv.png',
    mobileWidth: 92,
    desktopWidth: 55,
  },
  {
    src: '/images/Gemini_Generated_Image_j5zvtgj5zvtgj5zv.png',
    mobileWidth: 92,
    desktopWidth: 55,
  },
];

export default function FeaturedCollections() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getXOffset = (index: number) => {
    if (index === 0) return 0;
    const widthKey = isMobile ? 'mobileWidth' : 'desktopWidth';
    let offsetPercent = SLIDES[0][widthKey];
    for (let i = 1; i < index; i++) {
      offsetPercent += SLIDES[i][widthKey];
    }
    const gapPx = index * 10;
    return `calc(-${offsetPercent}% - ${gapPx}px)`;
  };

  return (
    <section className="py-4 sm:py-10 bg-white overflow-hidden select-none">
      <div className="pl-[4vw] lg:pl-[max(2rem,calc((100vw-1200px)/2))]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pr-[4vw] lg:pr-[max(2rem,calc((100vw-1200px)/2))]">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            Featured Collections
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-9 h-9 rounded-full border border-neutral-100 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-10 transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === SLIDES.length - 1}
              className="w-9 h-9 rounded-full border border-neutral-100 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-10 transition-all shadow-sm"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Track Wrap */}
        <div className="relative overflow-visible">
          <motion.div
            className="flex gap-[10px]"
            animate={{ x: getXOffset(currentIndex) }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          >
            {SLIDES.map((slide, idx) => (
              <div
                key={idx}
                className={`
                  relative flex-shrink-0 overflow-hidden rounded-[16px] sm:rounded-[24px] group/slide
                  aspect-[1.8/1] sm:h-[350px] transition-all duration-700
                `}
                style={{ width: isMobile ? `${slide.mobileWidth}%` : `${slide.desktopWidth}%` }}
              >
                <Image
                  src={slide.src}
                  alt="Collection Banner"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover/slide:scale-105"
                  priority={idx === 0}
                  sizes="(max-width: 768px) 100vw, 65vw"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex flex-col justify-end p-4 sm:p-10">
                  {/* Explore Bar */}
                  <div className="relative w-[90%] sm:w-[80%] h-[40px] sm:h-[46px] rounded-full overflow-hidden border border-white/20 bg-black/20 backdrop-blur-md group/btn cursor-pointer transition-all hover:bg-black/40">
                    <div className="absolute inset-0 flex items-center px-5 sm:px-6">
                      <span className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-widest mr-3">Explore</span>
                      <MoveRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover/btn:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Nav Dots */}
        <div className="flex justify-center gap-2 mt-6 pr-[4vw] lg:pr-[max(2rem,calc((100vw-1200px)/2))]">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`
                h-1.5 rounded-full transition-all duration-500
                ${currentIndex === idx ? 'w-8 bg-[#e91e8c]' : 'w-1.5 bg-neutral-200'}
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
