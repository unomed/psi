
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PsicossocialQuestion } from '@/types/checklist';
import { toast } from 'sonner';
import { loadPsicossocialQuestionsFromDatabase } from '@/services/checklist/templateUtils';

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

      const loadedQuestions = await loadPsicossocialQuestionsFromDatabase();
      
      setQuestions(loadedQuestions);
      
      console.log(`${loadedQuestions.length} perguntas carregadas com sucesso`);
      toast.success(`${loadedQuestions.length} perguntas psicossociais MTE carregadas!`);

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
