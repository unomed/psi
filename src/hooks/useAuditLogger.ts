
import { useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type AuditAction = 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout' | 'export' | 'import';
type AuditModule = 'auth' | 'companies' | 'employees' | 'assessments' | 'reports' | 'settings' | 'templates';

interface AuditLogEntry {
  action_type: AuditAction;
  module: AuditModule;
  resource_type?: string;
  resource_id?: string;
  description: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  metadata?: Record<string, any>;
}

export function useAuditLogger() {
  const { user, userRole, userCompanies } = useAuth();

  const getUserIp = useMemo(() => {
    // In a real application, you'd get this from a service
    return '127.0.0.1'; // Placeholder
  }, []);

  const logAction = useCallback(async (entry: AuditLogEntry) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action_type: entry.action_type,
          module: entry.module,
          resource_type: entry.resource_type,
          resource_id: entry.resource_id,
          description: entry.description,
          old_values: entry.old_values,
          new_values: entry.new_values,
          metadata: {
            ...entry.metadata,
            user_role: userRole,
            user_companies: userCompanies,
            user_agent: navigator.userAgent,
          },
          ip_address: getUserIp,
          company_id: userCompanies[0]?.companyId || null,
        });

      if (error) {
        console.error('Failed to log audit entry:', error);
      }
    } catch (error) {
      console.error('Error logging audit entry:', error);
    }
  }, [user, userRole, userCompanies, getUserIp]);

  const logLogin = useCallback((metadata?: Record<string, any>) => {
    return logAction({
      action_type: 'login',
      module: 'auth',
      description: 'User logged in',
      metadata,
    });
  }, [logAction]);

  const logLogout = useCallback((metadata?: Record<string, any>) => {
    return logAction({
      action_type: 'logout',
      module: 'auth',
      description: 'User logged out',
      metadata,
    });
  }, [logAction]);

  const logCreate = useCallback((module: AuditModule, resourceType: string, resourceId: string, newValues: Record<string, any>, metadata?: Record<string, any>) => {
    return logAction({
      action_type: 'create',
      module,
      resource_type: resourceType,
      resource_id: resourceId,
      description: `Created ${resourceType}`,
      new_values: newValues,
      metadata,
    });
  }, [logAction]);

  const logUpdate = useCallback((module: AuditModule, resourceType: string, resourceId: string, oldValues: Record<string, any>, newValues: Record<string, any>, metadata?: Record<string, any>) => {
    return logAction({
      action_type: 'update',
      module,
      resource_type: resourceType,
      resource_id: resourceId,
      description: `Updated ${resourceType}`,
      old_values: oldValues,
      new_values: newValues,
      metadata,
    });
  }, [logAction]);

  const logDelete = useCallback((module: AuditModule, resourceType: string, resourceId: string, oldValues: Record<string, any>, metadata?: Record<string, any>) => {
    return logAction({
      action_type: 'delete',
      module,
      resource_type: resourceType,
      resource_id: resourceId,
      description: `Deleted ${resourceType}`,
      old_values: oldValues,
      metadata,
    });
  }, [logAction]);

  const logView = useCallback((module: AuditModule, resourceType: string, resourceId?: string, metadata?: Record<string, any>) => {
    return logAction({
      action_type: 'view',
      module,
      resource_type: resourceType,
      resource_id: resourceId,
      description: `Viewed ${resourceType}`,
      metadata,
    });
  }, [logAction]);

  const logExport = useCallback((module: AuditModule, resourceType: string, metadata?: Record<string, any>) => {
    return logAction({
      action_type: 'export',
      module,
      resource_type: resourceType,
      description: `Exported ${resourceType}`,
      metadata,
    });
  }, [logAction]);

  const logImport = useCallback((module: AuditModule, resourceType: string, metadata?: Record<string, any>) => {
    return logAction({
      action_type: 'import',
      module,
      resource_type: resourceType,
      description: `Imported ${resourceType}`,
      metadata,
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
    logExport,
    logImport,
  };
}
