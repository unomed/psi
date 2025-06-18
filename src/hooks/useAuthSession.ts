
import React, { useState, useEffect, useRef } from 'react';
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
  const initialCheckDone = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);

  useEffect(() => {
    // Evitar múltiplas inicializações
    if (initialized.current) {
      return;
    }
    
    let mounted = true;
    mountedRef.current = true;
    initialized.current = true;

    // Timeout reduzido para melhor UX
    timeoutRef.current = setTimeout(() => {
      if (mounted && loading && mountedRef.current) {
        console.warn('[useAuthSession] Timeout atingido, definindo loading como false');
        setLoading(false);
      }
    }, 3000);

    // Primeiro verificar sessão existente
    const checkInitialSession = async () => {
      if (initialCheckDone.current || !mountedRef.current) return;
      initialCheckDone.current = true;
      
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao verificar autenticação:", error);
          // Limpar possível estado de auth corrompido
          try {
            await supabase.auth.signOut();
          } catch (signOutError) {
            // Ignorar erros de logout
          }
        }
        
        if (!mounted || !mountedRef.current) return;
        
        // Validar sessão se existe
        let validSession = currentSession;
        if (currentSession && currentSession.expires_at) {
          const now = Math.floor(Date.now() / 1000);
          if (currentSession.expires_at < now) {
            validSession = null;
            // Tentar refresh do token
            try {
              const { data: refreshData } = await supabase.auth.refreshSession();
              validSession = refreshData.session;
            } catch (refreshError) {
              // Ignorar erros de refresh
            }
          }
        }
        
        if (mountedRef.current) {
          setSession(validSession);
          setUser(validSession?.user ?? null);
          setLoading(false);
        }
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      } catch (error) {
        console.error("Erro na verificação de autenticação:", error);
        if (mountedRef.current) {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
    };

    // Configurar listener de mudanças de estado de auth APÓS verificação inicial
    const setupAuthListener = () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          if (!mounted || !mountedRef.current) return;
          
          try {
            console.log('[useAuthSession] Auth state change:', event);
            
            // Validar sessão antes de usar
            if (currentSession && currentSession.expires_at) {
              const now = Math.floor(Date.now() / 1000);
              if (currentSession.expires_at < now) {
                currentSession = null;
              }
            }
            
            if (mountedRef.current) {
              setSession(currentSession);
              setUser(currentSession?.user ?? null);
              setLoading(false);
            }
            
            // Toasts otimizados - apenas para eventos relevantes
            if (mounted && mountedRef.current && event === 'SIGNED_IN' && currentSession) {
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
          } catch (error) {
            console.error("Erro ao processar mudança de autenticação:", error);
            if (mountedRef.current) {
              setSession(null);
              setUser(null);
              setLoading(false);
            }
          }
        }
      );

      subscriptionRef.current = subscription;
    };

    // Executar verificação inicial primeiro, depois configurar listener
    checkInitialSession().then(() => {
      if (mounted && mountedRef.current) {
        setupAuthListener();
      }
    });

    // Cleanup
    return () => {
      mounted = false;
      mountedRef.current = false;
      initialized.current = false;
      initialCheckDone.current = false;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, []); // Array vazio para executar apenas uma vez

  return { session, user, loading };
}
