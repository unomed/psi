
import { useAuth } from './useAuth';
import { AppRole } from '@/types';

interface CompanyAccessResult {
  hasAccess: boolean;
  isLoading: boolean;
  companyIds: string[];
  userRole: AppRole | null;
}

export function useCompanyAccessCheck(requiredCompanyId?: string): CompanyAccessResult {
  const { user, userRole, userCompanies, isLoading } = useAuth();

  // If loading, return loading state
  if (isLoading) {
    return {
      hasAccess: false,
      isLoading: true,
      companyIds: [],
      userRole: null
    };
  }

  // If no user, no access
  if (!user) {
    return {
      hasAccess: false,
      isLoading: false,
      companyIds: [],
      userRole: null
    };
  }

  const companyIds = userCompanies?.map(c => String(c.companyId)) || [];

  // Superadmin has access to everything
  if (userRole === 'superadmin') {
    return {
      hasAccess: true,
      isLoading: false,
      companyIds,
      userRole
    };
  }

  // If no specific company required, check if user has any company access
  if (!requiredCompanyId) {
    return {
      hasAccess: companyIds.length > 0,
      isLoading: false,
      companyIds,
      userRole
    };
  }

  // Check if user has access to the specific company
  const hasAccess = companyIds.includes(requiredCompanyId);

  return {
    hasAccess,
    isLoading: false,
    companyIds,
    userRole
  };
}

// Helper function for easy boolean check
export function useHasCompanyAccess(companyId?: string): boolean {
  const { hasAccess } = useCompanyAccessCheck(companyId);
  return hasAccess;
}

// Helper function to get user's company IDs
export function useUserCompanyIds(): string[] {
  const { companyIds } = useCompanyAccessCheck();
  return companyIds;
}

// Helper function to check if user is superadmin or has company access
export function useCanAccessCompany(companyId?: string): boolean {
  const { userRole } = useAuth();
  const { hasAccess } = useCompanyAccessCheck(companyId);
  
  return userRole === 'superadmin' || hasAccess;
}
