
import { useEffect, useState } from 'react';
import { initializeDefaultTemplates } from '@/services/templates/defaultTemplateService';
import { toast } from 'sonner';

export function useSystemInitialization() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeSystem = async () => {
      try {
        setIsInitializing(true);
        
        // Verificar se o sistema já foi inicializado
        const initialized = localStorage.getItem('system_initialized');
        
        if (!initialized) {
          console.log('Inicializando sistema...');
          const success = await initializeDefaultTemplates();
          
          if (success) {
            localStorage.setItem('system_initialized', 'true');
            toast.success('Sistema inicializado com templates padrão');
          } else {
            toast.error('Erro ao inicializar sistema');
          }
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Erro na inicialização:', error);
        toast.error('Erro ao inicializar sistema');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSystem();
  }, []);

  return { isInitialized, isInitializing };
}
