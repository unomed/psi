
import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type CompanyAccess = {
  companyId: string;
  companyName: string;
};

export function useUserRole() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userCompanies, setUserCompanies] = useState<CompanyAccess[]>([]);
  const [roleLoading, setRoleLoading] = useState(false);
  
  // Ref para evitar chamadas duplicadas
  const fetchingRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  const fetchUserRoleAndCompanies = async (userId: string) => {
    // Evitar chamadas duplicadas para o mesmo usuário
    if (fetchingRef.current || lastUserIdRef.current === userId) {
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
        setUserRole('user');
        setUserCompanies([]);
      } else if (roleData) {
        console.log("[useUserRole] Dados do papel do usuário:", roleData);
        setUserRole(roleData.role);
        
        // If superadmin, fetch all companies
        if (roleData.role === 'superadmin') {
          const { data: allCompanies, error: allCompaniesError } = await supabase
            .from('companies')
            .select('id, name');
            
          if (allCompaniesError) {
            console.error('[useUserRole] Erro ao buscar todas as empresas:', allCompaniesError);
          } else if (allCompanies) {
            const formattedCompanies = allCompanies.map(company => ({
              companyId: company.id,
              companyName: company.name
            }));
            setUserCompanies(formattedCompanies);
            console.log("[useUserRole] Empresas para superadmin:", formattedCompanies);
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
            setUserCompanies([]);
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
                setUserCompanies([]);
              } else if (companiesData) {
                const formattedCompanies = companiesData.map(company => ({
                  companyId: company.id,
                  companyName: company.name
                }));
                console.log("[useUserRole] Empresas formatadas para o usuário:", formattedCompanies);
                setUserCompanies(formattedCompanies);
              }
            } else {
              console.log("[useUserRole] Nenhum ID de empresa válido encontrado");
              setUserCompanies([]);
            }
          } else {
            console.log("[useUserRole] Nenhuma empresa associada ao usuário");
            setUserCompanies([]);
          }
        }
      } else {
        setUserRole('user');
        setUserCompanies([]);
      }
    } catch (error) {
      console.error('[useUserRole] Erro ao buscar papel e empresas do usuário:', error);
      setUserRole('user');
      setUserCompanies([]);
    } finally {
      setRoleLoading(false);
      fetchingRef.current = false;
    }
  };

  return {
    userRole,
    userCompanies,
    roleLoading,
    fetchUserRoleAndCompanies
  };
}
