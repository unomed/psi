
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PendingAssessment } from '@/types/employee-auth';

interface CompletedAssessment {
  assessmentId: string;
  templateTitle: string;
  completedAt: string;
  status: 'completed';
}

export function useEmployeeAssessments(employeeId: string) {
  const [pendingAssessments, setPendingAssessments] = useState<PendingAssessment[]>([]);
  const [assessments, setAssessments] = useState<CompletedAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (employeeId) {
      loadAssessments();
    }
  }, [employeeId]);

  const loadAssessments = async () => {
    setLoading(true);
    setIsLoading(true);
    
    try {
      // Load pending assessments
      const { data: pendingData, error: pendingError } = await supabase.rpc('get_employee_pending_assessments', {
        p_employee_id: employeeId
      });

      if (pendingError) throw pendingError;
      
      const pending: PendingAssessment[] = (pendingData || []).map((item: any) => ({
        assessmentId: item.assessment_id,
        templateTitle: item.template_title,
        templateDescription: item.template_description,
        scheduledDate: item.scheduled_date,
        linkUrl: item.link_url,
        daysRemaining: item.days_remaining
      }));

      setPendingAssessments(pending);

      // Load completed assessments
      const { data: completedData, error: completedError } = await supabase
        .from('assessment_responses')
        .select(`
          id,
          completed_at,
          checklist_templates!inner(title)
        `)
        .eq('employee_id', employeeId)
        .order('completed_at', { ascending: false });

      if (completedError) throw completedError;

      const completed: CompletedAssessment[] = (completedData || []).map((item: any) => ({
        assessmentId: item.id,
        templateTitle: item.checklist_templates?.title || 'Avaliação',
        completedAt: item.completed_at,
        status: 'completed' as const
      }));

      setAssessments(completed);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  return {
    pendingAssessments,
    assessments,
    loading,
    isLoading,
    refresh: loadAssessments
  };
}
