
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
      console.log('[useEmployeeAssessments] ID do funcionário não fornecido');
      setLoading(false);
      return;
    }

    const loadAssessments = async () => {
      try {
        console.log(`[useEmployeeAssessments] Carregando avaliações para funcionário: ${employeeId}`);
        
        // Buscar todas as avaliações agendadas ou enviadas para o funcionário
        const { data, error } = await supabase
          .from('scheduled_assessments')
          .select(`
            id,
            template_id,
            due_date,
            scheduled_date,
            status,
            checklist_templates(title)
          `)
          .eq('employee_id', employeeId)
          .in('status', ['pending', 'scheduled', 'sent']) // Buscar avaliações pendentes, agendadas ou enviadas
          .order('due_date', { ascending: true });
          
        console.log('[useEmployeeAssessments] Query executada:', {
          tabela: 'scheduled_assessments',
          filtro: `employee_id = ${employeeId}`,
          status: ['pending', 'scheduled', 'sent']
        });
        console.log('[useEmployeeAssessments] Dados brutos:', data);

        if (error) {
          console.error('[useEmployeeAssessments] Erro ao carregar avaliações:', error);
          throw error;
        }

        const formattedAssessments = (data || []).map(assessment => ({
          id: assessment.id,
          templateTitle: assessment.checklist_templates?.title || 'Avaliação',
          dueDate: assessment.due_date,
          status: assessment.status
        }));

        setAssessments(formattedAssessments);
        console.log(`[useEmployeeAssessments] ${formattedAssessments.length} avaliações carregadas`);
      } catch (error) {
        console.error('Erro ao carregar avaliações pendentes:', error);
        setError(error instanceof Error ? error.message : 'Erro desconhecido ao carregar avaliações');
      } finally {
        setLoading(false);
      }
    };

    loadAssessments();
  }, [employeeId]);

  return { assessments, loading, error };
}
