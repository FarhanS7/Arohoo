"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  className?: string;
  label?: string;
}

export default function BackButton({ className = "", label = "Back" }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`group flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-all ${className}`}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm transition-all group-hover:border-gray-200 group-hover:shadow-md">
        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      </div>
      {label && <span className="uppercase tracking-widest text-[10px]">{label}</span>}
    </button>
  );
}
