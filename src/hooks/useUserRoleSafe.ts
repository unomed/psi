import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type CompanyAccess = {
  companyId: string;
  companyName: string;
};

interface UseUserRoleState {
  userRole: string | null;
  userCompanies: CompanyAccess[];
  roleLoading: boolean;
  isInitialized: boolean;
}

export function useUserRoleSafe() {
  // Safety check for React hooks availability
  if (typeof React === 'undefined' || typeof React.useState === 'undefined') {
    console.error('[useUserRoleSafe] React hooks not available');
    return {
      userRole: null,
      userCompanies: [],
      roleLoading: false,
      fetchUserRoleAndCompanies: () => Promise.resolve(),
      clearCache: () => {},
      isInitialized: false
    };
  }

  // Initialize state with safe defaults
  const [state, setState] = useState<UseUserRoleState>({
    userRole: null,
    userCompanies: [],
    roleLoading: false,
    isInitialized: false
  });
  
  // Refs para controle de execução e cache
  const fetchingRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);
  const cacheRef = useRef<{
    userId: string;
    role: string;
    companies: CompanyAccess[];
    timestamp: number;
  } | null>(null);
  const mountedRef = useRef(true);

  // Cache por 30 segundos para evitar chamadas desnecessárias
  const CACHE_DURATION = 30000;

  // Initialize the hook safely
  useEffect(() => {
    mountedRef.current = true;
    setState(prev => ({ ...prev, isInitialized: true }));
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchUserRoleAndCompanies = useCallback(async (userId: string) => {
    // Verificar se o componente ainda está montado
    if (!mountedRef.current || !state.isInitialized) {
      console.log("[useUserRoleSafe] Hook não inicializado ou componente desmontado");
      return;
    }

    // Verificar cache primeiro
    if (cacheRef.current && 
        cacheRef.current.userId === userId && 
        Date.now() - cacheRef.current.timestamp < CACHE_DURATION) {
      console.log("[useUserRoleSafe] Usando dados do cache");
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          userRole: cacheRef.current!.role,
          userCompanies: cacheRef.current!.companies
        }));
      }
      return;
    }

    // Evitar chamadas duplicadas para o mesmo usuário
    if (fetchingRef.current && lastUserIdRef.current === userId) {
      console.log("[useUserRoleSafe] Chamada já em andamento, ignorando");
      return;
    }

    try {
      console.log("[useUserRoleSafe] Buscando role e empresas para usuário:", userId);
      fetchingRef.current = true;
      lastUserIdRef.current = userId;
      
      if (mountedRef.current) {
        setState(prev => ({ ...prev, roleLoading: true }));
      }
      
      // Fetch user role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (roleError) {
        console.error('[useUserRoleSafe] Erro ao buscar papel do usuário:', roleError);
        const fallbackData = { role: 'user', companies: [] };
        
        if (mountedRef.current) {
          setState(prev => ({
            ...prev,
            userRole: fallbackData.role,
            userCompanies: fallbackData.companies,
            roleLoading: false
          }));
        }
        
        // Cache fallback
        cacheRef.current = {
          userId,
          role: fallbackData.role,
          companies: fallbackData.companies,
          timestamp: Date.now()
        };
        return;
      }

      const role = roleData?.role || 'user';
      let companies: CompanyAccess[] = [];

      // If superadmin, fetch all companies
      if (role === 'superadmin') {
        const { data: allCompanies, error: allCompaniesError } = await supabase
          .from('companies')
          .select('id, name');
          
        if (allCompaniesError) {
          console.error('[useUserRoleSafe] Erro ao buscar todas as empresas:', allCompaniesError);
        } else if (allCompanies) {
          companies = allCompanies.map(company => ({
            companyId: company.id,
            companyName: company.name
          }));
        }
      } else {
        // For other roles, fetch only associated companies
        const { data: userCompanyData, error: userCompanyError } = await supabase
          .from('user_companies')
          .select('company_id')
          .eq('user_id', userId);
        
        if (userCompanyError) {
          console.error('[useUserRoleSafe] Erro ao buscar empresas do usuário:', userCompanyError);
        } else if (userCompanyData && userCompanyData.length > 0) {
          const companyIds = userCompanyData
            .map(item => item.company_id)
            .filter(id => id && typeof id === 'string' && id.trim() !== '');
          
          if (companyIds.length > 0) {
            const { data: companiesData, error: companiesError } = await supabase
              .from('companies')
              .select('id, name')
              .in('id', companyIds);
              
            if (companiesError) {
              console.error('[useUserRoleSafe] Erro ao buscar detalhes das empresas:', companiesError);
            } else if (companiesData) {
              companies = companiesData.map(company => ({
                companyId: company.id,
                companyName: company.name
              }));
            }
          }
        }
      }

      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          userRole: role,
          userCompanies: companies,
          roleLoading: false
        }));
      }

      // Atualizar cache
      cacheRef.current = {
        userId,
        role,
        companies,
        timestamp: Date.now()
      };

    } catch (error) {
      console.error('[useUserRoleSafe] Erro ao buscar papel e empresas do usuário:', error);
      const fallbackData = { role: 'user', companies: [] };
      
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          userRole: fallbackData.role,
          userCompanies: fallbackData.companies,
          roleLoading: false
        }));
      }
      
      // Cache fallback
      cacheRef.current = {
        userId,
        role: fallbackData.role,
        companies: fallbackData.companies,
        timestamp: Date.now()
      };
    } finally {
      fetchingRef.current = false;
    }
  }, [state.isInitialized]);

  // Função para limpar cache quando necessário
  const clearCache = useCallback(() => {
    cacheRef.current = null;
    lastUserIdRef.current = null;
  }, []);

  const memoizedReturn = useMemo(() => ({
    userRole: state.userRole,
    userCompanies: state.userCompanies,
    roleLoading: state.roleLoading,
    fetchUserRoleAndCompanies,
    clearCache,
    isInitialized: state.isInitialized
  }), [state, fetchUserRoleAndCompanies, clearCache]);

  return memoizedReturn;
}
