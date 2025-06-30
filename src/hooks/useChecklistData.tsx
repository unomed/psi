import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChecklistTemplate, ChecklistResult, ScheduledAssessment } from "@/types";

export function useChecklistData() {
  const {
    data: checklists = [],
    isLoading: isChecklistsLoading,
    refetch: refetchChecklists
  } = useQuery({
    queryKey: ['checklists'],
    queryFn: async (): Promise<ChecklistTemplate[]> => {
      const { data, error } = await supabase
        .from('checklist_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(item => ({
        id: item.id,
        name: item.title || '',
        title: item.title || '',
        description: item.description || '',
        category: 'default' as const,
        type: item.type || 'custom',
        scale_type: item.scale_type === 'likert7' ? 'likert7' : (item.scale_type || 'likert5'),
        is_active: item.is_active ?? true,
        is_standard: item.is_standard ?? false,
        estimated_time_minutes: item.estimated_time_minutes || 15,
        version: parseInt(item.version?.toString() || '1'),
        created_at: item.created_at,
        updated_at: item.updated_at,
        company_id: item.company_id,
        created_by: item.created_by,
        cutoff_scores: item.cutoff_scores,
        derived_from_id: item.derived_from_id,
        instructions: item.instructions,
        interpretation_guide: item.interpretation_guide,
        max_score: item.max_score || 100
      }));
    }
  });

  const {
    data: results = [],
    isLoading: isResultsLoading,
    refetch: refetchResults
  } = useQuery({
    queryKey: ['checklist-results'],
    queryFn: async (): Promise<ChecklistResult[]> => {
      const { data, error } = await supabase
        .from('assessment_responses')
        .select(`
          *,
          employees!inner(name),
          checklist_templates!inner(title)
        `)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(item => ({
        id: item.id,
        template_id: item.template_id || '',
        employee_id: item.employee_id,
        templateId: item.template_id || '',
        employeeId: item.employee_id,
        employee_name: Array.isArray(item.employees) ? item.employees[0]?.name : item.employees?.name,
        employeeName: Array.isArray(item.employees) ? item.employees[0]?.name : item.employees?.name,
        templateName: Array.isArray(item.checklist_templates) 
          ? item.checklist_templates[0]?.title 
          : item.checklist_templates?.title,
        responses: item.response_data || {},
        results: item.response_data || {},
        score: item.raw_score || 0,
        completedAt: new Date(item.completed_at),
        createdBy: item.created_by || '',
        dominantFactor: item.dominant_factor || 'N/A',
        dominant_factor: item.dominant_factor || 'N/A'
      }));
    }
  });

  const {
    data: scheduledAssessments = [],
    isLoading: isScheduledLoading,
    refetch: refetchScheduled
  } = useQuery({
    queryKey: ['scheduled-assessments'],
    queryFn: async (): Promise<ScheduledAssessment[]> => {
      const { data, error } = await supabase
        .from('scheduled_assessments')
        .select(`
          *,
          employees(name, email, phone),
          checklist_templates(title)
        `)
        .order('scheduled_date', { ascending: false });

      if (error) throw error;

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
        company_id: item.company_id,
        employee_name: item.employee_name,
        employees: Array.isArray(item.employees) ? item.employees[0] : item.employees,
        checklist_templates: Array.isArray(item.checklist_templates) ? item.checklist_templates[0] : item.checklist_templates,
        checklist_template_id: item.template_id,
        employee_ids: [item.employee_id],
        created_at: item.created_at || new Date().toISOString()
      }));
    }
  });

  return {
    checklists,
    results,
    scheduledAssessments,
    isLoading: isChecklistsLoading || isResultsLoading || isScheduledLoading,
    refetchChecklists,
    refetchResults,
    refetchScheduled
  };
}
