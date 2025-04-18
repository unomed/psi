
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
      console.log("Fetching user role and companies for:", userId);
      setRoleLoading(true);
      
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleError && roleError.code !== 'PGRST116') {
        console.error('Error fetching user role:', roleError);
        setUserRole('user');
      } else if (roleData) {
        console.log("User role data:", roleData);
        setUserRole(roleData.role);
      } else {
        setUserRole('user');
      }
      
      if (roleData?.role === 'superadmin') {
        const { data: allCompanies, error: allCompaniesError } = await supabase
          .from('companies')
          .select('id, name');
          
        if (allCompaniesError) {
          console.error('Error fetching all companies:', allCompaniesError);
        } else if (allCompanies) {
          const formattedCompanies = allCompanies.map(company => ({
            companyId: company.id,
            companyName: company.name
          }));
          setUserCompanies(formattedCompanies);
        }
      } else {
        setUserCompanies([]);
      }
    } catch (error) {
      console.error('Error fetching user role and companies:', error);
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
