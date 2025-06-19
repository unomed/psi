
// ===== COMPONENTE DE ESTADO VAZIO =====

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary";
  };
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  className = "" 
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {icon && (
        <div className="w-16 h-16 mb-4 text-muted-foreground flex items-center justify-center">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-semibold mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-muted-foreground mb-6 max-w-md">
          {description}
        </p>
      )}
      
      {action && (
        <Button 
          onClick={action.onClick}
          variant={action.variant || "default"}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
