
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChecklistTemplate, ChecklistResult, ScheduledAssessment } from "@/types";

export function useChecklistData() {
  const { data: checklists = [], isLoading: checklistsLoading, refetch: refetchChecklists } = useQuery({
    queryKey: ['checklist-templates'],
    queryFn: async (): Promise<ChecklistTemplate[]> => {
      const { data, error } = await supabase
        .from('checklist_templates')
        .select(`
          *,
          questions(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching checklist templates:', error);
        throw error;
      }

      return data?.map(template => ({
        id: template.id,
        name: template.title,
        title: template.title,
        description: template.description || '',
        category: template.type || 'default',
        scale_type: template.scale_type,
        is_standard: template.is_standard || false,
        is_active: template.is_active,
        estimated_time_minutes: template.estimated_time_minutes || 15,
        version: template.version || 1,
        created_at: template.created_at,
        updated_at: template.updated_at,
        createdAt: new Date(template.created_at),
        company_id: template.company_id,
        created_by: template.created_by,
        cutoff_scores: typeof template.cutoff_scores === 'object' && template.cutoff_scores !== null 
          ? template.cutoff_scores as { high: number; medium: number; low: number; }
          : { high: 80, medium: 60, low: 40 },
        derived_from_id: template.derived_from_id,
        instructions: template.instructions,
        type: template.type,
        questions: template.questions?.map((q: any) => ({
          id: q.id,
          template_id: q.template_id,
          question_text: q.question_text,
          text: q.question_text,
          order_number: q.order_number,
          created_at: q.created_at,
          updated_at: q.updated_at
        })) || []
      })) || [];
    }
  });

  const { data: results = [], isLoading: resultsLoading } = useQuery({
    queryKey: ['assessment-results'],
    queryFn: async (): Promise<ChecklistResult[]> => {
      const { data, error } = await supabase
        .from('assessment_results')
        .select(`
          *,
          employees:employee_id (name),
          checklist_templates:template_id (title)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching assessment results:', error);
        throw error;
      }

      return data?.map(result => ({
        id: result.id,
        employee_id: result.employee_id,
        template_id: result.template_id,
        results: result.results,
        score: result.score || 0,
        risk_level: result.risk_level,
        created_at: result.created_at,
        updated_at: result.updated_at,
        employee_name: Array.isArray(result.employees) ? result.employees[0]?.name : result.employees?.name,
        template_title: Array.isArray(result.checklist_templates) ? result.checklist_templates[0]?.title : result.checklist_templates?.title
      })) || [];
    }
  });

  const { data: scheduledAssessments = [], isLoading: scheduledLoading, refetch: refetchScheduled } = useQuery({
    queryKey: ['scheduled-assessments'],
    queryFn: async (): Promise<ScheduledAssessment[]> => {
      const { data, error } = await supabase
        .from('scheduled_assessments')
        .select(`
          *,
          employees:employee_id (name, email),
          checklist_templates:template_id (title)
        `)
        .order('scheduled_date', { ascending: false });

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
        status: (item.status as "scheduled" | "sent" | "completed" | "pending") || "scheduled",
        sentAt: item.sent_at ? new Date(item.sent_at) : null,
        sent_at: item.sent_at,
        completedAt: item.completed_at ? new Date(item.completed_at) : null,
        completed_at: item.completed_at,
        linkUrl: item.link_url || '',
        link_url: item.link_url,
        company_id: item.company_id,
        employee_name: item.employee_name || (Array.isArray(item.employees) ? item.employees[0]?.name : item.employees?.name),
        employees: Array.isArray(item.employees) ? item.employees[0] : item.employees,
        checklist_templates: Array.isArray(item.checklist_templates) ? item.checklist_templates[0] : item.checklist_templates,
        checklist_template_id: item.template_id,
        employee_ids: [item.employee_id],
        created_at: item.created_at
      }));
    }
  });

  return {
    checklists,
    results,
    scheduledAssessments,
    isLoading: checklistsLoading || resultsLoading || scheduledLoading,
    refetchChecklists,
    refetchScheduled
  };
}
