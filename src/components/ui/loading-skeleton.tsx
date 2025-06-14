
import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  variant?: "default" | "card" | "table" | "chart";
}

export function LoadingSkeleton({ className, lines = 3, variant = "default" }: LoadingSkeletonProps) {
  if (variant === "card") {
    return (
      <div className={cn("border rounded-lg p-6 space-y-4", className)}>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="h-3 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
        <div className="flex justify-center space-x-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
      ))}
    </div>
  );
}
