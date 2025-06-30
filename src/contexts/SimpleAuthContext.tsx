import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SimpleAuthContextType {
  isAuthenticated: boolean;
  userRole: AppRole;
  userCompanies: Array<{ companyId: string; companyName: string; role: AppRole }>;
  user: any;
  isLoading: boolean;
  login: (role: AppRole, companies?: Array<{ companyId: string; companyName: string; role: AppRole }>) => void;
  logout: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<AppRole>('user');
  const [userCompanies, setUserCompanies] = useState<Array<{ companyId: string; companyName: string; role: AppRole }>>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar dados do usuário do banco
  const fetchUserData = async (userId: string) => {
    try {
      console.log('[SimpleAuthContext] Buscando dados do usuário:', userId);
      
      // Buscar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('[SimpleAuthContext] Erro ao buscar perfil:', profileError);
      }

      // Buscar empresas do usuário - primeiro os IDs
      const { data: userCompaniesData, error: companiesError } = await supabase
        .from('user_companies')
        .select('company_id')
        .eq('user_id', userId);

      if (companiesError) {
        console.error('[SimpleAuthContext] Erro ao buscar empresas do usuário:', companiesError);
      }

      // Buscar dados das empresas separadamente
      let mappedCompanies: Array<{ companyId: string; companyName: string; role: AppRole }> = [];
      
      if (userCompaniesData && userCompaniesData.length > 0) {
        const companyIds = userCompaniesData.map(uc => uc.company_id);
        
        const { data: companiesData, error: companyDetailsError } = await supabase
          .from('companies')
          .select('id, name')
          .in('id', companyIds);

        if (companyDetailsError) {
          console.error('[SimpleAuthContext] Erro ao buscar detalhes das empresas:', companyDetailsError);
        } else {
          mappedCompanies = (companiesData || []).map(company => ({
            companyId: company.id,
            companyName: company.name,
            role: 'user' as AppRole // Papel padrão para empresas
          }));
        }
      }

      // Buscar papel do usuário na tabela user_roles
      const { data: userRoleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleError && roleError.code !== 'PGRST116') {
        console.error('[SimpleAuthContext] Erro ao buscar papel:', roleError);
      }

      // Determinar papel do usuário
      let finalRole: AppRole = 'user';
      
      // Se tem papel definido na tabela user_roles, usar esse
      if (userRoleData?.role) {
        finalRole = userRoleData.role as AppRole;
      }
      // Se não tem papel específico mas tem empresas, verificar se é admin
      else if (mappedCompanies.length > 0) {
        finalRole = 'admin'; // Usuários com empresas são admins por padrão
      }

      console.log('[SimpleAuthContext] Dados carregados:', {
        role: finalRole,
        companies: mappedCompanies.length
      });

      return {
        role: finalRole,
        companies: mappedCompanies
      };
    } catch (error) {
      console.error('[SimpleAuthContext] Erro ao buscar dados do usuário:', error);
      return {
        role: 'user' as AppRole,
        companies: []
      };
    }
  };

  // Configurar listener do Supabase Auth
  useEffect(() => {
    console.log('[SimpleAuthContext] Configurando listener de autenticação');

    // Listener para mudanças de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[SimpleAuthContext] Auth state change:', event, !!session);
        
        if (session?.user) {
          // Usuário autenticado
          setUser(session.user);
          setIsAuthenticated(true);
          
          // Buscar dados do usuário de forma assíncrona
          setTimeout(async () => {
            const userData = await fetchUserData(session.user.id);
            setUserRole(userData.role);
            setUserCompanies(userData.companies);
            
            // Salvar no localStorage
            localStorage.setItem('simpleAuth', JSON.stringify({
              role: userData.role,
              companies: userData.companies,
              user: session.user
            }));
            
            setIsLoading(false);
          }, 0);
        } else {
          // Usuário não autenticado
          console.log('[SimpleAuthContext] Limpando estado de autenticação');
          setUser(null);
          setIsAuthenticated(false);
          setUserRole('user');
          setUserCompanies([]);
          localStorage.removeItem('simpleAuth');
          setIsLoading(false);
        }
      }
    );

    // Verificar sessão atual
    const checkCurrentSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[SimpleAuthContext] Erro ao verificar sessão:', error);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          console.log('[SimpleAuthContext] Sessão existente encontrada');
          setUser(session.user);
          setIsAuthenticated(true);
          
          const userData = await fetchUserData(session.user.id);
          setUserRole(userData.role);
          setUserCompanies(userData.companies);
          
          localStorage.setItem('simpleAuth', JSON.stringify({
            role: userData.role,
            companies: userData.companies,
            user: session.user
          }));
        } else {
          // Verificar se há dados salvos no localStorage (fallback)
          const savedAuth = localStorage.getItem('simpleAuth');
          if (savedAuth) {
            console.log('[SimpleAuthContext] Limpando dados obsoletos do localStorage');
            localStorage.removeItem('simpleAuth');
          }
        }
      } catch (error) {
        console.error('[SimpleAuthContext] Erro na verificação inicial:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkCurrentSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = (role: AppRole, companies: Array<{ companyId: string; companyName: string; role: AppRole }> = []) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserCompanies(companies);
    const userData = { id: 'simple-user', email: 'user@example.com', role };
    setUser(userData);
    localStorage.setItem('simpleAuth', JSON.stringify({ role, companies, user: userData }));
  };

  const logout = async () => {
    console.log('[SimpleAuthContext] Executando logout');
    
    // Limpar estado local
    setIsAuthenticated(false);
    setUserRole('user');
    setUserCompanies([]);
    setUser(null);
    localStorage.removeItem('simpleAuth');
    
    // Limpar sessão do Supabase
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('[SimpleAuthContext] Erro no logout do Supabase:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('[SimpleAuthContext] Tentando fazer login...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[SimpleAuthContext] Erro no login:', error);
        throw error;
      }

      if (data.user) {
        console.log('[SimpleAuthContext] Login bem-sucedido');
        // O estado será atualizado pelo onAuthStateChange
        toast.success('Login realizado com sucesso!');
      }
    } catch (error) {
      console.error('[SimpleAuthContext] Erro no signIn:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('[SimpleAuthContext] Executando signOut');
      await logout();
    } catch (error) {
      console.error('[SimpleAuthContext] Erro no signOut:', error);
      // Mesmo com erro, limpar estado local
      await logout();
    }
  };

  return (
    <SimpleAuthContext.Provider value={{
      isAuthenticated,
      userRole,
      userCompanies,
      user,
      isLoading,
      login,
      logout,
      signIn,
      signOut
    }}>
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
