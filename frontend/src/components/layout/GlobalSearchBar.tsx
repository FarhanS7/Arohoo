"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { productService, Product } from "@/lib/api/products";
import Image from "next/image";
import Link from "next/link";
import { debounce } from "@/common/utils/debounce";

interface GlobalSearchBarProps {
  className?: string;
  placeholder?: string;
  containerClassName?: string;
  showIcon?: boolean;
}

export default function GlobalSearchBar({ 
  className = "", 
  placeholder = "Search perfumes, skincare...",
  containerClassName = "max-w-md mx-4",
  showIcon = true
}: GlobalSearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced search function
  const fetchResults = useCallback(
    debounce(async (q: string) => {
      if (q.length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }
      try {
        const response = await productService.getPublicProducts({ q, limit: 5 });
        if (response.success) {
          setResults(response.data);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetchResults(query);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query, fetchResults]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative flex-1 ${containerClassName}`} ref={searchRef}>
      <div 
        className={`relative flex items-center transition-all duration-300 ${isOpen ? 'bg-white shadow-2xl ring-1 ring-black/5' : 'bg-neutral-100 hover:bg-neutral-200'} rounded-2xl overflow-hidden`}
      >
        <div className="pl-4 text-neutral-400">
          <Search className="w-4 h-4" />
        </div>
        <form onSubmit={handleSearch} className="flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className={`w-full py-3 px-3 bg-transparent outline-none text-sm font-medium text-neutral-900 placeholder:text-neutral-400 ${className}`}
          />
        </form>
        {query && (
          <button 
            onClick={() => { setQuery(""); setResults([]); }}
            className="pr-4 text-neutral-400 hover:text-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Instant Results Dropdown */}
      {isOpen && (query.length > 0 || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-neutral-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-neutral-400">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-1">
                <div className="px-4 py-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                  Quick Results
                </div>
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-neutral-50 transition-all group"
                  >
                    <div className="relative w-12 h-12 rounded-xl bg-neutral-100 overflow-hidden flex-shrink-0">
                      <Image
                        src={product.images[0]?.url || "/placeholder-product.png"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-neutral-900 truncate tracking-tight">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-black text-primary uppercase">৳{Number(product.basePrice).toLocaleString()}</span>
                        <span className="text-neutral-300">•</span>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter truncate">{product.merchant?.storeName}</span>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                      <ArrowRight className="w-4 h-4 text-neutral-300" />
                    </div>
                  </Link>
                ))}
                <button
                  onClick={handleSearch}
                  className="w-full mt-2 p-4 bg-neutral-50 hover:bg-neutral-100 text-center text-xs font-black uppercase tracking-[0.2em] text-neutral-600 transition-all border-t border-neutral-100"
                >
                  View All Results For "{query}"
                </button>
              </div>
            ) : query.length >= 2 ? (
              <div className="py-12 text-center">
                <p className="text-sm font-bold text-neutral-400 italic">No products found for "{query}"</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-300 mt-2">Try a different keyword</p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
