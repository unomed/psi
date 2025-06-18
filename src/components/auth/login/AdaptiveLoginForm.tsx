
import React, { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { NativeLoginForm } from './NativeLoginForm';
import { AuthErrorBoundary } from '../AuthErrorBoundary';
import { useReactStability } from '@/hooks/useReactStability';

// Função melhorada para detectar se react-hook-form está funcionando
const isReactHookFormStable = async (): Promise<boolean> => {
  try {
    // Verificar se React hooks básicos estão funcionando
    if (typeof React === 'undefined' || !React.useContext || !React.useState) {
      return false;
    }
    
    // Usar dynamic import em vez de require
    const { useForm } = await import('react-hook-form');
    return typeof useForm === 'function';
  } catch (error) {
    console.warn('[AdaptiveLoginForm] react-hook-form não disponível:', error);
    return false;
  }
};

export function AdaptiveLoginForm() {
  const { isStable, isChecking } = useReactStability();
  const [useNativeForm, setUseNativeForm] = useState(false);
  const [isCheckingHookForm, setIsCheckingHookForm] = useState(true);

  useEffect(() => {
    if (!isStable) {
      console.log('[AdaptiveLoginForm] React não estável, usando formulário nativo');
      setUseNativeForm(true);
      setIsCheckingHookForm(false);
      return;
    }

    // Se React está estável, verificar react-hook-form
    const checkHookForm = async () => {
      try {
        const hookFormStable = await isReactHookFormStable();
        if (!hookFormStable) {
          console.log('[AdaptiveLoginForm] react-hook-form não estável, usando formulário nativo');
          setUseNativeForm(true);
        }
      } catch (error) {
        console.error('[AdaptiveLoginForm] Erro na verificação de react-hook-form:', error);
        setUseNativeForm(true);
      } finally {
        setIsCheckingHookForm(false);
      }
    };

    checkHookForm();
  }, [isStable]);

  // Mostrar loading durante verificações
  if (isChecking || isCheckingHookForm) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">
            {isChecking ? 'Verificando estabilidade...' : 'Carregando formulário...'}
          </p>
        </div>
      </div>
    );
  }

  // Se deve usar formulário nativo, renderizar diretamente
  if (useNativeForm || !isStable) {
    return <NativeLoginForm />;
  }

  // Tentar usar formulário original com fallback
  return (
    <AuthErrorBoundary fallbackComponent={<NativeLoginForm />}>
      <LoginForm />
    </AuthErrorBoundary>
  );
}
