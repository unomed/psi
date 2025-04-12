
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);
  const navigate = useNavigate();

  // Função para buscar o papel do usuário
  const fetchUserRole = async (userId: string) => {
    try {
      console.log("Fetching user role for:", userId);
      setRoleLoading(true);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar função do usuário:', error);
        // Se não encontrar um papel, definir como usuário normal
        setUserRole('user');
        return;
      }

      if (data) {
        console.log("User role data:", data);
        setUserRole(data.role);
      } else {
        // Definir um papel padrão
        setUserRole('user');
      }
    } catch (error) {
      console.error('Erro ao buscar função do usuário:', error);
      // Definir um papel padrão em caso de erro
      setUserRole('user');
    } finally {
      setRoleLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state change:", event);
        
        if (!mounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          if (mounted) {
            // Usar setTimeout para evitar chamadas aninhadas à API Supabase
            setTimeout(() => {
              if (mounted) {
                fetchUserRole(currentSession.user.id);
              }
            }, 0);
          }
        } else {
          if (mounted) setUserRole(null);
        }
        
        if (event === 'SIGNED_IN') {
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

    // Then check for existing session
    const checkSession = async () => {
      try {
        console.log("Checking for existing session");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log("Session check result:", !!currentSession);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await fetchUserRole(currentSession.user.id);
        }
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

  // Considerar o aplicativo como carregando se estivermos buscando a função do usuário
  const isLoading = loading || roleLoading;

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Você já pode fazer login com suas credenciais"
      });
      
      navigate('/auth/login');
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Verifique os dados informados e tente novamente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth/login');
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      signIn, 
      signUp, 
      signOut, 
      loading: isLoading, 
      userRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
