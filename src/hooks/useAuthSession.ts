
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let initialSessionChecked = false;
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state change:", event);
        
        if (!mounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Show toast messages only for specific events and only once
        if (event === 'SIGNED_IN' && !initialSessionChecked) {
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
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        console.log("Checking for existing session");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log("Session check result:", !!currentSession);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        initialSessionChecked = true;
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, user, loading };
}
