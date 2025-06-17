
import React, { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { NativeLoginForm } from './NativeLoginForm';
import { AuthErrorBoundary } from '../AuthErrorBoundary';

// Função para detectar se react-hook-form está funcionando
const isReactHookFormStable = (): boolean => {
  try {
    // Verificar se os hooks básicos estão funcionando
    if (typeof React === 'undefined' || !React.useContext || !React.useState) {
      return false;
    }
    
    // Verificar se react-hook-form pode ser importado
    const { useForm } = require('react-hook-form');
    return typeof useForm === 'function';
  } catch (error) {
    console.warn('[AdaptiveLoginForm] react-hook-form não disponível:', error);
    return false;
  }
};

export function AdaptiveLoginForm() {
  const [useNativeForm, setUseNativeForm] = useState(false);
  const [isCheckingStability, setIsCheckingStability] = useState(true);

  useEffect(() => {
    // Verificar estabilidade do React e react-hook-form
    const checkStability = () => {
      try {
        if (!isReactHookFormStable()) {
          console.log('[AdaptiveLoginForm] Usando formulário nativo devido a problemas com react-hook-form');
          setUseNativeForm(true);
        }
      } catch (error) {
        console.error('[AdaptiveLoginForm] Erro na verificação de estabilidade:', error);
        setUseNativeForm(true);
      } finally {
        setIsCheckingStability(false);
      }
    };

    // Verificação com pequeno delay para aguardar estabilização
    const timeoutId = setTimeout(checkStability, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Mostrar loading durante verificação
  if (isCheckingStability) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">Carregando formulário...</p>
        </div>
      </div>
    );
  }

  // Se deve usar formulário nativo, renderizar diretamente
  if (useNativeForm) {
    return <NativeLoginForm />;
  }

  // Tentar usar formulário original com fallback
  return (
    <AuthErrorBoundary fallbackComponent={<NativeLoginForm />}>
      <LoginForm />
    </AuthErrorBoundary>
  );
}
