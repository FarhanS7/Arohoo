import Image from "next/image";

const categories = [
  { name: "Women Fashion", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80" },
  { name: "Women Bottom", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80" },
  { name: "Men Topwear", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=400&q=80" },
  { name: "Women Footwear", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&q=80" },
  { name: "Men Bottomwear", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=400&q=80" },
  { name: "Men Accessories", image: "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?auto=format&fit=crop&w=400&q=80" },
  { name: "Men Footwear", image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=400&q=80" },
  { name: "Women Accessories", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80" },
  { name: "Kids Kurti", image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=400&q=80" },
  { name: "Girls Clothing", image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=400&q=80" },
  { name: "Boys Clothing", image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80" },
  { name: "Kids Accessories", image: "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&w=400&q=80" },
  { name: "Kids Footwear", image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=400&q=80" },
  { name: "Baby Clothing", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=400&q=80" },
  { name: "Baby Shoes", image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=400&q=80" },
  { name: "Baby Accessories", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=400&q=80" },
];

export default function CategoryShowcase() {
  return (
    <section className="w-full mb-10 sm:mb-16">
      <div className="responsive-container">
        <div className="grid grid-cols-8 gap-x-1 gap-y-3 sm:gap-x-4 sm:gap-y-8">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center group cursor-default"
            >
              <div className="w-full aspect-square rounded-lg sm:rounded-2xl bg-blue-50/60 overflow-hidden relative mb-1.5 sm:mb-3 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-blue-100/50">
                <Image 
                  src={category.image} 
                  alt={category.name}
                  fill
                  unoptimized={true}
                  className="object-cover mix-blend-multiply opacity-90 transition-opacity duration-300 group-hover:opacity-100" 
                  sizes="(max-width: 640px) 12vw, (max-width: 1024px) 12vw, 12vw"
                />
              </div>
              <span className="text-[6.5px] min-[380px]:text-[7.5px] sm:text-[11px] font-bold text-center text-neutral-700 leading-tight group-hover:text-primary transition-colors px-0.5 truncate w-full sm:whitespace-normal sm:w-auto">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
