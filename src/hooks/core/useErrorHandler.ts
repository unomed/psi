
// ===== HOOK DE TRATAMENTO DE ERROS =====

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface ErrorInfo {
  message: string;
  code?: string | number;
  details?: any;
  timestamp: Date;
}

export function useErrorHandler() {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = useCallback((error: any, context?: string) => {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);
    
    let message = 'Ocorreu um erro inesperado';
    let code: string | number | undefined;
    
    if (error?.message) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }
    
    if (error?.code) {
      code = error.code;
    }
    
    const errorInfo: ErrorInfo = {
      message,
      code,
      details: error,
      timestamp: new Date()
    };
    
    setErrors(prev => [errorInfo, ...prev.slice(0, 9)]); // Keep last 10 errors
    toast.error(message);
    
    return errorInfo;
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    setIsLoading(true);
    try {
      const result = await asyncFn();
      return result;
    } catch (error) {
      handleError(error, context);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const clearError = useCallback((index: number) => {
    setErrors(prev => prev.filter((_, i) => i !== index));
  }, []);

  return {
    errors,
    isLoading,
    handleError,
    handleAsyncError,
    clearErrors,
    clearError
  };
}
