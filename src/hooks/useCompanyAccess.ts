
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
        if (userCompanies && userCompanies.length > 0) {
          const hasCompanyAccess = userCompanies.some(
            company => company.companyId === requiredCompanyId
          );
          
          console.log('[useCompanyAccess] Company access based on context:', hasCompanyAccess);
          setHasAccess(hasCompanyAccess);
          setCheckingAccess(false);
          return;
        }

        // Se não encontrar nas empresas do contexto, fazer verificação direta no banco
        console.log('[useCompanyAccess] Falling back to database check');
        const { data: userCompanyData, error } = await supabase
          .from('user_companies')
          .select('company_id')
          .eq('user_id', user.id);

        if (error) {
          console.error('[useCompanyAccess] Error checking company access:', error);
          setHasAccess(false);
        } else {
          const hasCompanyAccess = userCompanyData?.some(uc => uc.company_id === requiredCompanyId) || false;
          console.log('[useCompanyAccess] Company access based on DB check:', hasCompanyAccess);
          setHasAccess(hasCompanyAccess);
        }
      } catch (error) {
        console.error('[useCompanyAccess] Error checking company access:', error);
        setHasAccess(false);
      } finally {
        setCheckingAccess(false);
      }
    };

    checkCompanyAccess();
  }, [user, userRole, requiredCompanyId, userCompanies]);

  return { hasAccess, checkingAccess };
}
