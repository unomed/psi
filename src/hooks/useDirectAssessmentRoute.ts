
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DirectAssessmentData {
  templateId: string;
  templateTitle: string;
  employeeId?: string;
  token?: string;
  isValid: boolean;
}

export function useDirectAssessmentRoute() {
  const { assessmentName } = useParams();
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState<DirectAssessmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (assessmentName) {
      loadAssessmentByName(assessmentName);
    } else {
      setLoading(false);
    }
  }, [assessmentName]);

  const loadAssessmentByName = async (name: string) => {
    try {
      // Buscar template pelo nome/slug
      const { data: template, error } = await supabase
        .from('checklist_templates')
        .select('id, title')
        .ilike('title', `%${name.replace('-', ' ')}%`)
        .eq('is_active', true)
        .single();

      if (error || !template) {
        console.error('Template não encontrado:', error);
        toast.error('Avaliação não encontrada');
        navigate('/employee-portal');
        return;
      }

      setAssessmentData({
        templateId: template.id,
        templateTitle: template.title,
        isValid: true
      });

    } catch (error) {
      console.error('Erro ao carregar avaliação:', error);
      toast.error('Erro ao carregar avaliação');
      navigate('/employee-portal');
    } finally {
      setLoading(false);
    }
  };

  return {
    assessmentData,
    loading
  };
}
