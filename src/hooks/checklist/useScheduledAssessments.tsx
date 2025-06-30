
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScheduledAssessment, RecurrenceType } from "@/types";

export function useScheduledAssessments(companyId?: string) {
  const queryClient = useQueryClient();

  const { data: scheduledAssessments, isLoading, error } = useQuery({
    queryKey: ['scheduledAssessments', companyId],
    queryFn: async (): Promise<ScheduledAssessment[]> => {
      let query = supabase
        .from('scheduled_assessments')
        .select(`
          *,
          employees:employee_id (
            name,
            email,
            phone
          ),
          checklist_templates:template_id (
            title
          )
        `)
        .order('scheduled_date', { ascending: false });

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching scheduled assessments:', error);
        throw error;
      }

      return (data || []).map(item => ({
        id: item.id,
        employeeId: item.employee_id,
        employee_id: item.employee_id,
        templateId: item.template_id,
        template_id: item.template_id,
        scheduledDate: new Date(item.scheduled_date),
        scheduled_date: item.scheduled_date,
        status: item.status,
        sentAt: item.sent_at ? new Date(item.sent_at) : null,
        sent_at: item.sent_at,
        completedAt: item.completed_at ? new Date(item.completed_at) : null,
        completed_at: item.completed_at,
        linkUrl: item.link_url || '',
        link_url: item.link_url,
        recurrenceType: (item.recurrence_type as RecurrenceType) || 'none', // Fixed type casting
        company_id: item.company_id,
        employee_name: item.employee_name,
        employees: Array.isArray(item.employees) ? item.employees[0] : item.employees,
        checklist_templates: Array.isArray(item.checklist_templates) ? item.checklist_templates[0] : item.checklist_templates,
        checklist_template_id: item.template_id,
        employee_ids: [item.employee_id],
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
    }
  });

  const deleteAssessmentMutation = useMutation({
    mutationFn: async (assessmentId: string) => {
      const { error } = await supabase
        .from('scheduled_assessments')
        .delete()
        .eq('id', assessmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledAssessments'] });
      toast.success("Agendamento excluído com sucesso!");
    },
    onError: (error: any) => {
      console.error("Erro ao excluir agendamento:", error);
      toast.error("Erro ao excluir agendamento");
    }
  });

  return {
    scheduledAssessments: scheduledAssessments || [],
    isLoading,
    error,
    deleteAssessment: deleteAssessmentMutation.mutate,
    isDeleting: deleteAssessmentMutation.isPending
  };
}
