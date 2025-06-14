
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useCompanyAccess(requiredCompanyAccess?: string) {
  const { user, userRole, userCompanies } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Proteção contra múltiplas execuções
  const checkingRef = useRef(false);

  useEffect(() => {
    // Evitar múltiplas verificações simultâneas
    if (checkingRef.current) {
      return;
    }
    
    const checkCompanyAccess = async () => {
      if (checkingRef.current) {
        return;
      }
      
      checkingRef.current = true;
      
      try {
        console.log('[useCompanyAccess] Verificando acesso:', {
          requiredCompanyAccess,
          userRole,
          hasUser: !!user,
          companiesCount: userCompanies?.length || 0
        });
        
        // Se não há requisito de empresa, não verificar
        if (!requiredCompanyAccess) {
          setHasAccess(true);
          setCheckingAccess(false);
          setErrorMessage(null);
          return;
        }
        
        // Se não há usuário, negar acesso
        if (!user) {
          console.log('[useCompanyAccess] Usuário não autenticado');
          setHasAccess(false);
          setCheckingAccess(false);
          setErrorMessage('Usuário não autenticado');
          return;
        }

        // Superadmin sempre tem acesso
        if (userRole === 'superadmin') {
          console.log('[useCompanyAccess] Usuário é superadmin, concedendo acesso');
          setHasAccess(true);
          setCheckingAccess(false);
          setErrorMessage(null);
          return;
        }

        // Para outros perfis, verificar se tem pelo menos uma empresa associada
        // quando requiredCompanyAccess é "any"
        if (requiredCompanyAccess === "any") {
          const hasAnyCompany = userCompanies && userCompanies.length > 0;
          console.log('[useCompanyAccess] Verificando acesso a qualquer empresa:', hasAnyCompany);
          
          setHasAccess(hasAnyCompany);
          
          if (!hasAnyCompany) {
            setErrorMessage('Usuário não tem acesso a nenhuma empresa');
          } else {
            setErrorMessage(null);
          }
        } else {
          // Para verificações específicas de empresa (não implementado ainda)
          console.log('[useCompanyAccess] Verificação específica de empresa não implementada');
          setHasAccess(false);
          setErrorMessage('Verificação específica de empresa não implementada');
        }
        
        setCheckingAccess(false);
      } catch (error) {
        console.error('[useCompanyAccess] Erro verificando acesso à empresa:', error);
        setErrorMessage('Erro ao verificar acesso à empresa');
        setHasAccess(false);
        setCheckingAccess(false);
      } finally {
        checkingRef.current = false;
      }
    };

    checkCompanyAccess();
  }, [user, userRole, requiredCompanyAccess, userCompanies]);

  return { hasAccess, checkingAccess, errorMessage };
}
