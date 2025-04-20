
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

  // Filter resources based on company access
  const filterResourcesByCompany = <T extends { company_id?: string }>(
    resources: T[]
  ): T[] => {
    if (!user) return [];
    
    // Superadmin has access to all resources
    if (userRole === 'superadmin') {
      return resources;
    }
    
    // For other roles, filter resources by company
    const userCompanyIds = userCompanies.map(company => company.companyId);
    
    console.log('[useCompanyAccessCheck] Filtrando recursos por empresa');
    console.log('[useCompanyAccessCheck] Empresas do usuário:', userCompanyIds);
    
    return resources.filter(resource => {
      // Skip items without company_id (system-wide resources)
      if (!resource.company_id) return true;
      
      const hasAccess = userCompanyIds.includes(resource.company_id);
      
      if (!hasAccess) {
        console.log('[useCompanyAccessCheck] Recurso filtrado - sem acesso:', resource);
      }
      
      return hasAccess;
    });
  };

  return {
    verifyCompanyAccess,
    filterResourcesByCompany,
    checkingAccess
  };
}
