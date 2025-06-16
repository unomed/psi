
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PermissionValidationIndicatorProps {
  isValid: boolean;
  errorMessage?: string;
  warningMessage?: string;
}

export function PermissionValidationIndicator({ 
  isValid, 
  errorMessage, 
  warningMessage 
}: PermissionValidationIndicatorProps) {
  if (isValid && !warningMessage) {
    return (
      <Badge variant="outline" className="flex items-center gap-1 text-green-700 border-green-300 bg-green-50">
        <CheckCircle className="h-3 w-3" />
        Válido
      </Badge>
    );
  }

  if (warningMessage) {
    return (
      <Badge variant="outline" className="flex items-center gap-1 text-yellow-700 border-yellow-300 bg-yellow-50">
        <AlertCircle className="h-3 w-3" />
        Atenção
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="flex items-center gap-1 text-red-700 border-red-300 bg-red-50">
      <XCircle className="h-3 w-3" />
      Erro
    </Badge>
  );
}
