
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
