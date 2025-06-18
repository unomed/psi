
import React, { useState, useEffect, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuthSessionSafe() {
  // Verificação de segurança para React hooks
  try {
    if (typeof React === 'undefined' || typeof React.useState === 'undefined') {
      console.error('[useAuthSessionSafe] React hooks não disponíveis');
      return {
        session: null,
        user: null,
        loading: false
      };
    }
  } catch (error) {
    console.error('[useAuthSessionSafe] Erro na verificação do React:', error);
    return {
      session: null,
      user: null,
      loading: false
    };
  }

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const initialized = useRef(false);
  const subscriptionRef = useRef<any>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    if (initialized.current) return;
    
    let mounted = true;
    mountedRef.current = true;
    initialized.current = true;

    console.log('[useAuthSessionSafe] Inicializando verificação de autenticação');

    const initializeAuth = async () => {
      try {
        // Verificar sessão existente
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('[useAuthSessionSafe] Erro ao verificar sessão:', error);
        }
        
        if (mounted && mountedRef.current) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false);
        }

        // Configurar listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            if (!mounted || !mountedRef.current) return;
            
            console.log('[useAuthSessionSafe] Auth state change:', event);
            
            setSession(newSession);
            setUser(newSession?.user ?? null);
            setLoading(false);
          }
        );

        subscriptionRef.current = subscription;
      } catch (error) {
        console.error('[useAuthSessionSafe] Erro na inicialização:', error);
        if (mounted && mountedRef.current) {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      mountedRef.current = false;
      initialized.current = false;
      
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, []);

  return { session, user, loading };
}
