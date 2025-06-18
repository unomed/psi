
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type CompanyAccess = {
  companyId: string;
  companyName: string;
};

export function useUserRole() {
  // Verificação de segurança para garantir que estamos em um contexto React válido
  if (typeof React === 'undefined' || !React) {
    console.warn('[useUserRole] React não está disponível, retornando fallback');
    return {
      userRole: null,
      userCompanies: [],
      roleLoading: false,
      fetchUserRoleAndCompanies: () => Promise.resolve(),
      clearCache: () => {},
    };
  }

  const [userRole, setUserRole] = useState<string | null>(null);
  const [userCompanies, setUserCompanies] = useState<CompanyAccess[]>([]);
  const [roleLoading, setRoleLoading] = useState(false);
  
  // Refs para controle de execução e cache
  const fetchingRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);
  const cacheRef = useRef<{
    userId: string;
    role: string;
    companies: CompanyAccess[];
    timestamp: number;
  } | null>(null);

  // Cache por 30 segundos para evitar chamadas desnecessárias
  const CACHE_DURATION = 30000;

  const fetchUserRoleAndCompanies = useCallback(async (userId: string) => {
    // Verificar cache primeiro
    if (cacheRef.current && 
        cacheRef.current.userId === userId && 
        Date.now() - cacheRef.current.timestamp < CACHE_DURATION) {
      console.log("[useUserRole] Usando dados do cache");
      setUserRole(cacheRef.current.role);
      setUserCompanies(cacheRef.current.companies);
      return;
    }

    // Evitar chamadas duplicadas para o mesmo usuário
    if (fetchingRef.current && lastUserIdRef.current === userId) {
      console.log("[useUserRole] Chamada já em andamento, ignorando");
      return;
    }

    try {
      console.log("[useUserRole] Buscando role e empresas para usuário:", userId);
      fetchingRef.current = true;
      lastUserIdRef.current = userId;
      setRoleLoading(true);
      
      // Fetch user role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (roleError) {
        console.error('[useUserRole] Erro ao buscar papel do usuário:', roleError);
        const fallbackData = { role: 'user', companies: [] };
        setUserRole(fallbackData.role);
        setUserCompanies(fallbackData.companies);
        
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
      setUserRole(role);
      
      let companies: CompanyAccess[] = [];

      // If superadmin, fetch all companies
      if (role === 'superadmin') {
        const { data: allCompanies, error: allCompaniesError } = await supabase
          .from('companies')
          .select('id, name');
          
        if (allCompaniesError) {
          console.error('[useUserRole] Erro ao buscar todas as empresas:', allCompaniesError);
        } else if (allCompanies) {
          companies = allCompanies.map(company => ({
            companyId: company.id,
            companyName: company.name
          }));
          console.log("[useUserRole] Empresas para superadmin:", companies);
        }
      } else {
        // For other roles, fetch only associated companies
        console.log("[useUserRole] Buscando empresas associadas ao usuário (não superadmin)");
        
        const { data: userCompanyData, error: userCompanyError } = await supabase
          .from('user_companies')
          .select('company_id')
          .eq('user_id', userId);
        
        if (userCompanyError) {
          console.error('[useUserRole] Erro ao buscar empresas do usuário:', userCompanyError);
        } else if (userCompanyData && userCompanyData.length > 0) {
          console.log("[useUserRole] Dados de empresas do usuário:", userCompanyData);
          
          // Fetch company names for the associated companies
          const companyIds = userCompanyData
            .map(item => item.company_id)
            .filter(id => id && typeof id === 'string' && id.trim() !== '');
          
          if (companyIds.length > 0) {
            const { data: companiesData, error: companiesError } = await supabase
              .from('companies')
              .select('id, name')
              .in('id', companyIds);
              
            if (companiesError) {
              console.error('[useUserRole] Erro ao buscar detalhes das empresas:', companiesError);
            } else if (companiesData) {
              companies = companiesData.map(company => ({
                companyId: company.id,
                companyName: company.name
              }));
              console.log("[useUserRole] Empresas formatadas para o usuário:", companies);
            }
          } else {
            console.log("[useUserRole] Nenhum ID de empresa válido encontrado");
          }
        } else {
          console.log("[useUserRole] Nenhuma empresa associada ao usuário");
        }
      }

      setUserCompanies(companies);

      // Atualizar cache
      cacheRef.current = {
        userId,
        role,
        companies,
        timestamp: Date.now()
      };

    } catch (error) {
      console.error('[useUserRole] Erro ao buscar papel e empresas do usuário:', error);
      const fallbackData = { role: 'user', companies: [] };
      setUserRole(fallbackData.role);
      setUserCompanies(fallbackData.companies);
      
      // Cache fallback
      cacheRef.current = {
        userId,
        role: fallbackData.role,
        companies: fallbackData.companies,
        timestamp: Date.now()
      };
    } finally {
      setRoleLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  // Função para limpar cache quando necessário
  const clearCache = useCallback(() => {
    cacheRef.current = null;
    lastUserIdRef.current = null;
  }, []);

  const memoizedReturn = useMemo(() => ({
    userRole,
    userCompanies,
    roleLoading,
    fetchUserRoleAndCompanies,
    clearCache
  }), [userRole, userCompanies, roleLoading, fetchUserRoleAndCompanies, clearCache]);

  return memoizedReturn;
}
