import Image from "next/image";

/**
 * Skincare Bento Grid — 3 banners arranged in an asymmetric bento layout.
 * Placed after Trending Brands section.
 *
 * Layout (desktop):
 *   ┌───────────────────────────┬──────────────┐
 *   │  wide banner (col-span-2) │  tall banner  │
 *   │  "Transform Your Skincare"│  product      │
 *   ├───────────────────────────┤  lineup       │
 *   │  "Your Glow" banner       │              │
 *   └───────────────────────────┴──────────────┘
 *
 * Mobile: stacks vertically, full width.
 */
export default function SkincareBento() {
  return (
    <section className="py-4 sm:py-6">
      <div className="responsive-container">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {/* Top-left: Wide banner spanning 2 cols */}
          <div className="col-span-2 relative overflow-hidden rounded-xl sm:rounded-2xl aspect-[4/1] group">
            <Image
              src="/images/1775707614680.png"
              alt="Transform Your Skincare Routine Into a Ritual of Self-Love"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
          </div>

          {/* Right: Tall banner spanning 2 rows */}
          <div className="row-span-2 relative overflow-hidden rounded-xl sm:rounded-2xl group">
            <Image
              src="/images/1775816238922~2.png"
              alt="Premium Skincare Products — Olay, Sunday Riley, SkinCeuticals"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>

          {/* Bottom-left: Second wide banner */}
          <div className="col-span-2 relative overflow-hidden rounded-xl sm:rounded-2xl aspect-[4/1] group">
            <Image
              src="/images/1775843609598~2.png"
              alt="Your Glow. Daily Rituals. — Skincare Essentials"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
