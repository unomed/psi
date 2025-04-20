
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
        // Superadmin sempre tem acesso a todas as empresas
        if (userRole === 'superadmin') {
          console.log('[useCompanyAccess] Usuário é superadmin, concedendo acesso');
          setHasAccess(true);
          setCheckingAccess(false);
          return;
        }

        // Para os outros papéis, verificamos as associações de empresas
        // Se uma empresa específica é requerida, verificar se o usuário tem acesso a ela
        if (requiredCompanyId) {
          const companyIds = userCompanies.map(company => company.companyId);
          const hasCompanyAccess = companyIds.includes(requiredCompanyId);
          
          console.log('[useCompanyAccess] Acesso à empresa específica:', hasCompanyAccess);
          console.log('[useCompanyAccess] IDs das empresas do usuário:', companyIds);
          console.log('[useCompanyAccess] Empresa requisitada:', requiredCompanyId);
          
          setHasAccess(hasCompanyAccess);
        } else {
          // Caso não haja uma empresa específica requerida, verificar se tem alguma empresa associada
          // Este é o caso para páginas como "/empresas" que apenas exigem acesso a qualquer empresa
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
