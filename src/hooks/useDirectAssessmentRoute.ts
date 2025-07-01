
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
      console.log('[useDirectAssessmentRoute] Carregando avaliação por nome:', name);
      
      // Buscar template pelo nome/slug
      const { data: template, error } = await supabase
        .from('checklist_templates')
        .select('id, title')
        .ilike('title', `%${name.replace('-', ' ')}%`)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('[useDirectAssessmentRoute] Erro na busca:', error);
        toast.error('Erro ao buscar avaliação');
        navigate('/employee-portal');
        return;
      }

      if (!template) {
        console.log('[useDirectAssessmentRoute] Template não encontrado para:', name);
        toast.error('Avaliação não encontrada');
        navigate('/employee-portal');
        return;
      }

      console.log('[useDirectAssessmentRoute] Template encontrado:', template);

      setAssessmentData({
        templateId: template.id,
        templateTitle: template.title,
        isValid: true
      });

    } catch (error) {
      console.error('[useDirectAssessmentRoute] Erro ao carregar avaliação:', error);
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
