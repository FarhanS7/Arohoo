"use client";

import { AlertCircle, Inbox, Loader2, RefreshCw } from "lucide-react";
import { ReactNode } from "react";

interface StateViewProps {
  state: "loading" | "empty" | "error";
  title?: string;
  message?: string;
  cta?: ReactNode;
  onRetry?: () => void;
  className?: string;
}

export default function StateView({
  state,
  title,
  message,
  cta,
  onRetry,
  className = ""
}: StateViewProps) {
  const configs = {
    loading: {
      icon: <Loader2 className="h-10 w-10 animate-spin text-primary" />,
      defaultTitle: "Loading content...",
      defaultMessage: "Please wait while we fetch the latest data for you.",
    },
    empty: {
      icon: <Inbox className="h-12 w-12 text-gray-300" />,
      defaultTitle: "Nothing found here",
      defaultMessage: "It seems there is no data to display at the moment.",
    },
    error: {
      icon: <AlertCircle className="h-12 w-12 text-red-400" />,
      defaultTitle: "Something went wrong",
      defaultMessage: "We encountered an error while processing your request.",
    },
  };

  const config = configs[state];

  return (
    <div className={`flex min-h-[400px] w-full flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-gray-50 shadow-sm font-sans ${className}`}>
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-50">
        {config.icon}
      </div>
      
      <h3 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
        {title || config.defaultTitle}
      </h3>
      
      <p className="mb-8 max-w-xs text-sm font-medium text-gray-500 leading-relaxed">
        {message || config.defaultMessage}
      </p>

      {state === "error" && onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-3 text-sm font-bold text-white transition-all hover:bg-gray-800 active:scale-95"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}

      {cta && <div className="mt-2">{cta}</div>}
    </div>
  );
}
