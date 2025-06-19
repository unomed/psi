
// ===== COMPONENTE DE ESTADO DE CARREGAMENTO =====

import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingState({ 
  message = "Carregando...", 
  size = "md",
  className = "" 
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };
  
  const containerClasses = {
    sm: "py-4",
    md: "py-8",
    lg: "py-12"
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses[size]} ${className}`}>
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]} mb-2`} />
      <p className="text-muted-foreground text-sm">
        {message}
      </p>
    </div>
  );
}
