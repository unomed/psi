
import { useAuth } from './useAuth';
import { AppRole } from '@/types';

interface CompanyAccessResult {
  hasAccess: boolean;
  isLoading: boolean;
  companyIds: string[];
  userRole: AppRole | null;
  filterResourcesByCompany: <T extends { company_id?: string }>(resources: T[]) => T[];
  verifyCompanyAccess: (companyId: string) => Promise<boolean>;
}

export function useCompanyAccessCheck(requiredCompanyId?: string): CompanyAccessResult {
  const { user, userRole, userCompanies, loading } = useAuth();

  // If loading, return loading state
  if (loading) {
    return {
      hasAccess: false,
      isLoading: true,
      companyIds: [],
      userRole: null,
      filterResourcesByCompany: () => [],
      verifyCompanyAccess: async () => false
    };
  }

  // If no user, no access
  if (!user) {
    return {
      hasAccess: false,
      isLoading: false,
      companyIds: [],
      userRole: null,
      filterResourcesByCompany: () => [],
      verifyCompanyAccess: async () => false
    };
  }

  const companyIds = userCompanies?.map(c => String(c.companyId)) || [];

  // Filter resources by company access
  const filterResourcesByCompany = <T extends { company_id?: string }>(resources: T[]): T[] => {
    if (userRole === 'superadmin') {
      return resources;
    }
    return resources.filter(resource => 
      resource.company_id && companyIds.includes(resource.company_id)
    );
  };

  // Verify company access
  const verifyCompanyAccess = async (companyId: string): Promise<boolean> => {
    if (userRole === 'superadmin') {
      return true;
    }
    return companyIds.includes(companyId);
  };

  // Superadmin has access to everything
  if (userRole === 'superadmin') {
    return {
      hasAccess: true,
      isLoading: false,
      companyIds,
      userRole,
      filterResourcesByCompany,
      verifyCompanyAccess
    };
  }

  // If no specific company required, check if user has any company access
  if (!requiredCompanyId) {
    return {
      hasAccess: companyIds.length > 0,
      isLoading: false,
      companyIds,
      userRole,
      filterResourcesByCompany,
      verifyCompanyAccess
    };
  }

  // Check if user has access to the specific company
  const hasAccess = companyIds.includes(requiredCompanyId);

  return {
    hasAccess,
    isLoading: false,
    companyIds,
    userRole,
    filterResourcesByCompany,
    verifyCompanyAccess
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
