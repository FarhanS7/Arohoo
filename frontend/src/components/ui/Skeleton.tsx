import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "circle" | "rounded" | "bento";
}

export function Skeleton({ className, variant = "default", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-neutral-100",
        variant === "circle" && "rounded-full",
        variant === "rounded" && "rounded-xl",
        variant === "bento" && "rounded-[2.5rem]",
        variant === "default" && "rounded-md",
        className
      )}
      {...props}
    />
  );
}
