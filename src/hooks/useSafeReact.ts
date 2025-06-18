
import React, { useState, useEffect } from 'react';

// Hook para verificar se o React está disponível e funcionando
export function useSafeReact() {
  try {
    // Verificar se React está disponível
    if (typeof React === 'undefined') {
      console.error('[useSafeReact] React não está disponível');
      return false;
    }
    
    // Verificar se os hooks do React estão disponíveis
    if (typeof React.useState === 'undefined' || typeof React.useEffect === 'undefined') {
      console.error('[useSafeReact] React hooks não estão disponíveis');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('[useSafeReact] Erro ao verificar React:', error);
    return false;
  }
}

// Hook useState seguro
export function useSafeState<T>(initialState: T | (() => T)) {
  try {
    if (typeof React === 'undefined' || typeof React.useState === 'undefined') {
      console.error('[useSafeState] React useState não disponível');
      return [initialState, () => {}] as const;
    }
    
    return useState(initialState);
  } catch (error) {
    console.error('[useSafeState] Erro ao usar useState:', error);
    return [initialState, () => {}] as const;
  }
}

// Hook useEffect seguro
export function useSafeEffect(effect: React.EffectCallback, deps?: React.DependencyList) {
  try {
    if (typeof React === 'undefined' || typeof React.useEffect === 'undefined') {
      console.error('[useSafeEffect] React useEffect não disponível');
      return;
    }
    
    return useEffect(effect, deps);
  } catch (error) {
    console.error('[useSafeEffect] Erro ao usar useEffect:', error);
  }
}
