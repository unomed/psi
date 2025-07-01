
import { useEffect, useState } from 'react';
import { initializeDefaultTemplates } from '@/services/templates/defaultTemplateService';
import { toast } from 'sonner';

export function useSystemInitialization() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSystem = async () => {
      try {
        console.log('[useSystemInitialization] Iniciando sistema...');
        setIsInitializing(true);
        setInitializationError(null);
        
        // Verificar se o sistema já foi inicializado
        const initialized = localStorage.getItem('system_initialized');
        
        if (!initialized) {
          console.log('[useSystemInitialization] Sistema não inicializado, criando templates padrão...');
          
          // Tentar inicializar com retry
          let attempts = 0;
          const maxAttempts = 3;
          let success = false;
          
          while (attempts < maxAttempts && !success) {
            attempts++;
            console.log(`[useSystemInitialization] Tentativa ${attempts}/${maxAttempts}`);
            
            try {
              success = await initializeDefaultTemplates();
              
              if (success) {
                localStorage.setItem('system_initialized', 'true');
                localStorage.setItem('system_initialized_at', new Date().toISOString());
                console.log('[useSystemInitialization] Sistema inicializado com sucesso');
                toast.success('Sistema inicializado com templates padrão');
              }
            } catch (attemptError) {
              console.warn(`[useSystemInitialization] Tentativa ${attempts} falhou:`, attemptError);
              
              if (attempts < maxAttempts) {
                // Aguardar antes da próxima tentativa
                await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
              }
            }
          }
          
          if (!success) {
            const errorMsg = `Falha na inicialização após ${maxAttempts} tentativas`;
            console.error('[useSystemInitialization]', errorMsg);
            setInitializationError(errorMsg);
            toast.error('Erro ao inicializar sistema - alguns recursos podem não funcionar');
            
            // Mesmo com erro, marcar como "inicializado" para não tentar novamente
            localStorage.setItem('system_initialization_failed', 'true');
            localStorage.setItem('system_initialization_failed_at', new Date().toISOString());
          }
        } else {
          console.log('[useSystemInitialization] Sistema já inicializado');
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('[useSystemInitialization] Erro crítico na inicialização:', error);
        setInitializationError(error instanceof Error ? error.message : 'Erro desconhecido');
        toast.error('Erro crítico ao inicializar sistema');
        
        // Mesmo com erro crítico, marcar como inicializado para permitir uso
        setIsInitialized(true);
      } finally {
        setIsInitializing(false);
        console.log('[useSystemInitialization] Processo de inicialização finalizado');
      }
    };

    initializeSystem();
  }, []);

  return { 
    isInitialized, 
    isInitializing,
    initializationError,
    hasError: !!initializationError
  };
}
