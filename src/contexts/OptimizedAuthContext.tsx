
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { AppRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OptimizedAuthContextType {
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

const OptimizedAuthContext = createContext<OptimizedAuthContextType | undefined>(undefined);

// Cache para dados do usuário
const userDataCache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutos

export function OptimizedAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<AppRole>('user');
  const [userCompanies, setUserCompanies] = useState<Array<{ companyId: string; companyName: string; role: AppRole }>>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cache otimizado para dados do usuário
  const fetchUserDataOptimized = useCallback(async (userId: string) => {
    const cacheKey = `user_${userId}`;
    const cached = userDataCache.get(cacheKey);
    
    // Retorna dados em cache se ainda válidos
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
      console.log('[OptimizedAuth] Retornando dados do cache para:', userId);
      return cached.data;
    }

    try {
      console.log('[OptimizedAuth] Buscando dados do usuário:', userId);
      
      // Buscar dados em paralelo para melhor performance
      const [profileResult, companiesResult, roleResult] = await Promise.allSettled([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('user_companies').select('company_id').eq('user_id', userId),
        supabase.from('user_roles').select('role').eq('user_id', userId).single()
      ]);

      // Processar resultados mesmo com falhas parciais
      let mappedCompanies: Array<{ companyId: string; companyName: string; role: AppRole }> = [];
      
      if (companiesResult.status === 'fulfilled' && companiesResult.value.data) {
        const companyIds = companiesResult.value.data.map(uc => uc.company_id);
        
        if (companyIds.length > 0) {
          const { data: companiesData } = await supabase
            .from('companies')
            .select('id, name')
            .in('id', companyIds);

          if (companiesData) {
            mappedCompanies = companiesData
              .filter(company => company && company.id && company.name)
              .map(company => ({
                companyId: company.id,
                companyName: company.name,
                role: 'user' as AppRole
              }));
          }
        }
      }

      // Determinar papel do usuário
      let finalRole: AppRole = 'user';
      if (roleResult.status === 'fulfilled' && roleResult.value.data?.role) {
        finalRole = roleResult.value.data.role as AppRole;
      } else if (mappedCompanies.length > 0) {
        finalRole = 'admin';
      }

      const userData = {
        role: finalRole,
        companies: mappedCompanies
      };

      // Salvar no cache
      userDataCache.set(cacheKey, {
        data: userData,
        timestamp: Date.now()
      });

      console.log('[OptimizedAuth] Dados carregados e cacheados:', {
        role: finalRole,
        companies: mappedCompanies.length
      });

      return userData;
    } catch (error) {
      console.error('[OptimizedAuth] Erro ao buscar dados do usuário:', error);
      return {
        role: 'user' as AppRole,
        companies: []
      };
    }
  }, []);

  // Configurar listener otimizado do Supabase Auth
  useEffect(() => {
    console.log('[OptimizedAuth] Configurando listener de autenticação');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[OptimizedAuth] Auth state change:', event, !!session);
        
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          
          // Buscar dados do usuário de forma otimizada
          const userData = await fetchUserDataOptimized(session.user.id);
          setUserRole(userData.role);
          setUserCompanies(userData.companies);
          
          // Salvar no localStorage para persistência
          localStorage.setItem('optimizedAuth', JSON.stringify({
            role: userData.role,
            companies: userData.companies,
            user: session.user,
            timestamp: Date.now()
          }));
        } else {
          // Limpar estado e cache
          setUser(null);
          setIsAuthenticated(false);
          setUserRole('user');
          setUserCompanies([]);
          localStorage.removeItem('optimizedAuth');
          userDataCache.clear();
        }
        
        setIsLoading(false);
      }
    );

    // Verificar sessão atual de forma otimizada
    const checkCurrentSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[OptimizedAuth] Erro ao verificar sessão:', error);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          console.log('[OptimizedAuth] Sessão existente encontrada');
          setUser(session.user);
          setIsAuthenticated(true);
          
          const userData = await fetchUserDataOptimized(session.user.id);
          setUserRole(userData.role);
          setUserCompanies(userData.companies);
        } else {
          // Verificar cache local como fallback
          const cached = localStorage.getItem('optimizedAuth');
          if (cached) {
            try {
              const parsedCache = JSON.parse(cached);
              const cacheAge = Date.now() - (parsedCache.timestamp || 0);
              
              // Se cache tem menos de 1 hora, usar temporariamente
              if (cacheAge < 60 * 60 * 1000) {
                console.log('[OptimizedAuth] Usando cache local temporariamente');
                setUserRole(parsedCache.role);
                setUserCompanies(parsedCache.companies);
                setUser(parsedCache.user);
                setIsAuthenticated(true);
              }
            } catch (e) {
              localStorage.removeItem('optimizedAuth');
            }
          }
        }
      } catch (error) {
        console.error('[OptimizedAuth] Erro na verificação inicial:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkCurrentSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserDataOptimized]);

  // Memoizar funções para evitar re-renders desnecessários
  const login = useCallback((role: AppRole, companies: Array<{ companyId: string; companyName: string; role: AppRole }> = []) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserCompanies(companies);
    const userData = { id: 'simple-user', email: 'user@example.com', role };
    setUser(userData);
    localStorage.setItem('optimizedAuth', JSON.stringify({ 
      role, 
      companies, 
      user: userData,
      timestamp: Date.now()
    }));
  }, []);

  const logout = useCallback(async () => {
    console.log('[OptimizedAuth] Executando logout');
    
    setIsAuthenticated(false);
    setUserRole('user');
    setUserCompanies([]);
    setUser(null);
    localStorage.removeItem('optimizedAuth');
    userDataCache.clear();
    
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('[OptimizedAuth] Erro no logout do Supabase:', error);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('[OptimizedAuth] Tentando fazer login...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[OptimizedAuth] Erro no login:', error);
        throw error;
      }

      if (data.user) {
        console.log('[OptimizedAuth] Login bem-sucedido');
        toast.success('Login realizado com sucesso!');
      }
    } catch (error) {
      console.error('[OptimizedAuth] Erro no signIn:', error);
      setIsLoading(false);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      console.log('[OptimizedAuth] Executando signOut');
      await logout();
    } catch (error) {
      console.error('[OptimizedAuth] Erro no signOut:', error);
      await logout();
    }
  }, [logout]);

  // Memoizar o valor do contexto
  const contextValue = useMemo(() => ({
    isAuthenticated,
    userRole,
    userCompanies,
    user,
    isLoading,
    login,
    logout,
    signIn,
    signOut
  }), [isAuthenticated, userRole, userCompanies, user, isLoading, login, logout, signIn, signOut]);

  return (
    <OptimizedAuthContext.Provider value={contextValue}>
      {children}
    </OptimizedAuthContext.Provider>
  );
}

export function useOptimizedAuth() {
  const context = useContext(OptimizedAuthContext);
  if (context === undefined) {
    throw new Error('useOptimizedAuth must be used within an OptimizedAuthProvider');
  }
  return context;
}
