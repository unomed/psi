
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useCompanyAccess(requiredCompanyId?: string) {
  const { user, userRole, userCompanies } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    const checkCompanyAccess = async () => {
      console.log('[useCompanyAccess] Checking access for company:', requiredCompanyId);
      console.log('[useCompanyAccess] User role:', userRole);
      console.log('[useCompanyAccess] User companies:', userCompanies);
      
      if (!user || !requiredCompanyId) {
        console.log('[useCompanyAccess] No user or company ID, setting access to false');
        setHasAccess(false);
        setCheckingAccess(false);
        return;
      }

      try {
        // Superadmin sempre tem acesso a todas as empresas
        if (userRole === 'superadmin') {
          console.log('[useCompanyAccess] User is superadmin, granting access');
          setHasAccess(true);
          setCheckingAccess(false);
          return;
        }

        // Verificar se o usuário tem acesso com base nas empresas carregadas do contexto de autenticação
        // Esta verificação agora é a principal e deve refletir exatamente o que foi configurado na interface
        if (userCompanies && userCompanies.length > 0) {
          const hasCompanyAccess = userCompanies.some(
            company => company.companyId === requiredCompanyId
          );
          
          console.log('[useCompanyAccess] Company access based on assigned companies:', hasCompanyAccess);
          console.log('[useCompanyAccess] User companies:', userCompanies.map(c => c.companyName).join(', '));
          console.log('[useCompanyAccess] Required company:', requiredCompanyId);
          
          setHasAccess(hasCompanyAccess);
          setCheckingAccess(false);
          return;
        }
        
        // Se não houver empresas associadas, não tem acesso
        console.log('[useCompanyAccess] No companies associated with user, denying access');
        setHasAccess(false);
        setCheckingAccess(false);
      } catch (error) {
        console.error('[useCompanyAccess] Error checking company access:', error);
        setHasAccess(false);
        setCheckingAccess(false);
      }
    };

    checkCompanyAccess();
  }, [user, userRole, requiredCompanyId, userCompanies]);

  return { hasAccess, checkingAccess };
}
