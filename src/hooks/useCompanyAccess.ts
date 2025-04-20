
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useCompanyAccess(requiredCompanyId?: string) {
  const { user, userRole, userCompanies } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    const checkCompanyAccess = async () => {
      console.log('[useCompanyAccess] Verificando acesso para empresa:', requiredCompanyId);
      console.log('[useCompanyAccess] Perfil do usuário:', userRole);
      console.log('[useCompanyAccess] Empresas do usuário:', userCompanies);
      
      if (!user) {
        console.log('[useCompanyAccess] Usuário não autenticado, acesso negado');
        setHasAccess(false);
        setCheckingAccess(false);
        return;
      }

      try {
        // ONLY Superadmin role has access to all companies
        if (userRole === 'superadmin') {
          console.log('[useCompanyAccess] Usuário é superadmin, concedendo acesso');
          setHasAccess(true);
          setCheckingAccess(false);
          return;
        }

        // For admin and evaluator roles, strictly verify company associations
        // If a specific company is required, check if the user has access to it
        if (requiredCompanyId) {
          const companyIds = userCompanies.map(company => company.companyId);
          const hasCompanyAccess = companyIds.includes(requiredCompanyId);
          
          console.log('[useCompanyAccess] Acesso à empresa específica:', hasCompanyAccess);
          console.log('[useCompanyAccess] IDs das empresas do usuário:', companyIds);
          console.log('[useCompanyAccess] Empresa requisitada:', requiredCompanyId);
          
          setHasAccess(hasCompanyAccess);
        } else {
          // If no specific company is required, check if user has any company association
          const hasAnyCompany = userCompanies.length > 0;
          console.log('[useCompanyAccess] Usuário tem acesso a alguma empresa:', hasAnyCompany);
          setHasAccess(hasAnyCompany);
        }
        
        setCheckingAccess(false);
      } catch (error) {
        console.error('[useCompanyAccess] Erro verificando acesso à empresa:', error);
        toast.error('Erro ao verificar acesso à empresa');
        setHasAccess(false);
        setCheckingAccess(false);
      }
    };

    checkCompanyAccess();
  }, [user, userRole, requiredCompanyId, userCompanies]);

  return { hasAccess, checkingAccess };
}
