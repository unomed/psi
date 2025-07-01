
import { supabase } from '@/integrations/supabase/client';
import { useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export type AuditAction = 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout' | 'export' | 'import' | 'email_send' | 'permission_change' | 'assessment_complete' | 'report_generate';

export type AuditModule = 'auth' | 'companies' | 'employees' | 'roles' | 'sectors' | 'assessments' | 'reports' | 'billing' | 'settings' | 'risks';

interface AuditLogData {
  action: AuditAction;
  module: AuditModule;
  resourceType?: string;
  resourceId?: string;
  description: string;
  oldValues?: any;
  newValues?: any;
  companyId?: string;
  metadata?: any;
}

// Hook seguro que não quebra se usado fora do AuthProvider
export function useAuditLogger() {
  // SEMPRE usar os hooks - nunca condicionalmente
  const authContext = useAuth();
  
  // Extrair valores de forma segura usando useMemo
  const { user, userCompanies } = useMemo(() => {
    // Se o contexto não estiver disponível, usar valores nulos
    if (!authContext) {
      return { user: null, userCompanies: [] };
    }
    return {
      user: authContext.user,
      userCompanies: authContext.userCompanies || []
    };
  }, [authContext]);

  const logAction = useCallback(async (data: AuditLogData) => {
    // Se não há usuário, não registrar log
    if (!user) {
      console.log('[useAuditLogger] Sem usuário autenticado, pulando log de auditoria');
      return;
    }

    try {
      // Capturar IP e User Agent
      const userAgent = navigator.userAgent;
      
      // Determinar company_id se não fornecido
      let companyId = data.companyId;
      if (!companyId && userCompanies.length === 1) {
        companyId = userCompanies[0].companyId;
      }

      await supabase.rpc('create_audit_log', {
        p_action_type: data.action,
        p_module: data.module,
        p_resource_type: data.resourceType,
        p_resource_id: data.resourceId,
        p_description: data.description,
        p_old_values: data.oldValues ? JSON.stringify(data.oldValues) : null,
        p_new_values: data.newValues ? JSON.stringify(data.newValues) : null,
        p_company_id: companyId,
        p_metadata: {
          user_agent: userAgent,
          timestamp: new Date().toISOString(),
          ...data.metadata
        }
      });
    } catch (error) {
      console.error('Erro ao registrar log de auditoria:', error);
    }
  }, [user, userCompanies]);

  const logLogin = useCallback((method: string = 'email') => {
    logAction({
      action: 'login',
      module: 'auth',
      description: `Usuário fez login via ${method}`,
      metadata: { login_method: method }
    });
  }, [logAction]);

  const logLogout = useCallback(() => {
    logAction({
      action: 'logout',
      module: 'auth',
      description: 'Usuário fez logout'
    });
  }, [logAction]);

  const logCreate = useCallback((module: AuditModule, resourceType: string, resourceId: string, data: any, companyId?: string) => {
    logAction({
      action: 'create',
      module,
      resourceType,
      resourceId,
      description: `Criado ${resourceType} ${resourceId}`,
      newValues: data,
      companyId
    });
  }, [logAction]);

  const logUpdate = useCallback((module: AuditModule, resourceType: string, resourceId: string, oldData: any, newData: any, companyId?: string) => {
    logAction({
      action: 'update',
      module,
      resourceType,
      resourceId,
      description: `Atualizado ${resourceType} ${resourceId}`,
      oldValues: oldData,
      newValues: newData,
      companyId
    });
  }, [logAction]);

  const logDelete = useCallback((module: AuditModule, resourceType: string, resourceId: string, data: any, companyId?: string) => {
    logAction({
      action: 'delete',
      module,
      resourceType,
      resourceId,
      description: `Excluído ${resourceType} ${resourceId}`,
      oldValues: data,
      companyId
    });
  }, [logAction]);

  const logView = useCallback((module: AuditModule, resourceType: string, resourceId?: string, companyId?: string) => {
    logAction({
      action: 'read',
      module,
      resourceType,
      resourceId,
      description: `Visualizou ${resourceType}${resourceId ? ` ${resourceId}` : ''}`,
      companyId
    });
  }, [logAction]);

  const logExport = useCallback((module: AuditModule, exportType: string, filters?: any, companyId?: string) => {
    logAction({
      action: 'export',
      module,
      resourceType: exportType,
      description: `Exportou dados de ${exportType}`,
      metadata: { filters },
      companyId
    });
  }, [logAction]);

  return {
    logAction,
    logLogin,
    logLogout,
    logCreate,
    logUpdate,
    logDelete,
    logView,
    logExport
  };
}
