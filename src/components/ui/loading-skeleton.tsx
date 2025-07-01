
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  lines?: number;
  height?: string;
  className?: string;
}

export function LoadingSkeleton({ 
  lines = 3, 
  height = "h-4", 
  className = "" 
}: LoadingSkeletonProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton 
          key={index} 
          className={`w-full ${height} ${index === lines - 1 ? 'w-3/4' : ''}`} 
        />
      ))}
    </div>
  );
}
