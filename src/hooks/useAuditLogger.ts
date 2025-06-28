
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type AuditActionType = 
  | "create" 
  | "read" 
  | "update" 
  | "delete" 
  | "login" 
  | "logout" 
  | "export" 
  | "import" 
  | "email_send" 
  | "permission_change" 
  | "assessment_complete"
  | "report_generate";

type AuditModule = 
  | "authentication" 
  | "users" 
  | "companies" 
  | "employees" 
  | "assessments" 
  | "checklists" 
  | "reports" 
  | "settings" 
  | "billing";

interface AuditLogData {
  action: AuditActionType;
  module: AuditModule;
  resourceType?: string;
  resourceId?: string;
  description: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  companyId?: string;
  metadata?: Record<string, any>;
}

export function useAuditLogger() {
  const { user } = useAuth();

  const logAudit = useMutation({
    mutationFn: async (data: AuditLogData) => {
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          action_type: data.action,
          module: data.module,
          resource_type: data.resourceType,
          resource_id: data.resourceId,
          description: data.description,
          old_values: data.oldValues,
          new_values: data.newValues,
          company_id: data.companyId,
          metadata: data.metadata || {},
          user_id: user?.id
        });

      if (error) throw error;
    }
  });

  return {
    logAudit: logAudit.mutate,
    isLogging: logAudit.isPending
  };
}
