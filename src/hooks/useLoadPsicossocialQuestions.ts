
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PsicossocialQuestion } from '@/types/checklist';
import { toast } from 'sonner';

interface UseLoadPsicossocialQuestionsReturn {
  questions: PsicossocialQuestion[];
  isLoading: boolean;
  error: string | null;
  loadQuestions: () => Promise<void>;
  clearQuestions: () => void;
}

export function useLoadPsicossocialQuestions(): UseLoadPsicossocialQuestionsReturn {
  const [questions, setQuestions] = useState<PsicossocialQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Carregando perguntas psicossociais do banco...");

      // Buscar template MTE
      const { data: template, error: templateError } = await supabase
        .from('checklist_templates')
        .select('id, title')
        .eq('title', 'Avaliação Psicossocial - MTE Completa')
        .eq('type', 'psicossocial')
        .eq('is_standard', true)
        .single();

      if (templateError || !template) {
        throw new Error('Template MTE não encontrado no banco de dados');
      }

      // Buscar perguntas do template
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('template_id', template.id)
        .order('order_number');

      if (questionsError) {
        throw new Error('Erro ao buscar perguntas: ' + questionsError.message);
      }

      if (!questionsData || questionsData.length === 0) {
        throw new Error('Nenhuma pergunta encontrada para o template MTE');
      }

      // Mapear perguntas para formato da aplicação
      const mappedQuestions: PsicossocialQuestion[] = questionsData.map(q => ({
        id: q.id,
        text: q.question_text,
        category: q.target_factor || 'geral',
        weight: q.weight || 1
      }));

      setQuestions(mappedQuestions);
      
      console.log(`${mappedQuestions.length} perguntas carregadas com sucesso`);
      toast.success(`${mappedQuestions.length} perguntas psicossociais MTE carregadas!`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro ao carregar perguntas:', errorMessage);
      setError(errorMessage);
      toast.error('Erro ao carregar perguntas: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearQuestions = () => {
    setQuestions([]);
    setError(null);
  };

  return {
    questions,
    isLoading,
    error,
    loadQuestions,
    clearQuestions
  };
}
