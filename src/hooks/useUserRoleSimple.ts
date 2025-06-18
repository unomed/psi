
import { useState, useRef, useCallback, useEffect } from 'react';
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

export function useUserRoleSimple() {
  const [state, setState] = useState<UseUserRoleState>({
    userRole: null,
    userCompanies: [],
    roleLoading: false,
    isInitialized: true // Já inicializado por padrão
  });
  
  const fetchingRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);
  const cacheRef = useRef<{
    userId: string;
    role: string;
    companies: CompanyAccess[];
    timestamp: number;
  } | null>(null);
  const mountedRef = useRef(true);

  const CACHE_DURATION = 30000; // 30 segundos

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchUserRoleAndCompanies = useCallback(async (userId: string) => {
    if (!mountedRef.current) {
      console.log("[useUserRoleSimple] Componente desmontado");
      return;
    }

    // Verificar cache primeiro
    if (cacheRef.current && 
        cacheRef.current.userId === userId && 
        Date.now() - cacheRef.current.timestamp < CACHE_DURATION) {
      console.log("[useUserRoleSimple] Usando dados do cache");
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          userRole: cacheRef.current!.role,
          userCompanies: cacheRef.current!.companies
        }));
      }
      return;
    }

    // Evitar chamadas duplicadas
    if (fetchingRef.current && lastUserIdRef.current === userId) {
      console.log("[useUserRoleSimple] Chamada já em andamento");
      return;
    }

    try {
      console.log("[useUserRoleSimple] Buscando role e empresas para usuário:", userId);
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

      const role = roleData?.role || 'user';
      let companies: CompanyAccess[] = [];

      if (!roleError) {
        if (role === 'superadmin') {
          const { data: allCompanies } = await supabase
            .from('companies')
            .select('id, name');
            
          if (allCompanies) {
            companies = allCompanies.map(company => ({
              companyId: company.id,
              companyName: company.name
            }));
          }
        } else {
          const { data: userCompanyData } = await supabase
            .from('user_companies')
            .select('company_id')
            .eq('user_id', userId);
          
          if (userCompanyData?.length) {
            const companyIds = userCompanyData
              .map(item => item.company_id)
              .filter(id => id && typeof id === 'string');
            
            if (companyIds.length > 0) {
              const { data: companiesData } = await supabase
                .from('companies')
                .select('id, name')
                .in('id', companyIds);
                
              if (companiesData) {
                companies = companiesData.map(company => ({
                  companyId: company.id,
                  companyName: company.name
                }));
              }
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
      console.error('[useUserRoleSimple] Erro:', error);
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          userRole: 'user',
          userCompanies: [],
          roleLoading: false
        }));
      }
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current = null;
    lastUserIdRef.current = null;
  }, []);

  return {
    userRole: state.userRole,
    userCompanies: state.userCompanies,
    roleLoading: state.roleLoading,
    fetchUserRoleAndCompanies,
    clearCache,
    isInitialized: state.isInitialized
  };
}
