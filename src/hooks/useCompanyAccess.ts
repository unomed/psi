
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useCompanyAccess(requiredCompanyAccess?: string) {
  const { user, userRole, userCompanies } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkCompanyAccess = async () => {
      console.log('[useCompanyAccess] Verificando acesso para empresa:', requiredCompanyAccess);
      console.log('[useCompanyAccess] Perfil do usuário:', userRole);
      console.log('[useCompanyAccess] Empresas do usuário:', userCompanies);
      
      if (!user) {
        console.log('[useCompanyAccess] Usuário não autenticado, acesso negado');
        setHasAccess(false);
        setCheckingAccess(false);
        setErrorMessage('Usuário não autenticado');
        return;
      }

      try {
        // APENAS Superadmin tem acesso a todas as empresas
        if (userRole === 'superadmin') {
          console.log('[useCompanyAccess] Usuário é superadmin, concedendo acesso');
          setHasAccess(true);
          setCheckingAccess(false);
          setErrorMessage(null);
          return;
        }

        // Para perfis admin e evaluator, verificar se tem pelo menos uma empresa associada
        // Se requiredCompanyAccess é especificado como string (ex: "employees", "sectors"),
        // isso significa que precisamos verificar se o usuário tem acesso a QUALQUER empresa
        if (requiredCompanyAccess) {
          const hasAnyCompany = userCompanies.length > 0;
          console.log('[useCompanyAccess] Usuário tem acesso a alguma empresa:', hasAnyCompany);
          setHasAccess(hasAnyCompany);
          
          if (!hasAnyCompany) {
            setErrorMessage('Usuário não tem acesso a nenhuma empresa');
          } else {
            setErrorMessage(null);
          }
        } else {
          // Se nenhuma empresa específica é requerida, verificar se o usuário tem alguma associação
          const hasAnyCompany = userCompanies.length > 0;
          console.log('[useCompanyAccess] Usuário tem acesso a alguma empresa:', hasAnyCompany);
          setHasAccess(hasAnyCompany);
          
          if (!hasAnyCompany) {
            setErrorMessage('Usuário não tem acesso a nenhuma empresa');
          } else {
            setErrorMessage(null);
          }
        }
        
        setCheckingAccess(false);
      } catch (error) {
        console.error('[useCompanyAccess] Erro verificando acesso à empresa:', error);
        setErrorMessage('Erro ao verificar acesso à empresa');
        setHasAccess(false);
        setCheckingAccess(false);
      }
    };

    checkCompanyAccess();
  }, [user, userRole, requiredCompanyAccess, userCompanies]);

  return { hasAccess, checkingAccess, errorMessage };
}
