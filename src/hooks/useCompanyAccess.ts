import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function useCompanyAccess(companyId: string) {
  const { user, userCompanies } = useAuth();

  const hasAccess = useMemo(() => {
    if (!user) return false;

    // Superadmins have access to all companies
    if (user.role === 'superadmin') return true;

    // Check if the user has explicit access to the company
    if (userCompanies && userCompanies.some(c => String(c.companyId) === companyId)) {
      return true;
    }

    return false;
  }, [user, companyId, userCompanies]);

  return { hasAccess };
}
