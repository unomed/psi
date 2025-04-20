
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type CompanyAccess = {
  companyId: string;
  companyName: string;
};

export function useUserRole() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userCompanies, setUserCompanies] = useState<CompanyAccess[]>([]);
  const [roleLoading, setRoleLoading] = useState(false);

  const fetchUserRoleAndCompanies = async (userId: string) => {
    try {
      console.log("[useUserRole] Buscando role e empresas para usuário:", userId);
      setRoleLoading(true);
      
      // Fetch user role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleError && roleError.code !== 'PGRST116') {
        console.error('[useUserRole] Erro ao buscar papel do usuário:', roleError);
        setUserRole('user');
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
            const companyIds = userCompanyData.map(item => item.company_id);
            const { data: companiesData, error: companiesError } = await supabase
              .from('companies')
              .select('id, name')
              .in('id', companyIds);
              
            if (companiesError) {
              console.error('[useUserRole] Erro ao buscar detalhes das empresas:', companiesError);
            } else if (companiesData) {
              const formattedCompanies = companiesData.map(company => ({
                companyId: company.id,
                companyName: company.name
              }));
              console.log("[useUserRole] Empresas formatadas para o usuário:", formattedCompanies);
              setUserCompanies(formattedCompanies);
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
    }
  };

  return {
    userRole,
    userCompanies,
    roleLoading,
    fetchUserRoleAndCompanies
  };
}
