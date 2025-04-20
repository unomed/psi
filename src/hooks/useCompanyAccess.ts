
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useCompanyAccess(requiredCompanyId?: string) {
  const { user, userRole, userCompanies } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    const checkCompanyAccess = async () => {
      if (!user || !requiredCompanyId) {
        setCheckingAccess(false);
        return;
      }

      try {
        // Superadmin always has access
        if (userRole === 'superadmin') {
          setHasAccess(true);
          setCheckingAccess(false);
          return;
        }

        // Use pre-loaded user companies from AuthContext
        if (userCompanies && userCompanies.length > 0) {
          const hasCompanyAccess = userCompanies.some(
            company => company.companyId === requiredCompanyId
          );
          setHasAccess(hasCompanyAccess);
          setCheckingAccess(false);
          return;
        }

        // Fallback to direct database check if userCompanies not available
        const { data: userCompanyData } = await supabase
          .from('user_companies')
          .select('company_id')
          .eq('user_id', user.id);

        const hasCompanyAccess = userCompanyData?.some(uc => uc.company_id === requiredCompanyId) || false;
        setHasAccess(hasCompanyAccess);
      } catch (error) {
        console.error('Error checking company access:', error);
        setHasAccess(false);
      } finally {
        setCheckingAccess(false);
      }
    };

    checkCompanyAccess();
  }, [user, userRole, requiredCompanyId, userCompanies]);

  return { hasAccess, checkingAccess };
}
