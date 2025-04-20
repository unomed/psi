
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useCompanyAccess(requiredCompanyId?: string) {
  const { user, userRole } = useAuth();
  const [hasAccess, setHasAccess] = useState(true);
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

        // Check if user has access to the required company
        const { data: userCompanies } = await supabase
          .from('user_companies')
          .select('company_id')
          .eq('user_id', user.id);

        const hasCompanyAccess = userCompanies?.some(uc => uc.company_id === requiredCompanyId) || false;
        setHasAccess(hasCompanyAccess);
      } catch (error) {
        console.error('Error checking company access:', error);
        setHasAccess(false);
      } finally {
        setCheckingAccess(false);
      }
    };

    checkCompanyAccess();
  }, [user, userRole, requiredCompanyId]);

  return { hasAccess, checkingAccess };
}
