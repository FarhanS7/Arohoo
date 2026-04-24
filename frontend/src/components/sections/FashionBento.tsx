import Image from "next/image";

/**
 * Fashion Bento Grid — 4 banners arranged in a dynamic bento layout.
 * Placed after Trending Malls section.
 *
 * Layout (desktop):
 *   ┌──────────────┬───────────────────────────┐
 *   │  "Craft"     │  wide "Fashion Simplicity" │
 *   │  tall banner │  banner (col-span-2)       │
 *   │              ├──────────────┬──────────────┤
 *   │              │  "Weekend"   │  "Urban Edit" │
 *   └──────────────┴──────────────┴──────────────┘
 *
 * Mobile: stacks vertically, full width.
 */
export default function FashionBento() {
  return (
    <section className="py-4 sm:py-6">
      <div className="responsive-container">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {/* Left: Tall "Craft" banner spanning 2 rows */}
          <div className="row-span-2 relative overflow-hidden rounded-xl sm:rounded-2xl group">
            <Image
              src="/images/1775815792807~2.png"
              alt="Craft — Redefining Every Occasion"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>

          {/* Top-right: Wide "Fashion Simplicity" spanning 2 cols */}
          <div className="col-span-2 relative overflow-hidden rounded-xl sm:rounded-2xl aspect-[4/1] group">
            <Image
              src="/images/3_20260424_013432_0002.png"
              alt="Fashion — Simplicity Speaks With Pure Elegance"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
          </div>

          {/* Bottom-middle: "Weekend Curated Collection" */}
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl aspect-[16/9] group">
            <Image
              src="/images/Gemini_Generated_Image_gzhv09gzhv09gzhv.png"
              alt="The Weekend Curated Collection — Seamless Travel, Effortless Style"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>

          {/* Bottom-right: "Urban Edit" */}
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl aspect-[16/9] group">
            <Image
              src="/images/Gemini_Generated_Image_j5zvtgj5zvtgj5zv.png"
              alt="The Urban Edit — Curated for the City"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
