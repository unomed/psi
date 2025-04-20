
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useCompanyAccess(requiredCompanyId?: string) {
  const { user, userRole, userCompanies } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    const checkCompanyAccess = async () => {
      console.log('[useCompanyAccess] Verificando acesso para empresa:', requiredCompanyId);
      console.log('[useCompanyAccess] Perfil do usuário:', userRole);
      console.log('[useCompanyAccess] Empresas do usuário:', userCompanies);
      
      if (!user || !requiredCompanyId) {
        console.log('[useCompanyAccess] Sem usuário ou ID de empresa, acesso negado');
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

        // Verificação EXCLUSIVAMENTE baseada nas empresas associadas no gerenciamento de usuários
        if (userCompanies && userCompanies.length > 0) {
          const hasCompanyAccess = userCompanies.some(
            company => company.companyId === requiredCompanyId
          );
          
          console.log('[useCompanyAccess] Acesso baseado nas empresas associadas:', hasCompanyAccess);
          console.log('[useCompanyAccess] Empresas do usuário:', userCompanies.map(c => c.companyName).join(', '));
          console.log('[useCompanyAccess] Empresa requisitada:', requiredCompanyId);
          
          setHasAccess(hasCompanyAccess);
          setCheckingAccess(false);
          return;
        }
        
        // Se não houver empresas associadas, não tem acesso
        console.log('[useCompanyAccess] Nenhuma empresa associada ao usuário, acesso negado');
        setHasAccess(false);
        setCheckingAccess(false);
      } catch (error) {
        console.error('[useCompanyAccess] Erro verificando acesso à empresa:', error);
        setHasAccess(false);
        setCheckingAccess(false);
      }
    };

    checkCompanyAccess();
  }, [user, userRole, requiredCompanyId, userCompanies]);

  return { hasAccess, checkingAccess };
}
