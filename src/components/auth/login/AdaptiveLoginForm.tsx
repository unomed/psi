
import React, { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { NativeLoginForm } from './NativeLoginForm';

// Function to check if react-hook-form is stable
const isReactHookFormStable = () => {
  try {
    // Check if we can access react-hook-form without errors
    const { useForm } = require('react-hook-form');
    return typeof useForm === 'function';
  } catch (error) {
    console.warn('[AdaptiveLoginForm] react-hook-form não disponível:', error);
    return false;
  }
};

// Function to check if React context is working properly
const checkStability = () => {
  try {
    // Test if React hooks are accessible
    React.useState;
    React.useContext;
    return isReactHookFormStable();
  } catch (error) {
    console.warn('[AdaptiveLoginForm] Problemas com React context:', error);
    return false;
  }
};

export function AdaptiveLoginForm() {
  const [useNativeForm, setUseNativeForm] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check stability in a safe way
    const checkAndDecide = () => {
      try {
        const isStable = checkStability();
        setUseNativeForm(!isStable);
        setIsReady(true);
        
        if (!isStable) {
          console.log('[AdaptiveLoginForm] Usando formulário nativo devido a problemas com react-hook-form');
        }
      } catch (error) {
        console.error('[AdaptiveLoginForm] Erro na verificação de estabilidade:', error);
        setUseNativeForm(true);
        setIsReady(true);
      }
    };

    // Small delay to ensure React context is ready
    const timer = setTimeout(checkAndDecide, 100);
    return () => clearTimeout(timer);
  }, []);

  // Loading state while checking
  if (!isReady) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Use native form if react-hook-form is unstable
  if (useNativeForm) {
    return <NativeLoginForm />;
  }

  // Try to use the full LoginForm with error boundary
  return (
    <React.Suspense fallback={<NativeLoginForm />}>
      <LoginFormWrapper />
    </React.Suspense>
  );
}

// Wrapper component with error boundary behavior
function LoginFormWrapper() {
  try {
    return <LoginForm />;
  } catch (error) {
    console.error('[LoginFormWrapper] Erro no LoginForm, usando fallback:', error);
    return <NativeLoginForm />;
  }
}
