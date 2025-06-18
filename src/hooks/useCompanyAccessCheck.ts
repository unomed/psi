
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useCompanyAccessCheck() {
  const { user, userRole, userCompanies } = useAuth();
  const [checkingAccess, setCheckingAccess] = useState(false);

  // Verificar se um usuário pode acessar uma empresa específica
  const verifyCompanyAccess = async (companyId: string): Promise<boolean> => {
    if (!user) {
      console.log('[useCompanyAccessCheck] Usuário não autenticado, acesso negado');
      return false;
    }
    
    setCheckingAccess(true);
    
    try {
      console.log('[useCompanyAccessCheck] Verificando acesso do usuário à empresa:', companyId);
      console.log('[useCompanyAccessCheck] Perfil do usuário:', userRole);
      console.log('[useCompanyAccessCheck] Empresas do usuário:', userCompanies);
      
      // Superadmin tem acesso a todas as empresas
      if (userRole === 'superadmin') {
        console.log('[useCompanyAccessCheck] Usuário é superadmin, acesso concedido');
        setCheckingAccess(false);
        return true;
      }
      
      // Para outros perfis, verificar as empresas associadas ao usuário
      const companyIds = userCompanies.map(company => company.companyId);
      const hasAccess = companyIds.includes(companyId);
      
      console.log('[useCompanyAccessCheck] Empresas associadas ao usuário:', companyIds);
      console.log('[useCompanyAccessCheck] Usuário tem acesso à empresa?', hasAccess);
      
      setCheckingAccess(false);
      return hasAccess;
    } catch (error) {
      console.error('[useCompanyAccessCheck] Erro ao verificar acesso:', error);
      toast.error('Erro ao verificar permissões de acesso');
      setCheckingAccess(false);
      return false;
    }
  };

  // Filtrar recursos baseado no acesso à empresa - com filtragem estrita
  const filterResourcesByCompany = <T extends { company_id?: string }>(
    resources: T[]
  ): T[] => {
    if (!user) {
      console.log('[useCompanyAccessCheck] Usuário não autenticado, retornando lista vazia');
      return [];
    }
    
    // APENAS superadmin deve ter acesso a todos os recursos
    if (userRole === 'superadmin') {
      console.log('[useCompanyAccessCheck] Usuário é superadmin, retornando todos os recursos');
      return resources;
    }
    
    // Para outros perfis, filtrar SEMPRE pelos IDs de empresas do usuário
    const userCompanyIds = userCompanies.map(company => company.companyId);
    
    if (userCompanyIds.length === 0) {
      console.log('[useCompanyAccessCheck] Usuário não tem empresas associadas, retornando lista vazia');
      return [];
    }
    
    console.log('[useCompanyAccessCheck] Filtrando recursos por empresa');
    console.log('[useCompanyAccessCheck] Perfil do usuário:', userRole);
    console.log('[useCompanyAccessCheck] Empresas do usuário:', userCompanyIds);
    
    const filteredResources = resources.filter(resource => {
      // Se recurso sem company_id, verificar se devemos filtrar ou não
      if (!resource.company_id) {
        // Recursos sem company_id só devem ser visíveis para superadmin
        return false; // Mudança aqui: não permitir acesso se não for superadmin
      }
      
      // Para todos os outros recursos, verificar se o usuário tem acesso à empresa
      const hasAccess = userCompanyIds.includes(resource.company_id);
      
      if (!hasAccess) {
        console.log('[useCompanyAccessCheck] Recurso filtrado - sem acesso:', resource);
      }
      
      return hasAccess;
    });
    
    console.log('[useCompanyAccessCheck] Recursos filtrados:', filteredResources.length, 'de', resources.length);
    return filteredResources;
  };

  // Verificar se o usuário tem pelo menos uma empresa associada
  const hasAnyCompanyAccess = (): boolean => {
    if (!user) return false;
    
    // Superadmin tem acesso a todas as empresas
    if (userRole === 'superadmin') return true;
    
    // Para outros perfis, verificar se tem pelo menos uma empresa associada
    return userCompanies.length > 0;
  };

  // Obter a primeira empresa acessível pelo usuário
  const getFirstAccessibleCompany = (): string | null => {
    if (!user) return null;
    
    // Se for superadmin e não tiver empresas, buscar todas as empresas
    if (userRole === 'superadmin' && userCompanies.length === 0) {
      // Aqui você pode implementar uma busca de todas as empresas
      return null;
    }
    
    // Para outros casos, retornar a primeira empresa do usuário
    return userCompanies.length > 0 ? userCompanies[0].companyId : null;
  };

  return {
    verifyCompanyAccess,
    filterResourcesByCompany,
    hasAnyCompanyAccess,
    getFirstAccessibleCompany,
    checkingAccess
  };
}
