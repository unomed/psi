
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { AppRole } from '@/types';

interface SimpleAuthContextType {
  user: User | null;
  userRole: AppRole | null;
  userCompanies: any[];
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [userCompanies, setUserCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar dados do usuário do banco
  const fetchUserData = async (userId: string) => {
    try {
      console.log('[SimpleAuthContext] Buscando dados do usuário:', userId);
      
      // Buscar role do usuário
      const { data: userRoles, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .limit(1);

      if (roleError) {
        console.error('[SimpleAuthContext] Erro ao buscar role:', roleError);
      } else if (userRoles && userRoles.length > 0) {
        setUserRole(userRoles[0].role as AppRole);
        console.log('[SimpleAuthContext] Role encontrada:', userRoles[0].role);
      } else {
        setUserRole('user'); // Role padrão
        console.log('[SimpleAuthContext] Nenhuma role encontrada, usando padrão: user');
      }

      // Buscar empresas do usuário
      const { data: companies, error: companiesError } = await supabase
        .from('user_companies')
        .select(`
          company_id,
          companies!inner (
            id,
            name
          )
        `)
        .eq('user_id', userId);

      if (companiesError) {
        console.error('[SimpleAuthContext] Erro ao buscar empresas:', companiesError);
        setUserCompanies([]);
      } else if (companies) {
        const userCompaniesData = companies.map(uc => ({
          companyId: uc.company_id,
          companyName: uc.companies?.name || 'Nome não encontrado'
        }));
        setUserCompanies(userCompaniesData);
        console.log('[SimpleAuthContext] Empresas encontradas:', userCompaniesData);
      }

    } catch (error) {
      console.error('[SimpleAuthContext] Erro geral ao buscar dados do usuário:', error);
    }
  };

  useEffect(() => {
    console.log('[SimpleAuthContext] Inicializando contexto de autenticação');
    
    // Timeout de segurança para garantir que o loading seja definido como false
    const safetyTimeout = setTimeout(() => {
      console.log('[SimpleAuthContext] Timeout de segurança ativado - definindo loading como false');
      setIsLoading(false);
    }, 5000); // 5 segundos
    
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      console.log('[SimpleAuthContext] Sessão inicial obtida:', { session, error });
      clearTimeout(safetyTimeout);
      
      if (session?.user) {
        setUser(session.user);
        await fetchUserData(session.user.id);
      } else {
        setUser(null);
        setUserRole(null);
        setUserCompanies([]);
      }
      
      setIsLoading(false);
      console.log('[SimpleAuthContext] Loading definido como false');
    }).catch((error) => {
      console.error('[SimpleAuthContext] Erro ao obter sessão inicial:', error);
      clearTimeout(safetyTimeout);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[SimpleAuthContext] Mudança de autenticação:', { event, session });
      
      if (session?.user) {
        setUser(session.user);
        // Defer database calls to prevent deadlocks
        setTimeout(() => {
          fetchUserData(session.user.id);
        }, 0);
      } else {
        setUser(null);
        setUserRole(null);
        setUserCompanies([]);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('[SimpleAuthContext] Tentando fazer login...');
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      console.error('[SimpleAuthContext] Erro no login:', error);
      toast.error('Erro no login: ' + error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('[SimpleAuthContext] Fazendo logout...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logout realizado com sucesso!');
    } catch (error: any) {
      console.error('[SimpleAuthContext] Erro no logout:', error);
      toast.error('Erro no logout: ' + error.message);
      throw error;
    }
  };

  const value = {
    user,
    userRole,
    userCompanies,
    isLoading,
    signIn,
    signOut
  };

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
}

export function useSimpleAuth() {
  const context = useContext(SimpleAuthContext);
  if (context === undefined) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
}
