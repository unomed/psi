import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useMemo } from 'react';

export function useCompanyFilter(companies: any[] = []) {
  const { userRole, userCompanies } = useAuth();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [availableCompanies, setAvailableCompanies] = useState<{ companyId: string; companyName: string; }[]>([]);

  useEffect(() => {
    if (userRole === 'superadmin') {
      // Superadmin can see all companies - userCompanies already contains all
      setAvailableCompanies(userCompanies);
      // Set first company as default if none selected
      if (!selectedCompanyId && userCompanies.length > 0) {
        setSelectedCompanyId(userCompanies[0].companyId);
      }
    } else {
      // Other roles can only see their assigned companies
      setAvailableCompanies(userCompanies);
      // For non-superadmin, automatically select their company if they have only one
      if (userCompanies.length === 1) {
        setSelectedCompanyId(userCompanies[0].companyId);
      } else if (!selectedCompanyId && userCompanies.length > 0) {
        setSelectedCompanyId(userCompanies[0].companyId);
      }
    }
  }, [userRole, userCompanies, selectedCompanyId]);

  const filteredCompanies = useMemo(() => {
    if (userRole === 'superadmin') {
      return companies; // Superadmin sees all companies
    } else {
      // Other roles see only their assigned companies
      const allowedCompanyIds = userCompanies.map(uc => uc.companyId);
      return companies.filter(company => allowedCompanyIds.includes(company.id));
    }
  }, [companies, userRole, userCompanies]);

  const getCompanyFilter = () => {
    if (userRole === 'superadmin') {
      return selectedCompanyId; // Can be null to see all companies
    } else {
      return selectedCompanyId; // Non-superadmin must have a company selected
    }
  };

  const canAccessAllCompanies = () => {
    return userRole === 'superadmin';
  };

  return {
    selectedCompanyId,
    setSelectedCompanyId,
    availableCompanies,
    filteredCompanies,
    getCompanyFilter,
    canAccessAllCompanies
  };
}
