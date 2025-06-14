
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PendingAssessment } from '@/types/employee-auth';

export function useEmployeeAssessments(employeeId: string) {
  const [pendingAssessments, setPendingAssessments] = useState<PendingAssessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (employeeId) {
      loadPendingAssessments();
    }
  }, [employeeId]);

  const loadPendingAssessments = async () => {
    try {
      const { data, error } = await supabase.rpc('get_employee_pending_assessments', {
        p_employee_id: employeeId
      });

      if (error) throw error;
      
      const assessments: PendingAssessment[] = (data || []).map((item: any) => ({
        assessmentId: item.assessment_id,
        templateTitle: item.template_title,
        templateDescription: item.template_description,
        scheduledDate: item.scheduled_date,
        linkUrl: item.link_url,
        daysRemaining: item.days_remaining
      }));

      setPendingAssessments(assessments);
    } catch (error) {
      console.error('Erro ao carregar avaliações pendentes:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    pendingAssessments,
    loading,
    refresh: loadPendingAssessments
  };
}
