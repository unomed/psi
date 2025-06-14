
import { useState, useEffect, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Proteção contra múltiplas inicializações
  const initialized = useRef(false);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    // Evitar múltiplas inicializações
    if (initialized.current) {
      return;
    }
    
    let mounted = true;
    initialized.current = true;
    
    console.log("[useAuthSession] Inicializando hook de autenticação");

    // Configurar listener de mudanças de estado de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("[useAuthSession] Mudança de estado de auth:", event, !!currentSession);
        
        if (!mounted) return;
        
        try {
          // Validar sessão antes de usar
          if (currentSession && currentSession.expires_at) {
            const now = Math.floor(Date.now() / 1000);
            if (currentSession.expires_at < now) {
              console.log("[useAuthSession] Sessão expirada, limpando");
              currentSession = null;
            }
          }
          
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          // Mostrar toasts apenas para eventos específicos e quando montado
          if (mounted && !loading) {
            if (event === 'SIGNED_IN' && currentSession) {
              toast({
                title: "Login realizado com sucesso",
                description: "Bem-vindo de volta!"
              });
            } else if (event === 'SIGNED_OUT') {
              toast({
                title: "Logout realizado com sucesso", 
                description: "Até breve!"
              });
            }
          }
        } catch (error) {
          console.error("[useAuthSession] Erro ao processar mudança de estado:", error);
          setSession(null);
          setUser(null);
        }
      }
    );

    subscriptionRef.current = subscription;

    // Verificar sessão existente
    const checkInitialSession = async () => {
      try {
        console.log("[useAuthSession] Verificando sessão inicial");
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("[useAuthSession] Erro ao obter sessão:", error);
          // Limpar possível estado de auth corrompido
          try {
            await supabase.auth.signOut();
          } catch (signOutError) {
            console.error("[useAuthSession] Erro ao fazer logout:", signOutError);
          }
        }
        
        if (!mounted) return;
        
        // Validar sessão se existe
        let validSession = currentSession;
        if (currentSession && currentSession.expires_at) {
          const now = Math.floor(Date.now() / 1000);
          if (currentSession.expires_at < now) {
            console.log("[useAuthSession] Sessão inicial expirada");
            validSession = null;
            // Tentar refresh do token
            try {
              const { data: refreshData } = await supabase.auth.refreshSession();
              validSession = refreshData.session;
            } catch (refreshError) {
              console.error("[useAuthSession] Erro ao renovar token:", refreshError);
            }
          }
        }
        
        console.log("[useAuthSession] Sessão inicial:", !!validSession);
        setSession(validSession);
        setUser(validSession?.user ?? null);
      } catch (error) {
        console.error("[useAuthSession] Erro ao verificar sessão inicial:", error);
        setSession(null);
        setUser(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkInitialSession();

    // Cleanup
    return () => {
      console.log("[useAuthSession] Limpando hook de autenticação");
      mounted = false;
      initialized.current = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, []); // Array vazio para executar apenas uma vez

  return { session, user, loading };
}
