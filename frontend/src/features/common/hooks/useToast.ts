"use client";

import { useToastContext } from "@/components/providers/ToastProvider";

export function useToast() {
  const { addToast } = useToastContext();

  return {
    success: (message: string, duration?: number) => addToast("success", message, duration),
    error: (message: string, duration?: number) => addToast("error", message, duration),
    info: (message: string, duration?: number) => addToast("info", message, duration),
  };
}
