
import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
}

export function LoadingSkeleton({ 
  className, 
  lines = 1, 
  height = "h-4" 
}: LoadingSkeletonProps) {
  return (
    <div className={cn("animate-pulse space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "bg-slate-200 rounded-md",
            height,
            index === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

export function TableLoadingSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {/* Header skeleton */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, index) => (
          <LoadingSkeleton key={`header-${index}`} height="h-6" />
        ))}
      </div>
      
      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <LoadingSkeleton key={`cell-${rowIndex}-${colIndex}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardLoadingSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4 animate-pulse">
      <LoadingSkeleton height="h-6" className="w-2/3" />
      <LoadingSkeleton lines={3} />
      <div className="flex justify-between items-center">
        <LoadingSkeleton height="h-4" className="w-1/4" />
        <LoadingSkeleton height="h-8" className="w-20" />
      </div>
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg border animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <LoadingSkeleton height="h-4" className="w-24" />
          <LoadingSkeleton height="h-8" className="w-16" />
        </div>
        <LoadingSkeleton height="h-8" className="w-8 rounded-full" />
      </div>
    </div>
  );
}
