
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';

// HOOK SIMPLIFICADO para debug
export function useAuthSession() {
  console.log('[useAuthSession] Hook sendo chamado...');
  
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[useAuthSession] useEffect executando...');
    
    // Simular auth para teste
    setTimeout(() => {
      console.log('[useAuthSession] Simulando fim do loading...');
      setLoading(false);
    }, 100);
  }, []);

  console.log('[useAuthSession] Retornando estado:', { hasSession: !!session, hasUser: !!user, loading });
  
  return { session, user, loading };
}
