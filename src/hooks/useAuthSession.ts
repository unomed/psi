
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[useAuthSession] Inicializando...');
    
    // Verificar sessão atual
    const getInitialSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[useAuthSession] Erro ao verificar sessão:', error);
          setSession(null);
          setUser(null);
        } else {
          console.log('[useAuthSession] Sessão atual:', currentSession ? 'encontrada' : 'não encontrada');
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
      } catch (error) {
        console.error('[useAuthSession] Erro na verificação inicial:', error);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('[useAuthSession] Auth state change:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    // Executar verificação inicial
    getInitialSession();

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { session, user, loading };
}
