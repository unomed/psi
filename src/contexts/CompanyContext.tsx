import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface CompanyContextType {
  selectedCompanyId: string | null;
  setSelectedCompanyId: (companyId: string | null) => void;
  selectedCompanyName: string | null;
  isCompanySelected: boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const { userRole, userCompanies } = useAuth();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(() => {
    // Recuperar empresa selecionada do localStorage
    const saved = localStorage.getItem('selectedCompanyId');
    return saved || null;
  });

  // Auto-selecionar primeira empresa para usuários não-superadmin
  useEffect(() => {
    if (userRole && userRole !== 'superadmin' && userCompanies.length > 0 && !selectedCompanyId) {
      const firstCompanyId = userCompanies[0].companyId;
      setSelectedCompanyId(firstCompanyId);
      localStorage.setItem('selectedCompanyId', firstCompanyId);
    }
  }, [userRole, userCompanies, selectedCompanyId]);

  // Salvar no localStorage quando mudar
  const handleSetSelectedCompanyId = (companyId: string | null) => {
    setSelectedCompanyId(companyId);
    if (companyId) {
      localStorage.setItem('selectedCompanyId', companyId);
    } else {
      localStorage.removeItem('selectedCompanyId');
    }
  };

  // Verificar se a empresa ainda é válida para o usuário
  useEffect(() => {
    if (selectedCompanyId && userCompanies.length > 0) {
      const isValidCompany = userCompanies.some(
        company => company.companyId === selectedCompanyId
      );
      
      if (!isValidCompany && userRole !== 'superadmin') {
        // Empresa não é mais válida, resetar para primeira empresa do usuário
        if (userCompanies.length > 0) {
          const firstCompanyId = userCompanies[0].companyId;
          handleSetSelectedCompanyId(firstCompanyId);
        } else {
          handleSetSelectedCompanyId(null);
        }
      }
    }
  }, [selectedCompanyId, userCompanies, userRole]);

  const selectedCompanyName = useMemo(() => {
    if (!selectedCompanyId || !userCompanies.length) return null;
    
    const company = userCompanies.find(c => c.companyId === selectedCompanyId);
    return company ? company.companyName : null;
  }, [selectedCompanyId, userCompanies]);

  const isCompanySelected = useMemo(() => {
    return selectedCompanyId !== null;
  }, [selectedCompanyId]);

  const contextValue = useMemo(() => ({
    selectedCompanyId,
    setSelectedCompanyId: handleSetSelectedCompanyId,
    selectedCompanyName,
    isCompanySelected
  }), [selectedCompanyId, selectedCompanyName, isCompanySelected]);

  return (
    <CompanyContext.Provider value={contextValue}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}