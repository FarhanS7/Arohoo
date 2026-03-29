"use client";

import { ToastMessage } from "@/components/providers/ToastProvider";
import { cn } from "@/lib/utils";

interface ToastProps extends ToastMessage {
  onClose: () => void;
}

export default function Toast({ type, message, onClose }: ToastProps) {
  const isSuccess = type === "success";
  const isError = type === "error";

  return (
    <div
      className={cn(
        "flex items-center justify-between p-6 rounded-[1.5rem] shadow-2xl border transition-all animate-in slide-in-from-right-12 duration-500",
        isSuccess && "bg-black border-neutral-800 text-white",
        isError && "bg-white border-red-100 text-red-600 shadow-red-50",
        !isSuccess && !isError && "bg-neutral-900 border-neutral-800 text-white"
      )}
    >
      <div className="flex items-center gap-4">
        {isSuccess && (
          <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
        )}
        {isError && (
          <div className="h-2 w-2 rounded-full bg-red-600" />
        )}
        <p className="text-[10px] font-black uppercase tracking-widest leading-none pt-0.5">
          {message}
        </p>
      </div>

      <button
        onClick={onClose}
        className={cn(
          "ml-6 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity",
          isSuccess && "text-neutral-400 hover:text-white",
          isError && "text-red-400 hover:text-red-600"
        )}
      >
        Close
      </button>
    </div>
  );
}
