
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChecklistTemplate } from "@/types";

export function useChecklistTemplates() {
  const { data: checklists, isLoading, error, refetch } = useQuery({
    queryKey: ['checklistTemplates'],
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

      // Transform database response to match ChecklistTemplate interface
      return data?.map(template => ({
        id: template.id,
        name: template.title,
        title: template.title,
        description: template.description || '',
        category: template.type || 'custom',
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
        cutoff_scores: template.cutoff_scores,
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

  return {
    checklists: checklists || [],
    isLoading,
    error,
    refetch
  };
}
