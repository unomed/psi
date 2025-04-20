
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useCompanyAccessCheck() {
  const { user, userRole, userCompanies } = useAuth();
  const [checkingAccess, setCheckingAccess] = useState(false);

  // Verify if a user can access a specific company
  const verifyCompanyAccess = async (companyId: string): Promise<boolean> => {
    if (!user) return false;
    
    setCheckingAccess(true);
    
    try {
      console.log('[useCompanyAccessCheck] Verificando acesso do usuário à empresa:', companyId);
      console.log('[useCompanyAccessCheck] Perfil do usuário:', userRole);
      console.log('[useCompanyAccessCheck] Empresas do usuário:', userCompanies);
      
      // Superadmin has access to all companies
      if (userRole === 'superadmin') {
        console.log('[useCompanyAccessCheck] Usuário é superadmin, acesso concedido');
        setCheckingAccess(false);
        return true;
      }
      
      // For other roles, check user_companies table
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

  // Filter resources based on company access - FORÇAR FILTRAGEM ESTRITA
  const filterResourcesByCompany = <T extends { company_id?: string }>(
    resources: T[]
  ): T[] => {
    if (!user) return [];
    
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
        return userRole === 'superadmin';
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

  return {
    verifyCompanyAccess,
    filterResourcesByCompany,
    checkingAccess
  };
}
