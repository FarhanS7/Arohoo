'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const SLIDES = [
  {
    src: '/images/IMG_3697.jpeg',
    mobileWidth: 92,
    desktopWidth: 65,
  },
  {
    src: '/images/1775843609598~2.png',
    mobileWidth: 92,
    desktopWidth: 65,
  },
  {
    src: '/images/1775707614680.png',
    mobileWidth: 92,
    desktopWidth: 60,
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

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    const { offset, velocity } = info;

    if (offset.x < -swipeThreshold || velocity.x < -500) {
      if (currentIndex < SLIDES.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    } else if (offset.x > swipeThreshold || velocity.x > 500) {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  const getXOffset = (index: number) => {
    if (index === 0) return 0;
    const widthKey = isMobile ? 'mobileWidth' : 'desktopWidth';
    let offsetPercent = SLIDES[0][widthKey];
    for (let i = 1; i < index; i++) {
      offsetPercent += SLIDES[i][widthKey];
    }
    const gapPx = index * 12;
    return `calc(-${offsetPercent}% - ${gapPx}px)`;
  };

  return (
    <section className="py-6 sm:py-14 bg-white overflow-hidden select-none">
      <div className="pl-[4vw] lg:pl-[max(2rem,calc((100vw-1200px)/2))]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 pr-[4vw] lg:pr-[max(2rem,calc((100vw-1200px)/2))]">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-[0.15em] text-neutral-800">
              Featured Collections
            </h2>
          </div>
        </div>

        {/* Track Wrap */}
        <div className="relative overflow-visible">
          <motion.div
            className="flex gap-3 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            animate={{ x: getXOffset(currentIndex) }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          >
            {SLIDES.map((slide, idx) => (
              <div
                key={idx}
                className={`
                  relative flex-shrink-0 overflow-hidden rounded-2xl sm:rounded-3xl group/slide cursor-pointer
                  aspect-[1.8/1] sm:h-[380px] lg:h-[400px]
                `}
                style={{ width: isMobile ? `${slide.mobileWidth}%` : `${slide.desktopWidth}%` }}
              >
                <Image
                  src={slide.src}
                  alt="Collection Banner"
                  fill
                  className="object-cover transition-transform duration-700 group-hover/slide:scale-[1.03]"
                  priority={idx < 2}
                  sizes="(max-width: 768px) 92vw, 65vw"
                  draggable={false}
                />
                
                {/* Subtle vignette overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Nav Dots */}
        <div className="flex justify-center items-center gap-1.5 mt-8 pr-[4vw] lg:pr-[max(2rem,calc((100vw-1200px)/2))]">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`
                rounded-full transition-all duration-500
                ${currentIndex === idx 
                  ? 'w-8 h-2 bg-primary' 
                  : 'w-2 h-2 bg-neutral-200 hover:bg-neutral-400'}
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
