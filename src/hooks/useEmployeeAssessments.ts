
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PendingAssessment {
  id: string;
  templateTitle: string;
  dueDate: string;
  status: string;
}

export function useEmployeeAssessments(employeeId: string) {
  const [assessments, setAssessments] = useState<PendingAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!employeeId) {
      setLoading(false);
      return;
    }

    const loadAssessments = async () => {
      try {
        console.log(`[useEmployeeAssessments] Carregando avaliações para funcionário: ${employeeId}`);
        
        const { data, error } = await supabase
          .from('scheduled_assessments')
          .select(`
            id,
            template_id,
            scheduled_date,
            status,
            checklist_templates!inner(title)
          `)
          .eq('employee_id', employeeId)
          .eq('status', 'pending')
          .order('scheduled_date', { ascending: true });

        if (error) {
          console.error('[useEmployeeAssessments] Erro ao carregar avaliações:', error);
          throw error;
        }

        const formattedAssessments = (data || []).map(assessment => ({
          id: assessment.id,
          templateTitle: assessment.checklist_templates?.title || 'Avaliação',
          dueDate: assessment.scheduled_date,
          status: assessment.status
        }));

        setAssessments(formattedAssessments);
        console.log(`[useEmployeeAssessments] ${formattedAssessments.length} avaliações carregadas`);
      } catch (error: any) {
        console.error('Erro ao carregar avaliações pendentes:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadAssessments();
  }, [employeeId]);

  return { assessments, loading, error };
}
